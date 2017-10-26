var paramAppId = getQueryStr('appId');
var paramSectionId = getQueryStr('sectionId');
var paramGoodsId = getQueryStr('goodsId');

var appId,sectionId,sectionName,sectionStartTime,sectionEndTime,canLottery,lotteryTimes;
var recordId,userId,goodsId,level,goodsType,goodsName,goodsIconUrl,goodsDetailUrl;
var orderId,orderAppId,orderSectionId,orderGoodsId,orderGoodsSku;

var orderStatus,orderCreateTime,orderExpireTime,orderType;
var orderSerialId,interfaceOrderId,payRequestToken,payCreateTime,payStatus;

// var recordId,userId,goodsId,level,goodsType,goodsName,orderId;
var payStyleValue = '';

$(document).ready(function(){
    startSpinner();
    setHtmlFontSize();
    initWxSetting(initFormInfo,doSendShare,false,true,false);
    // initFormInfo();// debug
});

function initFormInfo(){
    findLotteryPageView(); //抽奖页面信息
    // debug
    // afterFindLotteryPageView('<LotteryPageView><errorCode>0</errorCode><errorMsg>数据出错</errorMsg><appId>appId_000</appId><sectionId>sectionId_000</sectionId><sectionName>第一场</sectionName><sectionStartTime>1491296400000</sectionStartTime><sectionEndTime>1491318000000</sectionEndTime><canLottery>1</canLottery><lotteryTimes>1</lotteryTimes></LotteryPageView>');

    $('[id="btnList"]').find('li').on('click',function(){
                doLottery();
       
    });

    $('[id=’shareLayer]').on('click',function(){ //关闭浮层
        wxData.link = getWebAppAddress() + "/wx_entry/weekseckill";
        wx.hideOptionMenu();
        $('[id=’shareLayer]').hide();
    });
}

