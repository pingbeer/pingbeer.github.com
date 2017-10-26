// 同步ajax请求，带有蒙层效果
function ajaxRequest(maskNode,url, type, jsonData){
	maskNode.mask("获取数据中...");
	var url2 = url + ((url.indexOf("?") == -1) ? "?" : "&");
	try{
		var handler = {
				url : url2+"timestamp="+(new Date()).getTime(),
				type : type,
				async : false,
				dataType : "json",
				success : function(response){
				},
				error:function(response){
					
				}
			};
		if(jsonData){
			handler.dataType = jsonData;
			handler.type = "POST";
		}
		var result = $.ajax(handler).responseText;
	}catch(e){
	
	}
	maskNode.unmask();
	return result;
}

var SUCCESS_CODE = "0000";

var FAILED_CODE = "9999";

//手机号码正则式
var MOBILE_REGEX = /^((13[0-9])|(14[57])|(15[012356789])|(17[678])|(18[0-9]))\d{8}$/;
//var MOBILE_REGEX = /^((13[0-9])|(14[57])|(15[^4,\d])|(17[678])|(18[0-9]))\d{8}$/;
//var MOBILE_REGEX = /^(0|86|17951)?((13[0-9])|(14[57])|(15[012356789])|(17[678])|(18[0-9]))[0-9]{8}$/;


// 倒计时，单位（秒）
var INTERVAL_TIMES = 120;

function contextPath(){
	return $("#ctx").val();
}

function getSmsIntTimes(){
	var times = $("#intervalTimes").val();
	if(times && isNaN(times))
		times = INTERVAL_TIMES;
	return times;
}

//显示错误信息
function show_error(message,isScroll){
	$(".code_err_tips span").text(message);
	$(".code_err_tips").css("visibility","visible");
	$(".code_tips").hide();
	
	if(isScroll){
		setTimeout(function(){
			window.scrollTo(0,999999);
		},300);
	}
}
function hide_error(){
	$(".code_err_tips").css("visibility","hidden");
}

/**
 * 使可发送短信，没有手机号码
 */
function enableSendSmsCode() {
	$('.btn_a').show();
	$('.btn_span').hide();
}

/**
 * 发送中，没有手机号码
 */
function disabledSendSmsCode() {
	$('.btn_span').text("发送中...");
	$('.btn_a').hide();
	$('.btn_span').show();
	
}

 /**
 * 发送验证码倒计时器，没有手机号码
 * @param time 计时器,（单位秒）
 */
function sendSmsTimeout(time) {
	 if ($('.btn_a').is(":visible") || time == 0) {
		 enableSendSmsCode();
		 return false;
	 } else {
		 $('.btn_span').text(time+"秒");
		 setTimeout('sendSmsTimeout(' + (time - 1) + ')', 1000);
	 }
}

//------------------- 参数校验 -------------------
/**
 * 检查字符串的最大长度
 */
function checkMaxLen(value,maxLen){
	if(value && value!=null && value.toString().length <= maxLen)
		return true;
	return false;
}

function checkLen(value,minLen,maxLen){
	if(value && value!=null && 
			value.toString().length >= minLen && 
			value.toString().length <= maxLen)
		return true;
	return false;
} 

/**
* 判断是否由数字组成
* @param value 字符串
* @param range
* @return
*/
function isNumber(value,range){
	 var re = new RegExp("^[\\d]{" + range+"}$","ig");
	 return re.test(value);
}

function isNUM(value){
	return ! isNaN(Math.abs(value));
}

/**
 * 判断是否由6位数字组成
 * @param value 字符串
 * @param range
 * @return
 */
function isNumber6(value){
	 var re = new RegExp("^[\\d]{6}$","ig");
	 return re.test(value);
}

/**
 * 判断字符串是否只含有数字，英文，中文，空格(还有中英文逗号，分隔号)
 * @param value 字符串
 * @param range 字符串长度范围，如果是指定长度，如长度为10："10"，或者长度不为空并且不大于10："1,10"
 * @return
 */
