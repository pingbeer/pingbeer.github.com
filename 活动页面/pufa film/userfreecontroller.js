//获取兑换码
var freecode = angular.module('FreeCodeModule', []);
freecode.controller('freeCodeController', function ($scope, $sessionStorage, $timeout, $state,
                                                    $stateParams, $rootScope, PH) {
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 200 / 750;
    $scope.ckedcode = true;
    $scope.megshow = false;
    $scope.codeMax = {
        'width': '100%',
        'height': imgHeight + 'px'
    };
    var freetype = 1;
    $scope.cgcode = function (type) {
        if (freetype == type) {
            return;
        }
        freetype = type;
        $scope.ckedcode = !$scope.ckedcode;
        if ($scope.ckedcode == true) {
            $scope.codeAll();
        } else {
            $scope.codeAll(3);
        }
    };
    $scope.codeAll = function (value) {
        PH.api('data/serialList.json', {
            type: value
        }, function (ret) {
            if (ret.data.message || ret.data.length == 0) {
                $scope.megshow = true;
                return;
            }
            $scope.megshow = false;
            if (value == 3) {
                $scope.myitem = ret.data;
            } else {
                $scope.listitem = ret.data;
            }

        }, function (ret) {
            $scope.megshow = true;
        })
    };
    $scope.codeAll();
    $scope.getMyCode = function (id) {
        PH.api('account/recieve', {
            serialId: id
        }, function (ret) {
            $scope.megshow = false;
            $scope.codeAll();
        }, function (ret) {
            $scope.megshow = true;
        })
    };

    //复制
    var clipboard = new Clipboard('.btn');
    clipboard.on('success', function (e) {
        $rootScope.errorHidden = false;
        $rootScope.naomi = '复制成功';
        $timeout(function () {
            $('.errorModel').show();
        }, '1000');

    });

    clipboard.on('error', function (e) {
        $rootScope.errorHidden = false;
        $rootScope.naomi = '请手动选择复制';
        $timeout(function () {
            $('.errorModel').show();
        }, '1000');
    });
    //关闭
    $scope.closeDialog = function () {
        $('.errorModel').hide();
    };

    //返回
    $scope.returns = function () {
        if ($stateParams.id == 1) {
            $state.go('mine');
        } else {
            $state.go('find');
        }
    }
});

//活动细则
var freenotice = angular.module('freeNoticeModule', []);
freenotice.controller('freeNoticeController', function ($scope, $sessionStorage, $timeout, $state, $stateParams) {

    if ($stateParams.id != 1 && $stateParams.id !== 3) {
        $scope.typeid = $stateParams.id.split('-')[0];
    } else {
        $scope.typeid = $stateParams.id;
    }

    //返回
    $scope.returns = function () {
        if ($scope.typeid == 1) {
            $state.go('freecode', {'id': $scope.typeid});
        } else if ($scope.typeid == 3) {
            $state.go('mypiece');
        } else {
            var prizetype = $stateParams.id.split('-')[1];
            $state.go('myprize', {'type': prizetype});
        }
    };

});


