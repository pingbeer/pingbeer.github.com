var tencode = angular.module("TenCodeModule", []);
//10元观影
tencode.controller('TenCodeController', function ($scope, $rootScope, PH) {

    $scope.noticeDialog = function () {
        if (!$scope.tencodenum) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '该活动ID不存在或已失效';
            return;
        }
        PH.api('account/tenyuanactivationcode', {
            activationCode: $scope.tencodenum
        }, function (ret) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '领取成功';
        }, function (ret) {

        });
    };
});
