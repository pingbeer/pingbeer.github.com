var itemDetailPage = new ItemDetailPage();

if (window.__skipInitPage == undefined || !window.__skipInitPage) {
    $(document).ready(function () {
        //TODO test
        // commonShare.initWxSetting(indexPage.initPage,indexPage.doSendShare,false,true);
        itemDetailPage.initPage();
        console.log("$(document).ready() initPage");
    });
}

function ItemDetailPage() {

    var _this = this;
    var _appId = "";
    var activityItemId = "";
    var _buy_limit_qty = '';
    var _shopListUrl = '';

    _buy_limit_qty = $('#buy_limit_qty').val();
    this.initPage = function () {
        _appId = $my.getUrlParam('appId');
        _this.activityItemId = $my.getUrlParam('activityItemId');

        $my.async.series([
            initFormInfo,
            loadShopListUrl,
            getOssData
        ], function (totalCount, doneCount, error) {
            if (totalCount == doneCount) {
                console.log("indexPage initPage() done");
            }
        });
    };

    function initFormInfo(callback) {
        setHtmlFontSize();
        $('[id="page"]').removeClass('vis_h');

        initProImgSwipe();
        $('#addCart').unbind('click').bind('click', addCartItem);
        $('#payNow').unbind('click').bind('click', buyItemPayNow);

        $('#shopList').unbind('click').bind('click', gotoShopList);
        $('#proDetail').unbind('click').bind('click', gotoItemDetail);
        $('#buyNow').bind('click', function () {
            buyItem();
        });

        $('.dialog_close').bind('click', function () {
            $('.overLayer').hide();
            $('.m_pay_fast').hide();
        });

        if (callback) {
            callback();
        }
    }

    function getOssData(callback){
        var url = $shop.ossUrl + _this.activityItemId + '/activityItem.xml';
        $.ajax({
            url: url,
            dataType: "jsonp",
            jsonpCallback: "ossCallBack",
            timeout: 3000,
            success: function (data) {
                getActivityItem(data);
            },
            error: function (jqXHR, textStatus, errorThrown ){
                showDialog.showInfoDialog({ title:'提示信息', msgInfo: '没有该产品信息' });
            }
        });

        if (callback) {
            callback();
        }
    }
    function getActivityItem(data) {
        data = decodeURIComponent(data);
        activityItem = easyJsDomUtil.parseXML(data);

        shipping_type = $(activityItem).find('shipping_type').text();
        var descriptionJsonString = $(activityItem).find('description').text();
        var description = JSON.parse(descriptionJsonString);
        var icon_pic_url = $(activityItem).find('icon_pic_url').text();
        icon_pic_url = icon_pic_url.split(",", 1);//取第一个
        $('[id="iconUrl"]').attr("src",icon_pic_url);
        $('[id="dialogIconUrl"]').attr("src",icon_pic_url);
        var activityItemName = $(activityItem).find('name').text();
        document.title = activityItemName;
        $('[id="dataName"]').text(activityItemName);
        $('[id="dialogDataName"]').text(activityItemName);
        var pro_detail_name = description.pro_detail_name;
        var pro_detail_url = description.pro_detail_url;
        var shop_list_url = description.shop_list_url;
        var shop_url = description.shop_url;
        var pro_description = description.description;
        var item_category = description.item_category;
        var pay_type_array = description.pay_types;
        pay_type_array = JSON.parse(pay_type_array);
        var paytypeNameHtml = "";
        var payTypeUlHtml = "";
        for(var x in pay_type_array) {
            paytypeNameHtml = paytypeNameHtml + "<span class=\"r3_2_1\">" + pay_type_array[x].pay_type_name + "</span>";
            payTypeUlHtml = payTypeUlHtml + "<li class=\"\" id=\"payType_cell\" >"
                + "<input type=\"hidden\" id=\"pay_type_id\" value='" + pay_type_array[x].pay_type_id +"'>"
                + "<span id=\"payTypeName\">" ;
            if (pay_type_array[x].pay_integral == 0 && pay_type_array[x].pay_money == 0){
                payTypeUlHtml += pay_type_array[x].pay_type_name;
            }else if(Number(pay_type_array[x].pay_integral) > 0 && pay_type_array[x].pay_money == 0){
                payTypeUlHtml += pay_type_array[x].pay_integral + "积分";
            }else if (pay_type_array[x].pay_integral == 0 && Number(pay_type_array[x].pay_money) > 0){
                payTypeUlHtml += pay_type_array[x].pay_money + "元";
            }else {
                payTypeUlHtml += pay_type_array[x].pay_integral + "积分" + pay_type_array[x].pay_money + "元";
            }
            payTypeUlHtml += "</span></li>";
        }
        $('[id="payTypeNameDiv"]').html(paytypeNameHtml);
        $('[id="payTypeUl"]').html(payTypeUlHtml);

        payTypeCellClicked($('[id="payType_cell"]')[0]);
        $('[id="payType_cell"]').unbind("click").bind("click",function () {
            payTypeCellClicked(this);
        });
        _this.couponid = description.coupon_id;
        if ($my.string.isEmpty(_this.couponid)) {
            $('#shopList').hide();
        }

    }

    function payTypeCellClicked(dom) {
        $('[id="payType_cell"]').removeClass("on");

        $(dom).addClass("on");

        var payTypeName = $(dom).find('[id="payTypeName"]').text();
        $('[id="totalTxt"]').text(payTypeName);
        $('[id="payTypeSelect"]').text(payTypeName);
    }

    // 产品图片轮播
    function initProImgSwipe() {
        mSlideSwipe = new Swiper('#m_slide_swipe', {
            pagination: '.pagination',
            autoplay: 3000,
            grabCursor: true,
            loop: true,
            followFinger: false,
            paginationClickable: true,
            onSwiperCreated: function (mSlideSwipe) {
            },
            onSlideChangeStart: function (mSlideSwipe) {
            },
            onSlideChangeEnd: function (mSlideSwipe) {
                mSlideSwipe.startAutoplay();
            }
        });
    }

    function addCartItem() {
        $my.async.series([
            doAddCartItem,
        ], function (totalCount, doneCount, error) {
            if (totalCount == doneCount) {
                console.log("OrderPlacedPage buy done");

            }
        });
    }


    function loadShopListUrl(callback) {
        var activity_item_id = _this.activityItemId;
        $my.ajax({
            url: $my.getCloudDataServiceUrl(),
            data: {
                serviceType: "com.ebuy.shop.web.service.ItemSearchService",
                serviceMethod: "getShopListUrl",
                activity_id: _this.activityItemId,
            },
            success: function (response) {
                if (response && response.length > 0) {
                    _this._shopListUrl = response;
                    $('#shop_list').show();
                }

                if (callback) {
                    callback();
                }
            },
            error: function (response) {
                if (callback) {
                    callback();
                }
            },
        });
    }

    //该方法同时存在于 item_page.js, cart.js, orderPlaced.js 中
    function checkResponseCodeIsAllow(code) {
        var msgInfo = "", allow = false;
        switch (code) {
            case '-9999':
                msgInfo = "登录失效，请重新登录。";
                break;
            case '-1':
                msgInfo = "未知错误";
                break;
            case '100':
                msgInfo = "不在白名单中，不能抢购。";
                break;
            case '10':
                msgInfo = "商品已下架！";
                break;
            case '9':
            case '8':
                // msgInfo = "客官，当前产品已被疯抢完毕，请移步其他产品吧";
                msgInfo = "商品已兑完";
                break;
            case '24':
                msgInfo = "每人限制购买" + _buy_limit_qty + "件";
                break;
            case '25':
                msgInfo = "请输入订单商品数量";
                break;
            case '30':
                msgInfo = "没有查到符合你选择的支付类型";
                break;
            case '31':
                msgInfo = "请输入选择支付类型";
                break;
            case '32':
                msgInfo = "没有查到该商品描述";
                break;
            case '33':
                msgInfo = "没有查到该商品的所包含的支付方式";
                break;
            case '34':
                msgInfo = "解析该商品所有支付方式列表异常";
                break;
            case '35':
                msgInfo = "未到兑换时间";
                break;
            case '37':
                msgInfo = "没有查找到购物车相关信息";
                break;
            case '38':
                msgInfo = "没有查找到商品信息";
                break;
            case '':
                msgInfo = "网络繁忙，请重试！";
                break;
            default :
                allow = true;
                break;
        }
        return true;
    }


    /**
     * 添加购物车
     * @param callback
     */
    function doAddCartItem(callback) {
        var itemId =_this.activityItemId;
        var shipping_type = $('#shipping_type').val();
        var pay_type_id = $('.on #pay_type_id').val();
        //	针对于原先生成的静态页面没有pay_type_id的，默认赋值pay_type_id=1
        if ($my.string.isEmpty(pay_type_id)) {
            pay_type_id = 1;
        }

        var skuId = "";
        var installment_num = 1;
        var itemQty = 1;

        $my.ajax({
            url: $my.getCloudDataServiceUrl(),
            data: {
                serviceType: "com.ebuy.shop.web.service.UserCartService",
                serviceMethod: "setCartItem",
                activity_item_id: _this.activityItemId,
                sku_id: skuId,
                pay_type_id: pay_type_id,
                installment_num: installment_num,
                item_quantity: itemQty,
                selected: false,
                parentId: "",
                activityItemId: "",
                shareTime: "",
                shareSign: "",
                shipping_type: shipping_type
            },
            success: function (response) {
                if (response == 0) {
                    showDialog.showConfirmDialog({
                        title: "提示信息", msgInfo: "已加入兑换篮，是否前往查看？", btnOk: function () {
                            window.location = $my.getWebApp() + '/cart.html?timeStamp=' + (new Date()).getTime();
                        }
                    });
                }
                else if (response == 1) {
                    showDialog.showConfirmDialog({
                        title: "提示信息", msgInfo: "兑换篮已存在相同商品，是否前往查看？", btnOk: function () {
                            window.location = $my.getWebApp() + '/cart.html?timeStamp=' + (new Date()).getTime();
                        }
                    });
                }
                else {
                    checkResponseCodeIsAllow(response);
                }
                if (callback) {
                    callback();
                }
            },
            error: function (response) {
                if (callback) {
                    callback();
                }
            },
        });
    }

    function buyItem() {
        $my.async.series([
            showBuyItemDialog,
        ], function (totalCount, doneCount, error) {
            if (totalCount == doneCount) {
                console.log("OrderPlacedPage buy done");

            }
        });
    }

    function buyItemPayNow() {
        $my.async.series([
            doBuyItem,
        ], function (totalCount, doneCount, error) {
            if (totalCount == doneCount) {
                console.log("OrderPlacedPage buy done");

            }
        });
    }

    function showBuyItemDialog() {

        $('.overLayer').show();
        $('.m_pay_fast').show();
    }

    function doBuyItem(callback) {
        //var activity_item_id = $('#activity_item_id').val();
        var shipping_type = $('#shipping_type').val();
        var pay_type_id = $('.on #pay_type_id').val();
        var sku_id = "";
        var item_qty = 1;
        //	针对于原先生成的静态页面没有pay_type_id的，默认赋值pay_type_id=1
        if ($my.string.isEmpty(pay_type_id)) {
            pay_type_id = 1;
        }
        $my.ajax({
            url: $my.getCloudDataServiceUrl(),
            data: {
                serviceType: "com.ebuy.shop.web.service.UserOrderService",
                serviceMethod: "checkStockNumAndBuyTime",
                activity_item_id: _this.activityItemId,
                sku_id: sku_id,
                item_qty: item_qty
            },
            success: function (response) {
                if (response && response.length > 0) {
                    var retCode = response;
                    if (checkResponseCodeIsAllow(retCode)) {
                        if (shipping_type == '3') {
                            //alert('填写物流');
                            window.location = $my.getWebApp() + '/orderPlaced.html?activity_item_id=' + _this.activityItemId
                                + '&sku_id=' + sku_id
                                + '&shipping_type=' + shipping_type
                                + '&pay_type_id=' + pay_type_id
                                + '&timeStamp=' + (new Date()).getTime();
                        } else {
                            var installment_num = 1;

                            $my.ajax({
                                url: $my.getCloudDataServiceUrl(),
                                data: {
                                    serviceType: "com.ebuy.shop.web.service.UserOrderService",
                                    serviceMethod: "getNewOrderForBuy",
                                    activity_item_id: _this.activityItemId,
                                    sku_id: sku_id,
                                    installment_num: installment_num,
                                    item_qty: item_qty,
                                    shipping_type: shipping_type,
                                    pay_type_id: pay_type_id
                                },
                                success: function (response) {
                                    if (response && response.length > 0) {
                                        var retCode = response;
                                        //alert(retCode);
                                        if (checkResponseCodeIsAllow(retCode)) {
                                            afterRequestConfirmPay(response);
                                        }
                                    }
                                    if (callback) {
                                        callback();
                                    }
                                },
                                error: function (response) {
                                    if (callback) {
                                        callback();
                                    }
                                },
                            });
                        }
                    }
                }
            }
        });

    }

    function afterRequestConfirmPay(returnValue) {

        var shipping_type = $('#shipping_type').val();

        if ($my.string.isEmpty(returnValue)) {
            doError();
            return;
        }

        var infoNode = easyJsDomUtil.parseXML(returnValue);
        var callBackUrl = $(infoNode).find("callBackurl").text();
        var ordernfo = $(infoNode).find("ordernfo").text();
        var skey = $(infoNode).find("skey").text();

        var info = "map://PayComm('" + callBackUrl + "','" + ordernfo + "','" + skey + "')";
        execute(info);
    }

    function gotoShopList() {
        if (_this._shopListUrl && _this._shopListUrl.length > 0) {
            var url = _this._shopListUrl + '&timeStamp=' + (new Date()).getTime();
            //alert(url);
            window.location = url;
        }
    }

    function gotoItemDetail() {
        window.location = $my.getWebApp() + "/item_detail_page.html?timestamp=" + (new Date()).getTime() + "&activityItemId=" + _this.activityItemId;
    }

    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }

    function execute(url) {
        if (browser.versions.ios) {
            //ios设备，采用此方法调用
            var iframe = document.createElement("IFRAME");
            iframe.setAttribute("src", url);
            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;
        } else {
            //其他设备，调用此方法
            window.location = url;
        }
    }
}