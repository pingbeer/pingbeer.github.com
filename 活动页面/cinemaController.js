var ciname = angular.module('CinemaModule', []);
ciname.controller('cinemaController', function ($scope, $rootScope, $http, $state, $cookieStore,
                                                $timeout, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $rootScope.pagetype = 3;
    $sessionStorage.getDirection = 1;
    $scope.pname = $sessionStorage.cityName;
    $scope.formatAddress = $sessionStorage.formatAddress;
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 320 / 640;
    $('.bannerBackground').height((imgWidth - 10 * 2) / 3 * 600 / 410 + 45);
    $scope.ckedbtn = -1;//筛选
    $scope.cinemaShow = true;
    $scope.navArea = '';//区域
    $scope.hotrec = {
        width: '100%',
        height: imgHeight + 'px'
    };
    $scope.noBanner ={
        'margin-top':'0px'
    };
    $scope.load = function (order) {
        $rootScope.dialogIsHidden = false;
        PH.api('main/cinemaspage', {
            'cityId': $sessionStorage.cityId,
            'regionName': $scope.navArea,
            'orderType': order
        }, function (ret) {
            if (ret.data.cinemas.length > 0 || ret.data) {
                $scope.cinemalist = ret.data.cinemas;
                $scope.isCinema = true;
                $scope.noCinema = '';
            } else {
                $scope.isCinema = false;
                $scope.noCinema = '暂无影院';
            }
            $scope.regions = ret.data.regions;
        }, function (ret) {

        });
    };
    //影院详情
    $scope.getCinemaDetail = function (id) {
        $state.go('cinemadetail', {'id': id, 'type': 4}, {reload: true});
    };
    //热门推荐
    $scope.swiperLoad = function () {
        PH.api('content/banners', {}, function (ret) {
            if (ret.data.length == 0) {
                $scope.mainbanner = false;
                $scope.noBanner ={
                    'margin-top':'40px'
                };
                return;
            }
            $scope.swiperImg = ret.data;
            $scope.mainbanner = true;
        }, function (ret) {
        });
    };
    //图片渲染完后加载
    $scope.checkLastBanner = function () {
        $scope.getBanner();
    };
    //热门推荐图片轮播
    $scope.getBanner = function () {
        var  swiperbanner = new Swiper('.hot-rec', {
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
    //显示筛选页
    $scope.xuanimg = './images/shaixuan.png';
    $scope.xuanShow = function () {
        $scope.cinemaShow = !$scope.cinemaShow;
        if ($scope.cinemaShow) {
            $scope.xuanimg = './images/shaixuan.png';
        } else {
            $scope.xuanimg = './images/shaixuan-active.png';
        }
    };
    //筛选
    $scope.changeCount = function (index, name) {
        $scope.ckedbtn = index;
        $scope.navArea = name;
    };
    //确定选择
    $scope.getSearch = function () {
        $scope.load(1);
        $scope.cinemaShow = true;
        $scope.xuanimg = './images/shaixuan.png';
    };
    //重置选择
    $scope.getAll = function () {
        $scope.navArea = '';
        $scope.load(1);
        $scope.cinemaShow = true;
        $scope.xuanimg = './images/shaixuan.png';
    };
    $scope.load(1);
    $scope.swiperLoad();
});