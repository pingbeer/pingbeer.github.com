// http://res.wx.qq.com/open/js/jweixin-1.0.0.js
//     http://m.womai.com/js/share.js
//     http://m.womai.com/nh/sale/common/App360/bridge.min.js
var zxEnv=0;//h5=0;h5&weixin=1;app=2;
if (GetQueryString("env")=="app"){
    zxEnv=2;
}
else if(navigator.userAgent.indexOf('MicroMessenger') > -1)
{
    zxEnv=1;
}

var g_mid="";
var g_cityId="";
var g_os="";
var g_appVersion="";
var g_userId=0;
var g_userSession="";
var g_usertest1="";
var g_deviceInfo="";
var g_userLevel="";
var g_userIsBind="0";
var g_userBindMP="";
var g_CartNum="";
var g_shareSwitch="";
var g_shareTitle="";
var g_shareSubTitle="";
var g_shareImgUrl="";
var g_shareWebUrl="";
var g_start=0;

/****pageInit begin****/
function zxPageStart(){
    if (zxEnv==2)
    {
        try {
            zxGetAppInfo("pageInit");
            setTimeout(function () {
                if ((g_appVersion=="")&&(g_os==""))
                {
                    g_os="1";
                    zxSetInfoByUA();
                    zxPageInit();
                }
            }, 250);
        } catch (e) {
            g_os="2";
            zxSetInfoByUA();
            zxPageInit();
        }
    }
    else
    {
        zxSetInfoByUA();
        zxPageInit();
    }
}
/****pageInit end****/

function zxSetInfoByUA(){
    var ua = navigator.userAgent,
        android = ua.indexOf('Android') > -1 ? true : false,
        ipad = ua.indexOf('iPad') > -1 ? true : false,
        ipod = ua.indexOf('iPod') > -1 ? true : false,
        iphone = !ipad && ua.indexOf('iPhone') > -1 ? true : false,
        verOS = iphone || ipad || ipod ? ua.match(/(OS)\s*(\d+)/)[2] : '';

    if (iphone || ipad || ipod)
    {
        g_os="1";
    }
    else if (android)
    {
        g_os="2";
    }
    else
    {
        g_os="3";
    }

    if (g_mid=="")
    {
        var mid=GetQueryString("mid");
        var cityid=GetQueryString("cityid");

        if (mid==null) {mid="0";}
        if (mid=="null") {mid="0";}

        if (mid=="100") {
            if (cityid==null) {cityid="31154";}
            if (cityid=="null") {cityid="31154";}
        }
        else if (mid=="200") {
            if (cityid==null) {cityid="31346";}
            if (cityid=="null") {cityid="31346";}
        }
        else {
            if (cityid==null) {cityid="31000";}
            if (cityid=="null") {cityid="31000";}
        }
        g_mid=mid;
        g_cityId=cityid;
    }
}

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function zxGoHome(){
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('goHomeToApp',{"data":{}},function(data){});});
    }
    else if(zxEnv<2)
    {
        window.location.href="http://m.womai.com/";
    }
}

function zxGoSeckill(){
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('seckillToApp',{"data":{"title":""}},function(data){});});
    }
    else if(zxEnv<2)
    {
        alert("秒杀仅限APP中使用，请下载APP~~");
    }
}

function zxGoXiaoMai(){
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('goMyLittleBuyToApp',{"data":{}},function(data){});});
    }
    else if(zxEnv<2)
    {
        window.location.href="http://m.womai.com/my/home.action";
    }
}

function zxClose(){
    if (zxEnv==2)
    {
        if (g_os=="1")
        {
            $bridge(function(bridge){bridge.callHandler('goHomeToApp',{"data":{}},function(data){});});
        }
        else
        {
            $bridge(function(bridge){bridge.callHandler('closeToApp',{"data": {}},function(data){});});
        }
    }
    else if(zxEnv==1)
    {
    }
    else if(zxEnv==0)
    {
    }
}

function zxGoMyCart(){
    if (zxEnv==2)
    {
        if (g_appVersion=="")
        {
            alert("您的APP版本太低了，不支持此功能，请更新APP~~");
        }
        else
        {
            $bridge(function(bridge){bridge.callHandler('goMyCartToApp',{"data":{}},function(data){});});
        }
    }
    else if(zxEnv<2)
    {
        window.location.href="http://m.womai.com/cart/cartGet.action";
    }
}

