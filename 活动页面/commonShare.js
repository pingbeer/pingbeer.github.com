var commonShare = new CommonShare();

var doShareSuccFn,isHideOptionMenu,isWXplatform;

wx.ready(function(){
    wx.onMenuShareAppMessage(commonShare.wxData);
    wx.onMenuShareTimeline(commonShare.wxData);
    if(isHideOptionMenu){
        wx.hideOptionMenu();
    }else{
        wx.showOptionMenu();
    }
});

function CommonShare() {

	var _this = this;

	this.doSetSuccFn;

	var imgUrl = 'https://spdticket-prod.oss-cn-hangzhou.aliyuncs.com/imgs/share.jpg';
	var shareTitle ='浦发礼券银行';
	var descContent = '这是我在浦发"礼券银行"精心挑选送你的,尽情享用吧';
	var lineLink = $my.getWebAppHasHost() + "/entry?entryType=0&timeStamp=" + (new Date()).getTime();

	this.wxData = {
	    "appId": '',
	    "imgUrl": imgUrl,
	    "title": shareTitle,
	    "link": lineLink,
	    "desc": descContent,
	    "success" : function(){
	    	if (doShareSuccFn) {
	    		doShareSuccFn();
	    	}
	    },
	    "cancel" : function(){},
	    "fail" : function(){}
	};

    this.initWxSetting = function(afterSetSucc, afterShareSucc, hideOptionMenuFlag, isWXplatformFlag){
        if (window.__skipInitWxSetting) {
            return;
        }

        window.__skipInitWxSetting = true;
        doSetSuccFn = afterSetSucc;
        doShareSuccFn = afterShareSucc;
        isHideOptionMenu = hideOptionMenuFlag;
        isWXplatform = isWXClient();

        // WX platform process
        if(isWXplatform) {

            $my.ajax({
                url: $my.getCloudDataServiceUrl(),
                data: {
                    serviceType: "com.ebuy.shop.web.service.jsbridge.JSBridgeService",
                    serviceMethod: "getJSBridgeInitInfo",
                    url:window.location.href
                },
                success: function(response) {
                    var appId = $(response).find('appId').text();
                    var timestamp = $(response).find('timestamp').text();
                    var nonceStr = $(response).find('nonceStr').text();
                    var signature = $(response).find('signature').text();

                    wx.config({
                        debug: false,
                        appId: appId,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem',
                            'translateVoice',
                            'startRecord',
                            'stopRecord',
                            'onRecordEnd',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getNetworkType',
                            'openLocation',
                            'getLocation',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'closeWindow',
                            'scanQRCode',
                            'chooseWXPay',
                            'openProductSpecificView',
                            'addCard',
                            'chooseCard',
                            'openCard'
                        ]
                    });

                    if(doSetSuccFn) {
                        doSetSuccFn();
                    }
                },
                error: function(response) {
                    console.log("JSBridgeService error");
                }
            });

        }

        // Other platform process
        if(!isWXplatform) {
	        $('body').append('<div class="m_top_bar"><div class="top_bar_wrap"><span class="top_bar_back" id="backPage"></span><span class="top_bar_title">礼券银行</span><span class="top_bar_entry" id="gotoTicket">我的券</span></div></div>')
	        $('body').addClass('app');
	        $('#backPage').unbind("click").bind('click',gotoBack);
            if(doSetSuccFn) {
                doSetSuccFn();
            }
        }
    };

    this.initPresentShareWXData = function(params) {
        _this.wxData.imgUrl = "https://spdticket-prod.oss-cn-hangzhou.aliyuncs.com/imgs/share_gift.jpg";
        _this.wxData.title = "浦发礼券银行";
        _this.wxData.link = $my.getWebAppHasHost() + "/share_entry?entryType=2&" + params;
        _this.wxData.desc = "这是我在浦发\"礼券银行\"精心挑选送你的,尽情享用吧";

        if(isWXClient()) {
            $('.shareLayer').show();
            wx.showOptionMenu();

        } else if(isPuFaAppClient()) {

            try {
                // App share
                if($("#app_share").length <= 0) {
                    $("body").append(
                        '<div class="m_fenxiang" id="app_share" style="display:none;">' +
                            '<div class="master"></div>' +
                            '<div class="fenxiang_main">' +
                                '<div class="fx_title"></div>' +
                                '<div class="fx_content"></div>' +
                                '<div class="fx_list">' +
                                    '<p>分享到</p>' +
                                    '<ul class="clearfix">' +
                                    '<li><img id="app_share_wx1" src="https://spdticket-prod.oss-cn-hangzhou.aliyuncs.com/imgs/icon/icon_fx_hy.png" alt="">微信</li>' +
                                    '<li><img id="app_share_wx2" src="https://spdticket-prod.oss-cn-hangzhou.aliyuncs.com/imgs/icon/icon_fx_pyq.png" alt="">朋友圈</li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                        '</div> ');

                    $("#app_share").on("click", function() {
                        $("#app_share").hide();
                        $("#overLayer").hide();
                    });

                    $("#app_share_wx1").on("click", function() {
                        window.jsspdb.shareToWXSceneSession(_this.wxData.link, _this.wxData.title, _this.wxData.desc, 1);
                    });

                    $("#app_share_wx2").on("click", function() {
                        window.jsspdb.shareToWXSceneTimeline(_this.wxData.link, _this.wxData.title, _this.wxData.desc, 1);
                    });
                }

                $("#overLayer").show();
                $("#app_share").show();
            } catch(e) {
                console.log(e);
            }
        } else {
            showDialog.showInfoDialog({msgInfo : "当前版本暂不支持该平台分享功能" });
        }
    };

    this.initSharePackageWXData = function(params, packageName) {
        _this.wxData.imgUrl = "https://spdticket-prod.oss-cn-hangzhou.aliyuncs.com/imgs/share_package.jpg";
        _this.wxData.title = "浦发礼券银行";
        _this.wxData.link = $my.getWebAppHasHost() + "/share_entry?entryType=3&" + params;
        _this.wxData.desc = "这是我在浦发\"礼券银行\"参与的礼券共享包-" + packageName;

        if(isWXClient()) {

            $('.shareLayer').show();
            wx.showOptionMenu();
        } else if(isPuFaAppClient()) {

            try {
                // App share
                if($("#app_share").length <= 0) {
                    $("body").append(
                        '<div class="m_fenxiang" id="app_share" style="display:none;">' +
                            '<div class="master"></div>' +
                            '<div class="fenxiang_main">' +
                                '<div class="fx_title"></div>' +
                                '<div class="fx_content"></div>' +
                                '<div class="fx_list">' +
                                    '<p>分享到</p>' +
                                    '<ul class="clearfix">' +
                                        '<li><img id="app_share_wx1" src="https://spdticket-prod.oss-cn-hangzhou.aliyuncs.com/imgs/icon/icon_fx_hy.png" alt="">微信</li>' +
                                        '<li><img id="app_share_wx2" src="https://spdticket-prod.oss-cn-hangzhou.aliyuncs.com/imgs/icon/icon_fx_pyq.png" alt="">朋友圈</li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                        '</div> ');

                    $("#app_share").on("click", function() {
                        $("#app_share").hide();
                        $("#overLayer").hide();
                    });

                    $("#app_share_wx1").on("click", function() {
                        window.jsspdb.shareToWXSceneSession(_this.wxData.link, _this.wxData.title, _this.wxData.desc, 1);
                    });

                    $("#app_share_wx2").on("click", function() {
                        window.jsspdb.shareToWXSceneTimeline(_this.wxData.link, _this.wxData.title, _this.wxData.desc, 1);
                    });
                }

                $("#overLayer").show();
                $("#app_share").show();
            } catch(e) {
                console.log(e);
            }
        } else {
            showDialog.showInfoDialog({msgInfo : "当前版本暂不支持该平台分享功能" });
        }
    };

    this.showWXOptionMenu = function() {
        wx.showOptionMenu();
    };

    this.hideWXOptionMenu = function() {
        wx.hideOptionMenu();
    };
}

function isWXClient(){
    if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

function isPuFaAppClient(){
    return typeof window.jsspdb != "undefined";
}

function isAndroid() {
    return getOsType() == 1;
}

function isApple() {
    return getOsType() == 0;
}

/**
 * 返回上一页
 */
function gotoBack(){
    history.back();
}
/**
 * app端左上角返回
 * @return {[type]} [description]
 */
function gotoAppIndex(){
    if(isAndroid()){//安卓
        window.jsspdb.lifeGoBack();
    }else if(isApple()){// ios
        document.location="jsspdb:;lifeCall:,close";
    }
}

function getOsType(){
    if(navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('Mac') > -1) {
        return 0;
    }else if(navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1){
        return 1;
    }else{
        return -1;
    }
}

function setHtmlFontSize(){
    var screenWidth = $('[id="page"]').width();
    $('html').css('font-size',((Number(screenWidth)/320)*20)+'px');
    $(window).resize(function(){
        var screenWidth = $('[id="page"]').width();
        $('html').css('font-size',((Number(screenWidth)/320)*20)+'px');
    });
}

function preventDefaultScroll(e){
    e.preventDefault();
}

function addEvent(){
    document.addEventListener('touchmove',preventDefaultScroll,false);
}

function removeEvent(){
    document.removeEventListener('touchmove',preventDefaultScroll,false);
}


var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?a174244da35292616b06da98788d35ab";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();

