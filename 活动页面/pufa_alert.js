    document.writeln('<script language="javascript" src="js/index.js">');
    document.writeln('</scr' + 'ipt>');
!function() {// 全局提示
  "use strict";
  var tempArr = {
    ok:"确认",
    cancel:"取消",
    message:'自定义信息',
    buttonN:true,
    timeOut:true,
    callback:null
  },bol = false,alt = {
    ap : function(obj) {
      tempArr = $.extend(tempArr, obj);
      $("body").append(alt.m());
    },
    c : function() {
      $(".toShowContainer").remove();
    },
    ok : function() {
      (typeof tempArr.callback === "function") ?alt.oc(): alt.c();
    },
    m : function() {
      var append = '<div class="toShowContainer"><div class="toShowAlert" onclick="lcyh_.c()"></div>';
        append += tempArr.timeOut?'<div class="window-box" >':'<div class="window-box" style="height:80px" >';
        append += '<div class="window-box-contain">' + tempArr.message + '</div><ul>';
        append += tempArr.timeOut?alt.li():'';
        append += '</ul></div></div>';
      return append;
    },
    oc:function(){
      alt.c();
      tempArr.callback();
    },
    li:function(){
      return tempArr.buttonN?'<li class="submit" onclick="lcyh_.ok()" style="width: 100%" >'+ tempArr.ok +'</li>':'<li class="submit" onclick="lcyh_.ok()">'+ tempArr.ok +'</li><li onclick="lcyh_.c()">'+ tempArr.cancel +'</li>';
    },
    to:function(obj){
      tempArr = $.extend(tempArr, obj);
      tempArr.timeOut=false;
      $("body").append(alt.m());
      setTimeout(function() {
        alt.c();
      }, 2500)
    }
  }
  window.lcyh_ = alt;
}();