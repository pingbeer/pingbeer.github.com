var findModules = angular.module("FindModule", []);

//发现
findModules.controller('findController', function ($scope, $state, $rootScope, $http, $cookieStore,
                                                   $interval, $sessionStorage, PH) {
    $scope.showRoot = $rootScope.orderType;
    $scope.open = function () {
        // PH.api('rob/accessstatus', {}, function (ret) {
        //     $sessionStorage.open = ret.data.open;
        //     $scope.activityOpen = ret.data.open;
        //     if (!$sessionStorage.encryptCardNo) {
        //         $sessionStorage.encryptCardNo = ret.data.cardNo;
        //     }
        // }, function (ret) {
        // });
         $sessionStorage.open ="";
            $scope.activityOpen = "";
            if (!$sessionStorage.encryptCardNo) {
                $sessionStorage.encryptCardNo = "";
            }
    };
    $scope.open();
    $rootScope.pagetype = 5;
    $sessionStorage.activity = 1;
    window.scrollTo(0, 0);//滚动到顶部
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 300 / 750;
    $scope.findimg = {
        'width': '100%',
        'height': imgHeight + 'px'
    };
    //判断是否定位
    $scope.curraddress = function () {
        PH.regetLocation(function () {
            PH.api('data/refreshlocation.josn', function (ret) {
                $sessionStorage.cityName = ret.data.name;
                $sessionStorage.cityId = ret.data.id;
                $scope.formatAddress = ret.data.formatAddress;
                $sessionStorage.formatAddress = $scope.formatAddress;
                $scope.pname = ret.data.name;
            });
            $sessionStorage.getDirection = 1;
            $sessionStorage.activity = 1;
        }, function (ret) {
            $sessionStorage.getDirection = 1;
            $sessionStorage.activity = 1;
            $rootScope.formatAddress = '';
            $sessionStorage.cityName = '上海';
            $sessionStorage.cityId = 2;
            $scope.pname = '上海';
            $scope.id = 2;
        });

    };
    if (!$sessionStorage.longitude) {
        $scope.curraddress();
    }

    //抽奖
    $scope.activityShow = function () {
        $state.go('activity', {'id': 3}, {reload: true});
    };

    //周边
    $scope.zhoucheck = function () {
        $rootScope.dialogIsHidden = false;
        PH.api('account/lixizhbi', {}, function (ret) {
            if (ret.data) {
                $rootScope.dialogIsHidden = false;
                var urlCharge;
                if ($rootScope.inType == 'JBZWX') {
                    urlCharge = 'https://movie-dev.shuabeiapp.com';
                } else {
                    urlCharge = 'https://movie.shuabeiapp.com';
                }
                window.location.href = urlCharge + '?newCardNo='
                    + encodeURIComponent(ret.data) + '&originalCardNo=' + encodeURIComponent(ret.data)
                    + '&inType=' + $rootScope.inType + '&XSessionId=' + $rootScope.XSessionId
                    + '&platform=' + $rootScope.platform;
            }
        }, function (ret) {
        });
    };


    //定位
    $scope.regetLocation = function (index) {
        $sessionStorage.lastcity = 0;
        PH.regetLocation(function () {
            PH.api('data/refreshlocation.josn', function (ret) {
                $scope.curraddr = {
                    pname: ret.data.currentCity.name,
                    id: ret.data.currentCity.id
                };
                $sessionStorage.cityName = ret.data.currentCity.name;
                $sessionStorage.cityId = ret.data.currentCity.id;
                $scope.formatAddress = ret.data.currentCity.formatAddress;
                $sessionStorage.formatAddress = $scope.formatAddress;
                $scope.pname = ret.data.currentCity.name;
                $scope.newsPage(index);
            });
        }, function (ret) {
            $rootScope.formatAddress = '';
            $sessionStorage.cityName = '上海';
            $sessionStorage.cityId = 2;
            $scope.pname = '上海';
            $scope.id = 2;
        });
    };

    //跳转
    $scope.newsPage = function (index) {
        $sessionStorage.filmIndex = 0;
        if (index == 1) {
            $state.go('main', {reload: true});
        }
        else if (index == 2) {
            $state.go('films', {reload: true});
        }
        else if (index == 3) {
            $state.go('ciname', {reload: true});
        }
        else if (index == 4) {
            $state.go('mine', {reload: true});
        }
        else if (index == 5) {
            $state.go('find', {reload: true});
        }
    };
});

