/**
*  Module: 公共工具函数
*  Author: Jintl
*  Create Time:2015-4-15
*  Last Modify Time: 2015-5-4
*/

/**
* 全局参数
**/
var sinoMobileConfig={
	CONST_SUCCESS_JSON_CALLBACK:"successJsonCallback",
	CONST_KEYWORD_DEFAULT_TEXT:"寻找手机、宝贝",
	CONST_KEYWORD_DEFAULT_TEXT2:"输入你要搜索的关键字",
	CONST_SEARCH_DIC_ALL:"全部",
	CONST_KEYWORD_INPUT_FIELD:"keywordInput",
	CONST_SERVLET_LOGIN:"/servlet/dz.app.login.AppLoginServlet",
	CONST_SERVLET_LOGOUT:"/servlet/dz.app.logout.ApplogoutServlet",
	CONST_SERVLET_HOMEPAGE:"/servlet/dz.app.homePage.HomePageServlet",
	CONST_SERVLET_PRODUCT_INFO:"/servlet/dz.app.productInfo.ProductInfoServlet",
	CONST_SERVLET_PRODUCT_LIST:"/servlet/dz.app.productList.ProductListServlet",
	CONST_SERVLET_ORDER_CREATE:"/servlet/dz.app.createOrder.CreateOrderServletWithRand",//qyj edit old=CreateOrderServlet
	CONST_SERVLET_ORDER_LIST:"/servlet/dz.app.createOrder.OrderListServlet",
	CONST_SERVLET_ORDER_RCV:"/servlet/dz.app.orderRcv.OrderRcvServlet",
	CONST_SERVLET_ORDER_DETAIL:"/servlet/dz.app.createOrder.OrderDetailServlet",
	CONST_SERVLET_ORDER_RCV_ADDRESS:"/servlet/dz.app.rcvAddress.RcvAddressServlet",
	CONST_SERVLET_ORDER_REFUND:"/servlet/dz.app.onlieRefund.OnlieRefundServlet",
	CONST_SERVLET_SHOPPING_CART:"/servlet/dz.app.shoppingCart.ShoppingCartServlet",
	CONST_SERVLET_PERSONAL:"/servlet/dz.app.personal.PersonalServlet",
	CONST_SERVLET_MY_HIS:"/servlet/dz.app.viewHisList.ViewHisListServlet",
	CONST_SERVLET_ONHAND_LIST:"/servlet/dz.app.onHandQty.OnHandQtyServlet",
	CONST_SERVLET_BANK_LIST:"/servlet/dz.app.bank.BankServlet",
	CONST_SERVLET_INFO:"/servlet/dz.app.info.InfoServlet",//add by chenwj 2015/09/07 公告
	CONST_SERVLET_DHH:"/servlet/dz.app.promote.dhh.DHHServlet",
	CONST_SERVLET_FLASH_SALE:"/servlet/dz.app.promote.flashSale.FlashSaleServlet",
	CONST_SERVLET_GROUP_PURCHASE:"/servlet/dz.app.promote.groupPurchase.GroupPurchaseServlet",
	CONST_SERVLET_COUPON:"/servlet/dz.app.vouchers.VouchersServlet",
	CONST_SERVLET_BANK:"/servlet/dz.app.bank.BankServlet",////qyj add 银行卡相关
	CONST_SERVLET_REPORT:"/servlet/dz.app.report.DHHMonitorReportServlet",////qyj 发现排行
	CONST_SERVLET_PERSIONAL_ADDRESS:"/servlet/dz.app.rcvAddress.RcvAddressServlet",////qyj 收货地址
	CONST_SERVLET_PERSIONAL_PASSWORD:"/servlet/dz.app.password.ChangePasswordServlet",////qyj 忘记密码
	CONST_SERVLET_PERSIONAL_PAYPASSWORD:"/servlet/dz.app.password.ChangePayPasswordServlet",////qyj 支付密码
	CONST_SERVLET_PERSIONAL_COUPONS:"/servlet/dz.app.vouchers.VouchersServlet",//优惠券
	CONST_APP_VERSION_CONFIG_FIELD_NAME:"HNCT_APP_VERSION",
	CONST_STORAGE_NAME_HOST:"sino.host",
	CONST_STORAGE_CLIENT_ROOT_PATH:"sino.hnct.root",
	CONST_STORAGE_APP_VERSION:"sino.hnct.version",
	CONST_SESSION_OPEN_PAGE_DATA:"sino.session.pagedata",
	CONST_SESSION_SEARCH_DATA:"sino.session.search.data",
	CONST_SESSION_OPEN_CART_DATA:"sino.session.cart.data",
	CONST_SESSION_RELOAD_PAGE:"sino.session.reload.page",
	CONST_SESSION_HOME_BANNER:"hnct.homepage.banner",
	CONST_SESSION_HOME_INFO:"hnct.homepage.info",
	CONST_SESSION_HOME_FLASH_SALE:"hnct.homepage.flash_sale",
	CONST_SESSION_HOME_GROUP_PURCHASE:"hnct.homepage.group_purchase",
	CONST_SESSION_HOME_ONE_FLOOR:"hnct.homepage.one_floor",
	CONST_SESSION_HOME_TWO_FLOOR:"hnct.homepage.two_floor",
	CONST_SESSION_HOME_THREE_FLOOR:"hnct.homepage.three_floor",
	CONST_SESSION_HOME_CHAIN_PAY_BANK_LIST:"hnct.homepage.china_pay_bank_list",//qyj add 银联列表
	CONST_SESSION_HOME_FIND_CITYORDER_LIST:"hnct.homepage.cityorder_list",//qyj add 城市排行
	CONST_SESSION_HOME_FIND_MOBILEORDER_LIST:"hnct.homepage.mobileorder_list",//qyj add 机型排行榜
	CONST_SESSION_HOME_FIND_CHANNELORDER_LIST:"hnct.homepage.channelorder_list",//qyj add 目标渠道排行榜
	CONST_SESSION_PERSONAL_CITY_ALL:"hnct.personal.city_all",//qyj add 地市字典
	CONST_SESSION_PERSONAL_COUPONS_YFF:"hnct.personal.coupons_yff",//qyj add 已发放
	CONST_SESSION_PERSONAL_COUPONS_YJH:"hnct.personal.coupons_yjh",//qyj add 已激活
	CONST_SESSION_PERSONAL_COUPONS_YGQ:"hnct.personal.coupons_ygq",//qyj add 已过期
	CONST_SESSION_PERSONAL_COUPONS_YSY:"hnct.personal.coupons_ysy",//qyj add 已使用
	CONST_SESSION_HOME_POP_BANNER:"hnct.homepage.pop_banner",//qyj add 弹出广告
	CONST_SESSION_CACHE_HOME:true, //主页数据缓冲开关
	CONST_DATA_ENCODE_ON:false,     //数据加密开关
	CONST_APP_PRODUCT_MODE:false,   //是否产品发布模式
	CONST_ALERT_MSG_LINE_LEN:12,
    debug:true
}

