var feserveModules = angular.module("FeserveModule", []);

//包场活动
feserveModules.controller('FeserveController', function ($scope, $state, $rootScope, $sessionStorage, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    var imgWidth = $(window).width();
    $scope.btnShow = 1;
    //用户当前状态
    $scope.resultMum = 0;
    $scope.baochangmgs1 = {
        'width': '100%',
        'height': imgWidth * 370 / 750 + 'px'
    };
    $scope.baochangmgs2 = {
        'width': '100%',
        'height': imgWidth * 223 / 750 + 'px'
    };
    $scope.tisBg = {
        'width': '100%',
        'height': imgWidth * 589 / 569 + 'px'
    };
    $scope.sucessBg = {
        'width': '100%',
        'height': imgWidth * 669 / 680 + 'px',
        'margin-top': 10 + '%'
    };

    //当前的信息
    $scope.reserveMsg = function () {
        PH.api('bookcinema/index', {
            cityId: $sessionStorage.cityId
        }, function (ret) {
            if (ret.data.status == 3) {

                $scope.btnShow = 1;
            }
            else {
                $scope.btnShow = 2;
            }
            if (ret.data.status == 0) {
                $scope.messages = ret.data.message;
                $('.reserveModel').show();
            }
            else if (ret.data.status == 1) {
                $scope.messages = ret.data.message;
                $('.reserveModel').show();
            }
            else if (ret.data.status == 2) {
                $scope.messages = ret.data.message;
                $('.reserveModel').show();
            }
            else if (ret.data.status == 3) {
                $scope.cinemasMsg = ret.data.cinemas[0];
                //正常抽奖
                $('.reserveTis').show();
            }
            else if (ret.data.status == 4) {
                $scope.cinemasMsg = ret.data.cityNames;
                $scope.messages = '参与包场活动的城市：' + $scope.cinemasMsg.join('、');
                $scope.messagesTemp = $scope.messages;
                $('.reserveModel').show();
            } else {
                $scope.messages = ret.data.message;
                $('.reserveModel').show();
            }
        }, function (ret) {
            $scope.btnShow = 2;
        });
    };

    //确认当前信息
    $scope.confirmMsg = function () {
        $('.reserveTis').hide();
        $scope.userStatus(1);
    };


    $scope.userStatus = function (type) {
        PH.api('bookcinema/robstatus', {
            cityId: $sessionStorage.cityId
        }, function (ret) {
            if (ret.data.status == 0) {
                $scope.btnShow = 1;
            }
            else {
                $scope.btnShow = 2;
            }
            if (ret.data.status == 0) {

            }
            else if (ret.data.status == 1) {//未付款
                $scope.encryptCardNo = ret.data.encryptCardNo;
                //订单信息
                $('.reserveSucess').show();
                $scope.btnShow = 3;
            }
            else if (ret.data.status == 2) {//抽中
                $scope.resultMum = 2;
                $scope.activeResult();
            }
            else if (ret.data.status == 3) {//没抽中
                $scope.messages = ret.data.prizeInfo;
                $('.reserveModel').show();
            }
            else if (ret.data.status == 4) {
                $scope.messages = ret.data.prizeInfo;
                $('.reserveModel').show();
            }
            else if (ret.data.status == 5) {
                $scope.messages = ret.data.prizeInfo;
                $('.reserveModel').show();
            }
            else if (ret.data.status == 6) {
                $scope.messages = ret.data.prizeInfo;
                $('.reserveModel').show();
            }
            else if (ret.data.status == 8) {
                $scope.messages = ret.data.prizeInfo;
                $('.reserveModel').show();
            }
            else if (ret.data.status == 9) {
                $scope.resultMum = 9;
                $scope.messages = ret.data.prizeInfo;
                $scope.resultMsg = ret.data.prizeInfo;
                $('.reserveModel').show();
            }
            else {
                $scope.messages = $scope.messagesTemp;
                $('.reserveModel').show();
            }
        }, function (ret) {
            $scope.btnShow = 2;
        });
    };

    //抽奖
    $scope.activeDraw = function () {
        PH.api('bookcinema/rob', {
            cityId: $sessionStorage.cityId,
            cinemaId: $scope.cinemasMsg.cinemaId
        }, function (ret) {
            $scope.encryptCardNo = ret.data.cardNo;
            //订单信息
            $('.reserveSucess').show();
        }, function (ret) {
            $scope.btnShow = 2;
        });
    };

    //去支付
    $scope.payOrder = function () {
        $('.reserveSucess').hide();
        $state.go('reserveOrder', {
            'id': $scope.cinemasMsg.cinemaId
        })
        ;
    };

    //放弃资格
    $scope.cancelorder = function () {
        PH.api('bookcinema/cancelorder', {
            cityId: $sessionStorage.cityId
        }, function (ret) {
            $('.reserveSucess').hide();
            $scope.btnShow = 1;
        }, function (ret) {

        });
    };

    //购票结果
    $scope.activeResult = function () {
        if ($scope.resultMum == 9) {
            $scope.messages = $scope.resultMsg;
            $rootScope.errorHidden = true;
            $('.reserveModel').show();
            return;
        }
        PH.api('bookcinema/orderresult', {
            cityId: $sessionStorage.cityId,
            cinemaId: ''//$scope.cinemasMsg.cinemaId
        }, function (ret) {
            $scope.result = ret.data;
            var seatInfo = ret.data.seatInfo.split('|');
            if (seatInfo) {
                $scope.seatInfo = '';
                for (var i = 0; i < seatInfo.length; i++) {
                    var obj = seatInfo[i].split(':');
                    $scope.seatInfo = obj[0] + '排' + obj[1] + '座' + '、' + $scope.seatInfo;
                }
            }
            if ($scope.result.ticketId) {
                $scope.messages = '您已抢票成功，城市为' + $scope.result.cityName + '，凭取票码' + $scope.result.ticketId + '获取影院为：' + $scope.result.cinemaName + '影厅为：' + $scope.result.hallName + '场次为' + $scope.result.showTime;
            }
            else {
                if ($scope.result.cinemaId == '804751' || $scope.result.cinemaId == '806937') {
                    $scope.messages = '您已抢票成功，城市为' + $scope.result.cityName + '座位为：' + $scope.seatInfo + '影院为：' + $scope.result.cinemaName + '影厅为：' + $scope.result.hallName + '场次为' + $scope.result.showTime + '，取票码信息会在2个工作日内发放至您的手机，请注意查收';
                }
                else {
                    $scope.messages = '您已抢票成功，城市为' + $scope.result.cityName + '座位为：' + $scope.seatInfo + '影院为：' + $scope.result.cinemaName + '影厅为：' + $scope.result.hallName + '场次为' + $scope.result.showTime + '，请出示购票成功短信息联系影院人员入场';
                }
            }
            $('.reserveModel').show();
        }, function (ret) {
            $scope.messages = ret.message;
            $rootScope.errorHidden = true;
            $('.reserveModel').show();
        });
    };

    $scope.reserveMsg();
    //$scope.userStatus();
    //关闭弹框
    $scope.closeModel = function () {
        $('.reserveModel').hide();
    };

    $scope.closeReserve = function () {
        $scope.btnShow = 3;
        $('.reserveSucess').hide();
    };
});

