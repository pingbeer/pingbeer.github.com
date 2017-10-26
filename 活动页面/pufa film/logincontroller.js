//登录
var indexmodule = angular.module('LoginModule', []);
indexmodule.controller('LoginController', function ($scope, $cookieStore, $state, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    if ($sessionStorage.card) {
        $scope.carId = $sessionStorage.card;
    }
//改
    $scope.login = function () {
        $sessionStorage.card = $scope.carId;
        if (!$scope.tel) {
            $scope.tis = '手机号输入不正确';
            return;
        }
        $scope.tis = '';

        $scope.relative();

    };

    $scope.next = function () {
        $sessionStorage.hasFreePrize = false;
        $sessionStorage.freePrizeCount = 0;
        $state.go('main', {reload: true});
    };

    $scope.relative = function () {
        PH.api('relative', {
            phone: $scope.tel,
            cardNo: $scope.carId,
            wechatId: PH.getPara('wechatId')
        }, function (ret) {
            $state.go('main', {reload: true});
        }, function (ret) {
            $scope.tis = ret.message;
        });
    }

});

//判断
var spdmodule = angular.module('SpdModule', []);
spdmodule.controller('spdController', function ($scope, $state, $sessionStorage, $rootScope, PH) {
    //是否开放
    $scope.open = function () {
            $scope.openfind = "";
            $sessionStorage.open = $scope.openfind;
             $state.go('find', {reload: true});
            // if (PH.getPara('wechatId')) {
            //     $state.go('login');
            // } else {
            //     if ($scope.openfind) {
            //         $state.go('find', {reload: true});
            //     }
            //     else {
            //         $state.go('main', {reload: true});
            //     }
            // }
        // PH.api('rob/accessstatus', {}, function (ret) {
        //     $scope.openfind = ret.data.open;
        //     $sessionStorage.open = $scope.openfind;
        //     if (PH.getPara('wechatId')) {
        //         $state.go('login');
        //     } else {
        //         if ($scope.openfind) {
        //             $state.go('find', {reload: true});
        //         }
        //         else {
        //             $state.go('main', {reload: true});
        //         }
        //     }
        //
        // }, function (ret) {
        // });
    };
    $scope.open();

});