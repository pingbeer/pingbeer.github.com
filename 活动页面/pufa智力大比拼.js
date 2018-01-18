var isf = false;
var winWidth = $(window).width();
var winHeight = $(window).height();

function loadNum() {
    var easingFn = function (t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
    }
    var options = {
        useEasing: true,
        easingFn: easingFn,
        useGrouping: true,
        separator: ',',
        decimal: '.',
    };
    var demo = new CountUp("num", 0, 100, 0, 5, options);
    demo.start();
}
loadNum();

$(function () {
    setTimeout(function () {
        $('.loading').fadeOut(1000);
        $('#loadPlay').fadeOut(1000);
        $('#loadingNum').fadeOut(1000);
        $('#p1').fadeIn(1500, function () {
            setTimeout(function () {
                $('#p1_play_2').addClass('bounceIn animated');
                $('#p1_play_7').addClass('bounceInDown animated');
                $('#p1_play_text').addClass('bounceInDown animated');
                $('#btn-start').addClass('bounceIn animated');
                $('#btn-rule').addClass('bounceIn animated');
            }, 500);

        });
    }, 3000);

    // 保存到session
    $.clearStorage();
    $.saveSearch();

    // 获取规则数据
    $.getPostData("activityRule.htm", "stateValue=ANSWER_RULE", function (data) {
        if (data.respCode == "0000") {
            var pArr = [];
            var arrItems = data.respDesc.split("<br>");
            for (var i=0; i<arrItems.length; i++) {
                pArr.push("<p>"+arrItems[i]+"</p>");
            }
            $("#pop-rule .rule-text").html(pArr.join("\n"));
        }
    });

    // 注册活动规则事件
    $('#btn-rule').click(function () {
        showRule();
    });

    //开始答题
    $('#btn-start').click(function () {
        startAnswer();
    });

    //点击选项答题
    $('#question-options').on('click', 'li', function () {
        _this = $(this);
        if (_this.hasClass('active')) {
            _this.removeClass('active');
            curQuestion.selected = "";
        } else {
            _this.addClass('active');
            _this.siblings().removeClass('active');

            //选择了哪个选项
            curQuestion.selected = $(this).attr("data-opt");
        }
		autoNextQuestion();
    });

    //结束答题
    $('#btn-end a').click(function () {
        endGame(false);
    });

    //分享提示
    $('#btn-share-tip').click(function () {
        $('#pop-share').bPopup({
            speed: 450,
            position: [0, 0],
            transition: 'fadeIn',
            closeClass: 'closed'
        });
    });

    // 复活
    $('#btn-share-reset').click(function () {
        $.getPostData("chanceApply.htm", $.jsonParams("certNo", "cardNo", "phoneNo"), function (data) {
            if (data.respCode != "0000") {
                $.showAlert(data.respDesc);
            } else {
                $('#p1,#p2').show();
                $('#p3').hide();
                // isReset = true;
                $('#p1_play_2').removeClass('bounceIn animated');
                $('#p1_play_7').removeClass('bounceInDown animated');
                $('#p1_play_text').removeClass('bounceInDown animated');
                startAnswer();
            }
        });
    });
});

// 注册活动规则事件
function showRule() {
    $('#pop-rule').bPopup({
        speed: 450,
        transition: 'slideDown',
        closeClass: 'closed'
    });
}

var _initObj;
// 开始答题
function startAnswer() {
    d_currIndex = 1;
    $('#rule-countdown').css("display", "none");
    $.getPostData("activityInit.htm", null, function (data) {
        if (data.respCode != "0000") {
            $.showAlert(data.respDesc);
        } else {
            if (data.flag == 1) {
                _initObj = data;
                var rtime = 4;
                $.saveStorage("_self", "activityId", data.appActivityModel.activityId);
                var distanceTime = 4000;

                if (data.appActivityModel.distanceStart > 0) { // 活动未开始
                    distanceTime = data.appActivityModel.distanceStart*1000 + 3000;
                    rtime = distanceTime/1000;
                    $('#rule-countdown').text(distanceTime/1000);
                    $(".titleText").html(data.appActivityModel.titleMain);
                    $(".timeText").html("开始时间：" + data.appActivityModel.activityStart);
                    $('#rule-countdown').css("display", "inline-block");
                } else { // 活动已开始
                    distanceTime = 4000;
                    $('#rule-countdown').text("3");
                    $(".titleText").html(data.appActivityModel.titleMain);
                    $(".timeText").html("结束时间：" + data.appActivityModel.activityEnd);
                }

                $('#pop-time').bPopup({
                    speed: 450,
                    modalClose:false,
                    transition: 'slideDown',
                    closeClass: 'closed',
                    autoClose: distanceTime,
                    onClose: startGame
                });

                var rint = setInterval(function () {
//			    	rtime = parseInt($('#rule-countdown').text());
                    if (rtime <= 3) {
                        $('#rule-countdown').css("display", "inline-block");
                        document.getElementById('audioPlay').play();
                    }
                    if (rtime <= 1) {
                        clearInterval(rint);
                        setTimeout(function () {
                            document.getElementById('audioPlay').pause();
                        }, 1000);
                    }
                    $('#rule-countdown').text(rtime);
                    rtime = rtime-1;
                }, 1000);

            }
        }
    });
}

// 开始游戏
function startGame() {
    $.getPostData("answerInit.htm", $.jsonParams("certNo", "cardNo", "phoneNo", "_self:activityId"), function (data) {
        if (data.respCode == "0000") {
            $('#p1').hide();
            $('#p2').show();
            inAnswer(data.answerQuestion, data.requestSign); // 进入题目
        } else if (data.respCode == "9992") {
            $.showAlert(data.respDesc, function () {
                endGame(false);
            });
        } else {
            $.showAlert(data.respDesc);
        }
    });
}

