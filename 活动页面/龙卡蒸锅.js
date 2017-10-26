/* $Id : lefttime.js 4865 2007-01-31 14:04:10Z paulgao $ */

/* *
 * 给定一个剩余时间（s）动态显示一个剩余时间.
 * 当大于一天时。只显示还剩几天。小于一天时显示剩余多少小时，多少分钟，多少秒。秒数每秒减1 *
 */

// 初始化变量
var actionDate = 0;
var _GMTEndTime = 0;
var _GMTStartTime = 0;
var showTime = "leftTime";
var _day = 'day';
var _hour = 'hour';
var _minute = 'minute';
var _second = 'second';
var _end = 'end';
var _start = 'start';
var _prefix = '';

var cur_date = new Date();
var startTime = cur_date.getTime();
var Temp;
var timerID = null;
var timerRunning = false;

function showtime()
{
  now = new Date();
  var ts = parseInt((startTime - now.getTime()) / 1000) + actionDate;
  var dateLeft = 0;
  var hourLeft = 0;
  var minuteLeft = 0;
  var secondLeft = 0;
  var hourZero = '';
  var minuteZero = '';
  var secondZero = '';
  if (ts < 0)
  {
    ts = 0;
    CurHour = 0;
    CurMinute = 0;
    CurSecond = 0;
  }
  else
  {
    dateLeft = parseInt(ts / 86400);
    ts = ts - dateLeft * 86400;
    hourLeft = parseInt(ts / 3600);
    ts = ts - hourLeft * 3600;
    minuteLeft = parseInt(ts / 60);
    secondLeft = ts - minuteLeft * 60;
  }

  if (hourLeft < 10)
  {
    hourZero = '0';
  }
  if (minuteLeft < 10)
  {
    minuteZero = '0';
  }
  if (secondLeft < 10)
  {
    secondZero = '0';
  }


  if (dateLeft > 0)
  {
    Temp = dateLeft + _day + hourZero + hourLeft + _hour + minuteZero + minuteLeft + _minute + secondZero + secondLeft + _second;
  }
  else
  {
    if (hourLeft > 0)
    {
      Temp = hourLeft + _hour + minuteZero + minuteLeft + _minute + secondZero + secondLeft + _second;
    }
    else
    {
      if (minuteLeft > 0)
      {
        Temp = minuteLeft + _minute + secondZero + secondLeft + _second;
      }
      else
      {
        if (secondLeft > 0)
        {
          Temp = secondLeft + _second;
        }
        else
        {
          Temp = '';
        }
      }
    }
  }

  	//如果未开始
  //	if(_GMTStartTime > now_time)
  //	{
		//if (actionDate <= 0 || Temp == '')	//如果开始
	//	{
			// // if(wap_url == ''){
				// document.getElementById(showTime).innerHTML = "还剩"+goods_number+"件，马上购买";
		//		document.getElementById(showTime).parentNode.href="javascript:addToCart("+goods_id+", 'quk_buy');";	
	//		}else{
				document.getElementById(showTime).innerHTML = "去善融商城购买";
				document.getElementById(showTime).parentNode.href=wap_url;	
		//	}
			stopclock();
			return ;
		}
		//document.getElementById(showTime) && (document.getElementById(showTime).innerHTML = Temp+_prefix);
		
	//	timerID = setTimeout("showtime()", 1000);
	//	timerRunning = true;
  //	}
  	//如果进行中
//  	else if(_GMTStartTime < now_time && _GMTEndTime > now_time)
//  	{
//		if (actionDate <= 0 || Temp == '')  //如果结束
//		{
//			Temp = "已结束";
//			document.getElementById(showTime) && (document.getElementById(showTime).innerHTML = Temp);
//			document.getElementById(showTime).parentNode.href="javascript:;";
//			stopclock();
//		}
//		document.getElementById(showTime) && (document.getElementById(showTime).innerHTML = '马上购买');
//		
//		timerID = setTimeout("showtime()", 1000);
//		timerRunning = true;
//  	}
  	//如果已结束
//  	else if(_GMTEndTime < now_time)
//  	{
//		document.getElementById(showTime) && document.getElementById(showTime).innerHTML = Temp;
//		
//		timerID = setTimeout("showtime()", 1000);
//		timerRunning = true;
//  	}
}

var timerID = null;
var timerRunning = false;
function stopclock()
{
  if (timerRunning)
  {
    clearTimeout(timerID);
  }
  timerRunning = false;
}

function macauclock()
{
  stopclock();
  showtime();
}

function onload_leftTime(now_time)
{
  /* 第一次运行时初始化语言项目 */
  try
  {
    //_GMTEndTime = gmt_end_time;
    _GMTStartTime = gmt_start_time;
    
    // 剩余时间
    _day = day;
    _hour = hour;
    _minute = minute;
    _second = second;
    _end = end;
    _start = start;
    _prefix = pre;
  }
  catch (e){}
  
  //如果还未开始
	if(_GMTStartTime > now_time){
		if (_GMTStartTime > 0)
		{
			if (now_time == undefined)
			{
				var tmp_val_start = parseInt(_GMTStartTime) - parseInt(cur_date.getTime() / 1000 + cur_date.getTimezoneOffset() * 60);
			}
			else
			{
				var tmp_val_start = parseInt(_GMTStartTime) - now_time;
			}
			if (tmp_val_start > 0)
			{
				actionDate = tmp_val_start;
			}
		}
		macauclock();
	}
	//如果活动中
//	else if(_GMTStartTime < now_time && _GMTEndTime > now_time)
//	{
//		if (_GMTEndTime > 0)
//		{
//			if (now_time == undefined)
//			{
//				var tmp_val = parseInt(_GMTEndTime) - parseInt(cur_date.getTime() / 1000 + cur_date.getTimezoneOffset() * 60);
//			}
//			else
//			{
//				var tmp_val = parseInt(_GMTEndTime) - now_time;
//			}
//			if (tmp_val > 0)
//			{
//				actionDate = tmp_val;
//			}
//		}
//		macauclock();
//	}

  
  try
  {
    initprovcity();
  }
  catch (e)
  {
  }
}