

var isTimeOut = null;
var isTimeOut2 = null;

var skGoodsInfoNodeCopy;
var activityId= (getQueryStr("activityId")||'jd000001');  //抢购活动编号"/" +(getQueryStr("listId")||"00001")

var activity_begin_date = 0;
$(document).ready(function(){

    var skGoodsInfoNodeTmp = $('[searchResult="SPDJDGoodsInfo"]');
    skGoodsInfoNodeCopy = $(skGoodsInfoNodeTmp[0]).clone();
    $(skGoodsInfoNodeTmp).remove();

    //启动滚轮
    startSpinner();

    //取得活动信息
    $my.ajax({
        url : $my.getCloudDataServiceUrl(),
        data : {
            serviceType : "com.ebuy.spdjd.web.service.ItemShowService",
            serviceMethod : "searchActivityDetail",
            activityId : activityId
        },
        success : afterSearchActivityDetail,
        error : 'doError'
    });

    //取得商品信息
    $my.ajax({
        url : $my.getCloudDataServiceUrl(),
        data : {
            serviceType : "com.ebuy.spdjd.web.service.ItemShowService",
            serviceMethod : "searchItemList",
            activityId : activityId
        },
        success : afterSearchItemList,
        error : 'doError'
    });

    $('[id="myOrderListLink"]').unbind('click').bind('click', function(){
        gotoOrder();
    });

    $('[id="spd_back"]').unbind('click').bind('click', function(){
        gotoBack();
    });
});

/**
 * 取得活动详情
 * @param returnValue
 */
function afterSearchActivityDetail(returnValue) {
    if (isEmpty(returnValue)) {
        doError();
        return;
    }

    var bannerListNode = easyJsDomUtil.parseXML(returnValue);
    activity_begin_date = Number($(bannerListNode).find('Activity').find('begin_time').text());
    $('head title').html($(bannerListNode).find('Activity').find('title').text());
    $('[searchResult="bannerImg"]').attr("src", $(bannerListNode).find('pic_url').text());
    $('#tipInput').html($(bannerListNode).find('Activity').find('desc').text());
    $('.tipList').html($('#tipInput').text());
}

/**
 * 取得商品列表成功处理
 * @param returnValue
 */