/**
*  手机工具函数
**/
var  SinoMobileUtil={
	createNew:function(){
		var util={};

		/**
		* 是否为开发模式
		**/
		util.isDeveloperMode=function(){
			return !sinoMobileConfig.CONST_APP_PRODUCT_MODE;
		}
		/**
		 * 打开登录界面
		 */
		util.getHostURL=function(){
			/*if(sinoMobileConfig.debug){

			}else{
				return util.getServerHost();
			}*/
			//return util.getServerHost();
			return "http://192.168.9.15:8080/";
		}



		/**
		 * Ajax 及加密调用入口函数
		 * @param url
		 * @param successCallbackFun
		 * @param errorCallbackFun
		 */
		util.ajaxCall=function(url,act,param,successCallbackFun,errorCallbackFun){
			if(sinoMobileConfig.CONST_DATA_ENCODE_ON){
				util.encodeAjaxCall(url,act,param,successCallbackFun,errorCallbackFun);
			}else{
				util.normalAjaxCall(url,act,param,successCallbackFun,errorCallbackFun);
			}
		};

        /**
		* 数据加密接口调用
		**/
		util.encodeAjaxCall=function(url,act,param,successCallbackFun,errorCallbackFun){
			if(util.strIsNull(param)){
				util.normalAjaxCall(url,act,param,
								function(resData){
									//返回数据先对data进行解密处理
									util.decodeResponseData(resData,successCallbackFun,act);
								},errorCallbackFun);
			}else{
				util.encode(param,function(data){
						   //数据加密后再进行Ajax
						   util.normalAjaxCall(url,act,data,
								function(resData){
									//返回数据先对data进行解密处理
									util.decodeResponseData(resData,successCallbackFun,act);
								},errorCallbackFun);
						}
						,null);
			}
		};
        /**
		* 解密服务器返回数据入口函数
		**/
		util.decodeResponseData=function(data,successCallbackFun,act){
			if(data.code=="1"){
				if(data.data!=null){
				    util.decode(data.data,function(decodeStr){
					   //将data数据解密后对象回放
					   objDecode=eval("("+decodeStr+")");
					   data.data=objDecode;
					   successCallbackFun(data);
					},function(){
						sinoMobileUI.alert("调用"+act+"返回数据解密失败!");
					});
				}else{
					successCallbackFun(data);
				}
			}else{
				successCallbackFun(data);
			}
		}

		/**
		* 数据非加密接口调用
		**/
		util.normalAjaxCall=function(url,act,param,successCallbackFun,errorCallbackFun){
			if(sinoMobileConfig.debug){
				util.getAjaxCall(url,act,param,successCallbackFun,errorCallbackFun);
			}else{
				util.postAjaxCall(url,act,param,successCallbackFun,errorCallbackFun);
			}
		};
		/**
		* GET方式调用
		**/
		util.getAjaxCall=function(url,act,param,successCallbackFun,errorCallbackFun){
			var strUrl=url+"?act="+act;
			 if(sinoMobileUtil.strIsNull(param)){
				strUrl+="&parm={}"
			 }else{
				strUrl+="&parm="+param;
			 }

			var ajaxreq= $.ajax({
				type : "get",
				dataType : 'jsonp',
			    timeout:5000,
				url : strUrl,
				async:false,
				cache: false,
				jsonp: "jsoncallback",
				//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
				jsonpCallback:sinoMobileConfig.CONST_SUCCESS_JSON_CALLBACK,
               //成功获取跨域服务器上的json数据后,会动态执行这个callback函数
				success : function(data,params){
					util.ajaxRequstAbord(ajaxreq);
					if(successCallbackFun!=null){
						successCallbackFun(data,params);
					}
				},
				error:function (result, textStatus, errorThrown){
					util.ajaxRequstAbord(ajaxreq);
					if(errorCallbackFun!=null){
						errorCallbackFun(result, textStatus, errorThrown);
					}
				}
			});
		}
		//post方式调用
		util.postAjaxCall=function(url,act,param,successCallbackFun,errorCallbackFun){
			var strUrl=url;
			var data="";
			/* if(util.strIsNull(param)){
				data="{act:'"+act+"',parm:{}}"
			 }else{
				data="{act:'"+act+"',parm:"+param+"}";
			 }*/
			if(util.strIsNull(param)){
				data="act="+act+"&parm="
			 }else{
				data="act="+act+"&parm="+param;
			 }
			 var ajaxreq=
				 $.ajax({
					type : "POST",
					url : strUrl,
					timeout:15000,
					data:data,
					dataType : 'json',
					success : function(data,params){
						util.ajaxRequstAbord(ajaxreq);
						if(successCallbackFun!=null){
							successCallbackFun(data,params);
						}
					},
					error:function (result, textStatus, errorThrown){
						util.ajaxRequstAbord(ajaxreq);
						if(errorCallbackFun!=null){
							errorCallbackFun(result, textStatus, errorThrown);
						}
					}
				});
		}
		util.ajaxRequstAbord=function(req){
			try{
				if(req!=null){
					req.abort();
				}
			}catch(errors){
			}
		}

        /**
		* 数据加密接口调用
		**/

		util.autoLogin=function(url){
			var user=userLogin.createNew();
			user.checkAutoLogin(url);
		};
		util.openUrl=function(url){
			window.location.href=url;
		};
		/**
		 * 浏览器是否支持全局存储
		 */
		util.checkLocalStorageSupport=function () {
			try {
				return 'localStorage' in window && window['localStorage'] !== null;
			} catch (e) {
				return false;
			}
		}
		/**
		 * 保存本地全局变量
		 * @param key
		 * @param value
		 */
		util.saveLocalStorage=function(key,value){
			try{
				localStorage.setItem(key,value);
			}catch(ee){

			}

		};
		util.removeLocalStorageItem=function(key){
			try{
				localStorage.removeItem(key,value);
			}catch(ee){

			}

		};
		/**
		 * 获取全局变量值
		 * @param key
		 * @returns {string}
		 */
		util.getLocalStorageValue=function(key){
			var retStr="";
			try{
				retStr=localStorage.getItem(key);
			}catch(ee){
			}
			return retStr;
		}
		/**
		 * 保存全局会话值
		 * @param key
		 * @param value
		 */
		util.saveSessionStorage=function(key,value){
			try{
				sessionStorage.setItem(key,value);
			}catch(ee){

			}
		};
		util.removeSessionStorageItem=function(key){
			try{
				sessionStorage.removeItem(key);
			}catch(ee){

			}
		}
		/**
		 * 获取全局会话值
		 * @param key
		 * @returns {string}
		 */
		util.getSessionStorageValue=function(key){
			var retStr="";
			try{
				retStr=sessionStorage.getItem(key);
			}catch(ee){

			}
			return retStr;
		};
		/**
		 * 保存访问主机
		 * @param host
		 */
		util.saveServerHost=function(host){
			util.saveLocalStorage(sinoMobileConfig.CONST_STORAGE_NAME_HOST,host);
		};
		/**
		 * 获取访问主机值
		 * @returns {*}
		 */
		util.getServerHost=function(){
			return util.getLocalStorageValue(sinoMobileConfig.CONST_STORAGE_NAME_HOST);
		};
		/**
		 * JSON对象转字符串
		 * @returns {*}
		 */
		util.jsonToString=function(obj){
			switch(typeof(obj)){
				case 'string':
					return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
				case 'array':
					return '[' + obj.map(util.jsonToString).join(',') + ']';
				case 'object':
					 if(obj instanceof Array){
						var strArr = [];
						var len = obj.length;
						for(var i=0; i<len; i++){
							strArr.push(util.jsonToString(obj[i]));
						}
						return '[' + strArr.join(',') + ']';
					}else if(obj==null){
						return 'null';

					}else{
						var string = [];
						for (var property in obj) string.push(util.jsonToString(property) + ':' + util.jsonToString(obj[property]));
						return '{' + string.join(',') + '}';
					}
				case 'number':
					return obj;
				case false:
					return obj;
			}
		}
		//获取浏览器视口的宽高
		util.getViewSize=function(){
			return {
				"w": window['innerWidth'] || document.documentElement.clientWidth,
				"h": window['innerHeight'] || document.documentElement.clientHeight
			}
		};
		util.str2DateTime=function(str1){
			str1 = str1.replace(/-/g,"/");
			var dateObj = new Date(str1 );
			return dateObj;
		};
		//该函数请在根目录引导页调用
		util.saveClientRootPath=function(){
		    var rootPath=window.document.location.href;
			var len=rootPath.lastIndexOf("/");
			rootPath=rootPath.substring(0,len+1);
			util.saveLocalStorage(sinoMobileConfig.CONST_STORAGE_CLIENT_ROOT_PATH,rootPath);
		}
		util.getClientRootPath=function(){
			return util.getLocalStorageValue(sinoMobileConfig.CONST_STORAGE_CLIENT_ROOT_PATH);
		};
		//应用程序版本，该版本用于判断，下载更新应用程序字典数据，在JS代码中使用。
		util.saveAppVerion2Local=function(ver){
			util.saveLocalStorage(sinoMobileConfig.CONST_STORAGE_APP_VERSION,ver);
		};
		util.getAppVersion=function(){
			return util.getLocalStorageValue(sinoMobileConfig.CONST_STORAGE_APP_VERSION);
		};
		//缓冲打开页面数据
		util.saveSessionPageDataJson=function(json){
			util.saveSessionStorage(sinoMobileConfig.CONST_SESSION_OPEN_PAGE_DATA,json);
		};
		//从缓冲中读出打开页面数据
		util.getSessionPageDataJson=function(){
			return util.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_OPEN_PAGE_DATA);
		}

		//缓冲搜索条件数据
		util.saveSessionSearchDataJson=function(json){
			util.saveSessionStorage(sinoMobileConfig.CONST_SESSION_SEARCH_DATA,json);
		};
		//从缓冲中读出搜索条件数据
		util.getSessionSearchDataJson=function(){
			return util.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_SEARCH_DATA);
		}
		util.removeSearchSession=function(){
			util.removeSessionStorageItem(sinoMobileConfig.CONST_SESSION_SEARCH_DATA);
		}

		/**
		* 获取当前目录到根目录的相对路径，用..标识
		**/
		util.getCurrent2RootRelatePath=function(){
			var thisPath=window.document.location.href;
			var len=thisPath.lastIndexOf("/");
			thisPath=thisPath.substring(0,len+1);
			var rootPath=util.getClientRootPath();
			var relatePath=thisPath.substring(rootPath.length,thisPath.length);
			var arr=relatePath.split("/");
			var arrLen=arr.length-1;
			if(arrLen==0){
				return "";
			}
			var arrList=new Array();
			for(var nn=0;nn<arrLen;nn++){
				arrList[nn]="..";
			}
			return arrList.join("/")+"/";
		}
		util.getCurrent2RootRelateFullPath=function(){
			var relPath=util.getCurrent2RootRelatePath();
			var thisPath=window.document.location.href;
			var len=thisPath.lastIndexOf("/");
			var name=thisPath.substring(len+1,thisPath.length);
			return relPath+name;
		}
		util.pathIsRoot=function(){
			var root=util.getClientRootPath();
			var thisPath=window.document.location.href;
			var len=thisPath.lastIndexOf("/");
			thisPath=thisPath.substring(0,len+1);
			return thisPath==root?true:false;
		}

		/**
		*
		**/


		util.strIsNull=function(str){
			return str==null||str=="undefined"||str==""? true:false;
		};
		util.isEmpty = function(value) {
            var type;
            if(value == null) { // 等同于 value === undefined || value === null
                return true;
            }
            type = Object.prototype.toString.call(value).slice(8, -1);
            switch(type) {
				case 'String':
					return !$.trim(value);
				case 'Array':
					return !value.length;
				case 'Object':
					return $.isEmptyObject(value); // 普通对象使用 for...in 判断，有 key 即为 false
				default:
					return false; // 其他对象均视作非空
            }
        };
		util.getSafeString=function(str){
			return util.strIsNull(str)?"":str;
		}
		util.openPageReplace=function(url){
			document.location.replace(url);
		}
		util.openPage=function(url){
			document.location.href=url;
		}


		/**
		*  获取字典范围
		**/
		util.getDicRange=function(strDic){
			var dicRange= new Array();
			dicRange=strDic.split("-");
			if(dicRange.length!=2){
				return null;
			}
			return{
				from:dicRange[0],
				to:dicRange[1]
			};
		}

		util.joinDicRange=function(from,to){
			return from+"-"+to;
		}
		/**
		*  根据模板内容获取替换后的HTML，用于打印输出
		**/
		util.getFormatedTemplateHtml=function(template,rec){
			var retV=template;
			var fields=rec.getFields();
			if(fields==null){
				return retV;
			}
			var nLen=fields.length;
			var field=null;
			var fieldName="";
			var fieldValue="";
			for(var nn=0;nn<nLen;nn++){
				field=fields[nn];
				fieldName=field.FieldName;
				fieldValue=field.Value;
				retV=retV.replaceAll("{"+fieldName+"}",fieldValue);
			}
			return retV;
		}


		/**
		*  根据模板内容获取替换ID内容
		**/
		util.formatTagHtmlByRecord=function(rec){
			var fields=rec.getFields();
			if(fields==null){
				return;
			}
			var nLen=fields.length;
			var field=null;
			var fieldName="";
			var fieldValue="";
			for(var nn=0;nn<nLen;nn++){
				field=fields[nn];
				fieldName=field.FieldName;
				fieldValue=field.Value;
				if($("#"+fielName)!=null){
					$("#"+fieldName).append(fieldValue);
				}
			}
		}
		util.getUrlParam=function(){
			var url = document.location.href;
			var name=""
			if (url.indexOf("=")>0)
			{
				name = url.substring(url.indexOf("=")+1,url.length)
			}
			return name;
		}

		/**
		* 判断图片加载成功
		**/
		util.imgLoaded=function(img, callback) {
            var timer = setInterval(function() {
                if (img.complete) {
                    callback(img)
                    clearInterval(timer)
                }

            }, 50)
        };
		/*
			explode string to arraylist
		*/
		util.explode=function (strOrg,strSeg) {
			var str=strOrg;
			if (strSeg == null||strSeg == ""){
				return strOrg;
			}
			var arrOut= new Array();
			var i = 0;
			var nFind = str.indexOf(strSeg);
			var spanlen = strSeg.length;
			while (nFind >= 0) {
				arrOut[i] = str.substring(0, nFind);
				str = str.substr(nFind + spanlen);
				nFind = str.indexOf(strSeg);
				i++;
			}
			if (str != ""){
				arrOut[i] = str;
			}
			return arrOut;
		};
		util.encode=function(str,successCallbackFun,errorCallbackFun){
			if(errorCallbackFun==null){
				errorCallbackFun=util.encodeError;
			}
			sinoprof.commonPlugin.encode(str,successCallbackFun,errorCallbackFun);
		}
		util.decode=function(str,successCallbackFun,errorCallbackFun){
			if(errorCallbackFun==null){
				errorCallbackFun=util.decodeError;
			}
			sinoprof.commonPlugin.decode(str,successCallbackFun,errorCallbackFun);
		}
		util.host=function(successCallbackFun,errorCallbackFun){
			sinoprof.commonPlugin.getHost(successCallbackFun,errorCallbackFun);
		}

		util.encodeError=function(){
			sinoMobileUI.alert("加密数据出错");
		}
		util.decodeError=function(){
			sinoMobileUI.alert("解密数据出错");
		}
		util.formatFromJsonStr=function(v){
			if(util.strIsNull(v)){
				return "";
			}
			//数字直接返回
			if(!isNaN(v)){
				return v;
			}
			var vv=v;
			try{
				//过滤回车
				v=v.replace(new RegExp("\r","gm"),"");
				//过换行
				v=v.replace(new RegExp("\n","gm"),"");
				//过滤制表符
				v=v.replace(new RegExp("\t","gm"),"");
			}catch(errors){
				v=vv;
			}
			return v;
		}
		util.formatToJsonStr=function(v){
			if(util.strIsNull(v)){
				return "";
			}
			//数字直接返回
			if(!isNaN(v)){
				return v;
			}
			var vv=v;
			try{
				//过滤回车
				v=v.replace(new RegExp("\r","gm"),"");
				//过换行
				v=v.replace(new RegExp("\n","gm"),"");
				//过滤制表符
				v=v.replace(new RegExp("\t","gm"),"");


			}catch(errors){
				v=vv;
			}
			return v;
		}
		util.loadErrorCall=function (result, textStatus, errorThrown,flag){

				if (textStatus!=null) {
					if (textStatus == 'timeout') {
						sinoMobileUI.alert("服务器连接超时.");
						return;
					}else if(textStatus == 'parsererror'){
						sinoMobileUI.alert("服务器处理发生错误，返回数据解析失败.");
						return;
					}
				}


				var httpErrorCode=result.status;
				if(httpErrorCode==null||httpErrorCode==""||httpErrorCode=="undefined"){
					sinoMobileUI.alert("服务器返回错误，操作不能继续！");
				}else{
					httpErrorCode=httpErrorCode+"";
					if(httpErrorCode=="403"){
						//session失效，重新登录
						util.autoLogin(util.getCurrent2RootRelateFullPath());
					}else if(httpErrorCode=="404"){
						if(flag){
							sinoMobileUI.doOpen404Page();
						}else{
							sinoMobileUI.alert("服务器没有响应，或访问地址不可用！");
						}
					}else if(httpErrorCode=="200" ){
						//sinoMobileUI.alert("内部错误：！");
					}else if(httpErrorCode=="401" ){
							util.autoLogin(util.getCurrent2RootRelateFullPath());
					}else{
						sinoMobileUI.alert("服务器返回错误，操作不能继续！") ;
					}
				}
		}
		/**
		* 从服务器返回解密数据中读取指定json对象
		**/
		util.getJsonObjectFromResponseData=function(data,dataName){
			if(data.data==null){
				return null;
			}else{
				var obj=null;
				try{
					obj=eval("data.data."+dataName);
				}catch(errors){}
				return obj;
			}
		}
		util.getJsonStringFromResponseData=function(data,dataName){
			var obj=util.getJsonObjectFromResponseData(data,dataName);
			if(obj==null){
				return "";
			}
			return util.jsonToString(obj);
		}

		util.getRecordsFromResponseData=function(data,dataName){
			var recs=new Records();
			var json=util.getJsonObjectFromResponseData(data,dataName);
			recs.fromJson(json);
			return recs;
		}
		util.getRestTime=function(saleEndTime){
			var dtTo=util.str2DateTime(saleEndTime);
			return util.getRestTimeByDateTime(dtTo);
		}
		util.getRestTimeByDateTime=function(saleEndTime){
		    var dtTo=saleEndTime;
			var dtFrom=new Date();  //开始时间
			var date3=null;

			var date3=dtTo.getTime()-dtFrom.getTime();  //时间差的毫秒数
			return date3;

		};
		util.getRestTimeHtml=function(saleEndTime){
			var dtTo=util.str2DateTime(saleEndTime);
			return util.getRestTimeHtmlByDateTime(dtTo);
		}
		util.getRestTimeHtmlByDateTime=function(saleEndTime){
		    var dtTo=saleEndTime;
			var dtFrom=new Date();  //开始时间
			var date3=null;

			var date3=dtTo.getTime()-dtFrom.getTime();  //时间差的毫秒数
			//如果时间超出则，直接返回0时间信息
			if(date3<=0){
				return "<span>0</span>天<span>0</span>时<span> 0</span>分<span>0</span>秒";
			}
			//计算出相差天数
			var days=Math.floor(date3/(24*3600*1000));
			//计算出小时数
			var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
			var hours=Math.floor(leave1/(3600*1000));
			//计算相差分钟数
			var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
			var minutes=Math.floor(leave2/(60*1000));

			//计算相差秒数
			var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
			var seconds=Math.round(leave3/1000);
			return "<span>"+days+"</span>天<span>"+hours+"</span>时<span> "+minutes+"</span>分<span>"+seconds+"</span>秒";

		};
		util.getDiscountHtml=function(minPrice,currentPrice){
			if(currentPrice==null||currentPrice=="0"){
				return "无";
			}else{
				if(minPrice==currentPrice){
					return "无";
				}else{
					return Math.round((minPrice*1/currentPrice*1)*100)/10;
				}
			}
		}
		/*验证电话号码*/
		util.isMobilenum=function(phone) {
			var flag=false;
			var chinaUnicom=/^(13[0-2]|15[5-6]|186|185)[0-9]{8}$/
			var chinaMobile=/^(13[4-9]|15[7-9]|15[0-2]|18[7-8]|182|183)[0-9]{8}$/
			var chinaTelecom=/^(133|153|189|180|181)[0-9]{8}$/

			if(chinaUnicom.test(phone) ){ flag=true; }
			if(chinaMobile.test(phone) ){ flag=true; }
			if(chinaTelecom.test(phone) ){ flag=true; }
			return flag;
		};
		return util;
	}

}

