var paramAppId = getQueryStr('appId');
var paramSectionId = getQueryStr('sectionId');
var paramGoodsId = getQueryStr('goodsId');

var infoListNode,infoListNodeCopy,payListNode,payListNodeCopy;
var appId, sectionId,sectionType,sectionName,sectionStartTime,sectionEndTime,sectionIconUrl,sectionDetailUrl;
var goodsId,goodsType,goodsName,goodsIconUrl,goodsDetailUrl,goodsDescption;
var orderId;

$(document).ready(function(){
    startSpinner();
    setHtmlFontSize();
    initWxSetting(initFormInfo,doSendShare,true,true,false);
    // initFormInfo();// debug
});

function initFormInfo(){
    payListNode = $('[id="payList"]')[0];
    var payListNodeTmp = $('[payListResult="GoodsPaymentItem"]')[0];
    payListNodeCopy = $(payListNodeTmp).clone();
    $(payListNodeTmp).remove();

    infoListNode = $('[id="infoList"]')[0];
    var a = $('[infoResult="LineInfo"]')[0];
    infoListNodeCopy = $(a).clone();
    $(a).remove();

    findSectionGoodsDetailInfo();//查询商品详细
    // debug
    // afterFindSectionGoodsDetailInfo('<SPDBSectionGoodsDetailPageView><errorCode>0</errorCode><errorMsg>数据出错</errorMsg><appId>appId_000</appId><sectionId>sectionId_000</sectionId><appType>appType_000</appType><sectionStartTime>1496246400000</sectionStartTime><sectionEndTime>1496329200000</sectionEndTime><arrGoodsLines><LineInfo><lineName>高端酒店1间夜住宿权益权益</lineName><lineValue></lineValue></LineInfo><LineInfo><lineName>发放资格数量：</lineName><lineValue>10000份</lineValue></LineInfo></arrGoodsLines><arrGoodsPays><GoodsPaymentItem><accountId>spdcreditcard_031000705300001</accountId><amount>699.0</amount><cash>699.0</cash><installment_num>1</installment_num><name>699元</name><point>0</point><sku>GBC</sku><type>C</type></GoodsPaymentItem></arrGoodsPays><goodsId>goodsId_000</goodsId><goodsType>goodsType_000</goodsType><goodsName>goodsName_000</goodsName><goodsIconUrl>./imgs/pro.png</goodsIconUrl><goodsDetailUrl></goodsDetailUrl><goodsDescption></goodsDescption><orderId></orderId></SPDBSectionGoodsDetailPageView>');

    $('[id="doPay"]').unbind('click').bind('click',function(){
        var a = (new Date).getTime();

            if(isEmpty(orderId)){ //正常流程
                goodsSku = $('[id="payList"]').find('li.on').find('[payListResult="sku"]').val();
                createPO();
            }else{ //已经抢到资格 查询订单  跳转
                doFindLastOrder();
            }
       
    })
}

