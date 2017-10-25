//测试状态，用网页加载，不加载设备
if(sinoMobileConfig.debug){
	window.onload=onDeviceReady;
}else{
	document.addEventListener("deviceready", onDeviceReady, false);
}
//信息提示
document.write("<div id=\"sinoTip\"><div class=\"bg\"></div><div class=\"con\"><span id=\"sinoTipMsg\"></span></div></div></div> ");
if(sinoMobileUtil.isDeveloperMode()){
		document.write("<div class=\"developerMsg\">测试环境</div> ");
}

//确认按钮

document.write("<div class=\"sinoConfirm-bg\"></div>		");
document.write("<div class=\"sinoConfirm\" style=\"display:none\">  ");
document.write("  <div class=\"quit-sys-con\">");
document.write("   	<span id=\"sinoConfirmText\"></span>");
document.write("  </div>");
document.write("  <div class=\"clearfix paybtn-con\">  ");
document.write("  <div  class=\"sinoConfirm-btn-cancel fl\">取消</div>");
document.write("  <div  class=\"sinoConfirm-btn-ok fr\">确定</div>");
document.write(" </div>");
document.write("</div>");

// 设置cordova加载完毕，才可以安全调用cordova方法
function onDeviceReady() {
    //checkConnection();
    document.addEventListener("backbutton", onBackKeyDown, false);
	//页面加载
	if(onPageInit!=null){
		onPageInit();
	}
}

function quitApp() {
    navigator.app.exitApp();
}
function onBackKeyDown() {
    var localurl = window.document.location.href;
    if (localurl.indexOf("login.html") > 0 ) {
       sinoMobileUI.confirm("确定要退出该应用吗？",function(){quitApp();},null);
    } else if (localurl.indexOf("homepage.html") > 0 ||localurl.indexOf("cloudshop/index.html")>0 ) {
        sinoMobileUI.doOpenLoginPage();
    } else {
		if(sinoMobileUtil.pathIsRoot() ){
			sinoMobileUI.confirm("确定要退出该应用吗？",function(){quitApp();},null);
		}else{
			//sinoMobileUI.doOpenHomePage();
			sinoMobileUI.doGoBack();
		}
    }

}