//订单
var feserveOrder = angular.module("FeserveOrderModule", []);
feserveOrder.controller('FeserveOrderController', function ($scope, $state, $rootScope, $stateParams, $interval, $sessionStorage, PH) {
    //订单信息
    $scope.second = '00';
    $scope.minute = '00';
    $scope.pagyBtn = true;
    window.scrollTo(0, 0);//滚动到顶部
    var imgWidth = $(window).width();
    $scope.sucessBg = {
        'width': '100%',
        'height': imgWidth * 669 / 680 + 'px',
        'margin-top': 10 + '%'
    };
    $scope.activeOorder = function () {
        PH.api('bookcinema/orderpage', {
            cityId: $sessionStorage.cityId,
            cinemaId: $stateParams.id
        }, function (ret) {
            $scope.hasFastPay = ret.data.hasFastPay;
            $scope.orderInfo = ret.data.orderInfo;
            $scope.expireTime = $scope.orderInfo.expireTime;
            var expireTime = new Date($scope.expireTime);
            var year = expireTime.getFullYear();
            var month = expireTime.getMonth() + 1;
            month = month > 9 ? month : '0' + month;
            var date = expireTime.getDate() > 9 ? expireTime.getDate() : '0' + expireTime.getDate();
            var hours = expireTime.getHours() > 9 ? expireTime.getHours() : '0' + expireTime.getHours();
            var minute = expireTime.getMinutes() > 9 ? expireTime.getMinutes() : '0' + expireTime.getMinutes();
            $scope.deadtime = year + '-' + month + '-' + date + ' ' +
                hours + ':' + minute;
        }, function (ret) {
            $rootScope.errorHidden = true;
            $scope.messages = ret.message;
            $('.reserveModel1').show();
        });
    };

    //获取验证码
    $scope.isBtn = true;
    $scope.codeNum = 60;
    $scope.verifyKey = '';
    $scope.getcode = function () {
        PH.api('pay/verifycode', {
            type: 'pay'
        }, function (ret) {
            if (!ret.data) {
                return;
            }
            $scope.isBtn = false;
            $scope.paynode = ret.data;
            $scope.verifyKey = $scope.paynode.verifyKey;
            $interval(function () {
                $scope.codeNum = $scope.codeNum - 1;
                if ($scope.codeNum == 0) {
                    $scope.isBtn = true;
                    $scope.codeNum = 60;
                }
            }, 1000, 60);
        }, function (ret) {
            $scope.isBtn = true;
            $scope.codeNum = 60;
        });
    };

    //购票
    $scope.activeConfirm = function () {
        if (!$scope.verifyKey) {
            $scope.messages = '请获取验证码';
            $('.reserveModel').show();
            return;
        }
        else if (!$scope.code) {
            $scope.messages = '请输入验证码';
            $('.reserveModel').show();
            return;
        }
        else if (!$scope.tel) {
            $scope.messages = '请输入手机号';
            $('.reserveModel').show();
            $scope.tel = '';
            return;
        }
        PH.api('bookcinema/confirmorder', {
            cityId: $sessionStorage.cityId,
            hasFastPay: $scope.hasFastPay,
            cvv2: $scope.cvv2 ? $scope.cvv2 : '',
            verifyCode: $scope.code,
            verifyKey: $scope.verifyKey,
            mobile: $scope.tel
        }, function (ret) {
            //购票结果
            $scope.activeResult()
        }, function (ret) {
            $rootScope.errorHidden = true;
            $scope.messages = ret.message;
            if (ret.errorCode == '2017060601' || ret.errorCode == '2017060602') {
                $('.reserveModel1').show();
            } else {
                $('.reserveModel').show();
            }
        });
    };

    //购票结果
    $scope.activeResult = function () {
        PH.api('bookcinema/orderresult', {
            cityId: $sessionStorage.cityId,
            cinemaId: $stateParams.id
        }, function (ret) {
            $state.go('reserveSuccess', {id: $stateParams.id});
        }, function (ret) {
        });
    };

    $scope.activeOorder();

    //关闭弹框
    $scope.closeModel = function (type) {
        $('.reserveModel').hide();
        if (type == 2) {
            $('.reserveModel1').hide();
            $state.go('reserve');
        }
    };
});

