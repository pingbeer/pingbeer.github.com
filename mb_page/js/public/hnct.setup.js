/**
*  Module: setup
*  Author: Jintl
*  Create Time:2015-5-11
*  Last Modify Time: 2015-5-11
 *******************************
 * 在初始化时下载字典数据，写入本地数据库
 * 该处理在登录成功后执行，显示安装界面
 */
 var hnctSetup={
	createNew:function(){
		var setup={};
		var sinoDb=null;
		var db=null;
		var dropTables=false;
		var newlyVersion="";
		/**
		* 1。数据安装初始化入口程序
		**/
    	setup.init=function(){
			sinoDb=sqliteDb.createNew();
			db=setup.getDb();
			db.transaction(setup.createTablesExectute,setup.createTablesError,setup.createTablesSuccess);
		};
		setup.setDropTableFlag=function(flag){
			dropTables=flag;
		}
        setup.getNewlyVersion=function(){
			return newlyVersion;
		}
		setup.createTablesExectute=function(tx){
			 if(dropTables){
				tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_VENDOR ');
				tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_BRAND ');
				tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_PHONE_TYPE ');
				tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_PRICE_GROUP ');
				tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_CPU_GROUP ');
				tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_SCREEN_GROUP ');
			 }
			 tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_VENDOR       ( VENDOR_ID INTEGER PRIMARY KEY, VENDOR_NAME_ALT TEXT,ATTRIBUTE2 TEXT)');
			 tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_BRAND        ( BRAND_TYPE_VALUE TEXT PRIMARY KEY, BRAND_TYPE_NAME TEXT)');
			 tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_PHONE_TYPE   ( PHONE_TYPE_VALUE TEXT PRIMARY KEY, PHONE_TYPE_NAME TEXT)');
			 tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_PRICE_GROUP  ( STATE_CODE TEXT PRIMARY KEY, STATE_VALUE TEXT)');
			 tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_CPU_GROUP    ( STATE_CODE TEXT PRIMARY KEY, STATE_VALUE TEXT)');
			 tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_SCREEN_GROUP ( STATE_CODE TEXT PRIMARY KEY, STATE_VALUE TEXT)');
          
		};
		setup.createTablesSuccess=function(){
			//创建成功，加载配置执行
			db.transaction(setup.loadConfigExecute);
		};
		setup.createTablesError=function(error){			
			sinoMobileUI.alert("在初始化创建字典数据表时发生错误："+error);
			//直接退出
			setup.closeDb();
		};
		/**
		* 2. 加载数据库中存储版本信息
		**/
		setup.loadConfigExecute=function(tx){
			var sqlQueryUser = "select * from SINO_CONFIG  where PAR_NAME='"+sinoMobileConfig.CONST_APP_VERSION_CONFIG_FIELD_NAME+"'";
			tx.executeSql(sqlQueryUser,[],setup.loadConfigSuccess,setup.loadConfigError);
		};
		setup.loadConfigError=function(error){			
			sinoMobileUI.alert("在初始化装载字典时发生错误：！"+error);
			setup.loadAppCurrentVersion();
		};
		setup.loadConfigSuccess=function(tx,rs){
			var rows = null;
			//安全获取返回行记录
			if(rs!=null){
				rows = rs.rows;
			}
			if(rows!=null&&rows.length>0){
				var row=rows.item(0);
				var version=row.PAR_VALUE;	
				//缓冲应用version
				sinoMobileUtil.saveAppVerion2Local(version);
			}
			setup.loadAppCurrentVersion();
		};
	    /**
		* 3.加载当前应用版本号
		**/
		setup.loadAppCurrentVersion=function(){
			var url=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_PERSONAL;
			sinoMobileUtil.ajaxCall(url,"GET_CURRENT_VERSION","",setup.loadAppCurrentVersionSuccess,setup.loadAppCurrentVersionError); 
		}
		
		
		setup.loadAppCurrentVersionSuccess=function(data){
			if(data.code=="1"){	
				var newlyVersion=sinoMobileUtil.getJsonObjectFromResponseData(data,"verName");	
				if(newlyVersion!=null&&newlyVersion!=""){					
					setup.saverAppVersionConfig(newlyVersion);
				}				
			} 
			var lastVersion=sinoMobileUtil.getAppVersion();
			if(lastVersion==null){
				lastVersion="";
			}

			if((lastVersion==""&&newlyVersion=="")||lastVersion!=newlyVersion){	
				//下载数据,设置进度条
				setup.downloadDicsFromServer();
			}else{
				//直接打开主页界面
				sinoMobileUI.doOpenHomePage();
				//setup.showSetupStep();
			}			
		}
		setup.loadAppCurrentVersionError=function (result, textStatus, errorThrown){	
				/*if (textStatus!=null&&textStatus == 'timeout') {
					sinoMobileUI.alert("读取应用版本时，服务器连接超时.");
					return;
				}
				
				var httpErrorCode=result.status;
				if(httpErrorCode==null||httpErrorCode==""||httpErrorCode=="undefined"){
					sinoMobileUI.alert("读取应用版本时服务器返回错误！");
				}else{
					httpErrorCode=httpErrorCode+"";					
					if(httpErrorCode=="403"){
						//session失效，重新登录
						sinoMobileUtil.autoLogin("");
					}else if(httpErrorCode=="404"){
						sinoMobileUI.alert("读取应用版本时，服务器没有响应，或访问地址不可用！"+textStatus);
					}else if(httpErrorCode=="200" ){						
						//sinoMobileUI.alert("内部错误：！");
					}else if(httpErrorCode=="401" ){
							util.autoLogin(util.getCurrent2RootRelateFullPath());
					}else{
						sinoMobileUI.alert("读取应用版本时，服务器返回错误！") ;
					}
				}*/
		}
		/**
		* 3.1 保存应用版本信息到本地数据库
		**/
		setup.saverAppVersionConfig=function(version){	
			db=setup.getDb();
			db.transaction(setup.saverAppVersionConfigExecute,setup.saverAppVersionConfigError,setup.nullCallback);
		};
        setup.saverAppVersionConfigExecute=function(tx){
			var configSql="update SINO_CONFIG set PAR_VALUE=? where PAR_NAME='"+sinoMobileConfig.CONST_APP_VERSION_CONFIG_FIELD_NAME+"'";
			tx.executeSql(configSql,[newlyVersion]);
			configSql = "insert into SINO_CONFIG  select ((SELECT max(id)  FROM SINO_CONFIG)+1),'"+sinoMobileConfig.CONST_APP_VERSION_CONFIG_FIELD_NAME+"',?  " +
				"  where not exists  (select 1 from SINO_CONFIG where  PAR_NAME='"+sinoMobileConfig.CONST_APP_VERSION_CONFIG_FIELD_NAME+"')";
			tx.executeSql(configSql,[newlyVersion]);
		}
		setup.saverAppVersionError=function(error){			
			sinoMobileUI.alert("保存应用版本到本地数据表时出错！") ;
		};
		/**
		* 空回调函数
		**/
		setup.nullCallback=function(){
			
		}
		/**
		* 下载数据进度条步长
		**/
		setup.stepProcess=function(nPerc){
			$(".progress-bar").css("width",nPerc+"%");
			$("#procInfo").html(nPerc+"% 完成");
		}
		/**
		* 4. 从服务器下载数据到本地
		**/
		setup.downloadDicsFromServer=function(){
			var dic=hntcMemDic.createNew();
			//setup.stepProcess(10);
			//异步处理。需链式调用
			dic.downloadVendorFromServer(setup.downloadBrandFromServer);	
		}
		
		//->4.1
		setup.downloadBrandFromServer=function(){
			var dicBrandor=hntcMemDic.createNew();
			//setup.stepProcess(20);
			//结尾调用成功处理
			dicBrandor.downloadBrandFromServer(setup.downloadPhoneTypeFromServer);
		}
		//->4.2
		setup.downloadPhoneTypeFromServer=function(){
			var dicPhoneType=hntcMemDic.createNew();
			//setup.stepProcess(40);
			//结尾调用成功处理
			dicPhoneType.downloadPhoneTypeFromServer(setup.downloadPriceGroupFromServer);
		}
		//->4.3
		setup.downloadPriceGroupFromServer=function(){
			var dicPriceGroup=hntcMemDic.createNew();
			//setup.stepProcess(60);
			//结尾调用成功处理
			dicPriceGroup.downloadPriceGroupFromServer(setup.downloadCpuGroupFromServer);
		}
		//->4.4
		setup.downloadCpuGroupFromServer=function(){
			var dicCpuGroup=hntcMemDic.createNew();
			//setup.stepProcess(80);
			//结尾调用成功处理
			dicCpuGroup.downloadCpuGroupFromServer(setup.downloadScreenGroupFromServer);
		}
		//->4.5
		setup.downloadScreenGroupFromServer=function(){
			var dicScreenGroup=hntcMemDic.createNew();
			//setup.stepProcess(90);
			//结尾调用成功处理
			dicScreenGroup.downloadScreenGroupFromServer(setup.downloadDicsFromServerFinishCall);
		}
		setup.downloadDicsFromServerFinishCall=function(recs){
			//如果从服务上下载的新版本，则保存到实体缓冲
			if(setup.getNewlyVersion()!=""){			
				sinoMobileUtil.saveAppVerion2Local(setup.getNewlyVersion());
			}
			setup.closeDb();
			//打开主页界面
			sinoMobileUI.doOpenHomePage();
			//setup.showSetupStep();
		}
        setup.getDb=function(){
			var retDb=null;
			if(db==null){
				sinoDb=sqliteDb.createNew();
				retDb=sinoDb.getDB();
			}else{
				retDb=db;
			}
			return retDb;
		}
        setup.closeDb=function(){
			if(db!=null){
				sinoDb.closeDb(db);
			}		
		}
		setup.initApp=function(){
			sinoMobileUtil.saveClientRootPath();
			sinoMobileUtil.host(setup.initOk,setup.initError);			
			sessionStorage.clear();


			var viewSize=sinoMobileUtil.getViewSize();		
			var windowWidth=viewSize.w;		
			var imgHeight=viewSize.h;	
			$("#sliderBanner").yxMobileSlider({width:windowWidth,height:imgHeight,during:1150000,moveEndCallbackFnc:setup.navEndEvent});
		}
		setup.initOk=function(str){
			if(sinoMobileUtil.strIsNull(str)){
				sinoMobileUI.alert("初设化获取地址失败！");
			}else{
				sinoMobileUtil.saveServerHost(str);
				//var user=userLogin.createNew();
				//setTimeout(function(){user.checkAutoLogin("")},6000);
				//清空session缓冲	
			}
		}
		setup.initError=function(){
			
			sinoMobileUI.alert("初设化获取地址失败！");
		}
		setup.showImage2=function(){
			/*sinoMobileUtil.saveClientRootPath();
			if($("#startNav3").is(':visible')){
				return;
			}
			
			$("#startNav1").hide();
			$("#startNav2").show();
			setTimeout(setup.showImage3,2000);*/
		}
		setup.showImage3=function(){
			$("#startNav2").hide();
			$("#startNav3").show();
			setTimeout(setup.clickImage3,2000);
		}
		setup.clickImage3=function(){
			var user=userLogin.createNew();
			user.checkAutoLogin("");
		}
	    setup.navEndEvent=function(){
			if(sinoMobileUtil.pathIsRoot()){
				var localurl = window.document.location.href;
				if (localurl.indexOf("index.html") > 0){
					setup.clickImage3();
				}
			}
		}
		return setup;
	} 
 }