function afterSearchItemList(returnValue) {
    if (isEmpty(returnValue)) {
        doError();
        return;
    }

    var respondInfo = easyJsDomUtil.parseXML(returnValue);
    var resCode = $(respondInfo).find('respCode').text();
    if ('000000' == resCode) { // 发送成功
        var totalCount = $(respondInfo).find('totalCount').text();
        if(Number(totalCount) == 0) {
            $('.r2').hide();
            $('#noData').show();
            stopSpinner();
            return;
        }
        easyJsDomUtil.loadListDataXmlToDomNode({
            dataListXml: respondInfo,
            dataXmlNodeName: "V_ActivityItem",
            dataListDomNode: $('[id="resultList"]')[0],
            dataDomNodeCopy: skGoodsInfoNodeCopy,
            domNodeAttrName: "searchResult",
            dataNodeDidLoadFunc: function(dataDomNode, index, length){
            }
        });
    } else {
        showDialog.showInfoDialog({
            title : " ",
            msgInfo : "网络异常，请稍后再试"
        });
    }

    setDJS();
    stopSpinner();
}
function didLoadFuncForGoods(dataDomNode) {
    var myDate=new Date();
    var nowMill = myDate.getTime();
    var bannerPic = $(dataDomNode).find('[searchResult="icon_pic_url"]').val();
    var logoPic = $(dataDomNode).find('[searchResult="logoPic"]').val();
    var soldOutFlg = $(dataDomNode).find('[searchResult="soldOutFlg"]').val();
    var goodsId = $(dataDomNode).find('[searchResult="activity_item_id"]').val();
    var goodsName = $(dataDomNode).find('[searchResult="name"]').val();
    var description = $(dataDomNode).find('[searchResult="description"]').val();
//	var showCount = Math.floor(Number($(dataDomNode).find('[searchResult="stockNum"]').val()));
    var showCount = Math.floor(Number($(dataDomNode).find('[searchResult="market_price"]').val()));

    description_json = $.parseJSON(description.replace('"data":',""));
    var on_day = convertToDateInYYYYMMDD(description_json.on_day).getTime();
    var off_day = convertToDateInYYYYMMDD(description_json.off_day).getTime();

    var shop_list_url = description_json.shop_list_url;
    var brandId = description_json.brand_id;


    var indexPSText = $(dataDomNode).find('[searchResult="indexPSText"]').val();
    var indexToProductTitle = $(dataDomNode).find('[searchResult="indexToProductTitle"]').val();
    var indexToProductText = $(dataDomNode).find('[searchResult="indexToProductText"]').val();

    var indexText = isEmpty(indexPSText)?"数量有限先到先得":indexPSText;
    indexToProductTitle = isEmpty(indexToProductTitle)?"温馨提示":indexToProductTitle;
    indexToProductText = isEmpty(indexToProductText)?"亲，咱别光顾着“心花怒放”的秒杀，认真看下门店信息，否则美味会跟你“后会无期”":indexToProductText;

    var showDate = "敬请期待";

        showDate = "立即抢购";
        $(dataDomNode).find('[id="showDate"]').unbind('click').bind('click', function() {
            gotoDetail(goodsId,indexToProductTitle,indexToProductText);
        });
    $(dataDomNode).find('[id="goodsName"]').text(goodsName);
    $(dataDomNode).find('[id="bannerPic"]').attr('src',bannerPic);
    $(dataDomNode).find('[id="showCount"]').text(showCount);
    $(dataDomNode).find('[id="showDate"]').text(showDate);

    if(!isEmpty(shop_list_url)) {
        $(dataDomNode).find('[id="indexText"]').text("门店列表");
        $(dataDomNode).find('[id="indexText"]').unbind("click").bind('click',function(){
            window.location = shop_list_url;
        });
    } else if(!isEmpty(brandId) && (!brandId.startsWith("ns_"))){  //没有brandId或满足无门店规则（以ns_开头）
        $(dataDomNode).find('[id="indexText"]').text("门店列表");
        var activity_id_elifebase = description_json.activity_id_elifebase;
        var brandUrl = "http://pay.e-pointchina.com/elife/openShopList.html?brandId=" + brandId;
        if (!isEmpty(activity_id_elifebase)) {
            brandUrl = brandUrl + "&activityId=" + activity_id_elifebase;
        }
        //门店列表链接
        $(dataDomNode).find('[id="indexText"]').unbind('click').bind('click', function(){
            window.location = brandUrl + "&timestamp=" + String((new Date()).getTime());
        });
    } else{
        $(dataDomNode).find('[id="indexText"]').text(indexText);
        $(dataDomNode).find('[id="brandShop"]').hide();
    }
}

function setDJS(){
    var dataDomNodeList = $('[searchResult="SPDJDGoodsInfo"]');
    for(var i = 0; i < dataDomNodeList.length ; i++){
        var dataDomNode = dataDomNodeList[i];
        didLoadFuncForGoods(dataDomNode);
    }

//	isTimeOut = null;
//    isTimeOut = setTimeout("setDJS()",1000);
}


var gotoGoodsId;
function gotoDetail(goodsId,indexToProductTitle,indexToProductText) {
    gotoGoodsId = goodsId;
    gotoDetailConfirm();
//	showDialog.showConfirmDialog({title : indexToProductTitle, msgInfo : indexToProductText, btnOk: gotoDetailConfirm, btnCancel:""  });
}

function gotoDetailConfirm() {
    window.location = $my.getWebAppHasHost() + "/activity_seckill2/product2.html?activityId=" + activityId + "&appId=" + paramAppId + "&section=" + paramSection + "&userId=" + paramUserId + "&sign=" + paramSign + "&itemId=" + gotoGoodsId + "&timestamp=" + String((new Date()).getTime());
//	window.location = webClientService.getWebAppName() + "/" + paramAppId + "/product.html?appId=" + paramAppId + "&section=" + paramSection + "&userId=" + paramUserId + "&sign=" + paramSign + "&timestamp=" + String((new Date()).getTime()) + "&goodsId=" + gotoGoodsId;
//	window.location = webClientService.getWebAppName() + "/" + paramAppId + "/product2.html?appId=" + paramAppId + "&section=" + paramSection + "&userId=" + paramUserId + "&sign=" + paramSign + "&timestamp=" + String((new Date()).getTime()) + "&goodsId=" + gotoGoodsId;
}


function gotoOrder() {
    window.location = $my.getWebAppHasHost() + "/activity_seckill2/orderList.html?activityId=" + activityId + "&appId=" + paramAppId + "&section=" + paramSection + "&userId=" + paramUserId + "&sign=" + paramSign + "&timestamp=" + String((new Date()).getTime());
}

function gotoBack() {
    window.location = "http://mms.99wuxian.com/mmsMallSpdbJD/spdb/indexAction.do";
}