//成功
var feserve = angular.module("ReserveSuccessModule", []);
feserve.controller('ReserveSuccessController', function ($scope, $state, $rootScope, $stateParams, $interval, $sessionStorage, PH) {
    //订单信息
    $scope.second = '00';
    $scope.minute = '00';
    $scope.pagyBtn = true;
    window.scrollTo(0, 0);//滚动到顶部
    var imgWidth = $(window).width();
    $scope.sucessBg = {
        'width': '100%',
        'height': imgWidth * 669 / 680 + 'px',
        'margin-top': 10 + '%'
    };
    //购票结果
    $scope.activeResult = function () {
        PH.api('bookcinema/orderresult', {
            cityId: $sessionStorage.cityId,
            cinemaId: $stateParams.id
        }, function (ret) {
            $scope.result = ret.data;
            var seatInfo = ret.data.seatInfo.split('|');
            if (seatInfo) {
                $scope.seatInfo = [];
                for (var i = 0; i < seatInfo.length; i++) {
                    var obj = seatInfo[i].split(':');
                    $scope.seatInfo.push(obj[0] + '排' + obj[1] + '座');
                }
            }
            console.log($scope.seatInfo);
        }, function (ret) {
        });
    };
    //关闭弹框
    $scope.closeModel = function () {
        $('.reserveModel').hide();
    };
    $scope.activeResult();
});