function zxGoMyCard(){
    if (zxEnv==2)
    {
        if (g_appVersion=="")
        {
            $bridge(function(bridge){bridge.callHandler('goMyLittleBuyToApp',{"data":{}},function(data){});});
        }
        else
        {
            $bridge(function(bridge){bridge.callHandler('goMyCardToApp',{"data":{}},function(data){});});
        }
    }
    else if(zxEnv<2)
    {
        window.location.href="http://m.womai.com/my/card.action";
    }
}

function zxGoDetail(prouctId){
    var strProductId = prouctId+"";
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('productDetailToApp',{"data":{"productId":strProductId}},function(data){});});
    }
    else if(zxEnv<2)
    {
        window.location.href="http://m.womai.com/0p"+strProductId+".shtml";
    }
}

function zxGoList(type,value,title){
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('productListToApp',{"data":{"type":type,"value":value,"title":title}},function(data){});});
    }
    else if(zxEnv<2)
    {
        if (type=="1"){window.location.href="http://m.womai.com/0c"+value+".shtml";}
        else if (type=="2"){window.location.href="http://m.womai.com/0c"+value+".shtml";}
        else if (type=="3"){window.location.href="http://m.womai.com/0k"+value+".shtml";}
        else if (type=="4"){window.location.href="http://m.womai.com/product/common/list.action?type=4&params="+value;}
    }
}

function zxGoCat(cid){
    zxGoList("1",cid,"");
}

function zxGoBrand(bid){
    zxGoList("2",bid,"");
}

function zxGoSearch(keywords){
    zxGoList("3",keywords,"");
}

function zxGoIds(ids){
    zxGoList("4",ids,"");
}

function zxGoActivity(sId){
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('activityProductListToApp',{"data":{"sid":sId}},function(data){});});
    }
    else if(zxEnv<2)
    {
        window.location.href="http://m.womai.com/0s"+sId+".shtml";//neddfix
    }
}

function zxGoActN(sId){
    if (zxEnv==2)
    {
        if (g_appVersion=="")
        {
            if (g_os=="1")
            {
                $bridge(function(bridge){bridge.callHandler('activityProductListToApp',{"data":{"sid":sId,"type":"ActivityCenter"}},function(data){});});
            }
            else
            {
                window.location.href="http://www.womai.com/sale/r/?t=n&id="+sId+".shtml";
            }
        }
        else
        {
            $bridge(function(bridge){bridge.callHandler('activityProductListToApp',{"data":{"sid":sId,"type":"ActivityCenter"}},function(data){});});
        }
    }
    else if(zxEnv<2)
    {
        window.location.href="http://m.womai.com/0ns"+sId+".shtml";
    }
}

function zxGoActC(sId){
    if (zxEnv==2)
    {
        $bridge(function(bridge){
            bridge.callHandler('activityProductListToApp',{"data":{"sid":sId,"type":"CityActivityPrductList"}},function(data){});});
    }
    else if(zxEnv<2)
    {
        window.location.href="http://m.womai.com/city/0s"+sId+".shtml";
    }
}

function zxGoActS(sId){
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('activityProductListToApp',{"data":{"sid":sId,"type":"ActivityPrductList"}},function(data){});});
    }
    else if(zxEnv<2)
    {
        window.location.href="http://m.womai.com/0s"+sId+".shtml";
    }
}

function zxDoSahre(title,ImageUrl,webUrl,commonText,weiboContent,copyContent){
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('shareToApp',{"data": {"title":title,"commonImageUrl":ImageUrl,"webUrl":webUrl,"commonText":commonText,"weiboContent":weiboContent,"copyContent":copyContent}},function(data){});});
    }
    else if(zxEnv==1)
    {
        $wxShare("http://m.womai.com/",title,webUrl,ImageUrl,commonText);
        zxCbWxSahre();
    }
    else if(zxEnv==0)
    {
        zxCbH5Sahre(title,ImageUrl,webUrl,commonText,weiboContent,copyContent);
    }
}

function zxDoShare(){
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('shareToApp',{"data": {"title":g_shareTitle,"commonImageUrl":g_shareImgUrl,"webUrl":g_shareWebUrl,"commonText":g_shareSubTitle,"weiboContent":g_shareSubTitle,"copyContent":g_shareSubTitle}},function(data){});});
    }
    else if(zxEnv==1)
    {
        $wxShare("http://m.womai.com/",g_shareTitle,g_shareWebUrl,g_shareImgUrl,g_shareSubTitle);
        zxCbWxShare();
    }
    else if(zxEnv==0)
    {
        zxCbH5Share();
    }
}

