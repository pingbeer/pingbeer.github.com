var paramNum = getQueryStr('num');
var paramSectionId = getQueryStr('sectionId');
var paramGoodsId  = getQueryStr('goodsId');

var proListNode,proListNodeCopy,infoListNode,infoListNodeCopy,payListNode,payListNodeCopy;
var section_id,goods_id,section_start_time,section_end_time,goodsSku;

var seckillTimeOut;
var seckillTimeFlag = false;
var seckillTimeFlag2 = false;
var currIndex;

var stockCount;

var isTimeOut_0,isTimeOut_1,isTimeOut_2,isTimeOut_3,seckillTimeOut,seckillTimeOut2;
var isTimeFlag_0 = isTimeFlag_1 = isTimeFlag_2 = isTimeFlag_3 = false;

var index_0,index_1,index_2,index_3;
var appStartTime_0,appStartTime_1,appStartTime_2,appStartTime_3;
var appEndTime_0,appEndTime_1,appEndTime_2,appEndTime_3;
var count_0,count_1,count_2,count_3;

var interfaceOrderId,payRequestToken,orderId,status;

$(document).ready(function() {
    startSpinner();
    setHtmlFontSize();
    initWxSetting(initFormInfo,null,true,true,false);
    // debug
    // initFormInfo();
});

function initFormInfo(){

    $('[id="content"]').html($('[num='+paramNum+']').html());
    $('[id="page"]').attr('num',paramNum);

    // dom copy
    infoListNode = $('[id="infoList"]')[0];
    var infoListNodeTmp = $('[infoResult="DisplayLine"]')[0];
    infoListNodeCopy = $(infoListNodeTmp).clone();
    $(infoListNodeTmp).remove();

    payListNode = $('[id="payList"]')[0];
    var payListNodeTmp = $('[payListResult="EnjoyFoodsPaymentInfo"]')[0];
    payListNodeCopy = $(payListNodeTmp).clone();
    $(payListNodeTmp).remove();

    proListNode = $('[id="List"]')[0];
    var proListNodeTmp = $('[searchResult="EnjoyFoodsGoodsDetailInfo"]')[0];
    proListNodeCopy = $(proListNodeTmp).clone();
    $(proListNodeTmp).remove();

    // 检索商品详细
    doGetEnjoyFoodsGoodsDetailInfo();
    // debug
    // afterGetEnjoyFoodsGoodsDetailInfo('<EnjoyFoodsSeckillDetailPageInfo><errorCode>0</errorCode><errorMsg>对不起，系统错误</errorMsg><arrList><EnjoyFoodsGoodsDetailInfo><goods_extra_info></goods_extra_info><icon>./imgs/pro/pro_1.png</icon><shopListId>0000001d4da1ee01</shopListId><stockCount>10</stockCount><consumeCount>16</consumeCount><totalCount>26</totalCount><goods_id>goods_id001</goods_id><section_id>section_0011</section_id><goods_name>沃之稻 响水核心产区 稻花香 2kg X 2袋</goods_name><arrLines><DisplayLine><name></name><value>沃之稻 响水核心产区 稻花香 2kg X 2袋</value></DisplayLine><DisplayLine><name>生米晶莹圆润，熟饭口感爽滑，香气清雅优远</name><value></value></DisplayLine><DisplayLine><name>秒杀价:&lt;span class=&quot;red&quot;&gt;1&lt;/span&gt;元&lt;em class=&quot;tdl&quot;&gt;市场价:256元&lt;/em&gt;</name><value></value></DisplayLine><DisplayLine><name></name><value>限量:5000份</value></DisplayLine></arrLines><arrPayInfos><EnjoyFoodsPaymentInfo><amount>0</amount><cash>1</cash><name>99元+1万积分</name><point>1000</point><sku>MN001CP</sku><type>CAP</type></EnjoyFoodsPaymentInfo></arrPayInfos><section_start_time>1483670400000</section_start_time><section_end_time>1483716600000</section_end_time></EnjoyFoodsGoodsDetailInfo></arrList></EnjoyFoodsSeckillDetailPageInfo>');    
}

