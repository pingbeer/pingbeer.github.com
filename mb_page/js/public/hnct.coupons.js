/**
*  Module: coupons
*  Author: qyj
*  Create Time:
*  Last Modify Time: 
 *******************************
 * 优惠券
 * */

var 
	CouponsClass={
	createNew:function(){
		var coupons={};
		var ajaxJsonProp={
            //servlet访问接口
            servlet:'',
            //操作参数 act
            act:'',
            //提交服务器参数
            parmData:'',
            //执行成功后的回调函数
            successCallbackFunc:null
        };
		// 处理错误日志
        coupons.loadError=function (result, textStatus, errorThrown){
			sinoShopping.setUIButtonDisabledStatus(false);
			$(".onLoad").hide();
			
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
                    sinoMobileUtil.autoLogin(sinoMobileUtil.getCurrent2RootRelateFullPath());
                }else if(httpErrorCode=="404"){
                    //sinoMobileUtil.autoLogin(sinoMobileUtil.getCurrent2RootRelateFullPath());
                    sinoMobileUI.alert("服务器没有响应，或访问地址不可用！");
                }else if(httpErrorCode=="200" ){						
						//sinoMobileUI.alert("内部错误：！");
				}else if(httpErrorCode=="401" ){
						util.autoLogin(util.getCurrent2RootRelateFullPath());
				}else{
                    sinoMobileUI.alert("服务器返回错误，操作不能继续！") ;
                }
            }
        }
	
		//从后台调用数据的总入口
        coupons.loadDataFromServer=function(){
            var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
            sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,coupons.loadError);
        };
        
        //1.已发放
		coupons.loadYFFListByServer=function() {
			var parm = '{}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_COUPONS;
            ajaxJsonProp.act="GET_USE_VOUCHERS_DIS";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=coupons.loadYFFListByServerSuccess;
            coupons.loadDataFromServer();
		}
        coupons.loadYFFListByServerSuccess = function (data) {
             if (data.code + "" == "1") {
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_PERSONAL_COUPONS_YFF,sinoMobileUtil.getJsonStringFromResponseData(data,"vouchesData"));
				 coupons.loadYFFListBySession();
			} else {
                sinoMobileUI.alert("加载优惠卷出现错误！" + data.msg);
            }
        }
        coupons.loadYFFListBySession=function() {
			 var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_PERSONAL_COUPONS_YFF);
			var	 datalist=$.parseJSON(datas);
			var templateHtml=$("#template").html();
			var sb=new Array();
			for(var i=0;i<datalist.length;i++) {
				var obj=datalist[i];
				var rec=new Record();
				var k=1;
				if(obj.vouType==1) k=1;
				if(obj.vouType==2) k=2;
				if(obj.vouType==3) k=3;
				if(obj.vouType==4) k=4;
				rec.addField("k",k);
				rec.addField("applyName",obj.applyName);
				rec.addField("vouType",obj.vouType);
				rec.addField("vouTypeName",obj.vouTypeName);
				rec.addField("efectiveEndDate",obj.efectiveEndDate);
				rec.addField("faceValue",obj.faceValue);
				rec.addField("qty",obj.qty);
				var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,rec);
				sb.push(html);
			}
			var content=$("#content_yff");
			content.html(sb.join(''));	
		}
	//2.已激活
		coupons.loadYJHListByServer=function() {
			var parm = '{}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_COUPONS;
            ajaxJsonProp.act="GET_USE_VOUCHERS_ACTIVE";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=coupons.loadYJHListByServerSuccess;
            coupons.loadDataFromServer();
		}
        coupons.loadYJHListByServerSuccess = function (data) {
             if (data.code + "" == "1") {
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_PERSONAL_COUPONS_YJH,sinoMobileUtil.getJsonStringFromResponseData(data,"vouchesData"));
				  coupons.loadYJHListBySession();
				
			} else {
                sinoMobileUI.alert("加载优惠卷出现错误！" + data.msg);
            }
        }
        coupons.loadYJHListBySession=function() {
			 var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_PERSONAL_COUPONS_YJH);
			var	 datalist=$.parseJSON(datas);
			var templateHtml=$("#template").html();
			var sb=new Array();
			
			for(var i=0;i<datalist.length;i++) {
				var obj=datalist[i];
				var rec=new Record();
				var k=1;
				if(obj.vouType==1) k=1;
				if(obj.vouType==2) k=2;
				if(obj.vouType==3) k=3;
				if(obj.vouType==4) k=4;
				rec.addField("k",k);
				rec.addField("applyName",obj.applyName);
				rec.addField("vouType",obj.vouType);
				rec.addField("vouTypeName",obj.vouTypeName);
				rec.addField("efectiveEndDate",obj.efectiveEndDate);
				rec.addField("faceValue",obj.faceValue);
				rec.addField("qty",obj.qty);
				var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,rec);
				sb.push(html);
			}
			var content=$("#content_yjh");
			content.html(sb.join(''));	
		}
	//3.已过期
		coupons.loadYGHListByServer=function() {
			var parm = '{}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_COUPONS;
            ajaxJsonProp.act="GET_USE_VOUCHERS_EXPIRED";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=coupons.loadYGHListByServerSuccess;
            coupons.loadDataFromServer();
		}
        coupons.loadYGHListByServerSuccess = function (data) {
             if (data.code + "" == "1") {
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_PERSONAL_COUPONS_YGQ,sinoMobileUtil.getJsonStringFromResponseData(data,"vouchesData"));
           		 coupons.loadYGQListBySession();
				
			} else {
                sinoMobileUI.alert("加载优惠卷出现错误！" + data.msg);
            }
        }
        coupons.loadYGQListBySession=function() {
			 var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_PERSONAL_COUPONS_YGQ);
			var	 datalist=$.parseJSON(datas);
			var templateHtml=$("#template").html();
			var sb=new Array();
			for(var i=0;i<datalist.length;i++) {
				var obj=datalist[i];
				var rec=new Record();
				var k=1;
				if(obj.vouType==1) k=1;
				if(obj.vouType==2) k=2;
				if(obj.vouType==3) k=3;
				if(obj.vouType==4) k=4;
				rec.addField("k",k);
				rec.addField("applyName",obj.applyName);
				rec.addField("vouType",obj.vouType);
				rec.addField("vouTypeName",obj.vouTypeName);
				rec.addField("efectiveEndDate",obj.efectiveEndDate);
				rec.addField("faceValue",obj.faceValue);
				rec.addField("qty",obj.qty);
				var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,rec);
				sb.push(html);
			}
			var content=$("#content_ygq");
			content.html(sb.join(''));	
		}
		//4.已使用
		coupons.loadYSYListByServer=function() {
			var parm = '{}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_COUPONS;
            ajaxJsonProp.act="GET_USE_VOUCHERS_USERD";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=coupons.loadYSYListByServerSuccess;
            coupons.loadDataFromServer();
		}
        coupons.loadYSYListByServerSuccess = function (data) {
             if (data.code + "" == "1") {
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_PERSONAL_COUPONS_YSY,sinoMobileUtil.getJsonStringFromResponseData(data,"vouchesData"));
				coupons.loadYSYListBySession();
			} else {
                sinoMobileUI.alert("加载优惠卷出现错误！" + data.msg);
            }
        }
        coupons.loadYSYListBySession=function() {
			 var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_PERSONAL_COUPONS_YSY);
			var	 datalist=$.parseJSON(datas);
			var templateHtml=$("#template").html();
			var sb=new Array();
			for(var i=0;i<datalist.length;i++) {
				var obj=datalist[i];
				var rec=new Record();
				var k=1;
				if(obj.vouType==1) k=1;
				if(obj.vouType==2) k=2;
				if(obj.vouType==3) k=3;
				if(obj.vouType==4) k=4;
				rec.addField("k",k);
				rec.addField("applyName",obj.applyName);
				rec.addField("vouType",obj.vouType);
				rec.addField("vouTypeName",obj.vouTypeName);
				rec.addField("efectiveEndDate",obj.efectiveEndDate);
				rec.addField("faceValue",obj.faceValue);
				rec.addField("qty",obj.qty);
				var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,rec);
				sb.push(html);
			}
			var content=$("#content_ysy");
			content.html(sb.join(''));	
		}
		coupons.goCouponsList=function() {
			window.location.href=sinoMobileUtil.getClientRootPath()+"apps/personal/coupons/coupons.html";
		}
	
		return coupons;
	}
}
var coupons=CouponsClass.createNew();