//手机工具类
var sinoMobileUtil=SinoMobileUtil.createNew();

/**
 * 前台字段工具类
 */
function FormField(){
	var FieldName="";
	var FieldTitle="";
	var Value="";
	var ChildrenType="";
};
/**
 * 前台JS纪录
 * @constructor
 */
function Record(){
	var fields=new Array();
	this.getFields=function(){
		return fields;
	};
	this.addField=function(fieldName,fieldValue){
		var newField=new FormField();
		newField.FieldName=fieldName;
		newField.Value=fieldValue;
		fields.push(newField);
	};
	this.addFieldChildren=function(fieldName,fieldValue){
		var newField=new FormField();
		newField.FieldName=fieldName;
		newField.Value=fieldValue;
		newField.ChildrenType="children";
		fields.push(newField);
	};
	this.toJoin=function(v,sep){
		var strValue="";
		var nFields=fields.length;
		for(var mmm=0;mmm<nFields;mmm++){
			if(mmm>0){
				strValue+=sep;
			}
			strValue+=fields[mmm].FieldName;
			strValue+="=";
			strValue+=v+fields[mmm].Value+v;
		}
		return strValue;
	};
	//格式化为参数字符串
	this.toParamsStr=function(){
		return this.toJoin("","&");
	};
	//格式化为Json字符串
	this.toJsonString=function(){
		var strRecJSON="";
		var nFields=fields.length;
		var strFieldName="";
		var strChildrenType="";
		for(var mmm=0;mmm<nFields;mmm++){
			if(mmm>0){
				strRecJSON+=",";
			}
			strFieldName=fields[mmm].FieldName;
			strRecJSON+="\""+strFieldName+"\"";
			strRecJSON+=":";
			if(strFieldName.toLowerCase()=="children"){
				strRecJSON+=sinoMobileUtil.formatToJsonStr(fields[mmm].Value);
			}else{
				strChildrenType=fields[mmm].ChildrenType;
				if(!sinoMobileUtil.strIsNull(strChildrenType)&&strChildrenType=="children"){
					strRecJSON+=sinoMobileUtil.formatToJsonStr(fields[mmm].Value);
				}else{
					strRecJSON+="\""+sinoMobileUtil.formatToJsonStr(fields[mmm].Value)+"\"";
				}
			}
		}
		return "{"+strRecJSON+"}";
	};

	//根据字段名取字段
	this.getField=function(fieldName){
		var fv=null;
		var nFields=fields.length;
		for(var mmm=0;mmm<nFields;mmm++){
			if(fields[mmm].FieldName.toLowerCase()==fieldName.toLowerCase()){
				fv=fields[mmm];
			}
		}
		return fv;
	};
	//获取字段值
	this.getValue=function(fieldName){
		var fv=null;
		var nFields=fields.length;
		for(var mmm=0;mmm<nFields;mmm++){
			if(fields[mmm].FieldName.toLowerCase()==fieldName.toLowerCase()){
				fv=fields[mmm].Value;
			}
		}
		if(fv==null){
			return "";
		}else{
			return fv;
		}
	};
	//设置指定字段值
	this.setField=function(fieldName,fieldValue){
		var fd=this.getField(fieldName);
		if(fd!=null){
			fd.Value=fieldValue;
		}
	};
	this.fromJsonString=function(jsonStr){
		jsonStr=sinoMobileUtil.formatFromJsonStr(jsonStr);
		var objJson=eval("("+jsonStr+")");
		this.fromJson(objJson);
	};
	this.fromJson=function(jsonObj){
		if(jsonObj==null||jsonObj=="undefined"){
			return;
		}
		for(var kk in jsonObj){
			var vv=jsonObj[kk];
			if(typeof(vv)!="object"){
				this.addField(kk,vv);
			}
		}
	}
};
/**
 * 后台JS记录集
 * @constructor
 */
