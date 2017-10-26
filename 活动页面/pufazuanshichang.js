var infoListNode,infoListNodeCopy,entryListNode,entryListNodeCopy;
var verifyOrderId,verifyTime,status,certNo;
var verifyTimeOut;
var verifyTimeFlag = false;
var typeValue,sectionIdValue;

$(document).ready(function(){
    startSpinner();
    setHtmlFontSize();
    initWxSetting(initFormInfo,doSendShare,false,true,false);
    // initFormInfo();// debug
});

function initFormInfo(){
    // domNode copy
    infoListNode = $('[id="infoList"]')[0];
    var infoListNodeTmp = $('[infoResult="DisplayLine"]')[0];
    infoListNodeCopy = $(infoListNodeTmp).clone();
    $(infoListNodeTmp).remove();

    entryListNode = $('[id="entryList"]')[0];
    var entryListNodeTmp = $('[entryResult="SeckillSectionListInfo"]')[0];
    entryListNodeCopy = $(entryListNodeTmp).clone();
    $(entryListNodeTmp).remove();
    
   	// 绑定事件
    $('#backPage').unbind("click").bind('click',function(){ //app左上角返回
        gotoAppIndex()
    });
    $('[id="doEnterRecommend"]').unbind('click').bind('click',function(){ //我要推荐
        // baidu
        _hmt.push(['_trackEvent', '钻石场首页-我要推荐', 'click',webClientService.getWebAppName()]);

        gotoVote();
    });

    doGetListInfo();
    // debug
    // afterGetListInfo('<SeckillListPageInfo><errorCode>0</errorCode><errorMsg>数据出错</errorMsg><List><SeckillSectionListInfo><arrLines><DisplayLine><name>爆品：</name><value>2016圣诞限量礼盒*5或YSL圣罗兰口红一只*1000(色号随机)</value></DisplayLine><DisplayLine><name>市场价：</name><value>以YSL零售店为准</value></DisplayLine><DisplayLine><name>每周四上午10点抽取资格,每周四下午2点抢兑爆品</name><value></value></DisplayLine></arrLines><icon>./imgs/01/01.jpg</icon><type>COMMON</type><nextSectionNo>nextSectionNo_001</nextSectionNo><sectionId>sectionId001</sectionId></SeckillSectionListInfo><SeckillSectionListInfo><arrLines><DisplayLine><name>爆品：</name><value>2016圣诞限量礼盒*5或YSL圣罗兰口红一只*1000(色号随机)</value></DisplayLine><DisplayLine><name>市场价：</name><value>以YSL零售店为准</value></DisplayLine><DisplayLine><name>限金钻及以上客户参与，周四中午12点抢兑爆品</name><value></value></DisplayLine></arrLines><icon>./imgs/01/01.jpg</icon><type>DIAMOND</type><nextSectionNo>nextSectionNo_001</nextSectionNo><sectionId>sectionId002</sectionId></SeckillSectionListInfo></List></SeckillListPageInfo>');
}

/**
 * 取得秒杀首页列表信息(钻石场)
 */
