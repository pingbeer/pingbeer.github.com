

//
/* https://spdbwx.idoupiao.com/superfilm/weekly/robstatus?XSessionId=04479B3D27636CE606470118F48273B4qNjXjUvNKxvOFxpfWUO1%2F9DXACJvdYPN&inType=PDXB&latitude=31.243637&longitude=121.508824 */
/*
https://spdbwx.idoupiao.com/superfilm/weekly/countDown?XSessionId=04479B3D27636CE606470118F48273B4qNjXjUvNKxvOFxpfWUO1%2F9DXACJvdYPN&inType=PDXB&latitude=31.243637&longitude=121.508824 */

var weekModules = angular.module("WeekActivity", []);

weekModules.controller('weekController', function ($scope, $state, $rootScope, $http, $cookieStore, $stateParams,
                                                   $interval, $sessionStorage, PH) {
    //获取卡号
    window.scrollTo(0, 0);//滚动到顶部
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    $scope.status = false;
    $scope.substatus = false;
    $scope.recharge = false;
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 300 / 750;
    $scope.findimg = {
        'width': '100%',
        'height': imgHeight + 'px'
    };
    $scope.xyimgs1 = {
        'width': '100%',
        'height': imgWidth * 565 / 750 + 'px'
    };
    $scope.xyimgs2 = {
        'width': '100%',
        'height': imgWidth * 188 / 703 + 'px',
        'margin-top': '8px'
    };
    $scope.xyimgs3 = {
        'width': '100%',
        'height': imgWidth * 104 / 750 + 'px'
    };
    $scope.countSpr = {
        'margin-left': imgWidth * 72 / 750 + 'px',
        'margin-right': imgWidth * 92 / 750 + 'px',
        'margin-top': imgWidth * 20 / 750 + 'px',
        'line-height': imgWidth * 38 / 750 + 'px',
    };
    $scope.zjstyle = {
        'width': '80%',
        'margin-top': '24px'
    };
    $scope.timestyle = {
        'width': '55%',
        'margin-top': '80px'
    };
    //验证码
    $scope.code = function () {
        window.scrollTo(0, 0);//滚动到顶部
        $scope.codemsg = '';
        var codeLength = 4;//验证码的长度
        var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//随机数
        for (var i = 0; i < codeLength; i++) {//循环操作
            var index = Math.floor(Math.random() * 36);//取得随机数的索引（0~35）
            $scope.codemsg += random[index];//根据索引取得随机数加到code上
        }
    };

    //判断输入验证码
    $scope.checkcodes = '';
    $scope.checkout = function () {
        var inputCode = '';
        if ($scope.setcode) {
            inputCode = $scope.setcode.toUpperCase(); //取得输入的验证码并转化为大写
        }
        if (inputCode.length <= 0) { //若输入的验证码长度为0
            $scope.checkcodes = '您输入的验证码有误';
        }
        else if (inputCode != $scope.codemsg) { //若输入的验证码与产生的验证码不一致时
            $scope.checkcodes = '您输入的验证码有误';
            $scope.code();//刷新验证码
            $scope.setcode = '';//清空文本框
        }
        else {
            $('.sprcodeModel').hide();
            $scope.checkcodes = '';
            $scope.getReward();
        }
    };

    $scope.getChange = function (classtype) {
 /*        if ($scope.status == false && classtype == 'free') {
            $scope.getStatus(classtype);
        } else if ($scope.substatus == false && classtype == 'random') {
            $scope.getStatus(classtype);
        } else if ($scope.recharge == false && classtype == 'recharge') {
            $scope.getStatus(classtype);
        } else {
            $scope.getTickit1(classtype);
        } */
		$scope.getTickit1(classtype);
    };
    //活动时间
    $scope.weekTime = function () {
        PH.api('weekly/countDown', {}, function (ret) {
            var time = ret.data;
            var sstime = parseInt(time / 60);
            var mmtime = time - sstime * 60;
            $scope.showss = "0" + sstime;
            $scope.showmm = mmtime >= 10 ? mmtime : '0' + mmtime;
            $interval(function () {
                time = time - 1;
                if (time == 0) {
                    $('.timeModel').hide();
                    $rootScope.getStatus(1);
                    return;
                }
                sstime = parseInt(time / 60);
                mmtime = time - sstime * 60;
                $scope.showss = "0" + sstime;
                $scope.showmm = mmtime >= 10 ? mmtime : '0' + mmtime;
            }, 1000, time);
            $('.timeModel').show();
        }, function (ret) {

			//修改过的地方
			 $rootScope.getStatus(1);

         //   $rootScope.errorHidden = true;
          //  $scope.tips = '活动尚未开始,请稍后!';
           // $scope.signtext = '活动尚未开始,请稍后!';
           // $('.sprtipsModel').show();
        });
    };
    //第一步
    var valueType = '';
    $scope.getTickit1 = function (value) {
        valueType = value;
        PH.api('weekly/prelottery', {
            inType: $rootScope.inType
        }, function (ret) {
            $scope.activityFirst = ret.data.weeklyRobPath;
            $scope.code();
            $('.sprcodeModel').show();
        }, function (ret) {
            rootscope.errorHidden = true;
            $scope.signtext = ret.message;
            $scope.tips = ret.message;
            $('.sprtipsModel').show();
        });
    };

    //第二步
    var inter;
    $scope.getReward = function () {
        PH.api($scope.activityFirst, {
            inType: $rootScope.inType,
            type: valueType
        }, function (ret) {
            $('.sprtipsModels').show();
            $scope.signtext = '努力抢票中,请稍后...';
            inter = $interval(function () {
                $rootScope.getStatus(2);
            }, 4000, 1);
        }, function (ret) {
            $rootScope.errorHidden = true;
            $scope.signtext = ret.message;
            $scope.tips = ret.message;
            $('.sprtipsModel').show();
        });
    };

    //第三步
    var date = new Date();

    var nowdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // 如果status 返回 1,2,3 表示成功
    //{"data":{"prizeInfo":"活动未开始！","encryptCardNo":"6222********2018","status":5},"errorCode":0,"message":"请求成功"}
    $rootScope.getStatus = function (type) {
        PH.api('weekly/robstatus', {
            inType: $rootScope.inType
        }, function (ret) {
            $interval.cancel(inter);
            $('.sprtipsModels').hide();
            $scope.encryptCardNo = ret.data.encryptCardNo;
            $sessionStorage.encryptCardNo = ret.data.encryptCardNo;
            if (ret.data.status == 0) {
                $scope.status = ret.data.remainPrize.lotteryFree;
                $scope.substatus = ret.data.remainPrize.lotteryRandom;
                $scope.recharge = ret.data.remainPrize.lotteryRecharge;
            } else {
                $scope.status = false;
                $scope.substatus = false;
                $scope.recharge = false;
            }
            if (type == 2) {

                if (ret.data.status == 4) {
                    $scope.tips = '很遗憾，您没有抢到!';
                    $scope.signtext = '很遗憾，您没有抢到!';
                    $('.sprtipsModel').show();
                }
                else if (ret.data.status == 0) {
                    $scope.signtext = ret.data.prizeInfo;
                    $scope.tips = ret.data.prizeInfo;
                    $('.sprtipsModel').show();
                }
                else if (ret.data.status == 5) {
                    $scope.signtext = '活动尚未开始,请稍后!';
                    $scope.tips = '活动尚未开始,请稍后!';
                    $('.sprtipsModel').show();
                }
                else if (ret.data.status == 6) {
                    $scope.signtext = '本次活动名额已抢完,下次请赶早!';
                    $scope.tips = '本次活动名额已抢完,下次请赶早!';
                    $('.sprtipsModel').show();
                }
                else if (ret.data.status == 1 || ret.data.status == 2 || ret.data.status == 3) {
                    $scope.tips = '当前账户' + $scope.encryptCardNo + '<br/>于' + nowdate + '<br/>获得1张' + ret.data.prizeInfo;
                    $('.sprzjModel').show();
                } else {
                    $scope.signtext = ret.data.prizeInfo;
                    $scope.tips = ret.data.prizeInfo;
                    $('.sprtipsModel').show();
                }
            }
            else if (type != 2) {

                if (ret.data.status == 1 || ret.data.status == 2 || ret.data.status == 3) {
                    $scope.tips = '当前账户' + $scope.encryptCardNo + '<br/>于' + nowdate + '<br/>获得1张' + ret.data.prizeInfo;
                    $scope.signtext = '当前账户' + $scope.encryptCardNo + '<br/>于' + nowdate + '<br/>获得1张' + ret.data.prizeInfo;
                }
                else if (ret.data.status == 4) {
                    $scope.tips = '很遗憾，您没有抢到!';
                    $scope.signtext = '很遗憾，您没有抢到!';
                }
                else if (ret.data.status == 5) {
                    $scope.weekTime();
                    return;
                }
                else if (ret.data.status == 6) {
                    $scope.tips = '本次活动名额已抢完,下次请赶早!';
                    $scope.signtext = '本次活动名额已抢完,下次请赶早!';
                }
                else if (ret.data.status == 0) {
                    if ($scope.status == false && type != 1) {
                        $scope.tips = '本奖品名额已抢完,下次请赶早!';
                        $scope.signtext = '本奖品名额已抢完,下次请赶早!';
                        $('.sprtipsModel').show();
                    }
                    else if ($scope.substatus == false && type != 1) {
                        $scope.tips = '本奖品名额已抢完,下次请赶早!';
                        $scope.signtext = '本奖品名额已抢完,下次请赶早!';
                        $('.sprtipsModel').show();

                    }
                    else if ($scope.recharge == false && type != 1) {
                        $scope.tips = '本奖品名额已抢完,下次请赶早!';
                        $scope.signtext = '本奖品名额已抢完,下次请赶早!';
                        $('.sprtipsModel').show();
                    }
                    return;
                } else {
                    $scope.tips = ret.data.prizeInfo;
                    $scope.signtext = ret.data.prizeInfo;
                }
                $('.sprtipsModel').show();
            }
        }, function (ret) {
            $rootScope.errorHidden = true;
            $scope.status = false;
            $scope.substatus = false;
            $scope.recharge = false;
            $scope.signtext = ret.message;
            $scope.tips = ret.message;
            $('.sprtipsModel').show();
        });
    };

    //中奖列表
    $scope.datelast = function ($last) {
        if ($last) {
            $('.list_lh').myScroll({
                speed: 40, //数值越大，速度越慢
                rowHeight: 30 //li的高度
            });
        }
    };
    //关闭
    $scope.closeDialog = function () {
        $('.sprtipsModel').hide();
    };

    $scope.closeSpr = function () {
        $('.sprcodeModel').hide();
    };

    $scope.sprzjHide = function () {
        $('.sprzjModel').hide();
    };
    $scope.sprzjHide();
    $rootScope.getStatus(1);
    //$scope.getRewardList();

});