function Records(){
	//记录集属性
	var record=new Record();
	//记录集合
	var records=new Array();
	//设置记录集属性字段
	this.addField=function(fieldName,fieldValue){
		record.addField(fieldName,fieldValue);
	};
	//增加记录
	this.addRecord=function(record){
		records.push(record);
	};
	this.getLength=function(){
		return records==null?0:records.length;
	};
	this.getNthRecord=function(nn){
	    if(nn<1||nn>this.getLength()){
			return;
		}
		return records[nn-1];
	};

	//导出JSON字符串
	this.toJsonString=function(){
		var strJSON="[";
		var nRecs=records.length;
		for(var nnn=0;nnn<nRecs;nnn++){
			if(nnn>0){
				strJSON+=",";
			}
			strJSON+=records[nnn].toJsonString();
		}
		strJSON+="]";
		return strJSON;
	};
	this.fromJsonString=function(jsonStr){
		jsonStr=sinoMobileUtil.formatFromJsonStr(jsonStr);
		var objJson=eval("("+jsonStr+")");
		this.fromJson(objJson);
	};
	this.fromJson=function(jsonObj){
		if(jsonObj==null||jsonObj=="undefined"){
			return;
		}
		var rec=new Record();
		for(var kk in jsonObj){
			var vv=jsonObj[kk];
			if(typeof(vv)=="object"){
				rec=new Record();
				rec.fromJson(vv);
				this.addRecord(rec);
			}
		}
	}
};

/**
* 全文替换函数
**/
String.prototype.replaceAll = function(s1,s2){
　　return this.replace(new RegExp(s1,"gm"),s2);
}