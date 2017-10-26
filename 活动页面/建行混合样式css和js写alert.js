/*
 *本alert基于alert运行
 * 		链接方法：放在JQuery文件后就OK了
 * 		使用方法：dataAlert("内容");
 * */

var timee = null;
var time_animent = 1500;
function dataAlert(tet){
    clearInterval(timee);
    $('.datealert').html(tet)
    $('.datealert').show();
    timee = setInterval(function(){
        $('.datealert').hide();
    },time_animent)
}

$(function(){
	var oStyle = "";
	oStyle += ".datealert{ width:80%; padding:1rem; box-sizing:border-box; background:rgba(0,0,0,0.6);position:fixed;top:20%;z-index:999;left:10%;color:#fff;font-size:1.2rem;text-align: center; line-height:2rem;display:none;border-radius:0.2rem;}\n";
	oStyle += ".datealert{ -webkit-animation:alert "+(time_animent/1000)+"s ease-out 1;}\n";
	oStyle += "@-webkit-keyframes alert{\n";
	oStyle += "    0%{ opacity:0; }\n";
	oStyle += "    10%{ opacity:1; }\n";
	oStyle += "    85%{ top:20%;opacity:1; }\n";
	oStyle += "    90%{ top:16%;opacity:0.5; }\n";
	oStyle += "    100%{ top:10%;opacity:0.2; }\n";
	oStyle += "};";
	$("head").append("<style>"+oStyle+"</style>");
	$("body").append("<div class='datealert'></div>");
})

