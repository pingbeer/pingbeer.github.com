var filmsearch = angular.module('FilmsSearchModule', []);
filmsearch.controller('filmSearController', function ($scope, $rootScope, $http, $state, $stateParams,
                                                      $cookieStore, $timeout, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $scope.leng = true;
    $scope.Paramsid = $stateParams.id;
    $scope.Paramstype = $stateParams.type;
    if ($stateParams.type.split('-')[1]) {
        $scope.Paramstype = $stateParams.type.split('-')[0];
        if ($scope.Paramstype == 7) {
            $scope.ParamsName = 'search';
            $scope.Paramsid = $stateParams.id;
            $scope.Paramstype = $stateParams.type.split('-')[1];
        }
    } else {
        if ($stateParams.type == 2) {
            $scope.ParamsName = 'films';
        } else {
            $scope.ParamsName = 'filmdetail';
        }
    }

    //当前影片
    $scope.films = function () {

        PH.api('data/compareprice.json', {
            filmId: $stateParams.id,
            cityId: $sessionStorage.cityId
        }, function (ret) {
            $scope.film = ret.data.film;
            $scope.allCinema(1);
        }, function (ret) {

        });
    };

    //影片的所有影院
    $scope.allCinema = function (order) {

        PH.api('data/cinemasbyregion.json', {
            filmId: $stateParams.id,
            cityId: $sessionStorage.cityId,
            regionName: $scope.navArea == '全部区域' ? '' : $scope.navArea,
            orderType: order
        }, function (ret) {
            if (!ret.data || ret.data.length == 0) {
                $scope.leng = false;
                $scope.errormsg = '该城市暂无相关影片信息';
                return;
            }
            $scope.cinemas = ret.data;
        }, function (ret) {

        });
    };

    //获取影院详情
    $scope.getCinemaDetail = function (id) {
        $sessionStorage.filmIndex = $stateParams.id;
        $state.go('cinemadetail', {'id': id, 'type': $stateParams.type + '-1-' + $stateParams.id});
    };
    $scope.films();
});