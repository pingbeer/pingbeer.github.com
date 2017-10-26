var webFolder = "weekseckill";

webClientService.setWebAppName('seckill2');
// webClientService.setWebAppName('seckill2_test');
function getWebAppAddress() {
	return "http://campaign.e-pointchina.com.cn" + webClientService.getWebAppName();
}

/**
 * 共通异常错误处理
 */
function doError() {
	// 停止滚轮
	clientService.invoke(
		{target:'thisView', method:'stopWaitingSpinnerAnimating', params:[], callBackWhenSucceed: '', callBackWhenError: ''}
    );

    
}

function getQueryStr(str){
	var rs = new RegExp("(\&\?)" + str + "=([^\&#]*)(\&|$|#)", "g").exec(window.document.location.href);   
    if(rs){
    	return decodeURIComponent(rs[2]);
    } else {
    	return "";
    }
};

function isEmpty(str) {
	if (str == null || str == undefined || str.length == 0) {
		return true;
	}
	return false;
}
function nullToEmpty(str) {
	if (str == null || str == undefined || str.length == 0) {
		return "";
	}
	return str;
}

/**
 * 正则表达式验证
 * @param {Object} val
 * @param {Object} regexExpression
 */
function matchRegex(val, regexExpression) {
	var reg = new RegExp(regexExpression);
	var result = reg.test(val);
	return result;
}

/**
 * 金额格式化
 * @param {Object} amount
 * @param {Object} fixedFractionalPartLength
 */
function formatMoneyAmount(amount, fixedFractionalPartLength) {
    var fractionDec = 1;
    if(fixedFractionalPartLength != undefined && fixedFractionalPartLength != 0) {
        fractionDec = Math.pow(10, fixedFractionalPartLength);
    }
	var amountStr = "" + (Math.round(Number(amount) * fractionDec) / fractionDec);
	var amountSign = "";
	if(amountStr.charAt(0) == '-' || amountStr.charAt(0) == '+') {
		amountSign = amountStr.charAt(0);
		amountStr = amountStr.substring(1);
	}
	
    var fmt = "";
    
    var i;
    var index0 = amountStr.indexOf('.');
    
    if(fixedFractionalPartLength == undefined || fixedFractionalPartLength < 0) {
        if(index0 < 0) {
            index0 = amountStr.length;
        } else {
            var isAllZero = true;
            for(i = amountStr.length - 1; i > index0; i--) {
                if(amountStr.charAt(i) != '0') {
                    isAllZero = false;
                    break;
                }
            }
            
            if(!isAllZero) {
                fmt = amountStr.substring(index0);
            }
        }
    } else {
        if(index0 < 0) {
            index0 = amountStr.length;
            
            if(fixedFractionalPartLength != 0) {
                fmt = ".";
                
                for(i = 0; i < fixedFractionalPartLength; i++) {
                    fmt += "0";
                }
            }
        } else {
            var curFracPartLen =  amountStr.length - index0 - 1;
            var diffLen =  curFracPartLen - fixedFractionalPartLength;
            if(diffLen >= 0) {
                fmt = amountStr.substring(index0, index0 + fixedFractionalPartLength + 1);
            } else {
                fmt = amountStr.substring(index0);
                for(i = 0; i > diffLen; i--) {
                    fmt += "0";
                }
            }
        }
    }
    
    if(amountStr.indexOf(',') < 0) {
        var k = 0;
        for(i = index0 - 1; i >= 0; i--) {
            if(k > 0 && (k % 3) == 0) {
                fmt = amountStr.charAt(i) + ',' + fmt;                
            } else {
                fmt = amountStr.charAt(i) + fmt;
            }
            
            k++;                        
        }
    }
    
    if(amountSign.length > 0) {
    	fmt = amountSign + fmt;
    }
    
    return fmt;
}

/**
 * 转换日期
 * @param {Object} year
 * @param {Object} month
 * @param {Object} day
 */
function convertToDateInYMDFormat(year, month, day) {
    var d1 = new Date(year, Number(month) - 1, day);
    d1.setHours(0);
    d1.setMinutes(0);
    d1.setSeconds(0);
    d1.setMilliseconds(0);
    
    return d1;
}
/**
 * 转换日期
 * @param {Object} dateString
 */
function convertToDateInYYYYMMDD(dateString) {
	var year = dateString.substr(0, 4);
	var month = dateString.substr(4, 2);
	var day = dateString.substr(6, 2);
	
	return convertToDateInYMDFormat(year, month , day);
}
/**
 * 转换日期
 * @param {Object} dateLong
 */
