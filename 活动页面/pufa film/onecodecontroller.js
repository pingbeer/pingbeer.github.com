var onecodeeModules = angular.module("OneCodeModule", []);

//1元观影兑换
onecodeeModules.controller('OneCodeController', function ($scope, $state, $rootScope, $http, $cookieStore, $interval, $sessionStorage, PH) {
    $scope.noticeDialog = function () {
        if (!$scope.noticenum) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '该兑换码不存在或已失效';
            return;
        }
        PH.api('account/oneyuanactivationcode', {
            activationCode: $scope.noticenum
        }, function (ret) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '领取成功';

            if ($rootScope.orderType != 'PFWX' && $rootScope.platform == 2) {
                $sessionStorage.hasFreePrize = true;
            } else {
                $sessionStorage.hasFreePrize = false;
            }
        }, function (ret) {

        });
    };
});