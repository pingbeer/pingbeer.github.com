/**
 * Created by Administrator on 2017/4/12.s_id
 */
$(function(){

    $("button.miaosha_btn").css("background","#f0f0f0");



    $(".contents ul li").click(function(){
        $("#thisurl").val();
        $("#tels_ipt h1").html();
        var oUrl = $(this).data("url");
        $("#thisurl").val(oUrl);
        $("#tels_ipt").show();
        var oTsName = $(this).find("h2").html();
        $("#tels_ipt h1").html(oTsName);
    })



    /*免息商品*/
    $("#tels_ipt button").click(function(){
        var oUrlNew = $("#thisurl").val();
        var oTels = $("[name=tels]").val();
        var title = $("#tels_ipt h1").text();
        var oTest =  /^0{0,1}(13[0-9]|15[0-9]|18[5-9]|17[7-9]|180|182|185|145)[0-9]{8}$/;      //手机号码正则

        if(!oTest.test(oTels)){

            $('#tels_ipt section p.hit').text('您输入的号码不正确，请重新输入！');
            return false;
        }

        $.ajax({
            type : 'post',
            url : ROOT_INDEX_URL + "/Buy/buy_mobile_ops.html",
            async: false,
            data : {use_mobile:oTels,type:title},
            success : function(res){
                var msg = res.msg;
                if(res.code == 1000){

                    window.location.href = oUrlNew;
                }else{
                    $('#tels_ipt section p.hit').text(msg);
                }


            }

        });

    })


    $(".everyli").click(function(){
        $("#everydayurl").val("");//初始化url
        $("#everyday h1").html("");//初始化商品名字
        $("#everyday h4").html("");//初始化商城价
        $("#everyday h3").html("");//初始化秒杀价
        $("#everyday").show();
        var oThisUrl = $(this).data("url");//获取对应商品url
        var oThisName = $(this).data("name");//获取对应商品名字
        var oThisOld = $(this).data("old");//获取对应商品商城价
        var oThisMoney = $(this).data("money");//获取对应商品秒杀价
        $("#everydayurl").val(oThisUrl);		//设置弹出窗的地址
        $("#everyday h1").html(oThisName);				//设置弹出窗的商品名字
        $("#everyday h4").html("商城价:￥"+oThisOld);				//设置弹出窗的商品商城价
        $("#everyday h3").html("秒杀价:￥"+oThisMoney);				//设置弹出窗的商品秒杀价
    })


    $(".every_btn").click(function(){
        var oUrl = $("#everydayurl").val();
        var oTels = $(".every_ipt").val();
        var title = $("#everyday h1").text();
        var oTest =  /^0{0,1}(13[0-9]|15[0-9]|18[5-9]|17[7-9]|180|182|185|145)[0-9]{8}$/;      //手机号码正则
        if(!oTest.test(oTels)){
            //dataAlert('您输入的号码不正确，请重新输入！');
            $('#everyday section p.hit').text('您输入的号码不正确，请重新输入！');
            return false;
        }
        $.ajax({
            type : 'post',
            url : ROOT_INDEX_URL + "/Buy/buy_mobile_ops.html",
            async: false,
            data : {use_mobile:oTels,type:title},
            success : function(res){
                var msg = res.msg;
                if(res.code == 1000){

                    window.location.href = oUrl;
                }else{

                    $('#everyday section p.hit').text(msg);
                }


            }

        });
    })



    /*显示已抽奖到的内容*/
    var order_no = $('input[name=order_no]').val();
    if(order_no){

        openAlt();
    }

    /*我要秒杀按钮*/
    $('#miaosha button').click(function(){


        if(!$(this).hasClass('ok')){
            return false;
        }

        var that = this;
        var type = $(this).data('type');
        var s_id = $('input[name=s_id]').val();

        var oTel = $("[name=seckill_mobile]").val();		//收货人电话
        var oTest =  /^0{0,1}(13[0-9]|15[0-9]|18[5-9]|17[7-9]|180|182||185|145)[0-9]{8}$/;      //手机号码正则\

        if(!oTest.test(oTel)){
            $('#miaosha section p.hit').text('您输入的号码不正确，请重新输入！');
            return false;
        }

        if($(that).hasClass('no_save')){

            dataAlert('正在提交。。。');
            return false;
        }

        $(that).addClass('no_save')

        $.ajax({
            type : 'post',
            url : ROOT_INDEX_URL + "/Buy/seckill_ops.html",
            async: false,
            data : {'use_mobile': oTel,s_id:s_id},
            success : function(res){
                var msg = res.msg;
                if(res.code == 1000){

                    location.href = res.order_url
                    //location.href = 'http://shop.ccb.com/products/pd_0001948717.jhtml';
                }else{
                    $('#miaosha section p.hit').text(msg);
                }
                $(that).removeClass('no_save');


            }

        })

    })

    /*点击秒杀*/
    $(".miaosha").click(function(){



        $("#miaosha").show();
        $(".main").removeClass("lvj");

    })



    /*转盘输入手机号*/
    $(".tel_btn").click(function(){
        var oTelVal = $(".tel_val").val();
        var oTest =  /^0{0,1}(13[0-9]|15[0-9]|18[5-9]|17[7-9]|180|182||185|145)[0-9]{8}$/;      //手机号码正则
        if(!oTest.test(oTelVal)){

            $('#dazhuangpan section p').text('您输入的号码不正确，请重新输入！');
            return false;
        }
        turn_fn();//这是转盘的事件
    })


    /*----------------------------------大转盘------------*/
    $(".indicator").click(function(){
//			prizeRand();
        $('#dazhuangpan').show();
        $(".main").addClass("lvj");
    });


    $(".hit_content button").click(function(){			//弹窗按钮
        closeAlt();
    })


    $(".close").click(function(){
        $(this).parents(".mc").hide();
        $(".main").removeClass("lvj");
    })


    //$(".alt button").click(function(){			//弹窗按钮
    //    closeAlt();
    //})

    $(".gototop").click(function(){
        $("html,body").animate({scrollTop:0},500);
        clearCookie("oTop");
        return false;
    });


    $(".sold_out").click(function(ev){		//售馨阻止定义
        event.stopPropagation();
    })

    countTime()



    $("*").click(function(){
        var oTop = $(window).scrollTop();
        setCookie('oTop',oTop,0);
    });

    $(".headtxt").click(function(){
        window.location.reload();
    });
    $("[data-href]").click(function(){
        spread(this);
    });
})


