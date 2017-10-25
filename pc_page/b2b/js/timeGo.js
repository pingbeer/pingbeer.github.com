// 基于JQ的倒计时插件
// 创建一个闭包     
(function($){     
  //插件主要内容     
  $.fn.timeGo = function(options) {        
    var opts = $.extend({},$.fn.timeGo.defaults, options);         
    return this.each(function() { 													
      $this = $(this); 
      var sysSecond,interValObj;
	  var $mainSeconds=$(opts.mainSeconds,$this);
	  var $mainTime=$(opts.mainTimeShow,$this);
	  var $message=$(opts.message,$this);
	  var callBackFunction=opts.callBackFunction;
      sysSecond = parseInt($mainSeconds.html());
	  interValObj = window.setInterval(setRemainTime, 1000);
	  function setRemainTime()
	  {
         if (sysSecond > 0)
		 {
           sysSecond = sysSecond - 1;
           var second = Math.floor(sysSecond % 60);             // 计算秒
           var minite = Math.floor((sysSecond/60) % 60);      //计算分
           var hour = Math.floor((sysSecond / 3600) % 24);      //计算小时
           var day = Math.floor((sysSecond / 3600) / 24);        //计算天
           if (second>=0&&second<10) {second="0"+second};
           if (day>=0&&day<10) {day="0"+day};
           if (hour>=0&&hour<10) {hour="0"+hour};
           if (minite>=0&&minite<10) {minite="0"+minite};
           //$mainTime.html("<span class='hour'>" + hour + "小时</span><span class='mini'>" + minite + "分</span><span class='sec'>" + second + "秒</span>");
		   $mainTime.html("<span class='day'>" + day + "</span>天<span class='hour'>" + hour + "</span>小时<span class='mini'>" + minite + "</span>分<span class='sec'>" + second + "</span>秒");
          }
		  else if (sysSecond == -1){}
		  else
		   {//剩余时间小于或等于0的时候，就停止间隔函数
             window.clearInterval(interValObj);
			 if(typeof callBackFunction == "function")callBackFunction($this,$message);
           }
      }
    }); 
  };
   //插件主要内容结束
    
  // 插件的defaults     
  $.fn.timeGo.defaults = {
	  mainSeconds:".reSeconds",//剩余时间获取对象
	  mainTimeShow:".reTime",//时间显示区域对象
	  message:'.reMsg',//时间结束后的信息显示对象
	  callBackFunction:''
  };     
// 闭包结束     
})(jQuery); 