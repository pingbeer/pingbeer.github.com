var mineModules = angular.module("MineModule", []);

//个人中心首页
mineModules.controller('mineController', function ($scope, $state, $rootScope, $http, $cookieStore,
                                                   $interval, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $rootScope.pagetype = 4;
    $scope.encryptCardNo = $sessionStorage.encryptCardNo;

    //微信二维码
    //解约快捷支付
    $scope.signshow = function () {
        $('.telModel').show();
    };
    $scope.showwx = function () {
        $('.imgModel').show();
    };
    $scope.Dialog = function () {
        $scope.closeDialog();
        PH.api('pay/bfunsignfast', {
            cvv2: ''
        }, function (ret) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '解约成功';
        }, function (ret) {
        });
    };
    //关闭
    $scope.closeDialog = function () {
        $('.telModel').hide();
        $('.imgModel').hide();
    }

});

//常见问题
var question = angular.module('QuestionModule', []);
question.controller('questionController', function ($scope, $rootScope, $http, $cookieStore) {
    window.scrollTo(0, 0);//滚动到顶部
});