/*转盘抽奖*/
function turn_fn(){
    $.ajax({
        type : 'post',
        url : ROOT_INDEX_URL + "/Buy/award_get.html",
        async: false,
        data : {mobile:$('input[name=tel_val]').val()},
        success : function(res){

            if(res.code == 1000){


                $('#dazhuangpan').hide();
                $(".main").removeClass("lvj");

                $(".indicator").css({"-webkit-transform":"rotate(0deg)"});

                var prize_info = res.prize_info;
                var angle = prize_info.angle;
                angle = angle.split(",");
                var make_number = angle[Math.floor(Math.random()*angle.length)];//获得该有的角度的随机一个角度
                make_number = parseInt(make_number) + 3600;

                $(".indicator").css({"-webkit-transform":"rotate("+make_number+"deg)","-webkit-animation":"seed 5s cubic-bezier(0.9,0,0,0.999999) 1"});
                var styles = "";
                styles += "<style id='sty'>@-webkit-keyframes seed{";
                styles += "		0%{ -webkit-transform:rotate(0deg); }";
                styles += "		100%{ -webkit-transform:rotate("+make_number+"deg); }";
                styles += "	}</style>";
                $("head").append(styles);


                setTimeout(function(){
                    setTimeout(function(){
                        $("#sty").remove();
                        $(".indicator").removeAttr("style");
                    },1000)


                    if(prize_info.order_no){
                        $.ajax({
                            type : 'post',
                            url : ROOT_INDEX_URL + "/Buy/award_api_ops.html",
                            async: false,
                            data : {a_id:prize_info.id,order_no:prize_info.order_no},
                            success : function(res){

                                openAlt(res.title,res.msg,'关闭');
                            }

                        })
                    }
                },5000)



            }else{

                dataAlert(res.msg);
            }



        }

    })
}

//		openAlt("提示","提示提示提示提示提示提示","好的")
function openAlt(title,content,btn){	//open活动没开启弹窗
    if(title && content && btn){
        //alert(content);
        $(".hit_content .obx_title").html(title);
        $(".hit_content .sc_mc h5").html(content);
        $(".hit_content .obx button").html(btn);
    }

    $(".hit_content").show();
    $(".main").addClass("lvj");
}
function closeAlt(){	//close活动没开启弹窗

    var order_no = $('input[name=order_no]').val();

    if(order_no){
        location.href = ROOT_INDEX_URL + "/Buy/index.html";
    }else{

        $(".hit_content").hide();
        $(".main").removeClass("lvj");
    }
}

function openWrite(){	//open填写弹窗
    $(".write").show();
    $(".main").addClass("lvj");
}

function closeWrite(){	//close填写弹窗
    $(".write").hide();
    $(".main").removeClass("lvj");
}

function countTime(){
    var timrr = setInterval(function(){
        var oCdTime = $(".countdown").data("value");
        var osplitTime = oCdTime.split(" ");
        var newDate = osplitTime[0];
        var aGoYear = newDate.split("-")[0];//年
        var aGoMonth = newDate.split("-")[1];//月
        var aGoDay = newDate.split("-")[2];//日
        var newTime = osplitTime[1];
        var aGoHourse = newTime.split(":")[0];//时
        var aGoMinute = newTime.split(":")[1];//分
        var aSecond = newTime.split(":")[2];//秒

        var endDate = new Date(aGoYear,aGoMonth-1,aGoDay,aGoHourse,aGoMinute,aSecond).getTime();


        //获取系统时间
        var oDate = new Date();
        var getSs = oDate.getTime();	//获取s
        var leftT = endDate - getSs;
        var leftsecond = parseInt(leftT/1000);
        var day=Math.floor(leftsecond/(60*60*24));
        var hour=Math.floor((leftsecond-day*24*60*60)/3600);
        var minute=Math.floor((leftsecond-day*24*60*60-hour*3600)/60);
        var second=Math.floor(leftsecond-day*24*60*60-hour*3600-minute*60);
        if((day<=0 && hour<=0 && minute<=0 && second<=0) || (day<0)){
            clearInterval(timrr);
            $(".second").html('00');

        }else{
            $(".day").html(day);
            $(".hour").html(hour);
            $(".minute").html(minute);
            $(".second").html(second);
        }

    },1000);
    $("button.miaosha_btn").addClass('ok')
    $("button.miaosha_btn").removeAttr("style").removeAttr("disabled");
}

function setCookie(b,d,a){var c=new Date();c.setDate(c.getDate()+a);document.cookie=b+"="+d+";expries"+c}function getCookie(c){var a=document.cookie.split("; ");for(var d=0;d<a.length;d++){var b=a[d].split("=");if(b[0]==c){return b[1]}}};function clearCookie(a){setCookie(a,"1",-1)};