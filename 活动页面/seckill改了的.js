var paramSectionId = getQueryStr("sectionId"),
    infoListNode, infoListNodeCopy, entryListNode, entryListNodeCopy, goods_id, goods_detail_info, icon, type, goodsStockCount, appStartTime, appEndTime, isNotJoined, isTimeOut, seckillTimeOut, isTimeFlag = !1,
    seckillTimeFlag = !1,
    _captcha, accessToken, curTime, methodName, dbClickFlag = !1,
    recommendText = "先去“我要推荐”为心仪爆品投一票吧！";

$(document).ready(function() {

    startSpinner();
    setHtmlFontSize();
    initWxSetting(initFormInfo, doSendShare, !1, !0, !1);

});
// http://campaign.e-pointchina.com.cn/seckill2/wx_entry/weekseckill
function initFormInfo() {

    // infoListNode = $('[id="infoList"]')[0];
    // var a = $('[infoResult="DisplayLine"]')[0];
    // infoListNodeCopy = $(a).clone();
    // $(a).remove();
    $('[id="doGotoPay"]').unbind("click").bind("click", function() {
        var a = (new Date).getTime();
       (_hmt.push(["_trackEvent", "秒杀页-弹出验证码", "click", webClientService.getWebAppName()]), doPrepareSeckill())
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
//获得资格或者未获得资格度在这里判断
// 是否可以获得 goods_id
// goodsStockCount 写死
function afterGetGoodsDetailInfo(a) {

    $('[id="page"]').removeClass("vis_h");
    $('[id="doGotoPay"]').removeClass("gray");
    stopSpinner();
/*    if (isEmpty(a)) doError();
    else if (a = easyJsDomUtil.parseXML(a), "0" == $(a).find("SeckillGoodsDetailInfo").find("errorCode").text()) {
       */
  /*goods_id = $(a).find("SeckillGoodsDetailInfo").find("goods_id").text();
        icon = $(a).find("SeckillGoodsDetailInfo").find("icon").text();
        $('[id="public_img_url"]').attr("src", icon);
        goods_detail_info = $(a).find("SeckillGoodsDetailInfo").find("goods_detail_info").text();
        goodsStockCount = $(a).find("SeckillGoodsDetailInfo").find("goodsStockCount").text();
        // $('[id="goods_detail_info"]').html(escape2Html(goods_detail_info.split('{"description":"')[1].split('"}')[0]));
        var b = $(a).find("SeckillGoodsDetailInfo").find("arrLines");
/!*        $(b).find("DisplayLine").each(function(a) {
            a = $(infoListNodeCopy).clone();
            $(a).find('[infoResult="name"]').val($(this).find("name").text());
            $(a).find('[infoResult="value"]').val($(this).find("value").text());
            $(a).find(".nameValue").html($(this).find("name").text() + $(this).find("value").text());
            $(infoListNode).append(a)
        });*!/
        type = $(a).find("SeckillGoodsDetailInfo").find("type").text();
        "DIAMOND" == type ? $('[id="seckillDate"]').html("抢兑爆品时间：3/16中午12点起") : "AFTERNOON" == type && $('[id="seckillDate"]').html("抢兑爆品时间：每周四下午2点起");
        appStartTime = $(a).find("SeckillGoodsDetailInfo").find("section_start_time").text();
        appEndTime = $(a).find("SeckillGoodsDetailInfo").find("section_end_time").text();*/
        // 主要是这个方法需要触发
        $("#dotoShopList").unbind("click").bind("click", function() {

            var a = webClientService.getWebAppName() + "/" + paramAppId + "/shopList.html?appId=" + paramAppId + "&sectionNo="
				+ paramSectionNo + "&platform=" + paramPlatform + "&userId=" + paramUserId
				+ "&sign=" + paramSign + "&timeStamp=" + (new Date).getTime();

            window.location = a
        });
        // 去掉页面白屏，其他没事件
        // doFindSeckillResult();

   /* } else stopSpinner(), a = $(a).find("SeckillGoodsDetailInfo").find("errorMsg").text(), showDialog.showInfoDialog({
        title: "提示信息",
        msgInfo: a
    })*/
}
function escape2Html(a) {
    var b = {
        lt: "<",
        gt: ">",
        nbsp: " ",
        amp: "&",
        quot: '"'
    };
    return a.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(a, c) {
        return b[c]
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
        callBackWhenError: "doError"
    })
}
function afterDoPrepareSeckill(a) {
    stopSpinner();
    isEmpty(a) ? doError() : (a = easyJsDomUtil.parseXML(a), "0" == $(a).find("TokenResult").find("errorCode").text() ? (accessToken = $(a).find("TokenResult").find("accessToken").text(), curTime = $(a).find("TokenResult").find("curTime").text(), methodName = $(a).find("TokenResult").find("seckillInterface").text(), doShowCaptcha()) : (a = $(a).find("TokenResult").find("errorMsg").text(), showDialog.showInfoDialog({
                title: "提示信息",
                msgInfo: a
            })))
}
function doShowCaptcha() {
    _captcha = new Captcha({
        app: paramAppId,
        userId: paramUserId,
        appTimestamp: curTime,
        appToken: accessToken,
        captchaType: "1",
        callback: function(a, b) {
            dbClickFlag = !1;
            _hmt.push(["_trackEvent", "秒杀奖品页-提交验证码秒杀", "click", webClientService.getWebAppName()]);
            doSecKill(b.captchaId, b.captchaPass);
            _captcha.hide()
        },
        container: "_captcha",
        funcShowMsg: function(a) {
            dbClickFlag = !1;
            $("#_captcha_img").hide();
            $("#_captcha_msg").show();
            $("#_captcha_msg").text(a)
        },
        funcShowQuestion: function(a) {
            dbClickFlag = !1;
            $("#_captcha_msg").hide();
            $("#_captcha_msg").text("");
            $("#_captcha_img")[0].src = a;
            $("#_captcha_img").show()
        },
        funcShowDisplayText: function(a) {
            dbClickFlag = !1;
            $("#captcha_display").text(a)
        },
        funcGetDisplayText: function() {
            dbClickFlag = !1;
            return $("#captcha_display").text()
        }
    });
    $("#_captcha").load("./captcha_spd.html", function() {
        $("#_captcha_img").hide();
        $("#_captcha_retry").bind("touchstart", _captcha.onRetry);
        $("#_btn_num_0").bind("touchstart", _captcha.onNumber0);
        $("#_btn_num_1").bind("touchstart", _captcha.onNumber1);
        $("#_btn_num_2").bind("touchstart", _captcha.onNumber2);
        $("#_btn_num_3").bind("touchstart", _captcha.onNumber3);
        $("#_btn_num_4").bind("touchstart", _captcha.onNumber4);
        $("#_btn_num_5").bind("touchstart", _captcha.onNumber5);
        $("#_btn_num_6").bind("touchstart", _captcha.onNumber6);
        $("#_btn_num_7").bind("touchstart", _captcha.onNumber7);
        $("#_btn_num_8").bind("touchstart", _captcha.onNumber8);
        $("#_btn_num_9").bind("touchstart", _captcha.onNumber9);
        $("#_btn_reset").bind("touchstart", _captcha.onReset);
        $("#_btn_submit").bind("touchstart", function() {
            0 == dbClickFlag && (dbClickFlag = !0, _captcha.onSubmit())
        })
    });
    _captcha.toggle()
}
function doSecKill(a, b) {
    startSpinner();
    clientService.doPost({
        target: "com.ebuy.seckill2.spdweek.service.SeckillService",
        method: "doSeckillLAST",
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
        callBackWhenError: "doError"
    })
}
function afterDoSecKill(a) {
    // alert(a);
    var b, d;
    "DIAMOND" == type ? (d = "确定", b = "您已成功抢兑1份<br/>快去“我的战利品”查看详情。<br/><span class='small'>*若您未能填写完整的收货地址，小浦即会默认将奖品寄送到您的账单地址<br /></span>") : "AFTERNOON" == type && (d = "查看奖品", b = "您已成功抢兑1份<br/>快去“我的战利品”查看详情。<br/><span class='small'>*若您未能填写完整的收货地址，小浦即会默认将奖品寄送到您的账单地址<br /></span>");
    clearTimeout(seckillTimeOut);
    stopSpinner();
    if (isEmpty(a)) doError();
    else {
        a = easyJsDomUtil.parseXML(a);
        var c = $(a).find("SeckillResult").find("errorCode").text();
        orderId = $(a).find("SeckillResult").find("orderId").text();
        status = $(a).find("SeckillResult").find("status").text();
        "0" == c ? "0" == status ? ($('[id="overLayer"]').show(), $('[id="vote_loading"]').show(), 0 == seckillTimeFlag && (seckillTimeOut = setTimeout("doFindSecKillResult2()", 1E3))) : "1" == status ? (seckillTimeFlag = !0, $('[id="overLayer"]').hide(), $('[id="vote_loading"]').hide(), showDialog.showInfoDialog({
                        title: "提示信息",
                        msgInfo: b,
                        btnOkTxt: d,
                        btnOk: function() {
                            _hmt.push(["_trackEvent", "秒杀奖品页-成功跳转奖品", "click", webClientService.getWebAppName()]);
                            var a = webClientService.getWebAppName() + "/" + paramAppId + "/list.html?appId=" + paramAppId + "&sectionId=" + paramSectionId + "&type=" + type + "&platform=" + paramPlatform + "&userId=" + paramUserId + "&sign=" + paramSign + "&timeStamp=" + (new Date).getTime();
                            window.location = a
                        }
                    })) : "2" == status ? (seckillTimeFlag = !0, $('[id="overLayer"]').hide(), $('[id="vote_loading"]').hide(), showDialog.showInfoDialog({
                            title: "提示信息",
                            msgInfo: "名额已抢完<br/><span class='normal'>赠送您浦发信用卡10积分以资鼓励。" + recommendText + "</span>",
                            btnCancelTxt: "我要推荐",
                            btnCancel: function() {
                                gotoVote()
                            }
                        })) : "9" == status && (seckillTimeFlag = !0, $('[id="overLayer"]').hide(), $('[id="vote_loading"]').hide(), showDialog.showInfoDialog({
                            title: "提示信息",
                            msgInfo: "系统出错"
                        })) : "4003" == c ? (seckillTimeFlag = !0, $('[id="overLayer"]').hide(), $('[id="vote_loading"]').hide(), a = $(a).find("SeckillResult").find("errorMsg").text(), showDialog.showConfirmDialog({
                    title: "提示信息",
                    msgInfo: a,
                    btnOkTxt: "绑定",
                    btnCancelTxt: "办卡",
                    btnOk: function() {
                        _hmt.push(["_trackEvent", "秒杀奖品页-未绑卡", "click", webClientService.getWebAppName()]);
                        showDialog.showInfoDialog({
                            title: "提示信息",
                            msgInfo: "返回浦发信用卡官方微信主页面，发送“绑定”，并根据提示进行绑定操作。"
                        })
                    },
                    btnCancel: function() {
                        _hmt.push(["_trackEvent", "秒杀奖品页-去办卡", "click", webClientService.getWebAppName()]);
                        window.location = "https://mbank.spdbccc.com.cn/creditcard/indexActivity.htm?data=000004"
                    }
                })) : "4001" == c ? "1" == status ? (seckillTimeFlag = !0, $('[id="overLayer"]').hide(), $('[id="vote_loading"]').hide(), $('[id="doGotoPay"]').addClass("gray"), showDialog.showInfoDialog({
                            title: "提示信息",
                            msgInfo: "名额已抢完<br/><span class='normal'>赠送您浦发信用卡10积分以资鼓励。" + recommendText + "</span>",
                            btnCancelTxt: "我要推荐",
                            btnCancel: function() {
                                gotoVote()
                            }
                        })) : (seckillTimeFlag = !0, $('[id="overLayer"]').hide(), $('[id="vote_loading"]').hide(), $('[id="doGotoPay"]').addClass("gray"), showDialog.showInfoDialog({
                            title: "提示信息",
                            msgInfo: $(a).find("SeckillResult").find("errorMsg").text()
                        })) : (seckillTimeFlag = !0, $('[id="overLayer"]').hide(), $('[id="vote_loading"]').hide(), a = $(a).find("SeckillResult").find("errorMsg").text(), showDialog.showInfoDialog({
                        title: "提示信息",
                        msgInfo: a
                    }))
    }
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
    stopSpinner();
 //  isNotJoined = isEmpty() ? !0 : !1;
    doSetInfoToPage();
    stopSpinner();
    $('[id="page"]').removeClass("vis_h")
   /* clientService.doPost({
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
    })*/
}
function afterFindSeckillResult(a) {
    // alert('afterFindSeckillResult:'+a);
    stopSpinner();
    isNotJoined = isEmpty(a) ? !0 : !1;
    doSetInfoToPage();
    stopSpinner();
    $('[id="page"]').removeClass("vis_h")
}
function doSetInfoToPage() {
    $('[id="doGotoPay"]').removeClass("gray");
    // (new Date).getTime() < appStartTime ? ($('[id="doGotoPay"]').addClass("gray"), clearTimeout(isTimeOut), doJSQ()) : (new Date).getTime() > appEndTime ? $('[id="doGotoPay"]').addClass("gray") : isNotJoined ? 0 >= goodsStockCount ? $('[id="doGotoPay"]').addClass("gray") : $('[id="doGotoPay"]').removeClass("gray") : $('[id="doGotoPay"]').addClass("gray")
}
function doJSQ() {
    clearTimeout(isTimeOut);
    // (new Date).getTime() >= appStartTime && (doSetInfoToPage(), isTimeFlag = !0);
    // 0 == isTimeFlag && (isTimeOut = setTimeout("doJSQ()", 1E3))
};