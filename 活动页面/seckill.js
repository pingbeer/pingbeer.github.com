var paramAppId = getQueryStr('appId');
var paramSectionId = getQueryStr('sectionId');
var paramGoodsId = getQueryStr('goodsId');
var captchaPassGGGG="";
var infoListNode,infoListNodeCopy,payListNode,payListNodeCopy;
var appId, sectionId,sectionType,sectionName,sectionStartTime,sectionEndTime,sectionIconUrl,sectionDetailUrl;
var goodsId,goodsType,goodsName,goodsIconUrl,goodsDetailUrl,goodsDescption;
var isTimeOut, seckillTimeOut, isTimeFlag = !1,seckillTimeFlag = !1;
var _captcha, accessToken, curTime, seckillInterface, dbClickFlag = !1;

var orderId,status;

$(document).ready(function(){
    startSpinner();
    setHtmlFontSize();
    initWxSetting(initFormInfo,doSendShare,false,true,false);
    //initFormInfo();
    // initFormInfo();// debug
    //$('[id="doGotoPay"]').click();
});

function initFormInfo(){
    payListNode = $('[id="payList"]')[0];
    var payListNodeTmp = $('[payListResult="GoodsPaymentItem"]')[0];
    payListNodeCopy = $(payListNodeTmp).clone();
    $(payListNodeTmp).remove();

    infoListNode = $('[id="infoList"]')[0];
    var a = $('[infoResult="DisplayLine"]')[0];
    infoListNodeCopy = $(a).clone();
    $(a).remove();

    findSectionGoodsDetailInfo();//查询商品详细
    // debug
    // afterFindSectionGoodsDetailInfo('<SectionGoodsDetailPageView><appId>sale</appId><appType>SALE</appType><arrGoodsLines><LineInfo><lineName>爆品：</lineName><lineValue>好孩子（Goodbaby）儿童汽车安全座椅 CS901（颜色随机）</lineValue></LineInfo><LineInfo><lineName>市场价：</lineName><lineValue>699元</lineValue></LineInfo><LineInfo><lineName>爆品数量：</lineName><lineValue>300份</lineValue></LineInfo><LineInfo><lineName>场次：</lineName><lineValue>第一期</lineValue></LineInfo></arrGoodsLines><arrGoodsPays><GoodsPaymentItem><accountId>spdcreditcard_031000705300001</accountId><amount>699.0</amount><cash>699.0</cash><installment_num>1</installment_num><name>699元</name><point>0</point><sku>GBC</sku><type>C</type></GoodsPaymentItem></arrGoodsPays><errorCode>0</errorCode><errorMsg></errorMsg><goodsDescption>&amp;lt;p&amp;gt;安全舒适一步到位；面料全新升级；侧翼加厚设计；头托可调节设计；五点式安全带；伴随宝宝成长；快速折叠方便收纳。&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;适用年龄：9个月-12岁&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;承重量：36kg以下&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;产品毛重：5.9kg&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;产品净重：4.7kg&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;产品尺寸：420x470x710mm&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;固定方式：安全带固定&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;安装方式：正向安装&amp;lt;/p&amp;gt;</goodsDescption><goodsDetailUrl>https://magicactivity.oss-cn-hangzhou.aliyuncs.com/campaign/GDBOY.jpg</goodsDetailUrl><goodsIconUrl>https://magicactivity.oss-cn-hangzhou.aliyuncs.com/campaign/GDBOY.jpg</goodsIconUrl><goodsId>GDBOY</goodsId><goodsName>好孩子（Goodbaby）儿童汽车安全座椅 CS901（颜色随机）</goodsName><goodsType>MAIL</goodsType><sectionEndTime>1491458539000</sectionEndTime><sectionIconUrl></sectionIconUrl><sectionId>SALES003</sectionId><sectionName>XXXX购买爆品</sectionName><sectionStartTime>1491333000000</sectionStartTime></SectionGoodsDetailPageView>');

//	doPrepareSeckill();
    $('[id="doGotoPay"]').unbind("click").bind("click", function() {

        doPrepareSeckill();

        // afterpPepareSeckill('<PrepareSeckillResult><errorCode>0</errorCode><errorMsg>数据出错</errorMsg><appId>weekseckill</appId><sectionId>ZZQ001</sectionId><goodsId>GDBOY</goodsId><accessToken>+10d3e18ef8ba430d857185b5add92264</accessToken><createTime>1491423536505</createTime><seckillInterface>doSeckill</seckillInterface></PrepareSeckillResult>');

    });
}

