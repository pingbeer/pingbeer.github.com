/**
*  Module: 公共工具函数,用于界面操作及打开页面
*  Author: Jintl
*  Create Time:2015-5-21
*  Last Modify Time: 2015-5-21
*/

/**
* 全局参数
**/
hnctUI={
	createNew:function(){
		var ui={};
		ui.doOpenLoginPage=function(){
			sessionStorage.clear();
			//var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			relatePath=sinoMobileUtil.getClientRootPath();
			document.location.href=relatePath+"login.html";
		}
		ui.doOpen404Page=function(){
			var thisPage=window.document.location.href;
			sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_RELOAD_PAGE,thisPage);
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/public/404.html";
		}
		ui.doOpen404ReloadPage=function(){
			var url=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_RELOAD_PAGE);
			if(sinoMobileUtil.strIsNull(url)){
				uit.doOpenHomePage();
			}else{
				document.location.href=url;
			}

		}
		//打开主页界面
		ui.doOpenHomePage=function(){
			sinoMobileUtil.removeSearchSession();
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/homepage/homepage.html";
		}
		//打开安装数据界面
		ui.doOpenSetupPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"setup.html";
		}
		//打开产品列表界面
		ui.doOpenProductListPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/list/list_all.html";
		}
		//打开筛选条件界面
		ui.doOpenDicFilterPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/list/list_shai.html";
		}
		//打开订单列表界面
		ui.doOpenOrderListPage=function(type){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/order/orderList.html?type="+type;
		}

		//打开字典数据选择界面
		ui.doOpenDicChosePage=function(type){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/list/list_choose.html?type="+type;
		}
		//打开购物车
		ui.doOpenCartPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/shoppingcart/shoppingCart.html";
		}
		//打开产品详情
		ui.doOpenProductInfo=function(itemId,vendorId,vendorType,vendorName){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			var url=relatePath+"apps/product/product.html";
			var parm="&itemId="+itemId+"&vendorId="+vendorId+"&vendorType="+vendorType+"&vendorName="+vendorName;
			document.location.href=url+"?"+parm;
		}
		//打开系统外产品详情
		ui.doOpenSysOutProductInfo = function(itemId,vendorId,vendorType,vendorName){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			var url=relatePath+"apps/product/sysOutProduct.html";
			var parm="&itemId="+itemId+"&vendorId="+vendorId+"&vendorType="+vendorType+"&vendorName="+vendorName;
			document.location.href=url+"?"+parm;
		}
		ui.doOpenCategoryPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/list/category.html";
		}
		ui.doOpenCreateOrderPage=function(poHeaderId,from){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/order/createOrder.html?poHeaderId="+poHeaderId+"&from="+from;
		}
		ui.doOpenOrderLogisticsPage=function(poHeaderId){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/order/logisticsDetail.html?poHeaderId="+poHeaderId;
		}
		//打开订单
		ui.doOpenOrderDetailPage=function(poHeaderId,from,payflag){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			var url=relatePath+"apps/order/orderDetail.html?poHeaderId="+poHeaderId+"&from="+from;
			if(payflag!=null&&(payflag=="true"||payflag==true)){
				url+="&pay=true";
			}
			document.location.href=url;
		}
		//打开退货处理
		ui.doOpenRefundPage=function(poHeaderId,from){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			var url=relatePath+"apps/refund/refund.html";
			var parm="poHeaderId="+poHeaderId+"&from="+from;
			document.location.href=url+"?"+parm;
		}
		ui.doOpenPersonalPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/personal/presonalCenter.html";
		}
		ui.doOpenPersonalAddressListPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/personal/address/addressList.html";
		}
		ui.doOpenPersonalAccountListPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/personal/account/bankList.html";
		}
		ui.doOpenHisListPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/viewHis/viewHis.html";
		}
		ui.doOpenOnhandPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/onhand/onhandQuery.html";
		}
		ui.doOpenConstructionPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/public/morequickButton.html";
			//ui.alert("正在建设中，敬请关注");
		}
		ui.doOpenMyBoxPage=function(){
			/*var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/public/construction.html";	*/
			ui.alert("正在建设中，敬请关注");
		}
		ui.doOpenMyCollectionPage=function(){
			/*var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/public/construction.html";	*/
			ui.alert("正在建设中，敬请关注");
		}
		ui.doOpenSysInItemPage = function(){
			sinoMobileSearch.init();
			homepageLoader.doOpenProductListByPriceRange('0-700');
		}
		ui.doOpenSysOutItemPage = function(){
			sinoMobileSearch.init();
			homepageLoader.doOpenSysOutProductList('sysOutProduct');
		}
		ui.doOpenPeijianPage = function(){
			ui.alert("正在建设中，敬请关注");
		}
		ui.doOpenCuxiaoPage = function(){
			ui.alert("正在建设中，敬请关注");
		}
		ui.doOpenFamilyItemPage = function(){
			ui.alert("正在建设中，敬请关注");
		}
		ui.doOpenDiscoveryPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/find/find.html";
		}
		ui.doOpenTestPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"test.html";
		}
		//add by chenwj 2015/09/07 start
		//打开公告列表页面
		ui.doOpenInfolistPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/info/infoList.html";
		}
		//打开公告详细页面
		ui.doOpenInfoDetailPage=function(publishId){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			var url =relatePath+"apps/info/infoDetail.html";
			var parm="publishId="+publishId;
			document.location.href=url+"?"+parm;
		}
		//add by chenwj 2015/09/07 end
        //订货会
		ui.doOpenDHHPromotePage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/promote/dhhPromote.html";
		}
		ui.doOpenDHHListPage=function(headerId,isImportant,blockName){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			var url=relatePath+"apps/promote/dhhList.html";
			var parm="headerId="+headerId+"&isImportant="+isImportant+"&blockName="+blockName;
			document.location.href=url+"?"+parm;
		}
		ui.doOpenDHHDetailPage=function(vendorId,vendorType,itemId,promoteApplyLineId,promoteApplyHeaderId){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			var url =relatePath+"apps/promote/dhhDetail.html";
			var parm="vendorId="+vendorId+"&vendorType="+vendorType+"&itemId="+itemId+"&promoteApplyLineId="+promoteApplyLineId+"&promoteApplyHeaderId="+promoteApplyHeaderId;
			document.location.href=url+"?"+parm;
		}

		//抢购
		ui.doOpenFlashSalePage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/promote/qianggou.html";
		}
		ui.doOpenFlashSaleDetailPageFromHomepage=function(){

			var idName="#flashSale_1";
			var itemId=$(idName).data("itemId");

			var vendorId=$(idName).data("vendorId");
			var vendorType=$(idName).data("vendorType");
			var lineId=$(idName).data("lineId");
			var promoteEndDate=$(idName).data("promoteEndDate");
			var saleControl=$(idName).data("saleControl");

			ui.doOpenFlashSaleDetailPage(vendorId,vendorType,itemId,lineId,promoteEndDate,saleControl);

		}
		ui.doOpenFlashSaleDetailPage=function(vendorId,vendorType,itemId,promoteApplyLineId,promoteEndDate,saleControl){

			/*if(sinoMobileUtil.getRestTime(promoteEndDate)<=0){
				ui.alert("已过期，不能抢购！");
				return;
			}
			if(!sinoMobileUtil.strIsNull(saleControl)){
				ui.alert(saleControl);
				return;
			}*/
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			var url =relatePath+"apps/promote/qianggouDetail.html";
			var parm="vendorId="+vendorId+"&vendorType="+vendorType+"&itemId="+itemId+"&promoteApplyLineId="+promoteApplyLineId;

			document.location.href=url+"?"+parm;
		}
		//团购
		ui.doOpenGroupSalePage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/promote/tuangou.html";
		}
		ui.doOpenGroupSaleDetailPageFromHomepage=function(){

			var	idName="#groupPurchase_1";
			var itemId=$(idName).data("itemId");
			var vendorId=$(idName).data("vendorId");
			var vendorType=$(idName).data("vendorType");
			var lineId=$(idName).data("lineId");
			ui.doOpenGroupSaleDetailPage(vendorId,vendorType,itemId,lineId);

		}
		ui.doOpenGroupSaleDetailPage=function(vendorId,vendorType,itemId,promoteApplyLineId){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			var url =relatePath+"apps/promote/tuangouDetail.html";
			var parm="vendorId="+vendorId+"&vendorType="+vendorType+"&itemId="+itemId+"&promoteApplyLineId="+promoteApplyLineId;
			document.location.href=url+"?"+parm;
		}
		ui.doGoBack=function(){
			if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
				// IE
				if(history.length > 0){
					window.history.go( -1 );
				}else{
					window.opener=null;
					window.close();
				}
			}else{
				//非IE浏览器
				if (navigator.userAgent.indexOf('Firefox') >= 0 || navigator.userAgent.indexOf('Opera') >= 0
					|| navigator.userAgent.indexOf('Safari') >= 0 || navigator.userAgent.indexOf('Chrome') >= 0
					|| navigator.userAgent.indexOf('WebKit') >= 0){
						if(window.history.length > 1){
							window.history.go(-1);
						}else{
							window.opener=null;
							window.close();
						}
				}else{
					//未知的浏览器
					window.history.go( -1 );
				}
			}
		}
        ui.showEmptyMsg=function(msg){
			if(!sinoMobileUtil.strIsNull(msg)){
				$(".emptyMsg_tips").html(msg);
			}else{
				$(".emptyMsg_tips").html("没有找到数据");
			}
			$(".emptyMsg").show();
		}
		ui.hideEmptyMsg=function(){
			$(".emptyMsg").hide();
		}
		/**
		 * 覆盖弹出框。用固定格式页面显示
		 */
	    ui.alert=function(msg){
			var n=1;
			var lineLen=sinoMobileConfig.CONST_ALERT_MSG_LINE_LEN;
			var strFmt="";
			if(msg.length<=lineLen){
				strFmt=msg;
			}else{
				var strLeft=msg;
				var strRight=msg;

				do{
					strLeft=strRight.substring(0,lineLen);
					strRight=strRight.substring(lineLen,strRight.length);
                    strFmt+=strLeft+"<br/>";
					n=n+1;

				}while(strRight.length>lineLen)
				strFmt+=strRight;
			}

			$("#sinoTipMsg").html(strFmt);
			$("#sinoTip").find(".bg").css("height",(n*3)+"rem");
			$("#sinoTip").fadeIn(1000,function(){setTimeout(function(){$("#sinoTip").fadeOut(1000)},2000)});
		}
		ui.hideConfirm=function(){
			$(".sinoConfirm-bg").hide();
			$(".sinoConfirm").hide();
		}
		ui.confirm=function(msg,confirmCallbackFnc,cancelCallbackFnc){
			$(".sinoConfirm-bg").show();
			$(".sinoConfirm").show();
			$("#sinoConfirmText").html(msg);
			$(".sinoConfirm-btn-cancel").bind('click',function(){sinoMobileUI.hideConfirm();if(cancelCallbackFnc!=null){cancelCallbackFnc()}});
			$(".sinoConfirm-btn-ok").bind('click',function(){sinoMobileUI.hideConfirm();if(confirmCallbackFnc!=null){confirmCallbackFnc()}});
		}
		ui.goFindPasswordPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"zhpassword01.html";
		}
		return ui;
	}
}

var sinoMobileUI=hnctUI.createNew();