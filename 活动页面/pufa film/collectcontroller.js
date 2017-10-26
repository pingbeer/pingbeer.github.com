//收藏影院
var collectedCinema = angular.module('CollectModule', []);
collectedCinema.controller('CollectController', function ($scope, $rootScope, $http, $state,
                                                          $cookieStore, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    //所有收藏
    $scope.load = function () {
        PH.api('data/collectedcinemalist.json', {}, function (ret) {
            if (!ret.data) {
                $scope.errormsg = '暂无收藏';
                return;
            }
            $scope.collectedCinemas = ret.data;
            if ($scope.collectedCinemas.length == 0) {
                $scope.errormsg = '暂无收藏';
            }
        }, function (ret) {
            $scope.errormsg = '暂无收藏';
        });
    };
    $scope.load();

    //影院详情
    $scope.cinamefilms = function (id) {
        $state.go('cinamefilms', {'id': id, 'type': 5});
    };
});