function convertToDateInLong(dateLong) {
	var d1 = new Date();
    d1.setTime(dateLong);
    
    return d1;
}

/**
 * 得到日期间隔天数
 * @param {Object} year
 * @param {Object} month
 * @param {Object} day
 * @param {Object} olderYear
 * @param {Object} olderMonth
 * @param {Object} olderDay
 */
function calcuDiffDaysInYMDFormat(year, month, day, olderYear, olderMonth, olderDay) {
    var d0 = convertToDateInYMDFormat(olderYear, olderMonth, olderDay);
    var d1 = convertToDateInYMDFormat(year, month, day);
 
    calcuDiffDaysInDateType(d1, d0);   
}
/**
 * 得到日期间隔天数
 * @param {Object} d1
 * @param {Object} d0
 */
function calcuDiffDaysInDateType(d1, d0) {
    var diffMS = d1.getTime() - d0.getTime();
    var diffDays = Math.ceil(diffMS / 86400000);
    
    return diffDays; 
}

/**
 * 日期格式化
 * @param {Object} formator
 */
Date.prototype.toFomatorString = function(formator) {
	if(this.getFullYear() == 1899) {
		return "";
	}
	
	var returnText = formator.toUpperCase(); 

	if (returnText.indexOf("YYYY") > -1) { 
		returnText = returnText.replace("YYYY", this.getFullYear()); 
	} 

	if (returnText.indexOf("MM") > -1) { 
		returnText = returnText.replace("MM", padZero(this.getMonth() + 1, 2)); 
	} 

	if (returnText.indexOf("DD") > -1) { 
		returnText = returnText.replace("DD", padZero(this.getDate(), 2)); 
	} 

	if (returnText.indexOf("HH") > -1) { 
		returnText = returnText.replace("HH", padZero(this.getHours(), 2)); 
	} 

	if (returnText.indexOf("MI") > -1) { 
		returnText = returnText.replace("MI", padZero(this.getMinutes(), 2)); 
	} 

	if (returnText.indexOf("SS") > -1) { 
		returnText = returnText.replace("SS", padZero(this.getSeconds(), 2)); 
	} 
	
	if (returnText.indexOf("SI") > -1) { 
		returnText = returnText.replace("SI", padZero(this.getMilliseconds(), 3)); 
	} 
	
	return returnText; 
} 

/**
 * 补零
 * @param {Object} num
 * @param {Object} n
 */
function padZero(num, n) {  
	num = num.toString();
    var len = num.toString().length;  
    while(len < n) {  
        num = "0" + num;  
        len++;  
    }  
    return num;  
}  

/**
 * 过滤两边空格
 * @param {Object} str
 */
function trimSpace(str){
	if (str == undefined) {
		return "";
	}
	//删除左右两端的空格   
	return str.replace(/(^\s*)|(\s*$)/g, "");  
}  
/**
 * 过滤左边空格
 * @param {Object} str
 */
function trimLeftSpace(str){ 
	if (str == undefined) {
		return "";
	}
	//删除左边的空格   
	return str.replace(/(^\s*)/g,"");  
}  
/**
 * 过滤右边空格
 * @param {Object} str
 */
function trimRightSpace(str){ 
	if (str == undefined) {
		return "";
	}
	//删除右边的空格   
	return str.replace(/(\s*$)/g,"");  
}

function lpadStr(strVal, strPadChar, totalLen) {
	var strValTmp = strVal;
	var padLen = totalLen - strValTmp.length;
	for(var i = 0; i < padLen; i++) {
		strValTmp = strPadChar + strValTmp;
	}
	
	return strValTmp;
}

function preventDefaultScroll(e){
    e.preventDefault();
}

function addEvent(){
    document.addEventListener('touchmove',preventDefaultScroll,false);
}

function removeEvent(){
    document.removeEventListener('touchmove',preventDefaultScroll,false);
}

/**
 * 判断入口是否为微信
 * @return {Boolean} [description]
 */
