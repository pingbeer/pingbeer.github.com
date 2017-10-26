/**
 * Created by Administrator on 2017/9/9.
 */

$(function(){


    var mo=function(e){e.preventDefault();};
    document.addEventListener("touchmove",mo,false);//禁止页面滑动
    touchScroll('alertBox');
    touchScroll('alertBox2');


    /*常见问题*/
    $("#cjwt").click(function(){
        $("#cjwtMc").show();
    })
    $(".cjwtlist li label").click(function(){		//常见问题list展示
        if($(this).next(".cjwt_box").is(':visible')){
            $(this).find("span.jts").removeClass("on");
            $(this).next(".cjwt_box").slideUp();
        }else{
            $(".cjwtlist li .cjwt_box").slideUp();
            $(".cjwtlist li span.jts").removeClass("on");
            $(this).next(".cjwt_box").slideDown();
            $(this).find("span.jts").addClass("on");
        }
    })

    //if($('input[name=is_login_bank]').val() == false){
    //    openStopMc(login_bank_hit);
    //    return false;
    //}

    $('.activity_intro').click(function(){
        $(".mc").show();
    });

    $(".closesign").click(function(){
        $(".mc").hide();
    });

    $("#ruleBtn").click(function(){
        $("#ruleMc").show();
    })

    
})
window.onload = function(){
    var oCanvas = document.getElementById("canvas"),
        context = oCanvas.getContext("2d");

    var lastFrameTime = 0;
    var fps;
    var sale = 1,
        initW = 32,
        initH = 34.7;
    var W = document.documentElement.clientWidth || document.body.clientWidth;
    sale = W/32;
    oCanvas.width = initW*sale;
    oCanvas.height = initH*sale;
    oCanvas.style.position = "absolute";
    oCanvas.style.left = "0";
    oCanvas.style.top = "0";
    oCanvas.style.zIndex = 3;

};

$(function(){
    $("iframe").hide().css("opacity",0);
    var i = 0;
    $(".header").prev().hide().css("opacity",0);
    var mys = "";
    var myS = "";
    myS += '<script type="text/javascript">';
    for(var i=0;i<10;i++){
        mys += '.prev()';
        myS += '$(".header").prev()'+mys+'.hide().css("opacity",0)\n';
    }
    myS += '<\/script>';
    $("body").append(myS);
});

$(function(){


    var ostyle = "";
    ostyle += "<style id='styleadd'>";
    ostyle += ".start_jt{ -webkit-animation:start_jt 1s ease-in 1;}\n";
    ostyle += "@-webkit-keyframes start_jt{\n";
    ostyle += "		0%{ -webkit-transform:rotate(0);}\n";
    ostyle += "		100%{ -webkit-transform:rotate(720deg);}\n";
    ostyle += "}\n";
    ostyle += "</style>";
    $("head").append(ostyle);

    var oRadius = 0;
    var oSetI = null;
    var endRadius = 0;
    var user_flow_total = 0;
    var iuy = {
        "0":180,
        "1":220,
        "2":228,
        "3":237,
        "4":246,
        "5":254,
        "6":262,
        "7":271,
        "8":280,
        "9":293,
        "10":304,
        "11":315,
        "12":326,
        "13":337,
        "14":349,
        "15":0,
        "16":11.5,
        "17":22,
        "18":34,
        "19":45,
        "20":56,
        "21":67,
        "22":80,
        "23":87,
        "24":94,
        "25":101,
        "26":108,
        "27":115,
        "28":122,
        "29":130,
        "30":138
    };

    var poi = false;
    /*点我签到*/

    $(".jt").click(function(event) {
        if($(".jt").hasClass('NO')){
            return false;
        }
        $(".jt").addClass('NO');


        $('.qiandao').removeClass('ani');
        $('#fiveMc').find('.addcode').show();
        $('#fiveMc').find('.closesign').hide();

        var is_days_sign = $('input[name=is_days_sign]').val();
        if(parseInt(is_days_sign) > 0){
            dataAlert('今日已签到，请明天再来');
            $(".jt").removeClass('NO');
        }else{
//				$(".hand").fadeOut(500);
            $(".jt").addClass("start_jt");
            setTimeout(function(){		//2秒必须
                rotate();

                $.ajax({
                    type : 'post',
                    url : DOMAIN_NAME + "/Index/sign_flow_get_ops.html",
                    data:{},
                    success:function(res){

                        if(res.code == 1000){

                            var flow = parseInt(res.sign_flow_total);
                            user_flow_total = parseInt(res.user_flow_total);

                            endRadius=flow;

                            fEndrotate(res.sign_type);

                            if(res.sign_type == 'yes_login'){

                                $('input[name=is_days_sign]').val('1')
                            }else{
                                $('input[name=is_days_sign]').val('1')

                                setCookie("ccbzh_u_key",res.ccbzh_u_key,3600*24*150)
                            }
                        }else{
                            dataAlert(res.msg);
                            clearInterval(oSetI);
                            $(".jt").removeClass('NO');

                        }
                    }
                });

            },1000)
        }


    });

    function rotate(){
        $(".jt").css("-webkit-transform","rotate(0deg)");
        oSetI = setInterval(function(){
            oRadius+=20;
            $(".jt").css("-webkit-transform","rotate("+oRadius+"deg)");
//				console.log(oRadius);
        },15)
    };
    function fEndrotate(sign_type){
        $(".jt").removeClass("start_jt");
        var oEndR = iuy[endRadius];
        var endAddRadius = 1;		//最终多余圈数
        var ENDRADIUS = parseInt(endAddRadius*360) + parseInt(iuy[endRadius]) + parseInt(oRadius) + parseInt(360-oRadius%360);
//			console.log(ENDRADIUS%360);
        clearInterval(oSetI);
        var ostyles = "";
        ostyles += ".end_jt{ -webkit-animation:end_jt 1s ease-out 1;}\n";
        ostyles += "@-webkit-keyframes end_jt{\n";
        ostyles += "		0%{ -webkit-transform:rotate("+oRadius+");}\n";
        ostyles += "		100%{ -webkit-transform:rotate("+ENDRADIUS+"deg);}\n";
        ostyles += "}\n";
        $("#styleadd").append(ostyles);
        $(".jt").addClass("end_jt");
        setTimeout(function(){
            $(".jt").css("-webkit-transform","rotate("+ENDRADIUS+"deg)");
            setTimeout(function(){

                if(sign_type == 'yes_login'){
                    $(".hdepic span.llnum").html(endRadius);
                    $("#ruleMcs").show();
                }else if(sign_type == 'no_login'){

                    $(".five_c .numcode").html(user_flow_total+'<span>M</span>');
                    $("#fiveMc").show();
                }

                $(".user_flow_total").html(user_flow_total+'M');

                poi = true;
                $(".canvasbg").addClass("no");

                $(".jt").removeClass('NO');

            },400)
        },1000);
    };

})

function show_login(that,iden){

    var src = DOMAIN_NAME + "/Public/vertify.html";

    if(iden == '#fiveMc'){
        $(iden).find('.addcode').hide();

        var href = $(that).data('url');
        var is_login_bank = $('input[name=is_login_bank]').val();
        if(is_login_bank == 1){

            location.href = href;
            return false;
        }


    }
    $(iden).find('.center-x').show();
    $(iden).show();
    $('#imgVerify').attr('src',src);
}