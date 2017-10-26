var droiyanModules = angular.module("DroiyanActivity", []);

droiyanModules.controller('droiyanController', function ($scope, $state, $rootScope, $http, $cookieStore,
                                                         $stateParams, $interval, $sessionStorage, PH) {
    //获取卡号

    window.scrollTo(0, 0);//滚动到顶部
    $rootScope.pagetype = 0;
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    $scope.showimg = 'images/hao.png';
    $scope.currimg = 'bs';
    $scope.currname = '速度与激情8';
    if ($rootScope.orderType == 'PFWX' && $stateParams.type == 2) {
        $state.go('find');
        return;
    }
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 300 / 750;
    $scope.findimg = {
        'width': '100%',
        'height': imgHeight + 'px'
    };
    $scope.xyimgs1 = {
        'width': '100%',
        'height': imgWidth * 240 / 750 + 'px'
    };
    $scope.xyimgs2 = {
        'width': '100%',
        'height': imgWidth * 410 / 750 + 'px'
    };
    $scope.vxyimgs2 = {
        'width': '100%',
        'height': imgWidth * 470 / 750 + 'px'
    };
    $scope.xyimgs3 = {
        'width': '100%',
        'height': imgWidth * 310 / 750 + 'px'
    };
    $scope.countSpr = {
        'margin-left': imgWidth * 72 / 750 + 'px',
        'margin-right': imgWidth * 92 / 750 + 'px',
        'margin-top': imgWidth * 10 / 750 + 'px',
        'line-height': imgWidth * 38 / 750 + 'px',
    };
    $scope.vcountSpr = {
        'margin-left': imgWidth * 72 / 750 + 'px',
        'margin-right': imgWidth * 92 / 750 + 'px',
        'margin-top': imgWidth * 30 / 750 + 'px',
        'line-height': imgWidth * 38 / 750 + 'px',
    };
    $scope.zjstyle = {
        'width': '100%'
    };

    //石头剪刀布
    $scope.uiPlayType = 0;
    $scope.uiPlay = function (type) {
        if ($scope.uiPlayType != 0) {
            return;
        }
        $scope.showTypes = type;
        $scope.uiPlayType = type;
        $scope.showimg = 'images/hdimg-s3.png';
        $scope.getReward();
    };
    $scope.newsPage = function (index) {
        if (index == 1) {
            $state.go('main', {reload: true});
            $sessionStorage.filmIndex = 0;
        }
        else if (index == 2) {
            $state.go('films', {reload: true});
        }
        else if (index == 3) {
            $state.go('ciname', {reload: true});
        }
        else if (index == 4) {
            $state.go('mine', {reload: true});
        }
        else if (index == 5) {
            $state.go('find', {reload: true});
        }
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
            $('.sprtipsModels').show();
        }
    };
    //第一步
    $scope.getTickit1 = function () {
        PH.api('rob/prelottery', {
            inType: $rootScope.inType,
            robType: $stateParams.type
        }, function (ret) {
            $scope.activityFirst = ret.data.robPath;
            $scope.activitySecond = ret.data.robStatusPath;
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
    $scope.getReward = function () {
        PH.api($scope.activityFirst, {
            inType: $rootScope.inType,
            robCount: '',
            robType: $stateParams.type
        }, function (ret) {
            var si = 3;
            $interval(function () {
                si--;
                if (si != 0) {
                    $scope.showimg = 'images/hdimg-s' + si + '.png';
                }
                if (si == 1) {
                    $rootScope.getStatus(2);
                }
            }, 1300, 3);

        }, function (ret) {
            rootscope.errorHidden = true;
            $scope.signtext = ret.message;
            $scope.tips = ret.message;
            $('.sprtipsModel').show();
        });
    };

    //第三步
    $rootScope.getStatus = function (type) {
        PH.api('rob/robstatus', {
            inType: $rootScope.inType,
            robType: $stateParams.type
        }, function (ret) {
            /*$interval.cancel(inter);
             $('.sprtipsModels').hide();*/
            $scope.encryptCardNo = ret.data.encryptCardNo;
            $sessionStorage.encryptCardNo = ret.data.encryptCardNo;
            if (ret.data.status == 0) {
                $scope.status = true;
            } else {
                $scope.status = false;
            }
            if (type != 1) {
                if (ret.data.status == 4) {
                    if ($scope.uiPlayType == 1) {//石头
                        $scope.showimg = 'images/bu.png';
                    }
                    else if ($scope.uiPlayType == 2) {//剪刀
                        $scope.showimg = 'images/shitou.png';
                    }
                    else if ($scope.uiPlayType == 3) {//布
                        $scope.showimg = 'images/jiandao.png';
                    }
                    $interval(function () {
                        $('.sprtipsModels').hide();
                        $('.sprerrModel').show();
                        $scope.signtext = '非常遗憾，观影券与你擦肩而过!';
                        $scope.tips = '非常遗憾，观影券与你擦肩而过!';
                    }, 3000, 1);
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
                else if (ret.data.status == 8) {
                    $scope.signtext = '您未获得钻石场参与资格!';
                    $scope.tips = '您未获得钻石场参与资格!';
                    $('.sprtipsModel').show();
                }
                else if (ret.data.status == 1 || ret.data.status == 2 || ret.data.status == 3) {

                    if (ret.data.status == 1) {
                        $scope.sprjimg = './images/' + $scope.currimg + '-img1.png';
                        $scope.tips = '当前账户' + $scope.encryptCardNo + '，您获得1张《' + $scope.currname + '》10元观影券';
                    }
                    else if (ret.data.status == 2) {
                        $scope.sprjimg = './images/' + $scope.currimg + '-img2.png';
                        $scope.tips = '当前账户' + $scope.encryptCardNo + '，您获得2张《' + $scope.currname + '》10元观影券';
                    }
                    else if (ret.data.status == 3) {
                        $scope.sprjimg = './images/' + $scope.currimg + '-img3.png';
                        $scope.tips = '当前账户' + $scope.encryptCardNo + '，您获得3张《' + $scope.currname + '》10元观影券';
                    }

                    if ($scope.uiPlayType == 1) {//石头
                        $scope.showimg = 'images/jiandao.png';
                    }
                    else if ($scope.uiPlayType == 2) {//剪刀
                        $scope.showimg = 'images/bu.png';
                    }
                    else if ($scope.uiPlayType == 3) {//布
                        $scope.showimg = 'images/shitou.png';
                    }
                    $interval(function () {
                        $('.sprtipsModels').hide();
                        $('.sprzjModel').show();
                    }, 3000, 1);
                    /*if ($scope.uiPlayType == 1) {//石头
                     $scope.showimg = 'images/bu.png';
                     }
                     else if ($scope.uiPlayType == 2) {//剪刀
                     $scope.showimg = 'images/shitou.png';
                     }
                     else if ($scope.uiPlayType == 3) {//布
                     $scope.showimg = 'images/jiandao.png';
                     }
                     $interval(function () {
                     $('.sprtipsModels').hide();
                     $('.sprerrModel').show();
                     $scope.signtext = '非常遗憾，观影券与你擦肩而过!';
                     $scope.tips = '非常遗憾，观影券与你擦肩而过!';
                     }, 3000, 1);*/
                } else {
                    $scope.signtext = ret.data.prizeInfo;
                    $scope.tips = ret.data.prizeInfo;
                    $('.sprtipsModel').show();
                }
            }
            else {
                if (ret.data.status == 1) {
                    /*$scope.tips = '当前账户' + $scope.encryptCardNo + '，您已获得1张《' + $scope.currname + '》10元观影券';
                     $scope.signtext = '当前账户' + $scope.encryptCardNo + '，您已获得1张《' + $scope.currname + '》10元观影券';*/
                    $scope.tips = '非常遗憾，观影券与你擦肩而过';
                    $scope.signtext = '非常遗憾，观影券与你擦肩而过';
                }
                else if (ret.data.status == 2) {
                    $scope.tips = '当前账户' + $scope.encryptCardNo + '，您已获得2张《' + $scope.currname + '》10元观影券';
                    $scope.signtext = '当前账户' + $scope.encryptCardNo + '，您已获得2张《' + $scope.currname + '》10元观影券';
                    /*   $scope.tips = '非常遗憾，观影券与你擦肩而过';
                     $scope.signtext = '非常遗憾，观影券与你擦肩而过';*/
                }
                else if (ret.data.status == 3) {
                    /* $scope.tips = '当前账户' + $scope.encryptCardNo + '，您已获得3张《' + $scope.currname + '》10元观影券';
                     $scope.signtext = '当前账户' + $scope.encryptCardNo + '，您已获得3张《' + $scope.currname + '》10元观影券';*/
                    $scope.tips = '非常遗憾，观影券与你擦肩而过';
                    $scope.signtext = '非常遗憾，观影券与你擦肩而过';
                }
                else if (ret.data.status == 4) {
                    $scope.tips = '非常遗憾，观影券与你擦肩而过';
                    $scope.signtext = '非常遗憾，观影券与你擦肩而过';
                }
                else if (ret.data.status == 5) {
                    var timeshow = '';
                    if ($stateParams.type == 2) {
                        timeshow = "本次活动仅限钻石用户参与，活动观影券随机发放<br />活动时间：2017年4月14日14点起";
                    } else {
                        timeshow = "活动尚未开始,请稍后!本次活动观影券随机发放<br />活动时间：2017年4月14日11点起";
                    }
                    $scope.signtext = timeshow;
                    $scope.tips = timeshow;
                }
                else if (ret.data.status == 6) {
                    $scope.tips = '本次活动名额已抢完,下次请赶早!';
                    $scope.signtext = '本次活动名额已抢完,下次请赶早!';
                }
                else if (ret.data.status == 8) {
                    $scope.signtext = "本次活动仅限钻石用户参与，活动观影券随机发放 <br />活动时间：2017年4月14日14点起";
                    $scope.tips = "本次活动仅限钻石用户参与，活动观影券随机发放 <br />活动时间：2017年4月14日14点起";
                    $('.sprtipsModel').show();
                }
                else if (ret.data.status == 0) {
                    var timeshow = '';
                    if ($stateParams.type == 2) {
                        timeshow = "本次活动仅限钻石用户参与，活动观影券随机发放 <br />活动时间：2017年4月14日14点起";
                    } else {
                        timeshow = "本次活动观影券随机发放<br />活动时间：2017年4月14日11点起";
                    }
                    $scope.signtext = timeshow;
                    $scope.tips = timeshow;
                    $('.sprtipsModel').show();
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
            $scope.signtext = ret.message;
            $scope.tips = ret.message;
            $('.sprtipsModel').show();
        });
    };

    //中奖列表
    /*  $scope.getRewardList = function () {
     PH.api('activity/latestrecords', {
     inType: $rootScope.inType
     }, function (ret) {
     $scope.prizeInfos = ret.data.list;
     }, function (ret) {
     $('.sprtipsModel').show();
     $scope.signtext = ret.message;
     });
     };*/
    $scope.datelast = function ($last) {
        if ($last) {
            $('.list_lh').myScroll({
                speed: 40, //数值越大，速度越慢
                rowHeight: 30 //li的高度
            });
        }
    };
    //中奖记录
    $scope.getjl = function () {
        $('.sprtipsModel').show();
        $scope.signtext = $scope.tips;
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
    $scope.sprerrHide = function () {
        $('.sprerrModel').hide();
    };
    $scope.sprzjHide();
    $rootScope.getStatus(1);
    //$scope.getRewardList();

});


//规则
var droiyanRulefy = angular.module("DroiyanRuleModule", []);

droiyanRulefy.controller('droiyanRuleController', function ($scope, $state) {
    window.scrollTo(0, 0);//滚动到顶部
});
var VdroiyanRulefy = angular.module("VDroiyanRuleModule", []);

VdroiyanRulefy.controller('VdroiyanRuleController', function ($scope, $state) {
    window.scrollTo(0, 0);//滚动到顶部
});
//引导图
var droiyanDirectionfy = angular.module("DroiyanDirectionActivity", []);
//
droiyanDirectionfy.controller('droiyanDirectionController', function ($scope, $state, $stateParams) {
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
    $scope.returns = function () {
        if ($stateParams.id == 1) {
            $state.go('wan', {'type': 1});
        } else if ($stateParams.id == 2) {
            $state.go('vipsudu', {'type': 2});
        }
    }
});


