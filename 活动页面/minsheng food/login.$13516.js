clearLocalStorage();
// 初始化参数
var initParam = (function() {
	var contextPath = location.protocol + "//" + location.host + "/";
	var servicePath = ""; // 相对路径
	// var servicePath = "mmc-main-webapp/"; // 相对路径
	//if (location.host.includes('localhost')) {     //只支持iOS9.0以上版本
	if (location.host.indexOf('localhost')>=0) {
		// develop
		contextPath = location.protocol + "//" + location.host + "/mmc-main-ui/";
		servicePath = "";// 等价于"http://"+location.host+"/mmc-main-webapp/";
	}
	var homeURL = "./home.$13516.html";
	var weParam = contextPath + homeURL.substring(2);
	var lastQueueTime = localStorage.lastQueueTime;
	if (lastQueueTime == undefined || lastQueueTime == "undefined") {
		lastQueueTime = "";
	}
	var encryptStr = getQueryString("encryptStr");
	var state = getQueryString("state");
	var actyId = getQueryString("actyId");
	var actyGroupId = getQueryString("actyGroupId");
	var channelType = getQueryString("channelType");
	var usrType = getQueryString("usrType");
	if (isEmpty(channelType)) {
		channelType = "01";
	}
	if (parseInt(channelType) > 0 && parseInt(channelType) <= 50) {
		localStorage.templateType = "activityday";
	} else {
		channelType = channelType.toLowerCase();
		if ("mgm" == channelType) {
			homeURL = "./home_mgm.$13516.html";
		} else if ("mgm2" == channelType) {
			homeURL = "./home_mgm2.$13516.html";
		} else {
			homeURL = "./home_" + channelType + ".html";
		}
		localStorage.templateType = channelType;
	}
	if (state != null && actyId != null) {
		localStorage.actyId = actyId;
		localStorage.actyGroupId = actyGroupId;
		localStorage.actyType = "true";
		localStorage.index = "0";
		homeURL = homeURL + "#/" + state;
	}
	
	return {
		getContextPath : function getContextPath() {
			return contextPath;
		},
		getServicePath : function getServicePath() {
			return servicePath;
		},
		getHomeURL : function gethomeURL() {
			return homeURL;
		},
		getWeParam : function getWeParam() {
			return weParam;
		},
		getLastQueueTime : function getLastQueueTime() {
			return lastQueueTime;
		},
		getChannelType : function getChannelType() {
			return channelType;
		},
		getEncryptStr : function getEncryptStr() {
			return encryptStr;
		},
		getUsrType : function getUsrType() {
			return usrType;
		},
		getState : function getState(){
			return state;
		},
		getActyId : function getActyId(){
			return actyId;
		}
	};
})();

/* 定义function begin*/
// 校验参数
function checkParam() {
	if (initParam.getChannelType() == "02") {
		var param=["channelType","state","usrType","encryptStr","actyId"];
		if (isEmpty(initParam.getChannelType())) {
			$(".errorArea").css("display","block");
			$("#gobackApp").css("display","inline-block");
			$(".errorMsg").html("传入参数："+param[0]+"错误");
			return false;
			}
		if (isEmpty(initParam.getState())) {
  			$(".errorArea").css("display","block");
			$("#gobackApp").css("display","inline-block");
			$(".errorMsg").html("传入参数："+param[1]+"错误");
			return false;
			}
		if (isEmpty(initParam.getUsrType())) {
			$(".errorArea").css("display","block");
			$("#gobackApp").css("display","inline-block");
			$(".errorMsg").html("传入参数："+param[2]+"错误");
			return false;
			}
		if (isEmpty(initParam.getEncryptStr())) {
			$(".errorArea").css("display","block");
			$("#gobackApp").css("display","inline-block");
			$(".errorMsg").html("传入参数："+param[3]+"错误");
			return false;
			}
		if (isEmpty(initParam.getActyId())) {
  			$(".errorArea").css("display","block");
			$("#gobackApp").css("display","inline-block");
			$(".errorMsg").html("传入参数："+param[4]+"错误");
			return false;
			}
	}
}

//登录渠道请求不同登录方法
function login() {
	if (initParam.getChannelType() == "02") {
		if(checkParam()!=false){
			appLogin();	
		}
	} else if (initParam.getChannelType() == "03") {
		// wapLogin();
	} else {
		weLogin();
	}
}

