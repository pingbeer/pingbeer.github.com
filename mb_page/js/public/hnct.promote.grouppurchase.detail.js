/**
 *  Module: 团购详细
 *  Author: jintl
 *  Create Time:2015-9-25
 *  Last Modify Time: 2015-9-25
 *******************************
 * 团购详细
 * */
var groupPurchaseDetail = {

    createNew: function () {
        var detail = {};
		//创建类型 6：手机订单，7：手机订货会订单，8：手机抢购订单，9：手机团购订单
		var createType=9;
        var itemId = $.query.get("itemId");
        var vendorId = $.query.get("vendorId");       
        var vendorType = $.query.get("vendorType");
		var promoteApplyLineId=$.query.get("promoteApplyLineId");

		var promoteEndDate="";
		var promoteApplyHeaderId="";

		var maxQuantity="";
		var minOrderQuantity="";
	

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
			if (itemId == "" || vendorId == "" || vendorType == "" || promoteApplyLineId=="") {
				 sinoMobileUI.alert("参数错误，操作不能继续！");
				 return;
			}
            var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
			rec.addField("promoteApplyLineId", promoteApplyLineId);
            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_GROUP_PURCHASE;
            ajaxJsonProp.act="GET_GROUP_PURCHASE_ITEM_INFO";
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
                detail.printInfo(sinoMobileUtil.getJsonObjectFromResponseData(data,"groupPurchaseItemInfo"));

				//加载产品详细信息	
				product.loadProductConfig(itemId,vendorId,vendorType);
                 
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
		detail.doSelectColor=function(obj){
		   var cls=$(obj).attr("class");
		   
		   var parent=$(obj).parent();
		   var children=$(parent).children();
		   var nLen=children.length;
		   for(var nn=0;nn<nLen;nn++){
				$(children[nn]).attr("class","p-color1");
		   }
		   $(".colorinput").val($(this).text());
		   $(obj).attr("class","p-color1-s");
		}
        detail.printInfo = function (jsonObj) {
            if (jsonObj == null || jsonObj == "undefined") {
                return;
            }
            var num = jsonObj["price"];
            var htmlValue = jsonObj["phoneBrands"] + "&nbsp;" + jsonObj["itemName"] + jsonObj["phoneSellingPoint"];//  phoneBrands
            $(".text-price").html(num);
            $(".sellpoint").prepend(htmlValue);
            $(".itemDescriptioninput").val(jsonObj["itemName"]);

			$("#currentPrice").html(jsonObj["currentPrice"]);
			$("#minPrice").html(jsonObj["minPrice"]);



			var minPrice=jsonObj["minPrice"];
			var	currentPrice=jsonObj["currentPrice"];
			$("#discountPrice").html(sinoMobileUtil.getDiscountHtml(minPrice,currentPrice));
				
			$("#restTime").html(sinoMobileUtil.getRestTimeHtml(jsonObj["promoteEndDate"]));


			$("#userdQuantity").html(jsonObj["userdQuantity"]);
            //格式化促销


			var commentsHtml=jsonObj["comments"];
			$("#commentsMsg").html(commentsHtml);
			if(!sinoMobileUtil.strIsNull(commentsHtml)&&commentsHtml.length>24){
				//不截取，截取后显示不正确。click事件无效
				commentsHtml="    <span onclick='detail.showSaleControl(2)'>点击查看详细...</span>";
			}
			$("#comments").html(commentsHtml);
			
			var saleControlMsg="最小："+jsonObj["minOrderQuantity"] +" 最大："+jsonObj["maxQuantity"];


			if(!sinoMobileUtil.strIsNull(jsonObj["promotePolicy"])){
				//不截取，截取后显示不正确。click事件无效
				saleControlMsg+=","+jsonObj["promotePolicy"];
			}
			
		    $("#controlMsg").text(saleControlMsg); 
			
			
			if(!sinoMobileUtil.strIsNull(saleControlMsg)&&saleControlMsg.length>24){				
				saleControlMsg="    <span onClick='detail.showSaleControl(1)'>点击查看详细...</span>";
			}
			$("#saleControl").html(saleControlMsg);
			
			/*

			$("#comments").html(jsonObj["comments"]);
			var saleControlMsg="最小："+jsonObj["minOrderQuantity"] +" 最大："+jsonObj["maxQuantity"];
			if(!sinoMobileUtil.strIsNull(jsonObj["promotePolicy"])){
				saleControlMsg+=","+jsonObj["promotePolicy"];
			}
			$("#saleControl").html(saleControlMsg);
			*/
            
            var colorArr ;
			//qyj  2016-3-09
			vendorConfigFlg=jsonObj["vendorConfigFlg"];
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
            
            var colorhtml = "";
            if (colorArr.length == 1) {
                colorhtml =
                    '<a class="p-color1-s" onclick="detail.doSelectColor(this)">' + colorArr[0].split('-')[0] + '</a>';
            } else {
                for (var j in colorArr) {
                    // var active = j == 0 ? "p-color1-s active" : "p-color1";
					 var active =  "p-color1"; //qyj 2016-2-29
                     colorhtml +=
                        '<a class="' + active + ' "  onclick="detail.doSelectColor(this)">' + colorArr[j].split('-')[0] + '</a>';
                }
            }
         //   $(".colorinput").val(colorArr[0]); //qyj 2016-2-29
            $(".colorhtml").append(colorhtml);
            detail.colorSelect();

            $(".mainInfo1").html(jsonObj["itemCode"]);
            $(".mainInfo2").html(jsonObj["vendorName"]);
            //qyj 2016-2-24
			if( vendorConfigFlg=='1') {
				var phoneColorsQty=jsonObj["phoneColorsQty"];
				numList=phoneColorsQty.split(',');
				var total=0;
				for(var i=0;i<numList.length;i++) {
					var kk=numList[i].split('-');
					if(kk.length==2) {
						total+=parseInt( kk[1] );
					}
				}
				$(".mainInfo3").html(total);
			} else {
            	$(".mainInfo3").html(jsonObj["vendorInventory"]);
			}

			maxQuantity=jsonObj["maxQuantity"];
			minOrderQuantity=jsonObj["minOrderQuantity"];
			promoteApplyHeaderId=jsonObj["promoteApplyHeaderId"];
			promoteEndDate=jsonObj["promoteEndDate"];
		
			//对于只有一个元素进行处理
			if(jsonObj["orgOpt"].lastIndexOf("<option")==0){
				$(".mainInfo4").html("<select class=\"select-no-list\" disabled=\"disabled\"> >" + jsonObj["orgOpt"] + "</select>");
			}else{
				 $(".mainInfo4").html("<select>" + jsonObj["orgOpt"] + "</select>");
			}

        }
        detail.colorSelect = function () {
            $(".colorhtml a").click(function () {
                $(".colorinput").val($(this).text());
				$(this).siblings().removeClass("active");
                $(this).addClass("active");
				//qyj 2016-2-24
				if( vendorConfigFlg=='1') {
					kucun=0;
					for(var i=0;i<numList.length;i++) {
						var kk=numList[i].split('-');
						if( $(this).text()==kk[0] ) {
							kucun=kk[1];	
						}
					}
					$('.mainInfo3').html(kucun);
					if(kucun==0) {
						$('.quantityhtml').val(0);
					} else {
						$('.quantityhtml').val(1);	
					}
				} else {
					$('.quantityhtml').val(1);	
				}
                
            });
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

            var color = $(".colorinput").val();
            if (color == "") {
                sinoMobileUI.alert("请选择颜色");
                return;
            }
			 if( vendorConfigFlg=='1' && kucun==0) {
				sinoMobileUI.alert("库存不足" );
				return;
			 }


			var g = $(".quantityhtml");
			var f = g.val();
			var e = parseInt(f);
			
			
			if(e<minOrderQuantity){
				sinoMobileUI.alert("不能小于最小数量"+minOrderQuantity);
				return;
			}
			
			if(e>maxQuantity){
				sinoMobileUI.alert("不能大于最大数量"+maxQuantity);
				return;
			}
			
			if(sinoMobileUtil.getRestTime(promoteEndDate)<=0){
				sinoMobileUI.alert("已过期，不能抢购！");
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
			rec.addField("realityPayAmount", Number($("#minPrice").html() * $(".quantityhtml").val()).toFixed(2));
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
			var lineData = new Record();
            lineData.addField("itemId", itemId);
            lineData.addField("unitPrice", $("#minPrice").html());
			lineData.addField("quantity", $(".quantityhtml").val());
            lineData.addField("color", $(".colorinput").val());
            //lineData.addField("itemDescription", $(".itemDescriptioninput").val());
            
			var lines=new Records();
			lines.addRecord(lineData);
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
					sinoMobileUI.doOpenCreateOrderPage(poHeaderId,"grouppurchase");
				}else{
					sinoMobileUI.alert("创建订单成功，但返回数据有错！");	
				}
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
		detail.subCount=function(){
			if( $(".colorinput").val()=='') {
				sinoMobileUI.alert("请选择颜色");	
				return;
			}
			var g = $(".quantityhtml");
			var f = g.val();
			var e = parseInt(f) - 1;
			if (e > 999) {
				e = 999 
			}
			if (e <= 0) {
				e = 1
			};
			
			if(e<minOrderQuantity){
				sinoMobileUI.alert("不能小于最小数量"+minOrderQuantity);
				g.val(minOrderQuantity);
			}else{
				g.val(e);
			}
		};
		detail.addCount=function(){
			if( $(".colorinput").val()=='') {
				sinoMobileUI.alert("请选择颜色");	
				return;
			}
			var g = $(".quantityhtml");
			var f = g.val();
			var e = parseInt(f) + 1;	
			//qyj 2016-2-24
			if( vendorConfigFlg=='1') {
				if(e>kucun) {
					sinoMobileUI.alert("不能超过库存数：" + kucun);
					g.val(kucun);
				} else {
					if(e>maxQuantity){
						sinoMobileUI.alert("不能大于最大数量"+maxQuantity);
						g.val(maxQuantity);
					}else{
						g.val(e);
					}
				}
			} else {
				if (e > 999) {
					e = 999; 
				}
				if (e <= 0) { 
					e = 1;
				}
				if(e>maxQuantity){
					sinoMobileUI.alert("不能大于最大数量"+maxQuantity);
				}else{
					g.val(e);
				}
			}
			
				
		};
		//最大数量限制 qyj
		detail.checkMax=function(id) {
			if( $(".colorinput").val()=='') {
						sinoMobileUI.alert("请选择颜色");	
						return;
					}
			var ctl=$(id);
			if(parseInt( ctl.val() )>maxQuantity){
						sinoMobileUI.alert("不能大于最大数量"+maxQuantity);
						ctl.val(maxQuantity);
			}
			if( vendorConfigFlg=='1') {	
				if(parseInt( ctl.val() ) >kucun) {
					sinoMobileUI.alert("不能超过库存数：" + kucun);
					ctl.val(kucun);
				}
			}
		};

		detail.showSaleControl=function(type){
			
			product.showSaleControl(type);
		} 
		detail.closeSaleControl=function(msg){
			product.closeSaleControl();
		} 
        return detail;
    }
}
