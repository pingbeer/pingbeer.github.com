
function Game() {
    var oDowntime = null;
    this.location = 0;
    var that = this;
    that.FPS = 120;
    that.num = 6;
    that.double = 2;
    that.BtnAlpha=0.7;
    that.shiplocation = 60;
    that.showTime = document.getElementById('showTime');//秒声
    that.rush = document.getElementById('rush');//石头
    that.push = document.getElementById('push');//得分
    that.bgSrc = document.getElementsByClassName('bgSrc')[0].src;
    that.shipSrc = document.getElementsByClassName('shipSrc')[0].src;
    that.stoneSrc = document.getElementsByClassName('stoneSrc')[0].src;
    that.wineSrc = document.getElementsByClassName('wineSrc')[0].src;
    that.orangeSrc = document.getElementsByClassName('orangeSrc')[0].src;
    that.riceSrc =  document.getElementsByClassName('riceSrc')[0].src;
    that.leftSrc = document.getElementsByClassName('leftSrc')[0].src;
    that.rightSrc =  document.getElementsByClassName('rightSrc')[0].src;
    that.gameBgSrc=  document.getElementsByClassName('rightSrc')[0].src;
    that.execTime = 1500;//
    that.src=[that.stoneSrc, that.wineSrc,that.orangeSrc,that.riceSrc];
    that.yyspeed = 0.1;
}

Game.prototype.init = function (second, fn,fn1) {
    var that = this;
    that.fn = fn;
    that.fn1 = fn1;
    that.isOver = false;
    that.scoreElement = $('#score');//分数
    that.countDown = $('.t');//倒计时
    that.showBox = $('.gameBox-confirm');//弹框
    that.recorder(second);

};
/**
 * 计时
 */
Game.prototype.recorder = function (second) {

    var that = this;
    var that = this;
    var second = second;
//  that.showTime.play();

    var timer = setInterval(function () {
//      that.showTime.play();
        second--;

        if (second <= 0) {
            clearInterval(timer);

            // this.isOver == false
            var body_background = $('input[name=body_background]').val();
            $('body').css('background', 'url(http://ccb-sign.oss-cn-shanghai.aliyuncs.com/bgscroll2.png)');
            $('body').css('background-size', '100% 100%');
            $("#ren").hide();
            $("#xian").hide();
            $("#lbtn").hide();
            $("#rbtn").hide();
            that.countDown.parent().hide();
            that.play();
            //setTimeout(function(){
            //    that.countDown.parent().hide();
            //},200)
            //that.play();

            return

        }
        that.countDown.text(second);
    }, 1000);
};
/**
 * 龙舟
 */
