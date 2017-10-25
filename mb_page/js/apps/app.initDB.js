var sqliteDb={
    createNew:function(){
        var sqlitedb={};
        var DBVersion='3.14';   //应用数据库的版本，用于今后更新sqllite表结构

        sqlitedb.getDB=function(){
            // alert(1);
            //var db = window.sqlitePlugin.openDatabase({name: "sinoFlowDB", bgType: 1});//("sinoFlow", "1.0", "SinoFlow DB", 1000000); //1000000 bytes
            var db = openDatabase('sinoFlowDB2','1.0','My Database',1024*1000);
            // alert(2);
            if(db==null)
                alert('db is not open');
            return db;
        };
        sqlitedb.closeDb=function(db){
            // if(db!=null)
            //     db.close();
        };
        sqlitedb.getDBVersion=function(){
            return DBVersion;
        };
        return sqlitedb;
    }
};

var sinoAppConfigInsert={
    createNew:function(){
        //  alert('sinoAppConfigInsert');
        var configInsert=sqliteDb.createNew();
        var db;
        configInsert.insertData=function(){
            db=configInsert.getDB();
            db.transaction(configInsert.insertDataTrans,configInsert.init_checkDBTransError,configInsert.init_checkDBTransSuccess);
        };
        configInsert.insertDataTrans=function (tx){
            tx.executeSql("INSERT INTO SINO_CONFIG (PAR_NAME,PAR_VALUE) VALUES ('DB_VERSION','"+configInsert.getDBVersion()+"')",[]);
        }
        configInsert.updateData=function(){
            //  alert('update');
            db=configInsert.getDB();
            db.transaction(configInsert.updateDataTrans,configInsert.init_checkDBTransError,configInsert.init_checkDBTransSuccess);
        };
        configInsert.updateDataTrans=function (tx){
            var sql="UPDATE SINO_CONFIG SET PAR_VALUE='"+configInsert.getDBVersion()+"'  WHERE PAR_NAME='DB_VERSION'";
            tx.executeSql(sql,[]);
        }
        configInsert.init_checkDBTransSuccess=function() {
            // alert("init_checkDBTrans Success");
            configInsert.closeDb(db);
        };
        configInsert.init_checkDBTransError=function(err) {
            alert("Error init_checkDBTrans Error: " + JSON.stringify(err));
            configInsert.closeDb(db);
        }
        return  configInsert;
    }
};
var sinoAppConfigCheck={
    createNew:function(){
        // alert('sinoAppConfigCheck');
        var configCheck=sqliteDb.createNew();
        var db;
        configCheck.init=function(){
            db=configCheck.getDB();
            // alert('check1');
            // current_db_version='1';
            db.transaction(configCheck.init_checkDB);//, configCheck.init_checkDBTransError, configCheck.init_checkDBTransSuccess);
            // db.executeSql("SELECT PAR_VALUE from SINO_CONFIG WHERE PAR_NAME='DB_VERSION'", [], configCheck.init_checkDBSuccess, configCheck.init_checkDBError);
            //alert('ok');
        } ;
        configCheck.init_checkDB=function(tx) {
            //  alert(' configCheck.init_checkDB');
            tx.executeSql("SELECT PAR_VALUE FROM SINO_CONFIG WHERE PAR_NAME='DB_VERSION'", [], configCheck.init_checkDBSuccess, configCheck.init_checkDBError);
            //tx.executeSql("SELECT * FROM sqlite_master", [], this.init_checkDBSuccess, this.init_checkDBError);
            //results=tx.executeSql("SELECT * FROM SINO_CONFIG");
            // alert(results);
            // var len = results.rows.length;
            // alert('init_checkDBSuccess rownum='+len);
        };

        configCheck.init_checkDBSuccess=function(tx,rs) {

            //  alert('check success!') ;
            var  results=rs;
            // alert(JSON.stringify(results));

            if(results==null) {
                //    alert('result is null!');
                configCheck.closeDb(db);
                return;
            }

            var len = results.rows.length;
            //  alert("result len="+len);
            if(len==0){
                configCheck.closeDb(db);
                var configinsert=sinoAppConfigInsert.createNew();
                configinsert.insertData();
            }else{
                //alert(JSON.stringify(results));
                var db_version = results.rows.item(len-1).PAR_VALUE ;//取最后一条记录
                var currentDBVersion=  configCheck.getDBVersion()
                configCheck.closeDb(db);

                //alert(db_version+"<--->"+currentDBVersion);
                if(db_version<currentDBVersion) {
                    var configUpdate=sinoAppConfigInsert.createNew();
                    //alert('call update');
                    configUpdate.updateData();
                }

            }
        };
        configCheck.init_checkDBError=function(tx,err) {
            configCheck.closeDb(db);
            alert('err');
            alert("init_checkDBError processing SQL: " + JSON.stringify(err));

        };

        configCheck.init_checkDBTransSuccess=function() {
            //        alert("init_checkDBTrans Success");
            configCheck.closeDb(db);
        };
        configCheck.init_checkDBTransError=function(err) {
            alert("Error init_checkDBTrans Error: " + JSON.stringify(err));
            configCheck.closeDb(db);
        }
        return configCheck;
    }
};

