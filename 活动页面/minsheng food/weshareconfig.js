var weShareData=JSON.parse(localStorage.weShareData);
wx.config({
    debug: false, 				// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: weShareData.appId, 			// 必填，公众号的唯一标识
    timestamp: weShareData.timestamp, 	// 必填，生成签名的时间戳
    nonceStr: weShareData.nonceStr, 	// 必填，生成签名的随机串
    signature: weShareData.signature,	// 必填，签名，见附录1
    jsApiList: [
            	'checkJsApi',
            	'onMenuShareTimeline',		//分享到朋友圈
            	'onMenuShareAppMessage',	//分享到朋友
            	'onMenuShareQQ',			//分享到QQ
            	'onMenuShareWeibo',			//分享到腾讯微博
            	'onMenuShareQZone',			//分享到QQ空间
            	'scanQRCode',				//微信扫一扫
            	'openLocation',             //定位
            	'getLocatin'                //定位
            ] 						// 必填，需要使用的JS接口列表
});
/*wx.error(function(res){
	console.log("wx.error="+res);
	if(confirm("微信认证失败，导致微信转发、分享、扫一扫、地图定位等功能不可用。是否需要重新从微信公众号进入？若要使用以上功能，请确定，如果不需要以上功能，请取消！")){
		location.href=weMenuURL;
	};
});*/