var curTicketcode = angular.module("CurTicketModule", []);
//通用观影
curTicketcode.controller('CurTicketController', function ($scope, $rootScope, PH) {

    $scope.noticeDialog = function () {
        if (!$scope.codenum) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '该活动ID不存在或已失效';
            return;
        }
        PH.api('account/commonactivationcode', {
            activationCode: $scope.codenum
        }, function (ret) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '领取成功';
        }, function (ret) {

        });
    };
});
