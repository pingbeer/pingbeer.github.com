// JavaScript Document
var glbRootPath="..";

function getAppRootPath(){
    // if(glbRootPath==''){
    //     glbRootPath=getRootPath();
    // }
     return  glbRootPath;
}

function gotoCapturePhoto()
{
    window.location.href=getAppRootPath()+"/others/capturePhotoAndSubmit.html";
}

function gotoBlueToothScan()
{
    window.location.href=getAppRootPath()+"/others/blueToothScan.html";
}
function gotoPending(){
	window.location.href=getAppRootPath()+"/pending/pendingInfo.html";
}
 //file:///android_asset
function gotoHandle(id){
	window.location.href=getAppRootPath()+"/pending/handleBill.html?appid="+id;
}

function gotoBillInfo(id){
	window.location.href=getAppRootPath()+"/pending/billInfo.html?appid="+id;
}

function gotoHomePage(){
	window.location.href=getAppRootPath()+"/homepage/homepage.html";
}

function gotoSetServer(){

	window.location.href=getAppRootPath()+"/setup/serverList.html";
}

function gotoLogin(){
	window.location.href=getAppRootPath()+"/homepage/login.html";
}