// 商品详细
function findSectionGoodsDetailInfo(){
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.CampaignService",
        method: "findSectionGoodsDetailInfo",
        dataObj: {
            channelId: paramChannelId,
            appId:paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:paramSectionId,
            goodsId:paramGoodsId
        },
        callBackWhenSucceed: "afterFindSectionGoodsDetailInfo",
        callBackWhenError: "doError"
    })
}
function afterFindSectionGoodsDetailInfo(returnValue){
    // alert('afterFindSectionGoodsDetailInfo:'+returnValue);
    stopSpinner();
    if(isEmpty(returnValue)){
        doError();
        return
    }

    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('SectionGoodsDetailPageView').find('errorCode').text();
    if(errorCode == 0){ //正常
        appId = $(rootXmlNode).find("SectionGoodsDetailPageView").find("appId").text();
        sectionId = $(rootXmlNode).find("SectionGoodsDetailPageView").find("sectionId").text();
        sectionType = $(rootXmlNode).find("SectionGoodsDetailPageView").find("sectionType").text();
        sectionName = $(rootXmlNode).find("SectionGoodsDetailPageView").find("sectionName").text();
        sectionStartTime = $(rootXmlNode).find("SectionGoodsDetailPageView").find("sectionStartTime").text();
        sectionEndTime = $(rootXmlNode).find("SectionGoodsDetailPageView").find("sectionEndTime").text();
        sectionIconUrl = $(rootXmlNode).find("SectionGoodsDetailPageView").find("sectionIconUrl").text();
        goodsId = $(rootXmlNode).find("SectionGoodsDetailPageView").find("goodsId").text();
        goodsType = $(rootXmlNode).find("SectionGoodsDetailPageView").find("goodsType").text();
        goodsName = $(rootXmlNode).find("SectionGoodsDetailPageView").find("goodsName").text();

        goodsIconUrl = $(rootXmlNode).find("SectionGoodsDetailPageView").find("goodsIconUrl").text();
        goodsDetailUrl = $(rootXmlNode).find("SectionGoodsDetailPageView").find("goodsDetailUrl").text();
        goodsDescption = $(rootXmlNode).find("SectionGoodsDetailPageView").find("goodsDescption").text();

        $('[id="public_img_url"]').attr('src',goodsIconUrl);
        $('[id="goodsDescption"]').html(escape2Html(goodsDescption));

        var arrSectionLines = $(rootXmlNode).find("SectionGoodsDetailPageView").find("arrSectionLines");
        var arrGoodsLines = $(rootXmlNode).find("SectionGoodsDetailPageView").find("arrGoodsLines");
        var arrGoodsPays = $(rootXmlNode).find("SectionGoodsDetailPageView").find("arrGoodsPays");

        $(arrGoodsLines).find("LineInfo").each(function(a) {
            a = $(infoListNodeCopy).clone();
            $(a).find('[infoResult="name"]').val($(this).find("lineName").text());
            $(a).find('[infoResult="value"]').val($(this).find("lineValue").text());
            $(a).find(".nameValue").html($(this).find("lineName").text() + $(this).find("lineValue").text());
            $(infoListNode).append(a);
        });

        // 设置sku相关信息
        $(arrGoodsPays).find('GoodsPaymentItem').each(function(num){
            var clonePayListNode = $(payListNodeCopy).clone();
            $(clonePayListNode).find('[payListResult="name"]').html($(this).find('name').text());
            $(clonePayListNode).find('[payListResult="sku"]').val($(this).find('sku').text());
            $(clonePayListNode).find('[payListResult="type"]').val($(this).find('type').text());
            $(clonePayListNode).find('[payListResult="cash"]').val($(this).find('cash').text());
            $(clonePayListNode).find('[payListResult="point"]').val($(this).find('point').text());
            $(clonePayListNode).find('[payListResult="amount"]').val($(this).find('amount').text());
            $(clonePayListNode).find('[payListResult="installment_num"]').val($(this).find('installment_num').text());
            $(clonePayListNode).find('[payListResult="accountId"]').val($(this).find('accountId').text());

            if(num == 0){
                $(clonePayListNode).addClass('on');
            }

            $('[id="payList"]').append(clonePayListNode);
        });

        stopSpinner();
        $('[id="page"]').removeClass('vis_h');

        // 查询秒杀结果
        findSeckillResultBySectionId();
        // afterFindSeckillResultBySectionId('');
    }else{
        var errorMsg = $(rootXmlNode).find('SectionGoodsDetailPageView').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}
function doError(){

    doPrepareSeckill();
}
// 开始秒杀准备
function doPrepareSeckill(){
    startSpinner();
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.SeckillService",
        method: "prepareSeckill",
        dataObj: {
            channelId: paramChannelId,
            appId:paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:paramSectionId,
            goodsId:paramGoodsId
        },
        callBackWhenSucceed: "afterpPepareSeckill",
        //  callBackWhenError: "doError"
        callBackWhenError: "afterpPepareSeckill"
    })
}
function afterpPepareSeckill(returnValue){

    stopSpinner();
    //正式开始需要把注释全部去掉 settimeout事件变成10

    if(isEmpty(returnValue)){
        doPrepareSeckill();
        return
    }
    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('PrepareSeckillResult').find('errorCode').text();
    //  if(errorCode == 0){ //正常
    appId = $(rootXmlNode).find("PrepareSeckillResult").find("appId").text();
    sectionId = $(rootXmlNode).find("PrepareSeckillResult").find("sectionId").text();
    goodsId = $(rootXmlNode).find("PrepareSeckillResult").find("goodsId").text();
    accessToken = $(rootXmlNode).find("PrepareSeckillResult").find("accessToken").text();
    createTime = $(rootXmlNode).find("PrepareSeckillResult").find("createTime").text();
    seckillInterface = $(rootXmlNode).find("PrepareSeckillResult").find("seckillInterface").text();
    doShowCaptcha(); //显示验证码

}

