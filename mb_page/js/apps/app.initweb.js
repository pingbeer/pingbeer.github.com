document.addEventListener("deviceready", onDeviceReady, false);

// 设置cordova加载完毕，才可以安全调用cordova方法
function onDeviceReady() {
    //checkConnection();
    document.addEventListener("backbutton", onBackKeyDown, false);
    onAppInit();
}

function quitApp() {
    navigator.app.exitApp();
}
// Handle the back button  手机回退按钮时，返回homepage
function onBackKeyDown() {
    var localurl = window.document.location.href;
    if (localurl.indexOf("login.html") > 0) {
        if (confirm("确定要退出吗？")) {
            quitApp();
        }
    } else if (localurl.indexOf("homepage.html") > 0) {
        gotoLogin();
    } else {
        gotoHomePage();
    }

}

//此函数作废
function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return(prePath + postPath);
}

//cordova初始化ready后调用onAppInit方法，此方法在应用界面可以重载
function onAppInit() {

}
function restoreBackButton() {
    document.removeEventListener("backbutton", onBackKeyDown, false);
}

var globalParameter = {
    LOGIN_VALID_URL: '/servlet/com.sino.app.sso.ssoLogin',
    MENU_LIST_URL: '/servlet/com.sino.app.getMainPage',
    PENDING_LIST_URL: '/servlet/com.sino.app.pending.getRcvInfo',
    BAOXIAO_TABS_URL: '/servlet/com.sino.app.bill.getPageList',
    UPLOAD_FILE_URL: '/servlet/com.sino.app.photo.uploadFile',
    createNew: function () {
        var pclass = {};

        return pclass;
    }
};

//滑动到页面底部触发callback事件
function initScroll(callback) {
    $(function () {
        $(window).scroll(function () {
            if (arrivedAtBottom()) {
                //...已到达最底部
                //alert('取下一页，pagenum='+glbPageNum) ;
                callback();
            }
            return '';
        });

        var arrivedAtBottom = function () {
            //alert("doc.top="+$(document).scrollTop() +" win.height="+ $(window).height()+" doc.height="+ $(document).height()) ;
            return $(document).scrollTop() + $(window).height() == $(document).height();
        }
    });
};

//设置div1左右滑动时触发事件
//在左右滑动触发事件的情况下，同时保证上下滑动的页面滚动，采用touchstart+touchmove控制，而不是采用网上写的touchstart+touchend
function setToLeftOrRight(div1, rightLCallback, leftRCallback) {
    // return;
    var nStartx, nStarty, nEndx, nEndy;
    var scrollFlag = false;
    var scrollTopVal = 0;
    var dist = 10;
    if (device.version <= '2.3') {
        // alert('min');
        dist = 50;
    }
    var obj = document.getElementById(div1);
    obj.addEventListener("touchmove", function (e) {
        if (!scrollFlag) {
            // $('#test').html("scrollFlag=false");
            return;
        }
        nEndx = e.targetTouches[0].pageX;
        nEndy = e.targetTouches[0].pageY;
        //$("#myMsg").html("dist-->"+dist +"-->"+(nEndx - nStartx));
        if (nEndx - nStartx > dist)   //向右滑动
        {
            if (leftRCallback != null) {
                // alert("向右滑动");
                //  $('#test').html($('#test').html()+"<BR>右:"+nStartx+"-->"+nEndx +"-->"+(nEndx - nStartx));
                scrollFlag = false;
                event.preventDefault();
                leftRCallback();
            }
        }
        else if (nStartx - nEndx > dist) //向左滑动
        {
            if (rightLCallback != null) {
                //  alert("向左滑动");
                //  $('#test').html($('#test').html()+"<BR>左:"+nStartx+"-->"+nEndx +"-->"+(nStartx - nEndx));
                scrollFlag = false;
                event.preventDefault();
                rightLCallback();

            }
        }
        /*else{
         //上下滑动
         var endY = (nStarty-nEndy);
         var obj1 = document.getElementById(div1);
         if(scrollTopVal==0){
         obj1.scrollTop((endY+100));
         }else{
         obj1.scrollTop(scrollTopVal+endY+100);
         }

         } */
    }, false);//false

    obj.addEventListener("touchstart",
        function (e) {
            scrollFlag = true;
            nStartx = e.targetTouches[0].pageX;
            nStarty = e.targetTouches[0].pageY;
        }, false);//false
    /*obj.addEventListener("touchend",
     function (e) {
     nEndx = e.changedTouches[0].pageX;
     nEndy = e.changedTouches[0].pageY;
     alert('end->'+(nEndx - nStartx ));
     //alert("touch end:" + nEndx + "," + nEndy+" move="+(nEndx-nStartx)+" dist="+dist);
     if (nEndx - nStartx > dist)   //向右滑动
     {
     //执行逻辑
     if (leftRCallback != null) {
     leftRCallback();
     event.preventDefault();
     }
     }
     else if (nStartx - nEndx > dist) //向左滑动
     {
     //执行逻辑
     if (rightLCallback != null) {
     rightLCallback();
     event.preventDefault();
     }
     }
     }, false);     */
}

