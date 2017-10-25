/**
*  Module: Login
*  Author: Jintl
*  Create Time:2015-4-15
*  Last Modify Time: 2015-5-4
 *******************************
 * 登录处理步骤
 * 1.打开引导页
 * 2。从数据库中读取记住密码参数，未记住则直接转99，登录页。记住密码则继续下3。
 * 3。从数据库中读取用户名及摘要密码，没有读到，打开登录页。有则继续4。
 * 4。调用服务器接口验证，验证未通过，打开登录界面。通过则导向到主页。
 */
var  userLogin={
	createNew:function() {
		var user=sqliteDb.createNew();
		var rememberPwd=false;
		var userLoginName="";
		var _dzLoginSystme=2;
		var userPwd="";
		var userPwdMd5="";
		var db=null;
		var fetchAll = false;
		var lastUrl="";
		/**
		 * 从数据库中读取保存的用户初始信息。
		 * @param fetchFlag
		 */
		user.loadFromDb = function (fetchFlag) {
			user.openUserDB();
			fetchAll = fetchFlag;
			if (fetchAll) {
				db.transaction(user.loadAll);
			} else {
				db.transaction(user.loadFirst);
			}
		};
		//获取全部用户
		user.loadAll = function (tx) {
			var sqlQueryUser = "select * from SINO_CURRENT_SESSION";
			tx.executeSql(sqlQueryUser, [], user.loadSuccess,user.loadError)
		};
		//取第一条用户设置数据
		user.loadFirst = function (tx) {
			var sqlQueryUser = "select * from SINO_CURRENT_SESSION limit 1";
			tx.executeSql(sqlQueryUser, [],user.loadSuccess, user.loadError )
		};
		//错误处理
		user.loadError = function (err) {
			//不处理直接关闭数据库
			user.closeUsreDB();
			sinoMobileUI.doOpenLoginPage();
		};
		//成功处理
		user.loadSuccess = function (tx, results) {
			//先关闭数据库
			user.closeUsreDB();
			var rows = null;
			//安全获取返回行记录
			try {
				rows = results.rows;
			} catch (errors) {
			}
			if(rows==null||rows.length==0){
				sinoMobileUI.doOpenLoginPage();
				return;
			}
			var row=null;
			try{
				row=rows.item(0);
			}catch(errors){}
			//获取用户保存信息
			userLoginName=row.LOGIN_NAME;
			userPwd=row.PASSWORD;
			userPwdMd5=$.md5(userPwd);
			//提交后台验证
			user.loginBackground();
		};
		/**
		 * 数据库操作：打开及关闭数据库。
		 * @param db
		 */
		user.openUserDB=function(){
			//用于一次打开，执行多个操作
			if(db==null){
				db=user.getDB();
			}
		};
		user.closeUsreDB=function(){
			if(db!==null){
				user.closeDb(db);
			}
		};
		/**
		 * 检查自动登录
		 **/
		user.checkAutoLogin=function(url){
			sessionStorage.clear();
			lastUrl=url;
			// qyj add
			var autoLogin=false;
			if( sinoMobileUtil.checkLocalStorageSupport() ) {
				var autoLogin=sinoMobileUtil.getLocalStorageValue('autoLogin');
				if(　autoLogin=='true' 　) {
					user.loadFromDb(false);
				} else {
					sinoMobileUI.doOpenLoginPage();
				}
			} else {
				sinoMobileUI.doOpenLoginPage();
			}

		};
		user.loginBackground=function(){	
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_LOGIN;
			sinoMobileUtil.ajaxCall(strUrl,"login",user.getParamJson(),user.loginBackgroundSuccess,user.loginBackgroundError); 
				
		};
		user.loginBackgroundSuccess= function(data){	
			if(data.code+"" == "1"){
				//是否保存
				//if(user.flagIsTrue(saveRememberPwd) || user.flagIsTrue(autoLogin)){
					user.saveUserInfo();
				//}
				_dzLoginSystme=data.msg;
				if( sinoMobileUtil.checkLocalStorageSupport() ) {//qyj
					sinoMobileUtil.saveLocalStorage('dzLoginSystme',_dzLoginSystme);
				}
				if(lastUrl==null||lastUrl==""){
					//打开主页
					//sinoMobileUI.doOpenSetupPage();
					if( _dzLoginSystme=='1' ) {
						//sinoMobileUI.doOpenHomePage();//b2b
						sinoMobileUI.doOpenSetupPage();
					} else {
						sinoMobileUI.doOpenCloudIndexPage();//shop
					}
				}else{
					//如果传入url不为空，判断是否停留在本页面
					var thisRelatePath=sinoMobileUtil.getCurrent2RootRelateFullPath();
					if(thisRelatePath!=lastUrl){
						window.location.href=lastUrl;
					}
				}
			}else{		
				if($(".error_tips_con")){
					$(".error_tips_con").show();
				}else{
					sinoMobileUI.alert("用户名或密码错误！");
				}
			}
		};
		user.loginBackgroundError=function (result, textStatus, errorThrown){				
				user.closeUsreDB();
				
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
					if(httpErrorCode=="404"){
						sinoMobileUI.alert("服务器没有响应，或访问地址不可用！");
					}else if(httpErrorCode=="200" || httpErrorCode=="401" ){
						//sinoMobileUI.alert("内部错误：！");
					}else{
						sinoMobileUI.alert("服务器返回错误，操作不能继续！") ;
					}
				}
		};
		user.getParamJson=function(){
			var strJson="{'loginName':'"+userLoginName+"','password':'"+userPwdMd5+"','dzLoginSystme':"+_dzLoginSystme+"}";
			//对参数数据进行加密处理
			return strJson;
		};
		user.login=function(loginName,pwd,dzLoginSystme){
			userLoginName=loginName;
			userPwd=pwd;
			userPwdMd5= $.md5(pwd);
			_dzLoginSystme=dzLoginSystme;
			user.loginBackground();
		};
		user.flagIsTrue=function(flag){
			return (!sinoMobileUtil.strIsNull(flag)&&(flag=="true"||flag=="1"))?true:false;
		}
		/* 从数据库中读取保存的用户初始信息。
		 * @param fetchFlag
		 */
		user.setInput = function () {
			user.openUserDB();
			db.transaction(user.setInputTran);
		};
		user.setInputTran = function (tx) {
			var sqlQueryUser = "select * from SINO_CURRENT_SESSION limit 1";
			tx.executeSql(sqlQueryUser, [],user.setInputSuccess, user.setInputError )
		};
		//错误处理
		user.setInputError = function (err) {
			//不处理直接关闭数据库
			user.closeUsreDB();
		};
		//成功处理
		user.setInputSuccess = function (tx, results) {
			//先关闭数据库
			user.closeUsreDB();
			var rows = null;
			//安全获取返回行记录
			try {
				rows = results.rows;
			} catch (errors) {
			}
			if(rows==null||rows.length==0){
				return;
			}
			var row=null;
			try{
				row=rows.item(0);
				//获取用户保存信息
				$('#loginName').val(row.LOGIN_NAME);
				$('#password').val(row.PASSWORD);
			}catch(errors){}
			
			
		};
		/**
		 * 保存用户信息
		 */
		user.saveUserInfo=function(){
			user.openUserDB();
			db.transaction(user.saveUserInfoExecute,user.saveUserInfoError,user.saveUserInfoSuccess);
		};
        user.saveUserInfoExecute=function(tx){
			var userSql="delete from  SINO_CURRENT_SESSION   where SERVER_ID='9999'";
			tx.executeSql(userSql,[]);
			userSql="insert into SINO_CURRENT_SESSION  select '9999',?,?,'','' where not exists(select 1 from  SINO_CURRENT_SESSION where LOGIN_NAME=?)";
			tx.executeSql(userSql,[userLoginName,userPwd,userLoginName]);

		}
		user.saveUserInfoError=function(error){
			//不用显示失败信息
			//sinoMobileUI.alert(error);
			user.closeUsreDB();
		};
		user.saveUserInfoSuccess=function(tx,result){
			//也不用显示成功信息
			user.closeUsreDB();
		}
		return user;
	}
}