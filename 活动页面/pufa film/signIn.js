var signInapp = angular.module('signInModule', []);
signInapp.controller('signInController', function ($scope, PH) {
    $scope.load = function (callback) {
        var callback = callback || function () {};
        var date = new Date();
        $scope.width = $(window).width();
        $scope.height = $scope.width / 750 * 416;
        $scope.headerimg = {
            height: $scope.height + 'px'
        };
        PH.api('sign/signindex',
            {},
            function (ret) {
                console.log(ret.data);
                if (ret.errorCode == 0) {
                    $scope.distanceDay = ret.data.distanceDay;
                    if(ret.data.distanceDay==0){
                        $scope.distanceDay = '好棒，敬请期待下个月的神秘大奖哦';
                    }else{
                        $scope.distanceDay = '还差'+ret.data.distanceDay+'天，就可以领到大礼包啦';
                    }
                    $scope.signModelList = ret.data.signModelList;
                    $scope.signDays = ret.data.signDays;

                    $scope.month = ret.data.month;
                    $scope.yearMonth = date.getFullYear() + '年' + $scope.month + '月';
                    $scope.signModel = ret.data.signModel;
                    $scope.sign = ret.data.signModel.sign;
                    console.log($scope.sign);
                    for (var i = 0; i < $scope.signModelList.length; i++) {
                        if ($scope.signModelList[i].special) {
                            $scope.signModelList[i].img = './images/register_gister.png';
                        } else if ($scope.signModelList[i].sign && !$scope.signModelList[i].special) {
                            $scope.signModelList[i].img = './images/register_can.png';
                        }
                        else {
                            $scope.signModelList[i].img = './images/register.png';
                        }
                    }
                    callback();
                }
            })
    };
    $scope.load();

    $scope.register = function () {
        if (!$scope.sign) {
            PH.api('sign/dosign',
                {},
                function (ret) {
                    $scope.sign = true;
                    $scope.callback = function () {

                        if($scope.signModelList[$scope.signDays-1].special){
                            $('.isRegister').fadeIn();
                            $scope.prizeName = '恭喜获得' + $scope.signModelList[$scope.signDays-1].prizeName;
                            $scope.day = $scope.signModelList[$scope.signDays-1].day;
                            $scope.prizeImg = './images/registerGift.png';
                            setTimeout(function () {
                                $(".isRegister").fadeOut();
                            }, 3000);
                        }
                    }
                    $scope.load($scope.callback);

                })
        }
    };

    $scope.showHistroy = function ($index) {
        $scope.ifSpecial = false;
        if ($scope.signModelList[$index].sign&&!$scope.signModelList[$index].special) {
            $('.isRegister').fadeIn();
            $scope.prizeName = '获得' + $scope.signModelList[$index].prizeName;
            $scope.day = $scope.signModelList[$index].day;
            $scope.prizeImg = './images/registerLucky.png';
            setTimeout(function () {
                $(".isRegister").fadeOut();
            }, 1500);
        } else if ($scope.signModelList[$index].special&&!$scope.signModelList[$index].sign) {
            $scope.ifSpecial = true;
            $('.isRegister').fadeIn();
            $scope.prizeName = '惊喜大礼包';
            $scope.openDay = $scope.signModelList[$index].openDay;
            $scope.prizeImg = './images/registerGift.png';
            setTimeout(function () {
                $(".isRegister").fadeOut();
            }, 1500);
        }
        else if ($scope.signModelList[$index].special && $scope.signModelList[$index].sign) {
            $('.isRegister').fadeIn();
            $scope.prizeName = '获得' + $scope.signModelList[$index].prizeName;
            $scope.day = $scope.signModelList[$index].day;
            $scope.prizeImg = './images/registerGift.png';
            setTimeout(function () {
                $(".isRegister").fadeOut();
            }, 1500);
        }
    };

});