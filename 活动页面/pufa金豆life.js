var indexPage = new IndexPage();

var isTimeOut;
var isTimeFlag = false;
var isStart = false;
var reqType = $my.getUrlParam('reqType');

var appStartTime = 1498087800000;

$(document).ready(function() {
    indexPage.initPage();
});
function IndexPage() {
    var _this = this;

    /**
     * 所有的模块化页面都需实现此方法
     * @type function(pageHeight){}
     */
    this.onInitPageFinished = null;

    this.initPage = function() {
        $my.async.series([
            loadStart,
            initBalance,
        ], function(totalCount, doneCount, error) {
            if(totalCount == doneCount) {
                console.log("IndexPage initPage() done");

                if(_this.onInitPageFinished) {
                    _this.onInitPageFinished();
                }
            }

        });
    }

    /**
     * 初始化轮播图
     */
    function initSlideSwipe(){
        mSlideSwipe = new Swiper('#m_slide_swipe',{
            pagination: '.pagination',
            autoplay:3000,
            grabCursor: true,
            loop: true,
            followFinger:false,
            paginationClickable: true,
            onSwiperCreated: function(mSlideSwipe){},
            onSlideChangeStart: function(mSlideSwipe){},
            onSlideChangeEnd: function(mSlideSwipe){mSlideSwipe.startAutoplay();}
        });
    }

    function loadStart(callback) {
        if((new Date().getTime()) > 1495900800000 && (new Date().getTime()) < 1496159999000){
            $('[id="notice"]').show();
        }else{
            $('[id="notice"]').hide();
        }
        $(".r1_before").hide();
        $("#searchbanlace").hide();
        $(".r1_after").hide();

        var screenWidth = $('[id="page"]').width();
        $('html').css('font-size',((Number(screenWidth)/320)*20)+'px');
        $(window).resize(function(){
            var screenWidth = $('[id="page"]').width();
            $('html').css('font-size',((Number(screenWidth)/320)*20)+'px');
        });

        $('[id="playGame"]').bind('click',function(){
            event.stopPropagation();
           // showDialog.showInfoDialog({title : "温馨提示", msgInfo : "尚未开始，敬请期待"});
        });

        initSlideSwipe();

        $('[id="searchJD"]').bind('click', doSearchBalance);

//        if(!isWeixin()){
//            $('.r1_1_icon').hide();
//        }

        doDJS();

        $('[id="youxinyi"]').bind('click',function(){ //往期奖品
            if(isWeixin()){
                window.location = 'https://spdb.e-pointchina.com.cn/spd_jdwelcome/wx_entry/1.0?reqType=01&source=https%3A%2F%2Fcampaign.e-pointchina.com.cn%2Fspd_regard%2Fwx_entry%2Fspdchannel%3FselfAppId%3Dspdregard&timestamp=1502094700798&sign=900299B554F5BCBA0506A2E753B7A74A&myentry=1';
            }else{
                // event.stopPropagation();
                window.location = 'https://spdb.e-pointchina.com.cn/spd_jdwelcome/app_entry/1.0?reqType=01&source=https%3A%2F%2Fcampaign.e-pointchina.com.cn%2Fspd_regard%2Fapp_entry%2Fspdchannel%3FselfAppId%3Dspdregard&timestamp=1503452660029&sign=FEFFB603F9382E389ED6CAD5ABD64387&myentry=1';
            }
        })

        $('[id="view_details"]').bind('click',function(){
            window.location = "/spd_jdwelcome/dispatch_servlet?reqType=" + reqType + "&type=2";
        })

        $('[id="bisai"]').bind('click',function(){
            event.preventDefault();
            window.location = 'http://spdb.e-pointchina.com.cn/shop_spdjd2/activity_seckill2/index.html?activityId=jd000010';
        })

        $('[id="slide_0718"]').bind('click',function(){ //往期奖品
            if(isWeixin()){
                window.location = 'https://spdb.e-pointchina.com.cn/spd_jdwelcome/wx_entry/1.0?reqType=01&source=https%3A%2F%2Fcampaign.e-pointchina.com.cn%2Factivity_spdplusn%2Fentry%2Factivityspdplusn%3FentryType%3Dwx&timestamp=1500365587149&sign=C645EF9E9F78DBD0FB0CC27EE23EFA9A&myentry=1';
            }else{
                // event.stopPropagation();
                window.location = 'https://spdb.e-pointchina.com.cn/spd_jdwelcome/app_entry/1.0?reqType=01&source=https%3A%2F%2Fcampaign.e-pointchina.com.cn%2Factivity_spdplusn%2Fentry%2Factivityspdplusn%3FentryType%3Dapp&timestamp=1500365587130&sign=A2B72742EA44D2C8757CC4B41C480971&myentry=1';
            }
        })

        $('[id="chihuo"]').bind('click',function(){
            if(isStart){
                window.location = 'https://spdb.e-pointchina.com.cn/shop_spdjd2/activity_seckill2/index.html?activityId=jd000005';
            }else{
                event.preventDefault();
                alert('活动尚未开始，敬请期待');
            }
        })
        $('[id="chihuo2"]').bind('click',function(){
            if(isStart){
                window.location = 'https://spdb.e-pointchina.com.cn/shop_spdjd2/activity_seckill2/index.html?activityId=jd000005';
            }else{
                event.preventDefault();
                alert('活动尚未开始，敬请期待');
            }
        })

        $('#searchbanlace').bind('click',function(){
            window.location = "/spd_jdwelcome/dispatch_servlet?reqType=" + reqType + "&type=1";
        })

        $('[id="apple"]').bind('click',function(){
            window.location = 'http://spdb.e-pointchina.com.cn/shop_spdjd2/activity_seckill2/iphone.html?activityId=jd000003';
        })

        $('[id="jdActivity"]').bind('click',function(){ //金豆活动
            showDialog.showInfoDialog({title : "温馨提示", msgInfo : "尚未开始，敬请期待"});
        })
        $('[id="wqGift"]').bind('click',function(){ //往期奖品
            if(isWeixin()){
                window.location = 'https://campaign.e-pointchina.com.cn/spd_whiteday/activity/spd_whiteday?entryType=11';
            }else{
                // event.stopPropagation();
                showDialog.showInfoDialog({title : "温馨提示", msgInfo : "尚未开始，敬请期待"});
            }
        })

        $('[id="btn_recommend"]').bind('click',function(){
            window.location = "/spd_jdwelcome/dispatch_servlet?reqType=" + reqType + "&type=2";
        });

        $('[id="btn_zhuanzeng"]').bind('click',function(){
            //showDialog.showInfoDialog({title : "温馨提示", msgInfo : "尚未在开放期"});
            transferJd();
        });
        if(callback) {
            callback();
        }
    }

    function initBalance(callback) {
        $my.ajax({
            url: $my.getCloudDataServiceUrl(),
            data: {
                serviceType: "com.ebuy.spdjd.web.service.CommonLoginService",
                serviceMethod: "getBalance"
            },
            success: function(response) {
                if (response == "nologin" || response == "unkonwnerror"){
                    $(".r1_before").show();
                    $("#searchbanlace").show();
                } else {
                    $("#balace").text(response);
                    $(".r1_after").show();
                }
                if(callback) {
                    callback();
                }
            },
        });
    }
}