//取页面url传入的参数值  ，如：http://XXXX/servlet1?param1=1&parm2=2进入页面时取parm1的值
function getParam(param) {
    var query = window.location.search.substring(1);
    var iLen = param.length + 1; //增加等号长度
    var iStart = query.indexOf(param + "=");

    if (iStart == -1) return "";
    var iEnd = query.indexOf("&", iStart + iLen);
    if (iEnd == -1) return query.substring(iStart + iLen);

    return query.substring(iStart + iLen, iEnd);
}

//ajax调用  ,p_ret_data:xml,html,json,text等
function runAjax(requrl, p_data, p_ret_data_type, callbackSuccess, callbackError) {
    runAjaxSyn(requrl, p_data, p_ret_data_type, true, callbackSuccess, callbackError);
}


function runAjaxSyn(requrl, p_data, p_ret_data_type, synFlag, callbackSuccess, callbackError) {
    // alert(requrl);
    var g_site = getWebSite();
    //g_site="http://192.168.1.151:8090";
    var url = g_site + requrl;//globalParameter.MENU_LIST_URL;
    //alert(url);
    //  var p_data={};  //客户端中文不转码，服务端需要req.setCharacterEncoding("UTF-8");
    //var p_data={"loginName":"zhouzijun","password":"a","test":encodeURIComponent("周子君")};
    var retdatatype = 'json';
    if (p_ret_data_type != null) {
        retdatatype = p_ret_data_type;
    }
    //alert('ajax begin...');
    var ajaxreq =
        $.ajax({
            type: "POST",
            url: url,
            timeout: 5000, //超时时间设置，单位毫秒
            // async: synFlag,  //false:非异步加载，等到ajax执行完毕,才接着执行下面的语句
            //contentType: "application/x-www-form-urlencoded:charset=utf-8",     //post方式，加此参数后，服务器取不到值
            data: p_data,
            dataType: retdatatype,
            success: function (msg) {
                //alert('success');
                ajaxreq.abort();
                var tmpstr = msg.toString();
                if (tmpstr.indexOf("重新登录") > 0) {
                    alert("用户session失效，请重新登录！");
                    gotoLogin();
                } else {
                    if (callbackSuccess != null) {
                        callbackSuccess(msg);
                    }
                }
                return;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                ajaxreq.abort();
                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                    alert("服务器连接超时，URL=" + url);
                    return;
                } else if (textStatus.indexOf('error') == 0) {
                    if (callbackError != null) {
                        callbackError(XMLHttpRequest);
                    } else {
                        alert("服务器取数失败(url=" + url + ")，错误信息:" + errorThrown);
                    }
                    return;
                } else {
                    var s = XMLHttpRequest.responseText;
                    if (s.indexOf("重新登录") > 0) {
                        alert("用户session失效，请重新登录！");
                        gotoLogin();
                    } else {
                        if (callbackError != null) {
                            callbackError();
                        } else {
                            alert(textStatus + ":" + errorThrown);
                        }
                    }
                    return;
                }
            }
        });
}

function getWebSite() {
    return window.localStorage.getItem("website");
}
function getLoginName() {
    return window.localStorage.getItem("user.loginname");
}

//禁用Enter键表单自动提交
function EnterKeyNoSubmit(event) {
    /* if( event.keyCode == 13 )
     {
     return false;
     }
     return true;*/
    var target, code, tag;
    if (!event) {
        event = window.event; //针对ie浏览器
        target = event.srcElement;
        code = event.keyCode;
        if (code == 13) {
            tag = target.tagName;
            if (tag == "TEXTAREA") {
                return true;
            }
            else {
                return false;
            }
        }
    }
    else {
        target = event.target; //针对遵循w3c标准的浏览器，如Firefox
        code = event.keyCode;
        if (code == 13) {
            tag = target.tagName;
            if (tag == "TEXTAREA") {
                return true;
            }
            else {               //INPUT
                return false;
            }
        }
    }
}