function isNumEngZH(value,range){
	var re = new RegExp("^[A-Za-z\\d\\u4E00-\\u9FA5  ，,。.,!！?？；;]{" + range+"}$","ig");
	return re.test(value);
}


String.prototype.trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g,"");
};

// ----- 下单 ------
var has_submit_order_flag = false;
function addOrder(addrId,orderDesc,invoice,cardNo,smsCode,pageType){
	hide_error();
	
	//选择地址id
	var addrId = $.trim(addrId);
	//商户留言
	var orderDesc = $.trim(orderDesc);
	//发票抬头
	var invoice = $.trim(invoice);
	//选中卡号
	var cardNo = $.trim(cardNo);
	//短信验证码
	var smsCode = $.trim(smsCode);
	
	if(isNaN(Math.abs(addrId))){
		show_error('地址编号只能是数字！',("WAP" == PAGE_TYPE));
		return false;
	}
	
	/*if(isNaN(Math.abs(cardNo))){
		alert('卡号编号只能是数字！');
		return false;
	}*/
	
	if(orderDesc.length>0 && !isNumEngZH(orderDesc,"0,100")){
		show_error('商户留言只能包含中文、字母、数字，空格，长度介于1~100！',("WAP" == PAGE_TYPE));
		return false;
	}
	
	if(invoice.length>0 &&  !isNumEngZH(invoice,"0,100")){
		show_error('发票抬头只能包含中文、字母、数字，空格，长度介于1~100！',("WAP" == PAGE_TYPE));
		return false;
	}
	
	if(!isNumber6(smsCode)){
		show_error('短信验证码只能是6位数字！',("WAP" == PAGE_TYPE));
		return false;
	}
	
	var otherCards = [];
	//积分下单
	if($("#cards_list").find(".point-usable").length > 0){
		$(".point-usable.on").each(function(){
			var cardNo 		= $(this).find(".availCard").text().trim();
			var cardPoint 	= Math.abs($(this).find(".koujf").text().trim());
			otherCards.push(cardNo+";"+cardPoint);
		});
	}
	
	orderDesc = encodeURIComponent(orderDesc);
	invoice = encodeURIComponent(invoice);
	
	var queryStr = "?addrId="+addrId+"&orderDesc="+orderDesc+"&invoice="+invoice;
	queryStr = queryStr+"&cardNo="+cardNo+"&smsCode="+smsCode;
	
	if(otherCards && otherCards.length >0 ){
		queryStr += "&otherCards="+otherCards;
	}
	var url = contextPath()+"/dopay"+queryStr;
	//alert("url = "+url);
	
	try{
		if(!has_submit_order_flag){
			has_submit_order_flag = true;
			var result = JSON.parse(ajaxRequest($("body"),url, "GET"));
			
			if(result.fluxErrorCode && result.fluxErrorCode == "02"){
				window.location.href = result.errorInfo;
				return;
			}
			// 处理成功,页面跳转
			if(SUCCESS_CODE == result.retCode){
				var succMsg = result.data;
				//console.log(succMsg);
				window.location.href = contextPath()+"/toSuccPage";
				return false;
			}else{
				has_submit_order_flag = false;
				show_error(result.retMess,("WAP" == PAGE_TYPE));
			}
		}else{
		}
	}catch(err){		
		has_submit_order_flag = false;
	}
}