function transferJd() {
    $my.ajax({
        url: $my.getCloudDataServiceUrl(),
        data: {
            serviceType: "com.ebuy.spdjd.web.service.TransferSendService",
            serviceMethod: "transfer"
        },
        success: function(response) {
                if (response == "nologin" || response == "unkonwnerror"){
                        window.location = "/spd_jdwelcome/dispatch_servlet?reqType=" + reqType + "&type=1";
                        return;
                } else {
                        window.location = response;
                        return;
            }
        },
    });
}

function doSearchBalance() {
    $my.ajax({
        url: $my.getCloudDataServiceUrl(),
        data: {
            serviceType: "com.ebuy.spdjd.web.service.CommonLoginService",
            serviceMethod: "getBalance"
        },
        success: function(response) {
            if (response == "nologin"){
                window.location = "/spd_jdwelcome/dispatch_servlet?reqType=" + reqType + "&type=1";
                return;
            } else {
                $("#balance").text(response);
                $("#balance").show()
            }
        },
    });

}

function doDJS(){
    clearTimeout(isTimeOut);
    var curTime = new Date().getTime();
    if(curTime >= appStartTime){
        isStart = true;
        isTimeFlag = true;
    }
    if(isTimeFlag == false){
        isTimeOut = setTimeout("doDJS()",1000);
    }
}
