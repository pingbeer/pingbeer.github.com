/**
 * 作者：苏尘
 * 版本：v1.0.0
 * 初版时间：2017年6月3日19:24:47
 * 最新修改时间：2017年6月3日
 * 联系：2441191883
 * */
$(function(){
	var oStyle = "";
		oStyle +="  *{margin:0;padding:0;}";
		oStyle +="	.alertMc{position:fixed;width:100%;height:100%;background:rgba(0,0,0,0.6);left:0;top:0;bottom:0;right:0;z-index:998;}";
		oStyle +="	.alertBox{width:26rem;min-height:5rem;background:#fff;border-radius:0.5rem;position:fixed;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);}";
		oStyle +="	.scMcTop{font-weight:normal;font-size:1.6rem;line-height:4rem;text-align:center;color:#09B6F2;position:relative;}";
		oStyle +="	.scMcTop:before{position:absolute;bottom:0;left:0;right:0;width:100%;height:1px;content:'';border-bottom:1px #ebebeb solid;}";
		oStyle +="	.scMcContent{padding:0 1rem;margin:1rem auto;max-height:26rem;overflow-y:auto;font-size:1.2rem;}";
		oStyle +="	.scMcContent p{line-height:1.8rem;color:#333}";
		oStyle +="	.alertBox button{width:100%;height:4rem;display:block;background:none;border:none;color:#09B6F2;font-size:1.4rem;}";
		oStyle +="	.scMcAnimate{-webkit-animation:scMcAnimate 0.3s linear 1;}";
		oStyle +="	@-webkit-keyframes scMcAnimate{";
		oStyle +="		0%{-webkit-transform:translate(-50%,-50%) scale(0.8);opacity:0;}";
		oStyle +="		80%{-webkit-transform:translate(-50%,-50%) scale(1.1);opacity:1;}";
		oStyle +="		100%{-webkit-transform:translate(-50%,-50%) scale(1);opacity:1;}";
		oStyle +="	}";
		oStyle +="	#scClose{display:none;position:absolute;right:0.5rem;top:1rem;background:#ccc;line-height:0;font-size:3rem;color:#666;z-index:9}";
	$("head").append("<style>"+oStyle+"</style>");
	
	var scMcHtml = "";	
		scMcHtml += "<div class='alertMc' style='display:none'>";
		scMcHtml += "	<div class='alertBox'>";
		scMcHtml += "		<i id='scClose'>×</i>";
		scMcHtml += "		<h1 class='scMcTop'></h1>";
		scMcHtml += "		<div class='scMcContent'></div>";
		scMcHtml += "		<button class='scMcBtn'></button>";
		scMcHtml += "	</div>";
		scMcHtml += "</div>";
	$("body").append(scMcHtml);
})
function alertMc(jsn)
{
	//初始化
	$(".alertMc").show();
	$(".scMcTop").html("这里是标题");
	$(".scMcContent").html("这里是内容");
	$(".scMcContent").css("text-align","left");
	$(".scMcBtn").html("确定");
	
	
	var _scMcTitle = jsn.scMcTitle;
	var _scMcContent = jsn.scMcContent;
	var _scMcContentLR = jsn.scMcContentLR;
	var _scMcBtn = jsn.scMcBtn;
	var _animate = jsn.animate;
	var _close = jsn.close;
	var _btnFn = jsn.btnFn;
	var oFn = true;
	var This = this;
	var oNumAlert = 0;
	this.ds=function(){
		if(_animate){
			$(".alertBox").addClass("scMcAnimate");
		};
		if(_close){
			$("#scClose").css("display","block");
		};
		switch(_scMcContentLR){
			case "center":
			 	$(".scMcContent").css("text-align","center")
			  	break;
			case "right":
			  	$(".scMcContent").css("text-align","right")
			  	break;
			default:
			  	$(".scMcContent").css("text-align","left")
			};
		$(".scMcTop").html(_scMcTitle);
		$(".scMcContent").html(_scMcContent);
		$(".scMcBtn").html(_scMcBtn);
		$(".scMcBtn").click(function(){
			if(_btnFn=="close"){
				$(".alertMc").hide();
			}else{
				if(oFn){
					oNumAlert++;
					oFn=false;
					if(oNumAlert==1){
						_btnFn();
					}
					$(".alertMc").hide();
				}
			}
		});
		$("#scClose").click(function(){
			$(".alertMc").hide();
			oFn=false;
		});
	}
};
