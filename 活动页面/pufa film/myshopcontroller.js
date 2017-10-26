var myshop = angular.module("myShopModule", []);

//首页
myshop.controller('myShopController', function ($scope, $rootScope, $state, $timeout, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $rootScope.pagetype = 0;
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 260 / 640;
    var mainimg = imgWidth * 0.4 * 0.8;
    var minimg = imgWidth * 0.6 * 0.4 * 0.8;
    $scope.swiperimg = {
        height: imgWidth * 0.28 + 'px'
    };
    $scope.mainimgH = {
        height: imgWidth * 0.4 * 0.8 + 'px'
    };
    $scope.imgH = {
        height: imgWidth * 0.6 * 0.4 * 0.66 + 'px'
    };
    $scope.hotrec = {
        width: '100%',
        height: imgHeight + 'px'
    };
    $scope.shopLoad = function () {
        PH.api('data/mall.json', {}, function (ret) {
            $scope.banners = ret.data.banners;
            $scope.hotCategories = ret.data.hotCategories;
            $scope.hotGoods = ret.data.hotGoods;
            $scope.subjectDatas = ret.data.subjectDatas;
        }, function (ret) {

        })
    };

    //图片渲染完后加载
    $scope.checkLastBanner = function () {
        $scope.getBanner();
        $rootScope.dialogIsHidden = true;
    };
    //轮播
    $scope.swipercontent = function () {
        var swiper = new Swiper('.swiper-containerimg', {
            slidesPerView: 4,
            spaceBetween: 10,
            grabCursor: true,
            initialSlide: 0
        });
    };
    //图片渲染完后加载
    $scope.checkLast = function ($last) {
        if ($last) {
            $scope.swipercontent();
        }
    };


    //热门推荐图片轮播
    var i = 0;
    $scope.getBanner = function () {
        i++;
        if (i > 1) {
            return;
        }
        var shopSwiperBanner = new Swiper('.shopHotBanner', {
            pagination: '.shopHotBanner-container-id',
            autoplay: 3000,
            autoplayDisableOnInteraction: false,
            paginationClickable: true,
            onInit: function (shopSwiperBanner) {
                var index = shopSwiperBanner.activeIndex;
                $timeout(function () {
                    $('.shopHotBanner-container-id span').removeClass('swiper-pagination-bullet-active');
                    $('.shopHotBanner-container-id span').eq(index).addClass('swiper-pagination-bullet-active');
                }, 1);
            },
            onTransitionEnd: function (shopSwiperBanner) {
                var index = shopSwiperBanner.activeIndex;
                $timeout(function () {
                    $('.shopHotBanner-container-id span').removeClass('swiper-pagination-bullet-active');
                    $('.shopHotBanner-container-id span').eq(index).addClass('swiper-pagination-bullet-active');
                }, 1);
            }
        });
    };
    $scope.shopLoad();
});