var droiyanModules = angular.module("DroiyanActivity", []);

droiyanModules.controller('droiyanController', function ($scope, $state, $rootScope, $http, $cookieStore,
                                                         $stateParams, $interval, $sessionStorage, PH) {
    //获取卡号
    // 4530 //PDXB 1 12
    // alert($rootScope.inType);//PDXB
    // alert($stateParams.type);//1
    // alert($stateParams.robid);//12


    // XSessionId	7CF03E5EE4E6AA9C42C5FC51C3BBB7E8TcfT5uQ/TaQCWcc6Bsw+PNDXACJvdYPN
    // certNo	a5BI+LoobdN5yxhjFEOeqoFdE6QiWvZn
    // inType	PDXB
    // 6240


    window.scrollTo(0, 0);//滚动到顶部
    $rootScope.pagetype = 0;
    $scope.ParamsType = $stateParams.type;
    $scope.ParamsRobid = $stateParams.robid;
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    $scope.showimg = '/images/hao.png';
    $scope.currimg = 'one';
    $scope.currname = '战狼2';
    $scope.robState = false;
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 230 / 750;

    $scope.findimg = {
        'width': '100%',
        'height': imgHeight + 'px'
    };
    $scope.xyimgs1 = {
        'width': '100%',
        'height': imgWidth * 230 / 750 + 'px'
    };
    $scope.xyimgs2 = {
        'width': '100%',
        'height': imgWidth * 185 / 750 + 'px'
    };
    $scope.countSpr = {
        'position': 'absolute',
        'bottom': '8%',
        'width': '100%'
    };
    $scope.ruleTop = {
        'margin-top': imgWidth * 150 / 750 + 'px',
        'line-height': imgWidth * 60 / 750 + 'px'
    };
    $scope.zjstyle = {
        'width': '80%'
    };
    var height = imgWidth * 330 / 750 * 3 + imgWidth * 344 / 750 - 25;

    $scope.sectionHeitht = {
        height: height + 'px'
    };
    //石头剪刀布
    $scope.uiPlayType = 0;
    $scope.uiPlay = function (type) {
        // 注释 防止不能多次点击
        // if ($scope.uiPlayType != 0) {
        //     return;
        // }
        $scope.showTypes = type;
        $scope.uiPlayType = type;
        $scope.showimg = '/images/hdimg-s3.png';
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
    $scope.ToCDB = function (str) {
        var tmp = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
                tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
            }
            else {
                tmp += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return tmp.replace(/\s+/g, "");
    }
    //判断输入验证码
    $scope.checkcodes = '';
    $scope.checkout = function () {
        // var inputCode = '';
        // if ($scope.setcode) {
        //     inputCode = $scope.setcode.toUpperCase(); //取得输入的验证码并转化为大写
        // }
        // if (inputCode.length <= 0) { //若输入的验证码长度为0
        //     $scope.code();//刷新验证码
        //     $scope.setcode = '';//清空文本框
        //     $scope.checkcodes = '您输入的验证码有误';
        //     $('#setcode').val(' ');
        // }
        // else if (inputCode != $scope.codemsg) { //若输入的验证码与产生的验证码不一致时
        //     $scope.code();//刷新验证码
        //     $scope.setcode = '';//清空文本框
        //     $scope.checkcodes = '您输入的验证码有误';
        //     $('#setcode').val(' ');
        // }
        // else {
        //     $('.sprcodeModel').hide();
        //     $scope.checkcodes = '';
        //     $('.sprtipsModels').show();
        // }
        $('.sprtipsModels').show();
    };

    $scope.clearMsg = function () {
        $scope.checkcodes = '';
        window.scrollTo(0, 0);//滚动到顶部
    };

    //第一步
    $scope.getTickit1 = function () {
        PH.api('rob/prelottery', {
            inType: $rootScope.inType,
            robType: $stateParams.type,
            robId: $stateParams.robid
        }, function (ret) {

            var ret={"data":{"robStatusPath":"rob/robstatus","robPath":"rob/rob"},"errorCode":0,"message":"请求成功"};
            $scope.activityFirst = ret.data.robPath;
            $scope.activitySecond = ret.data.robStatusPath;
            $scope.checkcodes = '';
            $scope.setcode = '';//清空文本框
            $scope.code();
            // $('.sprcodeModel').show();
            $('.sprtipsModels').show();
        }, function (ret) {
            // $rootscope.errorHidden = true;
            // $scope.signtext = ret.message;
            // $scope.tips = ret.message;
            // $('.sprtipsModel').show();




            var ret={"data":{"robStatusPath":"rob/robstatus","robPath":"rob/rob"},"errorCode":0,"message":"请求成功"};
            $scope.activityFirst = ret.data.robPath;
            $scope.activitySecond = ret.data.robStatusPath;
            $scope.checkcodes = '';
            $scope.setcode = '';//清空文本框
            $scope.code();
            // $('.sprcodeModel').show();
            $('.sprtipsModels').show();
        });
    };

    //第二步
    $rootScope.inter;
    $scope.getReward = function () {
        PH.api($scope.activityFirst, {
            inType: $rootScope.inType,
            robCount: '',
            robType: $stateParams.type,
            robId: $stateParams.robid
        }, function (ret) {
            // var si = 3;
            // $rootScope.inter = $interval(function () {
            //     si--;
            //     if (si != 0) {
            //         $scope.showimg = '/images/hdimg-s' + si + '.png';
            //     }
            //     else if (si == 0) {
            //         $rootScope.getStatus(2);
            //     }
            // }, 1300, 3);

            $rootScope.getStatus(2);
            $scope.robState = true;
        }, function (ret) {
            $rootscope.errorHidden = true;
            $scope.signtext = ret.message;
            $scope.tips = ret.message;
            $('.sprtipsModel').show();
        });
    };
    //第三步
    $rootScope.getStatus = function (type) {
        PH.api('rob/robstatus', {
            inType: $rootScope.inType,
            robType: $stateParams.type,
            robId: $stateParams.robid
        }, function (ret) {
            // alert( ret.data.encryptCardNo);
            // 6222********2018
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
                        $scope.showimg = '/images/bu.png';
                    }
                    else if ($scope.uiPlayType == 2) {//剪刀
                        $scope.showimg = '/images/shitou.png';
                    }
                    else if ($scope.uiPlayType == 3) {//布
                        $scope.showimg = '/images/jiandao.png';
                    }
                    $interval(function () {
                        $('.sprtipsModels').hide();
                        $('.sprerrModel').show();
                        $scope.signtext = '非常遗憾，观影券与你擦肩而过!';
                        $scope.tips = '非常遗憾，观影券与你擦肩而过!';
                    }, 3000, 1);
                }
                else if (ret.data.status == 0) {
                    if ($scope.robState) {
                        $scope.signtext = '系统正在处理，请稍后查询';
                        $scope.tips = '系统正在处理，请稍后查询';
                    }
                    else {
                        $scope.signtext = '暂无中奖记录';
                        $scope.tips = '暂无中奖记录';
                    }

                    $('.sprtipsModels').hide();
                    $('.sprtipsModel').show();
                }
                else if (ret.data.status == 5) {
                    $scope.signtext = ret.data.prizeInfo;
                    $scope.tips = ret.data.prizeInfo;
                    $('.sprtipsModels').hide();
                    $('.sprtipsModel').show();
                }
                else if (ret.data.status == 6) {
                    $scope.signtext = ret.data.prizeInfo;
                    $scope.tips = ret.data.prizeInfo;
                    $('.sprtipsModels').hide();
                    $('.sprtipsModel').show();
                }
                else if (ret.data.status == 1 || ret.data.status == 2 || ret.data.status == 3) {

                    if (ret.data.status == 1) {
                        $scope.sprjimg = '/images/' + $scope.currimg + '-img1.png';
                        $scope.tips = '当前账户' + $scope.encryptCardNo + '，您获得1张《' + $scope.currname + '》10元观影券,奖券将在活动结束后24小时内发放至持卡人账户';
                    }
                    else if (ret.data.status == 2) {
                        $scope.sprjimg = '/images/' + $scope.currimg + '-img2.png';
                        $scope.tips = '当前账户' + $scope.encryptCardNo + '，您获得2张《' + $scope.currname + '》10元观影券,奖券将在活动结束后24小时内发放至持卡人账户';
                    }
                    else if (ret.data.status == 3) {
                        $scope.sprjimg = '/images/' + $scope.currimg + '-img3.png';
                        $scope.tips = '当前账户' + $scope.encryptCardNo + '，您获得3张《' + $scope.currname + '》10元观影券,奖券将在活动结束后24小时内发放至持卡人账户';
                    }

                    if ($scope.uiPlayType == 1) {//石头
                        $scope.showimg = '/images/jiandao.png';
                    }
                    else if ($scope.uiPlayType == 2) {//剪刀
                        $scope.showimg = '/images/bu.png';
                    }
                    else if ($scope.uiPlayType == 3) {//布
                        $scope.showimg = '/images/shitou.png';
                    }
                    $interval(function () {
                        $('.sprtipsModels').hide();
                        $('.sprzjModel').show();
                    }, 3000, 1);
                }
                else if (ret.data.status == 8) {
                    $scope.signtext = '您未获得双卡客户场参与资格，不能参与此次活动';//ret.data.prizeInfo;
                    $scope.tips = '您未获得双卡客户场参与资格，不能参与此次活动';//ret.data.prizeInfo;
                    $('.sprtipsModels').hide();
                    $('.sprtipsModel').show();
                }
                else {
                    $scope.signtext = ret.data.prizeInfo;
                    $scope.tips = ret.data.prizeInfo;
                    $('.sprtipsModels').hide();
                    $('.sprtipsModel').show();
                }
            }
            else {
                $interval.cancel($rootScope.inter);
                $('.sprtipsModels').hide();
                if (ret.data.status == 1) {
                    $scope.tips = '当前账户' + $scope.encryptCardNo + '，您已获得1张《' + $scope.currname + '》10元观影券,奖券将在活动结束后24小时内发放至持卡人账户';
                    $scope.signtext = '当前账户' + $scope.encryptCardNo + '，您已获得1张《' + $scope.currname + '》10元观影券,奖券将在活动结束后24小时内发放至持卡人账户';
                }
                else if (ret.data.status == 2) {
                    $scope.tips = '当前账户' + $scope.encryptCardNo + '，您已获得2张《' + $scope.currname + '》10元观影券,奖券将在活动结束后24小时内发放至持卡人账户';
                    $scope.signtext = '当前账户' + $scope.encryptCardNo + '，您已获得2张《' + $scope.currname + '》10元观影券,奖券将在活动结束后24小时内发放至持卡人账户';
                }
                else if (ret.data.status == 3) {
                    $scope.tips = '当前账户' + $scope.encryptCardNo + '，您已获得3张《' + $scope.currname + '》10元观影券,奖券将在活动结束后24小时内发放至持卡人账户';
                    $scope.signtext = '当前账户' + $scope.encryptCardNo + '，您已获得3张《' + $scope.currname + '》10元观影券,奖券将在活动结束后24小时内发放至持卡人账户';

                }
                else if (ret.data.status == 4) {
                    $scope.tips = ret.data.prizeInfo;
                    $scope.signtext = ret.data.prizeInfo;
                }
                else if (ret.data.status == 5) {
                    $scope.signtext = ret.data.prizeInfo;
                    $scope.tips = ret.data.prizeInfo;
                }
                else if (ret.data.status == 6) {
                    $scope.tips = ret.data.prizeInfo;
                    $scope.signtext = ret.data.prizeInfo;
                }
                else if (ret.data.status == 8) {
                    $scope.signtext = '您未获得双卡客户场参与资格，不能参与此次活动';//ret.data.prizeInfo;
                    $scope.tips = '您未获得双卡客户场参与资格，不能参与此次活动';//ret.data.prizeInfo;
                }
                else if (ret.data.status == 0) {
                    if ($scope.robState) {
                        $scope.signtext = '系统正在处理，请稍后查询';
                        $scope.tips = '系统正在处理，请稍后查询';
                    }
                    else {
                        $scope.signtext = '暂无中奖记录';
                        $scope.tips = '暂无中奖记录';
                    }
                    // $('.sprtipsModel').show();
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

    //规则
    $scope.actionRule = function () {
        $('.ruletipModel').show();
    };
    //关闭
    $scope.closeDialog = function () {
        $('.sprtipsModel').hide();
        $('.ruletipModel').hide();
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

    //   不自动弹出框 屏蔽
    // $rootScope.getStatus(1);

    //$scope.getRewardList();

});

//规则
var droiyanRulefy = angular.module("DroiyanRuleModule", []);

droiyanRulefy.controller('droiyanRuleController', function ($scope, $state, $stateParams) {
    window.scrollTo(0, 0);//滚动到顶部
    $scope.returns = function () {
        $state.go('activityfirst', {'type': $stateParams.type, 'robid': $stateParams.robid});
    }
});

//引导图
var droiyanDirectionfy = angular.module("DroiyanDirectionActivity", []);
//
droiyanDirectionfy.controller('droiyanDirectionController', function ($scope, $state, $stateParams) {

    window.scrollTo(0, 0);//滚动到顶部
    var imgWidth = $(window).width();
    $scope.dirbody = {
        'height': $(window).height() - 20 + 'px'
    };
    $scope.direction1 = {
        'width': '100%',
        'height': imgWidth * 369 / 750 + 'px'
    };
    $scope.direction2 = {
        'width': '100%',
        'height': imgWidth * 310 / 750 + 'px'
    };
    $scope.returns = function () {
        $state.go('activityfirst', {'type': $stateParams.type, 'robid': $stateParams.robid});
    }
});