function formAjax(formSelector,successCallback,failedCallback){
	var paramArr = $(formSelector).serializeArray();
	var paramMap = {};
	$.each(paramArr,function(){
		if(paramMap[this.name] !== undefined){
			//如果有同名参数，则存在格式转化为数组
			if(!paramMap[this.name].push){
				paramMap[this.name] = [paramMap[this.name]];
			}
			paramMap[this.name].push(this.value || "");
		}else{
			paramMap[this.name] = this.value || "";
		}
	});
	
	//console.log(paramMap);
	
	$.ajax({
		url:$(formSelector).attr("action"),
		type:$(formSelector).attr("method"),
		data:paramMap,
		success:function(succResp){
			// 处理成功,页面跳转
			if(SUCCESS_CODE == succResp.retCode){
				successCallback(succResp.data);
			}else{
				failedCallback(succResp.retMess);
			}
		},
		error:function(errResp){
			//alert("表单提交失败");
			//console.log(errResp);
			//alert(errResp);
		}
	});
}
function msgclickbth(){
				$(".code_tips").hide();
		hide_error();
		disabledSendSmsCode();
		var url = contextPath()+"/sendSms";
		//alert("url = "+url);
		try{
			var result = JSON.parse(ajaxRequest($(".code_input").parent(),url, "GET"));
			//alert("result = "+result);
			// 处理成功,页面跳转
			if(SUCCESS_CODE == result.retCode){
				var mobile = result.data;
				$(".code_tips").text("短信验证码将发送至手机"+mobile+"，请注意查收");
				$(".code_tips").show();
				sendSmsTimeout(getSmsIntTimes());
			}else{
				show_error(result.retMess,("WAP" == PAGE_TYPE));
				enableSendSmsCode();
			}
		}catch(err){
			enableSendSmsCode();
		}

}
$(function(){
	msgclickbth();
	//发送短信验证码（“免费获取”）按钮事件响应
	$(".btn_a").unbind("click").bind("click",function(){
			$(".code_tips").hide();
		hide_error();
		disabledSendSmsCode();
		var url = contextPath()+"/sendSms";
		//alert("url = "+url);
		try{
			var result = JSON.parse(ajaxRequest($(".code_input").parent(),url, "GET"));
			//alert("result = "+result);
			// 处理成功,页面跳转
			if(SUCCESS_CODE == result.retCode){
				var mobile = result.data;
				$(".code_tips").text("短信验证码将发送至手机"+mobile+"，请注意查收");
				$(".code_tips").show();
				sendSmsTimeout(getSmsIntTimes());
			}else{
				show_error(result.retMess,("WAP" == PAGE_TYPE));
				enableSendSmsCode();
			}
		}catch(err){
			enableSendSmsCode();
		}
	});
	
	//******************** 积分合并——开始 *************************//
	//合并支付信用卡选择,当积分不为0的卡片多于2张时可用
	var $payCardCho = $("#cards_list").find(".point-usable"); //有积分的
	if($payCardCho.length > 0){
		//计算总共扣了多少积分
		function calTotalKoujf(){
			var mainCardPoint = parseFloat($("#cardNo :selected").attr("point"));
			var otherCardPoint = 0;
			$("#cards_list .point-usable.on .koujf").each(function(){
				var point = Math.abs(parseInt($(this).text().trim()));
				otherCardPoint += point;
			});
			return mainCardPoint + otherCardPoint;
		}
		
		//显示总共扣了多少积分,还需要多少积分
		function showTotalKoujf(){
			var requiredPoint = parseFloat($("#totalReqPoint").text());
			var totalKoujf = calTotalKoujf();
			var stillNeedPoint = requiredPoint - totalKoujf;
			var hint = (stillNeedPoint <= 0) ? "（积分已经足够）" :"（仍需"+stillNeedPoint+"积分）";
			$(".total_koujf").text("-"+Math.min(requiredPoint,totalKoujf));
			$(".stillNeedPoint").text(hint);
		}
		
		//主卡下拉列表变更事件监听器
		function checkPointOnSelChange(){
			var requiredPoint = parseFloat($("#totalReqPoint").text());
			var mainCardPoint = parseFloat($("#cardNo :selected").attr("point"));
			
			//如果主卡积分足够，则积分合并功能不可使用，灰显
			if(mainCardPoint >= requiredPoint){
				$("#cards_list").find(".point-usable").addClass("un-usable");
			}else{
				$("#cards_list").find(".point-usable").removeClass("un-usable");
			}
			
			//去除合并积分的选中状态
			$("#cards_list").find(".point-usable").removeClass("on");
			
			//更新合并列表中的隐藏主卡项
			$(".hide-main-card").removeClass("hide-main-card");
			var selectedCardNo = $("#cardNo :selected").text();
			$("#cards_list .hbNode:contains('"+selectedCardNo+"')").addClass("hide-main-card");

			//清除合并列表中扣除的积分
			$(".koujf").text("");
			
			showTotalKoujf();
		}
		
		//积分合并列表选中事件监听器
		function checkPointOnRadioChecked(){
			var requiredPoint = parseFloat($("#totalReqPoint").text());
			var totalKoujf = calTotalKoujf();
			
			//如果积分已经足够，合并功能不可使用，灰显
			if(totalKoujf >= requiredPoint){
				$("#cards_list .point-usable").not(".on").addClass("un-usable");
			}else{
				$("#cards_list").find(".point-usable").removeClass("un-usable");
			}
			
			showTotalKoujf();
		}
		
		//绑定主卡下拉列表变更事件监听器
		$("#cardNo").on("change",function(){
			checkPointOnSelChange();
		});
		
		//积分合并功能灰显的不可用
		$payCardCho.click(function(){
			if(! $(this).hasClass("un-usable")){
				if($(this).hasClass("on")){
					$(this).find(".koujf").text("");
				}else{
					var requiredPoint = parseFloat($("#totalReqPoint").text());
					var totalKoujf = calTotalKoujf();
					
					var stillNeedPoint = requiredPoint - totalKoujf;
					if(stillNeedPoint <= 0){
						alert("积分已经足够");
						return false;
					}
					
					var kouJF = Math.min(stillNeedPoint,$(this).find(".availPoint").text().trim().replace("可用积分：",""));
					
					$(this).find(".koujf").text("-"+kouJF);
				}
				
				$(this).toggleClass('on');
				
				checkPointOnRadioChecked();
			}
		});
	}
	
	//
	try{
		checkPointOnSelChange();
	}catch(e){		
	}
	
	//默认帮用户合并卡片（从积分多的开始合并）
	$("#cards_list .point-usable:visible").click();
	//******************** 积分合并——结束 *************************//
});

