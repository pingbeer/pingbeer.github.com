var film = angular.module('FilmModule', []);
film.controller('filmController', function ($scope, $rootScope, $http, $state, $cookieStore, $timeout,
                                            $sessionStorage, PH) {

    $scope.btnTab = true;
    $rootScope.pagetype = 2;
    $sessionStorage.getDirection = 1;
    $scope.pname = $sessionStorage.cityName;
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 260 / 640;
    $('.bannerBackground').height((imgWidth - 10 * 2) / 3 * 600 / 410 + 45);
    $scope.hotrec = {
        width: '100%',
        height: imgHeight + 'px'
    };
    //切换
    var filmtype = 1;
    $scope.getTab = function (types) {
        $sessionStorage.filmtype = types;
        window.scrollTo(0, 0);//滚动到顶部
        if (types == 2) {
            $scope.filmswait();
            $scope.btnTab = false;
        } else {
            $scope.filmshot();
            $scope.btnTab = true;
        }
    };
    $scope.noBanner = {
        'margin-top': '0px'
    };
    //热映
    var pageh = 0;
    var pagew = 0;
    var hotMore = 0;
    $scope.hotList = [];
    $scope.waitList = [];
    var time1 = '';
    $scope.filmshot = function () {
        $rootScope.dialogIsHidden = false;
        if (time1) {
            var time2 = new Date().getTime();
            if (time2 - time1 < 300) {
                time1 = time2;
                return;
            } else {
                time1 = time2;
            }
        } else {
            time1 = new Date().getTime();
        }
        pageh++;
        PH.api('data/hotfilmspage.json', {
            cityId: $sessionStorage.cityId,
            page: pageh
        }, function (ret) {

            if ((ret.data.length == 0 || !ret.data) && pageh == 1) {
                hotMore = 1;
                return;
            } else if (ret.data.length == 0 && pagew > 1) {
                return;
            }
            hotMore = 0;

            if (pageh == 1) {
                if (ret.data.length < 10) {
                    hotMore = 1;
                }
                $scope.hotList = ret.data;
            }
            else if (pageh != 1) {
                if (ret.data.length < 10) {
                    hotMore = 1;
                }
                $scope.hotList = $scope.hotList.concat(ret.data);
            }

        }, function (ret) {
        });
    };
    //待
    var waitsMore = 0;
    $scope.filmswait = function () {
        $rootScope.dialogIsHidden = false;
        if (time1) {
            var time2 = new Date().getTime();
            if (time2 - time1 < 300) {
                time1 = time2;
                return;
            } else {
                time1 = time2;
            }
        } else {
            time1 = new Date().getTime();
        }
        pagew++;
        PH.api('data/waitfilmspage.json', {
            page: pagew
        }, function (ret) {
            if ((ret.data.length == 0 || !ret.data) && pagew == 1) {
                waitsMore = 1;
                return;
            } else if (ret.data.length == 0 && pagew > 1) {
                return;
            }
            waitsMore = 0;
            if (pagew == 1) {
                if (ret.data.length < 10) {
                    waitsMore = 1;
                }
                $scope.waitList = ret.data;

            } else if (pagew != 1) {
                if (ret.data.length < 10) {
                    waitsMore = 1;
                }
                $scope.waitList = $scope.waitList.concat(ret.data);
            }

        }, function (ret) {
        });
    };

    //加载更多
    $scope.myPagingFunction = function () {
        if (hotMore != 1) {
            $scope.filmshot();
        }
    };
    $scope.myPagingFunction1 = function () {
        if (waitsMore != 1) {
            $scope.filmswait();
        }
    };
    //影片详情
    $scope.filmDetail = function (id) {
        $sessionStorage.filmIndex = id;
        $state.go('filmdetail', {'id': id, 'type': 2});
    };
    //比价购票
    $scope.getAllTicket = function (id) {
        $sessionStorage.filmIndex = id;
        $state.go('filmsearch', {'id': id, 'type': 2});
    };
    //热门推荐
    $scope.swiperLoad = function () {
        PH.api('data/banners.json', {}, function (ret) {
            if (ret.data.length == 0) {
                $scope.mainbanner = false;
                $scope.noBanner = {
                    'margin-top': '40px'
                };
                return;
            }
            $scope.swiperImg = ret.data;
            $scope.mainbanner = true;
            $rootScope.dialogIsHidden = false;
        }, function (ret) {
        });
    };
    //图片渲染完后加载
    $scope.checkLastBanner = function () {
        $scope.getBanner();
        $rootScope.dialogIsHidden = true;
    };
    //热门推荐图片轮播
    var banner = 0;
    $scope.getBanner = function () {
        banner++;
        if (banner > 1) {
            return;
        }
        var filmbanner = new Swiper('.filmSwiperBanner', {
            pagination: '#swiper-film-id',
            autoplay: 3000,
            autoplayDisableOnInteraction: false,
            paginationClickable: true,
            onInit: function (filmbanner) {
                var index = filmbanner.activeIndex;
                $timeout(function () {
                    $('#swiper-film-id span').removeClass('swiper-pagination-bullet-active');
                    $('#swiper-film-id span').eq(index).addClass('swiper-pagination-bullet-active');
                }, 1);
            },
            onTransitionEnd: function (filmbanner) {
                var index = filmbanner.activeIndex;
                $timeout(function () {
                    $('#swiper-film-id span').removeClass('swiper-pagination-bullet-active');
                    $('#swiper-film-id span').eq(index).addClass('swiper-pagination-bullet-active');
                }, 1);
            }
        });
    };
    $scope.swiperLoad();
    if ($sessionStorage.filmtype == 2) {
        $scope.filmswait();
        $scope.btnTab = false;
    } else {
        $scope.filmshot();
        $scope.btnTab = true;
    }


});