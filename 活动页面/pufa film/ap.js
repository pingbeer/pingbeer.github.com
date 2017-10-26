var myApp;
myApp = angular.module("webApp", ['ui.router', 'ngCookies', 'ngStorage', 'oc.lazyLoad', 'infinite-scroll'
]).run(function ($rootScope, PH, $sessionStorage, $state, $cookies) {
    FastClick.attach(document.body);
    creatrootscrop($rootScope, PH, $sessionStorage, $state, $cookies);
});

// https://spdbwx.idoupiao.com/pufaweixin2.2/main/hotfilmspage?cityId=2&inType=PDXB&latitude=31.243637&longitude=121.508824&page=1
// https://static.idoupiao.com/js/controller/film/filmcontroller.js
createService(myApp);
creatDirective(myApp);
creatFilter(myApp);
myApp.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    var urlStatic = 'https://static.idoupiao.com/';
    $urlRouterProvider.when("", "index");
    $stateProvider
        .state("login", {//登录
            url: "/login",
            templateUrl: "./view/login.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "LoginModule",
                        files: [urlStatic + "js/controller/account/logincontroller.js"]
                    })
                }
            }
        })
        .state("index", {//
            url: "/index",
            templateUrl: "./view/other.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SpdModule",
                        files: [urlStatic + "js/controller/account/logincontroller.js"]
                    })
                }
            }
        })
        .state("main", {//首页
            url: "/main",
            templateUrl: "./view/main.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "mainModules",
                        files: [urlStatic + "js/controller/home/maincontroller.js"]
                    })
                }
            }
        })
        .state("films", {//影片
            url: "/films",
            templateUrl: "./view/film/films.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FilmModule",
                        files: [urlStatic + "js/controller/film/filmcontroller.js"]
                    })
                }
            }
        })
        .state("filmdetail", {//影片详情
            url: "/filmdetail/:id/:type",
            templateUrl: "./view/film/films_detail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FilmDetailModule",
                        files: [urlStatic + "js/controller/film/filmdetailcontroller.js"]
                    })
                }
            }
        })
        .state("filmsearch", {//影片搜索
            url: "/filmsearch/:id/:type",
            templateUrl: "./view/film/films_search.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FilmsSearchModule",
                        files: [urlStatic + "js/controller/film/filmsearchcontroller.js"]
                    })
                }
            }
        })
        .state("cinema", {//影院
            url: "/cinema",
            templateUrl: "./view/cinema/cinema.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CinemaModule",
                        files: [urlStatic + "js/controller/cinema/cinemacontroller.js"]
                    })
                }
            }
        })
        .state("map", {//影院地图
            url: "/map/:id/:type",
            templateUrl: "./view/cinema/cinema_map.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MapModule",
                        files: [urlStatic + "js/controller/cinema/cinemamapcontroller.js"]
                    })
                }
            }
        })
        .state("cinemadetail", {//影院详情
            url: "/cinemadetail/:id/:type",
            templateUrl: "./view/cinema/cinema_detail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CinemaDetailModule",
                        files: [urlStatic + "js/controller/cinema/cinemadetailcontroller.js"]
                    })
                }
            }
        })
        .state("seat", {//影院座位
            url: "/seat/:id/:type",
            templateUrl: "./view/seat/seat.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SeatModule",
                        files: [urlStatic + "js/controller/seat/seatcontroller.js"]
                    })
                }
            }
        })
        .state("maoyanseat", {//影院座位
            url: "/maoyanseat/:id/:type",
            templateUrl: "./view/seat/maoyanseat.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MaoyanSeatModule",
                        files: [urlStatic + "js/controller/seat/maoyanseatcontroller.js"]
                    })
                }
            }
        })
        .state("search", {//搜索
            url: "/search/:type",
            templateUrl: "./view/search/search.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SearchModule",
                        files: [urlStatic + "js/controller/search/searchcontroller.js"]
                    })
                }
            }
        })
        .state("mine", {//个人中心
            url: "/mine",
            templateUrl: "./view/user/mine.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MineModule",
                        files: [urlStatic + "js/controller/user/minecontroller.js"]
                    })
                }
            }
        })
        .state("mainactivity", {//活动中心
            url: "/mainactivity",
            templateUrl: "./view/user/mainactivity.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MainActivityModule",
                        files: [urlStatic + "js/controller/user/activity/mainactivitycontroller.js"]
                    })
                }
            }
        })
        .state("birthday", {//小浦庆生
            url: "/birthday",
            templateUrl: "./view/user/activity/birthday.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "BirthdayModule",
                        files: [urlStatic + "js/controller/user/activity/mainactivitycontroller.js"]
                    })
                }
            }
        })
        .state("activity", {//抽奖
            url: "/activity/:id",
            templateUrl: "./view/user/activity.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ActivityModule",
                        files: [urlStatic + "js/controller/user/activitycontroller.js"]
                    })
                }
            }
        })
        .state("history", {//抽奖记录
            url: "/history/:id/:type",
            templateUrl: "./view/user/activityhistory.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ActivityHistoryModule",
                        files: [urlStatic + "js/controller/user/activitycontroller.js"]
                    })
                }
            }
        })
        .state("myprize", {//我的奖励
            url: "/myprize/:type",
            templateUrl: "./view/user/myprize.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MyPrizeModule",
                        files: [urlStatic + "js/controller/user/myprizecontroller.js"]
                    })
                }
            }
        })
        .state("prizetree", {//我的奖励
            url: "/prizetree/:type",
            templateUrl: "./view/user/prizetree.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "prizeTreeModule",
                        files: [urlStatic + "js/controller/user/myprizecontroller.js"]
                    })
                }
            }
        })
        .state("mypacket", {//我的红包
            url: "/mypacket",
            templateUrl: "./view/user/mypacket.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MyPacketModule",
                        files: [urlStatic + "js/controller/user/mypacketcontroller.js"]
                    })
                }
            }
        })
        .state("packetrule", {//红包使用说明
            url: "/packetrule",
            templateUrl: "./view/user/packetrule.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "PacketRuleModule",
                        files: [urlStatic + "js/controller/user/mypacketcontroller.js"]
                    })
                }
            }
        })
        .state("setsign", {//签约快捷支付
            url: "/setsign",
            templateUrl: "./view/user/sign.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SignModule",
                        files: [urlStatic + "js/controller/user/signcontroller.js"]
                    })
                }
            }
        })
        .state("allorder", {//我的订单
            url: "/allorder/:type",
            templateUrl: "./view/user/myorder.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MyOrderModule",
                        files: [urlStatic + "js/controller/user/myordercontroller.js"]
                    })
                }
            }
        })
        .state("orderdetail", {//订单详情
            url: "/orderdetail/:id/:type/:change",
            templateUrl: "./view/user/orderdetail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "OrderDetailModule",
                        files: [urlStatic + "js/controller/order/ordersuccesscontroller.js"]
                    })
                }
            }
        })
        .state("collect", {//我的收藏
            url: "/collect",
            templateUrl: "./view/user/collect.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CollectModule",
                        files: [urlStatic + "js/controller/user/collectcontroller.js"]
                    })
                }
            }
        })
        .state("question", {//问题
            url: "/question",
            templateUrl: "./view/user/question.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "QuestionModule",
                        files: [urlStatic + "js/controller/user/minecontroller.js"]
                    })
                }
            }
        })
        .state("freecode", {//兑换码领取
            url: "/freecode/:id",
            templateUrl: "./view/user/free_code.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FreeCodeModule",
                        files: [urlStatic + "js/controller/user/userfreecontroller.js"]
                    })
                }
            }
        })
        .state("freenotice", {//说明
            url: "/freenotice/:id",
            templateUrl: "./view/user/free_notice.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FreeNoticeModule",
                        files: [urlStatic + "js/controller/user/userfreecontroller.js"]
                    })
                }
            }
        })
        .state("seatorder", {//确定订单
            url: "/seatorder/:id/:type",
            templateUrl: "./view/order/order_confirm.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "SeatOrderModule",
                        files: [urlStatic + "js/controller/order/seatordercontroller.js"]
                    })
                }
            }
        })
        .state("success", {//购票成功
            url: "/success",
            templateUrl: "./view/order/order_success.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "OrderSuccessModule",
                        files: [urlStatic + "js/controller/order/ordersuccesscontroller.js"]
                    })
                }
            }
        })
        .state("city", {//选城市
            url: "/city/:id",
            templateUrl: "./view/city/city_search.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CityModule",
                        files: [urlStatic + "js/controller/city/citycontroller.js"]
                    })
                }
            }
        })
        .state("find", {//发现
            url: "/find",
            templateUrl: "./view/find/find.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FindModule",
                        files: [urlStatic + "js/controller/find/findcontroller.js"]
                    })
                }
            }
        })
        .state("guess", {//竞猜
            url: "/guess",
            templateUrl: "./view/user/guess.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "GuessModule",
                        files: [urlStatic + "js/controller/user/guesscontroller.js"]
                    })
                }
            }
        })
        .state("week", {//周周抢活动
            url: "/week",
            templateUrl: "./view/activity/weekactivity.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "WeekActivity",
                        files: [urlStatic + "js/controller/activity/weekcontroller.js"]
                    })
                }
            }
        })
        .state("weekrule", {//周周抢活动规则
            url: "/weekrule",
            templateUrl: "./view/activity/week_rule.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "WeekRuleModule",
                        files: [urlStatic + "js/controller/activity/weekcontroller.js"]
                    })
                }
            }
        })
        .state("weekhistory", {//周周抢活动中奖记录
            url: "/weekhistory",
            templateUrl: "./view/activity/weekhistory.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "WeekHistoryModule",
                        files: [urlStatic + "js/controller/activity/weekcontroller.js"]
                    })
                }
            }
        })
        .state("activityfirst", {//抢票活动
            url: "/activityfirst/:type/:robid",
            // https://spdbwx.idoupiao.com/pufaweixin2.2/view/activity/activityfirst.html
            templateUrl: "./view/activity/activityfirst.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanActivity",
                        files: [urlStatic + "js/controller/activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("activitysecond", {//反转抢票活动
            url: "/activitysecond/:type/:robid",
            templateUrl: "./view/activity/activitysecond.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanActivity",
                        files: [urlStatic + "js/controller/activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("vipmingyue", {//抢票活动
            url: "/vipmingyue/:type/:robid",
            templateUrl: "./view/activity/vipmingyue.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanActivity",
                        files: [urlStatic + "js/controller/activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("directionfirst", {//抢票活动
            url: "/directionfirst/:type/:robid",
            templateUrl: "./view/activity/directionfirst.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanDirectionActivity",
                        files: [urlStatic + "js/controller/activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("directionsecond", {//反转抢票活动
            url: "/directionsecond/:type/:robid",
            templateUrl: "./view/activity/directionsecond.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanDirectionActivity",
                        files: [urlStatic + "js/controller/activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("rulefirst", {//抢票活动
            url: "/rulefirst/:type/:robid",
            templateUrl: "./view/activity/rulefirst.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanRuleModule",
                        files: [urlStatic + "js/controller/activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("rulesecond", {//反转抢票活动
            url: "/rulesecond/:type/:robid",
            templateUrl: "./view/activity/rulesecond.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "DroiyanRuleModule",
                        files: [urlStatic + "js/controller/activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("viprule", {//抢票活动
            url: "/viprule/:type",
            templateUrl: "./view/activity/viprule.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "vipDroiyanRuleModule",
                        files: [urlStatic + "js/controller/activity/activitycontroller.js"]
                    })
                }
            }
        })
        .state("mypiece", {//实物奖励
            url: "/mypiece",
            templateUrl: "./view/user/mypiece.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "MypieceModule",
                        files: [urlStatic + "js/controller/user/mypiececontroller.js"]
                    })
                }
            }
        })
        .state("onecode", {//1元观影兑换活动
            url: "/onecode",
            templateUrl: "./view/activity/onecode.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "OneCodeModule",
                        files: [urlStatic + "js/controller/activity/onecodecontroller.js"]
                    })
                }
            }
        })
        .state("tencode", {//10元观影兑换活动
            url: "/tencode",
            templateUrl: "./view/user/activity/tencode.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "TenCodeModule",
                        files: [urlStatic + "js/controller/user/activity/tencodecontroller.js"]
                    })
                }
            }
        })
        .state("currencyticket", {//通用观影兑换活动
            url: "/currencyticket",
            templateUrl: "./view/user/activity/currencyticket.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "CurTicketModule",
                        files: [urlStatic + "js/controller/user/activity/ticketcontroller.js"]
                    })
                }
            }
        })//商城======================================
        .state("myshop", {//
            url: "/myshop",
            templateUrl: "./view/shop/myshop.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "myShopModule",
                        files: [urlStatic + "js/controller/shop/myshopcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shoplist", {//商品列表
            url: "/shoplist/:id/:type",
            templateUrl: "./view/shop/shoplist.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopListModule",
                        files: [urlStatic + "js/controller/shop/shoplistcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shopproduct", {//商品详情
            url: "/shopproduct/:id",
            templateUrl: "./view/shop/shopproduct.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ProcuctModdule",
                        files: [urlStatic + "js/controller/shop/productcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("editaddr", {//编辑地址
            url: "/editaddr",
            templateUrl: "./view/shop/editaddr.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "editAddrModule",
                        files: [urlStatic + "js/config/area.js",
                            urlStatic + "js/controller/shop/editaddrcontroller.js",
                            urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shopaddr", {//地址管理
            url: "/shopaddr",
            templateUrl: "./view/shop/shopaddr.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopAddrModule",
                        files: [urlStatic + "js/config/area.js",
                            urlStatic + "js/controller/shop/shopaddrcontroller.js",
                            urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("paymsg", {//支付信息
            url: "/paymsg/:type",
            templateUrl: "./view/shop/paymsg.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "PayMsgModule",
                        files: [urlStatic + "js/controller/shop/paymsgcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("paysuccess", {//支付完成
            url: "/paysuccess/:id",
            templateUrl: "./view/shop/paysuccess.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "PaySuccessModule",
                        files: [urlStatic + "js/controller/shop/paysuccesscontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shopsearch", {//商品搜索
            url: "/shopsearch",
            templateUrl: "./view/shop/shopsearch.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopSearchModule",
                        files: [urlStatic + "js/controller/shop/shopsearchcontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shoporder", {//商品订单
            url: "/shoporder/:type",
            templateUrl: "./view/shop/shoporder.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopOrderModule",
                        files: [urlStatic + "js/controller/shop/shopordercontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("shoporderdetail", {//商品订单详情
            url: "/shoporderdetail/:id/:change",
            templateUrl: "./view/shop/shoporderdetail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "shopOrderDetailModule",
                        files: [urlStatic + "js/controller/shop/shopordercontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("logistics", {//商品物流
            url: "/logistics/:id/:change",
            templateUrl: "./view/shop/logistics.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "LogisticsModule",
                        files: [urlStatic + "js/controller/shop/shopordercontroller.js", urlStatic + "css/shop.css"]
                    })
                }
            }
        })
        .state("recharge", {//充值订单
            url: "/recharge/:type",
            templateUrl: "./view/recharge/rechargeorder.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "rechargeOrderModule",
                        files: [urlStatic + "js/controller/recharge/rechargeordercontroller.js"]
                    })
                }
            }
        })
        .state("rechargedetail", {//充值订单详情
            url: "/rechargedetail/:id/:change",
            templateUrl: "./view/recharge/rechargedetail.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "rechargeDetailModule",
                        files: [urlStatic + "js/controller/recharge/rechargeordercontroller.js"]
                    })
                }
            }
        })
        .state("signIn", {//充值订单详情
            url: "/signIn",
            templateUrl: "./view/signIn/signIn.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "signInModule",
                        files: [urlStatic + "js/controller/signIn/signIn.js"]
                    })
                }
            }
        })
        .state("reserve", {//包场活动
            url: "/reserve",
            templateUrl: "./view/find/cinema_reserve.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ReserveModule",
                        files: [urlStatic + "js/controller/find/reservecontroller.js"]
                    })
                }
            }
        })
        .state("reserveOrder", {//包场活动
            url: "/reserveOrder/:id",
            templateUrl: "./view/find/reserveorder.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ReserveOrderModule",
                        files: [urlStatic + "js/controller/find/reservecontroller.js"]
                    })
                }
            }
        })
        .state("reserveSuccess", {//包场活动
            url: "/reserveSuccess/:id",
            templateUrl: "./view/find/reserve_success.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "ReserveSuccessModule",
                        files: [urlStatic + "js/controller/find/reservecontroller.js"]
                    })
                }
            }
        })
        .state("freeticketactivity", {//免费观影券领取
            url: "/freeticketactivity",
            templateUrl: "./view/user/activity/freeticketactivity.html",
            resolve: {
                loadMyCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: "FreeActivityModule",
                        files: [urlStatic + "js/controller/user/activity/freeactivitycontroller.js"]
                    })
                }
            }
        })
});

