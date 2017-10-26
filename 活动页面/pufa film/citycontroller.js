//城市搜索
var citymodule = angular.module('CityModule', []);
citymodule.controller('cityController', function ($scope, $rootScope, $cookieStore, $http, $state,
                                                  $stateParams, $sessionStorage, $timeout, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    $scope.Paramsid = $stateParams.id;
    $scope.citySearch = function () {
        PH.api('data/cities.json', {}, function (ret) {
            $scope.cities = ret.data.cities;
            $scope.hotcity = ret.data.hotCities;
            $scope.currents= ret.data.currentCity;
            $scope.currentCityName=$scope.currents.name;
            // $scope.cityApi();
        }, function (ret) {

        });
    };
    $scope.citySearch();

    //repeat执行后调用
    $scope.doSomething = function () {
        //$scope.initials();
        $timeout(function () {
            $scope.initials();
        }, 1);
    };

    //城市插件的使用
    $scope.cityApi = function () {
        var Initials = $('.initials');
        var LetterBox = $('#letter');
        Initials.find('ul').append('<li>A</li><li>B</li><li>C</li><li>D</li><li>E</li><li>F</li><li>G</li>' +
            '<li>H</li><li>I</li><li>J</li><li>K</li><li>L</li><li>M</li><li>N</li><li>O</li><li>P</li><li>Q</li>' +
            '<li>R</li><li>S</li><li>T</li><li>U</li><li>V</li><li>W</li><li>X</li><li>Y</li><li>Z</li>');

        $(".initials ul li").click(function () {
            var _this = $(this);
            var LetterHtml = _this.html();
            Initials.css('background', 'rgba(145,145,145,0.6)');
            Initials.css('background', 'rgba(145,145,145,0)');
            var _index = _this.index();

            if (_index == 0) {
                $('html,body').animate({scrollTop: '0px'}, 300);//点击第一个滚到顶部
            } else {
                var letter = _this.text();
                if ($('#' + letter).length > 0) {
                    var LetterTop = $('#' + letter).position().top;
                    $('html,body').animate({scrollTop: LetterTop - 45 + 'px'}, 300);
                }
            }
        });

        var windowHeight = $(window).height();
        var InitHeight = windowHeight - 45;
        Initials.width(30);
        Initials.height(InitHeight);
        var LiHeight = InitHeight / 28;
        Initials.find('li').height(LiHeight);
    };
    $scope.initials = function () {//公众号排序

        var SortList = $(".sort_list");
        var SortBox = $(".sort_box");
        SortList.sort(asc_sort).appendTo('.sort_box');//按首字母排序
        function asc_sort(a, b) {
            var ALtter, BLetter;
            var cityBEnName = $(b).find('.num_name .cityEnName').text();
            if (!cityBEnName || cityBEnName == '') {
                BLetter = makePy($(b).find('.num_name .cityName').text().charAt(0))[0].toUpperCase();
            } else {
                BLetter = cityBEnName.charAt(0).toUpperCase();
            }
            var cityAEnName = $(a).find('.num_name.cityEnName').text();
            if (!cityAEnName || cityAEnName == '') {
                ALtter = makePy($(a).find('.num_name .cityName').text().charAt(0))[0].toUpperCase();
            } else {
                ALtter = cityAEnName.charAt(0).toUpperCase();
            }
            if (ALtter == 'F' || BLetter == 'F') {
            }
            if (BLetter < ALtter) {
                return 1;
            } else if (BLetter > ALtter) {
                return -1;
            } else {
                return 0;
            }
        }

        var initials = [];
        var num = 0;
        SortList.each(function (i) {
            var cityEnName = $(this).find('.num_name .cityEnName').text();
            var initial;
            if (!cityEnName || cityEnName == '') {
                initial = makePy($(this).find('.num_name .cityName').text().charAt(0))[0].toUpperCase();
            } else {
                initial = cityEnName.charAt(0).toUpperCase();
            }
            if (initial >= 'A' && initial <= 'Z') {
                if (initials.indexOf(initial) === -1)
                    initials.push(initial);
            } else {
                num++;
            }
        });

        initials.sort();
        $.each(initials, function (index, value) {//添加首字母标签
            SortBox.append('<div class="sort_letter ml-15 lineh-30" id="' + value + '">' + value + '</div>');
        });

        for (var i = 0; i < SortList.length; i++) {//插入到对应的首字母后面
            var cityEnName = $(SortList[i]).find('.num_name .cityEnName').text();
            var letter;
            if (!cityEnName || cityEnName == '') {
                letter = makePy($(SortList[i]).find('.num_name .cityName').text().charAt(0))[0].toUpperCase();
            } else {
                letter = cityEnName.charAt(0).toUpperCase();
            }
            var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (alphabet.indexOf(letter) > -1) {
                $('#' + letter).after(SortList.eq(i));
            } else {
                $('#default').after(SortList.eq(i));
            }
        }
    };

    //选择城市
    $scope.checkcity = function (cityName, cityId) {
        if (!cityId) {
            $sessionStorage.cityId = 2;
        } else {
            $sessionStorage.cityId = cityId;
        }
        if (!cityName) {
            $sessionStorage.cityName = '上海';
        } else {
            $sessionStorage.cityName = cityName;
        }
        $sessionStorage.lastcity = 1;
        $sessionStorage.getDirection = 1;
        if ($stateParams.id == 1) {
            $state.go('main', {reload: true});
        }
        else if ($stateParams.id == 2) {
            $state.go('films', {reload: true});
        }
        else if ($stateParams.id == 4) {
            $state.go('cinema', {reload: true});
        }
    };

    //定位
    $scope.regetLocation = function () {
        PH.regetLocation(function () {
            $scope.curraddress();
        }, function () {
            $scope.texts = '浏览器未开启定位';
        });
    };

    //-当前城市//
    $scope.curraddress = function () {

        PH.api('data/refreshlocation.josn', function (ret) {
            $sessionStorage.formatAddress = ret.data.currentCity.formatAddress;
            $scope.curraddr = {
                pname: ret.data.currentCity.name,
                id: ret.data.currentCity.id
            };

            $sessionStorage.cityName = ret.data.currentCity.name;
            $sessionStorage.cityId = ret.data.currentCity.id;
            $sessionStorage.lastcity = 1;
            $sessionStorage.getDirection = 1;
            $state.go('main', {reload: true});

        });
    };
    //返回
    $scope.returns = function () {

        if ($stateParams.type == 1) {
            $state.go('main', {reload: true});
        }
        else if ($stateParams.type == 2) {
            $state.go('films', {reload: true});
        }
        else if ($stateParams.type == 3) {
            $state.go('ciname', {reload: true});
        }
    }

});