// 商品详细
function findSectionGoodsDetailInfo(){
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.spdb.CampaignService",
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
    var errorCode = $(rootXmlNode).find('SPDBSectionGoodsDetailPageView').find('errorCode').text();
    if(errorCode == 0){ //正常
        appId = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("appId").text();
        sectionId = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("sectionId").text();
        sectionType = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("sectionType").text();
        sectionName = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("sectionName").text();
        sectionStartTime = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("sectionStartTime").text();
        sectionEndTime = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("sectionEndTime").text();
        sectionIconUrl = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("sectionIconUrl").text();
        
        goodsId = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("goodsId").text();
        goodsType = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("goodsType").text();
        goodsName = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("goodsName").text();

        goodsIconUrl = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("goodsIconUrl").text();
        goodsDetailUrl = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("goodsDetailUrl").text();
        goodsDescption = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("goodsDescption").text();

        orderId = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("orderId").text();
        
        $('[id="public_img_url"]').attr('src',goodsIconUrl);

        var arrSectionLines = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("arrSectionLines");
        var arrGoodsLines = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("arrGoodsLines");
        var arrGoodsPays = $(rootXmlNode).find("SPDBSectionGoodsDetailPageView").find("arrGoodsPays");

        $(arrSectionLines).find("LineInfo").each(function(a) {
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
    }else{
        var errorMsg = $(rootXmlNode).find('SPDBSectionGoodsDetailPageView').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}

function createPO(){
    // alert(sectionId+'-'+goodsId+'-'+goodsSku);
    startSpinner();
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.spdb.MorningService",
        method: "createPO",
        dataObj: {
            channelId: paramChannelId,
            appId:paramAppId,
            authTicket: cookieAuthTicket,
            ownerUserId: paramUserId,
            sign: paramSign,
            sectionId:sectionId,
            goodsId:goodsId,
            goodsSku:goodsSku
        },
        callBackWhenSucceed: "afterCreatePO",
        callBackWhenError: "doError"
    })
}

function afterCreatePO(returnValue){
    // alert('afterCreatePO:'+returnValue);
    stopSpinner();
    if(isEmpty(returnValue)){
        doError();
        return
    }
    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('SalesResult').find('errorCode').text();
    if(errorCode == 0){ //正常
        var orderGoodsId = $(rootXmlNode).find('SalesResult').find('errorCode').text();
        var orderGoodsSku = $(rootXmlNode).find('SalesResult').find('orderGoodsSku').text();
        var orderId = $(rootXmlNode).find('SalesResult').find('orderId').text();
        var orderStatus = $(rootXmlNode).find('SalesResult').find('orderStatus').text();
        var orderCreateTime = $(rootXmlNode).find('SalesResult').find('orderCreateTime').text();
        var orderExpireTime = $(rootXmlNode).find('SalesResult').find('orderExpireTime').text();
        var orderType = $(rootXmlNode).find('SalesResult').find('orderExpireTime').text();
        var orderSerialId = $(rootXmlNode).find('SalesResult').find('orderSerialId').text();
        var interfaceOrderId = $(rootXmlNode).find('SalesResult').find('interfaceOrderId').text();
        var payRequestToken = $(rootXmlNode).find('SalesResult').find('payRequestToken').text();
        var payCreateTime = $(rootXmlNode).find('SalesResult').find('payCreateTime').text();
        var payStatus = $(rootXmlNode).find('SalesResult').find('payStatus').text();
        var cashBoxHtml = $(rootXmlNode).find('SalesResult').find('cashBoxHtml').text();

        if(isEmpty(interfaceOrderId)){ //没抢到
            showDialog.showInfoDialog({title : "提示信息", msgInfo : "很抱歉<br/>您未获得下午场抢兑资格<span class='tip'>*抢兑资格条件以活动规则为准</span>"});
        }else{ //抢到了
            if(orderExpireTime == 0 || orderExpireTime > new Date().getTime()){
                    // 跳转收银台
                    window.location = "https://pay2.e-pointchina.com/spdpay/" + cashBoxHtml + "?order_id=" + encodeURIComponent(interfaceOrderId);
                }else{
                    showDialog.showInfoDialog({title : "提示信息", msgInfo : "订单已过期！"});
                }
            // showDialog.showInfoDialog({title : "提示信息", msgInfo : "恭喜您<br/>获得下午场抢兑资格，快去支付吧！<br/>支付订单30分钟内均有效<span class='tip'>*抢兑资格条件以活动规则为准</span>",btnOkTxt:'去支付',btnOk:function(){
                
            // }});
        }
    }else if(errorCode == 1014){
        showDialog.showInfoDialog({title : "提示信息", msgInfo : "很抱歉<br/>名额已抢完<span class='tip'>*抢兑资格条件以活动规则为准</span>"});
    }else if(errorCode == 1234){
        showDialog.showInfoDialog({title : "提示信息", msgInfo : "很抱歉<br/>您未获得下午场抢兑资格<span class='tip'>*抢兑资格条件以活动规则为准</span>"});
    }else{
        var errorMsg = $(rootXmlNode).find('SalesResult').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}

function doFindLastOrder(){
    startSpinner();
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.spdb.MorningService",
        method: "findLastOrder",
        dataObj: {
            channelId: paramChannelId,
            appId:paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:sectionId
        },
        callBackWhenSucceed: "afterFindLastOrder",
        callBackWhenError: "doError"
    })
}
function afterFindLastOrder(returnValue){
    // alert('afterFindLastOrder:'+returnValue);
    stopSpinner();
    if(isEmpty(returnValue)){ //没有参加过

    }else{
        var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
        var errorCode = $(rootXmlNode).find('SalesResult').find('errorCode').text();
        if(errorCode == 0){ //正常
            var orderGoodsId = $(rootXmlNode).find('SalesResult').find('errorCode').text();
            var orderGoodsSku = $(rootXmlNode).find('SalesResult').find('orderGoodsSku').text();
            var orderId = $(rootXmlNode).find('SalesResult').find('orderId').text();
            var orderStatus = $(rootXmlNode).find('SalesResult').find('orderStatus').text();
            var orderCreateTime = $(rootXmlNode).find('SalesResult').find('orderCreateTime').text();
            var orderExpireTime = $(rootXmlNode).find('SalesResult').find('orderExpireTime').text();
            var orderType = $(rootXmlNode).find('SalesResult').find('orderExpireTime').text();
            var orderSerialId = $(rootXmlNode).find('SalesResult').find('orderSerialId').text();
            var interfaceOrderId = $(rootXmlNode).find('SalesResult').find('interfaceOrderId').text();
            var payRequestToken = $(rootXmlNode).find('SalesResult').find('payRequestToken').text();
            var payCreateTime = $(rootXmlNode).find('SalesResult').find('payCreateTime').text();
            var payStatus = $(rootXmlNode).find('SalesResult').find('payStatus').text();
            var cashBoxHtml = $(rootXmlNode).find('SalesResult').find('cashBoxHtml').text();

            if(isEmpty(interfaceOrderId)){
                // showDialog.showInfoDialog({title : "提示信息", msgInfo : "请前往我的订单查看详情"});
            }else{
                if(orderExpireTime == 0 || orderExpireTime > new Date().getTime()){
                    // 跳转收银台
                    window.location = "https://pay2.e-pointchina.com/spdpay/" + cashBoxHtml + "?order_id=" + encodeURIComponent(interfaceOrderId);
                }else{
                    showDialog.showInfoDialog({title : "提示信息", msgInfo : "订单已过期！"});
                }
            }
        }else{
            var errorMsg = $(rootXmlNode).find('SalesResult').find('errorMsg').text();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
        }
    }
}