/**
*  Module: personal
*  Author: qyj
*  Create Time:
*  Last Modify Time: 2
 *******************************
 * 银行卡 显示 绑定 移除
 * */

var BankClass={
	createNew:function(){
		var bank={};
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
        bank.loadError=function (result, textStatus, errorThrown){
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
		/**
		* 1. 银行卡详细
		**/
		bank.loadDetail=function(){	
			var bankBindId = $.query.get("bankBindId");
			var userName = $.query.get("userName");
			var certificateType = $.query.get("certificateType");
			var certificateNo = $.query.get("certificateNo");
			var bankCode = $.query.get("bankCode");
			var bankCardNoShow = $.query.get("bankCardNoShow");
			var bankName = $.query.get("bankName");
			var userPhone = $.query.get("userPhone");
			if(certificateType==true) certificateType="";
			$('#bankBindId').val(bankBindId);
			
			var rec=new Record();
			var logoUrl=bankCode+".jpg";
			rec.addField("logoUrl","../../../images/bank/"+logoUrl);
			rec.addField("userName",userName);
			rec.addField("certificateType",certificateType);
			rec.addField("certificateNo",certificateNo);
			rec.addField("bankCode",bankCode);
			rec.addField("bankCardNoShow",bankCardNoShow);
			rec.addField("bankName",bankName);
			rec.addField("userPhone",userPhone);
			var templateHtml=$("#templateBand").html();
			var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,rec);
			var bankDetail=$("#bankDetail");
			bankDetail.html("");
			bankDetail.html(html);	
		}
		bank.goBankDetailPage=function(bankBindId,userName,certificateType,certificateNo,bankCode,bankCardNoShow,bankName,userPhone){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/personal/account/bankDetail.html?bankBindId="+bankBindId+"&userName="+userName+'&certificateType='+certificateType+'&certificateNo='+certificateNo+'&bankCode='+bankCode+'&bankCardNoShow='+bankCardNoShow+'&bankName='+bankName+'&userPhone='+userPhone;	
		}
		bank.goAddBankPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/personal/account/addBank.html";	
		}
		bank.goSelectBankPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/personal/account/selectBank.html";	
		}
		//从后台调用数据的总入口
        bank.loadDataFromServer=function(){
            var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
            sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,bank.loadError);
        };
		bank.remove=function() {
			var parm = '{"bankBindId":"' + $('#bankBindId').val()+'"}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_BANK;
            ajaxJsonProp.act="CANCELL_BIND_BANK";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=bank.removeSuccess;
            bank.loadDataFromServer();
		}
        bank.removeSuccess = function (data) {
            if (data.code + "" == "1") {
				 sinoMobileUI.alert("操作成功");
              	sinoMobileUI.doOpenPersonalAccountListPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		bank.loadPayBankFromServer=function() {
			//var datalist=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_CHAIN_PAY_BANK_LIST);
			//if(datalist && datalist.length>0) {
			//} else {
				var parm = '';
				ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
				ajaxJsonProp.act="GET_CHINA_PAY_BANK";
				ajaxJsonProp.parmData=parm;
				ajaxJsonProp.successCallbackFunc=bank.loadPayBankFromServerSuccess;
				bank.loadDataFromServer();
			//}
		}
		 bank.loadPayBankFromServerSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_CHAIN_PAY_BANK_LIST,sinoMobileUtil.getJsonStringFromResponseData(data,"chinaPayBankData"));
				bank.loadPayBankFromSession();
            } else {
                sinoMobileUI.alert("加载银联出现错误！" + data.msg);
            }
        }
		bank.loadPayBankFromSession=function() {
			 var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_CHAIN_PAY_BANK_LIST);
				 datalist=$.parseJSON(datas);
			var templateHtml=$("#bankTemplate").html();
			var sb=new Array();
			for(var i=0;i<datalist.length;i++) {
				var recs=new Record();
				recs.addField('stateValue',datalist[i].stateValue);
				recs.addField('stateCode',datalist[i].stateCode);
				recs.addField('logoUrl',"../../../images/bank/"+datalist[i].stateCode+".jpg");
				var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,recs);
				sb.push(html);
			}
			var bankList=$("#bankList");
			bankList.html(sb.join(''));	
		}
		bank.selectBankOk=function(stateValue,stateCode){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/personal/account/addBank.html?stateValue="+stateValue+"&stateCode="+stateCode;	
		}
		bank.getBankCodeByUrl=function() {
			var bankDiv=$('#bankDiv');
			var stateValue = $.query.get("stateValue");
			var stateCode = $.query.get("stateCode").trim();
			$('#bankCode').val(stateCode);
			$('#bankName').val(stateValue);
			if( stateValue && stateCode) {
				$('#bankIcon').attr("src","../../../images/bank/"+stateCode+".jpg");
				$('#bankText').html(stateValue);
				$('#bankIcon').show();
			} else {
				//bankDiv.hide();
				$('#bankIcon').hide();
				$('#bankText').html('未绑定,点击这里选择银行');
			}
		}
		bank.sendSms=function() {
			var userName=$('#userName');
			var certificateNo=$('#certificateNo');
			var certificateType=$('#certificateType');
			var bankCode=$('#bankCode');
			var bankCardNo=$('#bankCardNo');
			var bankName=$('#bankName');
			var userPhone=$('#userPhone');
			
			if( bankName.val().length==0 || bankCode.val().length==0){
				 sinoMobileUI.alert("请选择银行");
				 return;
			}
			if( certificateType.val().length==0 ){
				 sinoMobileUI.alert("请选择证件类型");
				 return;
			}
			if( certificateNo.val().length==0){
				certificateNo.focus();
				return;
			}
			//验证身份证号码
			if(certificateType.val() == "01") {
				//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if(reg.test(certificateNo.val() ) === false) {
					sinoMobileUI.alert("身份证号输入不合法！");
					certificateNo.focus();
					return ;
				}
			}

			if( userName.val().length==0){
				userName.focus();
				return;
			}
			if(userName.val().length>15) {
				 sinoMobileUI.alert("持卡人姓名不能超过15个字");
				 userName.focus();
				 return;
			}
			
			if( bankCardNo.val().length==0){
				bankCardNo.focus();
				return;
			}
			if(bankCardNo.val().length>100) {
				 sinoMobileUI.alert("银行卡号长度不能超过100位");
				 bankCardNo.focus();
				 return;
			}
			var reg = /^(\d)+$/;
			if(reg.test(bankCardNo.val() ) === false) {
				sinoMobileUI.alert("银行卡号必须是数字！");
				bankCardNo.focus();
				return ;
			}

			if( userPhone.val().length==0){
				userPhone.focus();
				return;
			}
			if(userPhone.val().length!=11) {
				 sinoMobileUI.alert("手机号位数必须为11位数字");
				 userPhone.focus();
				 return;
			}
			if(reg.test(userPhone.val() ) === false) {
				sinoMobileUI.alert("手机号位数必须为11位数字！");
				userPhone.focus();
				return ;
			}


			var parm = '{"userPhone":"' + $('#userPhone').val()+'"}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_BANK;
            ajaxJsonProp.act="GET_BIND_BANK_RANDOM";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=bank.sendSmsSuccess;
            bank.loadDataFromServer();
		}
        bank.sendSmsSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUI.alert("验证码已发送到您手机");
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		bank.add=function() {
			var userName=$('#userName');
			var certificateNo=$('#certificateNo');
			var certificateType=$('#certificateType');
			var bankCode=$('#bankCode');
			var bankCardNo=$('#bankCardNo');
			var bankName=$('#bankName');
			var userPhone=$('#userPhone');
			var randomVerifyCode=$('#randomVerifyCode');
			
			if( bankName.val().length==0 || bankCode.val().length==0){
				 sinoMobileUI.alert("请选择银行");
				 return;
			}
			if( certificateType.val().length==0 ){
				 sinoMobileUI.alert("请选择证件类型");
				 return;
			}
			if( certificateNo.val().length==0){
				certificateNo.focus();
				return;
			}
			//验证身份证号码
			if(certificateType.val() == "01") {
				//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if(reg.test(certificateNo.val() ) === false) {
					sinoMobileUI.alert("身份证号输入不合法！");
					certificateNo.focus();
					return ;
				}
			}

			if( userName.val().length==0){
				userName.focus();
				return;
			}
			if(userName.val().length>15) {
				 sinoMobileUI.alert("持卡人姓名不能超过15个字");
				 userName.focus();
				 return;
			}
			
			if( bankCardNo.val().length==0){
				bankCardNo.focus();
				return;
			}
			if(bankCardNo.val().length>100) {
				 sinoMobileUI.alert("银行卡号长度不能超过100位");
				 bankCardNo.focus();
				 return;
			}
			var reg = /^(\d)+$/;
			if(reg.test(bankCardNo.val() ) === false) {
				sinoMobileUI.alert("银行卡号必须是数字！");
				bankCardNo.focus();
				return ;
			}

			if( userPhone.val().length==0){
				userPhone.focus();
				return;
			}
			if(userPhone.val().length!=11) {
				 sinoMobileUI.alert("手机号位数必须为11位数字");
				 userPhone.focus();
				 return;
			}
			if(reg.test(userPhone.val() ) === false) {
				sinoMobileUI.alert("手机号位数必须为11位数字！");
				userPhone.focus();
				return ;
			}

			if( randomVerifyCode.val().length==0){
				randomVerifyCode.focus();
				return;
			}
			
			var parm = {'userName':userName.val(),'certificateNo':certificateNo.val(),'certificateType':certificateType.val(),'bankCode':bankCode.val(),
			'bankCardNo':bankCardNo.val(),'bankName':bankName.val(),'userPhone':userPhone.val(),'randomCode':randomVerifyCode.val()
			};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_BANK;
            ajaxJsonProp.act="SUBMIT_BIND_BANK";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=bank.addSuccess;
            bank.loadDataFromServer();
		}
        bank.addSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUI.alert("银行卡绑定成功");
              	sinoMobileUI.doOpenPersonalAccountListPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		return bank;
	}
}
var bank=BankClass.createNew();