var editaddr = angular.module("editAddrModule", []);

//添加地址
editaddr.controller('editAddrController', function ($scope, $state, PH, $rootScope) {
    window.scrollTo(0, 0);//滚动到顶部
    $scope.savelist = createArea(0);
    $scope.selectShow = false;
    $scope.select2Show = false;
    $scope.nowsave = '选择省';
    $scope.nowcity = '选择市';
    $scope.saveimg = "./images/shop/selectup.png";
    $scope.cityimg = "./images/shop/selectup.png";
    var key = '';
    //省
    $scope.getSave = function (id, name) {
        $scope.nowsave = name;
        if (id >= 0) {
            $scope.nowcity = '选择市';
            $scope.citylist = '';
            $scope.selectShow = false;
            $scope.select2Show = false;
            key = "0_" + id;
            $scope.citylist = createArea(key);
            $scope.saveimg = "./images/shop/selectup.png";
        }
        else if (id < 0 && $scope.selectShow) {
            $scope.selectShow = false;
            $scope.saveimg = "./images/shop/selectup.png";
        }
        else {
            $scope.selectShow = true;
            $scope.saveimg = "./images/shop/selectdown.png";
        }
    };
    $scope.getCity = function (id, name) {
        $scope.nowcity = name;
        if (id >= 0) {
            $scope.select2Show = false;
            $scope.cityimg = "./images/shop/selectup.png";
        }
        else if (id < 0 && $scope.select2Show) {
            $scope.select2Show = false;
            $scope.cityimg = "./images/shop/selectup.png";
        }
        else {
            $scope.select2Show = true;
            $scope.cityimg = "./images/shop/selectdown.png";
        }
    };


    //是否默认
    $scope.checked = 1;
    $scope.setAddree = function () {
        $scope.testFocus();
        if ($('#radio:checked').attr('checked')) {
            $scope.checked = 1;
        } else {
            $scope.checked = 2;
        }
    };
    //返回第几个
    $scope.returnumber = function (value, obj) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i] == value) {
                return i;
            }
        }
    };
    $scope.testFocus = function () {
        $scope.selectShow = false;
        $scope.select2Show = false;
        $scope.saveimg = "./images/shop/selectup.png";
        $scope.cityimg = "./images/shop/selectup.png";
    };
    //保存
    $scope.saveAddr = function () {
        $scope.testFocus();
        if (!$scope.name || !$scope.mobile || !$scope.nowsave || !$scope.nowcity || !$scope.street) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '请将信息填写完整';
            return;
        }
        PH.api('mall/setAddress', {
            'name': $scope.name,
            'mobile': $scope.mobile,
            'province': $scope.nowsave,
            'city': $scope.nowcity,
            'street': $scope.street,
            'status': $scope.checked
        }, function (ret) {
            $state.go('shopaddr');
        }, function (ret) {
        });
    };
});