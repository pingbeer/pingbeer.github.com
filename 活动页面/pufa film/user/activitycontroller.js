//抽奖
var activity = angular.module('ActivityModule', []);
activity.controller('activityController', function ($scope, $rootScope, $http, $state, $cookieStore, $stateParams, $sessionStorage, $interval, PH) {

        window.scrollTo(0, 0);//滚动到顶部
        $sessionStorage.activity = 1;
        var winHeight = $(window).height();
        $('.centerbg').height(winHeight);
        $scope.isclickstart = false;
        $scope.Paramsid = $stateParams.id;
        $('.redpacmodel').hide();
        $('.preciousmodel').hide();
        $('.preciousprizemodel').hide();

        $scope.clickflag = false;
        $scope.chooseflag = false;
        $scope.isBtn = true;
        $scope.havinglottery = false;
        $scope.indexfg = false;
        $scope.indexflag = [];
        $scope.indexflagt = [];
        //进入加载
        $scope.load = function () {
            $scope.leftturns = 0;
            PH.api('activity', {}, function (ret) {
                if (ret.data.hasSelectLuckDraw) {
                    $scope.clickflag = true;
                }
                $scope.hasFastPay = ret.data.hasFastPay;
                $scope.needpoint = ret.data.needPoint;
                $scope.mypoints = ret.data.point;
                $scope.prizes = ret.data.prizes;
                // $scope.gameTurns = '每位用户每天可翻' + ret.data.lotteryTimes + '张';
                $scope.hasSelectLuckDraw = ret.data.hasSelectLuckDraw;
                $scope.leftturns = ret.data.availableTime;
                $scope.otherprizes = ret.data.prizeInfos;
                $scope.prizeInfos = [];
                for (var i = 0; i < $scope.otherprizes.length; i++) {
                    var obj = {
                        'msg': $scope.otherprizes[i]
                    };
                    $scope.prizeInfos.push(obj);
                }
                $scope.datelast = function ($last) {
                    if ($last) {
                        $('.otherprizes').myScroll({
                            speed: 40, //数值越大，速度越慢
                            rowHeight: 30 //li的高度
                        });
                    }
                };
                // for(var i=0;i<$scope.otherprizes;i++){
                $('.prizesitem').each(function (i) {
                    $(this).css('opacity', '0');
                    $('.prizesitem').eq(i).transition({
                        opacity: 0,
                        complete: function () {
                            $('.prizesitem').eq(i).css('opacity', '1')
                        }
                    })

                });
                // }
                if (ret.data.hasSelectLuckDraw) {
                    $scope.chooseflag = true;
                    $('.startchoose').attr('src', './images/activity_ended.png.png');
                }
                if (!$scope.hasSelectLuckDraw) {
                    $scope.leftturns = '您有1次抽奖机会';
                } else if ($scope.hasSelectLuckDraw && (ret.data.luckDrawRecord.lastPrize == null)) {
                    $sessionStorage.luckDrawId=ret.data.luckDrawRecord.id;
                    $scope.leftturns = '您还可以翻' + ret.data.availableTime + '张';
                    setTimeout(function () {
                        $('.onebox').css('transform', 'translateX( 0 ) rotateY( 360deg)');
                        $('.onebox').each(function (i) {
                            var img = $(this).find('img').first();
                            var next = img.next();
                            var p = $(this).find('p');
                            p.transition({
                                opacity: 0
                            });
                            next.transition({
                                opacity: 0,
                                duration: 100,
                                complete: function () {
                                    $scope.clickflag = true;
                                    console.log('complete');
                                    img.show();
                                    img.transition({
                                        opacity: 1,
                                        duration: 1000
                                    });
                                }
                            });
                        });
                    }, 10);
                }
                else if ($scope.hasSelectLuckDraw && (ret.data.luckDrawRecord.index != null) && (ret.data.luckDrawRecord.isBag == 'N')) {
                    $sessionStorage.luckDrawId=ret.data.luckDrawRecord.id;
                    $scope.index = ret.data.luckDrawRecord.index;
                    console.log($scope.index);

                    $scope.indexflagt.push($scope.index.split(','));
                    console.log($scope.indexflagt);
                    if (ret.data.availableTime == 0) {
                        $scope.havinglottery = true;
                        $scope.leftturns = '今天抽奖次数已用完,请明天再来';
                    } else {
                        $scope.leftturns = '您还可以翻' + ret.data.availableTime + '张';
                    }
                    $scope.luckDrawRecordIndex = ret.data.luckDrawRecord.index;
                    $scope.luckDrawRecordPrize = ret.data.winPrize;
                    $scope.index = [];
                    $scope.index = $scope.luckDrawRecordIndex.split(',');
                    setTimeout(function () {
                        for (var n = 0; n < $scope.index.length; n++) {
                            $('.onebox').eq($scope.index[n]).find('.box_face').stop().animate({opacity: '0'}, 400, function () {
                            })
                            $('.onebox').eq($scope.index[n]).find('.box_prize').attr('src', $scope.luckDrawRecordPrize[n].imgUrl);
                            $('.onebox').eq($scope.index[n]).find('.prizename').html($scope.luckDrawRecordPrize[n].name);
                            $('.onebox').eq($scope.index[n]).find('.prizename').animate({opacity: '1'}, 50);
                            $('.onebox').eq($scope.index[n]).find('.box_prize').animate({opacity: '1'}, 50);
                        }
                    }, 20);
                    setTimeout(function () {
                        $('.onebox').css('transform', 'translateX( 0 ) rotateY( 360deg)');
                        $('.onebox').each(function (i) {
                            var img = $(this).find('img').first();
                            var next = img.next();
                            var p = $(this).find('p');
                            p.transition({
                                opacity: 0
                            });
                            next.transition({
                                opacity: 0,
                                duration: 100,
                                complete: function () {
                                    img.show();
                                    img.transition({
                                        opacity: 1,
                                        duration: 1000
                                    });
                                }
                            });
                        });
                    }, 10);
                }
                else if ($scope.hasSelectLuckDraw && (ret.data.luckDrawRecord.index != null) && (ret.data.luckDrawRecord.isBag == 'Y')) {
                    $sessionStorage.luckDrawId=ret.data.luckDrawRecord.id;
                    $scope.index = ret.data.luckDrawRecord.index;
                    console.log($scope.index);
                    for (var i = 0; i < $scope.index.length; i++) {
                        $scope.indexflagt.push($scope.index[i].split(','));
                    }
                    console.log($scope.indexflagt);
                    $scope.leftturns = '您还可以翻' + ret.data.availableTime + '张';
                    $scope.luckDrawRecordIndex = ret.data.luckDrawRecord.index;
                    $scope.luckDrawRecordPrize = ret.data.winPrize;
                    $scope.index = [];
                    $scope.index = $scope.luckDrawRecordIndex.split(',');
                    if (ret.data.luckDrawRecord.lastPrizeType == '02') {
                        $('.redpacmodel').show();
                    } else {
                        $('.preciousmodel').show();
                        $scope.openprecious = function () {
                            $('.preciousprizemodel').show();
                            $('.preciousmodel').hide();
                            PH.api('activity/openpacket', {
                                luckDrawId: $sessionStorage.luckDrawId
                            }, function (ret) {
                                $scope.tipscode=ret.data.lottery.tip;
                                $scope.codemsg = '恭喜您获得' +ret.data.lottery.price + '元'+ ret.data.lottery.name;
                                $('.piecesorwords').attr('src', ret.data.lottery.imgUrl);
                            })
                        };
                    }

                    setTimeout(function () {
                        for (var n = 0; n < $scope.index.length; n++) {
                            $('.onebox').eq($scope.index[n]).find('.box_face').stop().animate({opacity: '0'}, 400, function () {
                            })
                            $('.onebox').eq($scope.index[n]).find('.box_prize').attr('src', $scope.luckDrawRecordPrize[n].imgUrl);
                            $('.onebox').eq($scope.index[n]).find('.prizename').html($scope.luckDrawRecordPrize[n].name);
                            $('.onebox').eq($scope.index[n]).find('.prizename').animate({opacity: '1'}, 50);
                            $('.onebox').eq($scope.index[n]).find('.box_prize').animate({opacity: '1'}, 50);
                        }
                    }, 20);
                    setTimeout(function () {
                        $('.onebox').css('transform', 'translateX( 0 ) rotateY( 360deg)');
                        $('.onebox').each(function (i) {
                            var img = $(this).find('img').first();
                            var next = img.next();
                            var p = $(this).find('p');
                            p.transition({
                                opacity: 0
                            });
                            next.transition({
                                opacity: 0,
                                duration: 100,
                                complete: function () {
                                    img.show();
                                    img.transition({
                                        opacity: 1,
                                        duration: 1000
                                    });
                                }
                            });
                        });
                    }, 10);
                    $sessionStorage.luckDrawId = ret.data.luckDrawRecord.id;
                    $scope.openredpac = function () {
                        $('.zjModel').show();
                        $('.redpacmodel').hide();
                        PH.api('activity/openpacket', {
                            luckDrawId: $sessionStorage.luckDrawId
                        }, function (ret) {
                            $scope.tipscode=ret.data.lottery.tip;
                            $scope.codemsg = '恭喜您获得' +ret.data.lottery.price + '元'+ ret.data.lottery.name;
                        })
                    };
                }

                $scope.turns = [];
                for (var i = 0; i < ret.data.lotteryTimes; i++) {
                    $scope.turns.push(i + 1)
                }
                setTimeout(function () {
                    for (var l = 0; l < $('.onebox').length; l++) {
                        $('.onebox').eq(l).addClass('box_item_' + (l + 1));
                    }
                }, 10);
            });
        };
        $scope.load();


        // 关闭错误提示
        $scope.closeCode = function () {
            window.scrollTo(0, 50);//滚动到顶部
            $('body').css({'overflow': 'auto'});
            $('.zjModel').hide();
        };
        $scope.closemodel = function (type) {
            if (type == 1) {
                $scope.isclickstart = false;
            } else if (type == 2) {
                $('.sixDigitPassword-box').find('b').css('visibility', 'hidden');
                $('#cardwrap').css('left', '0');
                $scope.password='';
                $('#verifyCodeDialog').hide();
            }
        };
        //开始抽奖选择张数
        $scope.startGet = function () {
            if (!$scope.chooseflag) {
                if (!$scope.hasSelectLuckDraw) {
                    $scope.isclickstart = true;
                    $("#verifyCodeDialog").hide();
                    $scope.needpoints = $scope.needpoint[2];
                    $scope.myturn = $scope.turns[2];
                    setTimeout(function () {
                        $('.turnschoose').each(function () {
                            $(this).children('.slect')[0].src = "./images/selectturns.png";
                            $(this).children('.slect').css('transform', 'scale(1)');
                            $(this).children('.turnsp').css ('color','#867b6d');
                        });
                        $('.turnschoose').eq(2).children('.slect')[0].src = './images/selectedturns.png';
                        $('.turnschoose').eq(2).children('.slect').css('transform', 'scale(1.2)');
                        // $('.turnsp')[0].css('color','#e8631a');
                        $('.turnschoose').eq(2).children('.turnsp').css('color','red')
                    }, 10);
                    $scope.chonseTurns = function ($index) {
                        $scope.selecturns = $index + 1;
                        $scope.myturn = $scope.turns[$index];
                        $scope.needpoints = $scope.needpoint[$index];
                        for (var i = 0; i < $('.turnschoose').length; i++) {
                            $('.turnschoose').eq(i).children('.slect')[0].src = './images/selectturns.png';
                            $('.turnschoose').eq(i).children('.turnsp').css ('color','#867b6d');
                            $('.turnschoose').eq(i).children('.slect').css('transform', 'scale(1)');
                            if ($index == i) {
                                $('.turnschoose').eq(i).children('.slect')[0].src = './images/selectedturns.png';
                                $('.turnschoose').eq(i).children('.slect').css('transform', 'scale(1.2)');
                                $('.turnschoose').eq(i).children('.turnsp').css('color','red')
                            }
                        }
                    };
                }
            }

        };

//获取验证码
        $scope.isBtn = true;
        $scope.getcode = function () {
            $scope.code = 60;
            $scope.isBtn = false;
            PH.api('pay/verifycode', {}, function (ret) {
                $scope.verifyKey = ret.data.verifyKey;
                $interval(function () {
                    $scope.code = $scope.code - 1;
                    if ($scope.code == 0) {
                        $scope.isBtn = true;
                        $scope.code = 60;
                    }
                }, 1000, 60);
            }, function (ret) {
                $('#alertDialog').show();
                $scope.msg = ret.message;
                $scope.isBtn = true;
            });
        };
        //确认张数
        $scope.confirmTurns = function () {
            $scope.isclickstart = false;
            $("#verifyCodeDialog").show();
            //获取验证码
            $scope.isBtn = true;
            $scope.code = 60;
            $scope.isBtn = false;
            PH.api('pay/verifycode', {type:'pay'}, function (ret) {
                $scope.verifyKey = ret.data.verifyKey;
                // alert($scope.verifyKey);
                $interval(function () {
                    $scope.code = $scope.code - 1;
                    if ($scope.code == 0) {
                        $scope.isBtn = true;
                        $scope.code = 60;
                    }
                }, 1000, 60);
            }, function (ret) {
                $('#alertDialog').show();
                $scope.msg = ret.message;
                $scope.isBtn = true;
            });
        };
        var payPassword = $("#payPassword_container"),
            _this = payPassword.find('i'),
            k = 0, j = 0,
            password = '',
            _cardwrap = $('#cardwrap');

        //点击隐藏的input密码框,在6个显示的密码框的第一个框显示光标
        payPassword.on('focus', "input[name='payPassword_rsainput']", function () {
            // alert(1);
            var _this = payPassword.find('i');
            if (payPassword.attr('data-busy') === '0') {
                //在第一个密码框中添加光标样式
                _this.eq(k).addClass("active");
                _cardwrap.css('visibility', 'visible');
                payPassword.attr('data-busy', '1');
            }

        });
        //change时去除输入框的高亮，用户再次输入密码时需再次点击
        payPassword.on('change', "input[name='payPassword_rsainput']", function () {
            _cardwrap.css('visibility', 'hidden');
            _this.eq(k).removeClass("active");
            payPassword.attr('data-busy', '0');
        }).on('blur', "input[name='payPassword_rsainput']", function () {

            _cardwrap.css('visibility', 'hidden');
            _this.eq(k).removeClass("active");
            payPassword.attr('data-busy', '0');

        });

        //使用keyup事件，绑定键盘上的数字按键和backspace按键
        payPassword.on('keyup', "input[name='payPassword_rsainput']", function (e) {
            var e = (e) ? e : window.event;

            //键盘上的数字键按下才可以输入
            // if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
            k = this.value.length;//输入框里面的密码长度
            l = 6;//6

            for (; l--;) {

                //输入到第几个密码框，第几个密码框就显示高亮和光标（在输入框内有2个数字密码，第三个密码框要显示高亮和光标，之前的显示黑点后面的显示空白，输入和删除都一样）
                if (l === k) {
                    _this.eq(l).addClass("active");
                    _this.eq(l).find('b').css('visibility', 'hidden');

                } else {
                    _this.eq(l).removeClass("active");
                    _this.eq(l).find('b').css('visibility', l < k ? 'visible' : 'hidden');

                }

                if (k === 6) {
                    j = 5;
                } else {
                    j = k;
                }
                $('#cardwrap').css('left', j * 16.4 + '%');

            }
            // } else {
            //     //输入其他字符，直接清空
            //     var _val = this.value;
            //     this.value = _val.replace(/\D/g, '');
            // }
        });
        //确定抽奖
        $scope.success = function () {
            // alert($scope.verifyKey );
            window.scrollTo(0, 50);
            console.log($('.sixDigitPassword').val());
            if (!$scope.password) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = '验证码为6位数字，请确认验证码';
                return false;
            }
            console.log($scope.password);
            // alert($scope.verifyKey);
            $("#verifyCodeDialog").hide();
            PH.api('activity/apply', {
                cvv2: $scope.cvv2 ? $scope.cvv2 : '',
                verifyKey: $scope.verifyKey,
                verifyCode: $scope.password,
                //     hasFastPay: $scope.lists.hasFastPay,
                chance: $scope.myturn
            }, function (ret) {
                $scope.chooseflag = true;
                $('.startchoose').attr('src', './images/activity_ended.png.png');
                $sessionStorage.luckDrawId = ret.data.luckdrawId;
                $scope.leftturns = '您还可以翻' + $scope.myturn + '张';
                if (!ret.data) {
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '网络超时，请重新再试';
                    return;
                }
                // 成功后
                var arr = [{
                    title: '1',
                    x: 0,
                    y: 0
                }, {
                    title: '2',
                    x: 100,
                    y: 0
                }, {
                    title: '3',
                    x: 200,
                    y: 0
                }, {
                    title: '4',
                    x: 300,
                    y: 0
                }, {
                    title: '5',
                    x: 0,
                    y: 100
                }, {
                    title: '6',
                    x: 300,
                    y: 100
                }, {
                    title: '7',
                    x: 0,
                    y: 200
                }, {
                    title: '8',
                    x: 300,
                    y: 200
                }, {
                    title: '9',
                    x: 0,
                    y: 300
                }, {
                    tittle: '10',
                    x: 100,
                    y: 300
                }, {
                    tittle: '11',
                    x: 200,
                    y: 300
                }, {
                    tittle: '12',
                    x: 300,
                    y: 300
                }
                ];
                var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                var _random = function (maxNum) {
                    return Math.floor(Math.random() * maxNum);
                };

                var _genNewArr = function (arr) {
                    var tmp = [];
                    var newArr = arr.slice(0);
                    console.log(newArr);
                    for (var i = 0; i < 12; i++) {
                        var random = _random(arr.length - i);
                        tmp.push(newArr[random]);
                        newArr.splice(random, 1);
                    }
                    return tmp;
                };
                setTimeout(function () {
                    $('.onebox').each(function (i) {
                        $(this).animate({top: '35%', left: '39%'}, 500);
                    })
                }, 1500);
                setTimeout(function () {
                    var arr2;
                    for (var j = 0; j < 3; j++) {
                        arr2 = _genNewArr(arr1);
                        $('.onebox').each(function (i) {
                            var item = arr[i];
                            var newItem = arr[arr2[i] - 1];
                            $(this).transition({
                                x: newItem.x - item.x,
                                y: newItem.y - item.y,
                                duration: 200
                            });
                        });
                        $('.onebox').each(function (i) {
                            $(this).transition({
                                x: 0,
                                y: 0,
                                duration: 200
                            });
                        });
                    }
                }, 1600);
                // setTimeout(function () {
                //     $('.onebox').each(function (i) {
                //         $(this).animate({top: '35%', left: '39%'}, 1500);
                //     });
                // }, 1550);
                setTimeout(function () {
                    $('.onebox').each(function (i) {
                        $('.onebox').eq(0).animate({top: '5%', left: '6%'}, 1000);
                        $('.onebox').eq(1).animate({top: '5%', left: '29%'}, 1000);
                        $('.onebox').eq(2).animate({top: '5%', left: '51%'}, 1000);
                        $('.onebox').eq(3).animate({top: '5%', left: '73%'}, 1000);
                        $('.onebox').eq(4).animate({top: '28%', left: '6%'}, 1000);
                        $('.onebox').eq(5).animate({top: '28%', left: '73%'}, 1000);
                        $('.onebox').eq(6).animate({top: '50%', left: '6%'}, 1000);
                        $('.onebox').eq(7).animate({top: '50%', left: '73%'}, 1000);
                        $('.onebox').eq(8).animate({top: '73%', left: '6%'}, 1000);
                        $('.onebox').eq(9).animate({top: '73%', left: '29%'}, 1000);
                        $('.onebox').eq(10).animate({top: '73%', left: '51%'}, 1000);
                        $('.onebox').eq(11).animate({top: '73%', left: '73%'}, 1000);
                    });
                }, 1650);

                setTimeout(function () {
                    $scope.leftturns = '您还可以翻' + $scope.myturn + '张';
                    $sessionStorage.leftturns = $scope.leftturns;
                    $('.onebox').css('transform', 'translateX( 0 ) rotateY( 360deg)');
                    $('.onebox').each(function (i) {
                        var img = $(this).find('img').first();
                        var next = img.next();
                        var p = $(this).find('p');
                        p.transition({
                            opacity: 0
                        });
                        next.transition({
                            opacity: 0,
                            duration: 100,
                            complete: function () {
                                console.log('complete');
                                img.show();
                                img.transition({
                                    opacity: 1,
                                    duration: 1000
                                });
                            }
                        });
                    });
                }, 10);
                setTimeout(function () {
                    $scope.clickflag = true;
                }, 3000);
                setTimeout(function () {
                    $('.onebox').each(function (i) {

                    })
                }, 20);
                $scope.telcode = '';
                $scope.isBtn = true;
            }, function (ret) {
                // $("#payPassword_container").attr('data-busy', '0');
                $('.sixDigitPassword-box').find('b').css('visibility', 'hidden');
                $('#cardwrap').css('left', '0');
                $scope.password='';
                console.log(ret.data);
            });
            window.scrollTo(0, 0);//滚动到顶部
        };
        //关闭按钮
        $scope.close = function (type) {
            window.scrollTo(0, 50);//滚动到顶部
            $('body').css({'overflow': 'auto'});
            if (type == 1) {
                $("#verifyCodeDialog").hide();
                $scope.telcode = '';
            }
            else if (type == 3) {
                $('.preciousmodel').hide();
                $('.preciousprizemodel').hide();
            }
            else {
                $rootScope.errorHidden = true;
            }
        };

        //点开翻牌
        $scope.startlottery = function ($index) {
            if ($scope.clickflag) {
                if (!$scope.havinglottery) {
                    $scope.indexfg = false;
                    console.log($scope.indexflag);
                    if ($scope.indexflag.length != 0) {
                        console.log($scope.indexflag);
                        // debugger;
                        for (var i = 0; i < $scope.indexflag.length; i++) {
                            // debugger;
                            if ($scope.indexflag[i] == $index) {
                                $scope.indexfg = true;
                                break;
                            }
                        }
                    }
                    if ($scope.indexflagt.length != 0) {
                        console.log($scope.indexflagt);
                        console.log($scope.indexflagt);
                        debugger;
                        for (var i = 0; i < $scope.indexflagt[0].length; i++) {
                            // debugger;
                            if ($scope.indexflagt[0][i] == $index) {
                                $scope.indexfg = true;
                                break;
                            }
                        }
                    }
                    if (!$scope.indexfg) {
                        console.log($scope.havinglottery);
                        $scope.img = $('.onebox').eq($index).find('.box_face');
                        $scope.p = $('.onebox').eq($index).find('.prizename');
                        $scope.next = $('.onebox').eq($index).find('.box_prize');
                        setTimeout(function () {
                            $scope.img.addClass('transitionbox');
                        }, 10);
                        PH.api('activity/lottery', {
                            index: $index
                        }, function (ret) {
                            $scope.tipscode=ret.data.lottery.tip;
                            $scope.indexflag.push($index);
                            // console.log($scope.indexflag);
                            // if (ret.data.lottery.type == '1' || ret.data.lottery.type == '2' || ret.data.lottery.type == '101' || ret.data.lottery.type == '260' || ret.data.lottery.type == '261' || ret.data.lottery.type == '262' || ret.data.lottery.type == '263') {
                            //     $scope.tipscode = '可以进入"发现--充值有礼"使用'
                            // } else {
                            //     $scope.tipscode = '可以进入"发现--充值有礼"使用（只限APP上使用）'
                            // }
                            if (ret.data.availableLotteryTimes != 0) {
                                $scope.leftturns = '您还可以翻' + ret.data.availableLotteryTimes + '张';
                            } else {
                                $scope.leftturns = '今天抽奖次数已用完,请明天再来';
                                $scope.havinglottery = true;
                            }
                            // $sessionStorage.leftturns = $scope.leftturns;
                            if (ret.data.lottery.priceType == '02') {
                                setTimeout(function () {
                                    $('.redpacmodel').show();
                                }, 2000);
                                $scope.openredpac = function () {
                                    $('.zjModel').show();
                                    $('.redpacmodel').hide();
                                    PH.api('activity/openpacket', {
                                        luckDrawId: $sessionStorage.luckDrawId
                                    }, function (ret) {
                                        $scope.codemsg = '恭喜您获得' + ret.data.lottery.price + '元' + ret.data.lottery.name;
                                        $scope.img.stop().animate({opacity: '0'}, 400, function () {
                                            $scope.next.attr('src', ret.data.lottery.imgUrl);
                                            $scope.p.html(ret.data.lottery.name);
                                            $scope.next.show();
                                            $scope.p.animate({opacity: '1'}, 50);
                                            $scope.next.animate({opacity: '1'}, 50);
                                        });
                                    })
                                };
                            }
                            else if (ret.data.lottery.priceType == '03') {
                                setTimeout(function () {
                                    $('.preciousmodel').show();
                                }, 2000);
                                $scope.openprecious = function () {
                                    $('.preciousprizemodel').show();
                                    $('.preciousmodel').hide();
                                    PH.api('activity/openpacket', {
                                        luckDrawId: $sessionStorage.luckDrawId
                                    }, function (ret) {
                                        $scope.codemsg = '恭喜您获得' + ret.data.lottery.name;
                                        $('.piecesorwords').attr('src', ret.data.lottery.imgUrl);
                                    })
                                };
                                $scope.img.stop().animate({opacity: '0'}, 400, function () {
                                    $scope.next.attr('src', ret.data.lottery.imgUrl);
                                    $scope.p.html(ret.data.lottery.name);
                                    $scope.next.show();
                                    $scope.p.animate({opacity: '1'}, 50);
                                    $scope.next.animate({opacity: '1'}, 50);
                                });
                            }
                            else {
                                $scope.codemsg = '恭喜您获得' + ret.data.lottery.name;
                                setTimeout(function () {
                                    $('.zjModel').show();
                                    $scope.img.stop().animate({opacity: '0'}, 400, function () {
                                        $scope.next.attr('src', ret.data.lottery.imgUrl);
                                        $scope.p.html(ret.data.lottery.name);
                                        $scope.next.show();
                                        $scope.p.animate({opacity: '1'}, 50);
                                        $scope.next.animate({opacity: '1'}, 50);
                                    });
                                }, 2000);
                            }
                            setTimeout(function () {
                                $scope.img.removeClass('transitionbox');
                            }, 1000);
                        }, function () {
                            $scope.img.removeClass('transitionbox');
                        });
                    }
                } else {
                    $rootScope.errorHidden = false;
                    $rootScope.naomi = '今天抽奖次数已用完，请明天再来哦';
                }
            }
        };
        var _formPay = $('#form_paypsw');

        // _formPay.validate({
        //     rules : {
        //         'payPassword_rsainput':{
        //             'minlength':6,
        //             'maxlength':6,
        //             required:true,
        //             digits : true,
        //             numPassword : true,
        //             echoNum :true
        //         }
        //     },
        // });





    }
);
//中奖记录
var activityHistory = angular.module('ActivityHistoryModule', []);
activityHistory.controller('activityHistoryController', function ($scope, $http, $cookieStore, $rootScope, $stateParams, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    $scope.Paramstype = $stateParams.type;
    var imgHeight = $(window).height();
    var imgWidth = $(window).width();
    $scope.wkhistory = {
        'background': "url('./images/activityhaveprize.png') 0 center no-repeat",
        'background-size': '100% 100%',
        'height': (imgHeight-44) + 'px',
        'width': imgWidth + 'px',
        'position': 'fixed',
        'z-index': '-1',
        'top': '44px',
        'overflow': 'hide'
    };
    $scope.wkcount = {
        'height': (imgHeight- 100) + 'px',
        'overflow-y': 'auto',
        'margin-top': '40px'
    };
    // $scope.prizeslist = [];
    console.log($scope.prizeslist);
    var lastkey = 0;
    $scope.load = function () {
        lastkey++;
        PH.api('activity/activityhistory', {
            lastKey: lastkey
        }, function (ret) {
            console.log(ret.data.prizes);
            if (ret.data.length == 0 && lastkey == 1) {
                $scope.isHistory = false;
                $scope.weekCount = ret.data.prizes.length;
                $scope.errormessage = '暂无中奖记录';
                return;
            } else if (ret.data.length == 0 && lastkey > 1) {
                return;
            }
            if (lastkey > 1) {
                $scope.weeklist = $scope.weeklist.concat(ret.data.prizes);
            }
            else {
                $scope.weeklist = ret.data.prizes;
            }
            $scope.weekCount = ret.data.prizes.length;
            // $scope.isHistory = true;

        }, function (ret) {
            $scope.errormessage = '暂无中奖记录';
        });
    };
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
            $scope.load();
        }
    };
    if ($stateParams.id == 1) {
        // debugger;
        $scope.isHistory = true;
        $scope.histip = '活动规则';
    }
    else if ($stateParams.id == 2) {
        $scope.isHistory = false;
        $scope.histip = '中奖纪录';
        $scope.load();
    }
    // $scope.load = function () {
    //     morepage++;
    //     PH.api('activity/activityhistory', {
    //         lastKey: morepage
    //     }, function (ret) {
    //         if (!ret.data.prizes) {
    //             $scope.prizeShow = true;
    //             $scope.errormessage = '系统繁忙，请稍后再试';
    //             return;
    //         }
    //
    //         if ((ret.data.prizes.length == 0 || ret.data.prizes == null)) {
    //             $scope.prizeCount = ret.data.prizes.length;
    //             $scope.prizeShow = true;
    //             $scope.errormessage = '暂无中奖记录';
    //             return;
    //         }
    //         if (morepage == 1) {
    //             $scope.prizeslist = ret.data.prizes;
    //
    //         } else {
    //             $scope.prizeslist = $scope.prizeslist.concat(ret.data.prizes);
    //         }
    //         $scope.prizeCount = ret.data.prizes.length;
    //         $scope.myPagingFunction();
    //     }, function (ret) {
    //         $scope.errormsg = ret.message;
    //     });
    // };
    // var time1 = '';
    // $scope.myPagingFunction = function () {
    //     console.log($scope.prizeCount);
    //     if (time1) {
    //         var time2 = new Date().getTime();
    //         if (time2 - time1 < 300) {
    //             time1 = time2;
    //             return;
    //         } else {
    //             time1 = time2;
    //         }
    //     } else {
    //         time1 = new Date().getTime();
    //     }
    //     if ($scope.prizeCount == 20) {
    //         $scope.load();
    //     }
    // };

});