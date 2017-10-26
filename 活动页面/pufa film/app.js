var myApp;
myApp = angular.module("webApp", ['ui.router', 'ngCookies', 'ngStorage', 'oc.lazyLoad', 'infinite-scroll'
]).run(function ($rootScope, PH, $sessionStorage, $state, $cookies) {
    FastClick.attach(document.body);
    creatrootscrop($rootScope, PH, $sessionStorage, $state, $cookies);
});

createService(myApp);
creatDirective(myApp);
creatFilter(myApp);
myApp.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    var urlStatic = '';
    $urlRouterProvider.when("", "index");
    $stateProvider
        .state("login", {//登录
            url: "/login",
            templateUrl: "view/login.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "LoginModule",
                        files: [urlStatic + "logincontroller.js"]
                    })
                }
            }
        })
        .state("index", {//
            url: "/index",
            templateUrl: "view/other.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SpdModule",
                        files: [urlStatic + "logincontroller.js"]
                    })
                }
            }
        })
        .state("main", {//首页
            url: "/main",
            templateUrl: "view/main.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "mainModules",
                        files: [urlStatic + "maincontroller.js"]
                    })
                }
            }
        })
        .state("films", {//影片
            url: "/films",
            templateUrl: "view/films.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FilmModule",
                        files: [urlStatic + "filmcontroller.js"]
                    })
                }
            }
        })
        .state("filmdetail", {//影片详情
            url: "/filmdetail/:id/:type",
            templateUrl: "view/films_detail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FilmDetailModule",
                        files: [urlStatic + "filmdetailcontroller.js"]
                    })
                }
            }
        })
        .state("filmsearch", {//影片搜索
            url: "/filmsearch/:id/:type",
            templateUrl: "view/films_search.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FilmsSearchModule",
                        files: [urlStatic + "filmsearchcontroller.js"]
                    })
                }
            }
        })
        .state("cinema", {//影院
            url: "/cinema",
            templateUrl: "view/cinema.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CinemaModule",
                        files: [urlStatic + "cinemacontroller.js"]
                    })
                }
            }
        })
        .state("map", {//影院地图
            url: "/map/:id/:type",
            templateUrl: "view/cinema_map.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MapModule",
                        files: [urlStatic + "cinemamapcontroller.js"]
                    })
                }
            }
        })
        .state("cinemadetail", {//影院详情
            url: "/cinemadetail/:id/:type",
            templateUrl: "view/cinema_detail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CinemaDetailModule",
                        files: [urlStatic + "cinemadetailcontroller.js"]
                    })
                }
            }
        })

        .state("maoyanseat", {//影院座位
            url: "/maoyanseat/:id/:type",
            templateUrl: "view/maoyanseat.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MaoyanSeatModule",
                        files: [urlStatic + "maoyanseatcontroller.js"]
                    })
                }
            }
        })
        .state("search", {//搜索
            url: "/search/:type",
            templateUrl: "view/search.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SearchModule",
                        files: [urlStatic + "searchcontroller.js"]
                    })
                }
            }
        })
        .state("mine", {//个人中心
            url: "/mine",
            templateUrl: "view/mine.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MineModule",
                        files: [urlStatic + "minecontroller.js"]
                    })
                }
            }
        })
        .state("mainactivity", {//活动中心
            url: "/mainactivity",
            templateUrl: "view/mainactivity.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MainActivityModule",
                        files: [urlStatic + "mainactivitycontroller.js"]
                    })
                }
            }
        })
        .state("birthday", {//小浦庆生
            url: "/birthday",
            templateUrl: "view/birthday.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "BirthdayModule",
                        files: [urlStatic + "mainactivitycontroller.js"]
                    })
                }
            }
        })
        .state("activity", {//抽奖
            url: "/activity/:id",
            templateUrl: "view/activity.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ActivityModule",
                        // 请勿修改
                        files: [urlStatic + "user/activitycontroller.js"]
                    })
                }
            }
        })
        .state("history", {//抽奖记录
            url: "/history/:id/:type",
            templateUrl: "view/activityhistory.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ActivityHistoryModule",
                        // 请勿修改
                        files: [urlStatic + "user/activitycontroller.js"]
                    })
                }
            }
        })
        .state("myprize", {//我的奖励
            url: "/myprize/:type",
            templateUrl: "view/myprize.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MyPrizeModule",
                        files: [urlStatic + "myprizecontroller.js"]
                    })
                }
            }
        })
        .state("prizetree", {//我的奖励
            url: "/prizetree/:type",
            templateUrl: "view/prizetree.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "prizeTreeModule",
                        files: [urlStatic + "myprizecontroller.js"]
                    })
                }
            }
        })
        .state("mypacket", {//我的红包
            url: "/mypacket",
            templateUrl: "view/mypacket.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MyPacketModule",
                        files: [urlStatic + "mypacketcontroller.js"]
                    })
                }
            }
        })
        .state("packetrule", {//红包使用说明
            url: "/packetrule",
            templateUrl: "view/packetrule.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "PacketRuleModule",
                        files: [urlStatic + "mypacketcontroller.js"]
                    })
                }
            }
        })
        .state("setsign", {//签约快捷支付
            url: "/setsign",
            templateUrl: "view/sign.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SignModule",
                        files: [urlStatic + "signcontroller.js"]
                    })
                }
            }
        })
        .state("allorder", {//我的订单
            url: "/allorder/:type",
            templateUrl: "view/myorder.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MyOrderModule",
                        files: [urlStatic + "myordercontroller.js"]
                    })
                }
            }
        })
        .state("orderdetail", {//订单详情
            url: "/orderdetail/:id/:type/:change",
            templateUrl: "view/orderdetail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "OrderDetailModule",
                        files: [urlStatic + "ordersuccesscontroller.js"]
                    })
                }
            }
        })
        .state("collect", {//我的收藏
            url: "/collect",
            templateUrl: "view/collect.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CollectModule",
                        files: [urlStatic + "collectcontroller.js"]
                    })
                }
            }
        })
        .state("question", {//问题
            url: "/question",
            templateUrl: "view/question.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "QuestionModule",
                        files: [urlStatic + "minecontroller.js"]
                    })
                }
            }
        })
        .state("freecode", {//兑换码领取
            url: "/freecode/:id",
            templateUrl: "view/free_code.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FreeCodeModule",
                        files: [urlStatic + "userfreecontroller.js"]
                    })
                }
            }
        })
        .state("freenotice", {//说明
            url: "/freenotice/:id",
            templateUrl: "view/free_notice.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FreeNoticeModule",
                        files: [urlStatic + "userfreecontroller.js"]
                    })
                }
            }
        })
        .state("seatorder", {//确定订单
            url: "/seatorder/:id/:type",
            templateUrl: "view/order_confirm.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SeatOrderModule",
                        files: [urlStatic + "seatordercontroller.js"]
                    })
                }
            }
        })
        .state("success", {//购票成功
            url: "/success",
            templateUrl: "view/order_success.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "OrderSuccessModule",
                        files: [urlStatic + "ordersuccesscontroller.js"]
                    })
                }
            }
        })
        .state("seat", {//影院座位
            url: "/seat/:id/:type",
            templateUrl: "view/seat.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SeatModule",
                        files: [urlStatic + "seatcontroller.js"]
                    })
                }
            }
        })
        .state("city", {//选城市
            url: "/city/:id",
            templateUrl: "view/city_search.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CityModule",
                        files: [urlStatic + "citycontroller.js"]
                    })
                }
            }
        })

        .state("find", {//发现
            url: "/find",
            templateUrl: "view/find/find.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FindModule",
                        files: [urlStatic + "findcontroller.js"]
                    })
                }
            }
        })
        .state("guess", {//竞猜
            url: "/guess",
            templateUrl: "view/guess.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "GuessModule",
                        files: [urlStatic + "guesscontroller.js"]
                    })
                }
            }
        })
        .state("week", {//周周抢活动
            url: "/week",
            templateUrl: "view/weekactivity.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "WeekActivity",
                        files: [urlStatic + "weekcontroller.js"]
                    })
                }
            }
        })
        .state("weekrule", {//周周抢活动规则
            url: "/weekrule",
            templateUrl: "view/week_rule.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "WeekRuleModule",
                        files: [urlStatic + "weekcontroller.js"]
                    })
                }
            }
        })
        .state("weekhistory", {//周周抢活动中奖记录
            url: "/weekhistory",
            templateUrl: "view/weekhistory.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "WeekHistoryModule",
                        files: [urlStatic + "weekcontroller.js"]
                    })
                }
            }
        })
        .state("activityfirst", {//抢票活动
            url: "/activityfirst/:type/:robid",
            // https://spdbwx.idoupiao.com/pufaweixin2.2/view/activity/activityfirst.html
            templateUrl: "view/activityfirst.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanActivity",
                        // 请勿修改
                        files: [urlStatic + "activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("activitysecond", {//反转抢票活动
            url: "/activitysecond/:type/:robid",
            templateUrl: "view/activitysecond.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanActivity",
                        // 请勿修改
                        files: [urlStatic + "activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("vipmingyue", {//抢票活动
            url: "/vipmingyue/:type/:robid",
            templateUrl: "view/vipmingyue.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanActivity",   // 请勿修改
                        files: [urlStatic + "activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("directionfirst", {//抢票活动
            url: "/directionfirst/:type/:robid",
            templateUrl: "view/directionfirst.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanDirectionActivity",   // 请勿修改
                        files: [urlStatic + "activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("directionsecond", {//反转抢票活动
            url: "/directionsecond/:type/:robid",
            templateUrl: "view/directionsecond.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanDirectionActivity",   // 请勿修改
                        files: [urlStatic + "activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("rulefirst", {//抢票活动
            url: "/rulefirst/:type/:robid",
            templateUrl: "view/rulefirst.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanRuleModule",   // 请勿修改
                        files: [urlStatic + "activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("rulesecond", {//反转抢票活动
            url: "/rulesecond/:type/:robid",
            templateUrl: "view/rulesecond.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanRuleModule",   // 请勿修改
                        files: [urlStatic + "activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("viprule", {//抢票活动
            url: "/viprule/:type",
            templateUrl: "view/viprule.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "vipDroiyanRuleModule",   // 请勿修改
                        files: [urlStatic + "activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("mypiece", {//实物奖励
            url: "/mypiece",
            templateUrl: "view/mypiece.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MypieceModule",
                        files: [urlStatic + "mypiececontroller.js"]
                    })
                }
            }
        })
        .state("onecode", {//1元观影兑换活动
            url: "/onecode",
            templateUrl: "view/onecode.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "OneCodeModule",
                        files: [urlStatic + "onecodecontroller.js"]
                    })
                }
            }
        })
        .state("tencode", {//10元观影兑换活动
            url: "/tencode",
            templateUrl: "view/tencode.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "TenCodeModule",
                        files: [urlStatic + "tencodecontroller.js"]
                    })
                }
            }
        })
        .state("currencyticket", {//通用观影兑换活动
            url: "/currencyticket",
            templateUrl: "view/currencyticket.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CurTicketModule",
                        files: [urlStatic + "ticketcontroller.js"]
                    })
                }
            }
        })//商城======================================
        .state("myshop", {//
            url: "/myshop",
            templateUrl: "view/myshop.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "myShopModule",
                        files: [urlStatic + "myshopcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shoplist", {//商品列表
            url: "/shoplist/:id/:type",
            templateUrl: "view/shoplist.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopListModule",
                        files: [urlStatic + "shoplistcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shopproduct", {//商品详情
            url: "/shopproduct/:id",
            templateUrl: "view/shopproduct.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ProcuctModdule",
                        files: [urlStatic + "productcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("editaddr", {//编辑地址
            url: "/editaddr",
            templateUrl: "view/editaddr.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "editAddrModule",
                        files: [urlStatic + "js/config/area.js",
                            urlStatic + "editaddrcontroller.js",
                            urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shopaddr", {//地址管理
            url: "/shopaddr",
            templateUrl: "view/shopaddr.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopAddrModule",
                        files: [urlStatic + "js/config/area.js",
                            urlStatic + "shopaddrcontroller.js",
                            urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("paymsg", {//支付信息
            url: "/paymsg/:type",
            templateUrl: "view/paymsg.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "PayMsgModule",
                        files: [urlStatic + "paymsgcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("paysuccess", {//支付完成
            url: "/paysuccess/:id",
            templateUrl: "view/paysuccess.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "PaySuccessModule",
                        files: [urlStatic + "paysuccesscontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shopsearch", {//商品搜索
            url: "/shopsearch",
            templateUrl: "view/shopsearch.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopSearchModule",
                        files: [urlStatic + "shopsearchcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shoporder", {//商品订单
            url: "/shoporder/:type",
            templateUrl: "view/shoporder.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopOrderModule",
                        files: [urlStatic + "shopordercontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shoporderdetail", {//商品订单详情
            url: "/shoporderdetail/:id/:change",
            templateUrl: "view/shoporderdetail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopOrderDetailModule",
                        files: [urlStatic + "shopordercontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("logistics", {//商品物流
            url: "/logistics/:id/:change",
            templateUrl: "view/logistics.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "LogisticsModule",
                        files: [urlStatic + "shopordercontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("recharge", {//充值订单
            url: "/recharge/:type",
            templateUrl: "view/rechargeorder.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "rechargeOrderModule",
                        files: [urlStatic + "rechargeordercontroller.js"]
                    })
                }
            }
        })
        .state("rechargedetail", {//充值订单详情
            url: "/rechargedetail/:id/:change",
            templateUrl: "view/rechargedetail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "rechargeDetailModule",
                        files: [urlStatic + "rechargeordercontroller.js"]
                    })
                }
            }
        })
        .state("signIn", {//充值订单详情
            url: "/signIn",
            templateUrl: "view/signIn.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "signInModule",
                        files: [urlStatic + "signIn.js"]
                    })
                }
            }
        })
        .state("reserve", {//包场活动
            url: "/reserve",
            templateUrl: "view/cinema_reserve.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ReserveModule",
                        files: [urlStatic + "reservecontroller.js"]
                    })
                }
            }
        })
        .state("reserveOrder", {//包场活动
            url: "/reserveOrder/:id",
            templateUrl: "view/reserveorder.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ReserveOrderModule",
                        files: [urlStatic + "reservecontroller.js"]
                    })
                }
            }
        })
        .state("reserveSuccess", {//包场活动
            url: "/reserveSuccess/:id",
            templateUrl: "view/reserve_success.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ReserveSuccessModule",
                        files: [urlStatic + "reservecontroller.js"]
                    })
                }
            }
        })
        .state("freeticketactivity", {//免费观影券领取
            url: "/freeticketactivity",
            templateUrl: "view/freeticketactivity.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FreeActivityModule",
                        files: [urlStatic + "freeactivitycontroller.js"]
                    })
                }
            }
        })
});
// var actId="0000015c62572e960091f251800002e5";
// var appOrderN="201707311149440469918095";
// $.ajax({
//     url: "/shop_ticket/cloudDataService.do?",
//     data: {
//         serviceType: "com.ebuy.shop.web.service.UserOrderPayService",
//         serviceMethod: "commitCommonOrder",
//         payPlatform: "3",
//         payMethod: "1",
//         appOrderNo: appOrderN,
//         buyItemQty: "1",
//         activityItemId: actId,
//         spdPointMoney: "0"
//     },
//     success: function(response) {
//     }}
// )
