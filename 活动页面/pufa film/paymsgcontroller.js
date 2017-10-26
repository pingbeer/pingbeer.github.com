var paymsg = angular.module("PayMsgModule", []);

//首页
paymsg.controller('PayMsgController', function ($scope, $sessionStorage, $rootScope, $interval, $stateParams, $state, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    $scope.cvv = '';
    $scope.applyorder = function () {
        PH.api('mall/applyorder', {
            'orderId': $sessionStorage.orderId
        }, function (ret) {
            $scope.hasFastPay = ret.data.hasFastPay;
            $scope.addresses = ret.data.addresses;
            $scope.mallGood = ret.data.mallGood;
            $scope.mallGoodExt = ret.data.mallGoodExt;
            $scope.order = ret.data.order;
            $scope.pronumber = $scope.order.count;
            $scope.point = ret.data.point;
            $scope.maxPoint = parseInt($scope.point / 1200);
            $scope.payAmound = ($scope.order.amount + $scope.order.expressFee) / 100;
            $scope.cardNo = ret.data.cardNo;
            $scope.lastPay();
        }, function (ret) {

        })
    };
    $scope.applyorder();
    $scope.payOrder = function () {
        if (!$scope.addresses) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '请填写收货地址';
            return;
        }
        PH.api('mall/buy', {
            'orderId': $scope.order.orderId,
            'cvv2': $scope.cvv,
            'verifyKey': $scope.verifyKey,
            'verifyCode': $scope.paycode,
            'count': $scope.order.count,
            'goodExtId': $scope.order.goodExtId,
            'remark': $scope.remark,
            'expressType': $scope.order.expressType,
            'expressFee': $scope.order.expressFee,
            'addressId': $scope.addresses.id ? $scope.addresses.id : '',
            'point': $scope.pointCount * 1200
        }, function (ret) {
            $state.go('paysuccess', {'id': $scope.order.orderId});
        }, function (ret) {
        });
    };
    //积分
    $scope.pointCount = 0;
    $scope.dessc = function () {
        if ($scope.pointCount > 0) {
            $scope.pointCount--;
            $scope.lastPay();
        }
    };
    $scope.addnum = function () {
        if ($scope.maxPoint <= 0) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '您的积分不足';
            return;
        }
        else if ($scope.pointCount >= $scope.maxPoint) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '您的积分不足';
            return;

        }
        else if ($scope.pointCount >= $scope.payAmound || $scope.pay < 1) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '不能继续抵扣';
            return;
        }
        $scope.pointCount++;
        $scope.lastPay();
    };
    //总金额
    $scope.lastPay = function () {
        $scope.pay = $scope.payAmound - $scope.pointCount
    };

    //获取验证码
    $scope.isBtn = true;
    $scope.code = 60;
    $scope.verifyKey = '';
    $scope.getcode = function () {
        PH.api('pay/verifycode', {
            type: 'pay'
        }, function (ret) {
            if (!ret.data) {
                return;
            }
            $scope.isBtn = false;
            $scope.paynode = ret.data;
            $scope.verifyKey = $scope.paynode.verifyKey;
            $interval(function () {
                $scope.code--;
                if ($scope.code == 0) {
                    $scope.isBtn = true;
                    $scope.code = 60;
                }
            }, 1000, 60);
        }, function (ret) {
            $scope.isBtn = true;
            $scope.code = 60;
        });
    };
    $scope.return = function () {
        if ($stateParams.type == 2) {
            $state.go('shoporder', {'type': 'shop'});
            return;
        }
        $state.go('shopproduct', {'id': $scope.order.goodId});
    };
});