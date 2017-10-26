//订单成功
var ordermodule = angular.module('OrderSuccessModule', []);
ordermodule.controller('OrderController', function ($http, $scope, $cookieStore, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    $scope.success = function () {
        PH.api('data/buyresult.json', {
            orderId: $sessionStorage.orderid
        }, function (ret) {
            $scope.orders = ret.data.order;
            $scope.seats = JSON.parse($scope.orders.seats);
            if ($scope.orders.type == 'wangpiao') {
                $scope.orders.typeName = '网票网';
            }
            else if ($scope.orders.type == 'maizuo') {
                $scope.orders.typeName = '卖座网';
            }
            else if ($scope.orders.type == 'spider') {
                $scope.orders.typeName = '蜘蛛网';
            }
            else if ($scope.orders.type == 'danche') {
                $scope.orders.typeName = '单车网';
            }
            else if ($scope.orders.type == 'maoyan') {
                $scope.orders.typeName = '猫眼';
            }
            else if ($scope.orders.type == 'dazhong') {
                $scope.orders.typeName = '大众';
            }
            else if ($scope.orders.type == 'meituan') {
                $scope.orders.typeName = '美团';
            }
            else if ($scope.orders.type == 'baidu') {
                $scope.orders.typeName = '百度糯米';
            }
        });
    };
    $scope.success();
});

//订单成功
var orderdetail = angular.module('OrderDetailModule', []);
orderdetail.controller('OrderDetailController', function ($http, $scope, $state, $cookieStore,
                                                          $stateParams, $sessionStorage, $rootScope, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $scope.msgShow = true;
    $scope.Paramstype = $stateParams.change;
    $scope.status = $stateParams.type;
    $scope.success = function () {
        PH.api('main/buyresult', {
            orderId: $stateParams.id
        }, function (ret) {
            $scope.orders = ret.data.order;
            $scope.seats = JSON.parse($scope.orders.seats);
            if ($scope.orders.type == 'wangpiao') {
                $scope.orders.typeName = '网票网';
                $scope.orders.typetel = '4009209553';
            }
            else if ($scope.orders.type == 'maizuo') {
                $scope.orders.typeName = '卖座网';
                $scope.orders.typetel = '4009209553';
            }
            else if ($scope.orders.type == 'spider') {
                $scope.orders.typeName = '蜘蛛网';
                $scope.orders.typetel = '4009209553';
            }
            else if ($scope.orders.type == 'danche') {
                $scope.orders.typeName = '单车网';
                $scope.orders.typetel = '4009209553';
            }
            else if ($scope.orders.type == 'maoyan') {
                $scope.orders.typeName = '猫眼';
                $scope.orders.typetel = '4009209553';
            }
            else if ($scope.orders.type == 'dazhong') {
                $scope.orders.typeName = '大众';
                $scope.orders.typetel = '4009209553';
            }
            else if ($scope.orders.type == 'meituan') {
                $scope.orders.typeName = '美团';
                $scope.orders.typetel = '4009209553';
            }
            else if ($scope.orders.type == 'baidu') {
                $scope.orders.typeName = '百度糯米';
                $scope.orders.typetel = '4009209553';
            }
        });
    };
    $scope.success();
    if ($scope.status == 1) {
        $scope.typeName = '支付成功';
    }
    else if ($scope.status == 2) {
        $scope.typeName = '未支付';
    }
    else if ($scope.status == 3) {
        $scope.typeName = '支付失败';
    }
    else if ($scope.status == 4) {
        $scope.typeName = '订单关闭';
    }
    else if ($scope.status == 5 || $scope.status == 6 || $scope.status == 7) {
        $scope.typeName = '出票中';
    }
    //查看订单
    $scope.orderId = function () {
        $scope.msgShow = false;
        $('.msgModel').show();
        $scope.customerInfo = $scope.orders.smsMessage;
    };
    $scope.close = function () {
        $scope.msgShow = true;
        $('.msgModel').hide();
    };

    //取消订单第一步
    $scope.unlockSeat = function (type, orderid) {
        PH.api('main/unlockSeat', {
            'type': type,// 平台类型（spider、wangpiao、danche、maizuo等）
            'orderId': orderid//  订单号
        }, function (ret) {
            $scope.unlockSeat2(orderid);
        }, function (ret) {

        });

    };

    //取消订单第二步
    $scope.unlockSeat2 = function (orderid) {
        PH.api('account/cancelorder', {
            'orderId': orderid//  订单号
        }, function (ret) {
            $state.go('allorder');
        }, function (ret) {

        });
    };
});