/**
*  Module: personal
*  Author: qyj
*  Create Time:
*  Last Modify Time: 2
 *******************************
 * 忘记密码
 * */

var PasswordClass={
	createNew:function(){
		var password={};
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
        password.loadError=function (result, textStatus, errorThrown){
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
        password.loadDataFromServer=function(){
            var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
            sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,password.loadError);
        }
		
	
		/**
		* 1. 验证登录名
		**/
		password.checkLoginName=function() {
			var loginName=$('#loginName');
			if( loginName.val().length==0){
				loginName.focus();
				return;
			}
			var parm = {'loginName':loginName.val()
			};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_PASSWORD;
            ajaxJsonProp.act="VERIFY_USER";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=password.checkLoginNameSuccess;
            password.loadDataFromServer();
		}
        password.checkLoginNameSuccess = function (data) {
            if (data.code + "" == "1") {
				$('#mobilenum').val(data.msg);
				$('#sendbtn').show();
            } else {
                //sinoMobileUI.alert("出现错误！" + data.msg);
				sinoMobileUI.alert("登录名不存在");
            }
			$(".onLoad").hide();

        }
		
		/**
		* 2. 获取验证码
		**/
		password.sendCode=function() {
			var loginName=$('#loginName');
			if( loginName.val().length==0){
				loginName.focus();
				return;
			}
			var mobilenum=$('#mobilenum');
			if( mobilenum.val().length==0){
				sinoMobileUI.alert("用户名错误或未关联手机");
				return;
			}
			var parm = {'loginName':loginName.val()
			};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_PASSWORD;
            ajaxJsonProp.act="GET_VALIDATE";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=password.sendCodeSuccess;
            password.loadDataFromServer();
		}
        password.sendCodeSuccess = function (data) {
            if (data.code + "" == "1") {
				//$('#sendbtn').hide();
				sinoMobileUI.alert("验证码已经发送到您手机上");
              	
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();
        }	
		/**
		* 3. 验证验证码
		**/
		password.checkCode=function() {
			var loginName=$('#loginName');
			if( loginName.val().length==0){
				loginName.focus();
				return;
			}
			var mobilenum=$('#mobilenum');
			if( mobilenum.val().length==0){
				sinoMobileUI.alert("用户名错误或未关联手机");
				return;
			}
			var validate=$('#validate');
			if( validate.val().length==0){
				validate.focus();
				return;
			}
			
			var parm = {'loginName':loginName.val(),'validate':validate.val()
			};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_PASSWORD;
            ajaxJsonProp.act="CHECK_RANDOM";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=password.checkCodeSuccess;
            password.loadDataFromServer();
		}
        password.checkCodeSuccess = function (data) {
            if (data.code + "" == "1") {
				password.goSetPasswordPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		 password.goSetPasswordPage=function() {
				var loginName=$('#loginName').val();
				var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			window.location.href="zhpassword02.html?loginName="+loginName;
		 }
		 /**
		* 4. 修改密码
		**/
		password.updatePassword=function() {
			var loginName=$('#loginName');
			var password2=$('#password');
			if( password2.val().length==0){
				password2.focus();
				return;
			}
			var reg1 =/^[A-Z].*[0-9]|[0-9].*[A-Z]$/g;
			var reg2 =/^([\w\W]){8,16}$/g;
			if(!reg1.test(password2.val() ) && !reg2.test(password2.val() ) ){ 
				sinoMobileUI.alert("密码不符合规则");
				password2.focus();
				return false; 
			} 
			
			var password1=$('#password1');
			if( password1.val().length==0){
				password1.focus();
				return;
			}
			if( password2.val()!=password1.val()){
				sinoMobileUI.alert("两次密码不一致");
				return;
			}
			var parm = {'loginName':loginName.val(),'password':password2.val()
			};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_PASSWORD;
            ajaxJsonProp.act="UPDATE_ACTION";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=password.updateSuccess;
            password.loadDataFromServer();
		}
        password.updateSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUI.alert("密码修改成功");
				sinoMobileUI.doOpenLoginPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		password.getLoginName=function() {
			var name=$.query.get("loginName");
			var loginName=$('#loginName');
			loginName.val( name );
		}
		return password;
	}
}
var password=PasswordClass.createNew();