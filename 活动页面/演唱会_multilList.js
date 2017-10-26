var paramAppId = getQueryStr('appId');
var paramSectionId = getQueryStr('sectionId');
var paramGoodsId = getQueryStr('goodsId');
var paramJumpType = getQueryStr('jumpType');

var entryListNode,entryListNodeCopy;
var appId,sectionId,sectionType,sectionName,sectionStartTime,sectionEndTime,sectionIconUrl,sectionDetailUrl;

$(document).ready(function(){
    startSpinner();
    setHtmlFontSize();
    initWxSetting(initFormInfo,doSendShare,false,true,false);
    // initFormInfo();// debug
});

function initFormInfo(){
    // dom节点操作
    entryListNode = $('[id="List"]')[0];
    var entryListNodeTmp = $('[entryListResult="SectionGoodsInfo"]')[0];
    entryListNodeCopy = $(entryListNodeTmp).clone();
    $(entryListNodeTmp).remove();

    // 查询货架
    findGoodsRack();
    // afterFindGoodsRack('<SectionGoodsRackPageView><appId>sale</appId><appType>SALE</appType><arrGoodsInfos><SectionGoodsInfo><appId></appId><arrGoodsLines><LineInfo><lineName>爆品：</lineName><lineValue>好孩子（Goodbaby）儿童汽车安全座椅 CS901（颜色随机）</lineValue></LineInfo><LineInfo><lineName>市场价：</lineName><lineValue>699元</lineValue></LineInfo><LineInfo><lineName>爆品数量：</lineName><lineValue>300份</lineValue></LineInfo><LineInfo><lineName>场次：</lineName><lineValue>第一期</lineValue></LineInfo></arrGoodsLines><arrGoodsPays><GoodsPaymentItem><accountId>spdcreditcard</accountId><amount>0.01</amount><cash>0.01</cash><installment_num>1</installment_num><name>699元</name><point>0</point><sku>GBC</sku><type>C</type></GoodsPaymentItem></arrGoodsPays><goodsDescption>&amp;lt;p&amp;gt;安全舒适一步到位；面料全新升级；侧翼加厚设计；头托可调节设计；五点式安全带；伴随宝宝成长；快速折叠方便收纳。&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;适用年龄：9个月-12岁&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;承重量：36kg以下&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;产品毛重：5.9kg&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;产品净重：4.7kg&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;产品尺寸：420x470x710mm&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;固定方式：安全带固定&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;安装方式：正向安装&amp;lt;/p&amp;gt;</goodsDescption><goodsDetailUrl>https://magicactivity.oss-cn-hangzhou.aliyuncs.com/campaign/GDBOY.jpg</goodsDetailUrl><goodsIconUrl>https://magicactivity.oss-cn-hangzhou.aliyuncs.com/campaign/GDBOY.jpg</goodsIconUrl><goodsId>GDBOY</goodsId><goodsName>好孩子（Goodbaby）儿童汽车安全座椅 CS901（颜色随机）</goodsName><goodsType>MAIL</goodsType></SectionGoodsInfo><SectionGoodsInfo><appId></appId><arrGoodsLines><LineInfo><lineName>爆品：</lineName><lineValue>坏孩子（Badbaby）儿童尿片</lineValue></LineInfo><LineInfo><lineName>市场价：</lineName><lineValue>111元</lineValue></LineInfo><LineInfo><lineName>爆品数量：</lineName><lineValue>500份</lineValue></LineInfo><LineInfo><lineName>场次：</lineName><lineValue>第一期</lineValue></LineInfo></arrGoodsLines><arrGoodsPays><GoodsPaymentItem><accountId>spdcreditcard</accountId><amount>0.02</amount><cash>0.01</cash><installment_num>1</installment_num><name>111元</name><point>0</point><sku>GBC</sku><type>C</type></GoodsPaymentItem></arrGoodsPays><goodsDescption>&amp;lt;p&amp;gt;安全舒适快速吸水；面料全新升级；侧翼加厚设计；头托可调节设计；五点式安全带；伴随宝宝成长；快速折叠方便收纳。&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;适用年龄：9个月-12岁&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;承重量：36kg以下&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;产品毛重：5.9kg&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;产品净重：4.7kg&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;产品尺寸：420x470x710mm&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;固定方式：安全带固定&amp;lt;/p&amp;gt;&amp;lt;p&amp;gt;安装方式：正向安装&amp;lt;/p&amp;gt;</goodsDescption><goodsDetailUrl>https://magicactivity.oss-cn-hangzhou.aliyuncs.com/campaign/BDBOY.jpg</goodsDetailUrl><goodsIconUrl>https://magicactivity.oss-cn-hangzhou.aliyuncs.com/campaign/BDBOY.jpg</goodsIconUrl><goodsId>BDBOY</goodsId><goodsName>坏孩子（Badbaby）儿童尿片</goodsName><goodsType>MAIL</goodsType></SectionGoodsInfo></arrGoodsInfos><errorCode>0</errorCode><errorMsg></errorMsg><sectionDetailUrl></sectionDetailUrl><sectionEndTime>1491926399000</sectionEndTime><sectionIconUrl></sectionIconUrl><sectionId>SALES003</sectionId><sectionName>XXXX购买爆品</sectionName><sectionStartTime>1491357600000</sectionStartTime></SectionGoodsRackPageView>');
}