function zxGetAppInfo(fId){
    if (zxEnv==2)
    {
        $bridge(function(bridge){
            bridge.callHandler('getAppInfoToApp',{"data":{}},function(obj){
                g_appVersion=obj.data.appVersion;
                g_mid=obj.data.mid;
                g_cityId=obj.data.cityId;
                g_os=obj.data.os;
                if (fId=="pageInit")
                {
                    zxGetUserInfo("pageInit");
                }
                else
                {
                    zxCbGetAppInfo(fId,obj);
                }
            });
        });
    }
}


function zxGetUserInfo(fId){
    if (zxEnv==2)
    {
        if (g_appVersion=="")
        {
        }
        else
        {
            $bridge(function(bridge){
                bridge.callHandler('getUserLoginStatusToApp',{"data":{}},function(obj){
                    g_userId=obj.data.userId;
                    g_userSession=obj.data.userSession;
                    g_usertest1=obj.data.test1;
                    g_deviceInfo="";
                    g_userLevel=obj.data.level;
                    g_userIsBind=obj.data.isBinding;
                    g_userBindMP=obj.data.bindPhone;
                    if (fId=="pageInit")
                    {
                        zxGetCartNum("pageInit");
                    }
                    else
                    {
                        zxCbGetUserInfo(fId,obj);
                    }
                });
            });
        }
    }
}

function zxGetCartNum(fId){
    if (zxEnv==2)
    {
        if (g_appVersion=="")
        {
        }
        else
        {
            $bridge(function(bridge){
                bridge.callHandler('getCartNumberToApp',{"data":{}},function(obj){
                    g_CartNum=obj.data.cartNumber;
                    if (fId=="pageInit")
                    {
                        zxPageInit();
                    }
                    else
                    {
                        zxCbGetCartNum(fId,obj);
                    }
                });
            });
        }
    }
}

function zxAddCart(pId,fresh){
    if (zxEnv==2)
    {
        if (g_appVersion=="")
        {
            zxGoDetail(pId);
        }
        else
        {
            $bridge(function(bridge){
                bridge.callHandler('productAddCartToApp',{"data":{"productId":pId,"number":"1","productType":"0","productFresh":fresh}},function(obj){
                    var suc=(g_CartNum!=obj.data.cartNumber);
                    g_CartNum=obj.data.cartNumber;
                    zxCbAddCart(pId,suc,obj);
                });
            });
        }
    }
    else
    {
        zxGoDetail(pId);
    }
}

function zxAddCartFull(fId,pId,fresh,number,type){
    if (zxEnv==2)
    {
        if (g_appVersion=="")
        {
            zxGoDetail(pId);
        }
        else
        {
            $bridge(function(bridge){
                bridge.callHandler('productAddCartToApp',{"data":{"productId":pId,"number":number,"productType":type,"productFresh":fresh}},function(obj){
                    var suc=(g_CartNum!=obj.data.cartNumber);
                    g_CartNum=obj.data.cartNumber;
                    zxCbAddCartFull(fId,pId,number,suc,obj);
                });
            });
        }
    }
}

function zxGoLogin(fId){
    if (zxEnv==2)
    {
        $bridge(function(bridge){bridge.callHandler('userLoginInfoToApp',{data:{}},function(obj){
            g_userId=obj.data.userId;
            g_userSession=obj.data.userSession;
            g_usertest1=obj.data.test1;
            if (g_appVersion=="")
            {
                zxCbGoLogin(fId);
            }
            else
            {
                g_userIsBind=obj.data.isBinding;
                g_userBindMP=obj.data.bindPhone;
                zxCbGoLogin(fId);
            }
        });
        });
    }
    else if(zxEnv<2)
    {
        window.location.href="https://passport.m.womai.com/passport/toNoPassLogin.action";
    }
}

function zxGoBindMP(fId){
    if (zxEnv==2)
    {
        if (g_appVersion=="")
        {
            $bridge(function(bridge){bridge.callHandler('goMyLittleBuyToApp',{"data":{}},function(data){});});
        }
        else
        {
            $bridge(function(bridge){
                bridge.callHandler('goBindPhoneToApp',{"data":{}},function(obj){
                    g_userIsBind=obj.data.isBinding;
                    g_userBindMP=obj.data.bindPhone;
                    zxGoBindMP(fId);
                });
            });
        }
    }
    else if(zxEnv<2)
    {
    }
}