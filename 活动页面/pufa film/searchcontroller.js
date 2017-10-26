//搜索
var search = angular.module('SearchModule', []);
search.controller('searchController', function ($scope, $rootScope, $http, $state, $stateParams,
                                                $cookieStore, $timeout, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    $scope.isShow = true;
    $scope.text = '';
    $scope.cinemaResults = [];
    $scope.filmResults = [];
    if($stateParams.type==7){
        $scope.Paramstype = 1;
    }
    else{
        $scope.Paramstype = $stateParams.type.split('-')[$stateParams.type.split('-').length-1];
    }
    $scope.imgWidth = {
        'width': $(window).width() - 100 + 'px'
    };
    var time1 = '';
    $scope.searchCount = function (first) {
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
        $sessionStorage.searchCinema = '';
        if (first == 1) {
            $scope.cinemaResults = [];
            $scope.filmResults = [];
            $scope.searchList = '';
            window.scrollTo(0, 0);//滚动到顶部
        }
        $scope.searchdate = '';
        PH.api('main/search', {
            cityId: $sessionStorage.cityId,
            query: $scope.search,
            lastKey: $scope.searchList ? $scope.searchList.lastKey : ''
        }, function (ret) {
            $sessionStorage.searchTitle = $scope.search;
            $scope.searchList = ret.data;
            $scope.activeLoad($scope.type ? $scope.type : 1);
            $scope.lastPage = ret.data.lastPage;

        }, function (ret) {

        });
    };

    if ($sessionStorage.searchCinema) {
        $scope.search = $sessionStorage.searchCinema;
        $sessionStorage.searchTitle = $sessionStorage.searchCinema;
        $scope.isShow = false;
        $scope.searchCount(1);
    }

    $scope.show = function () {
        $scope.isShow = false;
    };

    $scope.searchLoad = function (first, event) {

        if (event.keyCode == 13 && $scope.search != '') {
            $sessionStorage.searchTitle = $scope.search;
            $scope.isShow = false;
            $scope.searchCount(first);
        }
        else if (event.keyCode == 13 && $scope.search == '') {
            $scope.clearSearch();
        }
    };
    //查看影院或电影内容
    $scope.activeLoad = function (type) {
        $scope.text = '';
        $scope.type = type;
        $scope.active = '';
        $scope.active2 = '';
        if ($scope.searchList) {
            $scope.cinemaResults = $scope.cinemaResults.concat($scope.searchList.cinemas);
            $scope.text = '总共' + $scope.searchList.total + '个影院';
        }
        if ($scope.searchList) {
            $scope.filmResults = $scope.filmResults.concat($scope.searchList.films);
            $scope.text1 = '总共' + $scope.searchList.filmtotal + '部电影';
        }
    };

    //详情
    $scope.detail = function (id) {
        $state.go('cinemadetail', {'id': id, 'type': "7-" + $stateParams.type}, {reload: true});
    };

    //电影详情
    $scope.filmDetail = function (id) {

        $state.go('filmdetail', {'id': id, 'type': "7-" + $stateParams.type}, {reload: true});
    }

    //电影比价购
    $scope.filmSearch = function (id) {
        $state.go('filmsearch', {'id': id, 'type': "7-" + $stateParams.type}, {reload: true});
    };

    //搜索加载更多
    $scope.downMore = function () {
        $scope.searchCount(2);
    };
    //清除
    $scope.clearSearch = function () {
        $scope.search = '';
        $scope.searchList = '';
        $scope.isShow = true;
    };
    if ($sessionStorage.searchTitle && $sessionStorage.searchCinema == '') {
        $scope.search = $sessionStorage.searchTitle;
        $scope.searchCount(1);
    }

});
