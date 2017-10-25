/**
 *  Module: 订货会
 *  Author: jintl
 *  Create Time:2015-9-25
 *  Last Modify Time: 2015-9-25
 *******************************
 * 订货会详细
 * */
var dhhDetail = {

    createNew: function () {
        var detail = {};
		//创建类型 6：手机订单，7：手机订货会订单，8：手机抢购订单，9：手机团购订单
		var createType=7;
        var itemId = $.query.get("itemId");
        var vendorId = $.query.get("vendorId");       
     	var promoteApplyHeaderId=$.query.get("promoteApplyHeaderId");
		var promoteApplyLineId=$.query.get("promoteApplyLineId");
        var vendorType=$.query.get("vendorType");
		var ladderPrice=null;
		if(vendorType==null||vendorType==""||vendorType=="{vendorType}"){
			vendorType="1";
		}
		var colors=0;
	    var currentPrice=0;
		var minOrderQuantity=0;
		var product = hnctProduct.createNew();

        

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
        detail.loadDataFromServer=function(flag){
            var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
			if(flag){
				sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,detail.loadCanReloadError);
			}else{
				sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,detail.loadError);
			}
        };


        detail.loadInfo = function () {
			
			if (itemId == "" || vendorId == "" || promoteApplyHeaderId == "" || promoteApplyLineId=="") {
				 sinoMobileUI.alert("参数错误，操作不能继续！");
				 return;
			}
            var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("vendorId", vendorId);
            rec.addField("promoteApplyHeaderId", promoteApplyHeaderId);
			rec.addField("promoteApplyLineId", promoteApplyLineId);
            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_DHH;
            ajaxJsonProp.act="GET_DHH_ITEM_INFO";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=detail.loadDetailInfoSuccess;
            detail.loadDataFromServer(true);
        };

          
       
        detail.getPoType = function () {

            //和订单类型
            var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            rec.addField("ioId", $(".mainInfo4").find("select").val());

            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
            ajaxJsonProp.act="GET_PO_TYPE";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=detail.loadPoTypeSuccess;
            detail.loadDataFromServer(false);


        };
        
        detail.loadPoTypeSuccess = function (data) {
            if (data.code + "" == "1") {
                $(".poTypeinput").val(data.msg);
                detail.createOrder();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
        
       
        detail.loadDetailInfoSuccess = function (data) {
			
			
            if (data.code + "" == "1") {
                detail.printInfo(sinoMobileUtil.getJsonObjectFromResponseData(data,"dhhItemInfo"));
				detail.parintLadderPrice(sinoMobileUtil.getJsonObjectFromResponseData(data,"ladderPrice"));

				//加载产品详细信息	
				product.loadProductConfig(itemId,vendorId,vendorType);
                 
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
		
        detail.printInfo = function (jsonObj) {
            if (jsonObj == null || jsonObj == "undefined") {
                return;
            }
			//保存实际价格
			currentPrice=jsonObj["currentPrice"];
			minOrderQuantity=parseInt(jsonObj["minOrderQuantity"]);

            var num = jsonObj["price"];
            var htmlValue = jsonObj["phoneBrands"] + "&nbsp;" + jsonObj["itemName"] + jsonObj["phoneSellingPoint"];//  phoneBrands
            $(".text-price").html(num);
            $(".sellpoint").prepend(htmlValue);
            $(".itemDescriptioninput").val(jsonObj["itemName"]);

			$("#priceStart").html(jsonObj["priceStart"]);
			$("#priceEnd").html(jsonObj["priceEnd"]);
			$("#currentPrice").html(jsonObj["currentPrice"]);


			//$("#promotePolicy").html(jsonObj["promotePolicy"]);
			//$("#comments").html(jsonObj["comments"]);


			var commentsHtml=jsonObj["comments"];
			$("#commentsMsg").html(commentsHtml);
			if(!sinoMobileUtil.strIsNull(commentsHtml)&&commentsHtml.length>24){
				//不截取，截取后显示不正确。click事件无效
				commentsHtml="    <span onclick='detail.showSaleControl(2)'>点击查看详细...</span>";
			}
			$("#comments").html(commentsHtml);
			
			var saleControlMsg=jsonObj["promotePolicy"];


			
		    $("#controlMsg").text(saleControlMsg); 
			
			
			if(!sinoMobileUtil.strIsNull(saleControlMsg)&&saleControlMsg.length>24){				
				saleControlMsg="    <span onClick='detail.showSaleControl(1)'>点击查看详细...</span>";
			}
			$("#promotePolicy").html(saleControlMsg);

			$(".mainInfo1").html(jsonObj["itemCode"]);
            $(".mainInfo2").html(jsonObj["vendorName"]);
			//qyj 2016-2-24
			vendorConfigFlg=jsonObj["vendorConfigFlg"];
			if( vendorConfigFlg=='1') {
				var phoneColorsQty=jsonObj["phoneColorsQty"];
				numList=phoneColorsQty.split(',');
				$(".mainInfo3").html(phoneColorsQty);
			} else {
            	$(".mainInfo3").html(jsonObj["vendorInventory"]);
			}
			
			
			if(jsonObj["orgOpt"].lastIndexOf("<option")==0){
				$(".mainInfo4").html("<select class=\"select-no-list\" disabled=\"disabled\"> >" + jsonObj["orgOpt"] + "</select>");
			}else{
				 $(".mainInfo4").html("<select>" + jsonObj["orgOpt"] + "</select>");
			}	

			//colorLineTemplate
			var colorLineTemplate=$("#colorLineTemplate").html();
			var colorOrderLineTemplate=$("#colorOrderLineTemplate").html();
			var colorList=$("#colorList");
			var colorOrderList=$("#colorOrderList");
			
            var colorArr ;
			//qyj 2016-3-8
			if( vendorConfigFlg=='1') {
				if(jsonObj["phoneColorsQty"].indexOf(",") != -1){
					colorArr = jsonObj["phoneColorsQty"].split(",");
				}else{
					colorArr = jsonObj["phoneColorsQty"].split(";");
				}
			} else {
            	if(jsonObj["phoneColors"].indexOf(",") != -1){
					colorArr = jsonObj["phoneColors"].split(",");
				}else{
					colorArr = jsonObj["phoneColors"].split(";");
				}
			}
			
			
            var nLen=colorArr.length;
			colors=nLen;
			var rec=null;
			var html="";
			
			for(ii=0;ii<nLen;ii++){
				rec=new Record();
				rec.addField("n",ii+1);
				rec.addField("color",colorArr[ii].split('-')[0]);
				html=colorLineTemplate;
				html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
				colorList.append(html+"\r");

				html=colorOrderLineTemplate;

			
				html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
				colorOrderList.append(html+"\r");

				
			}
            

        }
		detail.parintLadderPrice = function (jsonObj) {
			var recs=new Records();
			recs.fromJson(jsonObj);
			ladderPrice=new Records();
			var nLen=recs.getLength();
			var html="";
			var template=$("#ladderPriceTemplate").html();
			
			var ladderPriceHtml=$("#ladderPriceHtml");
			var endQuantity=0;
			var startQuantity=0;
			for(var ii=1;ii<=nLen;ii++){
			
				rec=recs.getNthRecord(ii);				
				html=template;
				html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
				ladderPriceHtml.append(html+"\r");
				endQuantity=rec.getValue("endQuantity");
				if(sinoMobileUtil.strIsNull(endQuantity)){
					rec.setField("endQuantity",99999);
				}
				
				endQuantity=rec.getValue("endQuantity");
				if(sinoMobileUtil.strIsNull(endQuantity)){
					rec.setField("endQuantity",0);
				}
				ladderPrice.addRecord(rec);

			}
		}
        detail.loadError=function (result, textStatus, errorThrown){	
				sinoMobileUtil.loadErrorCall(result, textStatus, errorThrown,false);
		}
		detail.loadCanReloadError=function (result, textStatus, errorThrown){	
				sinoMobileUtil.loadErrorCall(result, textStatus, errorThrown,true);
		}
		detail.clickSearchBar=function(){
		
			if($(".search-box").is(":hidden")){				
				$(".search-box").show();
				$("#keyWord").focus();
			}else{
				$(".search-box").hide();
			}
		}
		 // 下单和加入购物车都调用这个方法 canorder 隐藏域是否能够下单
        detail.canOrder = function () {

            
			/*if(sinoMobileUtil.getRestTime(promoteEndDate)<=0){
				sinoMobileUI.alert("已过期，不能抢购！");
				return;
			}*/
			var total=parseInt($("#total").html());
			
			if(total<minOrderQuantity){
				sinoMobileUI.alert("不能小于最小订货数量:"+minOrderQuantity);
				return;
			}
          /*  var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            rec.addField("ioId", $(".mainInfo4").find("select").val());

            var parm = rec.toJsonString();

            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
            ajaxJsonProp.act="GET_CAN_ORDER";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=detail.loadCanOrder2Success;
            detail.loadDataFromServer(false);*/
			detail.addOrder();
        };
		detail.loadCanOrder2Success = function (data) {
            if (data.code + "" == "1") {
                if (data.msg == "") {
                    detail.addOrder();
                } else {
                    sinoMobileUI.alert("" + data.msg);
                }

            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
		detail.addOrder = function () {

            //需要获取 供应商联系人ID 和订单类型
            var rec = new Record();
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            rec.addField("ioId", $(".mainInfo4").find("select").val());

            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
            ajaxJsonProp.act="GET_VENDOR_CONTACT_ID";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=detail.loadOrderSuccess;
            detail.loadDataFromServer(false);

        };
		detail.loadOrderSuccess = function (data) {
            if (data.code + "" == "1") {
                $(".vendorContactIdinput").val(data.msg);
                detail.getPoType();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
		detail.getPoType = function () {

            //和订单类型
            var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            rec.addField("ioId", $(".mainInfo4").find("select").val());

            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
            ajaxJsonProp.act="GET_PO_TYPE";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=detail.loadPoTypeSuccess;
            detail.loadDataFromServer(false);


        };
		detail.loadPoTypeSuccess = function (data) {
            if (data.code + "" == "1") {
                $(".poTypeinput").val(data.msg);
                detail.createOrder();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
		detail.createOrder = function () {

            var rec = new Record();
            //主数据信息
           
			/*
			vendorId
			vendorContactId
			organizationId
			realityPayAmount
			poType
			createType
			promoteApplyHeaderId 
			*/
			//rec.addField("itemId", itemId);
			rec.addField("vendorId", vendorId);
            rec.addField("vendorContactId", $(".vendorContactIdinput").val());
			rec.addField("organizationId", $(".mainInfo4").find("select").val());
			rec.addField("realityPayAmount",$("#summary").html());
			rec.addField("poType", $(".poTypeinput").val());
			rec.addField("createType", createType);
			rec.addField("promoteApplyHeaderId", promoteApplyHeaderId);
            //rec.addField("ioId", $(".mainInfo4").find("select").val());
           
			//行信息
			/*
			itemId
			unitPrice
			quantity
			color
			*/
			
			
			var total=parseInt($("#total").html());
			var price=detail.getLadderPrice(total);

			var lines=new Records();
			var lineData =null;
			var nQuantity=0;
			for(var ii=1;ii<=colors;ii++){


				lineData = new Record();
				lineData.addField("itemId", itemId);
				lineData.addField("unitPrice", price);
				lineData.addField("quantity", $("#orderColorTotal"+ii).html());
				lineData.addField("color", $("#orderColor"+ii).html());
				nQuantity=parseInt($("#orderColorTotal"+ii).html());
				if(nQuantity>0){
					lines.addRecord(lineData);
				}
			}


			
           // var lineArray = [];
            //lineArray.push(lineData.toJsonString());
            rec.addFieldChildren("lineData", lines.toJsonString());
            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
            ajaxJsonProp.act="CREATE_ORDER";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=detail.loadCreateOrderSuccess;
            detail.loadDataFromServer(false);

        };
		detail.loadCreateOrderSuccess = function (data) {
            if (data.code + "" == "1") {
				var orderData=sinoMobileUtil.getJsonObjectFromResponseData(data,"orderData");
				if(orderData!=null){
					var poHeaderId=orderData["poHeaderId"];
					sinoMobileUI.doOpenCreateOrderPage(poHeaderId,"dhh");
				}else{
					sinoMobileUI.alert("创建订单成功，但返回数据有错！");	
				}
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
		//qyj 2016-3-3
		detail.subCount=function(n){
			var g = $(".colorCount"+n);
			var f = g.val();
			var e = parseInt(f) - 1;	
			if (e > 999) {
				e = 999 
			}
			if (e <= 0) {
				e = 0
			};
			
			
			g.val(e);
			detail.setSummary();
		};
		//qyj 2016-3-3
		detail.addCount=function(n){
			var g = $(".colorCount"+n);
			var f = g.val();
			var e = parseInt(f) + 1;
			//qyj 2016-2-24
			var kucun=0;
			if( vendorConfigFlg=='1') {
				var color=$('#colorId'+n).html();
				var i=0;
				for(i=0;i<numList.length;i++) {
					var kk=numList[i].split('-');
					if( color==kk[0] ) {
						kucun=parseInt(kk[1]);
						break;
					}
				}
				if(e>kucun) {
					sinoMobileUI.alert("不能超过库存数：" + kucun);
					e=kucun;
				}
			} else {
				if (e > 999) {
					e = 999 
				}
				if (e <= 0) { 
					e = 1
				};
			}
				
			g.val(e);		
			detail.setSummary();	
		};
		detail.setSummary=function(){
			if(colors<=0){
				return;
			}
			var total=0;
			var colorTotal=0;
			for(var ii=1;ii<=colors;ii++){
				colorTotal= $(".colorCount"+ii).val();//qyj
				total+=parseInt(colorTotal);
			}
			var price=detail.getLadderPrice(total);

			$(".ladderPrice").html(price);
			
			$("#total").html(total);
			$("#summary").html(price*total);


			for(var ii=1;ii<=colors;ii++){
				colorTotal= $(".colorCount"+ii).val()
				$("#orderColorTotal"+ii).html(colorTotal);
				$("#orderColorSummary"+ii).html(parseInt(colorTotal)*price);
			}
		}
		detail.getLadderPrice=function(total){
			
			if(total<=0){
				return 0;
			}
			var recs=ladderPrice;
			var nLen=recs.getLength();
			
			var startQuantity=0;
			var endQuantity=0;
			var rec=null;
			var price=0;
			var unitPrice=0;
			for(var nn=1;nn<=nLen;nn++){				
				rec=recs.getNthRecord(nn);
				startQuantity=parseInt(rec.getValue("startQuantity"));
				endQuantity=parseInt(rec.getValue("endQuantity"));
				unitPrice=parseInt(rec.getValue("unitPrice"));
				if(total>=startQuantity&total<=endQuantity){
				   price=unitPrice;
				}
			}
			
			return price==0?currentPrice:price;
		
		}
		detail.showSaleControl=function(type){
			
			product.showSaleControl(type);
		} 
		detail.closeSaleControl=function(msg){
			product.closeSaleControl();
		}
		//最大数量限制 qyj
		detail.checkMax=function(n) {
			var g = $(".colorCount"+n);
			var color=$('#colorId'+n).html();
			var e = parseInt(g.val()) + 1;
			var i=0,kucun=0;
			for(i=0;i<numList.length;i++) {
				var kk=numList[i].split('-');
				if( color==kk[0] ) {
					kucun=parseInt(kk[1]);
					break;
				}
			}
			if( vendorConfigFlg=='1') {	
				if(e>kucun) {
					sinoMobileUI.alert("不能超过库存数：" + kucun);
					g.val(kucun);
				}
			}
			detail.setSummary();
		};
		
        return detail;
    }
}