var sinoAppDbInit = {
    createNew:function(){
        var sinodb=sqliteDb.createNew();
        var db;
        var dropFlag=false;
        var callbackFun;
        sinodb.init=function(p_dropFlag,callback){
            dropFlag=p_dropFlag;
            callbackFun=callback;
            db=sinodb.getDB();
            db.transaction(sinodb.init_createTable, sinodb.init_createTableError, sinodb.init_createTableSuccess);
        };
        sinodb.init_createTable=function (tx) {
            // alert('create table-->dropflag='+dropFlag);
            if(dropFlag)
            {
                var sql= "DROP TABLE SINO_CONFIG IF EXISTS";
                tx.executeSql(sql);
            }
            tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_CONFIG (id  INTEGER PRIMARY KEY, PAR_NAME TEXT,PAR_VALUE TEXT)');
            //  sql="DROP TABLE SINO_SERVER_INFO IF EXISTS";
            //   tx.executeSql(sql);
            tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_SERVER_INFO ( id INTEGER PRIMARY KEY, SERVER_NAME TEXT,WEB_SITE TEXT,PRIMARY_FLAG TEXT)');

            tx.executeSql('CREATE TABLE IF NOT EXISTS SINO_CURRENT_SESSION ( SERVER_ID INTEGER ,LOGIN_NAME TEXT ,PASSWORD TEXT,UUID TEXT,SESSION_ID TEXT)');
        };
        sinodb.init_createTableError=function (err) {
            alert("建表失败: " + JSON.stringify(err));
            sinodb.closeDb(db);
        };
        sinodb.init_createTableSuccess=function() {
            //  alert("建表success");
            sinodb.closeDb(db);
            callbackFun();
            //   alert('sinoAppConfigCheck')  ;
            var configCheck= sinoAppConfigCheck.createNew();
            //      alert('sinoAppConfigCheck.init');
            configCheck.init();

        }
        return sinodb;
    }
};

var userInfo={
    createNew:function(){
        var user=sqliteDb.createNew();
        var db;
        var callbackFun;
        var loginname="";
        var pwd="";
        var uuid="";
        var id="";
        var sid="";
        user.setParameter=function(id1,name,pwd1,uuid1,sid1){
            loginname=name;
            pwd=pwd1;
            uuid=uuid1;
            id=id1;
            sid=sid1;
        }
        user.saveSession=function(callback){
            db=user.getDB();
            callbackFun=callback;
            db.transaction(user.save,user.saveError,user.saveSuccess);
        },
            user.save=function(tx) {
                tx.executeSql("DELETE FROM SINO_CURRENT_SESSION",[]);
                tx.executeSql("INSERT INTO SINO_CURRENT_SESSION( SERVER_ID  ,LOGIN_NAME  ,PASSWORD ,UUID ,SESSION_ID )VALUES(?,?,?,?,?)",
                    [id,loginname,pwd,uuid,sid]);
            } ,
            user.saveSuccess=function() {
                // alert("init_checkDBTrans Success");
                user.closeDb(db);
                callbackFun();
            };
        user.saveError=function(err) {
            alert("Error init_checkDBTrans Error: " + JSON.stringify(err));
            user.closeDb(db);
        }
        return user;
    }
};