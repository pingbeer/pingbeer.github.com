/*
 *本alert基于alert运行
 * 		链接方法：放在JQuery文件后就OK了
 * 		使用方法：dataAlert("内容");
 * */

var timee = null;
var time_animent = 1500;
function dataAlert(tet){
	$('.datealert').html(tet)
	$('.datealert').show();
	clearInterval(timee);
	timee = setInterval(function(){
		$('.datealert').hide();
	},time_animent)
}


function openStopMc(txt){
	if(txt != ''){
		$(".stopMc").html(txt);
		$(".stopMc").show();
	}
}

function closeStopMc(){
	$(".stopMc").hide();
}
$(function(){
	var oStyle = "";
	oStyle += ".datealert{ width:80%; padding:1rem; box-sizing:border-box; background:rgba(0,0,0,0.6);position:fixed;top:20%;z-index:999;left:10%;color:#fff;font-size:1.2rem;text-align: center; line-height:2rem;display:none;border-radius:0.2rem;}\n";
	oStyle += ".datealert{ -webkit-animation:alert "+(time_animent/1000)+"s ease-out 1;}\n";
	oStyle += "@-webkit-keyframes alert{\n";
	oStyle += "    0%{opacity:0;}\n";
	oStyle += "    10%{opacity:1;}\n";
	oStyle += "    85%{top:20%;opacity:1;}\n";
	oStyle += "    90%{top:16%;opacity:0.5;}\n";
	oStyle += "    100%{top:10%;opacity:0.2;}\n";
	oStyle += "}\n";
	oStyle += "	.stopMc{width:80%;min-height:3rem;background:rgba(0,0,0,0.6);position:fixed;padding:1rem 1.5rem;box-sizing:border-box; left:10%;top:20%;font-size:1.2rem;z-index:999;line-height:1.6rem;color:#fff;text-align:center;-webkit-animation:stopMc 0.3s linear 1;}\n";
	oStyle += "		@-webkit-keyframes stopMc{ \n";
	oStyle += "			0%{ -webkit-transform:translateY(3rem);opacity:0;}\n";
	oStyle += "			100%{ -webkit-transform:translateY(0);opacity:1}\n";
	oStyle += "		}\n";
	$("head").append("<style>"+oStyle+"</style>");
	$("body").append("<div class='datealert'></div><div class='stopMc' style='display: none'></div>");



	$(".mc").show().css({"opacity":"0"});
	setTimeout(function(){
		$(".alert_pic,.five_box,.alert_pic_").each(function(){
			var oWW = $(this).width();
			var oHH = $(this).height();
			console.log(oHH);
			$(this).css({"margin-left":-oWW/2+"px","margin-top":-oHH/2+"px","top":"50%","bottom":"auto"})
		})
		$(".mc").hide().css({"opacity":"1"});
	},10);
})
