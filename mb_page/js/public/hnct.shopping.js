/**
*  Module: shopping
*  Author: Jintl
*  Create Time:2015-5-14
*  Last Modify Time: 2015-6-15"
 *******************************
 * 网上商城处理逻辑，产品、购物车、购物
 * */
var hnctShoppingConfig={
	CONST_CART_NOTHING:"<center>购物车为空...</center>",
	CONST_PRODUCT_NOTHING:"<center>物料列表为空...</center>",
	CONST_ADDRESS_NOTHING:"<center>收货地址列表为空...</center>",
	CONST_BANK_NOTHING:"<center>绑定银行卡列表为空...</center>",
	CONST_SUBMIT_FROM_CREATE:"create",
	CONST_SUBMIT_FROM_ORDER:"order",
	CONST_SUBMIT_FROM_ORDER:"list",
	STATUS_UN_PAY:"UN_PAY",
	STATUS_UN_RCV:"UN_RCV",
	STATUS_REFUND:"REFUND",
	STATUS_COMPLETE:"COMPLETE",
	STATUS_INCOMPLETE:"INCOMPLETE",
	STATUS_CANCEL:"CANCEL",
	STATUS_ALL:"ALL",
	CONST_MSG_ORDER_CONFIRM_PAY:"确认要支付该订单吗？"
}
var hnctShopping={
	createNew:function(){
		var shopping={};
		var totalQuantity=0;
		var totalSummary=0;
		//选准购物车条目
		var editItem=null;
		var selectedItem=null;
		var editQuantity=0;
		var editColor="";
		//选准的银行卡条目
		var selectedAccountItem=null;
		//
		var selectedListItem=null;
		
		var queryType = "SYS_IN";

        //提交来路,1:新增订单确认 2。订单打开 3、列表打开
		var submitFrom="";
		/**
		* 列表页产品列表参数
		**/
		var sendRandomeCodeOk=false;
		var randomeInputIndex=1;

		var ajaxJsonProp={
			//servlet访问接口
			servlet:'',
			//操作参数 act
			act:'',
			//提交服务器参数
			parmData:'',
			//执行成功后的回调函数
			successCallbackFunc:null,
			//失败后回调函数
			errorCallbackFunc:null
		}

		/*****************************************************************
		* 以下为调换服务器数据执行公共函数
		****************************************************************/
		/**
		* a1. 从服务器下载数据
		**/
		shopping.loadDataFromServer=function(){
			var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
			var errorCall=shopping.loadError;
			if(ajaxJsonProp.errorCallbackFunc!=null){
				errorCall=ajaxJsonProp.errorCallbackFunc;
			}

			sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,errorCall);
		};
		/**
		* a2. 加载错误执行回调函数
		**/
		shopping.loadErrorCall=function (result, textStatus, errorThrown,flag){
				shopping.setUIButtonDisabledStatus(false);
				sinoMobileUtil.loadErrorCall(result, textStatus, errorThrown,flag);
		}

		shopping.loadError=function (result, textStatus, errorThrown){
				shopping.loadErrorCall(result, textStatus, errorThrown,false);
		}
		shopping.loadCanReloadError=function (result, textStatus, errorThrown){
				shopping.loadErrorCall(result, textStatus, errorThrown,true);
		}
		shopping.setUIButtonDisabledStatus=function(flag){
			var obj=$("#btnSumbitRefund");
			if(obj!=null){
				obj.attr("disabled",flag);
			}
			obj=$("#btnSubmitOrder");
			if(obj!=null){
				obj.attr("disabled",flag);
			}
			obj=$("#btnPayment");
			if(obj!=null){
				obj.attr("disabled",flag);
			}
			obj=$("#btnSendSMRandomCode");
			if(obj!=null){
				obj.attr("disabled",flag);
			}

			obj=$("#btnOnlinePay");
			if(obj!=null){
				obj.attr("disabled",flag);
			}

			obj=$("#btnOnlineRcv");
			if(obj!=null){
				obj.attr("disabled",flag);
			}

			obj=$("#btnOnlineRefund");
			if(obj!=null){
				obj.attr("disabled",flag);
			}
		}

		/**
		* 1. 加载产品详情
		**/
		shopping.loadProductDetail=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PRODUCT_INFO;
			ajaxJsonProp.act="GET_PHONE_DETAIL";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadProductDetailSuccess;
			ajaxJsonProp.errorCallbackFunc=shopping.loadCanReloadError;
			shopping.loadDataFromServer();
		}
		shopping.loadProductDetailSuccess=function(data){

			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PRODUCT_INFO;
			ajaxJsonProp.act="GET_PHONE_DETAIL";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadProductColorsSuccess;
			shopping.loadDataFromServer();
		}
		/**
		* 2. 加载产品颜色
		**/

		shopping.loadProductColors=function(itemId,vendorId,vendorType){
			var rec=new Record();
			rec.addField("itemId",itemId);
			rec.addField("vendorId",vendorId);
			rec.addField("vendorType",vendorType);
			var param=rec.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PRODUCT_INFO;
			ajaxJsonProp.act="GET_PHONE_DETAIL";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadProductColorsSuccess;
			shopping.loadDataFromServer();
		}

		shopping.loadProductColorsSuccess=function(data){
		   if(data.code=="1"){
				var colorData=sinoMobileUtil.getJsonObjectFromResponseData(data,"productInfoData");
				if(colorData!=null){
					var rec=new Record();
					rec.fromJson(colorData);
					var colors=rec.getValue("phoneColors");
					if(sinoMobileUtil.strIsNull(colors)){
						sinoMobileUI.alert("该产品颜色列表未定义！");
					}else{
						shopping.printColorList(colors);
					}
				}else{
					sinoMobileUI.alert("获取产品颜色列表失败！");
				}
		   }else{
				sinoMobileUI.alert("获取产品颜色列表失败！");
		   }
		}
		shopping.printColorList=function(colors){
			var obj=$("#colorList");
			var arrs=sinoMobileUtil.explode(colors,";");
			var nLen=arrs.length;
			var color=$("#color").html();
			obj.html("");
			for(var nn=0;nn<nLen;nn++){
				if(color==arrs[nn]){
					obj.append("<a class=\"p-color1-s\" onclick=\"sinoShopping.doEditCartColor(this)\">"+arrs[nn]+"</a>");
				}else{
					obj.append("<a class=\"p-color1\" onclick=\"sinoShopping.doEditCartColor(this)\">"+arrs[nn]+"</a>");
				}
			}
			$(".editDetail").show();
		}

		/**
		* 3. 加载是否可以下单
		**/
		shopping.loadCanOrder=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="GET_CAN_ORDER";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadCanOrderSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadCanOrderSuccess=function(recs){


		}
		/**
		* 4. 加载加入购物车
		**/
		shopping.loadAddCart=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_SHOPPING_CART;
			ajaxJsonProp.act="ADD_CART";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadAddCartSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadAddCartSuccess=function(recs){


		}

		/**
		* 5. 加载购物车
		**/
		shopping.loadCartList=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_SHOPPING_CART;
			ajaxJsonProp.act="GET_CART";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadCartListSuccess;
			ajaxJsonProp.errorCallbackFunc=shopping.loadCanReloadError;
			shopping.loadDataFromServer();
		}
		shopping.loadCartListSuccess=function(data){
		  var template=$("#template");
		  var template2=$("#template2");
		  var cartList=$("#cartList");
		  $("#totalQuantity").html("0");
		  $("#totalSummary").html("0.0");
		  if(data.code=="1"){
		  		$("#cartList").html("");
				var recs=sinoMobileUtil.getRecordsFromResponseData(data,"shoppingCartsData");
				if(recs!=null&&recs.getLength()>0){
					var nLen=recs.getLength();
					var rec=null;
					var html="";
					var templateHtml=template.html();
					var templateHtml2=template2.html();
					for(var nn=1;nn<=nLen;nn++){
						rec=recs.getNthRecord(nn);
						if("SYS_IN" == queryType){
							html=templateHtml;
						}else if("SYS_OUT" == queryType){
							html=templateHtml2;
						}
						html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
						cartList.append(html+"\r");
						$(".emptyCart").hide();
					}
				}else{
					$(".mb1rem").show();
				}
				$(".onLoad").hide();
			}else{
				sinoMobileUI.alert(data.msg);
			}

		}
		/**
		* 6. 删除购物车
		**/
		shopping.loadDeleteCart=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_SHOPPING_CART;
			ajaxJsonProp.act="DEL_CART";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadDeleteCartSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadDeleteCartSuccess=function(data){
			shopping.setUIButtonDisabledStatus(false);
			if(data.code==1){
				//删除界面数据
				shopping.removeUIItem();
				//更新合计
				shopping.updateUIToatal();

				//如果是选准数据数量减少
				if(shopping.getSelectedItemStatus()){
					var totalQuantity=$("#totalQuantity").html()*1-1;
					$("#totalQuantity").html(totalQuantity);
				}
				//隐藏编辑层
				shopping.doEditCartHide();
			}else{
				sinoMobileUI.alert("删除数据出错！");
			}

		}

		/**
		* 7. 更改购物车
		**/
		shopping.loadUpdateCart=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_SHOPPING_CART;
			ajaxJsonProp.act="UPD_CART";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadUpdateCartSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadUpdateCartSuccess=function(data){
			shopping.setUIButtonDisabledStatus(false);
			if(data.code==1){
				//更新合计
				shopping.updateUIItem();
				shopping.updateUIToatal();
			}else{
				sinoMobileUI.alert("更新购物车失败！");
			}

		}

		/**
		* 8. 供应商联系人
		**/
		shopping.loadVendorContactId=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="GET_VENDOR_CONTACT_ID";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadVendorContactIdSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadVendorContactIdSuccess=function(recs){


		}
		/**
		* 9. 供应订单类型
		**/
		shopping.loadPoType=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="GET_PO_TYPE";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadPoTypeSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadPoTypeSuccess=function(recs){


		}
		/**
		* 10. 创建订单
		**/
		shopping.loadCreateOrder=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="CREATE_ORDER";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadCreateOrderSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadCreateOrderSuccess=function(recs){


		}
		/**
		* 11. 提交订单
		**/
		shopping.loadSubmitOrder=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="SUMBMIT_ORDER";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadSubmitOrderSuccess;
			shopping.loadDataFromServer();
		}
		shopping.opOpenNextPage=function(){
			var from=$.query.get("from");

			if(sinoMobileUtil.strIsNull(from)){
				setTimeout(sinoMobileUI.doOpenCartPage,1000);
			}else{

				if(from=="flashsale"){
					setTimeout(sinoMobileUI.doOpenFlashSalePage,1000);
				}else if(from=="grouppurchase"){
					setTimeout(sinoMobileUI.doOpenGroupSalePage,1000);
				}else if(from=="dhh"){
					setTimeout(sinoMobileUI.doOpenDHHPromotePage,1000);
				}else{
					setTimeout(sinoMobileUI.doOpenCartPage,1000);
				}

			}
		};
		shopping.loadSubmitOrderSuccess=function(data){
			shopping.setUIButtonDisabledStatus(false);
			var needOnlinePay=$("#needOnlinePay").val();
			if(data.code==1){
				$(".orderInfo").hide();
				if(!sinoMobileUtil.strIsNull(needOnlinePay)&&needOnlinePay=="Y"){
					sinoMobileUI.alert("订单支付成功");

					if(shopping.isCreatePage()){
						shopping.opOpenNextPage();
					}else{
						if(sinoMobileUtil.strIsNull(from)){
							setTimeout(sinoMobileUI.doGoBack,1000);
						}else{
							setTimeout("sinoMobileUI.doOpenOrderListPage('"+from+"',null)",1000);
						}
					}
				}else{
					var randomCode=shopping.getInputRandomCode();
					if(sinoMobileUtil.strIsNull(randomCode)){
						shopping.doShowSuccessDiv();
					}else{
						sinoMobileUI.alert("订单支付成功");
						if(shopping.isCreatePage()){
							shopping.opOpenNextPage();
						}else{
							setTimeout(sinoMobileUI.doGoBack,1000);
						}
					}
				}


			}else{
				if(!sinoMobileUtil.strIsNull(needOnlinePay)&&needOnlinePay=="Y"){
					sinoMobileUI.alert("付款失败:"+data.msg);
				}else{
					sinoMobileUI.alert("提交订单失败:"+data.msg);
				}
				//add by chenwj 2015-12-02 start
				//失败后，生效支付按钮
				$("#btnPayment").attr("disabled",false);
				$("#btnPayment").attr("class","pay-btn-card-ok-on fr");
				//add by chenwj 2015-12-02 end
			}
		}

		/**
		* 12. 从购物车创建订单
		**/
		shopping.loadCreateOrderFromCart=function(data){
			var param=sinoMobileUtil.strIsNull(data)?"":data.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="CREATE_ORDER_FROM_CART";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadCreateOrderFromCartSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadCreateOrderFromCartSuccess=function(data){
			shopping.setUIButtonDisabledStatus(false);
			if(data.code=="1"){
				var obj=sinoMobileUtil.getJsonObjectFromResponseData(data,"orderData");
				if(obj==null){
					sinoMobileUI.alert("创建订单失败！返回数据不正确！");
				}else{
					var poHeaderId=obj.poHeaderId;
					if(poHeaderId==null){
						sinoMobileUI.alert("创建订单失败！返回数据不正确,没有返回订单头ID！");
					}else{
						sinoMobileUI.doOpenCreateOrderPage(poHeaderId,"");
					}
				}
			}else{
				sinoMobileUI.alert("创建订单失败！"+data.msg);
			}
		}

		/**
		* 13. 加载订单确认信息
		**/
		shopping.loadCreateOrderInfo=function(poHeaderId){
			var param="{\"poHeaderId\":\""+poHeaderId+"\"}";
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="GET_INCOMPLET_ORDER";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadCreateOrderInfoSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadCreateOrderInfoSuccess=function(data){
			if(data.code=="1"){
			   shopping.printCreateOrderInfo(data);
			}else{
				sinoMobileUI.alert("订单确认信息加载失败！"+data.msg);
			}


		}
		shopping.printCreateOrderInfo=function(data){
			var orderData=sinoMobileUtil.getJsonObjectFromResponseData(data,"orderData");
			var lineData=orderData.lineData;
			var nLen=0;
			if(lineData!=null&&lineData.length>0){
				var template=$("#template");
				var productList=$("#productList");
				var recs=new Records();
				recs.fromJson(lineData);

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
			$("#quantity").html(nLen);
			$(".onLoad").hide();
			$(".contentDetail").show();
			var neetPayAmount=orderData.neetPayAmount;
			if(sinoMobileUtil.strIsNull(neetPayAmount)){
				neetPayAmount=orderData.realityPayAmount;
			}
			$("#neetPayAmount").html(neetPayAmount);
			$("#realityPayAmount").html(orderData.realityPayAmount);
			$("#payRealityPayAmount").html(orderData.realityPayAmount);
			$("#realityPayAmountDisplay").html(orderData.realityPayAmount);


			$("#rcvContact").html(orderData.rcvContact);
			$("#rcvContactPhone").html(orderData.rcvContactPhone);
			$("#rcvSiteAddress").html(orderData.rcvSiteAddress);
			$("#segment1").html(orderData.segment1);
			$("#needOnlinePay").val(orderData.needOnlinePay);
			$("#authorizationStatus").val(orderData.authorizationStatus);
			$("#payGatherOrder").val(orderData.payGatherOrder);
			$("#poHeaderId").val(orderData.poHeaderId);

			$("#vendorType").val(orderData.vendorType);

		}
		/**
		* 14. 加载收货地址
		**/
		shopping.loadRcvAddress=function(){
			$(".onLoad").show();
			var param="";
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_RCV_ADDRESS;
			ajaxJsonProp.act="GET_ALL_ADDRESS";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadRcvAddressSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadRcvAddressSuccess=function(data){
			if(data.code=="1"){
				shopping.printRcvAddress(data);
			}else{
				$(".orderInfo").show();
				sinoMobileUI.alert("加载收货地址列表失败！"+data.msg);
			}
			$(".onLoad").hide();

		}
		/**
		* 打印收货地址列表
		**/
		shopping.printRcvAddress=function(data){
			var recs=sinoMobileUtil.getRecordsFromResponseData(data,"addressData");

			var template=$("#addressTemplate");
			var addressList=$("#addressList");
			addressList.html("");
			if(recs!=null&&recs.getLength()>0){
				//清空数据

				var nLen=recs.getLength();
				var rec=null;
				var html="";
				var templateHtml=template.html();

				for(var nn=1;nn<=nLen;nn++){
					rec=recs.getNthRecord(nn);
					html=templateHtml;
					if(rec.getValue("isDefault")=="Y"){
						rec.addField("addressClass","address_top1");
						rec.addField("hot","<i></i>");
					}else{
						rec.addField("addressClass","address_top");
						rec.addField("hot","");
					}
					html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);

					addressList.append(html+"\r");
				}
			}else{
				addressList.append(hnctShoppingConfig.CONST_ADDRESS_NOTHING);
			}
			$(".onLoad").hide();


			$("#pickAddress").show();
		}
		/**
		* 15 请求绑定银行卡
		**/
		shopping.loadBankList=function(){
			$(".onLoad").show();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_BANK_LIST;
			ajaxJsonProp.act="GET_BANK_LIST";
			ajaxJsonProp.parmData="";
			ajaxJsonProp.successCallbackFunc=shopping.loadBankListSuccess1;
			shopping.loadDataFromServer();
		}
	    shopping.loadBankList2=function(){
			$(".onLoad").show();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_BANK_LIST;
			ajaxJsonProp.act="GET_BANK_LIST";
			ajaxJsonProp.parmData="";
			ajaxJsonProp.successCallbackFunc=shopping.loadBankListSuccess2;
			shopping.loadDataFromServer();
		}
		shopping.loadBankListSuccess1=function(data){
			shopping.loadBankListSuccess(true,data)
		}
		shopping.loadBankListSuccess2=function(data){
			shopping.loadBankListSuccess(false,data)
		}
		shopping.loadBankListSuccess=function(flag,data){
		   if(data.code=="1"){
				var bankData=sinoMobileUtil.getJsonObjectFromResponseData(data,"bankData");
				var recs=new Records();
				recs.fromJson(bankData);
				var template=$("#bankTemplate");
				var bankList=$("#bankList");
				bankList.html("");
				if(recs!=null&&recs.getLength()>0){
					//清空数据

					var nLen=recs.getLength();
					var rec=null;
					var html="";
					var templateHtml=template.html();
					var logoUrl="";
					for(var nn=1;nn<=nLen;nn++){
						rec=recs.getNthRecord(nn);
						html=templateHtml;
						//var bankBindId=rec.getValue("bankBindId");
						var logoUrl=rec.getValue("bankCode")+".jpg";
						//logoUrl=logoUrl.replaceAll("/dz/images/payhandle/bankImg/","");
						//logoUrl=logoUrl.replaceAll(".gif",".jpg");
						if(flag){
							rec.setField("logoUrl","../../images/bank/"+logoUrl);
						}else{
							rec.setField("logoUrl","../../../images/bank/"+logoUrl);
						}
						html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
						//if(rec.getValue("isDefault")=="Y"){
						//	html=html.replace("address_top","address_top_on");
						//}
						bankList.append(html+"\r");
					}
				}else{
					bankList.append(hnctShoppingConfig.CONST_BANK_NOTHING);
				}
				$(".onLoad").hide();
				$(".bankListInfo").show();

				//$("#pickAddress").show();

		   }else{
			    shopping.doShowSuccessDiv();
				sinoMobileUI.alert("获取绑定银行卡列表失败！");
		   }
		}


		/**
		* 16 订单撤销
		**/

		shopping.loadCancelOrder=function(poHeaderId,authorizationStatus){
			var param=new Record();
			param.addField("poHeaderId",poHeaderId);
			param.addField("authorizationStatus",authorizationStatus);
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="CANCEL_ORDER";
			ajaxJsonProp.parmData=param.toJsonString();
			ajaxJsonProp.successCallbackFunc=shopping.loadCancelOrderSuccess;
			shopping.loadDataFromServer();
		}

		shopping.loadCancelOrderSuccess=function(data){
		   shopping.setUIButtonDisabledStatus(false);
		   if(data.code=="1"){
				shopping.opOpenNextPage();
		   }else{
			    sinoMobileUI.alert("订单撤销失败 ："+data.msg);
		   }
		}
		/**
		* 16 获取短信验证码
		**/

		shopping.loadSendSMSRandomCode=function(poHeaderId,bankBindId){
			var param=new Record();
			param.addField("poHeaderId",poHeaderId);
			param.addField("bankBindId",bankBindId);
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="GET_PAY_RANDOM_CODE";
			ajaxJsonProp.parmData=param.toJsonString();
			ajaxJsonProp.successCallbackFunc=shopping.loadSendSMSRandomCodeSuccess;
			shopping.loadDataFromServer();
		}

		shopping.loadSendSMSRandomCodeSuccess=function(data){
		   shopping.setUIButtonDisabledStatus(false);
		   if(data.code=="1"){
			   sendRandomeCodeOk=true;
			   sinoMobileUI.alert("发送短信验证码成功！");
			   $(".pay-btn-card-ok").attr("class","pay-btn-card-ok-on fr");
		   }else{
			    sinoMobileUI.alert("发送短信验证码失败 ："+data.msg);
		   }
		}
		/**
		* 17 收货处理
		**/

		shopping.loadConfirmRcv=function(type,poHeaderId,poLineId,batchId){
			var param=new Record();
			param.addField("poHeaderId",poHeaderId);
			if(!sinoMobileUtil.strIsNull(poLineId)){
				param.addField("poLineId",poLineId);
			}
			if(!sinoMobileUtil.strIsNull(batchId)){
				param.addField("batchId",batchId);
			}
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_RCV;
			ajaxJsonProp.act="CONFIME_RCV";
			ajaxJsonProp.parmData=param.toJsonString();
			if(type=="list"){
				ajaxJsonProp.successCallbackFunc=shopping.loadConfirmRcvFromListSuccess;
			}else{
				if(sinoMobileUtil.strIsNull(poLineId)){
					ajaxJsonProp.successCallbackFunc=shopping.loadConfirmRcvSuccess;
				}else{
					ajaxJsonProp.successCallbackFunc=shopping.loadConfirmRcvLineSuccess;
				}
			}
			shopping.loadDataFromServer();
		}

		shopping.loadConfirmRcvSuccess=function(data){
			shopping.setUIButtonDisabledStatus(false);
		    if(data.code=="1"){
				sinoMobileUI.alert("订单接收成功！");

				var from=$.query.get("from");
				if(sinoMobileUtil.strIsNull(from)){
					setTimeout("sinoMobileUI.doOpenOrderListPage('UN_RCV',null)",1000);
				}else{
					setTimeout("sinoMobileUI.doOpenOrderListPage('"+from+"',null)",1000);
				}
				//setTimeout("sinoMobileUI.doGoBack()",1000);
		   }else{
			    sinoMobileUI.alert("订单接收失败："+data.msg);
		   }
		}
		shopping.loadConfirmRcvFromListSuccess=function(data){
			shopping.setUIButtonDisabledStatus(false);
		    if(data.code=="1"){
				sinoMobileUI.alert("订单接收成功！");
				//成功后删除界面条目
				$(selectedListItem).remove();
				//setTimeout("sinoMobileUI.doGoBack()",1000);
		   }else{
			    sinoMobileUI.alert("订单接收失败："+data.msg);
		   }
		}
		shopping.loadConfirmRcvLineSuccess=function(data){
			shopping.setUIButtonDisabledStatus(false);
		    if(data.code=="1"){
				$(".orderDetail-seq").hide();
				sinoMobileUI.alert("订单行接收成功！");
		   }else{
			    sinoMobileUI.alert("订单行接收失败："+data.msg);
		   }
		}

		/**
		* 18 创建退货
		**/

		shopping.loadRefundData=function(poHeaderId){
			var param=new Record();
			param.addField("poHeaderId",poHeaderId);

			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_REFUND;
			ajaxJsonProp.act="GET_REFUND_DATA";
			ajaxJsonProp.parmData=param.toJsonString();
			ajaxJsonProp.successCallbackFunc=shopping.loadRefundDataSuccess;
			shopping.loadDataFromServer();
		}

		shopping.loadRefundDataSuccess=function(data){
		   if(data.code=="1"){
				shopping.printRefundData(data);
		   }else{
			    sinoMobileUI.alert("退款申请失败："+data.msg);
		   }
		}
		shopping.printRefundData=function(data){
			var dataOrder=sinoMobileUtil.getJsonObjectFromResponseData(data,"orderData");
			if(dataOrder!=null){
				$("#segment1").html(dataOrder.segment1);
				$("#creationDate").html(dataOrder.creationDate);
				$("#realityPayAmountTitle").html("￥"+dataOrder.realityPayAmount);
				$("#realityPayAmount").val(dataOrder.realityPayAmount);
				$("#maxRefund").html("（最多"+dataOrder.realityPayAmount+"元）");
				//打印订单行列表
				var dataLine=dataOrder.lineData;
				if(dataLine!=null){
					var recs=new Records();
					recs.fromJson(dataLine);
					shopping.printOrderLinesHtml(recs);
				}
				//打印退款原因列表
				var reasonList=sinoMobileUtil.getJsonObjectFromResponseData(data,"refundReason");

				if(reasonList!=null){
					var recsReason=new Records();
					recsReason.fromJson(reasonList);
					shopping.printReasonList(recsReason);
				}
				$(".onLoad").hide();
				$("#refundContent").show();
			}else{
				sinoMobileUI.alert("加载退款申请信息时出错！");
			}

		}
		shopping.printOrderLinesHtml=function(recs){
			if(recs==null||recs.getLength()==0){
				return "";
			}
			var linesHtml="";
			var nLines=recs.getLength();
			var line=null;

			for(var jj=1;jj<=nLines;jj++){
				line=recs.getNthRecord(jj);
				if(jj>1){
					linesHtml+="<span class=\"blankw1rem\"></span>";
				}
				linesHtml+="<a ><img src=\""+line.getValue("ImgURL")+"\"></a>";
			}

			$("#lineHtml").html(linesHtml);
		}
		shopping.printReasonList=function(recs){
			if(recs==null||recs.getLength()==0){
				return "";
			}
			var templateHtml=$("#templateReason").html();

			var nLines=recs.getLength();
			var rec=null;
			var reasonList=$("#reasonList");
			var html="";
			for(var jj=1;jj<=nLines;jj++){
				rec=recs.getNthRecord(jj);
				html=templateHtml;
				html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
				reasonList.append(html+"\r");
			}
		}
		/**
		* 19 退货提交
		**/

		shopping.loadSubmitRefund=function(rec){
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_REFUND;
			ajaxJsonProp.act="SUBMIT_REFUND";
			ajaxJsonProp.parmData=rec.toJsonString();
			ajaxJsonProp.successCallbackFunc=shopping.loadSubmitRefundSuccess;
			shopping.loadDataFromServer();
		}

		shopping.loadSubmitRefundSuccess=function(data){
		   shopping.setUIButtonDisabledStatus(false);
		   if(data.code=="1"){
			    sinoMobileUI.alert("退款操作成功！");
				setTimeout("sinoMobileUI.doOpenOrderListPage('"+from+"')",2000);
		   }else{
			    sinoMobileUI.alert("退款申请失败："+data.msg);
		   }
		}
		/*
		* 20 服务器输入校验码
		**/

		shopping.loadValidateRadomCode=function(randomCode,successCallback){
			var parm=new Record();
			parm.addField("randomCode",randomCode);
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="VALIDATE_PAY_RANDOM_CODE";
			ajaxJsonProp.parmData=parm.toJsonString();
			ajaxJsonProp.successCallbackFunc=successCallback;
			shopping.loadDataFromServer();
		}

		/*
		* 21 在线付款
		**/

		shopping.loadOnlinePay=function(rec){
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
			ajaxJsonProp.act="ONLINE_PAY";
			ajaxJsonProp.parmData=rec.toJsonString();
			ajaxJsonProp.successCallbackFunc=shopping.loadOnlinePaySuccess;
			shopping.loadDataFromServer();
		}

		shopping.loadOnlinePaySuccess=function(data){
		   shopping.setUIButtonDisabledStatus(false);
		   if(data.code=="1"){
			    sinoMobileUI.alert("付款操作成功！");
				setTimeout("sinoMobileUI.doOpenOrderListPage('"+from+"')",2000);
		   }else{
			   sinoMobileUI.alert("付款失败！"+data.msg);
		   }
		}

		/***************************************************
		* 以下为界面事件函数或公共函数
		**************************************************/


		/**
		* 判断选择列表中是否供应商名称与供应商类别相同
		**/
		shopping.isSameVendorAndType=function(obj,list){
			if(list.length==1){
				return true;
			}
			var vendorId=$(obj).data("vendorid");
			var vendorType=$(obj).data("vendortype");
			var len=list.length;
			var item=null;
			var flag=true;
			for(var nn=0;nn<len;nn++){
				item=$(list[nn]);
				if(item.data("vendorid")!=vendorId||
					item.data("vendortype")!=vendorType){
					flag=false;
					break;
				}
			}
			return flag;
		}
		/**
		* 根据输入修改实付金额
		**/
		shopping.onChangeCreditRebateAmount=function(obj){
		  var v=$(obj).val();
		  if(!$.isNumeric(v)){
			sinoMobileUI.alert("请输入有效数值！");
			//$(obj).val("");
			return;
		  }
		  var vv=$("#neetPayAmount").html();

		  v=$(obj).val();
		  $("#realityPayAmount").html(vv*1-v*1);
		  $("#realityPayAmountDisplay").html(vv*1-v*1);
		}
		/**
		* 判断元素是否设置为disabled
		**/
		shopping.isDisabledStatus=function(tagId){
			 return shopping.objIsDisabledStatus($("#"+tagId));
		}

		shopping.objIsDisabledStatus=function(obj){
			if(obj==null){
				return false;
			}
			var flag=$(obj).attr("disabled");
			//防止重复提交
			if(!sinoMobileUtil.strIsNull(flag)&&flag=="disabled"){
					return true;
			}
			return false;
		}

		/**
		* 获取当前选准的数据是否被选准
		**/
		shopping.getSelectedItemStatus=function(){
			var obj=$(editItem).parent().find("i");
			if(obj!=null){
				var cls=$(obj).attr("class");
				if(sinoMobileUtil.strIsNull(cls)){
					return false;
				}else{
					if(cls.indexOf("sp_chectbox_on")>=0){
						return true;
					}else{
						return false;

					}
				}
			}else{
				return false;
			}

		}
		/**
		* 地址选择鼠标选准事件（无效）
		**/
		shopping.onFocusRcvAddress=function(obj){
			var selectedItems=$(".address_top1");
			if(selectedItems==null||selectedItems.length==0){
				return;
			}
			var nLen=selectedItems.length;
			for(var ii=0;ii<nLen;ii++){
				$(selectedItems[ii]).attr("class","address_top");
			}
			$(obj).attr("class","address_top1");
		}

		/**
		* 选准收货地址
		**/
		shopping.doSelectRcvAddress=function(obj){
			var rcvContact=$(obj).data("rcvcontact");
			var rcvContactPhone=$(obj).data("rcvcontactphone");
			var rcvSiteAddress=$(obj).data("rcvsiteaddress");

			$("#rcvContact").html(rcvContact);
			$("#rcvContactPhone").html(rcvContactPhone);
			$("#rcvSiteAddress").html(rcvSiteAddress);

			shopping.doHidePickAddress();
		}

		/**
		* 选择或取消购物车产品
		**/
		shopping.onClickCartItem=function(obj){

			var onChecked=false;
			var cls=$(obj).attr("class");
			if(cls.indexOf("sp_chectbox_on")>=0){
				$(obj).removeClass("sp_chectbox_on");
				$(obj).addClass("sp_chectbox");
			}else{
				$(obj).removeClass("sp_chectbox");
				$(obj).addClass("sp_chectbox_on");
				onChecked=true;
			}


			var quantity=$(obj).data("quantity");
			var price=$(obj).data("unitprice");

			if(onChecked){
				var selectedItems=$(".sp_chectbox_on");
				var sameSelected=true;
				var nLen=selectedItems.length;
				//遍历看选准数据是否相同供应商并且相同分类
				for(var ii=0;ii<nLen;ii++){
					if(!shopping.isSameVendorAndType(selectedItems[ii],selectedItems)){
						sameSelected=false;
						break;
					}
				}
				if(!sameSelected){
					sinoMobileUI.alert("请选择相同供应商与相同供应商类型的手机创建订单！");
					$(obj).removeClass("sp_chectbox_on");
					$(obj).addClass("sp_chectbox");
				}else{
					totalQuantity=totalQuantity*1+1;
					totalSummary=totalSummary*1+quantity*price;
					$("#totalQuantity").html(totalQuantity);
					$("#totalSummary").html(totalSummary);
				}
			}else{
				totalQuantity=totalQuantity*1-1;
				totalSummary=totalSummary*1-quantity*price;
				$("#totalQuantity").html(totalQuantity);
				$("#totalSummary").html(totalSummary);
			}
		}

		/**
		* 编辑购物车
		**/
		shopping.doEditCart=function(obj){

			var json=$(obj).data();
			var rec=new Record();
			rec.fromJson(json);

			$("#imgUrl").attr("src",rec.getValue("imgUrl"));
			$("#brandName").html(rec.getValue("brandName"));
			$("#itemName").html(rec.getValue("itemName"));
			$("#vendorName").html(rec.getValue("vendorName"));
			$("#color").html(rec.getValue("color"));
			$("#quantity").html(rec.getValue("quantity"));
			$("#addQuantity").html(rec.getValue("quantity"));
			$("#unitPrice").html(rec.getValue("unitPrice"));
			var itemId=rec.getValue("itemId");
			var vendorId=rec.getValue("vendorId");
			var vendorType=rec.getValue("vendorType");
			//保存临时变量
			editQuantity=rec.getValue("quantity");
			editColor=rec.getValue("color");
			editItem=obj;
            shopping.loadProductColors(itemId,vendorId,vendorType);

		}
		/**
		* 隐藏购物车编辑层
		**/
		shopping.doEditCartHide=function(){

			$(".editDetail").hide();
		}
		/**
		* 确认更新购物车编辑
		**/
		shopping.doEditCartConfirm=function(obj){
			 var cartid=$(editItem).data("cartid");
			 var rec=new Record();
			 rec.addField("cartId",cartid);
			 rec.addField("quantity",editQuantity);
			 rec.addField("color",editColor);
			 //数量为0。则直接删除数据
			 if(editQuantity==0){
				shopping.doConfirmDeleteSelectedCartItem("该物料数量更改为0，确认将从购物车中删除，确认继续吗？");
			}else{
				shopping.loadUpdateCart(rec);
			}
		}
		/**
		* 更改购物车产品数量
		**/
		shopping.doEditCartQuantity=function(obj,flag){
		   var quantity=$("#addQuantity").html();
		   if(flag){
			   quantity=quantity*1+1;
		   }else{
				if(quantity>0){
					quantity=quantity*1-1;
				}
		   }
		   $("#addQuantity").html(quantity);
		   editQuantity=quantity;
		   $("#quantity").html(quantity);
		}

		/**
		* 更改购物车颜色
		**/
		shopping.doEditCartColor=function(obj){
		   var cls=$(obj).attr("class");

		   var parent=$(obj).parent();
		   var children=$(parent).children();
		   var nLen=children.length;
		   for(var nn=0;nn<nLen;nn++){
				$(children[nn]).attr("class","p-color1");
		   }
		   $(obj).attr("class","p-color1-s");
		   editColor=$(obj).html();
		   $("#color").html(editColor);
		}
		shopping.doConfirmDeleteSelectedCartItem=function(msg){
			sinoMobileUI.confirm(msg,shopping.doDeleteSelectedCartItem,null);
		}
		/**
		* 删除购物车
		**/
		shopping.doDeleteSelectedCartItem=function(){
			var cartid=$(editItem).data("cartid");
			var rec=new Record();
			rec.addField("cartId",cartid);
			shopping.loadDeleteCart(rec);
		}
		/**
		* 以下三个函数更新界面显示
		**/
		/**
		* a1.更新界面条目显示及数据
		**/
		shopping.updateUIItem=function(){
			$(editItem).data("quantity",editQuantity);
			$(editItem).data("color",editColor);

			//寻找界面元素更改数据
			//修改界面显示
			var objItem=$(editItem).parent().find(".list-descriptions-wrapper1");
			var objItem=objItem.find(".product-color3");
			if(objItem!=null&&objItem.length==2){
				var obj=objItem[0];
				obj=$(obj).find("span");
				obj.html(editColor);
				obj=objItem[1];
				obj=$(obj).find("span");
				$(obj).html(editQuantity);
				shopping.doEditCartHide();
			}else{
				sinoMobileUI.alert("更新界面数据失败！");
			}
		}
		/**
		* a2.删除界面条目
		**/
		shopping.removeUIItem=function(){
			$(editItem).parent().remove();
		}
		/**
		* a3.更改合计
		**/
		shopping.updateUIToatal=function(){
			/*if(shopping.getSelectedItemStatus()){
				var orgQuantity=$(editItem).data("quantity");
				var orgPrice=$(editItem).data("unitprice");
				var totalSummary=$("#totalSummary").html();
				totalSummary=totalSummary*1-orgQuantity*orgPrice*1+editQuantity*orgPrice*1;
				$("#totalSummary").html(totalSummary);
			}*/
			var objs=$(".sp_chectbox_on");
			var totalQuantity=0;
			var totalSummary=0;
			if(objs==null){
				$("#totalSummary").html(0);
			}else{
				var nLen=objs.length;
				var obj=null;
				var quantity=0;
				var	price=0;
				for(var ii=0;ii<nLen;ii++){
					obj=objs[ii];
					//data 设置后并没有改变值
					///quantity=$(obj).data("quantity");
					quantity=shopping.getSelectItemQuantity(obj);
					price=$(obj).data("unitprice");
					totalSummary=totalSummary*1+quantity*price;
				}

				$("#totalSummary").html(totalSummary);
			}

		}
		shopping.getSelectItemQuantity=function(obj){
			var vv="";
			var objItem=$(obj).parent().find(".list-descriptions-wrapper1");
			var objItem=objItem.find(".product-color3");
			if(objItem!=null&&objItem.length==2){
				var obj=objItem[0];
				obj=$(obj).find("span");
				obj.html(editColor);
				obj=objItem[1];
				obj=$(obj).find("span");
				vv=$(obj).html();
			}
			if(sinoMobileUtil.strIsNull(vv)){
				vv=0;
			}
			return vv;
		}
		/**
		* 从购物车创建订单
		**/

		shopping.doCreateOrderFromCart=function(){
			//防止重复提交
			if(shopping.isDisabledStatus("btnPayment")){
				return;
			}


			var selectedItems=$(".sp_chectbox_on");
			if(selectedItems==null||selectedItems.length==0){
				sinoMobileUI.alert("请选择购物车物料后再进行结算！");
				return;
			}
			var canCreate=true;
			var nLen=selectedItems.length;
			//遍历看选准数据是否相同供应商并且相同分类
			for(var ii=0;ii<nLen;ii++){
				if(!shopping.isSameVendorAndType(selectedItems[ii],selectedItems)){
					canCreate=false;
					break;
				}
			}
			if(!canCreate){
			    sinoMobileUI.alert("请选择相同供应商与相同供应商类型的手机创建订单！");
				return;
			}
			//设置付款按钮失效
			shopping.setUIButtonDisabledStatus(true);
			var itemIds="";
			for(var ii=0;ii<nLen;ii++){
				 if(itemIds!=""){
					itemIds+=",";
				 }
				 itemIds+=$(selectedItems[ii]).data("cartid");
			}
			var rec=new Record();
			rec.addField("cartId",itemIds);
			shopping.loadCreateOrderFromCart(rec);
		}
		/**
		* 订单提交
		**/
		shopping.doSubmitCreateAndPayOrder=function(){
			var randomCode=shopping.getInputRandomCode();
			if(sinoMobileUtil.strIsNull(randomCode)||randomCode.length<6){
				sinoMobileUI.alert("请输入校验码！");
				return;
			}
			//防止重复提交
			if(shopping.isDisabledStatus("btnPayment")){
				return;
			}
			shopping.setUIButtonDisabledStatus(true);
			//校验校验码，成功后执行提交订单
			shopping.loadValidateRadomCode(randomCode,shopping.successValidateRandomCode);
		}
		shopping.successValidateRandomCode=function(data){
			shopping.setUIButtonDisabledStatus(false);
			if(data.code=="1"){
				//add by chenwj 2015-12-02 start
				//验证码验证成功后，失效支付按钮
				$("#btnPayment").attr("disabled",true);
				$("#btnPayment").attr("class","pay-btn-card-ok fr");
				//add by chenwj 2015-12-02 end
				shopping.submitCreateOrderToServer();
			}else{
				sinoMobileUI.alert("校验码输入不正确！");
			}
		}
		/**
		* 提交订单数据到服务器
		**/
		shopping.submitCreateOrderToServer=function(){
			var rec=new Record();
			rec.addField("poHeaderId",$("#poHeaderId").val());
			rec.addField("rcvContactPhone",$("#rcvContactPhone").html());

            //add by chenwj 2016-05-20 start
            var rcvSiteAddress=$("#rcvSiteAddress").html();
			for(var i=1;i<=2;i++) {
	            var typei=$('#deliverType'+i);
	            if(typei.attr("class")=="bank_check_on") {
	                rcvSiteAddress=rcvSiteAddress+" - "+typei.attr("data");
	            }
            }
			rec.addField("rcvSiteAddress",rcvSiteAddress);
			//add by chenwj 2016-05-20 end

			rec.addField("rcvContact",$("#rcvContact").html());
			rec.addField("payGatherOrder",$("#payGatherOrder").val());//add by chenwj 2015/10/25
			rec.addField("neetPayAmount",$("#neetPayAmount").html());
			rec.addField("realityPayAmount",$("#realityPayAmount").html());
			rec.addField("creditRebateAmount",$("#creditRebateAmount").val());
			if(selectedAccountItem!=null){
					rec.addField("bankBindId",$(selectedAccountItem).data("bankbindid"));
			}
			rec.addField("randomCode",shopping.getInputRandomCode());
			rec.addField("payPassword",$.md5(shopping.getInputPayCode()));//add by qyj
			var rand=$("#rand").val(); //add by qyj
			rec.addField("rand",rand);

			shopping.loadSubmitOrder(rec);
		}

		/**
		* 选择收货地址
		**/
		shopping.doPickAddress=function(obj){
			$(".orderInfo").hide();
			var html=$("#addressList").html();
			if(sinoMobileUtil.strIsNull(html)){
				shopping.loadRcvAddress();
			}else{
				$("#pickAddress").show();
			}
		}
		/**
		* 关闭订单
		**/
		shopping.doCancelOrder=function(){
			var poHeaderId=$("#poHeaderId").val();
			var authorizationStatus=$("#authorizationStatus").val();
			sinoMobileUI.confirm("确认要撤销该订单吗？",function(){shopping.loadCancelOrder(poHeaderId,authorizationStatus)},null);
		}
		/**
		* 隐藏地址选择层
		**/
		shopping.doHidePickAddress=function(obj){
			$("#pickAddress").hide();
			$(".orderInfo").show();
		}
		/**
		* 点击设置保存默认收货地址
		**/
		shopping.doSetDefaultRcvAddress=function(obj){


		}
		shopping.doShowSuccessDiv=function(){
			$(".successInfo").show();
			$(".orderInfo").hide();

		}
		shopping.doHideSuccessDiv=function(){
			$(".successInfo").hide();
			$(".orderInfo").show();
			if(shopping.isOrderDetailPage()){
				orderDetail.printFooter();
			}
		}
		shopping.doCancelSuccessDiv=function(){
			sinoMobileUI.doGoBack();
		}
		shopping.isOrderDetailPage=function(){
			var url=document.location.href;
			if(url.indexOf("orderDetail.html")>0){
				return true;
			}else{
				return false;
			}

		}
		/**
		* 付款
		**/
		shopping.doToPay=function(){
			$(".successInfo").hide();
			$(".paymentInfo").show();
		}
		shopping.doCancelToPay=function(){
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
				$(".successInfo").show();
			}

		}
		/**
		* 银行卡界面处理函数
		**/
		shopping.doPickBankList=function(){

			$(".successInfo").hide();
			var html=$("#bankList").html();
			//如果加载过，直接从页面中显示
			if(sinoMobileUtil.strIsNull(html)){
				shopping.loadBankList();
			}else{
				shopping.doUnCheckBank();
				$(selectedAccountItem).find("i").attr("class","pay-check-on");
				$(".bankListInfo").show();
			}
		}
		shopping.doUnCheckBank=function(){
			var selectedItems=$(".pay-check-on");
			if(selectedItems==null||selectedItems.length==0){
				return;
			}
			var nLen=selectedItems.length;
			for(var ii=0;ii<nLen;ii++){
				$(selectedItems[ii]).attr("class","pay-check");
			}
		}

		/**
		 * 关闭银行卡查看层
		 **/
		shopping.doCancelBankList=function(){
			$(".bankListInfo").hide();
			$(".paymentInfo").show();
		}
		shopping.doConfirmPay=function(){
			/*
				是否需要支付，1:必须支付，2:不需要支付，3：可以支付(需确认）
			*/

			var needOnlinePay=$("#needOnlinePay").val();

			//需要支付，先打开支付确认层,
			//说明，以下函数测试开放
			if(!sinoMobileUtil.strIsNull(needOnlinePay)&&needOnlinePay=="1"){
				//shopping.doShowSuccessDiv();
				shopping.doToPay();
			}else if(!sinoMobileUtil.strIsNull(needOnlinePay)&&needOnlinePay=="3"){
				sinoMobileUI.confirm(hnctShoppingConfig.CONST_MSG_ORDER_CONFIRM_PAY,shopping.doToPay,shopping.submitCreateOrderToServer);
				//shopping.doShowSuccessDiv();
			}else{
			    shopping.submitCreateOrderToServer();
			}
		}
		shopping.doSelectBank=function(obj){
			if(obj==selectedAccountItem){
				return;
			}
			selectedAccountItem=obj;

			$("#payRealityPayAmount").html($("#realityPayAmount").html());
			$("#payBankName").html($(obj).data("bankname"));
			$("#payBankCardNoShow").html("("+$(obj).data("bankcardnoshow")+")付款");
			$("#payUserPhoneShow").html($(obj).data("userphoneshow"));

			shopping.doUnCheckBank();
			$(selectedAccountItem).find("i").attr("class","pay-check-on");

			//设置付款按钮无效
			$("#btnPayment").attr("class","pay-btn-card-ok fr");
			shopping.resetInputRandomCode();
		}
		shopping.doConfirmBank=function(){
			var bankCardNo=$("#payBankCardNoShow").html();
			if(!sinoMobileUtil.strIsNull(bankCardNo)){
				$(".bankListInfo").hide();
				$(".paymentInfo").show();
			}

		}
		shopping.doCloseConfirmBank=function(){
			$(".bankListInfo").show();
			$(".paymentInfo").hide();
		}


		shopping.doPickBankList2=function(){
			$(".paymentInfo").hide();
			shopping.doPickBankList();
		}
		/**
        * 创建订单按钮：提交订单 响应事件
		**/
		shopping.doConfirmOrder=function(obj){
			var v=$("#creditRebateAmount").val();
			if(!sinoMobileUtil.strIsNull(v)&&!$.isNumeric(v)){
				sinoMobileUI.alert("请输入有效数值！");
				return;
			}

			var vv=$("#realityPayAmount").html();
			if(vv*1<0){
				sinoMobileUI.alert("挂账返利金额不能大于应付总金额!");
				$("#creditRebateAmount").focus();
				return;
			}

			var rcvSiteAddress=$("#rcvSiteAddress").html();
			var rcvContactPhone=$("#rcvContactPhone").html();
			var rcvContact=$("#rcvContact").html();
			if(sinoMobileUtil.strIsNull(rcvSiteAddress)||
				sinoMobileUtil.strIsNull(rcvSiteAddress)||
				sinoMobileUtil.strIsNull(rcvSiteAddress)){
				sinoMobileUI.alert("请选择有效收货地址与联系方式！");
				return;
		    }

			var rand=$("#rand");
			if(sinoMobileUtil.strIsNull(rand.val())) {
				rand.focus();
				sinoMobileUI.alert("请输入验证码！");
				return;
		    }


			//防止重复提交
			if(shopping.isDisabledStatus("btnSubmitOrder")){
				return;
			}
			shopping.submitCreateOrderToServer();


		}
		shopping.doCancelPayOrder=function(){
			var pay=$.query.get("pay");
			//加载成功后，如果是在线付款，则直接到付款处理操作
			if(pay=="true"||pay==true){
				sinoMobileUI.doGoBack();
			}else{
				shopping.doShowSuccessDiv();
			}
		}
		/**
		* 获取短信验证码
		**/
		shopping.doSendSMSRandomCode=function(obj){
			var bankBindId=$(selectedAccountItem).data("bankbindid");
			if(sinoMobileUtil.strIsNull(bankBindId)){
				sinoMobileUI.alert("请先选择银行卡！");
				return;
			}
			//防止重复发送
			if(shopping.isDisabledStatus("btnSendSMRandomCode")){
				return;
			}


			//重置验证码
			shopping.resetInputRandomCode();
			sendRandomeCodeOk=false;

			shopping.setUIButtonDisabledStatus(true);
			var poHeaderId=$("#poHeaderId").val();


			shopping.loadSendSMSRandomCode(poHeaderId,bankBindId);
		}
		/**
		* 确认收货
		*/
		shopping.doConfirmRcv=function(obj,poHeaderId){
			sinoMobileUI.confirm("确认要收货吗？",function(){shopping.loadConfirmRcv("",poHeaderId,null,null)});
		}

		/**
		* 确认收货,列表操作
		*/
		shopping.doConfirmRcvFromList=function(obj,poHeaderId){
			selectedListItem=$(obj).parent().parent();
			sinoMobileUI.confirm("确认要收货吗？",function(){shopping.loadConfirmRcv("list",poHeaderId,null,null)});
		}

		/**
		* 退款界面处理函数
		**/
		shopping.doPickRefundReason=function(){
			$("#refundReason").show();
		}
		shopping.doCloseRefundReason=function(){
			$("#refundReason").hide();
		}
		shopping.doSelectReason=function(obj){
			$("#refundReason").val($(obj).data("statevalue"));
			$("#refundReasonCode").val($(obj).data("statecode"));
			$("#refundReasonTitle").html($(obj).data("statevalue"));
			shopping.doUnCheckReason();
			$(obj).find("i").attr("class","pay-check-on");
			shopping.doCloseRefundReason();
		}
		/**
		* 根据输入修改实付金额
		**/
		shopping.onChangeRefundAmount=function(obj){
		  var v=$(obj).val();
		  var vv=$("#realityPayAmount").val();
		  vv=vv*1;
		  if(vv<v*1){
			sinoMobileUI.alert("退款金额不能大于支付金额！");
			$(obj).focus();
			return;
		  }
		}
		shopping.doUnCheckReason=function(){
			shopping.doUnCheckBank();
		}
		shopping.doConfirmRefund=function(obj){
			if(shopping.objIsDisabledStatus(obj)){
				return;
			}

			var refundReason=$("#refundReason").val();
			if(sinoMobileUtil.strIsNull(refundReason)){
				shopping.doPickRefundReason();
				return;
			}
			var refundAmount=$("#refundAmount").val();
			if(sinoMobileUtil.strIsNull(refundAmount)||refundAmount==0){
				$("#refundAmount").focus();
				return;
			}
			var v=$("#refundAmount").val();
			var vv=$("#realityPayAmount").val();
			vv=vv*1;
			if(vv<v*1){
				sinoMobileUI.alert("退款金额不能大于支付金额！");
				return;
			}

			$(obj).attr("disabled",true);

			var refundReasonCode=$("#refundReasonCode").val()
			var comments=$("#comments").val();
			var param=new Record();
			param.addField("poHeaderId",poHeaderId);
			param.addField("refundReason",refundReasonCode);
			param.addField("refundAmount",refundAmount);
			param.addField("comments",comments);

			shopping.loadSubmitRefund(param);
		}

		shopping.doRandomeInputKeyUp=function(e){

			/*if(!sendRandomeCodeOk){
				return;
			}*/
			//
			if($('.paymentInfo').is(':visible')){
				var key=e.keyCode||e.which;
				/*if(key==8){
					return;
				}*/
				if(e.target.id.indexOf('randomCode')!=-1) {
					if(key==8){//如果点击删除按键
						if(randomeInputIndex > 1){
							randomeInputIndex = randomeInputIndex - 1;
							$("#randomCode"+randomeInputIndex).click();
							$("#randomCode"+randomeInputIndex).focus();
						}
					}else{
						randomeInputIndex=randomeInputIndex+1;
						if(randomeInputIndex<=6){
							$("#randomCode"+randomeInputIndex).click();
							$("#randomCode"+randomeInputIndex).focus();
						}
					}
				}
				if(e.target.id.indexOf('payCode') != -1) {
					var index = e.target.id.substr(7, 1);
					if(key==8){//如果点击删除按键
						if(index > 1){
							index = index - 1;
							$("#payCode"+index).click();
							$("#payCode"+index).focus();
						}
					}else{
						if(index <= 6){
							index++;
							$("#payCode"+index).click();
							$("#payCode"+index).focus();
						}
					}
				}


			}
		}
		shopping.doRandomeInputKeyDown=function(e){

			/*if(!sendRandomeCodeOk){
				return;
			}*/
			//
			if($('.paymentInfo').is(':visible')){

				var key=e.keyCode||e.which;
				/*if(key==8){
					return;
				}*/

				var chr=String.fromCharCode(key);

				if(!sinoMobileUtil.strIsNull(chr)){
					if(key==8){
						$("#randomCode"+randomeInputIndex).val("");
					}else{
						$("#randomCode"+randomeInputIndex).val(chr);
					}
				}
			}
		}
		//该函数在手机中无效
		shopping.bindingRandomCodeEvents=function(){
			$(document).keyup(function (event) {
				if (event == undefined) {
					event = window.event;
				}
				shopping.doRandomeInputKeyUp(event);
			 });
			$(document).keydown(function (event) {
				if (event == undefined) {
					event = window.event;
				}
				shopping.doRandomeInputKeyDown(event);
			 });

		}
		shopping.doClickRandomeCode=function(index){
			randomeInputIndex=index;
			$("#randomCode"+randomeInputIndex).val("")
		}
		shopping.getInputRandomCode=function(){
			var code="";
			code+=$("#randomCode1").val();
			code+=$("#randomCode2").val();
			code+=$("#randomCode3").val();
			code+=$("#randomCode4").val();
			code+=$("#randomCode5").val();
			code+=$("#randomCode6").val();
			return code;
		}
		shopping.resetInputRandomCode=function(){
			randomeInputIndex=1;
			$("#randomCode1").val("");
			$("#randomCode2").val("");
			$("#randomCode3").val("");
			$("#randomCode4").val("");
			$("#randomCode5").val("");
			$("#randomCode6").val("");
		}
		shopping.validateInputRandomCodeUI=function(){
			if(sinoMobileUtil.strIsNull($("#randomCode1").val())||
				sinoMobileUtil.strIsNull($("#randomCode2").val())||
				sinoMobileUtil.strIsNull($("#randomCode3").val())||
				sinoMobileUtil.strIsNull($("#randomCode4").val())||
				sinoMobileUtil.strIsNull($("#randomCode5").val())||
				sinoMobileUtil.strIsNull($("#randomCode6").val())){
				$("#randomCode1").focus();
				return false;
			}
			return true;

		}
		shopping.getOrderStatus=function(rec){
			var realityPayAmount=rec.getValue("realityPayAmount");
			var onlinePayOrder=rec.getValue("onlinePayOrder");
			var onlinePayStatus=rec.getValue("onlinePayStatus");
			var bnakRemitNumber=rec.getValue("bnakRemitNumber");
			var offlinePay=rec.getValue("offlinePay");
			var reFundSumIng=rec.getValue("reFundSumIng");

			//单据状态
			var authorizationStatus = rec.getValue("authorizationStatus");
			var authorizationStatusName =rec.getValue("authorizationStatusName");
			// 显示按钮的几个状态值判断
			//接收数量
			var  quantityReceivedSum = rec.getValue("quantityReceivedSum");
			//订单数量
			var  quantitySum =  rec.getValue("quantitySum");
			//备货数量
			var  stockUpQtySum =  rec.getValue("stockUpQtySum");


			//1。 待收货
			if(stockUpQtySum*1> 0 &&quantitySum*1>quantityReceivedSum*1){
				return hnctShoppingConfig.STATUS_UN_RCV;
			}
			//2在处理中
			if(authorizationStatus=="INCOMPLETE"){
				// 2.2 未完成
				return hnctShoppingConfig.STATUS_INCOMPLETE;
			}
			if(authorizationStatusName=="已取消"){
				//.2.1 取消
				return hnctShoppingConfig.STATUS_CANCEL;
			}
			//3 待付款
			if(authorizationStatus!="INCOMPLETE" && realityPayAmount*1!=0 &&
				  (sinoMobileUtil.strIsNull(onlinePayOrder)||onlinePayStatus!="交易成功") &&
				  sinoMobileUtil.strIsNull(bnakRemitNumber) &&offlinePay=="N"){

				return hnctShoppingConfig.STATUS_UN_PAY;
			}
			//4 退货
			if(onlinePayOrder!=""&&(onlinePayStatus=="交易成功") && !sinoMobileUtil.strIsNull(reFundSumIng)){
				return  hnctShoppingConfig.STATUS_REFUND;
			}

			//5 其余则全部认为交易成功
			return hnctShoppingConfig.STATUS_COMPLETE;
		}
		/*
		*  是否可查看串号
		*  逻辑: 查看串号按钮的控制逻辑为备货量-接收量>0
		**/
		shopping.canViewSeqNumber=function(rec){

			//stockUpQtySum	备货总数量
			//quantityReceivedSum	接收总量
			var stockUpQtySum=rec.getValue("stockUpQtySum");
			var quantityReceivedSum=rec.getValue("quantityReceivedSum");
			if(sinoMobileUtil.strIsNull(stockUpQtySum)){
				stockUpQtySum=0;
			}
			if(sinoMobileUtil.strIsNull(quantityReceivedSum)){
				quantityReceivedSum=0;
			}
			return stockUpQtySum*1-quantityReceivedSum*1>0?true:false;
		}
        /**
		* 以下为在线付款操作函数
		**/
		//
		shopping.doClickToPayFromCreateOrder=function(obj){
			if($(obj).attr("class").indexOf("pay-btn-card-ok-on")>=0){
				shopping.doSubmitCreateAndPayOrder();
			}else{
				sinoMobileUI.alert("请先获取验证码！");
			}
		}
		shopping.doPayOrderOnline=function(obj){
			//防止重复提交
			if(shopping.isDisabledStatus("btnSubmitOrder")){
				return;
			}
			/*
				是否需要支付，1:必须支付，2:不需要支付，3：可以支付(需确认）
			*/
			var needOnlinePay=$("#needOnlinePay").val();

			//需要支付，先打开支付确认层,
			//说明，以下函数测试开放
			if(!sinoMobileUtil.strIsNull(needOnlinePay)&&needOnlinePay=="1"){
				  shopping.doToPay();
			}else if(!sinoMobileUtil.strIsNull(needOnlinePay)&&needOnlinePay=="3"){
				sinoMobileUI.confirm(hnctShoppingConfig.CONST_MSG_ORDER_CONFIRM_PAY,shopping.doToPay,null);
			}else{
			    shopping.doPayOnlineToServer();
			}
		}
		shopping.doClickToPayFromOrderDetail=function(obj){
			if($(obj).attr("class").indexOf("pay-btn-card-ok-on")<0){
				sinoMobileUI.alert("请先获取验证码！");
				return;
			}

			//防止重复提交
			if(shopping.isDisabledStatus("btnPayment")){
				return;
			}
			var randomCode=shopping.getInputRandomCode();
			if(sinoMobileUtil.strIsNull(randomCode)||randomCode.length!=6){
				sinoMobileUI.alert("请输入有效的验证码！");
				return;
			}
			randomCode=shopping.getInputPayCode();
			if(sinoMobileUtil.strIsNull(randomCode)||randomCode.length!=6){
				sinoMobileUI.alert("请输入有效的支付密码！");
				return;
			}
			shopping.doPayOnlineToServer();
		}
		shopping.doPayOnlineToServer=function(){
			//"bankBindId":"","PayGatherOrder":"","randomCode":""}
			var rec=new Record();
			if(selectedAccountItem!=null){
				rec.addField("bankBindId",$(selectedAccountItem).data("bankbindid"));
			}
			rec.addField("payGatherOrder",$("#payGatherOrder").val());
			rec.addField("randomCode",shopping.getInputRandomCode());
			rec.addField("poHeaderId",poHeaderId);
			rec.addField("payPassword",$.md5(shopping.getInputPayCode()));//add by qyj 2015/10/25
			shopping.loadOnlinePay(rec);
		}
		shopping.doToPayOnline=function(obj){
			//防止重复提交
			if(shopping.objIsDisabledStatus(obj)){
				return;
			}
			var randomCode=shopping.getInputRandomCode();
			if(sinoMobileUtil.strIsNull(randomCode)||randomCode.length<6){
				sinoMobileUI.alert("请输入校验码！");
				return;
			}
			//防止重复提交
			if(shopping.isDisabledStatus("btnPayment")){
				return;
			}
			shopping.setUIButtonDisabledStatus(true);

			//校验校验码，成功后执行提交订单
			shopping.loadValidateRadomCode(randomCode,shopping.successValidateOnlinePayRandomCode);


		}
		shopping.successValidateOnlinePayRandomCode=function(data){
			shopping.setUIButtonDisabledStatus(false);
			if(data.code=="1"){
				orderDetail.doPayOnlineToServer();
			}else{
				sinoMobileUI.alert("校验码输入不正确！");
			}
		}
		shopping.doColseOrderDetail=function(){
			var from=$.query.get("from");
			if(sinoMobileUtil.strIsNull(from)){
				sinoMobileUI.doGoBack();
			}else{
				sinoMobileUI.doOpenOrderListPage(from,null)
			}
		}
		shopping.isCreatePage=function(){
			var thisPage=window.document.location.href;
			return thisPage.indexOf("createOrder.html")>=0?true:false;
		}
		shopping.loadCouponkList=function(){
			$(".onLoad").show();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_COUPON;
			ajaxJsonProp.act="GET_CAN_USE_VOUCHERS";
			var payGatherOrder=$("#payGatherOrder").val();
			var vendorType=$("#vendorType").val();
			var rec=new Record();
			rec.addField("gatherOrder",payGatherOrder);
			rec.addField("vendorType",vendorType);
			rec.addField("channelType","2");
			ajaxJsonProp.parmData=rec.toJsonString();
			ajaxJsonProp.successCallbackFunc=shopping.loadCouponkListSuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadCouponkListSuccess=function(data){
		   if(data.code=="1"){
				var data=sinoMobileUtil.getJsonObjectFromResponseData(data,"vouchesData");
				if(sinoMobileUtil.strIsNull(data)){
					$(".onLoad").hide();
					shopping.doCancelCouponList();
					sinoMobileUI.alert("没有电子券");
					return;
				}
				var recs=new Records();
				recs.fromJson(data);

				var couponLines=$("#couponLines");

				var templateHtml=$("#templateCouponLine").html();
				var nLen=recs.getLength();
				var rec=null;
				var html="";
				for(var ii=1;ii<=nLen;ii++){
					rec=recs.getNthRecord(ii);
					html=templateHtml;
					html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
					couponLines.append(html+"\r");
				}
				$(".rf_con_coupon").show();
				$(".onLoad").hide();

				var total = shopping.summaryCouponPay();
				$("#couponPayAmount").html(total);
		   }else{
				shopping.doCancelCouponList();
				sinoMobileUI.alert("获取电子券失败！");
		   }
		}
		shopping.doPickCouponList=function(){

			$(".paymentInfo").hide();
			$(".orderInfo").hide();
			$("#couponLines").html("");
			shopping.loadCouponkList();
			$(".couponList").show();

		}
		/**
		 * 关闭优惠卡
		 **/
		shopping.doCancelCouponList=function(){
			$(".orderInfo").show();
			$(".paymentInfo").show();
			$(".couponList").hide();
		}
		shopping.onChangeCouponAmount=function(obj){
			/*var v=obj.value;
			if(sinoMobileUtil.strIsNull(v)){
				return;
			}

			v=parseInt(v);
			var count=$(obj).data("qty");
			if(v>count){
				obj.value="";
				sinoMobileUI.alert("输入数量超过了有效张数！");

			}
			*/
			var total=shopping.summaryCouponPay();
			if(total>parseInt($("#neetPayAmount").html())*0.5){
				obj.value="";
				sinoMobileUI.alert("优惠金额"+total+"不能大于合计金额:"+$("#neetPayAmount").html()+"的50%");
				return;
			}

			$("#couponPayAmount").html(total);

		}
		shopping.summaryCouponPay=function(){
			var list=$(".form_coupon_input");
			var len=list.length;
			var obj=null;
			var total=0;
			for(var nn=1;nn<len;nn++){

				obj=list[nn];
				if(sinoMobileUtil.strIsNull(obj.value)){
					obj.value = 0;
				}
				if(obj.value == "" || obj.value == null){
					obj.value = 0;
				}
				total += parseInt(obj.value)*parseInt($(obj).data("facevalue"));
			}
			return total;
		}

		shopping.getCouponPayInfo=function(){
			var list=$(".form_coupon_input");
			var len=list.length;
			if(len<=0){
				return null;
			}
			var obj=null;
			var total=0;
			var headerId="";
			var faceValue="";
			var usedQty="";
			for(var nn=1;nn<len;nn++){
				obj=list[nn];
				if(!sinoMobileUtil.strIsNull(obj.value)){
					if(!sinoMobileUtil.strIsNull(headerId)){
						headerId=headerId+"-";
					}
					headerId+=$(obj).data("headerid");

					if(!sinoMobileUtil.strIsNull(faceValue)){
						faceValue=faceValue+"-";
					}
					faceValue+=$(obj).data("facevalue");

					if(!sinoMobileUtil.strIsNull(usedQty)){
						usedQty=usedQty+"-";
					}
					usedQty+=$(obj).val()+"";

				}
			}

			var rec=new Record();
			var poHeaderId=$("#poHeaderId").val();
			rec.addField("poHeaderId",poHeaderId);
			rec.addField("headerId",headerId);
			rec.addField("faceValue",faceValue);
			rec.addField("qty",usedQty);
			rec.addField("gatherOrder",$("#payGatherOrder").val());
			rec.addField("channelType","2");
			return rec;
		}
		shopping.submitCouponPay=function(){
			var total=shopping.summaryCouponPay();
			if(total>parseInt($("#neetPayAmount").html())*0.5){
				sinoMobileUI.alert("优惠金额"+total+"不能大于合计金额:"+$("#neetPayAmount").html()+"的50%");
				return;
			}

			var rec=shopping.getCouponPayInfo();
			if(rec==null){
				sinoMobileUI.alert("请选择电子券后再提交！");
				return;
			}
			sinoMobileUI.confirm("确认使用电子券支付吗？",function(){shopping.loadCouponkPay(rec);},null);
		}
		shopping.loadCouponkPay=function(rec){
			$(".onLoad").show();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_COUPON;
			ajaxJsonProp.act="USE_VOUCHERS";
			ajaxJsonProp.parmData=rec.toJsonString();
			ajaxJsonProp.successCallbackFunc=shopping.loadCouponkPaySuccess;
			shopping.loadDataFromServer();
		}
		shopping.loadCouponkPaySuccess=function(data){
			$(".onLoad").hide();
		   if(data.code=="1"){
				sinoMobileUI.alert("使用电子券支付成功！");
				var total=shopping.summaryCouponPay();
				//var couponPay=parseInt($("#couponPay").html());

				$("#couponPay").html(total);
				$(".useCouponAmoutHtml").html(total);
				$("#realityPayAmount").html(parseInt($("#neetPayAmount").html())-total);
				$("#payRealityPayAmount").html(parseInt($("#neetPayAmount").html())-total);
				$(".realityPayAmounthtml").text(parseInt($("#neetPayAmount").html())-total);
				$(".useCouponPick").show();
				shopping.doCancelCouponList();
		   }else{
				sinoMobileUI.alert("使用电子券失败！"+data.msg);
		   }
		}
		//qyj add
		shopping.doClickPayCode=function(index){
			$("#payCode"+index).val("");
		}
		//qyj add
		shopping.getInputPayCode=function(){
			var code="";
			code+=$("#payCode1").val();
			code+=$("#payCode2").val();
			code+=$("#payCode3").val();
			code+=$("#payCode4").val();
			code+=$("#payCode5").val();
			code+=$("#payCode6").val();
			return code;
		}
		//add by chenwj 2016-05-20 start
        /*切换配送方式*/
		shopping.changedeliverType =function(n){
            for(var i=1;i<=2;i++) {
                var typei=$('#deliverType'+i);
                if(i==n) {
                    typei.addClass('bank_check_on');
                    typei.removeClass('bank_check');
                } else {
                    typei.addClass('bank_check');
                    typei.removeClass('bank_check_on');
                }
            }
      }
      //add by chenwj 2016-05-20 end
	  shopping.doClickList=function(type,obj){
			//上次未加载完毕，则不响应
			queryType=type;
			if(obj==null){
					if(type=="SYS_IN"){
						obj=$("#sysInList");
					}else if(type=="SYS_OUT"){
						obj=$("#sysOutList");
					}else if(type=="PEIJIAN"){
						obj=$("#peiJianList");
					}else if(type=="PROMOTE_VENDOR"){
						obj=$("#promoteVendorList");
					}else if(type=="FAMILY_ITEM"){
						obj=$("#familyItemList");
					}
			}
			shopping.initAndLoad(obj);
		}
		
		shopping.initAndLoad=function(obj){
			shopping.doSetSelectedStatus(obj);
			var rec=new Record();
			rec.addField("type",queryType);
			var param=rec.toJsonString();
			ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_SHOPPING_CART;
			ajaxJsonProp.act="GET_CART";
			ajaxJsonProp.parmData=param;
			ajaxJsonProp.successCallbackFunc=shopping.loadCartListSuccess;
			shopping.loadDataFromServer();
		}
		
		shopping.doSetSelectedStatus=function(obj){
				if(obj==null){
					return;
				}
				var selectedItems=$(".waitfk-txt-on");
				if(selectedItems==null||selectedItems.length==0){
					return;
				}
				var nLen=selectedItems.length;
				for(var ii=0;ii<nLen;ii++){
					$(selectedItems[ii]).attr("class","waitfk-txt");
				}
				$(obj).attr("class","waitfk-txt-on");
		}
	  return shopping;
	}


}
var sinoShopping=hnctShopping.createNew();