//清理localStorage缓存
function clearLocalStorage() {
	localStorage.removeItem("actyId");
	localStorage.removeItem("actyType");
	localStorage.removeItem("orderType");
	localStorage.removeItem("isQualify");
	localStorage.removeItem("qualifyUnit");
	localStorage.removeItem("mechId");
	localStorage.removeItem("giftId");
	localStorage.removeItem("isShowTotal");
	localStorage.removeItem("preCity");
	localStorage.removeItem("orderId");
	localStorage.removeItem("qualfyType");
	localStorage.removeItem("orderDetails");
	localStorage.removeItem("orderPrice");
	localStorage.removeItem("giftNum");
	localStorage.removeItem("giftName");
	localStorage.removeItem("groupId");
	localStorage.removeItem("giftSumPrice");
	localStorage.removeItem("isMchtLevel");
	localStorage.removeItem("encryptMobile");
	localStorage.removeItem("goodsBannerPicPath");
	localStorage.removeItem("goBusSubway");
	localStorage.removeItem("isRefresh");
	localStorage.removeItem("shareTitle");
	localStorage.removeItem("shareDesc");
	localStorage.removeItem("shareUrl");
	localStorage.removeItem("shareImgUrl");
	localStorage.removeItem("exchMode");
	localStorage.removeItem("ChannelType");	
}

var loginTimes = 0;
// 微信渠道登录weLogin
function weLogin() {
	$.ajax({
		type : 'GET',
		timeout : 3000,
		url : initParam.getServicePath() + 'data/Login.json?t='+new Date().getTime(),
		async : true,
		data : {
			"param" : initParam.getWeParam(),
			"flag" : "prefacty",
			"encryptStr" : initParam.getEncryptStr(),
			"lastQueueTime" : initParam.getLastQueueTime(),
			"channelType" : initParam.getChannelType(),
			"userKey" : localStorage.userKey || ''
		},
		dataType : "json",
		success : function(data) {
			if (data.reply.returnCode.type == "S") {
				if (data.reply.returnCode.code == 'LIMIT') {
					if (loginTimes >= 2) {
						location.href = initParam.getHomeURL();
					} else {
						loginTimes++;
						window.setTimeout("weLogin()", 3000);
					}
				} else {
					if (localStorage.userKey) {
						localStorage.isLogin = 1;
					}
					localStorage.lastQueueTime = data.reply.lastQueueTime;
					localStorage.UIFlag = data.reply.UIFlag;
					if ("0102" == localStorage.UIFlag) {
						localStorage.userKey = "";
					} else {
						if (!isEmpty(data.reply.userKey)) {
							localStorage.userKey = data.reply.userKey;
						}
					}
					if (!isEmpty(data.reply.resMap)) {
						localStorage.weShareData = JSON
								.stringify(data.reply.resMap);
					}
					if (isEmpty(localStorage.weShareData)) {
						if (loginTimes >= 2) {
							location.href = initParam.getHomeURL();
						} else {
							loginTimes++;
							window.setTimeout("weLogin()", 3000);
						}
					} else {
						location.href = initParam.getHomeURL();
					}
				}
			} else {
				location.href = initParam.getHomeURL();
			}
		},
		error : function(XMLHttpRequest, errorMsg, errorObj) {
			if (loginTimes >= 2) {
				location.href = initParam.getHomeURL();
			} else {
				loginTimes++;
				window.setTimeout("weLogin()", 3000);
			}
		}
	});
}

// app手机银行渠道登录appLogin
function appLogin() {
	$.ajax({
		type : 'GET',
		timeout : 3000,
		url : initParam.getServicePath() + 'data/Login.json',
		async : true,
		data : {
			"encryptStr" : initParam.getEncryptStr(),
			"lastQueueTime" : initParam.getLastQueueTime(),
			"channelType" : initParam.getChannelType(),
			"userKey" : localStorage.userKey || '',
			"usrType" : initParam.getUsrType()
		},
		dataType : "json",
		success : function(data) {
			if (data.reply.returnCode.type == "S") {
				if (data.reply.returnCode.code == 'LIMIT') {
					if (loginTimes >= 2) {
						location.href = initParam.getHomeURL();
					} else {
						loginTimes++;
						window.setTimeout("appLogin()", 3000);
					}
				} else {
					if (localStorage.userKey) {
						localStorage.isLogin = 1;
					}
					localStorage.lastQueueTime = data.reply.lastQueueTime;
					localStorage.UIFlag = data.reply.UIFlag;
					if ("0202" == localStorage.UIFlag) {
						localStorage.userKey = "";
					} else {
						if (!isEmpty(data.reply.userKey)) {
							localStorage.userKey = data.reply.userKey;
						}
					}
					location.href = initParam.getHomeURL();
				}
			} else {
				location.href = initParam.getHomeURL();
			}
		},
		error : function(XMLHttpRequest, errorMsg, errorObj) {
			if (loginTimes >= 2) {
				location.href = initParam.getHomeURL();
			} else {
				loginTimes++;
				window.setTimeout("appLogin()", 3000);
			}
		}
	});
	localStorage.ChannelType=initParam.getChannelType();
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
function isEmpty(obj) {
	if (typeof (obj) == "function") {
		return false;
	}
    if (obj == undefined || obj == "" || obj == [] || obj == {} || obj.length == 0 || obj == "undefined") {
		return true;
	} else {
		return false;
	}
}
/* 定义function end*/

//执行function
checkParam();
login();
