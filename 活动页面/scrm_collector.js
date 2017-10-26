var scrmCollector = new ScrmCollector();

function ScrmCollector() {
	var StatsWSUrl;
	if(window.location.href.indexOf("https") == 0){
		StatsWSUrl = "https://scrm.e-pointchina.com.cn/scrm_api_stats/pv_stats/";
	} else {
		StatsWSUrl = "http://scrm.e-pointchina.com.cn/scrm_api_stats/pv_stats/";
	}
	

	this.shareAppMessage = "shareAppMessage";
	this.shareTimeline = "shareTimeline";
	this.uuidCookieName = "scrm.uuid";

	//初始化数据收集器
	this.init = function(appId, activityId, platform, uuId, debug){
		var startTime = new Date().getTime();
		console.log("init start:" + startTime);

		if(isEmpty(appId) ) {
			if(debug){
				alert("ScrmCollector init fail appId can not be empty");
			}
			return;
		} 
		if(isEmpty(platform) ) {
			platform = "wx";
		}
		if(isEmpty(uuId)) {
			uuId = getCookie(this.uuidCookieName);
			if(isEmpty(uuId)){
				uuId = "";
			}
		} else {
			setCookie(scrmCollector.uuidCookieName, uuId, 365 * 2, '/');
		}
		
		this.appId = appId;
		this.activityId = activityId;
		this.platform = platform;
		this.uuId = uuId;	
		this.debug = debug;
		if(this.debug) {
			alert('scrmCollector init appId: ' + this.appId + ' uuId: ' + this.uuId + ' activityId: ' + this.activityId);
		}

		this.collectorInitTimeMs = new Date().getTime();

		$(window).on('beforeunload', function(event) {    
			sendStay();
		});

		setTimeout(function () {
		　　getNetWorkType();
		}, 500);

		var endTime = new Date().getTime();
		console.log("init end:" + endTime + " cost:" + (endTime - startTime));
	};


	//pv数据
	this.incrPV = function(){
		if(isEmpty(this.appId)) {
			return;
		}
		var url = StatsWSUrl + "visit?" + "timestamp=" + (new Date()).getTime() + 
					"&appId=" + this.appId +
					"&platform=" + this.platform +
                     "&page=" + encodeURIComponent(getCurrentPage());
                     if(!isEmpty(this.uuId)) {
                     	url +=  "&uuId=" + encodeURIComponent(this.uuId);
                     }
                     if(!isEmpty(this.activityId)) {
                     	url +=  "&activityId=" + encodeURIComponent(this.activityId);
                     }
                     if(!isEmpty(this.wxVersion)){
						url +=  "&wxVersion=" + encodeURIComponent(this.wxVersion);
                     }
                     if(!isEmpty(this.networkType)){
						url += "&networkType=" + encodeURIComponent(this.networkType);
                     }
                     if(this.androidVersion) {
                     	url  += "&androidVersion=" + encodeURIComponent(this.androidVersion);
                     } else if(this.iosVersion) {
                     	url  += "&iosVersion=" + encodeURIComponent(this.iosVersion);
                     }
         if(this.debug) {
         	alert('incrPV url' + url);
         }

        sendData(url);
	};
	//用户行为数据
	this.incrAction = function(action){
		if(isEmpty(action) || isEmpty(this.appId)) {
			return;
		}
		var url = StatsWSUrl + "action?" + "timestamp=" + (new Date()).getTime() + 
					"&appId=" + this.appId +
					"&uuId=" + this.uuId +
					"&platform=" + this.platform +
                     "&page=" + encodeURIComponent(getCurrentPage()) +
                     "&action=" + action;
                     if(!isEmpty(this.activityId)) {
                     	url +=  "&activityId=" + encodeURIComponent(this.activityId);
                     }

        if(this.debug) {
         	alert('incrPV url' + url);
        }

        sendData(url);
	};

	this.initShareAppMessage = function(data){
		return initShareMessgage(data, "shareAppMessage");
	};

	this.initShareTimeline = function(data){
		return initShareMessgage(data, "shareTimeline");
	};

	function initShareMessgage(data,msgType){
		var wxdata = {};
		var success = data.success;
		wxdata.appId = data.appId;
		wxdata.imgUrl = data.imgUrl;
		wxdata.title = data.title;
		wxdata.desc = data.desc;
		wxdata.cancel = data.cancel;
		wxdata.fail = data.fail;


		wxdata.success = function() {
			incrShare(msgType);
			success();
		};

		var link = data.link;
		if(link.indexOf('?') < 0) {
			link += '?';
		} else {
			link += '&';
		}

		link += 'parentUuid=' + scrmCollector.uuId;
		wxdata.link = link;
		
		if(scrmCollector.debug) {
         	alert('initShareMessgage' + wxdata.link);
         }
		
		return wxdata;
	}
	//分享
	function incrShare(shareType){
		var url = StatsWSUrl + "share?" + "timestamp=" + (new Date()).getTime()+ 
					"&appId=" + scrmCollector.appId +
					"&platform=" + scrmCollector.platform +
					"&uuId=" + scrmCollector.uuId +
                     "&page=" + encodeURIComponent(getCurrentPage()) + 
                     "&shareType=" + shareType;
                      if(!isEmpty(scrmCollector.activityId)) {
                     	url +=  "&activityId=" + encodeURIComponent(scrmCollector.activityId);
                     }

         if(scrmCollector.debug) {
         	alert('incrShare url' + url);
         }
        sendData(url);
	}

	function getCurrentPage() {
        var page = window.location.pathname;
        {
            var url = window.location.href;
            var indexEnd = url.indexOf('?');
            if(indexEnd < 0) {
                indexEnd = url.length;
            }
            var indexStart = url.indexOf(page);
            page = url.substring(indexStart, indexEnd);
        }

        return page;
    }

    //获取网络类型
    function getNetWorkType() {
    	var isWx = /micromessenger/i.test(navigator.userAgent);
    	if(scrmCollector.debug){
			alert('isWx:' + isWx);
			alert('userAgent:' + navigator.userAgent);
    	}
    	if(isWx) {
    		wx.ready(function() {
    			wx.getNetworkType({
				    success: function (res) {
				        scrmCollector.networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi

				        if(scrmCollector.debug) {
			        		alert('networkType: ' + scrmCollector.networkType);
				        }

				        var agent = navigator.userAgent.toLowerCase();

					    scrmCollector.androidVersion = /android [0-9,.]{0,5}/.exec(agent);
					    scrmCollector.iosVersion = /iphone os [0-9,_]{0,5}/.exec(agent);
					    scrmCollector.wxVersion = /micromessenger\/[0-9,.]{0,6}/.exec(agent);

					    scrmCollector.incrPV();
				    }
				});
    		});
		    
		 } else {
		 	var agent = navigator.userAgent.toLowerCase();

		 	scrmCollector.networkType = /nettype\/[0-9,a-z]{0,4}/.exec(agent);
		    scrmCollector.androidVersion = /android [0-9,.]{0,5}/.exec(agent);
		    scrmCollector.iosVersion = /iphone os [0-9,_]{0,5}/.exec(agent);
		    
		    scrmCollector.wxVersion = /micromessenger\/[0-9,.]{0,6}/.exec(agent);
		    scrmCollector.incrPV();
		 }
    }

    function sendStay() {
    	var stayTimeMs = new Date().getTime() - scrmCollector.collectorInitTimeMs;
    	var url = StatsWSUrl + "stay?" + "timestamp=" + (new Date()).getTime()+ 
					"&appId=" + scrmCollector.appId +
					"&platform=" + scrmCollector.platform +
					"&uuId=" + scrmCollector.uuId +
                     "&page=" + encodeURIComponent(getCurrentPage()) + 
                     "&stayTimeMs=" + stayTimeMs;
                     if(!isEmpty(scrmCollector.activityId)) {
                     	url +=  "&activityId=" + encodeURIComponent(scrmCollector.activityId);
                     }

        sendData(url);   
    }

    function isEmpty(str){
    	return (null === str || undefined === str || str.length === 0);
    }

    function sendData(url) {
    
    	setTimeout(function () {
		　　$.ajax({ 
	        	url: url, 
	        	dataType: "jsonp", 
	        	jsonpCallback: "$scrmStatsCallBack",
	        	timeout: 3000,
	        	success: function (data) { 
	            
	        	},
	        	error: function (jqXHR, textStatus, errorThrown ){
	            
	        	}
	    	});
		}, 500);
    	//create hidden frame
        // var iframeId = "__scrm_stats_pv_" + (new Date()).getTime();
//         var iframeHtml = '<iframe id="' + iframeId + '" name="' + iframeId+ 
//         '" style="display:none" width=1 height=1'+ 
//         ' src="' + url + '"'+ '>'+
//         '</iframe>';
//         var domIFrame = $(iframeHtml);
//         $(document.body).append(domIFrame);
// 
//         if(isEmpty(scrmCollector.uuId)) {
//         	setTimeout(function() {
//         		setCookieUuid(iframeId);
//         	}, 1500);
//         		
//         }
        
        
    }

//     function setCookieUuid(iframeId) {
//     	var selector = '[id="' + iframeId + '"]';
//     	var uuid = $(selector).contents().find('pre').text();
//     	scrmCollector.uuId = uuid;
//     	setCookie(scrmCollector.uuidCookieName, uuid, 365 * 2);
//     	if(scrmCollector.debug) {
//         	alert("uuid " + scrmCollector.uuId);
//         }
//     }

    /***
	 * 获得Cookie的原始值
	 */
	function getCookie(name) {
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while (i < clen) {
			var j = i + alen;
			if (document.cookie.substring(i, j) == arg) {
				return getCookieVal(j);
			}
			i = document.cookie.indexOf(" ", i) + 1;
			if (i === 0) {
				break;
			}
		}
		return null;
	}

     /***
	 * 设定Cookie值
	 */
	function setCookie(name, value, expires) {
		delCookie(name);
		var expdate = new Date();
		var argv = setCookie.arguments;
		var argc = setCookie.arguments.length;
		var expires = (argc > 2) ? argv[2] : null;
		var path = (argc > 3) ? argv[3] : null;
		var domain = (argc > 4) ? argv[4] : null;
		var secure = (argc > 5) ? argv[5] : false;
		if(expires!== null) {
			expdate.setTime(expdate.getTime() + ( expires * 24 * 60 * 60 * 1000));
		}
		
		document.cookie = name + "=" + escape (value) +((expires === null) ? "" : ("; expires="+ expdate.toGMTString())) + 
		((path === null) ? "" : ("; path=" + path)) +((domain === null) ? "" : ("; domain=" + domain)) + 
		((secure === true) ? "; secure" : "");
	}

	/***
	 * 删除Cookie
	 */
	function delCookie(name) {
		var exp = new Date();
		exp.setTime (exp.getTime() - 1);
		var cval = getCookie (name);
		document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
	}

	/***
	 * 获得Cookie解码后的值
	 */
	function getCookieVal(offset) {
		var endstr = document.cookie.indexOf (";", offset);
		if (endstr == -1) {
			endstr = document.cookie.length;
		}
	
		return unescape(document.cookie.substring(offset, endstr));
	}
	
	this.scrmStatsCallBack = function(data){
		if(isEmpty(data)){
			return;
		}
		setCookie(scrmCollector.uuidCookieName, data, 365 * 2, '/');
	};

}
