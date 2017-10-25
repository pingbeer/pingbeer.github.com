/**
*  Module: personal
*  Author: qyj
*  Create Time:
*  Last Modify Time: 2
 *******************************
 * 支付密码
 * */

var PayPasswordClass={
	createNew:function(){
		var payPassword={};
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
        payPassword.loadError=function (result, textStatus, errorThrown){
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
        payPassword.loadDataFromServer=function(){
            var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
            sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,payPassword.loadError);
        };
		
	
		/**
		* 1. 验证登录名
		**/
		payPassword.checkLoginName=function() {
			var loginName=$('#loginName');
			if( loginName.val().length==0){
				loginName.focus();
				return;
			}	
			var certificateNo=$('#certificateNo');
			if( certificateNo.val().length==0){
				certificateNo.focus();
				return;
			}
			//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if(reg.test(certificateNo.val() ) === false) {
				sinoMobileUI.alert("身份证号输入不合法！");
				certificateNo.focus();
				return ;
			}

			var tel=$('#tel');
			if( tel.val().length==0){
				tel.focus();
				return;
			}
			reg = /^(\d)+$/;
			if(reg.test(tel.val() ) === false) {
				sinoMobileUI.alert("电话必须是数字！");
				tel.focus();
				return ;
			}

			var parm = {'loginName':loginName.val(),'tel':tel.val(),'certificateNo':certificateNo.val()
			};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_PAYPASSWORD;
            ajaxJsonProp.act="CHECK_USER_INFO";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=payPassword.checkLoginNameSuccess;
            payPassword.loadDataFromServer();
		}
        payPassword.checkLoginNameSuccess = function (data) {
            if (data.code + "" == "1") {
				$('#tel').html(data.msg);
				$('#sendbtn').show();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		
		/**
		* 2. 获取验证码
		**/
		payPassword.sendCode=function() {
			var loginName=$('#loginName');
			if( loginName.val().length==0){
				loginName.focus();
				return;
			}
			var parm = {'loginName':loginName.val()
			};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_PAYPASSWORD;
            ajaxJsonProp.act="GET_RADOM_CODE";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=payPassword.sendCodeSuccess;
            payPassword.loadDataFromServer();
		}
        payPassword.sendCodeSuccess = function (data) {
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
		payPassword.checkCode=function() {
			var loginName=$('#loginName');
			if( loginName.val().length==0){
				loginName.focus();
				return;
			}
			var validate=$('#validate');
			if( validate.val().length==0){
				validate.focus();
				return;
			}
			var parm = {'loginName':loginName.val(),'validate':validate.val()
			};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_PAYPASSWORD;
            ajaxJsonProp.act="CHECK_RANDOM";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=payPassword.checkCodeSuccess;
            payPassword.loadDataFromServer();
		}
        payPassword.checkCodeSuccess = function (data) {
            if (data.code + "" == "1") {
				payPassword.goSetpayPasswordPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
	 	payPassword.goSetpayPasswordPage=function() {
			var loginName=$('#loginName').val();
			var certificateNo=$('#certificateNo').val();
			window.location.href='password02.html?loginName='+loginName+'&certificateNo='+certificateNo;
		 }
		 /**
		* 4. 修改密码
		**/
		payPassword.update=function() {
			var loginName=$('#loginName');
			if( loginName.val().length==0){
				loginName.focus();
				return;
			}
			var password=$('#password');
			if( password.val().length==0){
				password.focus();
				return;
			}
			var reg1 =/^\d{6}$/g;
			if(!reg1.test(password.val() )  ){ 
				sinoMobileUI.alert("密码格式错误");
				password2.focus();
				return false; 
			} 
			var password1=$('#password1');
			if( password1.val().length==0){
				password1.focus();
				return;
			}
			if(password.val()!=password1.val() ) {
				sinoMobileUI.alert("两次密码不一致");
				password1.focus();
				return;
			}
			var certificateNo=$('#certificateNo');
			var parm = {'loginName':loginName.val(),'password':password.val(),'certificateNo':certificateNo.val()
			};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_PAYPASSWORD;
            ajaxJsonProp.act="UPDATE_ACTION";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=payPassword.updateSuccess;
            payPassword.loadDataFromServer();
		}
        payPassword.updateSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUI.alert("支付密码设置成功");
				sinoMobileUI.doOpenPersonalPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
	 
		 payPassword.goIndexPage=function() {
		 	var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			window.location.href=relatePath+"apps/personal/paypassword/password01.html";
		 }
		payPassword.getLoginName=function() {
			var name=$.query.get("loginName");
			var loginName=$('#loginName');
			loginName.val( name );
			var certificateNo=$.query.get("certificateNo");
			var certificateNoCtl=$('#certificateNo');
			certificateNoCtl.val( certificateNo );
		}
		
		return payPassword;
	}
}
var payPassword=PayPasswordClass.createNew();