Game.prototype.play = function () {

    downTime(30);
    var that = this;
    var asdd = true;

    var score = 0;//分数
    var distance = 0;//距离
    var canvas = document.getElementById('play');
    var playStage = new createjs.Stage(canvas);
    createjs.Touch.enable(playStage);
    var w = window.innerWidth * that.double;
    var h = window.innerHeight * that.double;
    var stageWidth = canvas.width = w;
    var stageHeight = canvas.height = h;


    var realyscale = 100 / 375;
    var realyW = w * realyscale;
    var scale = realyW / 100;
    // alert(scale);
    /**
     *
     * --------------背景-------------
     *
     */
    var bgWidth = 375 * scale;
    var bgHeight = 603 * scale;
    var bgList = [];
    var bgContainer = new createjs.Container();
    for (var i = 0; i < 3; i++) {
        var ind = i + 1;
        var bg = new createjs.Bitmap(that.bgSrc);
        bg.x = 0;
        bg.y = -i * bgHeight;
        bg.scaleX = scale;
        bg.scaleY = scale;
        bgList.push(bg);
        bgContainer.addChild(bg);
    }
    // var readyMap=bgList[2];
    // var nextMap=bgList[1];
    // var currentMap=bgList[0];
    playStage.addChild(bgContainer);
    //document.getElementById("gamebox").removeAttribute("style");
    /**
     *
     * --------------船-------------
     *
     */
    var shipWidth = 200;
    var shipHeigth = 300;
    var left = (5 * scale) * that.double;
    //var middle = w / 2 - (shipWidth / 4) * that.double;
    var middle = w / 2 - (shipWidth * scale / that.double)/2;
    var right = w - shipWidth / that.double - 30 * scale * that.double;
    var locationArray = [left, middle, right];
    var locationIndex = 1;

    //创建出SpriteSheet
    var ss = new createjs.SpriteSheet({
        "images": [that.shipSrc],
        "frames": {
            "height": shipHeigth,
            "width": shipWidth,
            "count": 8
        },
        "animations": {
            pull: [0, 0, 'pull1',that.yyspeed],
            pull1: [1, 1, 'pull2',that.yyspeed],
            pull2: [2, 2, 'pull3',that.yyspeed],
            pull3: [3, 3, 'pull4',that.yyspeed],
            pull4: [4, 4, 'pull5',that.yyspeed],
            pull5: [5, 5, 'pull6',that.yyspeed],
            pull6: [6, 6, 'stretch',that.yyspeed],
            stretch: [7, 7, 'pull',that.yyspeed]
        }
    });
    var playSprite = new createjs.Sprite(ss, "stretch");
    playSprite.scaleX = scale * 1 / that.double;
    playSprite.scaleY = scale * 1 / that.double;
    playSprite.width = shipWidth / that.double;
    playSprite.height = shipHeigth / that.double;

    playSprite.x = locationArray[locationIndex];
    //playSprite.y = h - (shipHeigth / that.double + that.shiplocation) * that.double;
    playSprite.y = h - (h/2.88);
    var shipContainer = new createjs.Container();
    shipContainer.addChild(playSprite);
    var playWrap = playStage.addChild(shipContainer);
    //-------------改

    /**
     *
     * ------------障碍物------------
     *
     */
    var blockStage = new createjs.Container();
    playStage.addChild(blockStage);
    var blockWidth = 100;
    var blockHeight = 100;
    //障碍物的位置
    var blockLeft = 0;
    var blockMiddle = w / 2 - (blockWidth / 2);
    /*  var blockRight = w - blockWidth - 40;*/
    var blockRight = 2 * (w - blockWidth) - 0;
    // var blockLocations = [blockLeft, blockMiddle, blockRight];
    var blockLocations = [left, middle, right];
    var blockLocationIndex = 1;

    //--------创建出SpriteSheet,改------------
    function createSprite(src, width, heigth, index) {
        var spriteObj = new createjs.SpriteSheet({
            "images": [src],
            "frames": {
                "width": 200,
                "height": 400,
                "count": 3
            },
            "animations": {
                normal: [0, 0],
                boom: [1, 1]
            }
        });
        var sprite = new createjs.Sprite(spriteObj, "normal");
        /* sprite.scaleX = scale;
         sprite.scaleY = scale;*/
        sprite.scaleX = scale * 1 / that.double;
        sprite.scaleY = scale * 1 / that.double;
        // sprite.y = -heigth+h*index;

        sprite.y = -200 * that.double;
        sprite.gotoAndPlay('normal');
        blockStage.addChild(sprite);
        return sprite;
    }


    var stone = createSprite(that.stoneSrc, 100, 76, 0);
    var wine = createSprite(that.wineSrc, 100, 95, 1);
    var orange = createSprite(that.orangeSrc, 100, 87, 2);
    var rice = createSprite(that.riceSrc, 100, 88, 3);
    var blocks = [stone, wine, orange, rice, wine, orange, rice];//障碍物
    //随机数
    function random(min, max) {
        var index;
        index = Math.floor(Math.random() * (max - min + 1)) + min;
        return index;
    }


    // var arr=[0,1,2,3];
    /**
     *
     * -------------------动画-----------------------
     *
     * */

    var blockLocation = h-blockHeight;//完成动画
    var bgblockLocation = h + bgHeight;

    /**
     * 背景,改
     * */
    that.mapMove = function (num) {

        if(asdd){

            if (that.isOver) {
                return;
            }
            bgList[2].y += num;
            bgList[1].y += num;
            bgList[0].y += num;
            var bu;
            var hu = window.innerHeight;
            for (var i = 0; i < 3; i++) {
                if (bgList[i].y >= bgHeight) {
                    bu = bgList[i].y - bgHeight; //像素填补
                    bgList[i].y = -bgHeight * 2 + bu;
                    // var obj = bgList[0];
                    // bgList[0] = bgList[1];
                    // bgList[1] = bgList[2];
                    // bgList[2] = obj;
                }
            }

        }

    }

    //-------------------------------------背景tween------------------------------------------
    /**
     *
     * 背景tween
     *
     * */

// bgTween();
    function bgTween() {
        var bg1myTween = createjs.Tween.get(bgList[0], {
            loop: true
        });
        bg1myTween.wait(0).to({y: blockLocation}, that.execTime * 1).play();
        bg1myTween.call(handleCompletebg);
        bg1myTween.on("change", handleChangebg);

        var bg2myTween = createjs.Tween.get(bgList[1], {
            loop: true
        });
        bg2myTween.wait(0).to({y: blockLocation}, that.execTime * 2).play();
        bg2myTween.call(handleCompletebg);
        // bg2myTween.on("change", handleChangebg);


        var bg3myTween = createjs.Tween.get(bgList[2], {
            loop: true
        });
        bg3myTween.wait(0).to({y: blockLocation}, that.execTime * 3).play();
        bg3myTween.call(handleCompletebg);
        // bg3myTween.on("change", handleChangebg);
        function handleChangebg(event) {
            var currenTween = event.target;
            var currenTarget = currenTween.target;
            if (that.isOver) {
                currenTween.setPaused(true);
            }
        }

        function handleCompletebg(tween) {
            var hu = window.innerHeight;


            var bu = bg1myTween.y - bgHeight; //像素填补
            var bu = 0;
            bg1myTween.y = -bgHeight * 2 + bu;
            var obj = bg1myTween;
            bg1myTween = bg2myTween;
            bg2myTween = bg3myTween;
            bg2myTween = obj;



        }

    }


    //-------------------------------------背景tween-------------------------------------------
    /**
     *
     * 障碍物
     *
     * */
//
//    var firstCopy=true;
//    var blocksCopy = [stone, wine, orange, rice];//障碍物
//    var blocksCopy1 = [stone, wine, orange, rice];//障碍物
//    for (var i = 0; i < blocks.length; i++) {
//       blocks[i].y=-i*h;
//    }
    that.blockMove=function(num) {
        if (that.isOver) {
            return;
        }
        blocksCopy[2].y += num;
        blocksCopy[1].y += num;
        blocksCopy[0].y += num;

        if ( blocksCopy[0].y > playSprite.y - 60 * that.double
            &&  blocksCopy[0].x == playSprite.x
            &&  blocksCopy[0].y < playSprite.y + shipHeigth - 60 * scale
        // && firstCollide
        ) {
            console.log('rush');
            switch (ind){
                case 0:
                    //大石头
                    that.isOver = true;
                    wanl();
                    that.rush.play();
                    break;
                default:
                    score += 5;
                    that.push.play();

            }

            blocksCopy[0].gotoAndPlay("boom");
            if (that.isOver) {
                blocksCopy[0].setPaused(true);

            }
            that.scoreElement.html(score);


            firstCollide = false;

        }
        var hu = window.innerHeight;
        for (var i = 0; i < 3; i++) {
            blocksCopy[i].gotoAndPlay("normal");
            if (blocksCopy[i].y >= h) {
                var bu = blocksCopy[i].y - blockHeight; //像素填补
                blocksCopy[i].y = -h * 3 + bu;
                var ind=random(0, 2);
                blocksCopy[i].spriteSheet._images[0].src=that.src[ind];
                blocksCopy[i].x = blockLocations[random(0, 2)];

                // var obj = bgList[0];
                // bgList[0] = bgList[1];
                // bgList[1] = bgList[2];
                // bgList[2] = obj;
            }



        }
//      if (that.FPS >= 60 || that.num >= 120) {
//          return
//      }

        that.FPS += 1;
        that.num+=1;
    };
    //--------------------------------障碍物--------------------------------------

    var randomIndex = random(0, 6);//索引
    blocks[randomIndex].y = -100;
    blocks[randomIndex].x = blockLocations[random(0, 2)];
    var myTween = createjs.Tween.get(blocks[randomIndex], {
        loop: false
    });
    myTween.wait(0).to({y: blockLocation}, that.execTime).play();
    myTween.call(handleComplete);
    myTween.on("change", handleChange);
    var firstCollide = true;

    function handleChange(event) {
        if(asdd){
            var currenTween = event.target;
            var currenTarget = currenTween.target;

            if (currenTarget.y > playSprite.y - 60 * that.double
                && currenTarget.x == playSprite.x
                && currenTarget.y < playSprite.y + shipHeigth - 60 * scale
                && firstCollide
            ) {

                switch (randomIndex) {
                    case 0:
                        //大石头
                        that.isOver = true;
                        wanl();
//                      that.rush.play();
                        break;
                    default:
                        score += 5;
//                      that.push.play();

                }

                currenTarget.gotoAndPlay("boom");
                if (that.isOver) {
                    currenTween.setPaused(true);
                }
                that.scoreElement.html(score);


                firstCollide = false;

            }
        }
    }

    var blocksNumber = 1;
    var blockArr = [[0, 1], [0, 2], [1, 2]];
    var blockLoca = [0, 1, 2];
    var ius=0;


    function openMc(obj){
        $(obj).show();
    }

    function downTime(times){

        console.log(times);
        var oInitTime = times;
        oDowntime = setInterval(function(){
            if(times>0){
                times--;
                $(".downtime0 span").html(times+"s");
            }else{
                clearInterval(oDowntime);
                wanl();
            }
            if(times<=oInitTime*2/3 && times>oInitTime*1/3){
                that.yyspeed = 0.2;

                if(that.FPS<150){
                    that.FPS ++;
                }else{
                    that.FPS = 150;
                }
                if(that.num<10){
                    that.num += 0.5;
                }else{
                    that.num = 10;
                }
                if(that.FPS<1000){
                    that.execTime -= 50;
                }else{
                    that.execTime = 1000;
                }
            }else if(times<=oInitTime*1/3){
                that.yyspeed = 0.3;
                if(that.FPS<170){
                    that.FPS ++;
                }else{
                    that.FPS = 170;
                }
                if(that.num<18){
                    that.num += 0.5;
                }else{
                    that.num = 18;
                }
                if(that.FPS<900){
                    that.execTime -= 50;
                }else{
                    that.execTime = 900;
                }
            }

        },1000)
    };
    function wanl(event){
        clearInterval(oDowntime);
        that.isOver = true;
        asdd=false;
        console.log("这里是时间结束和撞到护栏判断！！！！！");

        var url = root_index+'/Index/game_record_score.html';
        $.post(url,{score:score},function(res){

            if(res.is_make == 1){
                $("#allAlert .alert_c .d_title").html('闯关成功');
            }else{
                $("#allAlert .alert_pt").addClass('ku');
                $("#allAlert .alert_c .d_title").html('闯关失败');
                $("#allAlert .btmbb .gamebtns a button").html('再来一次');
            }
            $("#allAlert .alert_content #alertBox").html(res.msg);
            $("#allAlert").show();
            $("#allAlert .btmbb .gamebtns a").attr('href',res.url);
        });
    }
    function handleComplete(tween) {
        if(asdd){
            createjs.Tween.removeTweens(tween);
            var currenTarget = tween._target;
            currenTarget.gotoAndPlay('normal');
            // currenTarget.y = -120 * that.double;
            currenTarget.y = h;
            firstCollide = true;
            if (blocksNumber == 2) {
                for (var i = 0; i < 2; i++) {

                    blockStage.removeChild(currenTarget);
                    var ranIndex = random(0, 6);
                    var afterBitmap = blocks[ranIndex];
                    var ra = blockArr[random(0, 2)];
                    afterBitmap.x = blockLocations[ra[i]];
                    // afterBitmap.y = -100 * that.double;
                    afterBitmap.y = 0;
                    /*   blockStage.addChild(afterBitmap);*/
                    var afterTween = createjs.Tween.get(afterBitmap, {
                        loop: false
                    });
                    afterTween.wait(0).to({y: blockLocation}, that.execTime).play();
                    afterTween.addEventListener("change",
                        handleChange);
                    afterTween.call(handleComplete);
                }
                //----------------------------

            } else {
                // blockStage.removeChild(currenTarget);
                randomIndex = random(0, 6);
                var afterBitmap = blocks[randomIndex];
                afterBitmap.x = blockLocations[random(0, 2)];
                afterBitmap.y = -120 * that.double;
                // blockStage.addChild(afterBitmap);
                var afterTween = createjs.Tween.get(afterBitmap, {
                    loop: false
                });

                afterTween.wait(0).to({y: blockLocation}, that.execTime).play();
                afterTween.addEventListener("change",
                    handleChange);
                afterTween.call(handleComplete);

            }
            if (that.FPS >= 40 || that.execTime <= 1000) {
                return
            }

            that.FPS += 0.5;
            createjs.Ticker.setFPS(that.FPS);
            that.execTime -= 50;
        }
    }



    /**
     *
     * ------------左右按钮------------
     *
     */

    var leftBtn = new createjs.Bitmap(that.leftSrc);
    var rightBtn = new createjs.Bitmap(that.rightSrc);

    var btnWidth = 154;
    var btnHeight = 154;

    // leftBtn.width=btnWidth;
    // leftBtn.height=btnHeight;
    leftBtn.scaleX = scale * 1 / that.double;
    leftBtn.scaleY = scale * 1 / that.double;
    leftBtn.alpha=that.BtnAlpha;
    leftBtn.x = 35 * scale;
    leftBtn.y = h - (btnHeight + 30 * scale);
    rightBtn.x =  w - 35 * scale  - btnWidth * scale / that.double;
    rightBtn.y = h - (btnHeight + 30 * scale);
    rightBtn.alpha=that.BtnAlpha;
    rightBtn.scaleX = scale * 1 / that.double;
    rightBtn.scaleY = scale * 1 / that.double;
    leftBtn.on("mousedown", function () {
        if (that.isOver == true) {
            return
        }
        if (locationIndex == 0) {
            return
        }
        locationIndex--;
        playSprite.x = locationArray[locationIndex];
    });
    rightBtn.on("mousedown", function () {
        if (that.isOver == true) {
            return
        }
        if (locationIndex == 2) {
            return
        }
        locationIndex++;
        playSprite.x = locationArray[locationIndex];
    });


    playStage.addChild(leftBtn);
    playStage.addChild(rightBtn);
    playStage.update();


    var firstTime = true;
    var firstTime1 = true;

    that.updataStare = function () {
        that.fn1(); //+++++++++++开始游戏，添加游戏记录
        createjs.Ticker.setFPS(that.FPS);
        createjs.Ticker.addEventListener("tick", function (e) {
            that.mapMove(that.num);
            // that.blockMove(that.num);

//             console.log(that.FPS);
            if (that.isOver == true) {
                playSprite.gotoAndStop('pull');
                if (firstTime) {
                    setTimeout(function () {
//                        that.showBox.show();
                        that.fn();
                    }, 300);
                    firstTime = false;
                }
                // createjs.Ticker.setPaused(true);
            }
            playStage.update();


        });
    };
    that.updataStare();


};

Game.prototype.start = function () {
    var that = this;
};

