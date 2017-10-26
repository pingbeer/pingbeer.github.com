
//自定义下拉列表
var cityMark = true;
$("body").click(function(){	
	$(".foot-zhgl").hide();     
	$(".drop-down").hide();     
	$(".drop-down-s").hide();
	$(".icon-up").removeClass("icon-up").addClass("icon-down");
	
});
$(".dropList").click(function() {
	var thisParent = $(this).find("ul");
	var display = thisParent.css("display");	
	if (display == "none") {
		$(this).children().find(".icon-down").removeClass("icon-down").addClass("icon-up");
	} else {
		$(this).children().find(".icon-up").removeClass("icon-up").addClass("icon-down");
	}
	thisParent.toggle();
	return false;
        
});
$(".drop-down li").click(function() {
	
	var value = $(this).text();
	var value1 = $(this).parent().parent().find(".dropText-color");
	var parentData = $(this).parent().parent().parent();
	var thisValue = $(this).attr("value");
	parentData.attr("choose-data",thisValue);
	value1.text(value);
	$(this).parent().hide();
	$(this).parent().parent().find(".up").children().removeClass("icon-up").addClass("icon-down");
	$(".mxd-container").show();
	if(value == "国内"){
		cityMark =true;
		sessionStorage.setItem("scopeType","国内");
		window.location.href ="../template/city-start.htm";
		//$(".mxd-container").load("../template/city.htm");
		
		//getList(value);
	}else{
		cityMark =false;
		sessionStorage.setItem("scopeType","国际");
		sessionStorage.setItem("setStart","北京");
		window.location.href ="../template/city-end-foreign.htm";
		//$(".mxd-container").load("../template/city-end.htm");
	}	
	return false;

});
$("#dropList").click(function() {
	var thisParent = $(this).parent().find("section");
	var display = thisParent.css("display");
	thisParent.toggle();
	return false;	        
});



