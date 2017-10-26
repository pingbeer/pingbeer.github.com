var paramSectionId = getQueryStr('sectionId');
var infoListNode, infoListNodeCopy, entryListNode, entryListNodeCopy;
var goods_id, goods_detail_info, icon, type, goodsStockCount;
var appStartTime, appEndTime;
var isNotJoined;
var isTimeOut, seckillTimeOut;
var isTimeFlag = false;
var seckillTimeFlag = false;
var _captcha, accessToken, curTime, methodName;
var dbClickFlag = false;
var recommendText = "先去“我要推荐”为心仪爆品投一票吧！";
$(document).ready(function() {
	startSpinner();
	setHtmlFontSize();
	initWxSetting(initFormInfo, doSendShare, false, true, false)
});

function initFormInfo() {
	infoListNode = $('[id="infoList"]')[0];
	var b = $('[infoResult="DisplayLine"]')[0];
	infoListNodeCopy = $(b).clone();
	$(b).remove();
		//_hmt.push(['_trackEvent', '秒杀页-弹出验证码', 'click', webClientService.getWebAppName()]);
			//	doPrepareSeckill();
			$('[id="doGotoPay"]').unbind('click').bind('click', function() {
	
				_hmt.push(['_trackEvent', '秒杀页-弹出验证码', 'click', webClientService.getWebAppName()]);
				doPrepareSeckill()
		
	});
			
	getGoodsDetailInfo()
}
function getGoodsDetailInfo() {
	clientService.doPost({
		target: "com.ebuy.seckill2.spdweek.service.SeckillService",
		method: "getGoodsDetailInfo",
		dataObj: {
			appId: paramAppId,
			sectionId: paramSectionId,
			authTicket: cookieAuthTicket,
			userId: paramUserId,
			sign: paramSign
		},
		callBackWhenSucceed: "afterGetGoodsDetailInfo",
		callBackWhenError: "afterGetGoodsDetailInfo"
	})
}
function afterGetGoodsDetailInfo(c) {
	//if (isEmpty(c)) {
		//doError();
		//return
	//}
	var d = easyJsDomUtil.parseXML(c);
	var e = $(d).find('SeckillGoodsDetailInfo').find('errorCode').text();
	e="0";
	if (e == '0') {
		goods_id = $(d).find('SeckillGoodsDetailInfo').find('goods_id').text();
		icon = $(d).find('SeckillGoodsDetailInfo').find('icon').text();
		$('[id="public_img_url"]').attr('src', icon);
		goods_detail_info = $(d).find('SeckillGoodsDetailInfo').find('goods_detail_info').text();
		goodsStockCount = $(d).find('SeckillGoodsDetailInfo').find('goodsStockCount').text();
		$('[id="goods_detail_info"]').html(escape2Html(goods_detail_info.split('{"description":"')[1].split('"}')[0]));
		var f = $(d).find('SeckillGoodsDetailInfo').find('arrLines');
		$(f).find('DisplayLine').each(function(a) {
			var b = $(infoListNodeCopy).clone();
			$(b).find('[infoResult="name"]').val($(this).find('name').text());
			$(b).find('[infoResult="value"]').val($(this).find('value').text());
			$(b).find('.nameValue').html($(this).find('name').text() + $(this).find('value').text());
			$(infoListNode).append(b)
		});
		type = $(d).find('SeckillGoodsDetailInfo').find('type').text();
		if (type == 'DIAMOND') {
			$('[id="seckillDate"]').html('抢兑爆品时间：12/15中午12点起')
		} else if (type == 'AFTERNOON') {
			$('[id="seckillDate"]').html('抢兑爆品时间：每周四下午2点起')
		}
		appStartTime = $(d).find('SeckillGoodsDetailInfo').find('section_start_time').text();
		appEndTime = $(d).find('SeckillGoodsDetailInfo').find('section_end_time').text();
		$('#dotoShopList').unbind('click').bind('click', function() {
			var a = webClientService.getWebAppName() + "/" + paramAppId + "/shopList.html?appId=" + paramAppId + '&sectionNo=' + paramSectionNo + "&platform=" + paramPlatform + "&userId=" + paramUserId + "&sign=" + paramSign + "&timeStamp=" + (new Date()).getTime();
			window.location = a
		});
		doFindSeckillResult()
	} else {
		stopSpinner();
		var g = $(d).find('SeckillGoodsDetailInfo').find('errorMsg').text();
		showDialog.showInfoDialog({
			title: "提示信息",
			msgInfo: "test2"+g
		})
	}
}
function escape2Html(b) {
	var c = {
		'lt': '<',
		'gt': '>',
		'nbsp': ' ',
		'amp': '&',
		'quot': '"'
	};
	return b.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(a, t) {
		return c[t]
	})
}
function doPrepareSeckill() {
	startSpinner();
	clientService.doPost({
		target: "com.ebuy.seckill2.spdweek.service.SeckillService",
		method: "prepareSeckill",
		dataObj: {
			appId: paramAppId,
			sectionId: paramSectionId,
			goodsId: goods_id,
			authTicket: cookieAuthTicket,
			userId: paramUserId,
			sign: paramSign
		},
		callBackWhenSucceed: "afterDoPrepareSeckill",
		callBackWhenError: "afterDoPrepareSeckill"
	})
}
function afterDoPrepareSeckill(a) {
//alert(a);
	stopSpinner();
	//if (isEmpty(a)) {
		//doError();
		//return
	//}
	var b = easyJsDomUtil.parseXML(a);
	var c = $(b).find('TokenResult').find('errorCode').text();
	c=0;
	if (c == '0') {
		accessToken = $(b).find('TokenResult').find('accessToken').text();
		curTime = $(b).find('TokenResult').find('curTime').text();
		methodName = $(b).find('TokenResult').find('seckillInterface').text();
doSecKill();
		//doShowCaptcha();
	} else {
	//	var d = $(b).find('TokenResult').find('errorMsg').text();
		//			showDialog.showInfoDialog({
			//title: "提示信息",
			//msgInfo: "test1"+d
		//});
	}
}
function doShowCaptcha() {
	_captcha = new Captcha({
		app: paramAppId,
		userId: paramUserId,
		appTimestamp: curTime,
		appToken: accessToken,
		captchaType: "1",
		callback: function(a, b) {
			dbClickFlag = false;
			_hmt.push(['_trackEvent', '秒杀奖品页-提交验证码秒杀', 'click', webClientService.getWebAppName()]);
			doSecKill(b.captchaId, b.captchaPass);
			_captcha.hide()
		},
		container: "_captcha",
		funcShowMsg: function(a) {
			dbClickFlag = false;
			$('#_captcha_img').hide();
			$('#_captcha_msg').show();
			$('#_captcha_msg').text(a)
		},
		funcShowQuestion: function(a) {
			dbClickFlag = false;
			$('#_captcha_msg').hide();
			$('#_captcha_msg').text("");
			$('#_captcha_img')[0].src = a;
			$('#_captcha_img').show()
		},
		funcShowDisplayText: function(a) {
			dbClickFlag = false;
			$('#captcha_display').text(a)
		},
		funcGetDisplayText: function() {
			dbClickFlag = false;
			return $('#captcha_display').text()
		},
	});
	$('#_captcha').load("./captcha_spd.html", function() {
		$('#_captcha_img').hide();
		$('#_captcha_retry').bind('touchstart', _captcha.onRetry);
		$('#_btn_num_0').bind('touchstart', _captcha.onNumber0);
		$('#_btn_num_1').bind('touchstart', _captcha.onNumber1);
		$('#_btn_num_2').bind('touchstart', _captcha.onNumber2);
		$('#_btn_num_3').bind('touchstart', _captcha.onNumber3);
		$('#_btn_num_4').bind('touchstart', _captcha.onNumber4);
		$('#_btn_num_5').bind('touchstart', _captcha.onNumber5);
		$('#_btn_num_6').bind('touchstart', _captcha.onNumber6);
		$('#_btn_num_7').bind('touchstart', _captcha.onNumber7);
		$('#_btn_num_8').bind('touchstart', _captcha.onNumber8);
		$('#_btn_num_9').bind('touchstart', _captcha.onNumber9);
		$('#_btn_reset').bind('touchstart', _captcha.onReset);
		$('#_btn_submit').bind('touchstart', function() {
			if (dbClickFlag == false) {
				dbClickFlag = true;
				_captcha.onSubmit()
			}
		})
	});
	_captcha.toggle()
}
function doSecKill(a, b) {
	startSpinner();
	clientService.doPost({
		target: "com.ebuy.seckill2.spdweek.service.SeckillService",
		method: 'doSeckill0823',
		dataObj: {
			appId: paramAppId,
			sectionId: paramSectionId,
			goodsId: goods_id,
			authTicket: cookieAuthTicket,
			userId: paramUserId,
			sign: paramSign,
			captchaId: a,
			captchaPass: b,
			appTimestamp: curTime,
			appToken: accessToken
		},
		callBackWhenSucceed: "afterDoSecKill",
		callBackWhenError: "afterDoSecKill"
	})
}
function afterDoSecKill(a) {
	var c, btnTxt;

		btnTxt = '查看券码';
		c = "您已成功抢兑1份<br/>快去“我的战利品”查看详情。<br/><span class='small'>*若您未能填写完整的收货地址，小浦即会默认将奖品寄送到您的账单地址<br /></span>"

	clearTimeout(seckillTimeOut);
	stopSpinner();
//	if (isEmpty(a)) doError();
	//else {
		a = easyJsDomUtil.parseXML(a);
		var b = $(a).find("SeckillResult").find("errorCode").text();
		orderId = $(a).find("SeckillResult").find("orderId").text();
		status = $(a).find("SeckillResult").find("status").text();
		b="0";
		status="1";
		if (b == '0') {
			if (status == '0') {
				$('[id="overLayer"]').show();
				$('[id="vote_loading"]').show();
				if (seckillTimeFlag == false) {
					seckillTimeOut = setTimeout("doFindSecKillResult2()", 1000)
				}
			} else if (status == '1') {
				seckillTimeFlag = true;
				$('[id="overLayer"]').hide();
				$('[id="vote_loading"]').hide();
				_hmt.push(['_trackEvent', '秒杀奖品页-成功跳转奖品', 'click', webClientService.getWebAppName()]);
						var a = webClientService.getWebAppName() + "/" + paramAppId + "/list.html?appId=" + paramAppId + "&sectionId=" + paramSectionId + '&type=' + type + "&platform=" + paramPlatform + "&userId=" + paramUserId + "&sign=" + paramSign + "&timeStamp=" + (new Date).getTime();
						window.location = a
			} else if (status == '2') {
				seckillTimeFlag = true;
				$('[id="overLayer"]').hide();
				$('[id="vote_loading"]').hide();
		
			} else if (status == '9') {
				seckillTimeFlag = true;
				$('[id="overLayer"]').hide();
				$('[id="vote_loading"]').hide();
				showDialog.showInfoDialog({
					title: "提示信息",
					msgInfo: "系统出错"
				})
			}
		} else if (b == '4001') {
			if (status == '1') {
				seckillTimeFlag = true;
				$('[id="overLayer"]').hide();
				$('[id="vote_loading"]').hide();
				$('[id="doGotoPay"]').addClass("gray");
		
			} else {
				seckillTimeFlag = true;
				$('[id="overLayer"]').hide();
				$('[id="vote_loading"]').hide();
		
			}
		} else {
			seckillTimeFlag = true;
			$('[id="overLayer"]').hide();
			$('[id="vote_loading"]').hide();
	
		}
	//}
}
function doFindSecKillResult2() {
	clientService.doPost({
		target: "com.ebuy.seckill2.spdweek.service.SeckillService",
		method: "findSeckillResult",
		dataObj: {
			appId: paramAppId,
			sectionId: paramSectionId,
			goodsId: goods_id,
			authTicket: cookieAuthTicket,
			userId: paramUserId,
			sign: paramSign
		},
		callBackWhenSucceed: "afterDoSecKill",
		callBackWhenError: "doError"
	})
}
function doFindSeckillResult() {
	clientService.doPost({
		target: "com.ebuy.seckill2.spdweek.service.SeckillService",
		method: "findSeckillResult",
		dataObj: {
			appId: paramAppId,
			sectionId: paramSectionId,
			goodsId: goods_id,
			authTicket: cookieAuthTicket,
			userId: paramUserId,
			sign: paramSign
		},
		callBackWhenSucceed: "afterFindSeckillResult",
		callBackWhenError: "doError"
	})
}
function afterFindSeckillResult(a) {
	stopSpinner();
	if (isEmpty(a)) {
		isNotJoined = true
	} else {
		isNotJoined = false
	}
	doSetInfoToPage();
	stopSpinner();
	$('[id="page"]').removeClass('vis_h')
}
function doSetInfoToPage() {
	if (new Date().getTime() < appStartTime) {
		$('[id="doGotoPay"]').addClass('gray');
		clearTimeout(isTimeOut);
		doJSQ()
	} else if (new Date().getTime() > appEndTime) {
		$('[id="doGotoPay"]').addClass('gray')
	} else {
		if (isNotJoined) {
			if (goodsStockCount <= 0) {
				$('[id="doGotoPay"]').addClass('gray')
			} else {
				$('[id="doGotoPay"]').removeClass('gray')
			}
		} else {
			$('[id="doGotoPay"]').addClass('gray')
		}
	}
}
function doJSQ() {
	clearTimeout(isTimeOut);
	var a = new Date().getTime();
	if (a >= appStartTime) {
		doSetInfoToPage();
		isTimeFlag = true
	}
	if (isTimeFlag == false) {
		isTimeOut = setTimeout("doJSQ()", 1000)
	}
}