var shopOrder = angular.module("shopOrderModule", []);

//商城订单
shopOrder.controller('shopOrderController', function ($scope, $rootScope, $state, $stateParams, $sessionStorage, $timeout, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    if ($sessionStorage.ordersShowType == 2) {
        $scope.ckedcode = false;
    } else {
        $scope.ckedcode = true;
    }
    $scope.infinite_isCmp = false;
    $scope.Paramstype = $stateParams.type;
    var isBottom = false;
    $scope.type = 1;
    var morepage = 0;
    $scope.ordertype = function (ordertype) {
        if ($scope.type == ordertype) {
            return;
        }
        morepage = 0;
        $scope.ckedcode = !$scope.ckedcode;
        if ($scope.ckedcode == true) {
            $scope.load(1);
        } else {
            $scope.load(2);
        }
    };
    var type = '';
    $scope.load = function (index) {
        $scope.type = index;
        $sessionStorage.ordersShowType = index;
        if ($scope.type == 1) {
            type = 'normal';
        } else {
            type = 'failed';
        }
        morepage++;
        PH.api('account/usermallorders', {
            lastKey: morepage,
            type: type
        }, function (ret) {
            if (ret.data.orders.length == 0) {
                $scope.orderCount = ret.data.orders.length;
                $scope.orderlist = '';
                return;
            }
            if (morepage > 1) {
                $scope.orderlist = $scope.orderlist.concat(ret.data.orders);
            } else {

                $scope.orderlist = ret.data.orders;
            }
            $scope.orderCount = ret.data.orders.length;
        }, function (ret) {

        });
    };
    var time1 = '';
    $scope.myPagingFunction = function () {
        if (time1) {
            var time2 = new Date().getTime();
            if (time2 - time1 < 300) {
                time1 = time2;
                return;
            } else {
                time1 = time2;
            }
        } else {
            time1 = new Date().getTime();
        }
        if ($scope.orderCount == 10) {
            $scope.load($scope.type);
        }
    };
    //订单类型
    $scope.load($sessionStorage.ordersShowType ? $sessionStorage.ordersShowType : 1);

    //订单详情
    $scope.orderDetail = function (orderid) {
        $state.go('shoporderdetail', {'id': orderid, 'change': $stateParams.type});
    };
    $scope.changeShowValue = function () {
        $sessionStorage.ordersShowType = 1;
    };
    //返回
    $scope.orderReturn = function () {
        $sessionStorage.ordersShowType = 1;
        if ($stateParams.type == 'supercharge') {
            $rootScope.rootPaycheck(1);
        }
        else if ($stateParams.type == 'shop') {
            $state.go('shopproduct', {'id': ''});
        }
        else {
            $state.go('mine');
        }
    };
    //继续支付
    $scope.shopPay = function (index) {
        $sessionStorage.orderId = $scope.orderlist[index].orderId;
        $state.go('paymsg', {'type': 2});
    }
});
//商城订单详情
var shopOrderDetail = angular.module("shopOrderDetailModule", []);
shopOrderDetail.controller('shopOrderDetailController', function ($scope, $sessionStorage, $rootScope, $state, $stateParams, PH) {
    $scope.Paramstype = $stateParams.change;
    $scope.load = function () {
        PH.api('mall/buyresult', {
            'orderId': $stateParams.id
        }, function (ret) {
            $scope.order = ret.data.order;
            $scope.address = ret.data.address;
            $scope.good = ret.data.good;
            $scope.goodExt = ret.data.goodExt;
        }, function () {

        });
    };
    $scope.load();
    $scope.actionDetele = function () {
        PH.api('mall/cancelorder', {
            'orderId': $stateParams.id
        }, function (ret) {
            $state.go('shoporder', {'type': 'shop'});
        }, function () {

        });
    };
    $scope.shopPay = function () {
        $sessionStorage.orderId = $scope.order.orderId;
        $state.go('paymsg', {'type': 2});
    }
});

//商城订单物流
var Logistics = angular.module("LogisticsModule", []);
Logistics.controller('LogisticsController', function ($scope, $rootScope, $state, $stateParams, PH) {
    $scope.Paramstype = $stateParams.change;
    $scope.isShow = false;
    $scope.load = function () {
        PH.api('express/realtimeinfo', {
            'orderId': $stateParams.id
        }, function (ret) {
            if (ret.data.expressInfo.State) {
                $scope.expressInfo = ret.data.expressInfo;
                $scope.logistics = $scope.expressInfo.Traces;
                $scope.picUrl = ret.data.picUrl;
                $scope.length = $scope.logistics.length - 1;
                $scope.expressName = ret.data.expressName;
                $scope.mobile = ret.data.mobile;
            } else {
                $scope.message = ret.data.expressInfo.message;
                $scope.isShow = true;
            }
        }, function (ret) {

        })
    };
    $scope.load();
});