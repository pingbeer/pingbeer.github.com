//我的订单
var myOrder = angular.module('MyOrderModule', []);
myOrder.controller('MyOrderController', function ($scope, $rootScope, $cookieStore, $http, $interval,
                                                  $state, $sessionStorage, $stateParams, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    if ($sessionStorage.filmShowType == 2) {
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
        $sessionStorage.filmShowType = index;
        if ($scope.type == 1) {
            type = 'normal';
        } else {
            type = 'failed';
        }
        morepage++;
        PH.api('data/userfilmorders.json', {
            lastKey: morepage,
            type: type
        }, function (ret) {
            if (ret.data.orders.length == 0) {
                $scope.orderCount = ret.data.orders.length;
                $scope.orderlist = '';
                return;
            }
            if (morepage > 1) {
                $scope.order = $scope.order.concat(ret.data.orders);
            } else {
                $scope.order = '';
                $scope.order = ret.data.orders;
            }
            $scope.orderCount = ret.data.orders.length;
            $scope.tab();
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
    $scope.tab = function () {

        if (!$scope.order || $scope.order.length == 0 || $scope.order == null) {
            $scope.orderlist = [];
            return;
        }
        for (var s = 0; s < $scope.order.length; s++) {
            if ($scope.order[s].status == 1) {
                $scope.order[s].typeName = '支付成功';
            }
            else if ($scope.order[s].status == 2) {
                $scope.order[s].typeName = '未支付';
            }
            else if ($scope.order[s].status == 3) {
                $scope.order[s].typeName = '支付失败';
            }
            else if ($scope.order[s].status == 4) {
                $scope.order[s].typeName = '订单关闭';
            }
            else if ($scope.order[s].status == 5 || $scope.order[s].status == 6 || $scope.order[s].status == 7) {
                $scope.order[s].typeName = '出票中';
            }
        }
        $scope.orderlist = $scope.order;
    };

    $scope.orderDetail = function (id, type) {
        $state.go('orderdetail', {'id': id, 'type': type, 'change': $stateParams.type});
    };

    //继续支付
    $scope.getOrder = function (index) {
        $sessionStorage.cinametype = $scope.orderlist[index].type;
        $sessionStorage.orderid = $scope.orderlist[index].orderId;
        $sessionStorage.mobile = $scope.orderlist[index].mobile;
        $sessionStorage.seatCount = $scope.orderlist[index].count;
        $sessionStorage.filmName = $scope.orderlist[index].filmName;
        $sessionStorage.showDate = $scope.orderlist[index].showDate;
        $sessionStorage.showTime = $scope.orderlist[index].showTime;
        $scope.applyInfo = JSON.parse($scope.orderlist[index].applyInfo);
        $sessionStorage.showIndex = $scope.applyInfo.showIndex;
        $sessionStorage.cinemaId = $scope.applyInfo.cinemaId;
        $sessionStorage.jbzCinemaId = $scope.applyInfo.jbzCinemaId;
        $sessionStorage.jbzFilmId = $scope.applyInfo.jbzFilmId;
        console.log($scope.applyInfo.isLoweastForetell);
        if ($scope.applyInfo.isLoweastForetell) {
            $sessionStorage.byorders = true;
        }
        else {
            $sessionStorage.byorders = false;
        }
        console.log($sessionStorage.byorders);
        $sessionStorage.lastcity = 1;
        if ($scope.orderlist[index].type == "wangpiao") {
            $sessionStorage.sprice = $scope.applyInfo.vPrice;
            $sessionStorage.jbzPrice = $scope.applyInfo.jbzPrice;
            /*$sessionStorage.jbzCinemaId = $scope.applyInfo.jbzCinemaId;
             $sessionStorage.jbzFilmId = $scope.applyInfo.jbzFilmId;*/
        }
        else if ($scope.orderlist[index].type == "maizuo") {
            $sessionStorage.price = $scope.applyInfo.price;
        }
        else if ($scope.orderlist[index].type == "spider") {
            $sessionStorage.showHall = $scope.applyInfo.showId;
        }
        else if ($scope.orderlist[index].type == "maoyan" || $sessionStorage.cinametype == 'dazhong' ||
            $sessionStorage.cinametype == 'meituan') {
            $sessionStorage.showIndex = $scope.applyInfo.showId;
        }
        $state.go('seatorder', {
            'id': $scope.applyInfo.jbzCinemaId,
            'type': 6,
            'change': $stateParams.type
        }, {reload: true});
    };

    //查看取票码
    $scope.getCodenum = function (index) {
        $rootScope.errorHidden = false;
        $rootScope.naomi = $scope.orderlist[index].smsMessage;
    };

    $scope.load($sessionStorage.filmShowType ? $sessionStorage.filmShowType : 1);
    //返回
    $scope.orderReturn = function () {
        $sessionStorage.filmShowType = 1;
        if ($stateParams.type == 'supercharge') {
            $rootScope.rootPaycheck(1);
        }
        else if ($stateParams.type == 'shop') {
            $state.go('shopproduct', {'id': ''});
        }
        else {
            $state.go('mine');
        }
    }
    $scope.changeShowValue = function () {
        $sessionStorage.filmShowType = 1;
    };
});