function findGoodsRack(){
    clientService.doPost({
        target: "com.ebuy.o2o.campaign.service.CampaignService",
        method: "findGoodsRack",
        dataObj: {
            channelId: paramChannelId,
            appId:paramAppId,
            authTicket: cookieAuthTicket,
            userId: paramUserId,
            sign: paramSign,
            sectionId:paramSectionId
        },
        callBackWhenSucceed: "afterFindGoodsRack",
        callBackWhenError: "doError"
    })
}
function afterFindGoodsRack(returnValue){
    // alert('afterFindGoodsRack:'+returnValue);
    // $('#returnValue').text(returnValue);
    stopSpinner();
    if(isEmpty(returnValue)){
        doError();
        return
    }

    var rootXmlNode = easyJsDomUtil.parseXML(returnValue);
    var errorCode = $(rootXmlNode).find('SectionGoodsRackPageView').find('errorCode').text();
    if(errorCode == 0){ //正常
        appId = $(rootXmlNode).find("SectionGoodsRackPageView").find("appId").text();
        sectionId = $(rootXmlNode).find("SectionGoodsRackPageView").find("sectionId").text();
        sectionType = $(rootXmlNode).find("SectionGoodsRackPageView").find("sectionType").text();
        sectionName = $(rootXmlNode).find("SectionGoodsRackPageView").find("sectionName").text();
        sectionStartTime = $(rootXmlNode).find("SectionGoodsRackPageView").find("sectionStartTime").text();
        sectionEndTime = $(rootXmlNode).find("SectionGoodsRackPageView").find("sectionEndTime").text();
        sectionIconUrl = $(rootXmlNode).find("SectionGoodsRackPageView").find("sectionIconUrl").text();
        sectionDetailUrl = $(rootXmlNode).find("SectionGoodsRackPageView").find("sectionDetailUrl").text();

        var arrGoodsInfos = $(rootXmlNode).find("SectionGoodsRackPageView").find("arrGoodsInfos");
        $(arrGoodsInfos).find("SectionGoodsInfo").each(function(a) {
            a = $(entryListNodeCopy).clone();
            $(a).find('[entryListResult="appId"]').val($(this).find("appId").text());
            $(a).find('[entryListResult="goodsId"]').val($(this).find("goodsId").text());
            $(a).find('[entryListResult="goodsType"]').val($(this).find("goodsType").text());
            $(a).find('[entryListResult="goodsName"]').val($(this).find("goodsName").text());
            $(a).find('[entryListResult="goodsIconUrl"]').val($(this).find("goodsIconUrl").text());

            $(a).find('[id="goodsIconUrl"]').attr('src',$(this).find("goodsDetailUrl").text());

            $(a).find('[entryListResult="goodsDetailUrl"]').val($(this).find("goodsDetailUrl").text());
            $(a).find('[entryListResult="goodsDescption"]').val($(this).find("goodsDescption").text());

            $(a).on('click',function(){ //绑定事件
              
                    // var appIdValue = $(this).find('[entryListResult="appId"]').val();
                    var goodsIdValue = $(this).find('[entryListResult="goodsId"]').val();

                    if(paramJumpType == 'jump_seckill'){ //跳秒杀
                        var url = "./seckill.html?appId="+appId+"&channelId="+paramChannelId+"&sectionId="+sectionId+"&goodsId="+goodsIdValue+"&userId="+paramUserId + "&sign="+paramSign + "&timeStamp="+(new Date()).getTime();
                        window.location = url;
                    }else{ //跳购买
                        var url = "./buy.html?appId="+appId+"&channelId="+paramChannelId+"&sectionId="+sectionId+"&goodsId="+goodsIdValue+"&userId="+paramUserId + "&sign="+paramSign + "&timeStamp="+(new Date()).getTime();
                        window.location = url;
                    }
              
            })
            
            $(entryListNode).append(a);
        });

        stopSpinner();
        $('[id="page"]').removeClass('vis_h');

    }else{
        var errorMsg = $(rootXmlNode).find('SectionGoodsRackPageView').find('errorMsg').text();
        showDialog.showInfoDialog({title : "提示信息", msgInfo : errorMsg});
    }
}