function doShowCaptcha() {
    _captcha = new Captcha({
        app: paramAppId,
        userId: paramUserId,
        appTimestamp: createTime,
        appToken: accessToken,
        captchaType: "1",
        callback: function(a, b) {
            dbClickFlag = !1;

            doSecKill(b.captchaId, b.captchaPass);
            captchaPassGGGG=b.captchaPass;
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
    //https://captcha.e-pointchina.com/captcha/myjs/abstract-captcha.min.js
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
            //alert("_btn_submit");
            _captcha.onSubmit()
        })
    });
    _captcha.toggle()
}
function doSecKill(a, b) {
    startSpinner();
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.SeckillService",
        method: "doSeckill",
        dataObj: {
            channelId: paramChannelId,
            appId:paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:paramSectionId,
            goodsId:paramGoodsId,
            goodsSku:'',
            lastCardNo:'',
            captchaId:a,
            captchaPass:b,
            appTimestamp:createTime,
            appToken:accessToken
        },
        callBackWhenSucceed: "afterDoSeckill",
        callBackWhenError: "doError"
    })
}
function afterDoSeckill(returnValue){
    // alert('afterDoSeckill:'+returnValue);
    stopSpinner();
    if(isEmpty(returnValue)){
        doError();
        return
    }
    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('SeckillResult').find('errorCode').text();
    orderId = $(rootXmlNode).find("SeckillResult").find("orderId").text();
    status = $(rootXmlNode).find("SeckillResult").find("status").text();

    if(errorCode == 0){ //正常
        if(status == '0'){ //等待

        }else if(status == '1'){ //成功
            seckillTimeFlag == 1;
            $('[id="overLayer"]').hide();
            $('[id="vote_loading"]').hide();

            showDialog.showInfoDialog({title : "提示信息", msgInfo : "您已成功抢兑1份<br/>快去“我的奖品”查看详情。<br/><span class='small'>*若您未能填写完整的收货地址，小浦即会默认将奖品寄送到您的账单地址<br /></span>",btnOk:function(){
                var a = "./list.html?appId=" + paramAppId + "&channelId=" + paramChannelId + "&sectionId=" + paramSectionId + "&userId=" + paramUserId + "&sign=" + paramSign + "&timeStamp=" + captchaPassGGGG;
                window.location = a
            }});
        }else if(status == '2'){
            seckillTimeFlag == 1;
            $('[id="overLayer"]').hide();
            $('[id="vote_loading"]').hide();

            showDialog.showInfoDialog({title : "提示信息", msgInfo : "名额已抢完<br/><span class='normal'>赠送您浦发信用卡10积分以资鼓励"});
        }else if(status == '9'){
            seckillTimeFlag == 1;
            $('[id="overLayer"]').hide();
            $('[id="vote_loading"]').hide();

            showDialog.showInfoDialog({title : "提示信息", msgInfo : "系统出错！"});
        }

    }else if(errorCode == '4001'){
        if(status == '1'){
            seckillTimeFlag  = true;
            showDialog.showInfoDialog({
                title: "提示信息",
                msgInfo: "对不起，已被抢完！",
            });
        }else{
            seckillTimeFlag  = true;
            showDialog.showInfoDialog({
                title: "提示信息",
                msgInfo: $(a).find("EnjoyFoodsSeckillResult").find("errorMsg").text()
            });
        }
    }else{
        seckillTimeFlag  = true;
        var errorMsg = $(rootXmlNode).find('SeckillResult').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}

function findSeckillResultBySectionId(){
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.SeckillService",
        method: "findSeckillResultBySectionId",
        dataObj: {
            channelId: paramChannelId,
            appId:paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:sectionId
        },
        callBackWhenSucceed: "afterFindSeckillResultBySectionId",
        callBackWhenError: "doError"
    })
}
function afterFindSeckillResultBySectionId(returnValue){
    // alert('afterFindSeckillResultBySectionId:'+returnValue);
    stopSpinner();
    if(isEmpty(returnValue)){

    }else{
        var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
        var errorCode = $(rootXmlNode).find('SeckillResult').find('errorCode').text();
        if(errorCode == 0){ //正常
            status = $(rootXmlNode).find('SeckillResult').find('status').text();

            $('[id="page"]').removeClass('vis_h');
        }else{
            var errorMsg = $(rootXmlNode).find('SeckillResult').find('errorMsg').text();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
        }
    }
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