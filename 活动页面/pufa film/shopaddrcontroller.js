var shopaddr = angular.module("shopAddrModule", []);

//地址
shopaddr.controller('shopAddrController', function ($scope, $rootScope, $state, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    $scope.editShow = true;
    $scope.addrList = function () {
        PH.api('mall/toeditaddress', {}, function (ret) {
            $scope.addressList = ret.data;
        }, function (ret) {
        });
    };

    //编辑
    $scope.selectShow = false;
    $scope.select2Show = false;
    $scope.nowsave = '选择省';
    $scope.nowcity = '选择市';
    $scope.saveimg = "./images/shop/selectup.png";
    $scope.cityimg = "./images/shop/selectup.png";
    var key = "";
    $scope.savelist = createArea(0);
    $scope.editAddr = function (index) {
        $scope.editShow = false;
        $scope.name = $scope.addressList[index].name;
        $scope.mobile = $scope.addressList[index].mobile;
        $scope.nowsave = $scope.addressList[index].province;
        $scope.nowcity = $scope.addressList[index].city;
        $scope.street = $scope.addressList[index].street;
        $scope.status = $scope.addressList[index].status;
        $scope.id = $scope.addressList[index].id;
        key = $scope.returnumber($scope.nowsave, $scope.savelist);
        key = "0_" + key;
        $scope.citylist = createArea(key);
    };

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
        } else if (id < 0 && $scope.selectShow) {
            $scope.selectShow = false;
            $scope.saveimg = "./images/shop/selectup.png";
        } else {
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
    $scope.testFocus = function () {
        $scope.selectShow = false;
        $scope.select2Show = false;
        $scope.saveimg = "./images/shop/selectup.png";
        $scope.cityimg = "./images/shop/selectup.png";
    };
    //是否默认
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
            'status': $scope.checked,
            'id': $scope.id
        }, function (ret) {
            $scope.editShow = true;
            $scope.addrList();
        }, function (ret) {
        });
    };
    $scope.addrList();

    $scope.updateAddress = function (id) {
        PH.api('mall/setdefaultaddress', {
            'status': 1,
            'id': id
        }, function (ret) {

        }, function (ret) {

        })
    };
    $scope.remove = function (index, id) {
        PH.api('mall/removeadd', {
            'id': id
        }, function (ret) {
            $scope.addressList.splice(index, 1);
            $rootScope.errorHidden = false;
            $rootScope.naomi = '删除成功';
        }, function (ret) {

        })
    };
    //返回
    $scope.returnShow = function () {
        $scope.editShow = !$scope.editShow;
    }
});