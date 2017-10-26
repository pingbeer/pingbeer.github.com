//影院位置
alert("seat");
var seatModule = angular.module('SeatModule', []);
seatModule.controller('SeatController', function ($scope, $rootScope, $cookieStore, $http, $state,
                                                  $stateParams, $timeout, $sessionStorage, PH) {

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
            type: $sessionStorage.cinametype
        }, function (ret) {
            $scope.seatMap = ret.data;
            //座位的标识
            $scope.rowseat = [];
            $scope.columnseat = [];
            $scope.active = [];
            if (!ret.data) {
                $scope.isSeat = false;
                return;
            }
            for (var r = 0; r < ret.data.maxRow; r++) {
                $scope.rowseat.push(r);
                $scope.active.push([]);
                for (var c = 0; c < ret.data.maxColumn; c++) {
                    $scope.active[r].push('btn-white');
                }
            }
            for (var c = 0; c < ret.data.maxColumn; c++) {
                $scope.columnseat.push(c);
            }

            $scope.isSeat = true;
        }, function (ret) {
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
        var maxColumn = $scope.seatMap.maxColumn, maxRow = $scope.seatMap.maxRow;
        var scrollerWidth = (seatWidth + 3) * maxColumn + 3 + (5 + seatWidth) + 15;
        var scrollerHeight = seatWidth * $scope.seatMap.maxRow + 60;
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

        $timeout(function () {
            myScroll.zoom(scale, 100, 100, 500);
        }, 1);

        $('#centerLine').css('left', scrollerWidth / 2 + (seatWidth + 5) / 2);
        $('#centerLine').height((maxRow + 3) * seatWidth);
        $('#seatWrapper').height(seatWrapperHeight);
    };

    //选择座位
    $scope.seatNum = [];
    $scope.ticknum = 0;
    $scope.SeatIndex = [];

    var time1 = '';
    $scope.checkSeat = function (row, colum) {
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
        if ($sessionStorage.cinametype == 'wangpiao') {

            var str = row + ":" + colum;
            $scope.loveid = $scope.seatMap.seatMap[str].LoveFlag;
            $scope.indexseat = $scope.seatMap.seatMap[str].SeatIndex;//网票坐位格式
            $scope.seatName = $scope.seatMap.seatMap[str].Name;///网票普通

            //情侣坐判断
            if ($scope.loveid == 0) {
                $scope.setobj = {
                    'rownum': $scope.seatName.split(':')[0],
                    'colum': $scope.seatName.split(':')[1]
                };
            }
            else if ($scope.loveid == 1) {

                var first = row + ":" + parseInt(colum + 1);

                $scope.setobj = {
                    'rownum': $scope.seatName.split(':')[0],
                    'colum': $scope.seatName.split(':')[1]
                };
                $scope.loveobj = {
                    'rownum': $scope.seatMap.seatMap[first].Name.split(':')[0],
                    'colum': $scope.seatMap.seatMap[first].Name.split(':')[1]
                };
                $scope.indexseatl = $scope.seatMap.seatMap[first].SeatIndex;//网票坐位格式
            }
            else if ($scope.loveid == 2) {

                var second = row + ":" + parseInt(colum - 1);

                $scope.setobj = {
                    'rownum': $scope.seatName.split(':')[0],
                    'colum': $scope.seatName.split(':')[1]
                };
                $scope.loveobj = {
                    'rownum': $scope.seatMap.seatMap[second].Name.split(':')[0],
                    'colum': $scope.seatMap.seatMap[second].Name.split(':')[1]
                };

                $scope.indexseatl = $scope.seatMap.seatMap[second].SeatIndex;//网票坐位格式
            }
        }
        else if ($sessionStorage.cinametype == 'maizuo') {

            var str = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) + 1);
            $scope.loveid = $scope.seatMap.seatMap[str].loveIndex;
            $scope.seatName = $scope.seatMap.seatMap[str];
            $scope.indexseat = $scope.seatName.rowId + ":" + $scope.seatName.columnId;

            //情侣坐判断
            if ($scope.loveid == 0) {
                $scope.setobj = {
                    'rownum': $scope.seatName.rowId,
                    'colum': $scope.seatName.columnId
                };
            }
            else if ($scope.loveid == 1) {

                var first = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) + 2);

                $scope.setobj = {
                    'rownum': $scope.seatName.rowId,
                    'colum': $scope.seatName.columnId
                };
                $scope.loveobj = {

                    'rownum': $scope.seatMap.seatMap[first].rowId,
                    'colum': $scope.seatMap.seatMap[first].columnId
                };
                $scope.indexseatl = $scope.seatMap.seatMap[first].rowId
                    + ":" + $scope.seatMap.seatMap[first].columnId;//网票坐位格式

            }
            else if ($scope.loveid == 2) {

                var second = parseInt(parseInt(row) + 1) + ":" + parseInt(colum);

                $scope.setobj = {
                    'rownum': $scope.seatName.rowId,
                    'colum': $scope.seatName.columnId
                };
                $scope.loveobj = {
                    'rownum': $scope.seatMap.seatMap[second].rowId,
                    'colum': $scope.seatMap.seatMap[second].columnId
                };

                $scope.indexseatl = $scope.seatMap.seatMap[second].rowId
                    + ":" + $scope.seatMap.seatMap[second].columnId;//网票坐位格式
            }
        }
        else if ($sessionStorage.cinametype == 'spider') {

            var str = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum));
            $scope.loveid = $scope.seatMap.seatMap[str].loveIndex;
            $scope.seatName = $scope.seatMap.seatMap[str];
            $scope.indexseat = $scope.seatName.rowId + ":" + $scope.seatName.columnId;


            //情侣坐判断
            if ($scope.loveid == 0) {
                $scope.setobj = {
                    'rownum': $scope.seatName.rowId,
                    'colum': $scope.seatName.columnId
                };
            }
            else if ($scope.loveid == 1) {

                var first = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) + 1);

                $scope.setobj = {
                    'rownum': $scope.seatName.rowId,
                    'colum': $scope.seatName.columnId
                };
                $scope.loveobj = {

                    'rownum': $scope.seatMap.seatMap[first].rowId,
                    'colum': $scope.seatMap.seatMap[first].columnId
                };
                $scope.indexseatl = $scope.seatMap.seatMap[first].rowId
                    + ":" + $scope.seatMap.seatMap[first].columnId;//网票坐位格式

            }
            else if ($scope.loveid == 2) {

                var second = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) - 1);

                $scope.setobj = {
                    'rownum': $scope.seatName.rowId,
                    'colum': $scope.seatName.columnId
                };
                $scope.loveobj = {

                    'rownum': $scope.seatMap.seatMap[second].rowId,
                    'colum': $scope.seatMap.seatMap[second].columnId
                };

                $scope.indexseatl = $scope.seatMap.seatMap[second].rowId
                    + ":" + $scope.seatMap.seatMap[second].columnId;//网票坐位格式
            }

        }
        else if ($sessionStorage.cinametype == 'danche') {

            var str = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) + 1);
            $scope.loveid = $scope.seatMap.seatMap[str].loveIndex;
            $scope.seatName = $scope.seatMap.seatMap[str];
            $scope.indexseat = $scope.seatName.rowId + ":" + $scope.seatName.columnId;


            //情侣坐判断
            if ($scope.loveid == 0) {
                $scope.setobj = {
                    'rownum': $scope.seatName.rowId,
                    'colum': $scope.seatName.columnId
                }
            }
            else if ($scope.loveid == 1) {

                var first = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) + 2);

                $scope.setobj = {
                    'rownum': $scope.seatName.rowId,
                    'colum': $scope.seatName.columnId
                };

                $scope.loveobj = {
                    'rownum': $scope.seatMap.seatMap[first].rowId,
                    'colum': $scope.seatMap.seatMap[first].columnId
                };

                $scope.indexseatl = $scope.seatMap.seatMap[first].rowId
                    + ":" + $scope.seatMap.seatMap[first].columnId;//网票坐位格式
            }
            else if ($scope.loveid == 2) {

                var second = parseInt(parseInt(row) + 1) + ":" + parseInt(colum);

                $scope.setobj = {
                    'rownum': $scope.seatName.rowId,
                    'colum': $scope.seatName.columnId
                };
                $scope.loveobj = {

                    'rownum': $scope.seatMap.seatMap[second].rowId,
                    'colum': $scope.seatMap.seatMap[second].columnId
                };

                $scope.indexseatl = $scope.seatMap.seatMap[second].rowId
                    + ":" + $scope.seatMap.seatMap[second].columnId;//网票坐位格式
            }
        }
        else if ($sessionStorage.cinametype == 'baidu') {

            var str = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum));
            $scope.loveid = $scope.seatMap.seatMap[str].isLove;
            $scope.seatName = $scope.seatMap.seatMap[str];
            $scope.indexseat = $scope.seatName.seatNo;
            //情侣坐判断
            if ($scope.loveid == 0) {
                $scope.setobj = {
                    'rownum': $scope.seatName.rowNo,
                    'colum': $scope.seatName.columnNo,
                    'area': $scope.seatName.area
                }
            }
            else if ($scope.loveid == 1) {

                var first = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) + 1);

                $scope.setobj = {
                    'rownum': $scope.seatName.rowNo,
                    'colum': $scope.seatName.columnNo,
                    'area': $scope.seatName.area
                };

                $scope.loveobj = {
                    'rownum': $scope.seatMap.seatMap[first].rowNo,
                    'colum': $scope.seatMap.seatMap[first].columnNo,
                    'area': $scope.seatMap.seatMap[first].area
                };

                $scope.indexseatl = $scope.seatMap.seatMap[first].seatNo;
            }
            else if ($scope.loveid == 2) {

                var second = parseInt(parseInt(row) + 1) + ":" + parseInt(parseInt(colum) - 1);
                $scope.setobj = {
                    'rownum': $scope.seatName.rowNo,
                    'colum': $scope.seatName.columnNo,
                    'area': $scope.seatName.area
                };
                $scope.loveobj = {

                    'rownum': $scope.seatMap.seatMap[second].rowNo,
                    'colum': $scope.seatMap.seatMap[second].columnNo,
                    'area': $scope.seatMap.seatMap[second].area
                };

                $scope.indexseatl = $scope.seatMap.seatMap[second].seatNo;//百度坐位格式
            }
        }

        //判断是否选中

        if ($scope.seatNum.length < $scope.changeNum) {

            //取消选择
            if ($scope.active[row][colum] == 'btn-green') {

                if ($scope.loveid == 1) {
                    $scope.active[row][colum] = 'btn-white';
                    $scope.tempSeat.push($scope.setobj);
                    $scope.tempSeat.push($scope.loveobj);
                    $scope.active[row][colum + 1] = 'btn-white';
                }
                else if ($scope.loveid == 2) {
                    $scope.active[row][colum] = 'btn-white';
                    $scope.tempSeat.push($scope.setobj);
                    $scope.tempSeat.push($scope.loveobj);
                    $scope.active[row][colum - 1] = 'btn-white';
                }
                else {
                    $scope.active[row][colum] = 'btn-white';
                    $scope.tempSeat.push($scope.setobj);
                }

            } else { //选择
                //判断情侣坐

                if ($scope.loveid == 1 && $scope.seatNum.length < 3) {

                    $scope.seatNum.push($scope.setobj);
                    $scope.seatNum.push($scope.loveobj);
                    $scope.active[row][colum] = 'btn-green';
                    $scope.active[row][colum + 1] = 'btn-green';
                    $scope.SeatIndex.push($scope.indexseat);
                    $scope.SeatIndex.push($scope.indexseatl);
                }
                else if ($scope.loveid == 2 && $scope.seatNum.length < 3) {

                    $scope.seatNum.push($scope.setobj);
                    $scope.seatNum.push($scope.loveobj);
                    $scope.active[row][colum] = 'btn-green';
                    $scope.active[row][colum - 1] = 'btn-green';
                    $scope.SeatIndex.push($scope.indexseat);
                    $scope.SeatIndex.push($scope.indexseatl);
                }
                else if ($scope.loveid != 2 && $scope.loveid != 1) {

                    $scope.active[row][colum] = 'btn-green';
                    $scope.SeatIndex.push($scope.indexseat);
                    $scope.seatNum.push($scope.setobj);
                }
                else if ($scope.loveid != 0 && $scope.seatNum.length == 3) {
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '最多购买' + $scope.changeNum + '张';
                }


            }
        }
        else if ($scope.seatNum.length == $scope.changeNum) {

            if ($scope.active[row][colum] == 'btn-white') {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '最多购买' + $scope.changeNum + '张';
            }
            else {
                $scope.active[row][colum] = 'btn-white';

                if ($scope.loveid == 1) {
                    $scope.tempSeat.push($scope.setobj);
                    $scope.tempSeat.push($scope.loveobj);
                    $scope.active[row][colum + 1] = 'btn-white';
                }
                else if ($scope.loveid == 2) {
                    $scope.tempSeat.push($scope.setobj);
                    $scope.tempSeat.push($scope.loveobj);
                    $scope.active[row][colum - 1] = 'btn-white';
                }
                else {
                    $scope.tempSeat.push($scope.setobj);
                }
            }
        }

        if ($scope.tempSeat.length > 0) {
            for (var i = 0; i < $scope.tempSeat.length; i++) {
                for (var s = 0; s < $scope.seatNum.length; s++) {
                    if ($scope.seatNum[s].rownum == $scope.tempSeat[i].rownum &&
                        $scope.seatNum[s].colum == $scope.tempSeat[i].colum) {

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
            $rootScope.naomi = '请选择坐位';
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
        var area_info = [];
        var baidu_seats = [];
        if ($sessionStorage.cinametype == 'baidu') {
            if ($scope.seatNum) {
                for (var i = 0; i < $scope.seatNum.length; i++) {
                    if ($scope.seatNum[i].area) {
                        area_info.push($scope.seatNum[i].area ? $scope.seatNum[i].area : '');
                    }
                    var bai_str = $scope.seatNum[i].rownum + ":" + $scope.seatNum[i].colum;
                    baidu_seats.push(bai_str);
                }
            }
        }
        $sessionStorage.jbzCinemaId = $stateParams.id;
        PH.api('main/lockseat', {
            jbzCinemaId: $stateParams.id,
            jbzFilmId: $sessionStorage.jbzFilmId,
            mobile: $scope.tel,
            type: $sessionStorage.cinametype,
            inType: $rootScope.orderType,
            count: $sessionStorage.seatCount,
            showId: $sessionStorage.showIndex,
            seatIds: $scope.SeatIndex.join('|'),
            hallId: $sessionStorage.showHall,
            areaInfo: area_info.join('|'),
            seatsInfo: baidu_seats.join('|'),
            isLoweastForetell: $sessionStorage.byorders
        }, function (ret) {
            if ($sessionStorage.cinametype == 'wangpiao') {
                $sessionStorage.orderid = ret.data.SID;
            }
            else if ($sessionStorage.cinametype == 'maizuo') {
                $sessionStorage.orderid = ret.data.orderId;
            }
            else if ($sessionStorage.cinametype == 'spider') {
                $sessionStorage.orderid = ret.data.orderId;
            }
            else if ($sessionStorage.cinametype == 'danche') {
                $sessionStorage.orderid = ret.data.order_id;
            }
            else if ($sessionStorage.cinametype == 'baidu') {
                $sessionStorage.orderid = ret.data.order_id;
            }
            //锁座成功
            $state.go('seatorder', {'id': $stateParams.id, 'type': $stateParams.type}, {reload: true});
        }, function (ret) {
        });
    };
    //返回
    $scope.retunts = function () {
        $state.go('cinamefilms', {'id': $stateParams.id, 'type': $stateParams.type}, {reload: true});
    };
    //浮点小数计算
    function accDiv(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }

    $scope.seatload();
});