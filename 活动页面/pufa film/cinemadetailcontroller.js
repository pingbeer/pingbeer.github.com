var cinameDetail = angular.module('CinemaDetailModule', []);
cinameDetail.controller('cinemaDetailController', function ($scope, $rootScope, $http, $state, $stateParams,
                                                            $cookieStore, $timeout, $sessionStorage, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    var imgWidth = $(window).width();
    $('.hot-cinema-film').height((imgWidth - 10 * 3) / 3 * 600 / 410 + 50);
    $('.hot-cinema-swiper').height((imgWidth - 10 * 3) / 3 * 600 / 410);
    $('.bannerBackground').height((imgWidth - 10 * 3) / 3 * 600 / 410 + 20);

    $scope.splitType = $stateParams.type;
    if ($stateParams.type.split('-')[1]) {
        $scope.Paramstype = $stateParams.type.split('-')[0];
        if ($scope.Paramstype == 6) {
            $scope.ParamsName = 'collect';
            $scope.Paramsid = $stateParams.id;
        }
        else if ($scope.Paramstype == 7) {//改
            $scope.ParamsName = 'search';
            $scope.Paramsid = $stateParams.id;
            $scope.Paramstype = $stateParams.type;
        } else {
            $scope.Paramsid = $stateParams.id;
            $scope.Paramstype = $stateParams.type;
            $scope.splitid = $stateParams.type.split('-')[2];
            $scope.splitType = $stateParams.type.split('-')[0];
            $scope.ParamsName = 'filmsearch';
        }
    } else {
        if ($stateParams.type == 6) {
            $scope.ParamsName = 'collect';
            $scope.Paramsid = $stateParams.id;
            $scope.Paramstype = $stateParams.type;
        }
        else if($stateParams.type==4){
            $scope.Paramstype = $stateParams.type;
            $scope.ParamsName = 'cinema';
            $scope.Paramsid = $stateParams.id;
        }else{
            $scope.Paramstype = $stateParams.type;
            $scope.ParamsName = 'main';
            $scope.Paramsid = $stateParams.id;
        }

    }

    $scope.nomessage = true;
    $scope.load = function () {
        PH.api('data/filmview.json', {
            cinemaId: $stateParams.id
        }, function (ret) {
            if (ret.data.films.length == 0 || ret.data.films == null) {
                $scope.nomessage = false;
                return;
            }
            if (!ret.data.cinema) {
                $scope.isShow = false;
                return;
            }
            $scope.filmlist = ret.data.films;
            $scope.isCollected = ret.data.isCollected;
            $scope.cinema = ret.data.cinema;
            $scope.cinemaMobile = ret.data.cinemaMobile;
            $sessionStorage.currlongitude = $scope.cinema.longitude;
            $sessionStorage.currlatitude = $scope.cinema.latitude;
            $sessionStorage.curraddress = $scope.cinema.address;
            $sessionStorage.currtitle = $scope.cinema.name;
            for (var i = 0; i < $scope.filmlist.length; i++) {
                if ($scope.filmlist[i].id == $sessionStorage.filmIndex) {
                    $scope.swiperIndex = i;
                    return;
                }
            }
        }, function (ret) {
            $scope.nomessage = false;
        })
    };


    //影片轮播初使化
    var swiper2;
    var swiperInitSuccess = false;
    $scope.swipercontent = function () {
        var index = 0;
        swiper2 = new Swiper('.hot-cinema-swiper', {
            slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: 10,
            speed: 500,
            effect: 'coverflow',
            grabCursor: true,
            initialSlide: $scope.swiperIndex ? $scope.swiperIndex : 0,//初始化模块索引
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            },
            onInit: function (swiper2) {
                index = swiper2.activeIndex;

                $timeout(function () {
                    $scope.findfilm = $scope.filmlist[index];
                    $sessionStorage.filmIndex = $scope.findfilm.id;//轮播定位
                    $scope.bannerBackground = {
                        background: 'url("' + $scope.findfilm.smallImg + '")'
                    };
                    $scope.detail(index);
                }, 1)
            },
            onTransitionEnd: function (swiper2) {
                swiperInitSuccess = true;
                index = swiper2.activeIndex;
                if (swiperInitSuccess) {//防止swiper未初始化完成就触发此事件
                    $timeout(function () {
                        $scope.findfilm = $scope.filmlist[index];
                        $sessionStorage.filmIndex = $scope.findfilm.id;//轮播定位
                        $scope.bannerBackground = {
                            background: 'url("' + $scope.findfilm.smallImg + '")'
                        };
                        $scope.detail(index);
                    }, 1)
                }

            }
        });
    };
    //图片渲染完后加载
    $scope.checkLast = function () {
        $scope.swipercontent();
    };
    //当前影片的内容
    $scope.detail = function (index) {
        $scope.timez = [];
        $scope.film = $scope.filmlist[index];
        $sessionStorage.filmIndex = $scope.filmlist[index].id;
        $sessionStorage.filmName = $scope.filmlist[index].name;
        //时间
        $scope.currtime = '';
        $scope.timetemp($scope.film);
    };
    //当前影片的排片时间
    $scope.timetemp = function (film) {
        PH.api('data/foretelldates.json', {
            cinemaId: $stateParams.id,
            filmId: film.id
        }, function (ret) {

            $scope.currtime = ret.data;
            if (!$scope.currtime) {
                return;
            }

            for (var i = 0; i < $scope.currtime.length; i++) {
                if ($scope.currtime.length <= $scope.timez.length) {
                    return;
                }
                var date = $scope.currtime[i].substring(5);
                var curDate = moment();
                var str1 = curDate.format('MM-DD');
                var str2 = curDate.add(1, 'd').format('MM-DD');
                var str3 = curDate.add(1, 'd').format('MM-DD');
                if (date == str1) {
                    $scope.timez.push(date + "  今天");
                } else if (date == str2) {
                    $scope.timez.push(date + "  明天");
                } else if (date == str3) {
                    $scope.timez.push(date + "  后天");
                } else {
                    $scope.timez.push(date);
                }
            }
            $scope.filmday(film, 0);
        }, function (ret) {
        });
    };

    //初使化时间轮播
    var swipers1;
    $scope.dateswiper = function () {
        var swiperInitSuccess = false;
        swipers1 = new Swiper('.datetime', {
            slidesPerView: 3,
            spaceBetween: 10,
            grabCursor: false,
            updateFormElements: true,
            initialSlide: 0//初始化模块索引
        });
    };
    //时间轮播
    $scope.datelast = function () {
        $('.datetime .swiper-wrapper').css({'transform': 'translate3d(0px, 0px, 0px)'});
        $scope.dateswiper();
        $('.datetime ul li').eq(0).css({'color': '#ff9d09', 'border-bottom': '1px solid #ff9d09'});
    };
    //选择日期
    $scope.cinematimes = function (index) {
        $scope.filmday($scope.film, index);
    };
    //排片详情
    $scope.filmday = function (obj, index) {
        $scope.isShow = false;
        $('.datetime ul li').css({'color': '#000', 'border-bottom': '1px solid #fff'});
        $('.datetime ul li').eq(index).css({'color': '#ff9d09', 'border-bottom': '1px solid #ff9d09'});
        $sessionStorage.jbzFilmId = obj.id;
        PH.api('data/filmviewitems.json', {
            cinemaId: $stateParams.id,
            filmId: obj.id,
            duration: parseInt(obj.duration),
            date: $scope.currtime[index],
            cityId: $sessionStorage.cityId,
            platform: $rootScope.platform
        }, function (ret) {
            if (!ret.data || ret.data.length == 0) {
                $scope.isShow = true;
            } else {
                $scope.isShow = false;
            }
            $scope.filmprice = ret.data;
            for (var i = 0; i < $scope.filmprice.length; i++) {
                $scope.filmprice[i].isMore = true;
                for (var j = 0; j < $scope.filmprice[i].data.length; j++) {

                    if ($scope.filmprice[i].data.length) {
                        if ($scope.filmprice[i].data[j].type == 'wangpiao') {
                            $scope.filmprice[i].data[j].typename = '网票网';
                            $scope.filmprice[i].data[j].oprice = $scope.filmprice[i].data[j].vPrice;
                        }
                        else if ($scope.filmprice[i].data[j].type == 'maizuo') {
                            $scope.filmprice[i].data[j].typename = '卖座网';
                            $scope.filmprice[i].data[j].oprice = $scope.filmprice[i].data[j].price;
                        }
                        else if ($scope.filmprice[i].data[j].type == 'spider') {
                            $scope.filmprice[i].data[j].typename = '蜘蛛网';
                            $scope.filmprice[i].data[j].oprice = $scope.filmprice[i].data[j].userPrice;
                        }
                        else if ($scope.filmprice[i].data[j].type == 'danche') {
                            $scope.filmprice[i].data[j].typename = '单车网';
                            $scope.filmprice[i].data[j].oprice = $scope.filmprice[i].data[j].salePrice;
                        }
                        else if ($scope.filmprice[i].data[j].type == 'maoyan') {
                            $scope.filmprice[i].data[j].typename = '猫眼';
                            $scope.filmprice[i].data[j].oprice = $scope.filmprice[i].data[j].orderPrice;
                        }
                        else if ($scope.filmprice[i].data[j].type == 'dazhong') {
                            $scope.filmprice[i].data[j].typename = '大众点评';
                            $scope.filmprice[i].data[j].oprice = $scope.filmprice[i].data[j].orderPrice;
                        }
                        else if ($scope.filmprice[i].data[j].type == 'meituan') {
                            $scope.filmprice[i].data[j].typename = '美团';
                            $scope.filmprice[i].data[j].oprice = $scope.filmprice[i].data[j].orderPrice;
                        }
                        else if ($scope.filmprice[i].data[j].type == 'baidu') {
                            $scope.filmprice[i].data[j].typename = '百度糯米';
                            $scope.filmprice[i].data[j].oprice = $scope.filmprice[i].data[j].orderPrice;
                        }
                    }
                }
            }

        }, function (ret) {
            $scope.isShow = true;
        });
    };
    //影院价格对比
    $scope.checkShow = function (index) {
        if (!$scope.filmprice[index].isMore) {
            for (var i = 0; i < $scope.filmprice.length; i++) {
                $scope.filmprice[i].isMore = true;
            }
        }
        else {
            for (var i = 0; i < $scope.filmprice.length; i++) {
                $scope.filmprice[i].isMore = true;
            }
            $scope.filmprice[index].isMore = false;
            var t = $(window).scrollTop();
            $('body,html').animate({'scrollTop': t + 150}, 100);
        }
    };
    //收藏
    $scope.collected = function (id, name) {

        PH.api('account/collectcinema', {
            cinemaId: id,
            cinemaName: name
        }, function (ret) {
            $scope.isCollected = true;
            $rootScope.errorHidden = false;
            $rootScope.naomi = '收藏成功';
        }, function (ret) {
        });
    };
    //取消收藏
    $scope.uncollecimg = function (id) {

        PH.api('account/cancelcollectcinema', {
            cinemaId: id
        }, function (ret) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '取消成功';
            $scope.isCollected = false;
        }, function (ret) {
        });
    };
    //影片详情
    $scope.getfilmDetail = function (id) {
        $sessionStorage.filmIndex = id;

        $state.go('filmdetail', {
            'id': id,
            'type': $scope.Paramsid + "-" + $scope.splitType
        });
    };
    //获取影院坐位
    $scope.cinemaseats = function (obj, index) {
        $sessionStorage.timeShow = 1;
        $sessionStorage.cinameName = $scope.cinema.name;
        $sessionStorage.showDate = obj.showDate;
        $sessionStorage.showTime = obj.showTime;
        $sessionStorage.filmtype = obj.language + obj.dimensional;
        $sessionStorage.jbzPrice = obj.jbzPrice;
        $sessionStorage.cinametype = obj.type;
        $sessionStorage.cinemaId = obj.cinemaId;
        $sessionStorage.hallNum = obj.hallName;
        $sessionStorage.addDc = obj.addDc;
        if(obj.hasDiscount){
            $sessionStorage.byorders = true;
        }
        else{
            $sessionStorage.byorders = false;
        }
        if ($sessionStorage.cinametype == 'wangpiao') {
            $sessionStorage.showIndex = obj.showIndex;
            $sessionStorage.sprice = obj.vPrice;
        }
        else if ($sessionStorage.cinametype == 'maizuo') {
            $sessionStorage.showIndex = obj.foretellId;
            $sessionStorage.sprice = obj.price;
        }
        else if ($sessionStorage.cinametype == 'spider') {
            $sessionStorage.filmName = obj.filmName;
            $sessionStorage.showIndex = obj.showId;
            $sessionStorage.showHall = obj.hallId;
            $sessionStorage.filmid = obj.filmId;
            $sessionStorage.userPrice = obj.userPrice;
            $sessionStorage.feePrice = obj.feePrice;
            $sessionStorage.merPrice = obj.merPrice;
        }
        else if ($sessionStorage.cinametype == 'danche') {
            $sessionStorage.showIndex = obj.id;
            $sessionStorage.dimensional = obj.playType;
            $sessionStorage.userPrice = obj.salePrice;
        }
        else if ($sessionStorage.cinametype == 'baidu') {
            $sessionStorage.showIndex = obj.seqid;
        }
        else if ($sessionStorage.cinametype == 'maoyan' || $sessionStorage.cinametype == 'meituan' ||
            $sessionStorage.cinametype == 'dazhong') {

            $sessionStorage.showIndex = obj.showId;
            $state.go('maoyanseat', {
                'id': $stateParams.id,
                'type': $scope.Paramstype
            }, {reload: true});
            return;
        }
        $state.go('seat', {'id': $stateParams.id, 'type': $scope.Paramstype}, {reload: true});

    };
    $scope.load();
});