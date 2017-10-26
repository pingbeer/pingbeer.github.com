var contextPath=location.protocol+"//"+location.host+"/";
var servicePath="";//相对路径
// var servicePath="mmc-main-webapp/";//相对路径
//if (location.host.includes('localhost')) {     //只支持iOS9.0以上版本
if (location.host.indexOf('localhost')>=0) {
	//develop
	contextPath=location.protocol+"//"+location.host+"/";
	// contextPath=location.protocol+"//"+location.host+"/mmc-main-ui/";
	servicePath="";//等价于"http://"+location.host+"/mmc-main-webapp/";
}

var signURL="http://wx.creditcard.cmbc.com.cn/wxbankms/msContract";
var bindBinURL=signURL;
var appBindBinURL="https://creditcard.cmbc.com.cn/wsv2/?enstr=IfsiRrO1mEwEKm63Avq%2b%2bY1vdZBFY7V8xYeQfydmh3TMy%2b%2bhm%2beq0eRvxVSR7BJQtNDa%2bpFqMQKzwe17l4EhCrr3LUNo3%2fDFp1FOPecKalcncx3BkZV7l2YT1N2BpzOxJTjiIpoVr3YDJR%2bF%2fxlVzcKd7JTkj27Uwq6ePc%2b6POY%3d";
var weMenuURL="http://wx.creditcard.cmbc.com.cn/wxbankms/systemDocking/privilegeEncryptParam?keyword=mmc";
var weShareTitle='营销魔方全年最爆款的福利都在这儿了~';
var weShareDesc='营销魔方全面上线，约么？';
var weShareUrl=weMenuURL;
var weShareImgUrl="activityday/image/share.jpg";
localStorage.defaultShareTitle=weShareTitle;
localStorage.defaultShareDesc=weShareDesc;
localStorage.defaultShareUrl=weShareUrl;
localStorage.defaultShareImgUrl=weShareImgUrl;

var recordsPerPage=10;//翻页查询，每次查询条数
var swipeMax=4;
var queryTime=3000; //轮询时间3s
var queryTotalNum=3; //轮询次数3次

var reNumber = /^[0-9]*[1-9][0-9]*$/ ;
var MGMHomeURL="http://wx.creditcard.cmbc.com.cn/wxbankms/recommendCreditCard/homePage";
var MGMPopularityURL="http://wx.creditcard.cmbc.com.cn/wxbankms/recommendCreditCard/recommendResult";
var MGM2HomeURL="http://wx.creditcard.cmbc.com.cn/wxbankms/recommendCreditCard/homePage";
var MGM2PopularityURL="http://wx.creditcard.cmbc.com.cn/wxbankms/recommendCreditCard/recommendResult2";
function toHome(){
		location.href="./home.$13516.html"+"#/all";
}
function toMyOrder(){
	if('0102'==localStorage.UIFlag){
		location.href=signURL;
	}else{
		location.href="./home.$13516.html"+"#/mypriv";
	}
}

function changeClass(obj){
	$(obj).toggleClass('on');
	$(obj).parent().siblings(".introduce_con").toggleClass('none');
}

function getQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)  return unescape(r[2]); 
	return null;

}

var isEmpty = function(obj) {
    if (typeof(obj) == "function") {
        return false;
    }
    if (obj == undefined || obj == "" || obj == [] || obj == {} || obj.length == 0 || obj == "undefined") {
        return true;
    } else {
        return false;
    }
};

var getTemplateType=function(){
	var type="activityday";
	if(!isEmpty(localStorage.templateType)) type=localStorage.templateType;
	return type;
};

function weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl){
	wx.ready(function(){
		/*//分享到朋友圈
		wx.onMenuShareTimeline({
			title:weShareTitle||localStorage.defaultShareTitle,
			link:weShareUrl||localStorage.defaultShareUrl,
			imgUrl:contextPath+(weShareImgUrl||localStorage.defaultShareImgUrl),
			success:function(){},
			cancel:function(){}
		});
		//分享给朋友
		wx.onMenuShareAppMessage({
			title:weShareTitle||localStorage.defaultShareTitle,
			desc:weShareDesc||localStorage.defaultShareDesc,
			link:weShareUrl||localStorage.defaultShareUrl,
			imgUrl:contextPath+(weShareImgUrl||localStorage.defaultShareImgUrl),
			success:function(){},
			cancel:function(){}
		});*/
		wx.hideOptionMenu();
	});
}

var interval=600000; //标准时间间隔10分钟
//小于interval返回false
function isInterval(time){
	var currentTime=new Date().getTime();
	if(!isEmpty(time)){
		var Interval=currentTime-time;
		if(Interval<interval){
			return false;
		}
	}
	return true;
}

var shareActy={
	"A20161230241":{shareTitle:"全年最爆款的福利都在这儿了~车车卡！",shareDesc:"1元洗车",shareUrl:"contextPath+'index.html?state=prodList&actyId='+localStorage.actyId",shareImgUrl:"activityday/image/ico_ok.png"},
	"A20161224922":{shareTitle:"全年最爆款的福利都在这儿了~加油卡！",shareDesc:"加油卡",shareUrl:"contextPath+'index.html?state=prodList&actyId='+localStorage.actyId",shareImgUrl:"activityday/image/ico_ok.png"},
	"A20170122763":{shareTitle:"推荐亲友办卡  赢六重大礼",shareDesc:"邀请亲友办卡免费得iPhone7、Rimowa登机箱等明星产品！",shareUrl:"http://wx.creditcard.cmbc.com.cn/wxbankms/recommendCreditCard/homePage",shareImgUrl:"mgm/images/share.jpg"},
	"A20170122764":{shareTitle:"推荐亲友办卡  赢六重大礼",shareDesc:"邀请亲友办卡免费得iPhone7、Rimowa登机箱等明星产品！",shareUrl:"http://wx.creditcard.cmbc.com.cn/wxbankms/recommendCreditCard/homePage",shareImgUrl:"mgm/images/share.jpg"},
	"A20170301881":{shareTitle:"中国民生银行信用卡申请",shareDesc:"点击申请信用卡，核卡30天首刷即可获赠膳魔师保温杯、新秀丽双肩背包等好礼四选一！",shareUrl:"https://creditcard.cmbc.com.cn/wsonline/index/index.jhtml",shareImgUrl:"activityday/image/share_A20170301881.jpg"},
	"A20170221827":{shareTitle:"民生京东白条联名卡，开卡享甜蜜好礼！",shareDesc:"星巴克咖啡&五星级酒店自助餐月月轻松兑，无条件免收年费！",shareUrl:"https://bk.jd.com/m/cmbc/fillForm/index.html",shareImgUrl:"activityday/image/share_A20170221827.jpg"},
}

var uselessActy={"A20170111675":{"promptMsg":"全新系统即将开放，敬请期待！"}};