function inAnswer(answer, requestSign) {
    var answers = [];
    if (answer && answer.answerA) {
        answers.push(answer.answerA);
    }
    if (answer && answer.answerB) {
        answers.push(answer.answerB);
    }
    if (answer && answer.answerC) {
        answers.push(answer.answerC);
    }
    if (answer && answer.answerD) {
        answers.push(answer.answerD);
    }
    if (answer && answer.answerE) {
        answers.push(answer.answerE);
    }
    if (answer && answer.answerF) {
        answers.push(answer.answerF);
    }
    fillQuestion({
        "qid": answer.id,
        "requestSign": requestSign,
        "question": answer.question,
        "options": answers
    }, d_currIndex++);
}

//totalQuestion:问题总数，countTime：倒计时定时器，oneTime：答题秒数，userOpt：用户答案,gameStatus：是否全对,isReset : 是否今日使用过复活
var totalQuestion=8, countTime, oneTime = 8,d_currIndex = 1,d_gameStatus,
    userOpt = "",
    gameStatus = "false",
    isReset = false;

var curQuestion = {
    "index": 0,
    "qid": 0,
    "selected": "",
    "requestSign": ""
}

function fillQuestion(answer, cur) {
    curQuestion.selected = "";
    clearInterval(countTime);
    $('#question-time').text(oneTime);
    if (cur > totalQuestion) return;

    var qt = answer.question;
    var qo = answer.options;
    var qid = answer.qid;
    var requestSign = answer.requestSign;

    //当前题与总数
    $('#question-count').text(cur + " / " + totalQuestion);
    //题目内容
    $('#question-title').text('Q' + cur + ':' + qt);

    //生成题目选项
    listr = ''
    for (i = 0; i < qo.length; i++) {
        switch (i) {
            case 0:
                opt = 'A';
                break;
            case 1:
                opt = 'B';
                break;
            case 2:
                opt = 'C';
                break;
            case 3:
                opt = 'D';
                break;
            case 4:
                opt = 'E';
                break;
            case 5:
                opt = 'F';
                break;
            default:
                break;
        }
        listr += '<li data-qid="' + qid + '" data-opt="' + opt + '" data-cur="' + cur + '">' + opt + '、' + qo[i] + '</li>';
    }

    //当前题目序列
    curQuestion.index = cur;
    curQuestion.qid = qid;
    curQuestion.requestSign = requestSign;

    $('#question-options').html(listr);
    tmpTime = oneTime;

    //开始倒数
    countTime = setInterval(function () {
        if (tmpTime <= 0) {
            clearInterval(countTime);
            if (curQuestion.selected == "") {
                // endGame(false);
            } else {
                // autoNextQuestion();
            }
        }
        $('#question-time').text(tmpTime);
        tmpTime--;
    }, 1000);
}

// 提交接口
function autoNextQuestion() {
    document.getElementById('question-content').scrollTop = 0;
    $.getPostData(
        "answerApply.htm",
        $.jsonParams(
            "certNo",
            "certType",
            "cardNo",
            "phoneNo",
            "_self:activityId",
            "questionId="+curQuestion.qid,
            "answer="+curQuestion.selected,
            "requestSign="+curQuestion.requestSign), function (data) {
            if (data.respCode != "0000") {
//			$.showAlert(data.respDesc, function () {
//				endGame(false);
//			});
                endGame(false);
            } else {
                if (data.isEnd == "0") {
                    if (d_currIndex > totalQuestion) { // 结束了
                        d_currIndex++;
                        autoNextQuestion(); // 进入题目,清数据
                    } else {
                        $('#p1').hide();
                        $('#p2').show();
                        inAnswer(data.answerQuestion, data.requestSign); // 进入题目
                    }
                } else {
                    endGame(true);
                }
            }
        });
}

function endGame(gameStatus) {
    // 关掉活动规则
    $('#pop-rule .closed').trigger("click");
    d_gameStatus=gameStatus;
    shareImg(gameStatus);
    $('#p1,#p2').hide();
    $('#p3').show();
    clearInterval(countTime);
    $('#share-img').css("width", winWidth);
}

function shareImg(gameStatus) {
    document.getElementById('share-img').src = 'img/dati_p3_' + gameStatus + '.jpg?v=20180116'
}


~ function (src) {
    var className = 'playing';
    var trigger = 'ontouchend' in document ? 'touchstart' : 'click';
    var $musci = document.createElement('div');
    var $audio = document.createElement('audio');

    function start() {
        document.removeEventListener(trigger, start, false);
        if (!$audio.paused) return;
        $audio.play();
        $audio.pause();
    }

    function toggle() {
        if (!$audio.paused) return $audio.pause();

        $audio.currentTime = 0;
        $audio.play();
        $audio.pause();
    }

    function play(e) {
        $musci.classList.add(className);
    }

    function pause(e) {
        $musci.classList.remove(className);
    }

    $musci.className = 'music';
    $audio.src = src;
//    $audio.loop = true;
    $audio.id = 'audioPlay';
    document.body.appendChild($musci);
    document.body.appendChild($audio);

    $audio.addEventListener('play', play, false);
    $audio.addEventListener('pause', pause, false);
    $audio.addEventListener('ended', pause, false);
    $musci.addEventListener('click', toggle, false);
    //    $audio.play()

    document.addEventListener(trigger, start, false);
}('img/s.mp3');