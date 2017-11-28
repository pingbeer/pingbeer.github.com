(function () {
    //工具
    var util = window.util = {
        //解析文件名
        setOrderData: function (file_name) {
            //用于返回的对象
            var file_data = {};
            var new_file_name = file_name.replace(/(厘米|公分|cm|CM)/g, "");
            var ary = new_file_name.match(/([\d\.]+[-x_X\*\s\+]{1,5}){3}/g);
            if (!ary) {
                ary = new_file_name.match(/([\d\.]+[-x_X\*\s\+]{1,5}){2}([\d\.]+)/g);
            }
            if (!ary) {
                ary = new_file_name.match(/([\d\.]+[-x_X\*\s\+]{1,5}){2}/g);
            }
            if (!ary) {
                ary = new_file_name.match(/([\d\.]+[-x_X\*\s\+]{1,5}[\d\.]+)/g);
            }
            if (ary) {
                var str = ary.toString().replace(/[-x_X\*\s\+]{1,5}/g, "-");
                ary = str.split('-');
                file_data.name = file_name;
                file_data.length = accounting.formatNumber((ary[0] *0.01),2,"");
                file_data.width = accounting.formatNumber(((ary[1] *0.01)),2,"");
                if (ary[2]) {
                    file_data.number = ary[2];
                }
                else {
                    file_data.number = 1;
                }
                return file_data;
            }
            // alert('暂未获取到匹配的数据');
        },
        // 判断年份是否为润年 @param {Number} year
        isLeapYear: function (year) {
            return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
        },
        //获取某一年份的某一月份的天数 @param {Number} year @param {Number} month
        getMonthDays: function (year, month) {
            return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (this.isLeapYear(year) ? 29 : 28);
        },
        //校验手机号
        checkPhone: function (phone) {
            var myreg = /^1[34578]\d{9}$/;
            // var myreg = /^(((13[0-9]{1})|(17[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;


            // if (!myreg.test(phone)) {
            //     return false;
            // } else {
            //     return true;
            // }
            //暂时去掉手机格式验证
            if(phone.length==11){
                return true;
            }else{
                return false;
            }
        },
        //校验密码 目前仅为长度校验
        checkPwd: function (pwd) {
            var pa = /^(\w){6,20}$/;
            if (!pa.test(pwd)) {
                return false;
            } else {
                return true;
            }
        }


    }
})();
Date.prototype.Format=function(fmt){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S":this.getMilliseconds()};if(/(y+)/.test(fmt))fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));for(var k in o)if(new RegExp("("+k+")").test(fmt))fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));return fmt};var orderUtil={dateConfig:[{key:"ld30",show:"全部时间段"},{key:"zt00",show:"昨天"},{key:"dt00",show:"今天"},{key:"pm00",show:"上月"},{key:"tm1",show:"本月"},{key:"ty0103",show:"第一季度"},{key:"ty0406",show:"第二季度"},{key:"ty0709",show:"第三季度"},{key:"ty1012",show:"第四季度"},{key:"ty0106",show:"上半年"},{key:"ty0712",show:"下半年"},{key:"ty0112",show:"今年"},{key:"ly0112",show:"去年"},{key:"ly0106",show:"去年上半年"},{key:"ly0712",show:"去年下半年"}],dpDateCompute:function(code,num){var nowDate=new Date;var beforeDate=null;var year=null;var beforeMonth=null;var prefix=null;var suffix=null;switch(code){case"ld":var dayNumMS=86400*1000*num;var beforeDateMS=nowDate.getTime()-dayNumMS;beforeDate="";nowDate="";break;case"dt":beforeDate=new Date().Format("yyyy-MM-dd");nowDate=new Date().Format("yyyy-MM-dd");break;case"pm":beforeDate=getPreMonth(0);nowDate=getPreMonth(1);break;case"zt":var day1=new Date();day1.setTime(day1.getTime()-24*60*60*1000);beforeMonth=day1.getMonth()+1;if(beforeMonth<10){beforeMonth="0"+beforeMonth};var s1=day1.getFullYear()+"-"+beforeMonth+"-"+day1.getDate();beforeDate=s1;nowDate=s1;break;case"tm":year=nowDate.getFullYear();beforeMonth=nowDate.getMonth()+1;if(beforeMonth<10){beforeMonth="0"+beforeMonth};beforeDate=year+"-"+beforeMonth+"-01";var day=new Date(year,beforeMonth,0);nowDate=year+'-'+beforeMonth+'-'+day.getDate();break;case"lm":year=nowDate.getFullYear();var month=nowDate.getMonth();beforeMonth=nowDate.getMonth()+1-num;beforeDate=year+"-"+beforeMonth+"-01";nowDate=year+"-"+month+"-"+window.util.getMonthDays(year,month-1);break;case"ty":prefix=num.substring(0,2);suffix=num.substring(2,4);year=nowDate.getFullYear();beforeDate=year+"-"+prefix+"-01";nowDate=year+"-"+suffix+"-"+window.util.getMonthDays(year,suffix-1);break;case"ly":prefix=num.substring(0,2);suffix=num.substring(2,4);year=nowDate.getFullYear()-1;beforeDate=year+"-"+prefix+"-01";nowDate=year+"-"+suffix+"-"+window.util.getMonthDays(year,suffix-1);break}var callback={beforeDate:beforeDate,nowDate:nowDate};return callback}};function getPreMonth(type){var arr=new Date().Format("yyyy-MM-dd").split('-');var year=arr[0];var month=arr[1];var day=arr[2];var days=new Date(year,month,0);days=days.getDate();var year2=year;var month2=parseInt(month)-1;if(month2==0){year2=parseInt(year2)-1;month2=12}var day2=day;var days2=new Date(year2,month2,0);days2=days2.getDate();if(month2<10){month2='0'+month2}var t2="";if(type==0){t2=year2+'-'+month2+'-'+"01"}else{t2=year2+'-'+month2+'-'+days2}return t2}