function doGetEnjoyFoodsGoodsDetailInfo(){
    clientService.doPost({
        target: "com.ebuy.seckill2.libao.service.LibaoSeckillService",
        method: "getEnjoyFoodsGoodsDetailInfo",
        dataObj: {
            appId: paramAppId,
            sectionId: paramSectionId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            goodsId:paramGoodsId,
            sign: paramSign
        },
        callBackWhenSucceed: "afterGetEnjoyFoodsGoodsDetailInfo",
        callBackWhenError: "afterGetEnjoyFoodsGoodsDetailInfo"
    })
}
function afterGetEnjoyFoodsGoodsDetailInfo(returnValue){
    // alert('afterGetEnjoyFoodsGoodsDetailInfo:'+returnValue);
    stopSpinner();
  //  if(isEmpty(returnValue)){
    //    doError();
      //  return;
    //}

    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('EnjoyFoodsSeckillDetailPageInfo').find('errorCode').text();
    section_start_time = $(rootXmlNode).find('EnjoyFoodsSeckillDetailPageInfo').find('section_start_time').text();
    section_end_time = $(rootXmlNode).find('EnjoyFoodsSeckillDetailPageInfo').find('section_end_time').text();
    section_id = $(rootXmlNode).find('EnjoyFoodsSeckillDetailPageInfo').find('section_id').text();
errorCode="0";
    if(errorCode == 0){ //正常
        $(rootXmlNode).find('EnjoyFoodsSeckillDetailPageInfo').find('EnjoyFoodsGoodsDetailInfo').each(function(index){
            var cloneNode = $(proListNodeCopy).clone();
            $(cloneNode).attr('foods_num',index);

            $(cloneNode).find('[searchResult="goods_id"]').val($(this).find('goods_id').text());
            $(cloneNode).find('[searchResult="goods_name"]').val($(this).find('goods_name').text());
            $(cloneNode).find('[searchResult="goods_extra_info"]').val($(this).find('goods_extra_info').text());
            $(cloneNode).find('[searchResult="stockCount"]').val($(this).find('stockCount').text());
            $(cloneNode).find('[searchResult="consumeCount"]').val($(this).find('consumeCount').text());
            $(cloneNode).find('[searchResult="totalCount"]').val($(this).find('totalCount').text());
            $(cloneNode).find('[searchResult="arrPayInfos"]').val($(this).find('arrPayInfos').text());
            $(cloneNode).find('[searchResult="section_start_time"]').val($(this).find('section_start_time').text());
            $(cloneNode).find('[searchResult="section_end_time"]').val($(this).find('section_end_time').text());
            $(cloneNode).find('[searchResult="section_id"]').val($(this).find('section_id').text());
            
            $(cloneNode).find('[searchResult="icon"]').val($(this).find('icon').text());
            $(cloneNode).find('[searchResult="shopListId"]').val($(this).find('shopListId').text());

            $(cloneNode).find('[id="proImgUrl"]').attr('src',$(this).find('icon').text());

            // 设置列表名称相关信息
            var arrLines = $(this).find('arrLines');
            $(arrLines).find('DisplayLine').each(function(num){
                var cloneInfoNode = $(infoListNodeCopy).clone();
                $(cloneInfoNode).find('[infoResult="name"]').val($(this).find('name').text());
                $(cloneInfoNode).find('[infoResult="value"]').val($(this).find('value').text());
                $(cloneInfoNode).find('.nameValue').html(escape2Html($(this).find('name').text())+escape2Html($(this).find('value').text()));
                $(cloneNode).find('[id="infoList"]').append(cloneInfoNode);
            });

            // 设置sku相关信息
            var arrPayaInfos = $(this).find('arrPayInfos');
            $(arrPayaInfos).find('EnjoyFoodsPaymentInfo').each(function(num){
                var clonePayListNode = $(payListNodeCopy).clone();
                $(clonePayListNode).find('[payListResult="name"]').html($(this).find('name').text());
                $(clonePayListNode).find('[payListResult="sku"]').val($(this).find('sku').text());
                $(clonePayListNode).find('[payListResult="type"]').val($(this).find('type').text());
                $(clonePayListNode).find('[payListResult="cash"]').val($(this).find('cash').text());
                $(clonePayListNode).find('[payListResult="point"]').val($(this).find('point').text());

                if(num == 0){
                    $(clonePayListNode).addClass('on');
                }

                $(cloneNode).find('[id="payList"]').append(clonePayListNode);
            });

            $(cloneNode).find('[id="doSeckill"]').unbind('click').bind('click',function(){ //秒杀
                // baidu
                _hmt.push(['_trackEvent', '秒杀页-秒杀按钮', 'click',webFolder]);

                stockCount = $(cloneNode).find('[searchResult="stockCount"]').val();
                goods_id = $(cloneNode).find('[searchResult="goods_id"]').val();

                currIndex = index;

            //活动进行中
                    if(stockCount <= 0){ //已抢完
                        showDialog.showInfoDialog({title : "提示信息", msgInfo : '已全部抢完'});
                    }else{ //抢兑
                        startSpinner();
                        // 查询之前的抢兑记录
                        findLastSeckillOrderId();
                        // findLastSeckillResult();
                        // afterFindLastSeckillResult('');
                    }
               
            });
            
            $(proListNode).append(cloneNode);
            
            var stockCount = $(this).find('stockCount').text();
            doSetInfoToPage(section_start_time,section_end_time,stockCount,index);
        });

        stopSpinner();
        $('[id="page"]').removeClass('vis_h');
    }else{
        var errorMsg = $(rootXmlNode).find('EnjoyFoodsSeckillDetailPageInfo').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}

// 查询最近订单
function findLastSeckillOrderId(){
    clientService.doPost({
        target: "com.ebuy.seckill2.libao.service.LibaoSeckillService",
        method: "findLastSeckillOrderId",
        dataObj: {
            appId: paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign:paramSign,
            sectionId:section_id
        },
        callBackWhenSucceed: "afterFindLastSeckillOrderId",
        callBackWhenError: "doError"
    })
}

function afterFindLastSeckillOrderId(a){
    // alert('afterFindLastSeckillOrderId:'+a);
 //   if(isEmpty(a)){  //没有秒杀记录 跳转下一页
        goodsSku = $('[foods_num='+currIndex+']').find('.r1_payment_info').find('li.on').find('[payListResult="sku"]').val();
        // 执行秒杀
        doSeckill();
   // }else{ //有订单
     //   doFindEnjoyFoodsSeckillResult(a);
    //}
}

function doFindEnjoyFoodsSeckillResult(a){
    // alert('doFindEnjoyFoodsSeckillResult'+a);
    clientService.doPost({
        target: "com.ebuy.seckill2.libao.service.LibaoSeckillService",
        method: "findEnjoyFoodsSeckillResult",
        dataObj: {
            appId: paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign:paramSign,
            orderId: a
        },
        callBackWhenSucceed: "afterDoFindEnjoyFoodsSeckillResult",
        callBackWhenError: "doError"
    })
}

function afterDoFindEnjoyFoodsSeckillResult(a){
    // alert('afterDoFindEnjoyFoodsSeckillResult:'+a);
    clearTimeout(seckillTimeOut);
    stopSpinner();
    if (isEmpty(a)) doError();
    else {
        a = easyJsDomUtil.parseXML(a);
        var b = $(a).find("EnjoyFoodsSeckillResult").find("errorCode").text();
        orderId = $(a).find("EnjoyFoodsSeckillResult").find("orderId").text();
        status = $(a).find("EnjoyFoodsSeckillResult").find("status").text();
        interfaceOrderId = $(a).find("EnjoyFoodsSeckillResult").find("interfaceOrderId").text();
        payRequestToken = $(a).find("EnjoyFoodsSeckillResult").find("payRequestToken").text();

        if(b == '0'){
            if(status == '0'){ //跳转收银台
                // baidu
                _hmt.push(['_trackEvent', '等待页-成功跳转收银台', 'click',webFolder]);

                showDialog.showConfirmDialog({
                    title: "提示信息",
                    msgInfo: "您有一笔订单尚未完成支付",
                    btnOkTxt:'去支付',
                    btnOk:function(){
                        window.location = "https://pay2.e-pointchina.com/spdpay/seckillSpdConfirm_fastpay.html" + "?order_id=" + encodeURIComponent(interfaceOrderId) + "&payRequestToken=" + encodeURIComponent(payRequestToken);
                    }
                });
            }else if(status == '1'){ //成功 跳转列表页
                // baidu
                _hmt.push(['_trackEvent', '等待页-跳转券列表', 'click',webFolder]);

                seckillTimeFlag = true;

                showDialog.showInfoDialog({
                    title: "提示信息",
                    msgInfo: "尊敬的客户，您已参与抢兑，活动期间每产品每人限抢一份，请至“我的战利品”查看抢兑结果",
                    btnOkTxt:'去查看',
                    btnOk:function(){
                        var url = webClientService.getWebAppName() + "/" + paramAppId + "/ticket.html?appId="+paramAppId+'&sectionNo='+paramSectionNo+"&platform="+paramPlatform+"&userId="+paramUserId+"&sign="+paramSign+"&timeStamp="+(new Date()).getTime();
                        window.location = url;
                    }
                });
            }else if(status == '2'){ //
                seckillTimeFlag = true;
                showDialog.showInfoDialog({
                    title: "提示信息",
                    msgInfo: "对不起，已被抢完！",
                });
            }else if(status == '3'){ //跳转等待页面
                // if(seckillTimeFlag == false){
                //     seckillTimeOut = setTimeout("doFindEnjoyFoodsSeckillResult()",1000);
                // }
            }else if(status == '9'){//错误
                seckillTimeFlag = true;
                showDialog.showInfoDialog({title : "提示信息", msgInfo : "系统出错"});
            }else if(status == '10'){
                seckillTimeFlag = true;
                showDialog.showInfoDialog({title : "提示信息", msgInfo : "系统出错"});
            }
        }else if(b == '4003'){
            seckillTimeFlag = true;
            var a = $(a).find("EnjoyFoodsSeckillResult").find("errorMsg").text();
            showDialog.showConfirmDialog({
                title: "提示信息",
                msgInfo: a,
                btnOkTxt: "绑定",
                btnCancelTxt: "办卡",
                btnOk: function() {
                    // baidu
                    _hmt.push(['_trackEvent', '等待页-未绑卡', 'click',webFolder]);

                    showDialog.showInfoDialog({
                        title: "提示信息",
                        msgInfo: "返回浦发信用卡官方微信主页面，发送“绑定”，并根据提示进行绑定操作。"
                    })
                },
                btnCancel: function() {
                    // baidu
                    _hmt.push(['_trackEvent', '等待页-未绑卡', 'click',webFolder]);

                    window.location = "https://mbank.spdbccc.com.cn/creditcard/indexActivity.htm?data=000004"
                }
            });
        }else if(b == '4001'){
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
            seckillTimeFlag = true;
            var errorMsg = $(a).find('EnjoyFoodsSeckillResult').find('errorMsg').text();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg,btnOk:function(){
                // baidu
                _hmt.push(['_trackEvent', '等待页-返回首页', 'click',webFolder]);

                window.location = 'http://campaign.e-pointchina.com.cn/' + webClientService.getWebAppName() + '/wx_entry/libao'
            }});
        }
    }
}