// 抽奖页信息
function findLotteryPageView(){
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.LotteryService",
        method: "findLotteryPageView",
        dataObj: {
            channelId:paramChannelId,
            appId: paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:paramSectionId
        },
        callBackWhenSucceed: "afterFindLotteryPageView",
        callBackWhenError: "doError"
    })
}
function afterFindLotteryPageView(returnValue){
    // alert('afterFindLotteryPageView:'+returnValue);
    if(isEmpty(returnValue)){
        doError();
        return;
    }

    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('LotteryPageView').find('errorCode').text();
    if(errorCode == 0){ //正常
        appId = $(rootXmlNode).find('LotteryPageView').find('appId').text();
        sectionId = $(rootXmlNode).find('LotteryPageView').find('sectionId').text();
        sectionName = $(rootXmlNode).find('LotteryPageView').find('sectionName').text();

        sectionStartTime = $(rootXmlNode).find('LotteryPageView').find('sectionStartTime').text();
        sectionEndTime = $(rootXmlNode).find('LotteryPageView').find('sectionEndTime').text();
        canLottery = $(rootXmlNode).find('LotteryPageView').find('canLottery').text();
        lotteryTimes = $(rootXmlNode).find('LotteryPageView').find('lotteryTimes').text();
        
        $('[id="sectionName"]').html(sectionName);
        stopSpinner();
        $('[id="page"]').removeClass('vis_h');

        // 检索抽奖信息
        doFindLotteryResultBySectionId();
    }else{
        var errorMsg = $(rootXmlNode).find('LotteryPageView').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}

//检索抽奖信息
function doFindLotteryResultBySectionId(){
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.LotteryService",
        method: "findLotteryResultBySectionId",
        dataObj: {
            channelId:paramChannelId,
            appId: paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:paramSectionId
        },
        callBackWhenSucceed: "afterFindLotteryResultBySectionId",
        callBackWhenError: "doError"
    })

}
function afterFindLotteryResultBySectionId(returnValue){
    // alert('afterFindLotteryResultBySectionId:'+returnValue);
    stopSpinner();
    if(isEmpty(returnValue)){ //未参加过
        
    }else{
        var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
        var errorCode = $(rootXmlNode).find('LotteryResult').find('errorCode').text();
        if(errorCode == 0){ //正常        
            recordId = $(rootXmlNode).find('LotteryResult').find('recordId').text();
            userId = $(rootXmlNode).find('LotteryResult').find('userId').text();
            goodsId = $(rootXmlNode).find('LotteryResult').find('goodsId').text();
            level = $(rootXmlNode).find('LotteryResult').find('level').text();
            goodsType = $(rootXmlNode).find('LotteryResult').find('goodsType').text();
            goodsName = $(rootXmlNode).find('LotteryResult').find('goodsName').text();
            orderId = $(rootXmlNode).find('LotteryResult').find('orderId').text();
            orderAppId = $(rootXmlNode).find('LotteryResult').find('orderAppId').text();
            orderSectionId = $(rootXmlNode).find('LotteryResult').find('orderSectionId').text();
            orderGoodsId = $(rootXmlNode).find('LotteryResult').find('orderGoodsId').text();
            orderGoodsSku = $(rootXmlNode).find('LotteryResult').find('orderGoodsSku').text();
            
            if(level < 0){  //未中奖
                if(isWeixin()){ //微信端
                    // showDialog.showMultiBtnDialog({
                    //     title : "未获得金钥匙", 
                    //     msgInfo : '你有一笔用<em class="count">888</em>积分购买<br/>金钥匙订单尚未付款<br/><i>(可在我的订单中查看)</i>',
                    //     btnOkTxt:'稍后付',
                    //     btnMultiTxt:'自己付',
                    //     btnCancelTxt:'好友付',
                    //     btnOk:function(){
                            
                    //     },
                    //     btnMulti:function(){
                    //         payOrder();
                    //     },
                    //     btnCancel:function(){ //好友支付 分享
                    //         wx.showOptionMenu();
                    //         wxData.link = getWebAppAddress() + "/wx_entry/weekseckill?orderId="+orderId+"&appId="+paramAppId+"&parentUserId="+userId+"&sectionId="+paramSectionId+"&channelId="+paramChannelId+"&goodsId="+goodsId;
                    //         $('[id="shareLayer"]').show();
                    //         alert(wxData.link)
                    //     }
                    // });
                    showDialog.showConfirmDialog({
                        title : "提示信息",
                        msgInfo : '你有一笔用<em class="count">888</em>积分购买<br/>金钥匙订单尚未付款<br/><i>(可在我的订单中查看)</i>',
                        btnOkTxt:'稍后付',
                        btnCancelTxt:'自己付',
                        btnOk:function(){
                            
                        },btnCancel:function(){ //跳转支付页面
                            payOrder();
                        }
                    });
                }else{ //app端
                    showDialog.showConfirmDialog({
                        title : "提示信息",
                        msgInfo : '你有一笔用<em class="count">888</em>积分购买<br/>金钥匙订单尚未付款<br/><i>(可在我的订单中查看)</i>',
                        btnOkTxt:'稍后付',
                        btnCancelTxt:'自己付',
                        btnOk:function(){
                            
                        },btnCancel:function(){ //跳转支付页面
                            payOrder();
                        }
                    });
                }
            }else if(level >= 0){ //已中奖
                showDialog.showInfoDialog({title : "提示信息", msgInfo : "恭喜您获得本期金钥匙！"});
            }
        }else{
            var errorMsg = $(rootXmlNode).find('LotteryResult').find('errorMsg').text();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
        }
    }    
}

