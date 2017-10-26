//影院位置
var seatmaoyan = angular.module('MaoyanSeatModule', []);
//猫眼影院位置
seatmaoyan.controller('SeatMaoyanController', function ($scope, $rootScope, $cookieStore, $http,
                                                        $state, $stateParams, $sessionStorage, $timeout, PH) {


    window.scrollTo(0, 0);//滚动到顶部
    $scope.Paramsid = $stateParams.id;
    $scope.Paramstype = $stateParams.type;
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    document.getElementById('seatCount').addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, true);
    $scope.cinameName = $sessionStorage.cinameName;
    $scope.filmName = $sessionStorage.filmName;
    $scope.showTime = $sessionStorage.showTime;
    $scope.showDate = $sessionStorage.showDate.split('-');
    $scope.filmtype = $sessionStorage.filmtype;
    $scope.jbzPrice = $sessionStorage.jbzPrice;
    $scope.hallNum = $sessionStorage.hallNum;
    $scope.cinametype = $sessionStorage.cinametype;
    if ($sessionStorage.timeShow == 1) {
        var currtime = $scope.showDate[1] + '-' + $scope.showDate[2];
        $rootScope.currtime(currtime);
        $sessionStorage.timeShow = 2;
    }

    //张数
    if ($scope.hasFreePrize) {
        $scope.changeNum = 4;
    } else {
        $scope.changeNum = 4;
    }
    //时实座位数据
    $scope.seatload = function () {

        PH.api('data/realtimeseats.json', {
            cinemaId: $sessionStorage.cinemaId,
            showId: $sessionStorage.showIndex,
            hallId: $sessionStorage.showHall ? $sessionStorage.showHall : '',
            type: 'maoyan'
        }, function (red) {
            $scope.isSeat = true;
            $scope.sections = red.data.sections;
            $scope.sectionarr = []; //场区
            if (!$scope.sections) {
                return;
            }
            for (var i = 0; i < $scope.sections.length; i++) {
                angular.forEach($scope.sections[i], function (value, key) {
                    //座位的标识
                    $scope.rowseat = [];
                    $scope.columnseat = [];
                    $scope.active = [];
                    for (var r = 0; r < value.maxRow; r++) {
                        $scope.rowseat.push(r);
                        $scope.active.push([]);
                        for (var c = 0; c < value.maxColumn; c++) {

                            $scope.active[r].push('btn-white');
                        }
                    }
                    for (var c = 0; c < value.maxColumn; c++) {

                        $scope.columnseat.push(c);
                    }
                    var obj = {
                        'section': key,
                        'maxColumn': $scope.columnseat,
                        'rowseat': $scope.rowseat,
                        'active': $scope.active,
                        'seatMap': value.seatMap

                    };
                    $scope.sectionarr.push(obj);

                })
            }
            ;
        }, function (red) {
            $scope.isSeat = false;
        });

    };
    $scope.initScroll = function () {
        $timeout(function () {
            $scope.newScroll();
        }, 1);
    };

    //显示位置图
    $scope.newScroll = function () {
        var seatWidth = 30;
        var maxColumn = $scope.sectionarr[0].maxColumn.length, maxRow = $scope.sectionarr[0].rowseat.length;
        var scrollerWidth = (seatWidth + 3) * maxColumn + 3 + (5 + seatWidth) + 15;
        var scrollerHeight = seatWidth * $scope.sectionarr[0].rowseat.length + 60;
        var seatWrapperHeight = ($(window).height() - 90 - 60 ) * 0.7;
        $('#scroller').width(scrollerWidth);
        var scale = $(window).width() / (scrollerWidth + 0.0);
        var hScale = seatWrapperHeight / (scrollerHeight * scale + 0.0);
        if (hScale < 1) {
            scale = scale * hScale;
        }
        $scope.seatTd = {
            'width': seatWidth + 'px',
            'height': seatWidth + 'px',
            'margin-right': '3px'
        };
        $scope.rowIds = {
            'width': seatWidth + 'px',
            'height': seatWidth + 'px',
            'line-height': seatWidth + 'px'
        };
        var myScroll = new IScroll('#wrapper', {
            click: true,
            freeScroll: true,
            zoom: true,
            zoomMin: scale,
            zoomMax: 2,
            scrollX: true,
            scrollY: true,
            mouseWheel: true,
            wheelAction: 'zoom',
            preventDefault: true
        });
        myScroll.zoom(scale, 100, 100, 500);
        $('#centerLine').css('left', scrollerWidth / 2 + (seatWidth + 5) / 2);
        $('#centerLine').height((maxRow + 3) * seatWidth);
        $('#seatWrapper').height(seatWrapperHeight);
    };


    //选择座位
    $scope.seatNum = [];//选中
    $scope.ticknum = 0;
    $scope.SeatIndex = [];
    var time1 = '';
    $scope.checkSeat = function (index, row, colum) {

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

        $scope.tempSeat = [];//取消选中
        var str = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) + 1);
        $scope.seatName = $scope.sectionarr[index].seatMap[str];
        $scope.indexseat = $scope.seatName.rowId + ":" + $scope.seatName.columnId;


        //情侣坐判断
        if ($scope.sectionarr[index].seatMap[str].status == 'N') {
            $scope.setobj = {
                'sectionId': $scope.sectionarr[index].section,
                'seatNo': $scope.seatName.seatNo,
                'columnId': $scope.seatName.columnId,
                'rowId': $scope.seatName.rowId

            };
            $scope.loveid = 0;//非

        }
        else if ($scope.sectionarr[index].seatMap[str].status == 'L') {//左

            var first = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) + 2);

            $scope.setobj = {
                'sectionId': $scope.sectionarr[index].section,
                'seatNo': $scope.seatName.seatNo,
                'columnId': $scope.seatName.columnId,
                'rowId': $scope.seatName.rowId
            };
            $scope.loveobj = {
                'sectionId': $scope.sectionarr[index].section,
                'seatNo': $scope.sectionarr[index].seatMap[first].seatNo,
                'columnId': $scope.sectionarr[index].seatMap[first].columnId,
                'rowId': $scope.sectionarr[index].seatMap[first].rowId
            };
            $scope.indexseatl = $scope.sectionarr[index].seatMap[first].rowId +
                ":" + $scope.sectionarr[index].seatMap[first].columnId;//网票坐位格式
            $scope.loveid = 1;//左
        }
        else if ($scope.sectionarr[index].seatMap[str].status == 'R') {//右

            var second = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum));

            $scope.setobj = {
                'sectionId': $scope.sectionarr[index].section,
                'seatNo': $scope.seatName.seatNo,
                'columnId': $scope.seatName.columnId,
                'rowId': $scope.seatName.rowId
            };
            $scope.loveobj = {
                'sectionId': $scope.sectionarr[index].section,
                'seatNo': $scope.sectionarr[index].seatMap[second].seatNo,
                'columnId': $scope.sectionarr[index].seatMap[second].columnId,
                'rowId': $scope.sectionarr[index].seatMap[second].rowId
            };

            $scope.indexseatl = $scope.sectionarr[index].seatMap[second].rowId +
                ":" + $scope.sectionarr[index].seatMap[second].columnId;//网票坐位格式
            $scope.loveid = 2;//右
        }

        if ($scope.seatNum.length < $scope.changeNum) {

            //取消选择
            if ($scope.sectionarr[index].active[row][colum] == 'btn-green') {

                if ($scope.loveid == 1) {//左
                    $scope.sectionarr[index].active[row][colum] = 'btn-white';
                    $scope.tempSeat.push($scope.setobj);
                    $scope.tempSeat.push($scope.loveobj);
                    $scope.sectionarr[index].active[row][colum + 1] = 'btn-white';
                }
                else if ($scope.loveid == 2) {
                    $scope.sectionarr[index].active[row][colum] = 'btn-white';
                    $scope.tempSeat.push($scope.setobj);
                    $scope.tempSeat.push($scope.loveobj);
                    $scope.sectionarr[index].active[row][colum - 1] = 'btn-white';
                }
                else {
                    $scope.sectionarr[index].active[row][colum] = 'btn-white';
                    $scope.tempSeat.push($scope.setobj);

                }

            }
            else { //选择
                //判断情侣坐

                if ($scope.loveid == 1 && $scope.seatNum.length < 3) {

                    $scope.seatNum.push($scope.setobj);
                    $scope.seatNum.push($scope.loveobj);
                    $scope.sectionarr[index].active[row][colum] = 'btn-green';
                    $scope.sectionarr[index].active[row][colum + 1] = 'btn-green';
                    $scope.SeatIndex.push($scope.setobj);
                    $scope.SeatIndex.push($scope.loveobj);
                }
                else if ($scope.loveid == 2 && $scope.seatNum.length < 3) {

                    $scope.seatNum.push($scope.setobj);
                    $scope.seatNum.push($scope.loveobj);
                    $scope.sectionarr[index].active[row][colum] = 'btn-green';
                    $scope.sectionarr[index].active[row][colum - 1] = 'btn-green';
                    $scope.SeatIndex.push($scope.setobj);
                    $scope.SeatIndex.push($scope.loveobj);
                }
                else if ($scope.loveid != 2 && $scope.loveid != 1) {

                    $scope.sectionarr[index].active[row][colum] = 'btn-green';
                    $scope.SeatIndex.push($scope.setobj);
                    $scope.seatNum.push($scope.setobj);
                }
                else if ($scope.loveid != 0 && $scope.seatNum.length == 3) {
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '最多购买' + $scope.changeNum + '张,此座是情侣座';
                }
            }
        }
        else if ($scope.seatNum.length == $scope.changeNum) {

            if ($scope.sectionarr[index].active[row][colum] == 'btn-white') {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '最多购买' + $scope.changeNum + '张';
            }
            else {
                $scope.sectionarr[index].active[row][colum] = 'btn-white';

                if ($scope.loveid == 1) {
                    $scope.tempSeat.push($scope.setobj);
                    $scope.tempSeat.push($scope.loveobj);
                    $scope.sectionarr[index].active[row][colum + 1] = 'btn-white';
                }
                else if ($scope.loveid == 2) {
                    $scope.tempSeat.push($scope.setobj);
                    $scope.tempSeat.push($scope.loveobj);
                    $scope.sectionarr[index].active[row][colum - 1] = 'btn-white';
                }
                else {
                    $scope.tempSeat.push($scope.setobj);
                }
            }
        }

        if ($scope.tempSeat.length > 0) {
            for (var i = 0; i < $scope.tempSeat.length; i++) {
                for (var s = 0; s < $scope.seatNum.length; s++) {
                    if ($scope.seatNum[s].seatNo == $scope.tempSeat[i].seatNo &&
                        $scope.seatNum[s].columnId == $scope.tempSeat[i].columnId &&
                        $scope.seatNum[s].rowId == $scope.tempSeat[i].rowId) {

                        //判断情侣坐
                        $scope.seatNum.splice(s, 1);
                        $scope.SeatIndex.splice(s, 1);
                    }
                }
            }
        }

        $scope.ticknum = $scope.seatNum.length;
        $sessionStorage.seatCount = $scope.seatNum.length;
    };
    //确认选座
    $scope.seatMaps = function () {
        if ($scope.ticknum > 0) {
            if ($sessionStorage.mobile) {
                $scope.tel = parseInt($sessionStorage.mobile);
            } else {
                $scope.tel = '';
            }
            $(".telModel").show();
        }
        else {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '请选择座位';
        }
    };
    //关闭
    $scope.closeDialog = function () {
        $(".telModel").hide();
    };

    //确定
    $scope.Dialog = function () {

        if ($scope.tel) {
            $sessionStorage.mobile = $scope.tel;
            $scope.lockSeat();
        }
        else if (!$scope.tel) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '兑换码接收电话号码格式不正确';
        }
    };

    //座位锁定
    $scope.lockSeat = function () {
        $scope.maoyanjson = {
            count: $scope.SeatIndex.length,
            list: $scope.SeatIndex
        };
        $sessionStorage.jbzCinemaId = $stateParams.id;
        PH.api('data/lockseat.json', {
            jbzCinemaId: $stateParams.id,
            jbzFilmId: $sessionStorage.jbzFilmId,
            mobile: $scope.tel,
            type: 'maoyan',
            inType: $rootScope.orderType,
            count: $sessionStorage.seatCount,
            showId: $sessionStorage.showIndex,
            seatIds: $scope.maoyanjson,
            hallId: $sessionStorage.showHall,
            areaInfo: '',
            seatsInfo: '',
            isLoweastForetell: $sessionStorage.byorders
        }, function (ret) {
            if (ret.data) {
                if (ret.data.orderStatus == 2) {//锁座失败
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '锁座失败，请重新购买!';
                    return;
                }
            }
            $sessionStorage.orderid = ret.data.orderId;
            $state.go('seatorder', {'id': $stateParams.id, 'type': $stateParams.type}, {reload: true});
        }, function (ret) {
        });
    };
    $scope.seatload();
});