// ---- pop.js --------//
//弹出居中层
function showBgMidBox(idname) {
	var newbox = document.getElementById(idname);
	newbox.style.zIndex = "9999";
	newbox.style.display = "block"
	newbox.style.position = "fixed";
	newbox.style.top = newbox.style.left = "50%";
	newbox.style.marginTop = -newbox.offsetHeight / 2 + "px";
	newbox.style.marginLeft = -newbox.offsetWidth / 2 + "px";
	var layer = document.createElement("div");
	layer.id = "layer";
	layer.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
	layer.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
	layer.style.position = "absolute";
	layer.style.top = layer.style.left = 0;
	layer.style.backgroundColor = "#000";
	layer.style.zIndex = "9998";
	layer.style.opacity = "0.3";
	document.body.appendChild(layer);
}

//底部弹出层
function showBgBtmBox(idname) {
	var newbox = document.getElementById(idname);
	newbox.style.zIndex = "9999";
	newbox.style.display = "block"
	newbox.style.position = "fixed";
	newbox.style.bottom = "0";
	newbox.style.left = "0";
	var layer = document.createElement("div");
	layer.id = "layer";
	layer.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
	layer.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
	layer.style.position = "absolute";
	layer.style.top = layer.style.left = 0;
	layer.style.backgroundColor = "#000";
	layer.style.zIndex = "9998";
	layer.style.opacity = "0.3";
	document.body.appendChild(layer);
}
	
//关闭弹出框
function closePopBox(idname) {
	var newbox = document.getElementById(idname);
	newbox.style.display = "none";
	document.body.style.overflow = "auto"; 
    var body = document.getElementsByTagName("body");
    var layer = document.getElementById("layer");
    body[0].removeChild(layer);
	}
	