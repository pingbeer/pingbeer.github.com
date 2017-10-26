var seatorderModule = angular.module("SeatOrderModule", []);
//订单确认
seatorderModule.controller('seatOrderController', function ($cookieStore, $scope, $rootScope, $http, $state,
                                                            $stateParams, $timeout, $interval, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $scope.paramsid = $stateParams.id;
    $scope.paramsType = $stateParams.type;
    $scope.byordersShow = $sessionStorage.byorders;
    $scope.paytype = 'pay';
    if ($sessionStorage.cinametype == 'dazhong' || $sessionStorage.cinametype == 'meituan' ||
        $sessionStorage.cinametype == 'maoyan' && $scope.paramsType != 6) {
        $scope.paramsName = 'maoyanseat';
    }
    else if ($scope.paramsType != 6) {
        $scope.paramsName = 'seat';
    } else {
        $scope.paramsName = 'allorder';
    }
    $scope.ShowOrder = true;//显示订单
    $scope.ShowPrize = false; //显示选券
    $scope.ShowSign = false; //显示协议
    $scope.ShowActivity = false;//显示活动细则
    $scope.iptmodel = ''; //积分
    $scope.isMyprizes = 1; //是否有观影券; 1有，2无
    $scope.isSee = true; //是否同意
    $scope.freeTrue = false; //是否全用免费
    $scope.tempIds = [];
    /*var isXiyoufuyao = false;
     var isJuezhanshishen = false;
     var isAilezhicheng = false;
     var isFengyueqiaojiaren = false;
     var isHeyuenannv = false;
     var isOubadeqingren = false;
     var isTiancaibushou = false;
     var isYouwanmeiwan = false;
     var isSuduyujiqing = false;
     var isChunjiaojiuzhiming = false;
     var isYinhehuweidui = false;
     var isBuqieryu = false;
     var isLileihehanmeimei = false;
     var isBianxingjingang = false;*/
    var isFanzhuanrensheng = false;
    var isMingyuejishiyou = false;
    var isWuKongZhuan = false;
    var isShenTouNaiBa3 = false;
    //订单信息
    $scope.usernews = function () {
        PH.api('data/applyticket.json', {
            orderId: $sessionStorage.orderid,
            jbzCinemaId: $sessionStorage.jbzCinemaId,
            jbzFilmId: $sessionStorage.jbzFilmId,
            mobile: $sessionStorage.mobile,
            type: $sessionStorage.cinametype == 'dazhong' ||
            $sessionStorage.cinametype == 'meituan' ? 'maoyan' : $sessionStorage.cinametype,
            count: $sessionStorage.seatCount,
            showId: $sessionStorage.showIndex,
            isLoweastForetell: $sessionStorage.byorders
        }, function (ret) {
            $scope.ordernews = ret.data;
            $scope.totalPoint = parseInt(ret.data.point);
            $scope.maxExchangMoney = $scope.totalPoint / 1200;
            $scope.filmOrder = ret.data.filmOrder;
            $scope.orderExt = ret.data.orderExt;
            $scope.seatsJson = JSON.parse($scope.orderExt.seats);
            $scope.hasFastPay = ret.data.hasFastPay; //是否有快捷支付
            /*isXiyoufuyao = ret.data.isXiyoufuyao;
             isJuezhanshishen = ret.data.isJuezhanshishen;
             isAilezhicheng = ret.data.isAilezhicheng;
             isFengyueqiaojiaren = ret.data.isFengyueqiaojiaren;
             isHeyuenannv = ret.data.isHeyuenannv;
             isOubadeqingren = ret.data.isOubadeqingren;
             isTiancaibushou = ret.data.isTiancaibushou;
             isYouwanmeiwan = ret.data.isYouwanmeiwan;
             isSuduyujiqing = ret.data.isSuduyujiqing;
             isChunjiaojiuzhiming = ret.data.isChunjiaojiuzhiming;
             isYinhehuweidui = ret.data.isYinhehuweidui;
             isBuqieryu = ret.data.isBuqieryu;
             isLileihehanmeimei = ret.data.isLileihehanmeimei;
             isBianxingjingang = ret.data.isBianxingjingang;*/
            isFanzhuanrensheng = ret.data.isFanzhuanrensheng;
            isMingyuejishiyou = ret.data.isMingyuejishiyou;
            //是否能用专用券
            $scope.filmNameResult = $scope.ordernews.filmNameResult;

            if ($scope.ordernews.prizeCount > 0) {
                $scope.prizesName = '请选择';
                $scope.availablePrizes = ret.data.availablePrizes;//可用奖券
                for (var i = 0; i < $scope.availablePrizes.length; i++) {
                    $scope.availablePrizes[i].isCheck = 'checkbox';
                }
            } else {
                $scope.prizesName = '您无优惠券';
                $scope.isMyprizes = 2;
            }
            $scope.amount = $scope.filmOrder.amount;
            $scope.lastpay = $scope.filmOrder.amount;
        }, function (ret) {
            if (!$stateParams.id) {
                $state.go('main');
            }
            else {
                if ($sessionStorage.cinametype == 'maoyan' || $sessionStorage.cinametype == 'dazhong'
                    || $sessionStorage.cinametype == 'meituan') {

                    $state.go('maoyanseat', {'id': $stateParams.id}, {reload: true});
                    return;
                }
                $state.go('seat', {'id': $stateParams.id}, {reload: true});
            }
        });
    };
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 200 / 750;
    $scope.activeimg = {
        'width': imgWidth + 'px',
        'height': imgHeight + 'px'
    };
    //显示观影券
    $scope.getPrize = function (type) {
        if (type != 1) {
            return;
        }
        window.scrollTo(0, 0);//滚动到顶部
        $scope.ShowOrder = false;
        $scope.ShowPrize = true;
    };
    //显示阅读细则
    $scope.getActivity = function () {
        window.scrollTo(0, 0);//滚动到顶部
        $scope.ShowOrder = false;
        $scope.ShowActivity = true;
    };
    //显示阅读协议
    $scope.getSign = function () {
        window.scrollTo(0, 0);//滚动到顶部
        $scope.ShowOrder = false;
        $scope.ShowSign = true;
    };
    //是否同意协议
    $scope.seeCheck = './images/checkbox-active.png';
    $scope.getSee = function () {
        $scope.isSee = !$scope.isSee;
        if ($scope.isSee) {
            $scope.seeCheck = './images/checkbox-active.png';
        } else {
            $scope.seeCheck = './images/checkbox.png';
        }
    };
    //显示订单
    $scope.otherHide = function () {
        window.scrollTo(0, 0);//滚动到顶部
        $scope.ShowOrder = true;//显示订单
        $scope.ShowPrize = false; //显示选券
        $scope.ShowSign = false; //显示协议
        $scope.ShowActivity = false;//显示活动细则
    };
    //获取验证码
    $scope.isBtn = true;
    $scope.code = 60;
    $scope.verifyKey = '';
    $scope.getcode = function () {
        PH.api('pay/verifycode', {
            type: $scope.paytype
        }, function (ret) {
            if (!ret.data) {
                return;
            }
            $scope.isBtn = false;
            $scope.paynode = ret.data;
            $scope.verifyKey = $scope.paynode.verifyKey;
            $interval(function () {
                $scope.code = $scope.code - 1;
                if ($scope.code == 0) {
                    $scope.isBtn = true;
                    $scope.code = 60;
                }
            }, 1000, 60);
        }, function (ret) {
            $scope.verifyKey = '';
            $scope.isBtn = true;
            $scope.code = 60;
        });
    };

    $scope.updateCode = function (event) {
        var reg = new RegExp("^[0-9]*$");
        if (event.keyCode != 8) {
            if (!reg.test($scope.iptmodel)) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '请输入数字';
                $scope.iptmodel = '';
                $scope.inpblur();
            }
            if (parseInt($scope.iptmodel) >= parseInt($scope.maxExchangMoney)) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '您当前积分不足';
                $scope.iptmodel = '';
                $scope.inpblur();
            }
            if (parseInt($scope.iptmodel) > $scope.filmOrder.amount) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '超过可抵用金额';
                $scope.iptmodel = '';
                $scope.inpblur();
            }
        }
        else {
            if (!$scope.iptmodel) {
                $scope.iptmodel = '';
            }
        }

        $scope.updatePrice();
    };

    //失去焦点
    $scope.inpblur = function () {
        $('.btn-msg input').blur();
    };
    //积分减
    $scope.pointremove = function () {
        if (!$scope.iptmodel) {
            return;
        }
        $scope.iptmodel = parseInt($scope.iptmodel) - 1;
        $scope.updatePrice();
    };
    //积分加
    $scope.pointadd = function () {
        if (!$scope.iptmodel) {
            $scope.iptmodel = 1;
        } else {
            if (parseInt($scope.iptmodel) >= parseInt($scope.maxExchangMoney)) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '不能继续抵用了';
                return;
            }
            if (parseInt($scope.iptmodel) >= $scope.filmOrder.amount) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '不能继续抵用了';
                return;
            }
            if ($scope.lastpay == 0) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '不能继续抵用了';
                return;
            }
            $scope.iptmodel = parseInt($scope.iptmodel) + 1;
        }
        $scope.updatePrice();
    };
    //运算金额
    $scope.updatePrice = function () {
        //积分
        var iptCode = 0;
        if ($scope.iptmodel) {
            iptCode = parseInt($scope.iptmodel);
        }
        else {
            iptCode = 0;
        }
        //总价
        var _amount = $scope.filmOrder.amount;
        var _needPay = 0;
        var numcount = 0;
        if ($scope.prizeIds.length == 0 && $scope.tempIds.length == 0) {
            $scope.freeTrue = false;
            $scope.paytype = 'pay';
            _needPay = _amount;
        }
        else if ($scope.prizeIds.length > 0 && $scope.tempIds.length == 0) {
            $scope.freeTrue = false;
            $scope.paytype = 'pay';
            _needPay = _amount - $scope.deduct > 1 ? _amount - $scope.deduct : 1;
        }
        else if ($scope.prizeIds.length == 0 && $scope.tempIds.length > 0) {
            for (var i = 0; i < $scope.tempIds.length; i++) {
                if ($scope.tempIds[i].type == 10 || $scope.tempIds[i].type == 9 || $scope.tempIds[i].type == 520 || $scope.tempIds[i].type == 30) {
                    numcount++;
                }
            }
            if (numcount == $scope.filmOrder.count) {
                _needPay = _amount - $scope.deduct;
            } else {
                _needPay = _amount - $scope.deduct > 1 ? _amount - $scope.deduct : 1;
            }
            if (_needPay == 0 && numcount == $scope.filmOrder.count) {
                $scope.freeTrue = true;
                $scope.paytype = 'nopay';
            } else {
                $scope.freeTrue = false;
                $scope.paytype = 'pay';
            }
        }
        $scope.lastpay = _needPay - iptCode ? _needPay - iptCode : 0;
    };
    //选择奖券
    $scope.prizeIds = [];
    $scope.tempIds = [];
    $scope.typearr = [];
    $scope.checkprizes = function (id, index, prizeType) {
        if ($scope.availablePrizes[index].type == 4 || $scope.availablePrizes[index].type == 104 || $scope.availablePrizes[index].type == 204 || $scope.availablePrizes[index].type == 11 || $scope.availablePrizes[index].type == 20 || $scope.availablePrizes[index].type == 280 || $scope.availablePrizes[index].type == 36) {//立减
            //提示
            if ($scope.prizeIds.length == 0 && $scope.tempIds.length > 0) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '抵用券和观影券不能同时使用';
                return;
            }
            if ($scope.typearr) {
                for (var i = 0; i < $scope.typearr.length; i++) {
                    if ($scope.typearr[i] != 4 && $scope.typearr[i] != 104 && $scope.typearr[i] != 204 && $scope.typearr[i] != 11 && $scope.typearr[i] != 20 && $scope.typearr[i] != 280 && $scope.typearr[i] != 36) {
                        $rootScope.errorHidden = false;
                        $rootScope.naomi = '抵用券和观影券不能同时使用';
                        return;
                    }
                }
            }
            if ($scope.prizeIds.length >= 3 && $scope.availablePrizes[index].isCheck == 'checkbox') {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '最多使用3张券';
                return false;
            }
            else if ($scope.prizeIds.length >= $scope.filmOrder.count && $scope.availablePrizes[index].isCheck == 'checkbox') {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '您当前只购买了' + $scope.filmOrder.count + '张';
                return false;
            }
            $scope.commprize(id, index, $scope.availablePrizes[index].type);
        }
        else if ($scope.availablePrizes[index].type != 4 && $scope.availablePrizes[index].type != 104 && $scope.availablePrizes[index].type != 204 && $scope.availablePrizes[index].type != 11 && $scope.availablePrizes[index].type != 20 && $scope.availablePrizes[index].type != 280 && $scope.availablePrizes[index].type != 36) {//观影

            if (!$sessionStorage.byorders) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '请选择带有“券”标记的场次进行使用观影券';
                return;
            }
            /*if ($scope.availablePrizes[index].type == 12 && !isXiyoufuyao) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为西游伏妖专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 13 && !isJuezhanshishen) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为决战食神专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 14 && !isAilezhicheng) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为爱乐之城专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 15 && !isFengyueqiaojiaren) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为疯岳撬佳人专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 16 && !isHeyuenannv) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为合约男女专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 17 && !isOubadeqingren) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为欧爸的情人专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 18 && !isAilezhicheng) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为爱乐之城专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 19 && !isTiancaibushou) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为天才捕手专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 22 && !isYouwanmeiwan) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为有完没完专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 23 && !isSuduyujiqing) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为速度与激情8专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 24 && !isChunjiaojiuzhiming) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为春娇救志明专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 25 && !isYinhehuweidui) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为银河护卫队2专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 26 && !isBuqieryu) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为不期而遇专属券';
             return;
             }

             if (($scope.availablePrizes[index].type == 27 || $scope.availablePrizes[index].type == 28) && !isLileihehanmeimei) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为李雷和韩梅梅专属券';
             return;
             }
             if ($scope.availablePrizes[index].type == 29 && !isBianxingjingang) {
             $rootScope.errorHidden = false;
             $rootScope.naomi = '此券为《变形金刚5》专属券';
             return;
             }*/
            if ($scope.availablePrizes[index].type == 31 && !isFanzhuanrensheng) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '此券为《反转人生》专属券';
                return;
            }
            if ($scope.availablePrizes[index].type == 32 && !isMingyuejishiyou) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '此券为《明月几时有》专属券';
                return;
            }
            if ($scope.filmNameResult.prizeType != prizeType) {
                if (prizeType == 33) {
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '此券《悟空传》专属券';
                    return;
                }
                else if (prizeType == 34) {
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '此券《父子雄兵》专属券';
                    return;
                }
                else if (prizeType == 10000 &&
                    (!($scope.filmNameResult.flag == 'isZhanLang2' || $scope.filmNameResult.flag == 'isZhanLang'))) {
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '此券《战狼2》专属券';
                    return;
                }
                if (prizeType == 10002 &&
                    (!($scope.filmNameResult.flag == 'isZhanLang2' || $scope.filmNameResult.flag == 'isZhanLang'))) {
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '此券《战狼2》专属券';
                    return;
                }
                else if (prizeType == 10001) {
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '此券《三生三世十里桃花》专属券';
                    return;
                }

            }
            if ($scope.tempIds.length >= 3 && $scope.availablePrizes[index].isCheck == 'checkbox') {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '最多使用3张券';
                return false;
            }
            else if ($scope.tempIds.length >= $scope.filmOrder.count && $scope.availablePrizes[index].isCheck == 'checkbox') {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '您当前只购买了' + $scope.filmOrder.count + '张';
                return false;
            }

            //提示
            if ($scope.tempIds.length == 0 && $scope.prizeIds.length > 0) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '抵用券和观影券不能同时使用';
                return;
            }
            if ($scope.typearr) {
                for (var i = 0; i < $scope.typearr.length; i++) {
                    if ($scope.typearr[i] == 4 || $scope.typearr[i] == 104 || $scope.typearr[i] == 204 || $scope.typearr[i] == 11 || $scope.typearr[i] == 20 || $scope.typearr[i] == 280 || $scope.typearr[i] == 36) {
                        $rootScope.errorHidden = false;
                        $rootScope.naomi = '抵用券和观影券不能同时使用';
                        return;
                    }
                }
            }
            //特殊节日不能用券
            /*$scope.now = new Date()
             $scope.month = $scope.now.getMonth() + 1;
             $scope.day = $scope.now.getDate();

             if (($scope.month == 1 && $scope.day == 1) || ($scope.month == 2 && $scope.day == 14) || ($scope.month == 12 && $scope.day == 24) || ($scope.month == 12 && $scope.day == 25) || ($scope.month == 12 && $scope.day == 31)) {
             $scope.text = '特殊日期不得使用十元观影，免费观影';
             $(".errorModel").show();
             return;
             }
             else {
             $scope.commprize(id, index, 2);
             }*/
            $scope.commprize(id, index, $scope.availablePrizes[index].type);
        }
    };
    //对选择的奖券进行判断
    $scope.commprize = function (id, index, type) {
        if ($scope.availablePrizes[index].isCheck == 'checkbox') {
            $scope.availablePrizes[index].isCheck = 'checkbox-active';
            var obj = {
                'id': $scope.availablePrizes[index].id,
                'name': $scope.availablePrizes[index].name,
                'type': $scope.availablePrizes[index].type,
                'price': $scope.availablePrizes[index].price
            };
            if (type == 4 || type == 104 || type == 204 || type == 11 || type == 20 || type == 280 || type == 36) {
                $scope.prizeIds.push(obj);
                $scope.typearr.push(type);
            }
            else if (type != 4 && type != 104 && type != 204 && type != 11 && type != 20 && type != 280 && type != 36) {
                $scope.tempIds.push(obj);
                $scope.typearr.push(type);
            }
        }
        else {
            $scope.availablePrizes[index].isCheck = 'checkbox';

            for (var i = 0; i < $scope.prizeIds.length; i++) {

                if ($scope.prizeIds[i].id == id) {
                    if (type == 4 || type == 104 || type == 204 || type == 11 || type == 20 || type == 280 || type == 36) {
                        $scope.prizeIds.splice(i, 1);
                        $scope.typearr.splice(i, 1);
                    }
                }
            }
            for (var i = 0; i < $scope.tempIds.length; i++) {

                if ($scope.tempIds[i].id == id) {
                    if (type != 4 && type != 104 && type != 204 && type != 11 && type != 20 && type != 280 && type != 36) {
                        $scope.tempIds.splice(i, 1);
                        $scope.typearr.splice(i, 1);
                    }
                }
            }
        }
    };
    //确认奖券,判断金额,奖券数
    $scope.deduct = 0;//应优惠的价格
    $scope.hideprize = function () {
        if ($scope.prizeIds.length > 0) {
            var jten = 0;
            var jfive = 0;
            var random = 0;
            for (var m = 0; m < $scope.prizeIds.length; m++) {
                if ($scope.prizeIds[m].type == 4 || $scope.prizeIds[m].type == 104 || $scope.prizeIds[m].type == 204 || $scope.prizeIds[m].type == 36) {//立减10元券
                    jten++;
                }
                else if ($scope.prizeIds[m].type == 11) {//立减5元券
                    jfive++;
                }
                else if ($scope.prizeIds[m].type == 20 || $scope.prizeIds[m].type == 280) {//随机
                    random = random + $scope.prizeIds[m].price;
                }
            }
            $scope.amount = $scope.filmOrder.amount - (jfive * 5) - (jten * 10) - random;
            $scope.prizesName = '抵用券x' + $scope.prizeIds.length;

        }
        else if ($scope.tempIds.length > 0) {//1、7、10观影,免费
            //单价
            $scope.priceOne = $scope.filmOrder.amount / $scope.filmOrder.count;
            var zero = 0;
            var one = 0;
            var seven = 0;
            var ten = 0;
            for (var m = 0; m < $scope.tempIds.length; m++) {
                /*if ($scope.tempIds[m].type == 5 || $scope.tempIds[m].type == 105 || $scope.tempIds[m].type == 205 || $scope.tempIds[m].type == 12 || $scope.tempIds[m].type == 13 || $scope.tempIds[m].type == 14 || $scope.tempIds[m].type == 15 || $scope.tempIds[m].type == 16 || $scope.tempIds[m].type == 17 || $scope.tempIds[m].type == 19 || $scope.tempIds[m].type == 22 || $scope.tempIds[m].type == 23 || $scope.tempIds[m].type == 24) {
                 ten++;
                 }
                 else */
                if ($scope.tempIds[m].type == 9 || $scope.tempIds[m].type == 10 || $scope.tempIds[m].type == 520 || $scope.tempIds[m].type == 30) {//免费
                    zero++;
                }
                else if ($scope.tempIds[m].type == 18) {//7
                    seven++;
                }
                else if ($scope.tempIds[m].type == 21 || $scope.tempIds[m].type == 25 || $scope.tempIds[m].type == 27 || $scope.tempIds[m].type == 29 || $scope.tempIds[m].type == 10001|| $scope.tempIds[m].type == 10002) {//1
                    one++;
                }
                else {
                    ten++;
                }
            }
            $scope.amount = one + 7 * seven + 10 * ten + (parseInt(parseInt($scope.filmOrder.count) - parseInt($scope.tempIds.length))) * $scope.priceOne;
            $scope.prizesName = '观影券x' + $scope.tempIds.length;
        }
        else {
            $scope.amount = $scope.filmOrder.amount;
            if ($scope.ordernews.prizeCount > 0) {

                $scope.prizesName = '请选择';
            } else {
                $scope.prizesName = '您无优惠券';
            }
        }
        $scope.deduct = $scope.filmOrder.amount - $scope.amount;
        $scope.lastpay = $scope.filmOrder.amount - $scope.deduct;
        $scope.prizeIdsnum = $scope.prizeIds.concat($scope.tempIds);
        $scope.updatePrice();
        $scope.otherHide();
    };

    var errorDialogid = 0; //错误跳转
    //支付
    $scope.pay = function () {
        $state.go('success');
        return;
        if (!$scope.hasFastPay && !$scope.cvv) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '请输入cvv2';
            return false;
        }
        if (!$scope.isSee) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '请仔细阅读相关协议';
            return false;
        }
        if (!$scope.verifyKey) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '请重新获取验证码';
            return false;
        }
        $scope.lastprizeIds = [];
        if ($scope.prizeIdsnum) {
            for (var i = 0; i < $scope.prizeIdsnum.length; i++) {
                $scope.lastprizeIds.push($scope.prizeIdsnum[i].id);
            }
        }

        PH.api('main/buyticket', {
            orderId: $sessionStorage.orderid,
            type: $sessionStorage.cinametype == 'dazhong' ||
            $sessionStorage.cinametype == 'meituan' ? 'maoyan' : $sessionStorage.cinametype,
            payNo: $scope.ordernews.payNo,//网票
            price: $sessionStorage.cinametype == 'maizuo' ? $sessionStorage.sprice : '',
            mobile: $sessionStorage.mobile,
            point: $scope.iptmodel ? parseInt($scope.iptmodel) * 1200 : 0,
            prizeIds: $scope.lastprizeIds ? $scope.lastprizeIds.join(',') : '',
            count: $scope.filmOrder.count,
            cvv2: $scope.cvv ? $scope.cvv : '',
            verifyKey: $scope.verifyKey,
            verifyCode: $scope.paycode
        }, function (ret) {
            $('.orderebate').show();
            PH.api('main/buyresult', {
                orderId: $sessionStorage.orderid
            }, function (ret) {
                $scope.rebate = ret.data.order;
            }, function (ret) {
                $('.orderebate').hide();
                $rootScope.errorHidden = true;
                $state.go('success');
            });
        }, function (ret) {
            $timeout(function () {
                if ($sessionStorage.cinametype == 'dazhong' ||
                    $sessionStorage.cinametype == 'meituan' || $sessionStorage.cinametype == 'maoyan') {
                    $state.go('maoyanseat', {'id': $stateParams.id, 'type': $stateParams.type}, {reload: true});
                }
                else {
                    $state.go('seat', {'id': $stateParams.id, 'type': $stateParams.type}, {reload: true});
                }
                $rootScope.errorHidden = true;
            }, 1000);
        });
    };
    //支付确认
    $scope.payOrder = function () {
        $state.go('success');
        if (!$scope.paynode) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '请先获取验证码';
            return false;
        }
        if (!$scope.paycode) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '验证码为6位数字，请确认验证码';
            return false;
        }
        if (!$scope.freeTrue) {
            $('.orderconfirmModel').show();
            return;
        }
        $('.telModel').show();
    };

    //是否确认用免费券支付
    $scope.dialogpay = function () {
        if (!$scope.prizeIdsnum) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '您当前未选择免费观影券';
            return;
        }
        if ($scope.prizeIdsnum.length == 0) {
            $rootScope.errorHidden = false;
            $rootScope.naomi = '您当前未选择免费观影券';
            return;
        }
        $('.telModel').show();
    };

    //确认
    $scope.Dialog = function () {
        $scope.pay();
    };
    //关闭
    $scope.closeDialog = function () {
        $('.telModel').hide();
    };
    $scope.closeDialog1 = function () {
        $('.orderconfirmModel').hide();
    };

    $scope.usernews();
});