//规则
var weekRulefy = angular.module("WeekRuleModule", []);
weekRulefy.controller('WeekRuleController', function ($scope, $state) {
    window.scrollTo(0, 0);//滚动到顶部
});
//引导图
var droiyanDirectionfy = angular.module("DroiyanDirectionActivity", []);
//
droiyanDirectionfy.controller('droiyanDirectionController', function ($scope, $state) {
    window.scrollTo(0, 0);//滚动到顶部
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 300 / 750;
    $scope.dirbody = {
        'height': $(window).height() - 20 + 'px'
    };
    $scope.direction1 = {
        'width': '100%',
        'height': imgWidth * 360 / 750 + 'px',
    };
    $scope.direction2 = {
        'width': '100%',
        'height': imgWidth * 310 / 750 + 'px',
    };
});
//周周抢中奖记录
var weekhistory = angular.module("WeekHistoryModule", []);
//
weekhistory.controller('WeekHistoryController', function ($scope, $state, $sessionStorage, $rootScope, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    $scope.isHistory = false;
    $scope.ckedcode = true;
    var lasttype = 1;
    var lastkey = 0;
    $scope.cgcode = function (type) {
        if (type == lasttype) {
            return;
        }
        window.scrollTo(0, 0);//滚动到顶部
        $scope.weeklist = '';
        lastkey = 0;
        lasttype = type;
        $scope.ckedcode = !$scope.ckedcode;
        $scope.load(type);
    };

    var imgHeight = $(window).height();
    $scope.wkhistory = {
        'background': "url('./images/wkbg.png') 0 center no-repeat",
        'background-size': 'contain',
        'height': imgHeight + 'px',
        'width': $(window).width() + 'px',
        'position': 'fixed',
        'z-index': '-1',
        'top': '0px',
        'background-color': '#d3b296',
        'overflow': 'hide'
    };
    $scope.wkcount = {
        'height': imgHeight - 140 + 'px',
        'overflow-y': 'auto',
        'margin-top':'110px'
    };
    $scope.type = 1;
    $scope.load = function (type) {
        lastkey++;
        PH.api('weekly/weeklyrobrecord', {
            inType: $rootScope.inType,
            type: type,
            lastkey: lastkey
        }, function (ret) {
            if (ret.data.length == 0) {
                $scope.isHistory = false;
                $scope.errormessage = '暂无中奖记录';
                return;
            }
            if (lastkey > 1) {
                $scope.weeklist = $scope.weeklist.concat(ret.data);
            }
            else {
                $scope.weeklist = ret.data;
            }
            $scope.weekCount = ret.data.length;
            $scope.isHistory = true;

        }, function (ret) {
            $scope.errormessage = '暂无中奖记录';
        });
    };
    $scope.load(1);

    var time1 = '';
    $scope.myPagingFunction = function () {
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
        if ($scope.weekCount == 20) {
            $scope.load(lasttype);
        }
    };
});



