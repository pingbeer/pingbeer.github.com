var product = angular.module('ProcuctModdule', []);
product.controller('ProcuctController', function ($scope, $sessionStorage, $stateParams, $rootScope, $state, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    if ($stateParams.id) {
        $sessionStorage.Paramsid = $stateParams.id;
    }

    $scope.shopLoad = function () {
        PH.api('mall/gooddetail', {
            'goodId': $sessionStorage.Paramsid
        }, function (ret) {
            $scope.goods = ret.data.good;
            $scope.collected = ret.data.collected;
            $scope.goodExt = ret.data.goodExt;
            $scope.imgList = $scope.goods.imgList.split(',');
        }, function (ret) {

        });
    };
    $scope.checkDetail = function () {
        $scope.lastimg();
    };
    $scope.lastimg = function () {
        var swipers = new Swiper('.swiper-containerimg', {
            pagination: '.swiper-paginationimg',
            paginationClickable: true
        });
    };
    $scope.getCollectType = function () {
        if ($scope.collected) {
            $scope.shopUnCollect();
            return;
        }
        $scope.shopCollect();
    };

    /* //收藏
     $scope.shopCollect = function () {
     PH.api('mall/collectgood', {
     'goodId': $stateParams.id
     }, function (ret) {
     $scope.collected = !$scope.collected;
     $rootScope.errorHidden = false;
     $rootScope.naomi = '收藏成功';
     }, function (ret) {
     $rootScope.errorHidden = false;
     $rootScope.naomi = '收藏失败';
     });
     };
     //取消收藏
     $scope.shopUnCollect = function () {
     PH.api('mall/uncollectgood', {
     'goodId': $stateParams.id
     }, function (ret) {
     $scope.collected = !$scope.collected;
     $rootScope.errorHidden = false;
     $rootScope.naomi = '取消成功';
     }, function (ret) {
     $rootScope.errorHidden = false;
     $rootScope.naomi = '取消失败';
     });
     };*/
    //购买数量
    $scope.pronumber = 1;
    $scope.dessc = function () {
        if ($scope.pronumber > 1) {
            $scope.pronumber--;
        }
    };
    $scope.addnum = function () {
        if ($scope.pronumber >= $scope.goods.stock && $scope.goods.stock) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '库存不足';
            return;
        }
        $scope.pronumber++;
    };

    $scope.ischoose = false;
    $scope.choosenum = function () {
        $('.goodExt').show();
        $scope.ischoose = true;
        $scope.chooseExt(0);
    };
    $scope.closechoose = function () {
        $('.goodExt').hide();
        $scope.ischoose = false;
    };
    //选规格
    var extValue = '';
    $scope.chooseExt = function (index) {
        $scope.ExtId = index;
        extValue = $scope.goodExt[index].id;
        $scope.currPrice = $scope.goodExt[index].price;
    };
    //确认下单
    $scope.confirmOrder = function () {
        if (!extValue) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '请选择规格';
            return;
        }
        PH.api('mall/confirm', {
            'goodId': $sessionStorage.Paramsid,
            'goodExt': extValue,
            'count': $scope.pronumber
        }, function (ret) {
            $sessionStorage.orderId = ret.data.order.orderId;
            $state.go('paymsg',{'type':1});
        }, function (ret) {
        });
    };
    $scope.shopLoad();
});