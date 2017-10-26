pageUser.checkLogin(function (a) {
    var b = stringUtil.getQueryJSON(), c = b.orderType || "001|002", d = "", e = {
        type: {
            data: {
                "001": {
                    name: "实物兑换订单",
                    type: "001001"
                },
                "002": {name: "优惠券订单", type: ["002001", "002002", "002003", "002004"].join(",")},
                "003": {name: "话费充值订单", type: "003001"},
                "006": {
                    name: "预约商品订单",
                    type: ["006001", "006002", "006003", "006004", "006005", "006006", "006007", "006008", "006009", "006010", "006011", "006012", "006013", "006014", "006015", "006016", "006017", "006018", "006019", "006020", "006021"].join(",")
                },
                "009": {name: "油卡充值订单", type: "009001"},
                "011": {name: "龙腾卡订单", type: "011001"},
                "012": {name: "众筹商品订单", type: "012001"}
            }, get: function () {
                var a = c.split("|"), b = [];
                if (1 == a.length)return this.data[c] || {};
                for (var d = 0; d < a.length; d++)this.data[a[d]] && b.push(this.data[a[d]].type);
                return {name: "专区订单", type: b.join(",")}
            }
        }, init: function () {
            var a = this, c = this.type.get();
            document.title = c.name || "专区订单", $(".v-navbar h1").html(document.title), c.type ? (d = c.type, b.repositoryId ? (popPageLoading(), this.loadData(1, function (b) {
                        popClose(), a.initView(b)
                    })) : popAlert("缺少参数repositoryId")) : popAlert("未知的订单分类")
        }, initView: function (a) {
            var b = this, c = $(".myorder"), d = {}, e = 1;
            this.orderTmpl = stringUtil.getScriptTmpl(c, "orderList"), a.totalCount > 5 ? d.showMore = !0 : 0 === a.totalCount && (d.norecord = !0), c.setTmplHtml(d), d.showMore && c.find(".btn-wrap .btn").click(function () {
                e++, popLoading("内容加载中"), b.loadData(e, function (a) {
                    popClose(), b.updateList(a)
                })
            }), d.norecord || this.updateList(a)
        }, loadData: function (c, e) {
            var f = {
                token: a.token,
                orderType: d.indexOf(",") >= 0 ? "" : d,
                multiOrderType: d.indexOf(",") >= 0 ? d : "",
                cloudDistrictId: b.districtId || "",
                repositoryId: b.repositoryId,
                paySource: b.paySource || "002003",
                timeType: b.timeType || "04",
                salesType: b.salesType || "",
                picAttr: "180_180",
                picType: "02",
                pageNo: c,
                pageSize: 5
            };
            loadAjaxData({
                type: "callback",
                url: "//www.wanlitong.com/mobileapi/m2/member/queryOrdersList.do",
                params: f,
                signType: 1,
                onSuccess: function (a) {
                    e(a)
                },
                onError: function (a) {
                    popDataLoadFailed(a, b.from)
                }
            })
        }, updateList: function (a) {
            var b = this, c = $(".v-listview"), d = $(".btn-wrap"), e = {
                "05": "待支付",
                10: "待配送",
                31: "待配送",
                "31X": "待配送",
                32: "待配送",
                "3D": "出库中",
                33: "配送中",
                30: "已完成",
                "3C": "已完成",
                "05F": "已取消",
                "3X": "已取消",
                "04X": "已取消",
                "04F": "已取消",
                "31F": "已取消",
                "3B": "已取消"
            }, f = {"配送中": "待使用", "出库中": "待使用", "已完成": "已使用", "已完成，已评分": "已使用，已评分"};
            a.list = a.list || [], $.each(a.list, function (a, d) {
                d.totalPrice = (d.sumCash / 100).toFixed(2), d.statusText = e[d.orderStatus], "05" == d.orderStatus ? (d.btnCancel = !0, d.btnPay = !0, d.statusText = "") : ["10", "31", "31X", "32"].indexOf(d.orderStatus) >= 0 ? d.btnCancel = !0 : ["001", "006"].indexOf(d.productType.substring(0, 3)) >= 0 && ["30", "3C"].indexOf(d.orderStatus) >= 0 && (1 == d.rateStatus ? d.btnReview = !0 : 2 == d.rateStatus && (d.statusText = "已完成，已评分")), "P1000520" == d.merId && (d.isVIP = !0, d.totalVIPPoint = d.sumCash / 100 * 1e3), "006" == d.productType.substring(0, 3) && (d.statusText = f[d.statusText] || d.statusText), b.addItem(c, d)
            });
            var g = c.find("ul").length;
            g >= a.totalCount && d.hide()
        }, addItem: function (a, b) {
            var c = this, d = $(stringUtil.template(this.orderTmpl, b));
            d.find(".btn-cancel").click(function () {
                return popConfirm({
                    message: "确定取消改订单？", btnCancel: "不取消了", afterConfirm: function () {
                        c.cancelOrder(b)
                    }
                }), !1
            }), d.find(".btn-pay").click(function () {
                return c.payOrder(b), !1
            }), a.append(d)
        }, cancelOrder: function (b) {
            popLoading("订单取消中"), loadAjaxData({
                type: "callback",
                url: "//www.wanlitong.com/mobileapi/m2/pointsmall/order/cancelOrder.do",
                params: {token: a.token, orderId: b.orderId},
                signType: 1,
                onSuccess: function () {
                    popAlert("订单取消成功", function () {
                        location.reload(!0)
                    })
                },
                onError: function (a) {
                    popMsgbox(a.message || a.rspDescription || "订单取消失败，<br/>请稍后重试")
                }
            })
        }, payOrder: function (a) {
            "08" == a.salesType ? this.payYqbOrder(a) : this.payWltOrder(a)
        }, payWltOrder: function (b) {
            var c = {
                orderAmt: b.sumCash,
                orderId: b.orderId,
                reqId: b.reqId,
                merId: b.merId,
                payType: b.payType,
                sysTxnId: b.sysTxnId,
                patk: a.token,
                merUserId: a.memberId || "",
                merUrl: location.href
            }, d = JSON.parse(sessionStorage.getItem("wlt.url") || "{}");
            "false" != b.orderFlag && (d.isFromCloud = !0, sessionStorage.setItem("wlt.url", JSON.stringify(d))), location.href = "/wap/pay/v2.0/wltpay.shtml?" + $.param(c)
        }, payYqbOrder: function (a) {
            sessionStorage.setItem("wlt.yqbpay", JSON.stringify({
                type: "proceedPay",
                returnUrl: location.href,
                cancelUrl: location.href
            })), location.href = "/wap/pay/yqb/yqbpay.shtml?" + $.param({type: "proceed", orderId: a.orderId})
        }
    };
    e.init()
});