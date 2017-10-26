var main = angular.module("mainModule", []);

//首页
main.controller('setMainController', function ($scope, $http, $rootScope, $sessionStorage, $state, $cookieStore,
                                               $timeout, $stateParams, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $rootScope.dialogIsHidden = false;
    $rootScope.pagetype = 1;
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 583 / 624;
    $('.hot-film').height((imgWidth - 10 * 2) / 3 * 600 / 410 + 50);
    $('.hot-swiper').height((imgWidth - 10 * 2) / 3 * 600 / 410);
    $('.bannerBackground').height((imgWidth - 10 * 2) / 3 * 600 / 410 + 45);
    $scope.hotrec = {
        width: '100%',
        height: imgHeight + 'px'
    };
    $scope.activestyle = {
        'width': '100%',
        'height': imgHeight + 'px',
        'background': 'url(/images/activity-banner.png)no-repeat center',
        'background-size': '100% 100%',
        'position': 'relative'
    };
    $scope.colesstyle = {
        'width': '30px',
        'height': '77px',
        'background': 'url(/images/activity-close1.png)no-repeat center',
        'background-size': '100% 100%',
        'position': 'relative',
        'margin-left': '45%'
    };
    var minheight = $(window).height() - 90;
    $scope.scrollStyle = {
        'overflow-y': 'scroll',
        'width': '100%',
        'margin-top': '30px',
        'margin-bottom': '60px',
        'height': minheight + 'px'
    };


    /*    $scope.activestyle = {
     'width': '100%',
     'height': imgHeight + 'px',
     'background': 'url(./images/activity-banner1.png)no-repeat center',
     'background-size': '100% 100%',
     'position': 'relative'
     };*/
    if (!$sessionStorage.activity) {
        $('.dialogWrapper').show();
    } else {
        $('.dialogWrapper').hide();
    }
    $scope.noticeShow = false;
    //热门推荐
    $scope.swiperLoad = function () {
        PH.api('data/banners.json', {}, function (ret) {
            if (ret.data.length == 0) {
                $scope.mainbanner = false;
                return;
            }
            $scope.mainbanner = false;
            return;
            /* $scope.swiperImg = ret.data;
             $scope.mainbanner = true;*/
        }, function (ret) {
        });
    };
    //加载热门电影
    $scope.load = function () {
        PH.api('data/hotfilms.json', {}, function (ret) {
            $rootScope.dialogIsHidden = false;
            $scope.swiperLoad();
            if (ret.data == null || ret.data.length == 0) {
                $scope.leng = false;
                $scope.hotleng = false;
                $scope.errormsg = '暂无排片';
                return;
            }

            $scope.leng = false;
            $scope.hotleng = true;
            $scope.hotfilmlist = ret.data;
            if (!$sessionStorage.cityName) {
                $sessionStorage.cityName = '上海';
                $sessionStorage.cityId = 2;
            }
            for (var i = 0; i < $scope.hotfilmlist.length; i++) {
                if ($scope.hotfilmlist[i].id == $sessionStorage.filmIndex) {
                    $scope.swiperIndex = i;
                }
            }
        }, function (ret) {
            $rootScope.dialogIsHidden = false;
            $scope.swiperLoad();
        });

    };
    //-当前城市//
    $scope.curraddress = function () {
        PH.regetLocation(function () {
            PH.api('data/refreshlocation.json', function (ret) {
                $sessionStorage.cityName = ret.data.name;
                $sessionStorage.cityId = ret.data.id;
                $scope.formatAddress = ret.data.formatAddress;
                $sessionStorage.formatAddress = $scope.formatAddress;
                $scope.pname = ret.data.name;
            });
            $sessionStorage.getDirection = 1;
            $rootScope.dialogIsHidden = false;
            $scope.load();
        }, function (ret) {
            $sessionStorage.getDirection = 1;
            $rootScope.formatAddress = '';
            $sessionStorage.cityName = '上海';
            $sessionStorage.cityId = 2;
            $scope.pname = '上海';
            $scope.id = 2;
            $rootScope.dialogIsHidden = false;
            $scope.load();
        });

    };
    //图片渲染完后加载
    $scope.checkLastBanner = function () {
        $scope.getBanner();
    };
    $scope.checkLast = function () {
        $scope.swipercontent();
    };
    //热门推荐图片轮播
    var swiperbanner;
    $scope.getBanner = function () {
        swiperbanner = new Swiper('.hot-rec', {
            pagination: '#swiper-container-id',
            paginationClickable: true,
            centeredSlides: true,
            autoplay: 3000,
            autoplayDisableOnInteraction: false,
            onInit: function (swiperbanner) {
                var index = swiperbanner.activeIndex;
                $timeout(function () {
                    $('#swiper-container-id span').removeClass('swiper-pagination-bullet-active');
                    $('#swiper-container-id span').eq(index).addClass('swiper-pagination-bullet-active');
                }, 1);
            },
            onTransitionEnd: function (swiperbanner) {
                var index = swiperbanner.activeIndex;
                $timeout(function () {
                    $('#swiper-container-id span').removeClass('swiper-pagination-bullet-active');
                    $('#swiper-container-id span').eq(index).addClass('swiper-pagination-bullet-active');
                }, 1);

            }
        });
    };
    //热门电影轮播
    var swiper1;
    $scope.swipercontent = function () {
        var swiperInitSuccess = false;
        swiper1 = new Swiper('.hot-swiper1', {
            slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: 10,
            speed: 500,
            effect: 'coverflow',
            grabCursor: true,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swipe
            initialSlide: $scope.swiperIndex >= 0 ? $scope.swiperIndex : $scope.swiperIndex = 1,//初始化模块索引
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            },
            onInit: function (swiper1) {
                var index = swiper1.activeIndex;
                $timeout(function () {
                    $scope.findfilm = $scope.hotfilmlist[index];
                    $sessionStorage.filmIndex = $scope.findfilm.id;//轮播定位
                    $scope.bannerBackground = {
                        background: 'url("' + $scope.findfilm.smallImg + '")'
                    };
                    $scope.cinemaDetail($scope.findfilm.id);
                }, 1);
            },
            onTransitionEnd: function (swiper1) {
                swiperInitSuccess = true;
                var index = swiper1.activeIndex;
                if (!index && index != 0) {
                    return;
                }
                if (swiperInitSuccess) {//防止swiper未初始化完成就触发此事件
                    $timeout(function () {
                        $scope.findfilm = $scope.hotfilmlist[index];
                        $sessionStorage.filmIndex = $scope.findfilm.id;//轮播定位
                        $scope.bannerBackground = {
                            background: 'url("' + $scope.findfilm.smallImg + '")'
                        };
                        $scope.cinemaDetail($scope.findfilm.id);
                    }, 1);
                }
            }

        });
    };
    //当前影片的所有影院
    $scope.cinemaDetail = function (id) {
        //   $scope.formatAddress = $sessionStorage.formatAddress;
        PH.api('data/cinemas.json', {
            filmId: id,
            cityId: $sessionStorage.cityId
        }, function (ret) {

            if (ret.data.cinemas == null || ret.data.cinemas.length == 0) {
                $scope.leng = false;
                $scope.errormsg = '该城市暂无相关影片信息';
                return;
            }
            if (ret.data.cinemas.length > 0) {
                $scope.leng = true;
                $scope.recommandCinema = ret.data.recommandCinema;
                $scope.cinemalist = ret.data.cinemas;
            } else {
                $scope.leng = false;
                $scope.errormsg = '该城市暂无相关影片信息';
            }
        }, function (ret) {
        });
    };
    //每日抽奖
    //签到有礼
    $scope.qzyl = function () {
        $scope.naomi = '敬请期待';
        $rootScope.errorHidden = false;
    };
    //充值兑换
    //信用卡申请
    if ($rootScope.inType == 'HSH') {
        $('.nav-main').css({
            'background': 'linear-gradient(top, rgba(211,211,211,.7), rgba(255,255,255,.7))',
            'background': '-moz-linear-gradient(top, rgba(211,211,211,.7), rgba(255,255,255,.7))',
            'background': '-webkit-gradient(linear, 0% 0%, 0% 100%,from(rgba(0,0,0,.7)), to(rgba(255,255,255,.7)))',
            'color': '#fff',
            'margin-top': '40px'
        });
    } else {
        $('.nav-main').css({
            'background': 'linear-gradient(top, rgba(211,211,211,.7), rgba(255,255,255,.7))',
            'background': '-moz-linear-gradient(top, rgba(211,211,211,.7), rgba(255,255,255,.7))',
            'background': '-webkit-gradient(linear, 0% 0%, 0% 100%,from(rgba(0,0,0,.7)), to(rgba(255,255,255,.7)))',
            'color': '#fff'
        });
    }
    $('.nav-main i').css({'color': '#fff'});
    $('.nav-main .ui-icon-search').css({'color': '#000'});
    $('.nav-main input').css({'border': 'none'});
    $('#scrollStyle').on('scroll', function () {

//变量t就是滚动条滚动时，到顶部的距离
        var t = document.getElementById('scrollStyle').scrollTop;
        if (t > 15 && $rootScope.inType != 'HSH') {
            $('.nav-main').css({'background': '#fff', 'color': '#000'});
            $('.nav-main i').css({'color': '#3a3a3a'});
            $('.nav-main i.ui-icon-unfold').css({'color': '#a5a5a5'});
            $('.nav-main input').css({'border': '1px solid #e4e4e4'});

        } else if (t > 40 && $rootScope.inType == 'HSH') {
            $('.nav-main').css({'background': '#fff', 'color': '#000', 'margin-top': '0'});
            $('.nav-main i').css({'color': '#000'});
            $('.nav-main input').css({'border': '1px solid #666'});

        } else {
            if ($rootScope.inType == 'HSH') {
                $('.nav-main').css({
                    'background': 'linear-gradient(top, rgba(211,211,211,.7), rgba(255,255,255,.7))',
                    'background': '-moz-linear-gradient(top, rgba(211,211,211,.7), rgba(255,255,255,.7))',
                    'background': '-webkit-gradient(linear, 0% 0%, 0% 100%,from(rgba(0,0,0,.7)), to(rgba(255,255,255,.7)))',
                    'color': '#fff',
                    'margin-top': '40px'
                });
            }
            else {
                $('.nav-main').css({
                    'background': 'linear-gradient(top, rgba(211,211,211,.7), rgba(255,255,255,.7))',
                    'background': '-moz-linear-gradient(top, rgba(211,211,211,.7), rgba(255,255,255,.7))',
                    'background': '-webkit-gradient(linear, 0% 0%, 0% 100%,from(rgba(0,0,0,.7)), to(rgba(255,255,255,.7)))',
                    'color': '#fff'
                });
            }
            $('.nav-main i').css({'color': '#fff'});
            $('.nav-main .ui-icon-search').css({'color': '#000'});
            $('.nav-main input').css({'border': 'none'});
        }

    })
    //影片详情
    $scope.filmDetail = function (id) {
        $sessionStorage.filmIndex = id;
        $state.go('filmdetail', {'id': id, 'type': 1});
    };

    //影院详情
    $scope.getCinemaDetail = function (id) {
        $state.go('cinemadetail', {'id': id, 'type': 1});
    };
    //搜索
    $scope.searchLoad = function (event) {
        if (event.keyCode == 13) {
            $sessionStorage.searchCinema = $scope.search;
            $sessionStorage.searchTitle = '';
            $state.go('search', {'type': 1});
        }
    };
    $scope.betaindex = function () {
        if ($rootScope.platform == 2) {
            $scope.params = {
                telePhone: PH.getPara('telePhone')
            };
        } else {
            $scope.params = {};
        }

        if (PH.getPara('orderType')) {
            $rootScope.orderType = PH.getPara('orderType');
        }
        var source = null;
        if (PH.getPara('source')) {
            source = PH.getPara('source');
        }
        // 结束
        PH.api($rootScope.indexUrl, $scope.params, function (r) {
            var ret={"data":{"lotteryTimes":0,"hasFreePrize":false,"isMaintainTime":false,"hasTenPrize":false,"encryptCardNo":"6259********6240","freePrizeCount":0,"announcement":null},"errorCode":0,"message":"请求成功"};
            if (ret.data == null) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '系统繁忙';
                return;
            }
            $sessionStorage.getnoce = 1;
            $rootScope.dialogIsHidden = false;
            //公告
            if (ret.data.announcement == 'null' || !ret.data.announcement) {
                $scope.noticeShow = false;
            } else {
                $scope.noticeShow = true;
                $scope.announcement = ret.data.announcement.title + "：" + ret.data.announcement.description;
            }
            //抽奖次数
            $sessionStorage.encryptCardNo = ret.data.encryptCardNo;
            $scope.legeNum = ret.data.lotteryTimes ? ret.data.lotteryTimes : 0;
            if ($scope.legeNum > 0) {
                $scope.lege = 0;
            } else {
                $scope.lege = 1;
            }
            //hasFreePrize，为true，则有免费观影：
            //source  为增票端的判断条件 如果不是则忽略
            $rootScope.dialogIsHidden = false;
            if ($rootScope.orderType != 'PFWX' && $rootScope.platform == 2) {

                $scope.hasFreePrize = true;
                $sessionStorage.hasFreePrize = ret.data.hasFreePrize;
                $sessionStorage.freePrizeCount = ret.data.freePrizeCount;
            }
            else {
                $scope.hasFreePrize = false;
                $sessionStorage.hasFreePrize = ret.data.hasFreePrize;
                $sessionStorage.freePrizeCount = 0;
            }
            if ($sessionStorage.getDirection != 1) {
                $rootScope.dialogIsHidden = false;
                $scope.curraddress();
            }
            else {
                $rootScope.dialogIsHidden = false;
                $scope.pname = $sessionStorage.cityName;
                $scope.load();

            }

            //isMaintainTime 为true有维护公告
            if (ret.data.isMaintainTime) {
                //   $state.go('weihu', {reload: true});
                return;
            }
        }, function (ret) {
            $scope.leng = false;
            $scope.hotleng = false;
            $scope.noticeShow = false;
        });
    };
    //关闭
    $scope.clockWrapper = function () {
        $sessionStorage.activity = 1;
        $('.dialogWrapper').hide();
    };
    //惠生活
    $scope.pufahshindex = function () {
        $rootScope.dialogIsHidden = false;
        PH.api('pufahshindex', {
            telePhone: PH.getPara('telePhone'),
            certNo: PH.getPara('certNo'),
            inType: 'HSH'
        }, function (ret) {
            $sessionStorage.hcertNo = ret.data.certNo;
            $sessionStorage.htelePhone = ret.data.telePhone;
            $scope.betaindex();
        }, function (ret) {
        })
    };
    if ($rootScope.inType == 'HSH') {
        $scope.pufahshindex();
    } else {
        $scope.betaindex();
    }
    //返回惠生活
    $scope.returnHui = function () {
        window.location.href = 'https://pufa.soonwill.com/XPMall/Home/ReLogOn';
    };
    $timeout(function () {
        if ($sessionStorage.getnoce != 1) {
            if ($rootScope.inType == 'HSH') {
                $scope.pufahshindex();
            } else {
                $scope.betaindex();
            }
        }
    }, 5000, 1);
});