function payOrder(){    
    startSpinner();
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.SalesService",
        method: "payOrder",
        dataObj: {
            channelId:paramChannelId,
            appId: orderAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:orderSectionId,
            goodsId:orderGoodsId,
            goodsSku:orderGoodsSku,
            orderId:orderId
        },
        callBackWhenSucceed: "afterPayOrder",
        callBackWhenError: "afterPayOrder"
    })
}
function afterPayOrder(returnValue){
    // alert('afterPayOrder:'+returnValue);
    stopSpinner();
    if(isEmpty(returnValue)){
        doError();
        return;
    }

    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('SalesResult').find('errorCode').text();
    if(errorCode == 0){ //正常
        var orderGoodsId = $(rootXmlNode).find('SalesResult').find('orderGoodsId').text();
        var orderGoodsSku = $(rootXmlNode).find('SalesResult').find('orderGoodsSku').text();
        var orderId = $(rootXmlNode).find('SalesResult').find('orderId').text();
        var orderStatus = $(rootXmlNode).find('SalesResult').find('orderStatus').text();
        var orderCreateTime = $(rootXmlNode).find('SalesResult').find('orderCreateTime').text();
        var orderExpireTime = $(rootXmlNode).find('SalesResult').find('orderExpireTime').text();
        var orderType = $(rootXmlNode).find('SalesResult').find('orderType').text();
        var orderSerialId = $(rootXmlNode).find('SalesResult').find('orderSerialId').text();
        var interfaceOrderId = $(rootXmlNode).find('SalesResult').find('interfaceOrderId').text();
        var payRequestToken = $(rootXmlNode).find('SalesResult').find('payRequestToken').text();
        var payCreateTime = $(rootXmlNode).find('SalesResult').find('payCreateTime').text();
        var payStatus = $(rootXmlNode).find('SalesResult').find('payStatus').text();
        var cashBoxHtml = $(rootXmlNode).find('SalesResult').find('cashBoxHtml').text();
        // 跳转收银台
        window.location = "https://pay2.e-pointchina.com/spdpay/"+ cashBoxHtml + "?order_id=" + encodeURIComponent(interfaceOrderId) + "&payRequestToken=" + encodeURIComponent(payRequestToken);

    }else{
        var errorMsg = $(rootXmlNode).find('SalesResult').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}

// 抽奖
function doLottery(){
    // alert(paramChannelId+'->'+appId+'->'+cookieAuthTicket+'->'+paramUserId+'->'+paramSign+'->'+sectionId);
    startSpinner();
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.LotteryService",
        method: "doLottery",
        dataObj: {
            channelId:paramChannelId,
            appId: paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:paramSectionId
        },
        callBackWhenSucceed: "afterDoLottery",
        callBackWhenError: "afterDoLottery"
    })
}
function afterDoLottery(returnValue){
    // alert('afterDoLottery:'+returnValue);
    stopSpinner();
    if(isEmpty(returnValue)){
        doError();
        return;
    }

    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('LotteryResult').find('errorCode').text();
    if(errorCode == 0){ //正常
        recordId = $(rootXmlNode).find('LotteryResult').find('recordId').text();
        goodsId = $(rootXmlNode).find('LotteryResult').find('goodsId').text();
        level = $(rootXmlNode).find('LotteryResult').find('level').text();
        goodsType = $(rootXmlNode).find('LotteryResult').find('goodsType').text();
        goodsName = $(rootXmlNode).find('LotteryResult').find('goodsName').text();
        orderId = $(rootXmlNode).find('LotteryResult').find('orderId').text();
        orderAppId = $(rootXmlNode).find('LotteryResult').find('orderAppId').text();
        orderSectionId = $(rootXmlNode).find('LotteryResult').find('orderSectionId').text();
        orderGoodsId = $(rootXmlNode).find('LotteryResult').find('orderGoodsId').text();
        orderGoodsSku = $(rootXmlNode).find('LotteryResult').find('orderGoodsSku').text();

        if(level < 0){  //没有获得资格            
            if(isWeixin()){ //微信端
                // showDialog.showMultiBtnDialog({
                //     title : "未获得金钥匙", 
                //     msgInfo : '未获得金钥匙<br/>直接用<em class="count">888</em>积分<br/>购买金钥匙<br/><i>(可在我的订单中查看)</i>',
                //     btnOkTxt:'稍后付',
                //     btnMultiTxt:'自己付',
                //     btnCancelTxt:'好友付',
                //     btnOk:function(){

                //     },
                //     btnMulti:function(){
                //         payOrder();
                //     },
                //     btnCancel:function(){
                //         wx.showOptionMenu();
                //         wxData.link = getWebAppAddress() + "/wx_entry/weekseckill?orderId="+orderId+"&appId="+paramAppId+"&parentUserId="+userId+"&sectionId="+paramSectionId+"&channelId="+paramChannelId+"&goodsId="+goodsId;
                //         $('[id="shareLayer"]').show();
                //         alert(wxData.link);
                //     }
                // });
                showDialog.showConfirmDialog({
                    title : "提示信息",
                    msgInfo : '你有一笔用<em class="count">888</em>积分购买<br/>金钥匙订单尚未付款<br/><i>(可在我的订单中查看)</i>',
                    btnOkTxt:'稍后付',
                    btnCancelTxt:'自己付',
                    btnOk:function(){
                        
                    },btnCancel:function(){ //跳转支付页面
                        payOrder();
                    }
                });
            }else{ //app端
                showDialog.showConfirmDialog({
                    title : "提示信息", 
                    msgInfo : '未获得金钥匙<br/>直接用<em class="count">888</em>积分<br/>购买金钥匙<br/><i>(可在我的订单中查看)</i>',
                    btnOkTxt:'稍后付',
                    btnCancelTxt:'自己付',
                    btnOk:function(){
                        
                    },btnCancel:function(){ //跳转支付页面
                        payOrder();
                    }
                });
            }
        }else{ //获得资格
            showDialog.showInfoDialog({title : "提示信息", msgInfo : "恭喜您获得本期金钥匙！"});
        }
    }else{
        var errorMsg = $(rootXmlNode).find('LotteryResult').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}