function findLastSeckillResult(){
    clientService.doPost({
        target: "com.ebuy.seckill2.libao.service.LibaoSeckillService",
        method: "findLastSeckillResult",
        dataObj: {
            appId: paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign:paramSign,
            sectionId:section_id
        },
        callBackWhenSucceed: "afterFindLastSeckillResult",
        callBackWhenError: "doError"
    })
}

function afterFindLastSeckillResult(a){
    // alert('afterFindLastSeckillResult:'+a);
    if(isEmpty(a)){  //没有秒杀记录 跳转下一页
        goodsSku = $('[foods_num='+currIndex+']').find('.r1_payment_info').find('li.on').find('[payListResult="sku"]').val();
        // 执行秒杀
        doSeckill();
    }else{
        a = easyJsDomUtil.parseXML(a);
        var b = $(a).find("EnjoyFoodsSeckillResult").find("errorCode").text();
        orderId = $(a).find("EnjoyFoodsSeckillResult").find("orderId").text();
        status = $(a).find("EnjoyFoodsSeckillResult").find("status").text();
        interfaceOrderId = $(a).find("EnjoyFoodsSeckillResult").find("interfaceOrderId").text();
        payRequestToken = $(a).find("EnjoyFoodsSeckillResult").find("payRequestToken").text();

        if(b == '0'){
            if(isEmpty(orderId)){ //跳转秒杀
                goodsSku = $('[foods_num='+currIndex+']').find('.r1_payment_info').find('li.on').find('[payListResult="sku"]').val();
                // 执行秒杀
                doSeckill();
            }else{
                if(status == '0'){ //跳转收银台
                    stopSpinner();
                    showDialog.showConfirmDialog({
                        title: "提示信息",
                        msgInfo: "您有一笔订单尚未完成支付",
                        btnOkTxt:'去支付',
                        btnOk:function(){
                            window.location = "https://pay2.e-pointchina.com/spdpay/seckillSpdConfirm_fastpay.html" + "?order_id=" + encodeURIComponent(interfaceOrderId) + "&payRequestToken=" + encodeURIComponent(payRequestToken);
                        }
                    });
                }else if(status == '1'){ //成功 跳转列表页
                    stopSpinner();
                    seckillTimeFlag = true;
                    showDialog.showInfoDialog({
                        title: "提示信息",
                        msgInfo: "尊敬的客户，您已参与抢兑，活动期间每人限抢一份，请至“我的战利品”查看抢兑结果",
                    });
                }else if(status == '2'){ //
                    stopSpinner();
                    seckillTimeFlag = true;
                    showDialog.showInfoDialog({
                        title: "提示信息",
                        msgInfo: "名额已抢完",
                    });
                }else if(status == '3'){ //跳转等待页面
                    // if(seckillTimeFlag == false){
                    //     seckillTimeOut = setTimeout("doFindSecKillResult()",1000);
                    // }
                }else{
                    goodsSku = $('[foods_num='+currIndex+']').find('.r1_payment_info').find('li.on').find('[payListResult="sku"]').val();
                    // 执行秒杀
                    doSeckill();
                }
            }
        }else{
            goodsSku = $('[foods_num='+currIndex+']').find('.r1_payment_info').find('li.on').find('[payListResult="sku"]').val();
            // 执行秒杀
            doSeckill();
        }
    }
}

