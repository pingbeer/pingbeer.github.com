var paysuccess = angular.module("PaySuccessModule", []);

//完成
paysuccess.controller('PaySuccessController', function ($scope, $stateParams, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 399 / 750;
    $scope.imgH = {
        'width': '100%',
        'height': imgHeight + 'px'
    };


    $scope.load = function () {
        PH.api('mall/buyresult', {
            'orderId': $stateParams.id
        }, function (ret) {
            $scope.addresses = ret.data.address;
            $scope.order = ret.data.order;

        }, function (ret) {

        })
    };
    $scope.load();
});