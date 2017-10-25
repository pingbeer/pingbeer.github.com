/**
*  Module: setup
*  Author: Jintl
*  Create Time:2015-5-11
*  Last Modify Time: 2015-5-11
 *******************************
 * 缓冲字典
 * */
var memConfig={
	CONST_MEM_DIC_VENDOR:'sino.dic.vendor',
	CONST_MEM_DIC_BRAND:'sino.dic.brand',
	CONST_MEM_DIC_PHONE_TYPE:'sino.dic.phonetype',
	CONST_MEM_DIC_PRICE_GROUP:'sino.dic.pricegroup',
	CONST_MEM_DIC_CPU_GROUP:'sino.dic.cpugroup',
	CONST_MEM_DIC_SCREEN_GROUP:'sino.dic.screengroup',
	CONST_MEM_TITLE_BRAND:'品牌',
	CONST_MEM_TITLE_PRICE:'价格',
	CONST_MEM_TITLE_SCREEN:'屏幕尺寸',
	CONST_MEM_TITLE_CPU:'CPU'
}
var hntcMemDic={
	createNew:function(){
		var dic={};
	
		var sqlite=sqliteDb.createNew();
        var db=null;
		//数据库是否自关闭
		var dbSelfClose=true;
		//需保存到数据库中的记录集
		var toSaveRecords=null;
		//删除数据库表标志
		var dropTableFlag=false;
		//传入成功后回调函数
		var dicAjaxCallProp={
			//下载数据地址
			ajaxUrl:"",
			ajaxAct:"",
			ajaxParam:"",
			//数据读取成功后执行的回调函数
			completeCallbackFnc:null,
			//显示标题
			title:'',
			//Json数据返回的标识名称，用于获取记录集
			jsonReturnDataName:'',
			//本地缓冲存储名称
			storageName:'',
			//从数据库中查询数据SQL
			loadFromDbSql:'',
			//将记录集存储到本地数据库之回调函数
			saveRecords2DbCallbackFnc:null		
		}
		/**
		* 初始化访问调用数据
		**/
		
		//调用完毕后请重置默认值
		dic.resetProperty=function(){
			toSaveRecords=null;
		
			dicAjaxCallProp.ajaxUrl="";
			dicAjaxCallProp.ajaxAct="";
			dicAjaxCallProp.ajaxParam="";

			dicAjaxCallProp.completeCallbackFnc=null;
			dicAjaxCallProp.title="";
			dicAjaxCallProp.jsonReturnDataName="";
			dicAjaxCallProp.storageName="";
			dicAjaxCallProp.loadFromDbSql="";
			dicAjaxCallProp.saveRecords2DbCallbackFnc=null;
		};
		dic.initProperty=function(config){			
			dicAjaxCallProp.ajaxUrl=config.ajaxUrl;
			dicAjaxCallProp.ajaxAct=config.ajaxAct;
			dicAjaxCallProp.ajaxParam=config.ajaxParam;

			dicAjaxCallProp.completeCallbackFnc=config.completeCallbackFnc;
			dicAjaxCallProp.title=config.title;
			dicAjaxCallProp.jsonReturnDataName=config.jsonReturnDataName;
			dicAjaxCallProp.storageName=config.storageName;
			dicAjaxCallProp.loadFromDbSql=config.loadFromDbSql;
			dicAjaxCallProp.saveRecords2DbCallbackFnc=config.saveRecords2DbCallbackFnc;
		}
		dic.openDb=function(){
			//用于一次打开，执行多个操作
			if(db==null){
				db=sqlite.getDB();
			}
		};
		dic.closeDb=function(){
			if(dbSelfClose&&db!==null){
				sqlite.closeDb(db);
			}
		};
		/**
		* 设置数据库，如果是外设置，则不允许自关闭，只接受调用者显式关闭
		**/
		dic.setDb=function(theDb){			
			db=theDb;
			dbSelfClose=false;
		}
		/**
		* 1. 以下为设置及调用品牌
		**/
		dic.setBrandCallProp=function(successCallback){
			dic.resetProperty();
			
			dicAjaxCallProp.ajaxUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
			dicAjaxCallProp.ajaxAct="GET_BRAND";
			dicAjaxCallProp.ajaxParam="";
			dicAjaxCallProp.completeCallbackFnc=successCallback;
			dicAjaxCallProp.title="品牌";
			dicAjaxCallProp.jsonReturnDataName="brandData";
			dicAjaxCallProp.storageName=memConfig.CONST_MEM_DIC_BRAND;
			dicAjaxCallProp.loadFromDbSql="select * from CONST_MEM_DIC_BRAND";
			dicAjaxCallProp.saveRecords2DbCallbackFnc=dic.saveBrand2LocalDbExecute;	
		}
		
		dic.loadBrand=function(successCallback){			
			dic.setBrandCallProp(successCallback);
			dic.loadExecute();
		}
		dic.downloadBrandFromServer=function(successCallback){
			dic.setBrandCallProp(successCallback);
			dic.downloadDicFromServer(dicAjaxCallProp);
		}
		/**
		* 2. 以下为设置及调用供应商
		**/
		
		dic.setVendorCallProp=function(successCallback){
			dic.resetProperty();
			dicAjaxCallProp.ajaxUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
			dicAjaxCallProp.ajaxAct="GET_VENDOR";
			dicAjaxCallProp.ajaxParam="";
			dicAjaxCallProp.completeCallbackFnc=successCallback;
			dicAjaxCallProp.title="供应商";
			dicAjaxCallProp.jsonReturnDataName="vendorData";
			dicAjaxCallProp.storageName=memConfig.CONST_MEM_DIC_VENDOR;
			dicAjaxCallProp.loadFromDbSql="select * from CONST_MEM_DIC_VENDOR";
			dicAjaxCallProp.saveRecords2DbCallbackFnc=dic.saveVendor2LocalDbExecute;		
		}

		dic.loadVendor=function(successCallback){			
			dic.setVendorCallProp(successCallback);
			dic.loadExecute();
		}
		dic.downloadVendorFromServer=function(successCallback){
			dic.setVendorCallProp(successCallback);
			dic.downloadDicFromServer(dicAjaxCallProp);
		}

		/**
		* 3. 以下为设置及调用手机类型
		**/

        dic.setPhoneTypeCallProp=function(successCallback){
			dic.resetProperty();
			dicAjaxCallProp.ajaxUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
			dicAjaxCallProp.ajaxAct="GET_PHONE_TYPE";
			dicAjaxCallProp.ajaxParam="";
			dicAjaxCallProp.completeCallbackFnc=successCallback;
			dicAjaxCallProp.title="手机类型";
			dicAjaxCallProp.jsonReturnDataName="typeData";
			dicAjaxCallProp.storageName=memConfig.CONST_MEM_DIC_PHONE_TYPE;
			dicAjaxCallProp.loadFromDbSql="select * from SINO_DIC_PHONE_TYPE";
			dicAjaxCallProp.saveRecords2DbCallbackFnc=dic.savePhoneType2LocalDbExecute;		
		}

		dic.loadPhoneType=function(successCallback){			
			dic.setPhoneTypeCallProp(successCallback);
			dic.loadExecute();
		}
		dic.downloadPhoneTypeFromServer=function(successCallback){
			dic.setPhoneTypeCallProp(successCallback);
			dic.downloadDicFromServer(dicAjaxCallProp);
		}

		/**
		* 4. 以下为设置及调用产品价格
		**/

		dic.setPriceGroupCallProp=function(successCallback){
			dic.resetProperty();
			dicAjaxCallProp.ajaxUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
			dicAjaxCallProp.ajaxAct="GET_PRICE_GROUP";
			dicAjaxCallProp.ajaxParam="";
			dicAjaxCallProp.completeCallbackFnc=successCallback;
			dicAjaxCallProp.title="产品价格";
			dicAjaxCallProp.jsonReturnDataName="priceData";
			dicAjaxCallProp.storageName=memConfig.CONST_MEM_DIC_PRICE_GROUP;
			dicAjaxCallProp.loadFromDbSql="select * from SINO_DIC_PRICE_GROUP";
			dicAjaxCallProp.saveRecords2DbCallbackFnc=dic.savePriceGroup2LocalDbExecute;		
		}

		dic.loadPriceGroup=function(successCallback){
			dic.setPriceGroupCallProp(successCallback);
			dic.loadExecute();
		}
		dic.downloadPriceGroupFromServer=function(successCallback){
			dic.setPriceGroupCallProp(successCallback);
			dic.downloadDicFromServer(dicAjaxCallProp);
		}

		/**
		* 5. 以下为设置及调用产品CPU
		**/


		dic.setCpuGroupCallProp=function(successCallback){
			dic.resetProperty();
			dicAjaxCallProp.ajaxUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
			dicAjaxCallProp.ajaxAct="GET_CPU_GROUP"
			dicAjaxCallProp.ajaxParam="";
			dicAjaxCallProp.completeCallbackFnc=successCallback;
			dicAjaxCallProp.title="CPU";
			dicAjaxCallProp.jsonReturnDataName="cpuData";
			dicAjaxCallProp.storageName=memConfig.CONST_MEM_DIC_CPU_GROUP;
			dicAjaxCallProp.loadFromDbSql="select * from SINO_DIC_CPU_GROUP";
			dicAjaxCallProp.saveRecords2DbCallbackFnc=dic.saveCpuGroup2LocalDbExecute;		
		}

		dic.loadCpuGroup=function(successCallback){			
			dic.setCpuGroupCallProp(successCallback);
			dic.loadExecute();
		}
		dic.downloadCpuGroupFromServer=function(successCallback){
			dic.setCpuGroupCallProp(successCallback);
			dic.downloadDicFromServer(dicAjaxCallProp);
		}

		/**
		* 6. 以下为设置及调用产品屏幕
		**/


		dic.setScreenGroupCallProp=function(successCallback){
			dic.resetProperty();
			dicAjaxCallProp.ajaxUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
			dicAjaxCallProp.ajaxAct="GET_SCREEN_GROUP";
			dicAjaxCallProp.ajaxParam="";
			dicAjaxCallProp.completeCallbackFnc=successCallback;
			dicAjaxCallProp.title="屏幕";
			dicAjaxCallProp.jsonReturnDataName="screenData";
			dicAjaxCallProp.storageName=memConfig.CONST_MEM_DIC_SCREEN_GROUP;
			dicAjaxCallProp.loadFromDbSql="select * from SINO_DIC_SCREEN_GROUP";
			dicAjaxCallProp.saveRecords2DbCallbackFnc=dic.saveScreenGroup2LocalDbExecute;		
		}

		dic.loadScreenGroup=function(successCallback){			
			dic.setScreenGroupCallProp(successCallback);
			dic.loadExecute();
		}
		dic.downloadScreenGroupFromServer=function(successCallback){
			dic.setScreenGroupCallProp(successCallback);
			dic.downloadDicFromServer(dicAjaxCallProp);
		}
        /**
		* 加载执行主入口函数
		*    加载数据顺序及逻辑，字典使用了本地缓冲及存储
		*　　　　a>localStorage? Y: return  N: goto b
		*        b>sqlite db   ? Y: return  N: goto c
		*        c>download from server: Y: save to localstorage and db, return. N: reutrn null
		**/

		dic.loadExecute=function(){
			//读缓冲
			var recs=dic.loadRecordsFromLocalStorage();
			//从缓冲数据中读到数据则转向到成功回调
			if(recs!=null&&recs.getLength()>0){
				if(dicAjaxCallProp.completeCallbackFnc!=null){
					dicAjaxCallProp.completeCallbackFnc(recs);
				}
			}else{	
				//从数据库中加载，如果没有加载到，则从服务器上下载
				dic.loadDicFromDb();
			}
		}

		/**
		* 从本地实体缓冲加载数据
		*/  
		
        dic.loadRecordsFromLocalStorage=function(){
			var json=sinoMobileUtil.getLocalStorageValue(dicAjaxCallProp.storageName);
			if(sinoMobileUtil.strIsNull(json)){
				return null;
			}
			var recs=new Records();
			recs.fromJsonString(json);
			return recs;
		}
		/**
		*　保存数据到到本地缓冲
		*/ 
		dic.saveRecords2LocalStorage=function(jsonStr){
			sinoMobileUtil.saveLocalStorage(dicAjaxCallProp.storageName,jsonStr);
		}
		/**
		* 从本地数据库中加载字典，如果失败则从服务器上下载
		*/ 
		dic.loadDicFromDb=function(){
			dic.openDb();
			db.transaction(dic.loadDicFromDbExecute);
		};
		dic.loadDicFromDbExecute=function(tx){
			tx.executeSql(dicAjaxCallProp.loadFromDbSql,[],dic.loadDicFromDbSuccess,dic.loadDicFromDbError);
		};
		dic.loadDicFromDbError=function(error){
			//sinoMobileUI.alert("从数据库中加载供应商失败！");
			//如果失败从服务器中下载			
			dic.downloadDicFromServer(dicAjaxCallProp);
		};
		dic.loadDicFromDbSuccess=function(tx,rs){			
			var rows = null;
			//安全获取返回行记录
			if(rs!=null){
				rows = rs.rows;
			}
			if(rows!=null&&rows.length>0){
				var recs=new Records();
				recs.fromJson(rows);
				//加载成功写到sesson缓冲中
				dic.saveRecords2LocalStorage(recs.toJsonString());
				//调用成功回调函数
				if(dicAjaxCallProp.completeCallbackFnc!=null){
					dicAjaxCallProp.completeCallbackFnc(recs);
				}
			}else{
				//未找到记录，从服务器上下载
				dic.downloadDicFromServer(dicAjaxCallProp);
			}
		};
			
		/**
		* 从服务上下载字典数据
		*/ 
		dic.downloadDicFromServer=function(config){			
			dic.initProperty(config);
			var strUrl=dicAjaxCallProp.ajaxUrl;
			sinoMobileUtil.ajaxCall(strUrl,dicAjaxCallProp.ajaxAct,dicAjaxCallProp.ajaxParam,dic.downloadDicFromServerSuccess,dic.loadError); 		
		};
		/**
		 * .获取记录集
		 * @param data
		 * @returns {Records}
		 */
		dic.getDicRecords=function(data){
			var recs=new Records();
			var dataJson=sinoMobileUtil.getJsonObjectFromResponseData(data,dicAjaxCallProp.jsonReturnDataName);
			recs.fromJson(dataJson);
			return recs;
		};
		dic.downloadDicFromServerSuccess=function(data){
			$(".onLoad").hide();
			if(data.code+"" == "1"){
				//加载成功，则直接写入到session缓冲数据中
				var recs=dic.getDicRecords(data);
				if(recs==null||recs.getLength()==0){
					dic.saveRecords2LocalStorage("");
				}else{
					toSaveRecords=null;
					//缓冲需保存的记录集合对象，供插入数据调用
					toSaveRecords=recs;
					var json=recs.toJsonString();
					//先缓冲数据
					dic.saveRecords2LocalStorage(json);
					//异步调用将供应商信息存储到本地数据库
					setTimeout(dic.saveRecord2LocalDb,1000);
				}
				//加载成功后调用回调函数
				if(dicAjaxCallProp.completeCallbackFnc!=null){
					dicAjaxCallProp.completeCallbackFnc(recs);
				}
			}else{
				//sinoMobileUI.alert("从服务器加载"+dicAjaxCallProp.title+"字典出错！"+data.msg);
				
			}
		
		}

		
		dic.saveRecords2LocalDb=function(){
			dic.openDb();
			db.transaction(dicAjaxCallProp.saveRecords2DbCallbackFnc,dic.save2DbError,dic.saveNullCallSuccess);
		}
		/**
		/* ＆1.保存品牌到本地数据库
		**/
		dic.saveBrand2LocalDbExecute=function(tx){			
			//先删除表
			tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_BRAND ');
			//再创建结构
			tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_BRAND        ( BRAND_TYPE_VALUE TEXT PRIMARY KEY, BRAND_TYPE_NAME TEXT)');
			var nLen=toSaveRecords.getLength();
            var rec=null;
			for(var nn=1;nn<=nLen;nn++){
				rec=toSaveRecords.getNthRecord(nn);
				tx.executeSql('INSERT INTO SINO_DIC_BRAND  ( BRAND_TYPE_VALUE, BRAND_TYPE_NAME) values(?,?)',[rec.getValue("brandTypeValue"),rec.getValue("brandTypeName")]);
			}
		};
		
		/**
		/* ＆2.保存供应商到本地数据库
		**/
		dic.saveVendor2LocalDbExecute=function(tx){			
			//先删除表
			tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_VENDOR ');
			//再创建结构
			tx.executeSql('CREATE TABLE SINO_DIC_VENDOR  ( VENDOR_ID INTEGER PRIMARY KEY, VENDOR_NAME_ALT TEXT,ATTRIBUTE2 TEXT)');
			var nLen=toSaveRecords.getLength();
            var rec=null;
			for(var nn=1;nn<=nLen;nn++){
				rec=toSaveRecords.getNthRecord(nn);
				tx.executeSql('INSERT INTO SINO_DIC_VENDOR  ( VENDOR_ID, VENDOR_NAME_ALT,ATTRIBUTE2) values(?,?,?)',[rec.getValue("vendorId"),rec.getValue("vendorNameAlt"),rec.getValue("attribute2")]);
			}
		};
		/**
		/* ＆3.保存手机类型到本地数据库
		**/
		dic.savePhoneType2LocalDbExecute=function(tx){			
			//先删除表
			tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_PHONE_TYPE ');
			//再创建结构
			tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_PHONE_TYPE   ( PHONE_TYPE_VALUE TEXT PRIMARY KEY, PHONE_TYPE_NAME TEXT)');
			var nLen=toSaveRecords.getLength();
            var rec=null;
			for(var nn=1;nn<=nLen;nn++){
				rec=toSaveRecords.getNthRecord(nn);
				tx.executeSql('INSERT INTO SINO_DIC_PHONE_TYPE  ( PHONE_TYPE_VALUE, PHONE_TYPE_NAME) values(?,?)',[rec.getValue("stateCode"),rec.getValue("stateValue")]);
			}
		};
		/**
		/* ＆４.保存产品价格到本地数据库
		**/
		dic.savezPriceGroup2LocalDbExecute=function(tx){			
			//先删除表
			tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_PRICE_GROUP ');
			//再创建结构
			tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_PRICE_GROUP  ( STATE_CODE TEXT PRIMARY KEY, STATE_VALUE TEXT)');
			var nLen=toSaveRecords.getLength();
            var rec=null;
			for(var nn=1;nn<=nLen;nn++){
				rec=toSaveRecords.getNthRecord(nn);
				tx.executeSql('INSERT INTO SINO_DIC_PRICE_GROUP  ( STATE_CODE, STATE_VALUE) values(?,?)',[rec.getValue("stateCode"),rec.getValue("stateValue")]);
			}
		};
		/**
		/* ＆5. 保存供产品CPU到本地数据库
		**/
		dic.saveCpuGroup2LocalDbExecute=function(tx){			
			//先删除表
			tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_CPU_GROUP ');
			//再创建结构
			tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_CPU_GROUP    ( STATE_CODE TEXT PRIMARY KEY, STATE_VALUE TEXT)');
			var nLen=toSaveRecords.getLength();
            var rec=null;
			for(var nn=1;nn<=nLen;nn++){
				rec=toSaveRecords.getNthRecord(nn);
				tx.executeSql('INSERT INTO SINO_DIC_CPU_GROUP  ( STATE_CODE, STATE_VALUE) values(?,?)',[rec.getValue("stateCode"),rec.getValue("stateValue")]);
			}
		};
		/**
		/* ＆6.保存产品屏幕到本地数据库
		**/
		dic.saveScreenGroup2LocalDbExecute=function(tx){			
			//先删除表
			tx.executeSql('drop TABLE IF  EXISTS SINO_DIC_SCREEN_GROUP ');
			//再创建结构
			tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_DIC_SCREEN_GROUP ( STATE_CODE TEXT PRIMARY KEY, STATE_VALUE TEXT)');
			var nLen=toSaveRecords.getLength();
            var rec=null;
			for(var nn=1;nn<=nLen;nn++){
				rec=toSaveRecords.getNthRecord(nn);
				tx.executeSql('INSERT INTO SINO_DIC_SCREEN_GROUP (STATE_CODE, STATE_VALUE) values(?,?)',[rec.getValue("stateCode"),rec.getValue("stateValue")]);
			}
		};

		dic.save2DbError=function(error){
			sinoMobileUI.alert("保存"+dicAjaxCallProp.title+"到本地出错！"+error);
		};
		dic.saveNullCallSuccess=function(tx,result){		
			//空执行
		};


		
		dic.loadError=function (result, textStatus, errorThrown){
				$(".onLoad").hide();
				if (textStatus!=null&&textStatus == 'timeout') {
					sinoMobileUI.alert("下载"+dicAjaxCallProp.title+"，服务器连接超时.");
					return;
				}				
				var httpErrorCode=result.status;
				if(httpErrorCode==null||httpErrorCode==""||httpErrorCode=="undefined"){
					sinoMobileUI.alert("下载"+dicAjaxCallProp.title+"时服务器返回错误！");
				}else{
					httpErrorCode=httpErrorCode+"";					
					if(httpErrorCode=="403"){
						//session失效，重新登录
						sinoMobileUtil.autoLogin("");
					}else if(httpErrorCode=="404"){
						sinoMobileUI.alert("下载"+dicAjaxCallProp.title+"时，服务器没有响应，或访问地址不可用！"+textStatus);
					}else if(httpErrorCode=="200" ){						
						//sinoMobileUI.alert("内部错误：！");
					}else if(httpErrorCode=="401" ){
							util.autoLogin(util.getCurrent2RootRelateFullPath());
					}else{
						sinoMobileUI.alert("下载"+dicAjaxCallProp.title+"时，服务器返回错误！") ;
					}
				}
		}
	
		
		return dic;	
	}
 }