/**
 *  Module: order
 *  Author: Ljp
 *  Create Time:2015-5-27
 *  Modified by:jintl
 *  Last Modify Time: 2015-6-17
 *******************************
 * 订单详情页面信息处理
 * */
var hnctOrderDetail = {

    createNew: function () {
        var orderDetailPage = {};
        var poHeaderId = $.query.get("poHeaderId");
        if (poHeaderId == "" ) {
            sinoMobileUI.alert("参数错误，操作不能继续！");
            return null;
        }
		//选准条目
		var selectedItemObj=null;
		var selectedPoLineId="";

		//订单状态
		var orderStatus="";
		var needOnlinePay="";
		var logisticsRecs=null;
        var ajaxJsonProp={
            //servlet访问接口
            servlet:'',
            //操作参数 act
            act:'',
            //提交服务器参数
            parmData:'',
            //执行成功后的回调函数
            successCallbackFunc:null
        }
        //从后台调用数据的总入口
        orderDetailPage.loadDataFromServer=function(){
            var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
            sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,orderDetailPage.loadError);
        };
        orderDetailPage.loadData=function(){
            var parm = '{"poHeaderId":"' + poHeaderId+ '"}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_DETAIL;
            ajaxJsonProp.act="GET_ORDER_INFO";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=orderDetailPage.loadSuccess;
            orderDetailPage.loadDataFromServer();

        };
        //加载串号列表
        orderDetailPage.loadSeqNumData = function (parm) {

            ajaxJsonProp.servlet="/servlet/dz.app.orderRcv.OrderRcvServlet";
            ajaxJsonProp.act="GET_UN_RCV_SEQ";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=orderDetailPage.loadSeqSuccess;
            orderDetailPage.loadDataFromServer();

        };
          //删除串号
        orderDetailPage.loadDeleteSeqNumData = function (parm) {

            ajaxJsonProp.servlet="/servlet/dz.app.orderRcv.OrderRcvServlet";
            ajaxJsonProp.act="DEL_SEQ";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=orderDetailPage.loadDeleteSeqSuccess;
            orderDetailPage.loadDataFromServer();

        };
        //确认收货
        orderDetailPage.confirmRcvData = function (parm) {

            ajaxJsonProp.servlet="/servlet/dz.app.orderRcv.OrderRcvServlet";
            ajaxJsonProp.act="CONFIME_RCV";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=orderDetailPage.loadConfirmRcvSuccess;
            orderDetailPage.loadDataFromServer();

        };
        orderDetailPage.loadConfirmRcvSuccess = function (data) {
            if (data.code + "" == "1") {
                sinoMobileUI.alert(data.msg);
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
        orderDetailPage.loadDeleteSeqSuccess = function (data) {
            if (data.code + "" == "1") {
				//成功后界面删除
				if(selectedItemObj!=null){
					$(selectedItemObj).parent("li").remove();
				}
            } else {
                sinoMobileUI.alert("删除串号失败：" + data.msg);
                return false;
            }

        }
        orderDetailPage.loadSeqSuccess = function (data) {
            if (data.code + "" == "1") {
				var batchId=sinoMobileUtil.getJsonObjectFromResponseData(data,"batchId");
                $(".batchIdHtml").val(batchId);
                var seqData=sinoMobileUtil.getRecordsFromResponseData(data,"seqData");
				if (seqData == null || seqData.getLength() <= 0) {
					sinoMobileUI.alert("没有查询到串号！");
				}else{
					orderDetailPage.printSeqNumberData(seqData);
				}
            } else {
                sinoMobileUI.alert("加载串号失败:" + data.msg);
            }

        }

        //总的加载数据入口
        orderDetailPage.loadSuccess = function (data) {
            if (data.code + "" == "1") {
                // orderData  refundData  lineData
                var orderData=sinoMobileUtil.getJsonObjectFromResponseData(data,"orderData");
                orderDetailPage.printData(orderData);
                orderDetailPage.loadLogisticsData(orderDetailPage.getLogisticsData(orderData["logisticsData"]));
                orderDetailPage.printLinesData(orderDetailPage.getLinesData(orderData["lineData"]));
				orderDetailPage.printCoupon(orderDetailPage.printCoupon(orderData["vouchesData"]));
				//add by chenwj 2016-05-20 start
				//加载成功后，如果是暂存状态，则显示配送方式
                if($("#authorizationStatus").val() == "INCOMPLETE"){
                    $(".dt_bank_top").show();
                }else{
                    $(".dt_bank_top").hide();
                }
				//add by chenwj 2016-05-20 end
				var pay=$.query.get("pay");
				//加载成功后，如果是在线付款，则直接到付款处理操作
				if(pay=="true"||pay==true){
					sinoShopping.doPayOrderOnline(null);
				}

            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		/**
		 * 打印优惠券
		 **/
        orderDetailPage.printCoupon = function (jsonObj) {
            if (jsonObj == null || jsonObj == "undefined") {
				//$(".useCouponPick").hide();
                return;
            }
			var recs=new Records();
			recs.fromJson(jsonObj);
			var nLen=recs.getLength();

			if(nLen<=0){
				//$(".useCouponPick").hide();
                return;
			}

			var rec=null;
			var html="";
			var templateHtml=$("#useCouponLineHtml").html();
			var list=$("#useCouponLines");
			var qty=0;
			var faceValue=0;
			var total=0;
			for(var nn=1;nn<=nLen;nn++){
				rec=recs.getNthRecord(nn);
				html=templateHtml;
				html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
				list.append(html+"\r");
				total+=parseInt(rec.getValue("qty"))*parseInt(rec.getValue("faceValue"));
			}
			$(".useCouponAmoutHtml").html(total);
			$("#couponPay").html(total);
			$(".useCouponPick").show();
		}
		/**
		 * 打印主数据信息
		 **/
        orderDetailPage.printData = function (jsonObj) {

            if (jsonObj == null || jsonObj == "undefined") {
                return;
            }

			//获取订单状态
			var rec=new Record();
			rec.fromJson(jsonObj);
			orderStatus=sinoShopping.getOrderStatus(rec);
            //判断是否可查看串号
			if(!sinoShopping.canViewSeqNumber(rec)){
				$(".look-ch").hide();
			}


			needOnlinePay=jsonObj["needOnlinePay"];

            $(".poHeaderIdHtml").val(jsonObj["poHeaderId"]);
            $(".poTypeHtml").val(jsonObj["poType"]);
			$("#needOnlinePay").val(jsonObj["needOnlinePay"]);
			$("#payGatherOrder").val(jsonObj["payGatherOrder"]);
			$("#poHeaderId").val(jsonObj["poHeaderId"]);

			$("#vendorType").val(jsonObj["vendorType"]);


            var  payGatherOrder = jsonObj["payGatherOrder"];

            var  onlinePayCompany= jsonObj["onlinePayCompany"];
            var onlinePayStatusDate = jsonObj["onlinePayStatusDate"];
            var payTypeName = jsonObj["payTypeName"];
            var neetPayAmount = jsonObj["neetPayAmount"];
            var creditRebateAmount = jsonObj["creditRebateAmount"];


            var realityPayAmount = jsonObj["realityPayAmount"];
            var authorizationStatus = jsonObj["authorizationStatus"];
            var onlinePayOrder = jsonObj["onlinePayOrder"];
            var  onlinePayStatus= jsonObj["onlinePayStatus"];

            var  bnakRemitNumber= jsonObj["bnakRemitNumber"];
            var  offlinePay= jsonObj["offlinePay"];

            var  stockUpQtySum= parseInt(jsonObj["stockUpQtySum"]==""?"0":jsonObj["stockUpQtySum"]);//需转换为数字
            var  quantityReceivedSum= parseInt(jsonObj["quantityReceivedSum"]==""?"0":jsonObj["quantityReceivedSum"]);//需转换为数字
            var  quantitySum= parseInt(jsonObj["quantitySum"]==""?"0":jsonObj["quantitySum"]);//需转换为数字
/*
            //订单详细页面按钮控制
//            $(".order-footer1").append('<a class="cancel-order">取消订单</a>');
            if (authorizationStatus !="INCOMPLETE" && authorizationStatus !="CANCELLED" && authorizationStatus!= "RETURNED" && realityPayAmount !="" &&
                parseFloat(realityPayAmount) != 0 &&
                (onlinePayOrder == "" || "交易成功" !=onlinePayStatus) &&
                bnakRemitNumber == "" &&
                "N" == offlinePay ) {
                //这个条件满足 去支付按钮出现
                $(".order-footer1").append('<a class="pay-now2">去付款</a>');
            }
            if((stockUpQtySum>0) && (quantityReceivedSum==0)){
                //这个条件满足 确认收货按钮出现
                $(".order-footer1").append('<a class="pay-now2">确认收货</a>');
            }
            if((stockUpQtySum>0) &&  (quantityReceivedSum>0) && (quantityReceivedSum<quantitySum)){
                //这个条件满足 确认收货按钮出现
                $(".order-footer1").append('<a class="pay-now2">确认收货</a>');
            }
			*/
            var asureTrans = jsonObj["asureTrans"]=="1"?"是":"否";

            $(".orderStatusHtml").append(jsonObj["authorizationStatusName"]);
            $(".orderNoHtml").append(jsonObj["segment1"]);
            $("#rcvContact").html(jsonObj["rcvContact"]);
            $("#rcvContactPhone").html(jsonObj["rcvContactPhone"]);
            $("#rcvSiteAddress").html(jsonObj["rcvSiteAddress"]);

			$("#segment1").html(jsonObj["segment1"]);
            $("#authorizationStatus").val(jsonObj["authorizationStatus"]);
            if(onlinePayOrder==""){
                payGatherOrder = "";
                onlinePayStatus= "";
                onlinePayCompany= "";
                onlinePayStatusDate = "";
            }

            $(".onlinePayOrdertypehtml").append(onlinePayOrder==""?"":"在线支付");
            $(".onlinePayStatusDatehtml").append(onlinePayStatusDate);
            $(".payGatherOrderhtml").append(payGatherOrder);
            $(".onlinePayOrderhtml").append(onlinePayOrder);

            $(".onlinePayStatushtml").text(onlinePayStatus);
            $(".onlinePayCompanyhtml").text(onlinePayCompany);
			$(".realityPayAmounthtml").text(realityPayAmount);

            $(".asureTranshtml").text(asureTrans);
            $(".payTypeNamehtml").text(payTypeName);

			$("#payRealityPayAmount").html(realityPayAmount);
			$("#realityPayAmounth").prepend(realityPayAmount);
			$("#needOnlinePay").val(needOnlinePay);
			if(sinoMobileUtil.strIsNull(neetPayAmount)){
				neetPayAmount=realityPayAmount;
			}

            $("#neetPayAmount").html(neetPayAmount);
            $("#realityPayAmount").html(realityPayAmount);

			$("#realityPayAmountDisplay").html(realityPayAmount);

			if(orderStatus==hnctShoppingConfig.STATUS_INCOMPLETE){
				$("#creditRebateAmount").val(creditRebateAmount);
				$(".creditRebateAmountInput").show();
			}else{
				if(sinoMobileUtil.strIsNull(creditRebateAmount)){
					creditRebateAmount="￥0";
				}
				$(".creditRebateAmounthtml").text(creditRebateAmount);
				$(".creditRebateAmountTxt").show();
			}

		 	orderDetailPage.printFooter();
        }
		/**
		 * 打印操作菜单
		 **/
		orderDetailPage.printFooter=function(){
			$(".footer-rcv").hide();
			$(".footer-pay").hide();
			$(".footer-refund").hide();
			$(".footer-submit").hide();

			//待收货
			if(orderStatus==hnctShoppingConfig.STATUS_UN_RCV){
				$(".footer-rcv").show();
			}
			//待付款
			if(orderStatus==hnctShoppingConfig.STATUS_UN_PAY){
				$(".footer-pay").show();
			}
			//退货
			if(orderStatus==hnctShoppingConfig.STATUS_REFUND){
				$(".footer-refund").show();
			}
			//提交
			if(orderStatus==hnctShoppingConfig.STATUS_INCOMPLETE){
				$(".footer-submit").show();
			}
			//交易成功
			if(orderStatus==hnctShoppingConfig.STATUS_COMPLETE){

			}
		    //add by chenwj 2016-03-14 start
		    if(orderStatus!=hnctShoppingConfig.STATUS_INCOMPLETE){
				$(".cancel-order").hide();
			}
			//add by chenwj 2016-03-14 end
		}
        orderDetailPage.loadLogisticsData = function (recs) {

            console.log(recs.getLength());
            if (recs == null || recs.getLength() <= 0) {
				$(".wl_now").html("暂无物流信息可查看！");
				$(".logictistPick").hide();
                return;
            }
            var nLen = recs.getLength();
            var rec = null;
           // for (var nn = 1; nn <= 1; nn++) {
                rec = recs.getNthRecord(1);
                $(".wl_now").append(rec.getValue("comments"));
                $(".wl_time").text(rec.getValue("transferDate"));
            //}

			logisticsRecs=recs;
            //保存在localStorage
            //sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_ORDER_LOGISTICS,recs.toJsonString());
//            sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_LOGISTICS_DATA,recs.toJsonString());

        }
		orderDetailPage.printLogisticsData=function(){
			//var str=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_ORDER_LOGISTICS);
			//var recs=new Records();
			//recs.fromJsonString(str);
			var recs=logisticsRecs;
			if(recs==null||recs.getLength()<=0){
				$(".wl_now").html("暂无物流信息可查看！");
				return;
			}

			//如果物流数据已打印过，则直接显示
			if(!sinoMobileUtil.strIsNull($("#logisticDetail").html())){
				$(".logisticsDiv").show();
				$(".orderInfo").hide();
				$(".order-footer").hide();
				$(".order-footer1").hide();

				return;
			}

			var rec = null;


			var nLen = recs.getLength();

			var detailTemplate=$("#logisticDetailTemplate").html();
            var newTemplate=$("#newTemplate").html();
			var processTemplate=$("#processTemplate").html();
			var startTemplate=$("#startTemplate").html();

			var template="";
			var html="";
			var beginEndFlg="";
			//物流单号
			var orderNo="";
			var lastOrderNo="";
			var detailHtml="";
			var listHtml="";
			var beginEndFlg="";

            for (var nn = 1; nn <= nLen; nn++) {
                rec = recs.getNthRecord(nn);
				orderNo=rec.getValue("logisticsOrder");
				beginEndFlg=rec.getValue("beginEndFlg");

				if(orderNo!=lastOrderNo){
					if(nn>1){
						detailHtml=detailHtml.replaceAll("{logisticsList}",listHtml);
						$("#logisticDetail").append(detailHtml);
					}

					detailHtml=sinoMobileUtil.getFormatedTemplateHtml(detailTemplate,rec);
					listHtml="";
				}

				if(sinoMobileUtil.strIsNull(beginEndFlg)){
					template=processTemplate;
				}else{
					if(beginEndFlg=="B"){
						template=startTemplate;
					}else if(beginEndFlg=="E"){
						template=newTemplate;
					}else{
						template=processTemplate;
					}
				}

				listHtml=listHtml+"\n"+sinoMobileUtil.getFormatedTemplateHtml(template,rec);
				lastOrderNo=orderNo;
            }
			detailHtml=detailHtml.replaceAll("{logisticsList}",listHtml);
			$("#logisticDetail").append(detailHtml);

			$(".logisticsDiv").show();
			$(".orderInfo").hide();
			$(".order-footer").hide();
			$(".order-footer1").hide();

		 }
		 orderDetailPage.closeLogisitcs=function(){
			$(".logisticsDiv").hide();
			$(".orderInfo").show();
			orderDetailPage.printFooter();
		 }
		/**
		 * 打印产品行列表
		 **/
        orderDetailPage.printLinesData = function (recs) {
            if (recs == null || recs.getLength() <= 0) {
                return;
            }

			/*
            var nLen = recs.getLength();
            var rec = null;
            var  html="";

            for (var nn = 1; nn <= nLen; nn++) {
                rec = recs.getNthRecord(nn);
                  html+='<div class="shr-item clearfix">';
                html +='<span class="list-thumb1 fl"><img src="'+rec.getValue("imgUrl")+'" ></span>';
                html +='<span class="list-descriptions-wrapper1 fl"><div class="product-name2">'+rec.getValue("itemName")+"&nbsp;"+rec.getValue("color")+'</div><div class="product-color2">￥'+rec.getValue("unitPrice")+' * '+rec.getValue("quantity")+'</div></span>';
                html +='<a class="look-ch" data-name="'+rec.getValue("itemName")+'" data-line="'+rec.getValue("poLineId")+'" onclick="queryChuanhao(this)">查看串号</a>';
                  html+='</div>';

            }
            $(".shr-p").html(html);
            $(".productnumhtml").html(nLen);*/

			var template=$("#templateLine");
			var productList=$("#lineList");


			if(recs!=null&&recs.getLength()>0){
				//清空数据
				nLen=recs.getLength();
				var rec=null;
				var html="";
				var templateHtml=template.html();

				for(var nn=1;nn<=nLen;nn++){
					rec=recs.getNthRecord(nn);
					html=templateHtml;
					html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
					productList.append(html+"\r");
				}
			}else{
				productList.append(hnctShoppingConfig.CONST_PRODUCT_NOTHING);
			}
        }
		/**
		 * 打印串号列表信息
		 **/
        orderDetailPage.printSeqNumberData = function (recs) {


            /*var nLen = recs.getLength();
            var rec = null;
            var html='<h1>'+$(".itemNameHtml").val()+'</h1><ul>';
            for (var nn = 1; nn <= nLen; nn++) {
                rec = recs.getNthRecord(nn);
                var seq=rec.getValue("sequencesNumber");
                html +='    <li class="on" >'+
                    '<span class="o-pxnum">'+nn+'</span>'+
                    '<span class="o-num-on">'+seq+'</span>'+
                    '<span class="o-delbtn" data-seq="'+seq+'" onClick="deleteSeqNum(this)">删除</span>'+
                    '</li>';
            }



            html +='</ul>';
            $(".orderSeq-con").html(html);*/

            $("#orderSeqTitle").html($(selectedItemObj).data("itemname"));
			var template=$("#templateSeq");
			var orderSeqList=$("#orderSeqList");
			$("#orderSeqList").html("");

			if(recs!=null&&recs.getLength()>0){
				//清空数据
				nLen=recs.getLength();
				var rec=null;
				var html="";
				var templateHtml=template.html();

				for(var nn=1;nn<=nLen;nn++){
					rec=recs.getNthRecord(nn);
					rec.addField("num",nn);
					html=templateHtml;
					html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
					orderSeqList.append(html+"\r");
				}
			}else{
				orderSeqList.append(hnctShoppingConfig.CONST_PRODUCT_NOTHING);
			}
			var batchId=$(".batchIdHtml").val();
			$("#btOnlineRcvLine").bind("click",function(){
						sinoMobileUI.confirm("确认要收货吗？",
							function(){sinoShopping.loadConfirmRcv(poHeaderId,selectedPoLineId,batchId)})
						});

			//串号操作，如果是非收货状态，则隐藏对应操作按钮
			if(orderStatus!=hnctShoppingConfig.STATUS_UN_RCV){
				$(".o-delbtn").hide();
				$("#btOnlineRcvLine").hide();
			}

			$(".orderDetail-seq").show();
        }


        orderDetailPage.getLogisticsData = function (data) {
            var recs = new Records();
            recs.fromJson(data);
            return recs;
        }
        orderDetailPage.getSeqNumData = function (data) {
            var recs = new Records();
            recs.fromJson(data);
            return recs;
        }
        orderDetailPage.getLinesData = function (data) {
            var recs = new Records();
            recs.fromJson(data);
            return recs;
        }

        // 处理错误日志
        orderDetailPage.loadError=function (result, textStatus, errorThrown){
			sinoShopping.setUIButtonDisabledStatus(false);
			$(".onLoad").hide();

            if (textStatus!=null) {
					if (textStatus == 'timeout') {
						sinoMobileUI.alert("服务器连接超时.");
						return;
					}else if(textStatus == 'parsererror'){
						sinoMobileUI.alert("服务器处理发生错误，返回数据解析失败.");
						return;
					}
			}

            var httpErrorCode=result.status;
            if(httpErrorCode==null||httpErrorCode==""||httpErrorCode=="undefined"){
                sinoMobileUI.alert("服务器返回错误，操作不能继续！");
            }else{
                httpErrorCode=httpErrorCode+"";
                if(httpErrorCode=="403"){
                    //session失效，重新登录
                    sinoMobileUtil.autoLogin(sinoMobileUtil.getCurrent2RootRelateFullPath());
                }else if(httpErrorCode=="404"){
                    //sinoMobileUtil.autoLogin(sinoMobileUtil.getCurrent2RootRelateFullPath());
                    sinoMobileUI.alert("服务器没有响应，或访问地址不可用！");
                }else if(httpErrorCode=="200" ){
						//sinoMobileUI.alert("内部错误：！");
				}else if(httpErrorCode=="401" ){
						util.autoLogin(util.getCurrent2RootRelateFullPath());
				}else{
                    sinoMobileUI.alert("服务器返回错误，操作不能继续！") ;
                }
            }
        }
		/**
		 * 关闭串号查看层
		 **/
        orderDetailPage.closeOrderSeqDiv=function(){
			$(".orderDetail-seq").hide();
		}

		/**
		 * 查看串号
		 **/
		orderDetailPage.doQueryOrderSeq=function(obj){
			 //
			 selectedItemObj=obj;
		     var name=$(obj).data("name");
             var line=$(obj).data("polineid");

			 //保存选准行号
			 selectedPoLineId=line;


             var rec = new Record();
             rec.addField("poHeaderId",poHeaderId);
             rec.addField("poLineId", line);
             rec.addField("batchId", $(".batchIdHtml").val());
             rec.addField("poType", $(".poTypeHtml").val());

             var parm = rec.toJsonString();

             orderDetailPage.loadSeqNumData(parm);

         }
		 /**
		 * 删除串号
		 **/
         orderDetailPage.doRemoveSeq=function(obj){
			 //记住选准行
			 selectedItemObj=obj;
             var seq=$(obj).data("sequencesnumber");
			 var batchid=$(".batchIdHtml").val();
             var rec = new Record();
             rec.addField("batchId", batchid);
             rec.addField("sequencesNumber", seq);
             var parm = rec.toJsonString();

			 sinoMobileUI.confirm("确认要删除该串号吗?",function(){orderDetailPage.loadDeleteSeqNumData(parm)},null);
             //orderDetailPage.loadDeleteSeqNumData(parm);

         }
		 /**
		 * 选准串号
		 **/
		 orderDetailPage.doClickSeq=function(obj){
			var chld=$(obj).parent().find("li");
			if(chld!=null&&chld.length>0){
				for(var ii=0;ii<chld.length;ii++){
					$(chld[ii]).attr("class","");

				}

			}
			$(obj).attr("class","on");

		 }

		 orderDetailPage.doCancelOrderDetailToPay=function(){
			$(".paymentInfo").hide();
			var pay=$.query.get("pay");
			if(pay=="true"||pay==true){
				var from=$.query.get("from");
				if(sinoMobileUtil.strIsNull(from)){
					sinoMobileUI.doGoBack();
				}else{
					sinoMobileUI.doOpenOrderListPage(from);
				}
			}else{

				if(orderStatus==hnctShoppingConfig.STATUS_INCOMPLETE){
					$(".successInfo").show();
				}else{
					$(".orderInfo").show();
					orderDetailPage.printFooter();
				}
			}
		 }
		 orderDetailPage.doPickUserCoupon=function(){

			$(".orderInfo").hide();
			$(".useCoupon").show();

		}
		/**
		 * 关闭优惠卡
		 **/
		orderDetailPage.doCancelCouponList=function(){
			$(".orderInfo").show();

			$(".useCoupon").hide();
		}
		return orderDetailPage;
    }
}