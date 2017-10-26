var filmdetail = angular.module('FilmDetailModule', []);
filmdetail.controller('filmDetailController', function ($scope, $rootScope, $http, $state, $stateParams,
                                                        $cookieStore, $sessionStorage, PH, $interval,$sce) {
    var imgWidth = $(window).width();
    var bgimgHeight = imgWidth * 360 / 750;
    $scope.Paramsid = $stateParams.id;
    $scope.Paramstype = $stateParams.type;
    $scope.isVideo = false;
    $scope.videoShow = true;
    if ($stateParams.type.split('-')[1]) {
        $scope.Paramstype = $stateParams.type.split('-')[0];
        if ($scope.Paramstype == 7) {
            $scope.ParamsName = 'search';
            $scope.Paramsid = $stateParams.id;
            $scope.Paramstype = $stateParams.type.split('-')[1];
        } else {
            $scope.Paramstype = $stateParams.type.split('-')[1];
            $scope.Paramsid = $stateParams.type.split('-')[0];
            $scope.ParamsName = 'cinemadetail';
        }
    } else {
        $scope.Paramsid = $stateParams.id;
        $scope.Paramstype = $stateParams.type;
        $scope.ParamsName = '';
    }
    $scope.bgfilm = {
        'width': imgWidth + 'px',
        'height': bgimgHeight + 'px',
        'background-image': 'url(./images/bgfilm.jpg)'
    };
    $scope.minimg = {
        'width': imgWidth * 0.23 + 'px',
        'height': bgimgHeight - 45 + 'px',
        'margin-right1': '10px'
    };
    $scope.videontype = {
        'height': bgimgHeight + 43 + 'px',
    };
    $scope.limeiShow = false;
    if ($stateParams.id == 'b81b0430338c43c1ac40a6f0ee719b0f') {
        $scope.limeiShow = true;
    }
    $scope.load = function () {
        PH.api('data/film.json', {
            id: $stateParams.id
        }, function (ret) {
            $scope.leftimg = ret.data.film.bigImg;
            $scope.filmsg = ret.data.film;
            $scope.dimensional = ret.data.film.dimensional.split('|');

            if (ret.data.video) {
                $scope.isVideo = true;
                $scope.video = ret.data.video;
            }
            if (!ret.data.hotComments || ret.data.hotComments.length == 0) {
                $scope.Comments = false; //是否显示评论
                $scope.commentsNum = 0;

            } else {
                $scope.Comments = true;
                $scope.hotComments = ret.data.hotComments;
                $scope.commentsNum = ret.data.hotComments.length;
            }

            //放映
            if ($scope.filmsg.photos) {
                if ($scope.filmsg.photos.split(",").length > 0) {
                    $scope.filmsg.photo = $scope.filmsg.photos.split(",")
                } else {
                    $scope.filmsg.photo = $scope.filmsg.photos;
                }

                $scope.pageImgNum = $scope.filmsg.photo.length;
            } else {
                if (ret.data.film.smallImg.split(",").length > 0) {
                    $scope.filmsg.photo = $scope.filmsg.smallImg.split(",")
                } else {
                    $scope.filmsg.photo = $scope.filmsg.smallImg;
                }

                $scope.pageImgNum = $scope.filmsg.photo.length;
            }
        }, function (ret) {

        });
    };
    // 显示视频
    $scope.getVideo = function () {

        $scope.videoShow = !$scope.videoShow;
        $scope.videoMp = $sce.trustAsResourceUrl($scope.video);
    };
    //轮播
    $scope.curindex = 1;
    $scope.swipercontent = function () {
        var swipers = new Swiper('.swiper-small', {
            slidesPerView: 3,
            spaceBetween: 10,
            grabCursor: true,
            initialSlide: 0,
            onClick: function (swipers) {
                $scope.curindex = 1 + swipers.clickedIndex;
                $scope.swiperBigImg($scope.curindex-1);
                $('.imgModel').show();
            }
        });
    };
    $scope.swiperBigImg = function (index) {
        var swiper = new Swiper('.swiper-big', {
            observer: true,
            observeParents: true,
            initialSlide: index,
            onSlideChangeEnd: function (swiper) {
                $interval(function () {
                    $scope.curindex = 1 + swiper.activeIndex;
                },1,1);

            }
        });
    };
    //图片渲染完后加载
    $scope.checkLast = function ($last) {
        if ($last) {
            $scope.swipercontent();
        }
    };
    $scope.checkLast1 = function ($last) {
        if ($last) {
            $scope.swiperBigImg($scope.curindex-1);
        }
    };
    $scope.close = function () {
        window.scrollTo(0, 0);//滚动到顶部
        $('.imgModel').hide();
    };
    //影片的所有影院
    $scope.getAllCinema = function (id) {
        $state.go('filmsearch', {'id': id, 'type': $scope.Paramstype});
    };
    //显示更多剧情
    $scope.imgup = './images/down.png';
    $scope.Showmore = true;
    $scope.changeShow = function () {
        $scope.Showmore = !$scope.Showmore;//
        if ($scope.Showmore) {
            $scope.imgup = './images/down.png';
        } else {
            $scope.imgup = './images/up.png';
        }
    };
    $scope.load();
});