// 执行秒杀
function doSeckill(){
    // alert('appId:'+paramAppId+'-sectionId:'+section_id+'-authTicket:'+cookieAuthTicket+'-userId:'+paramUserId+'-sign:'+paramSign+'-goodsId:'+goods_id+'-goodsSku:'+goodsSku);;
    clientService.doPost({
        target: "com.ebuy.seckill2.libao.service.LibaoSeckillService",
        method: "doSeckill",
        dataObj: {
            appId: paramAppId,
            sectionId:section_id,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            goodsId:goods_id,
            goodsSku:goodsSku,
            lastCardNo:'123456'
        },
        callBackWhenSucceed: "afterDoSecKill",
        callBackWhenError: "doError"
    })
}
function afterDoSecKill(a){
    // alert('afterDoSecKill:'+a);
    clearTimeout(seckillTimeOut);
    stopSpinner();
 //   if (isEmpty(a)) doError();
 //   else {
        a = easyJsDomUtil.parseXML(a);
        var b = $(a).find("EnjoyFoodsSeckillResult").find("errorCode").text();
        orderId = $(a).find("EnjoyFoodsSeckillResult").find("orderId").text();
        status = $(a).find("EnjoyFoodsSeckillResult").find("status").text();
        interfaceOrderId = $(a).find("EnjoyFoodsSeckillResult").find("interfaceOrderId").text();
        payRequestToken = $(a).find("EnjoyFoodsSeckillResult").find("payRequestToken").text();

        if(b == '0'){
            if(status == '0'){ //跳转收银台
                // baidu
                _hmt.push(['_trackEvent', '秒杀页-跳转收银台', 'click',webFolder]);

                showDialog.showConfirmDialog({
                    title: "提示信息",
                    msgInfo: "成功抢占名额<br/>请在15分钟内完成支付，<br/>逾期失效",
                    btnOkTxt:'去支付',
                    btnCancelTxt:'稍后支付',
                    btnOk:function(){
                        window.location = "https://pay2.e-pointchina.com/spdpay/seckillSpdConfirm_fastpay.html" + "?order_id=" + encodeURIComponent(interfaceOrderId) + "&payRequestToken=" + encodeURIComponent(payRequestToken);
                    }
                });
            }else if(status == '1'){ //成功 跳转列表页
                // baidu
                _hmt.push(['_trackEvent', '秒杀页-跳转券列表页', 'click',webFolder]);

                seckillTimeFlag3 = true;
                
                var url = webClientService.getWebAppName() + "/" + paramAppId + "/ticket.html?appId="+paramAppId+'&sectionNo='+paramSectionNo+"&platform="+paramPlatform+"&userId="+paramUserId+"&sign="+paramSign+"&timeStamp="+(new Date()).getTime();
                window.location = url;
                // window.location = webClientService.getWebAppName() + "/" + paramAppId + "/ticket.html?appId=" + paramAppId + "&sectionId=" + paramSectionId +"&platform="+paramPlatform + "&userId=" + paramUserId + "&sign=" + paramSign + "&timeStamp=" + (new Date).getTime();
            }else if(status == '2'){ // 失败
                seckillTimeFlag3 = true;
                showDialog.showInfoDialog({
                    title: "提示信息",
                    msgInfo: "对不起，已被抢完！",
                });
            }else if(status == '3'){ //跳转等待页面
                var a = webClientService.getWebAppName() + "/" + paramAppId + "/pay_waiting.html?appId=" + paramAppId +"&platform=" + paramPlatform +'&orderId=' + orderId + "&sectionNo=" + paramSectionNo + "&userId=" + paramUserId + "&sign=" + paramSign + "&timeStamp=" + (new Date).getTime();
                window.location = a;
            }else if(status == '9'){//错误
                seckillTimeFlag3 = true;
                showDialog.showInfoDialog({title : "提示信息", msgInfo : "系统出错"});
            }else if(status == '10'){
                seckillTimeFlag3 = true;
                showDialog.showInfoDialog({title : "提示信息", msgInfo : "系统出错"});
            }
        }else if(b == '4003'){
            seckillTimeFlag3 = true;
            var a = $(a).find("EnjoyFoodsSeckillResult").find("errorMsg").text();
            showDialog.showConfirmDialog({
                title: "提示信息",
                msgInfo: a,
                btnOkTxt: "绑定",
                btnCancelTxt: "办卡",
                btnOk: function() {
                    // baidu
                    _hmt.push(['_trackEvent', '秒杀页-未绑卡', 'click',webFolder]);

                    showDialog.showInfoDialog({
                        title: "提示信息",
                        msgInfo: "返回浦发信用卡官方微信主页面，发送“绑定”，并根据提示进行绑定操作。"
                    })
                },
                btnCancel: function() {
                    // baidu
                    _hmt.push(['_trackEvent', '秒杀页-去办卡', 'click',webFolder]);

                    window.location = "https://mbank.spdbccc.com.cn/creditcard/indexActivity.htm?data=000004"
                }
            });
        }else if(b == '4001'){
            if(status == '1'){
                seckillTimeFlag3  = true;
                showDialog.showInfoDialog({
                    title: "提示信息",
                    msgInfo: "对不起，已被抢完！",
                });
            }else{
                seckillTimeFlag3  = true;
                showDialog.showInfoDialog({
                    title: "提示信息",
                    msgInfo: $(a).find("EnjoyFoodsSeckillResult").find("errorMsg").text()
                });
            }
        }else{
            seckillTimeFlag3 = true;
            var errorMsg = $(a).find('EnjoyFoodsSeckillResult').find('errorMsg').text();
            showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
        }
    //}
}