function doGetListInfo(){
    clientService.doPost({
        target: "com.ebuy.seckill2.spdweek.service.SeckillService",
        method: "getListInfo",
        dataObj: {
            appId: paramAppId,
            sectionNo: paramSectionNo,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign
        },
        callBackWhenSucceed: "afterGetListInfo",
        callBackWhenError: "doError"
    })
}
function afterGetListInfo(returnValue){
    // alert('afterGetListInfo:'+returnValue);
    $('[id="entryList"]').empty();
    stopSpinner();
    if(isEmpty(returnValue)){
        doError();
        return;
    }

    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('SeckillListPageInfo').find('errorCode').text();
    if(errorCode == 0){ //正常
        $(rootXmlNode).find('SeckillListPageInfo').find('SeckillSectionListInfo').each(function(index){
            var cloneNode = $(entryListNodeCopy).clone();
            $(cloneNode).find('[entryResult="icon"]').val($(this).find('icon').text());
            $(cloneNode).find('[entryResult="type"]').val($(this).find('type').text());
            $(cloneNode).find('[entryResult="nextSectionNo"]').val($(this).find('nextSectionNo').text());
            $(cloneNode).find('[entryResult="sectionId"]').val($(this).find('section_id').text());

            // 设置图片 按钮
            $(cloneNode).find('[id="public_img_url"]').attr('src',$(this).find('icon').text());
            var type = $(this).find('type').text();
            if(type == 'DIAMOND'){ //钻石场
                $(cloneNode).addClass('jewel');
            }

            var arrLines = $(this).find('arrLines');
            $(arrLines).find('DisplayLine').each(function(num){
                var cloneInfoNode = $(infoListNodeCopy).clone();
                $(cloneInfoNode).find('[infoResult="name"]').val($(this).find('name').text());
                $(cloneInfoNode).find('[infoResult="value"]').val($(this).find('value').text());
                $(cloneInfoNode).find('.nameValue').html($(this).find('name').text()+$(this).find('value').text());
                $(cloneNode).find('[id="infoList"]').append(cloneInfoNode);
            });

            // 按钮绑定事件
            $(cloneNode).find('[id="doEnterIndex"]').unbind('click').bind('click',function(){ //大众场立即进入
                // baidu
                _hmt.push(['_trackEvent', '钻石场首页-大众场入口', 'click',webClientService.getWebAppName()]);

                var nextSectionNo = $(cloneNode).find("[entryResult='nextSectionNo']").val();
                var url = webClientService.getWebAppName() + "/" + paramAppId + "/index.html?appId="+paramAppId+"&sectionNo="+nextSectionNo+"&platform="+paramPlatform+"&userId="+paramUserId + "&sign="+paramSign + "&timeStamp="+(new Date()).getTime();
                window.location = url;
            });
            $(cloneNode).find('[id="doVerify"]').unbind('click').bind('click',function(){ //钻石场立即验证
                // baidu
                _hmt.push(['_trackEvent', '钻石场首页-钻石场验证', 'click',webClientService.getWebAppName()]);

                typeValue = $(cloneNode).find('[entryresult="type"]').val();
                sectionIdValue = $(cloneNode).find('[entryresult="sectionId"]').val();                
                doVerify();
                // debug
                // afterDoVerify('<VerifyResult><errorCode>0</errorCode><errorMsg>对不起，系统错误</errorMsg><verifyOrderId>verifyOrderId001</verifyOrderId><status>0</status><certNo>340123199005076097</certNo><verifyTime>1466509034000</verifyTime></VerifyResult>');
            });
            $(cloneNode).find('[id="doEnterList"]').unbind('click').bind('click',function(){ //我的战利品
                // baidu
                _hmt.push(['_trackEvent', '钻石场首页-我的战利品', 'click',webClientService.getWebAppName()]);
                
                var url = webClientService.getWebAppName() + "/" + paramAppId + "/list.html?appId="+paramAppId+"&sectionNo="+paramSectionNo+"&platform="+paramPlatform+'&type='+type+"&userId="+paramUserId + "&sign="+paramSign + "&timeStamp="+(new Date()).getTime();
                window.location = url;
            });
            $(cloneNode).find('[id="doShowInfo"]').unbind('click').bind('click',function(){ //活动细则
                $('[id="overLayer"]').show();
                $('[id="showInfo"]').show();
            });
            $('[id="closeBtn"]').unbind('click').bind('click',function(){ //关闭活动细则
                $('[id="overLayer"]').hide();
                $('[id="showInfo"]').hide();
            });

            $(entryListNode).append(cloneNode);
        });

        stopSpinner();
        $('[id="page"]').removeClass('vis_h');
    }else{
        var errorMsg = $(rootXmlNode).find('SeckillListPageInfo').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}

/*
资格验证
 */
function doVerify(){
    startSpinner();
    clientService.doPost({
        target: "com.ebuy.seckill2.spdweek.service.SeckillService",
        method: "doVerify",
        dataObj: {
            appId: paramAppId,
            sectionId: sectionIdValue,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign
        },
        callBackWhenSucceed: "afterDoVerify",
        callBackWhenError: "doError"
    })
}
function afterDoVerify(returnValue){
    // alert('afterDoVerify:'+returnValue);
    clearTimeout(verifyTimeOut);
returnValue='<VerifyResult><errorCode>0</errorCode><errorMsg></errorMsg><verifyOrderId>verifyOrderId001</verifyOrderId><status>1</status><certNo>340123199005076097</certNo><verifyTime>1466509034000</verifyTime></VerifyResult>';	
    stopSpinner();
    if(isEmpty(returnValue)){
        doError();
        return;
    }

    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('VerifyResult').find('errorCode').text();
	errorCode="0";
    if(errorCode == '0'){ //正常
        verifyOrderId = $(rootXmlNode).find('VerifyResult').find('verifyOrderId').text();
        status = $(rootXmlNode).find('VerifyResult').find('status').text();
        verifyTime = $(rootXmlNode).find('VerifyResult').find('verifyTime').text();
        certNo = $(rootXmlNode).find('VerifyResult').find('certNo').text();
status="1";
        if(status == "0"){ //等待
            $('[id="overLayer"]').show();
            $('[id="vote_loading"]').show();

            if(verifyTimeFlag == false){
                verifyTimeOut = setTimeout("doFindVerifyResult()",1000);
            }
        }else if(status == "1"){ //成功
            verifyTimeFlag = true;
            $('[id="overLayer"]').hide();
            $('[id="vote_loading"]').hide();

            if(typeValue == 'DIAMOND'){ //钻石场
                showDialog.showInfoDialog({title : "提示信息", msgInfo : "恭喜您获得本月钻石专场（金钻及以上客户）抢兑资格！<br/><span class='normal'>（抢兑资格条件以活动规则为准）</span>",btnOkTxt:'去抢兑',btnOk:function(){
                    _hmt.push(['_trackEvent', '钻石场首页-进入秒杀页', 'click',webClientService.getWebAppName()]);

                    var url = webClientService.getWebAppName() + "/" + paramAppId + "/seckill.html?appId="+paramAppId+'&sectionNo='+paramSectionNo+'&type='+typeValue+'&sectionId='+sectionIdValue+"&platform="+paramPlatform+"&userId="+paramUserId + "&sign="+paramSign + "&type=" + typeValue+ "&timeStamp="+(new Date()).getTime();
                    window.location = url;
                }});
            }
        }else if(status == "2"){ //失败
            verifyTimeFlag = true;
            $('[id="overLayer"]').hide();
            $('[id="vote_loading"]').hide();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : "验证失败！<br/><span class='normal'>（抢兑资格条件以活动规则为准）</span>"});
        }else if(status == "9"){ //错误
            verifyTimeFlag = true;
            $('[id="overLayer"]').hide();
            $('[id="vote_loading"]').hide();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : "系统出错！<br/><span class='normal'>（抢兑资格条件以活动规则为准）</span>"});
        }else if(status == "-2"){ //未到时间
            verifyTimeFlag = true;
            $('[id="overLayer"]').hide();
            $('[id="vote_loading"]').hide();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : "本期名单未公布！<br/><span class='normal'>（抢兑资格条件以活动规则为准）</span>"});
        }else if(status == "-1"){
            verifyTimeFlag = true;
            $('[id="overLayer"]').hide();
            $('[id="vote_loading"]').hide();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : "您还未进行验证！<br/><span class='normal'>（抢兑资格条件以活动规则为准）</span>"});
        }else if(status == "99"){
            verifyTimeFlag = true;
            $('[id="overLayer"]').hide();
            $('[id="vote_loading"]').hide();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : "本期活动已经结束！"});
        }
    }else if(errorCode == "4003"){  //未办卡
        verifyTimeFlag = true;
        $('[id="overLayer"]').hide();
        $('[id="vote_loading"]').hide();
        var errorMsg = $(rootXmlNode).find('VerifyResult').find('errorMsg').text();
        showDialog.showConfirmDialog({title : "提示信息", msgInfo : errorMsg,btnOkTxt:'绑定',btnCancelTxt:'办卡',btnOk:function(){
            // baidu
            _hmt.push(['_trackEvent', '钻石场首页-未绑卡', 'click',webClientService.getWebAppName()]);

            showDialog.showInfoDialog({title : "提示信息", msgInfo : "返回浦发信用卡官方微信主页面，发送“绑定”，并根据提示进行绑定操作。" });
        },btnCancel:function(){
            // baidu
            _hmt.push(['_trackEvent', '钻石场首页-去办卡', 'click',webClientService.getWebAppName()]);

            window.location = 'https://mbank.spdbccc.com.cn/creditcard/indexActivity.htm?data=000004';
        }});
    }else if(errorCode == '5005'){
        verifyTimeFlag = true;
        $('[id="overLayer"]').hide();
        $('[id="vote_loading"]').hide();
        var errorMsg = $(rootXmlNode).find('VerifyResult').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : "恭喜您获得本月钻石专场（金钻及以上客户）抢兑资格！<br/><span class='normal'>（抢兑资格条件以活动规则为准）</span>",btnOkTxt:'去抢兑',btnOk:function(){
            // baidu
            _hmt.push(['_trackEvent', '钻石场首页-进入秒杀页', 'click',webClientService.getWebAppName()]);

            var url = webClientService.getWebAppName() + "/" + paramAppId + "/seckill.html?appId="+paramAppId+'&type='+typeValue+'&sectionId='+sectionIdValue+"&platform="+paramPlatform+"&userId="+paramUserId + "&sign="+paramSign + "&type=" + typeValue+ "&timeStamp="+(new Date()).getTime();
            window.location = url;
        }});
    }else{
        verifyTimeFlag = true;
        $('[id="overLayer"]').hide();
        $('[id="vote_loading"]').hide();
        var errorMsg = $(rootXmlNode).find('VerifyResult').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}

// 查询秒杀结果
function doFindVerifyResult(){
    clientService.doPost({
        target: "com.ebuy.seckill2.spdweek.service.SeckillService",
        method: "findVerifyResult",
        dataObj: {
            appId: paramAppId,
            sectionId: sectionIdValue,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign
        },
        callBackWhenSucceed: "afterDoVerify",
        callBackWhenError: "doError"
    })

    // debug
    // afterDoVerify('<VerifyResult><errorCode>0</errorCode><errorMsg>对不起，系统错误</errorMsg><verifyOrderId>verifyOrderId001</verifyOrderId><status>1</status><verifyTime>1466509034000</verifyTime></VerifyResult>');
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