function isWeixin(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

/*是否为微信6.0.2版本*/
function isWeixinHighVersion(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger" && ua.match(/6.0.2/i)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取ios版本是否为5
 */
function getIosVersion(){
    if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {        
        return Boolean(navigator.userAgent.match(/OS [5]_\d[_\d]* like Mac OS X/i));
    }else{
        return false;
    }
}

/**
 * 启动滚轮
 */
function startSpinner(){
    clientService.invoke(
        {target:'thisView', method:'startWaitingSpinnerAnimating', params:[2], callBackWhenSucceed: '', callBackWhenError: ''}
    );
}
/**
 * 停止滚轮
 */
function stopSpinner(){    
    clientService.invoke(
        {target:'thisView', method:'stopWaitingSpinnerAnimating', params:[], callBackWhenSucceed: '', callBackWhenError: ''}
    );
}
/**
 * 字符串不为空
 */
function isNotEmpty(str){
	if (str != null && str != undefined && str.length > 0) {
		return true;
	}
	return false;
}

/*图片预先加载*/
function imgOnLoad(errors){

}
function funOnLoad(functionName){functionName();}
function funLoading(n,total,src,obj){$(obj).attr("src",src);}
function funOnError(n,total,src,obj){console.log("onError:"+"the "+n+"st img loaded Error!");}
function loadimg(arr,funLoading,funOnLoad,funOnError,functionName){
	if (arr.length == 0) {
		funOnLoad(functionName);
		return;
	}
    var numLoaded=0;
    var numError=0;
    var isObject=Object.prototype.toString.call(arr)==="[object Object]" ? true : false;   
    var arr=isObject ? arr.get() : arr;
    for(a in arr){
        var src=isObject ? $(arr[a]).attr("data-src") : arr[a];
        preload(src,arr[a]);
    }   
    function preload(src,obj){
        var img=new Image();
        img.onload=function(){
            numLoaded++;
            funLoading(numLoaded,arr.length,src,obj);
            numLoaded==arr.length && funOnLoad(functionName);
        };
        img.onerror=function(){
            numLoaded++;
            numError++;
            funOnError(numLoaded,arr.length,src,obj);
        }
        img.src=src;
    }
}

/*低版本android微信*/
function isAndroidWX(){
    var isWeixin = false,isAndroid=false,isLowWXVersion=false;
    if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)=="micromessenger") {
         isWeixin = true;
    } else {
        isWeixin = false;
    }
    if(navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1){
        isAndroid = true;
    }else{
        isAndroid = false;
    }
    if(navigator.userAgent.toLowerCase().split('micromessenger/')[1] < '6.0.2.58'){
        isLowWXVersion = true;
    }else{
        isLowWXVersion = false;
    }
    if(isWeixin && isAndroid && isLowWXVersion){
        return true;
    }else{
        return false;
    }
}

//设置页面fontSize
function setHtmlFontSize(){
    var screenWidth = $('[id="page"]').width();
    $('html').css('font-size',((Number(screenWidth)/320)*20)+'px');
    $(window).resize(function(){
        var screenWidth = $('[id="page"]').width();
        $('html').css('font-size',((Number(screenWidth)/320)*20)+'px');
    });
}

var _loadingNodeId = "anim-loading-container" + "_" + (new Date()).getTime();
jQuery.fn.showLoading = function(){
    var _loadingNodeHtml = ''
        +   '<div id="'+_loadingNodeId+'" class="loading_toast" style="display: none;">'
        +       '<div class="mask_transparent"></div>'
        +       '<div class="toast">'
        +           '<div class="loading">'
        +               '<div class="loading_leaf loading_leaf_0"></div>'
        +               '<div class="loading_leaf loading_leaf_1"></div>'
        +               '<div class="loading_leaf loading_leaf_2"></div>'
        +               '<div class="loading_leaf loading_leaf_3"></div>'
        +               '<div class="loading_leaf loading_leaf_4"></div>'
        +               '<div class="loading_leaf loading_leaf_5"></div>'
        +               '<div class="loading_leaf loading_leaf_6"></div>'
        +               '<div class="loading_leaf loading_leaf_7"></div>'
        +               '<div class="loading_leaf loading_leaf_8"></div>'
        +               '<div class="loading_leaf loading_leaf_9"></div>'
        +               '<div class="loading_leaf loading_leaf_10"></div>'
        +               '<div class="loading_leaf loading_leaf_11"></div>'
        +           '</div>'        
        +       '</div>'
        +   '</div>';

    var loadingNode = $('#' + _loadingNodeId);
    if(loadingNode.length == 0) {
        $(document.body).append(_loadingNodeHtml);
        loadingNode = $('#' + _loadingNodeId);
    }
    $(loadingNode).show();
}
jQuery.fn.hideLoading = function(){
    var loadingNode = $('#' + _loadingNodeId);
    if(loadingNode.length > 0) {
        $(loadingNode).hide();
    }
}