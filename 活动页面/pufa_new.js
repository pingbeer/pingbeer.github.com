
$(document).ready(function(){
    startSpinner();
    setHtmlFontSize2();
    // initWxSetting(initFormInfo,doSendShare,false,true,false);
    initFormInfo();// debug
});

function initFormInfo(){
    stopSpinner();
    $('[id="page"]').removeClass('vis_h');

    $('[id="prevActivity"]').unbind('click').bind('click',function(){
        var url = webClientService.getWebAppName() + "/" + paramAppId + "/index.html?appId="+paramAppId+"&platform="+paramPlatform+"&sectionNo=" + paramSectionNo + "&userId="+paramUserId + "&sign="+paramSign + "&timeStamp="+(new Date()).getTime();
        window.location = url;
    });

    $('[id="rule"]').unbind('click').bind('click',function(){        
        var url = webClientService.getWebAppName() + "/" + paramAppId + "/rule.html?appId="+paramAppId+"&platform="+paramPlatform+"&sectionNo=" + paramSectionNo + "&userId="+paramUserId + "&sign="+paramSign + "&timeStamp="+(new Date()).getTime();
        window.location = url;
    });

    $('.r1_btn').unbind('click').bind('click',function(){
        showDialog.showInfoDialog({title : "提示信息", msgInfo : "新一期活动未开始"});
    });

    $('[id="myGift"]').unbind('click').bind('click',function(){
        showDialog.showInfoDialog({title : "提示信息", msgInfo : "新一期活动未开始"});
    });
    $('[id="myOrder"]').on('click',function(){
        showDialog.showInfoDialog({title : "提示信息", msgInfo : "新一期活动未开始"});
    })
    $('[id="doLottery"]').on('click',function(){
        showDialog.showInfoDialog({title : "提示信息", msgInfo : "新一期活动未开始"});
    })
    $('[id="doBuy"]').on('click',function(){
        showDialog.showInfoDialog({title : "提示信息", msgInfo : "新一期活动未开始"});
    })

    // showDialog.showMultiBtnDialog({title : "未获得金钥匙", msgInfo : '直接用<em class="count">888</em>积分<br/>购买金钥匙<br/><i>(可在我的订单中查看)</i>',
    //     btnOkTxt:'稍后付',
    //     btnMultiTxt:'自己付',
    //     btnCancelTxt:'好友付',
    // });
}

/**
 * app端左上角返回
 * @return {[type]} [description]
 */
function gotoAppIndex(){
    var osType = getOsType();
    if(osType == 1){//安卓
        window.jsspdb.lifeGoBack();
    }else if(osType == 0){// ios
        document.location="jsspdb:;lifeCall:,close";
    }
}


// 设置页面fontSize
function setHtmlFontSize2(){
    var screenWidth = $('[id="page"]').width();
    $('html').css('font-size',((Number(screenWidth)/375)*20)+'px');
    $(window).resize(function(){
        var screenWidth = $('[id="page"]').width();
        $('html').css('font-size',((Number(screenWidth)/375)*20)+'px');
    });
}