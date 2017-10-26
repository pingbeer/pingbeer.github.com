var keyboard = null;  
//用于加密
//var RSA_PUBLIC_KEY = "308188028180C4420E53A3B40AABA065E44E1F172FA163B0EC23267AD37131AA6663B32CA81D47448FA767610839A3D699185A3929804E789516B13A76B8000ACBD148E20BAA291911F0889A8B3664486BC730D958FD4C675402B2A5EFCE5CCC9A688BBAD90590B834867C81C7FE45C0F4F8AFB53E886B5D24938DED5C29CEAFEA4A51BE89990203010001";
//var RSA_PUBLIC_KEY_SIG = "464CF0CDE7EE26CAA05B3923EB1D1A7B7455718B33602F4B4A3562F66E5671768CF9DD1D43C5E1A960880EDDFBCD1246F676381AC23D075DB35148E95E9C56E8AF3A2B4AD71EC6BE7910741B657649F749411ACD21E6C081E6C01A77EA64B0E720156B17622BB5B71C53EDF1A39D7F6D02B46535C68DC6D6DE9B1D164A2C6E7E";

var RSA_PUBLIC_KEY ="30818902818100d40a3d3733b68e046e7e914d6470303bcb11dbe7106ca05b3a557885ca85a114241ff531d5cf291875383133052595c91bfae08c0a50a199b1860b8386019a178f32da3b9176b9b1de9ed5d6e3158f0779d66d5e4e1b4d36e672ed231dc0c1aa9e6bd667da945b9cd7f7cb4f292a66dbc93ade4150788d809cd42d638f2f1cff0203010001";
var RSA_PUBLIC_KEY_SIG = "62102618971260D4EC0D318C7FA05D08326A6F623E4940BA8BF4E94BAC6D0A21F28683BF17EAF6129AB881C41B7DCF7A397DF8B532388078B35C077900C793FA9C03B91C7AFC76BA71DBCFF360429F4E8F45BA9F479A776B2071CD2C367A9CD518B70F7C944B1B12FB42C6655B168E991F7A65AB184AB087CEDA1AFAA76BAF9D";

//var SM2_PUBLIC_KEY_TEST = "3baf4a962ac73736c91130f6b1fe78e16834d6a22b2e9506a606981377a1c8f3da0986a80b194e0be9fc6d400ceb8c93d81da5c82527519382a460503bcbe610";
//var SM2_PUBLIC_KEY_SIG_TEST = "e3fd38fcca9c188ec4732be97ab59f95ea6992d1d8b17e0401f11eeeefec3265171f23da229dfa437fbe77c47b0b7a8ada607193b732269a1735dd407fa8e5ab";
//var serverRandom="01234567890123456789";

var errorMsg={'1001':'参数错误',
		'1002':'无效的ID，安全输入键盘并未创建',
		'1003':'输入数据长度不在有效范围内',
		'1004':'输入数据为空',
		'1005':'输入服务端随机数无效',
		'1006':'服务端随机数为空',
		'1007':'输入数据或服务器随机数太长',
		'1008':'输入数据不匹配正则表达式',
		'1009':'加密公钥无效',
		'100A':'加密公钥为空',
		'100B':'RSA加密失败',
		'100C':'当前输入值不匹配输入正则表达式',
		'100D':'服务器随机数小于16字节',
		'100E':'当前已有输入值，服务器随机数设置失败',
		'100F':'SM2加密失败',
		'1010':'SM2公钥验证失败',
		'1011':'加密类型异常',
		'1012':'SM2公钥长度有误',
		'1013':'SM2公钥签名长度有误',
		'1014':'SM2公钥格式有误',
		'1015':'不支持的公钥签名值',
};


function setUpEvent(elem, eventType, handler) {
    return (elem.attachEvent ? elem.attachEvent("on" + eventType, handler)
            : ((elem.addEventListener) ? elem.addEventListener(eventType, handler, false) : null));
}

//数字安全键盘
//输入框ID:sipboxId,安全键盘容器ID：keyboardContainerId
function initNumberKeyboard(sipboxId,keyboardContainerId,serverRandom) {
    keyboard = new CFCAKeyboard(keyboardContainerId, KEYBOARD_TYPE_DIGITAL);
    var sipbox = document.getElementById(sipboxId);
    keyboard.bindInputBox(sipbox || sipboxId);
    keyboard.hideKeyboard();
    if(CFCA_OK != keyboard.setServerRandom(serverRandom, sipboxId)) alert(sipboxId+": setServerRandom error");
    if(CFCA_OK != keyboard.setPublicKey(CIPHER_TYPE_RSA, RSA_PUBLIC_KEY, RSA_PUBLIC_KEY_SIG, sipboxId)) alert(sipboxId+": setPublicKey error");
    setUpEvent(sipbox, "focus",function(event) {
    	sipbox.blur();
    	keyboard.bindInputBox(sipboxId);
    	keyboard.showKeyboard();
    });
    keyboard.setDoneCallback(doneCallback);
}

function doneCallback(sipboxId){
	//若有特殊处理请覆盖此function
}

function setProperty(sipboxId,minLength,maxLength,serverRandom,inputRegex) {
	if(minLength){
		if(CFCA_OK != keyboard.setMinLength(minLength, sipboxId)) alert(sipboxId+": setMinLength error");
	}
    if(maxLength){
    	if(CFCA_OK != keyboard.setMaxLength(maxLength, sipboxId)) alert(sipboxId+": setMaxLength error");
    }
    if(serverRandom){
    	if(CFCA_OK != keyboard.setServerRandom(serverRandom, sipboxId)) alert(sipboxId+": setServerRandom error");
    }
    if(inputRegex){
    	if(CFCA_OK != keyboard.setInputRegex(inputRegex, sipboxId)) alert(sipboxId+": setInputRegex error");
    }
}

function getEncrypt(sipboxId) {
    return keyboard.getEncryptedInputValue(sipboxId);
}

function getErrorCode(sipboxId) {
	var errorCode = keyboard.getErrorCode(sipboxId).toString(16);
    if(errorCode != CFCA_OK) {
        return errorCode;
    }
}
function getErrorMsg(sipboxId) {
	var errorCode=getErrorCode(sipboxId);
	if(errorMsg[errorCode])
		return errorMsg[errorCode];
	else 
		return "0x"+errorCode;
}

function clearInput(sipboxId) {
    keyboard.clearInputValue(sipboxId);
}

mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent);
function hideKeyboard(noNeedHideIds){
	setUpEvent(document, mobile ? "touchstart" : "mousedown", function(e) {
	    var elem = e.srcElement || e.target;
	    /*var noNeedHideIds = ["CompleteKeyboard", "NumberKeyboard",
	        "SIPBox", "SIPBox2", "SIPBox3",
	        "clearSIPBox1", "clearSIPBox2", "clearSIPBox3",
	        "getSIPBox1Value", "getSIPBox2Value", "getSIPBox3Value",
	        "checkInputValueMatch", "getVersion"
	    ];*/
	    while(elem) {
	        if(noNeedHideIds.indexOf(elem.id) !== -1) {
	            return;
	        }
	        elem = elem.parentNode;
	    }
	    keyboard.hideKeyboard();
	});
}
