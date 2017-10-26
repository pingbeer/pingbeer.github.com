//搜索
var shopSearch = angular.module('shopSearchModule', []);
shopSearch.controller('shopSearchController', function ($scope, $state, PH, $localStorage, $sessionStorage) {

    window.scrollTo(0, 0);//滚动到顶部
    if (!$localStorage.history) {
        $localStorage.history = [];
    }

    $scope.load = function () {
        PH.api('mall/hotsearch', {}, function (ret) {
            $scope.hotlist = ret.data;
            $scope.historyList = $localStorage.history;
        }, function (ret) {

        })
    };
    $scope.load();
    $scope.shopsearch = function (value) {
        var isTure = true;
        if ($scope.title) {
            for (var i = 0; i < $localStorage.history.length; i++) {
                if ($localStorage.history[i].title == $scope.title) {
                    isTure = false;
                }
            }
            if (isTure) {
                var obj = {
                    'title': $scope.title
                };
                $localStorage.history.push(obj);
                $scope.historyList = $localStorage.history;
            }
            if ($localStorage.history.length > 5) {
                $localStorage.history.splice(0, 1);
            }
            $sessionStorage.title = $scope.title;
            $state.go('shoplist', {'id': '', 'type': 'search'});
        } else if (value) {
            $sessionStorage.title = value;
            $state.go('shoplist', {'id': '', 'type': 'search'});
        }
    };
});