function bindCard(){
    stopSpinner();
    showDialog.showConfirmDialog({
        title: "提示信息",
        msgInfo: '对不起，您还未绑定浦发信用卡！',
        btnOkTxt: "绑定",
        btnCancelTxt: "办卡",
        btnOk: function() {
            // baidu
            _hmt.push(['_trackEvent', '秒杀页-未绑卡', 'click',webFolder]);

            showDialog.showInfoDialog({
                title: "提示信息",
                msgInfo: "返回浦发信用卡官方微信主页面，发送“绑定”，并根据提示进行绑定操作。"
            })
        },
        btnCancel: function() {
            // baidu
            _hmt.push(['_trackEvent', '秒杀页-去办卡', 'click',webFolder]);

            window.location = "https://mbank.spdbccc.com.cn/creditcard/indexActivity.htm?data=000004"
        }
    });
}

/*页面设置*/
function doSetInfoToPage(appStartTime,appEndTime,count,index){
    if(new Date().getTime() < appStartTime){
        $('[foods_num='+index+']').find('[id="doSeckill"]').addClass('gray');
        // 计时器
        if(index == 0){
            clearTimeout(isTimeOut_0);
            index_0 = index;
            appStartTime_0 = appStartTime;
            appEndTime_0 = appEndTime;
            count_0 = count;

            doJSQ_0();
        }else if(index == 1){
            clearTimeout(isTimeOut_1);
            index_1 = index;
            appStartTime_1 = appStartTime;
            appEndTime_1 = appEndTime;
            count_1 = count;

            doJSQ_1();
        }else if(index == 2){
            clearTimeout(isTimeOut_2);
            index_2 = index;
            appStartTime_2 = appStartTime;
            appEndTime_2 = appEndTime;
            count_2 = count;

            doJSQ_2();
        }else if(index == 3){
            clearTimeout(isTimeOut_3);
            index_3 = index;
            appStartTime_3 = appStartTime;
            appEndTime_3 = appEndTime;
            count_3 = count;

            doJSQ_3();
        }
    }else if(new Date().getTime() > appEndTime){ //时间已过
        $('[foods_num='+index+']').find('[id="doSeckill"]').addClass('gray');
    }else{
        if(count <= 0){
            $('[foods_num='+index+']').find('[id="doSeckill"]').addClass('gray');
        }else{
            $('[foods_num='+index+']').find('[id="doSeckill"]').removeClass('gray');
        }
    }
}
function doJSQ_0(){
    clearTimeout(isTimeOut_0);
    var curTime = new Date().getTime();
    if(curTime >= appStartTime_0){
        doSetInfoToPage(appStartTime_0,appEndTime_0,count_0,index_0);
        isTimeFlag_0 = true;
    }
    if(isTimeFlag_0 == false){
        isTimeOut_0 = setTimeout("doJSQ_0()",1000);
    }
}
function doJSQ_1(){
    clearTimeout(isTimeOut_1);
    var curTime = new Date().getTime();
    if(curTime >= appStartTime_1){
        doSetInfoToPage(appStartTime_1,appEndTime_1,count_1,index_1);
        isTimeFlag_1 = true;
    }
    if(isTimeFlag_1 == false){
        isTimeOut_1 = setTimeout("doJSQ_1()",1000);
    }
}
function doJSQ_2(){
    clearTimeout(isTimeOut_2);
    var curTime = new Date().getTime();
    if(curTime >= appStartTime_2){
        doSetInfoToPage(appStartTime_2,appEndTime_2,count_2,index_2);
        isTimeFlag_2 = true;
    }
    if(isTimeFlag_2 == false){
        isTimeOut_2 = setTimeout("doJSQ_2()",1000);
    }
}
function doJSQ_3(){
    clearTimeout(isTimeOut_3);
    var curTime = new Date().getTime();
    if(curTime >= appStartTime_3){
        doSetInfoToPage(appStartTime_3,appEndTime_3,count_3,index_3);
        isTimeFlag_3 = true;
    }
    if(isTimeFlag_3 == false){
        isTimeOut_3 = setTimeout("doJSQ_3()",1000);
    }
}