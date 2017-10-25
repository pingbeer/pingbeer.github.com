var appSetupList = {
    createNew:function() {
        var applist = sqliteDb.createNew();
        var db;
        var id=null;
        var callbackFun;
        applist.getServerLists = function(id1,callback) {
            db = applist.getDB();
            id=id1;
            callbackFun=callback;
            db.transaction(applist.getServerListsQuery);
        };
        applist.getServerListsQuery = function(tx) {
            var sql= "SELECT id , SERVER_NAME, WEB_SITE ,PRIMARY_FLAG FROM SINO_SERVER_INFO ";
            if(id!=null){
                sql=sql+" where id="+id;
            }
            tx.executeSql(sql, [], applist.getSuccess, applist.getError);
        };
        applist.getSuccess = function(tx,results) {
           // alert('success111!');
            if(results==null) {
                alert('rs is null') ;
                return;
            }
           //  alert( JSON.stringify(results));

            var len = results.rows.length;
            var rs=results;
            if (len == 0) {
                rs = null;
            }

            callbackFun(rs);

            /*if(id!=null) {
                initForm(rs);
            }else{
                updateLists(rs);
            } */
            applist.closeDb(db);

        };
        applist.getError = function (tx,err) {
            alert("查询失败: " );
            alert(JSON.stringify(err));
            applist.closeDb(db);
        };
        return applist;
    }
};

var appSetupSave = {
    createNew:function() {
        var appsave = sqliteDb.createNew();
        var db;
        var callbackfun;
        appsave.saveServerInfo = function(callback) {
            db = appsave.getDB(); //1000000 bytes
            callbackfun=callback;
            db.transaction(appsave.app_saveServerInfo, appsave.errorFunTrans,appsave.successFunTrans);// );
        };
        appsave.app_saveServerInfo = function(tx) {
            var servername = "";
            var website = "";
            var primaryFlag = "N";
            var id = $("#id").val();
            servername = $("#servername").val();
            website = $("#website").val();
            primaryFlag =$("#primaryFlag").val() ;
            if(primaryFlag!='Y')
                primaryFlag='N';

            var args;
            if (id =='') {
                sql = "INSERT INTO SINO_SERVER_INFO ( SERVER_NAME,WEB_SITE,PRIMARY_FLAG) VALUES (?,?,?)";
                args= [servername,website,primaryFlag];//, appsave.successFun,appsave.errorFun);
            } else {
                sql = "UPDATE SINO_SERVER_INFO SET SERVER_NAME=?,WEB_SITE=?,PRIMARY_FLAG=? WHERE id=?";
                args= [servername,website,primaryFlag,id];//, appsave.successFun,appsave.errorFun);
            }
            tx.executeSql(sql,args);
        };
        /*appsave.successFun = function(tx,rs){
            alert('保存成功！');
            appsave.closeDb(db);
            callbackfun();
        };
        appsave.errorFun = function(tx,err) {
            alert('保存失败！');
            appsave.closeDb(db);
            alert('保存失败！' + err.code);
        };*/

        appsave.errorFunTrans=function (err) {
             alert("trans 失败: " + JSON.stringify(err));
            appsave.closeDb(db);
         };
        appsave.successFunTrans=function() {
            alert("保存成功！");
            appsave.closeDb(db);
            callbackfun();
         } ;

        return appsave;
    }
};




