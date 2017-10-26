var mineModules = angular.module("GuessModule", []);

//个人中心首页
mineModules.controller('GuessController', function ($scope, $state, $rootScope, $http, $cookieStore,
                                                    $interval, $sessionStorage, PH) {
    //绑定幸运码
    $scope.noticeDialog = function () {
        if (!$scope.noticenum) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '该活动ID不存在或已失效';
            return;
        }
        PH.api('account/activationcode', {
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
