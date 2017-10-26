var recharge = angular.module("rechargeOrderModule", []);
//充值订单
recharge.controller('rechargeOrderController', function ($scope, $rootScope, $sessionStorage, $http, $state, $stateParams, PH) {
    window.scrollTo(0, 0);//滚动到顶部

    if ($sessionStorage.rechargShowType == 1) {
        $scope.ckedcode = true;
    } else {
        $scope.ckedcode = false;
    }
    $scope.type = 1;
    $scope.Paramstype = $stateParams.type;
    var urlCharge;
    if ($rootScope.inType == 'JBZWX') {
        urlCharge = 'https://jbz-dev.idoupiao.com/superrecharge2.0/chargeinfo/';
    } else {
        urlCharge = 'https://charge.idoupiao.com/chargeserver/chargeinfo/';
    }
    $scope.load = function () {
        PH.api('account/xiaopucharge', {}, function (ret) {
            if (ret.data) {
                $rootScope.dialogIsHidden = false;
                $scope.getOrder(ret.data.newOpenId, ret.data.newCardNo);
            }
        }, function (ret) {
        });
    };
    $scope.getOrder = function (openid, cardno) {
        $http({
            url: urlCharge + 'orderslist',
            method: 'POST',
            params: {
                'openId': openid,
                'cardNo': cardno,
                'XSessionId': $rootScope.XSessionId
            }
        }).success(function (ret) {
            if (ret.errorCode > 0) {
                $rootScope.errorHidden = false;
                $rootScope.dialogIsHidden = true;
                $rootScope.naomi = ret.message;
                return;
            }
            if (ret.data) {
                $rootScope.dialogIsHidden = true;
                $scope.successOrders = ret.data.successOrders;
                $scope.failOrders = ret.data.failOrders;
                $scope.orderList = $scope.successOrders;
                $scope.ordertype($sessionStorage.rechargShowType ? $sessionStorage.rechargShowType : 1);
            }
        });
    };

    $scope.ordertype = function (type) {
        $scope.type = type;
        $sessionStorage.rechargShowType = type;
        if (type == 1) {
            $scope.ckedcode = true;
            $scope.orderList = $scope.successOrders;
        } else if (type == 2) {
            $scope.ckedcode = false;
            $scope.orderList = $scope.failOrders;
        }
    };
    $scope.load();
    //返回
    $scope.orderReturn = function () {
        $sessionStorage.rechargShowType = 1;
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
    $scope.changeShowValue = function () {
        $sessionStorage.rechargShowType = 1;
    };
});

var rechargeDetail = angular.module("rechargeDetailModule", []);
//充值订单
rechargeDetail.controller('rechargeDetailController', function ($scope, $rootScope, $stateParams, $http, PH) {
    $scope.Paramstype = $stateParams.change;
    var urlCharge;
    if ($rootScope.inType == 'JBZWX') {
        urlCharge = 'https://jbz-dev.idoupiao.com/superrecharge2.0/chargeinfo/';
    } else {
        urlCharge = 'https://charge.idoupiao.com/chargeserver/chargeinfo/';
    }
    $scope.load = function () {
        PH.api('account/xiaopucharge', {}, function (ret) {
            if (ret.data) {
                $rootScope.dialogIsHidden = false;
                $scope.orderDetail(ret.data.newOpenId, ret.data.newCardNo);
            }
        }, function (ret) {
        });
    };

    $scope.orderDetail = function (openid, cardno) {
        $http({
            url: urlCharge + 'orderdetail',
            method: 'POST',
            params: {
                'openId': openid,
                'cardNo': cardno,
                'orderId': $stateParams.id
            }
        }).success(function (ret) {
            if (ret.errorCode > 0) {
                $rootScope.errorHidden = false;
                $rootScope.dialogIsHidden = true;
                $rootScope.naomi = ret.message;
                return;
            }
            if (ret.data) {
                $rootScope.dialogIsHidden = true;
                $scope.order = ret.data.order;
                $scope.passInfo = ret.data.passInfo;
            }

        });
    };
    $scope.load();
});