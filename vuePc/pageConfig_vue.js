// 计价单位
var priceUnitAll=[
    {
        priceUnit: "01",
        priceUnitDesc: "平方米"
    }, {
        priceUnit: "02",
        priceUnitDesc: "个"
    }, {
        priceUnit: "03",
        priceUnitDesc: "米"
    }, {
        priceUnit: "04",
        priceUnitDesc: "套"
    }, {
        priceUnit: "05",
        priceUnitDesc: "页"
    }, {
        priceUnit: "06",
        priceUnitDesc: "本"
    }, {
        priceUnit: "07",
        priceUnitDesc: "条"
    }, {
        priceUnit: "08",
        priceUnitDesc: "张"
    }, {
        priceUnit: "09",
        priceUnitDesc: "块"
    }, {
        priceUnit: "10",
        priceUnitDesc: "包"
    }, {
        priceUnit: "11",
        priceUnitDesc: "支"
    }, {
        priceUnit: "12",
        priceUnitDesc: "箱"
    }, {
        priceUnit: "13",
        priceUnitDesc: "份"
    }, {
        priceUnit: "14",
        priceUnitDesc: "盒"
    }, {
        priceUnit: "15",
        priceUnitDesc: "面"
    }, {
        priceUnit: "16",
        priceUnitDesc: "卷"
    }, {
        priceUnit: "17",
        priceUnitDesc: "袋"
    }, {
        priceUnit: "18",
        priceUnitDesc: "打"
    }, {
        priceUnit: "19",
        priceUnitDesc: "把"
    }, {
        priceUnit: "20",
        priceUnitDesc: "册"
    }, {
        priceUnit: "21",
        priceUnitDesc: "公斤"
    }, {
        priceUnit: "22",
        priceUnitDesc: "斤"
    }, {
        priceUnit: "23",
        priceUnitDesc: "瓶"
    }, {
        priceUnit: "24",
        priceUnitDesc: "根"
    }, {
        priceUnit: "25",
        priceUnitDesc: "次"
    }, {
        priceUnit: "26",
        priceUnitDesc: "辆"
    }, {
        priceUnit: "27",
        priceUnitDesc: "对"
    }, {
        priceUnit: "28",
        priceUnitDesc: "盆"
    }, {
        priceUnit: "29",
        priceUnitDesc: "束"
    }];

//计价方式
var priceWayAll=[
    {
        priceWay: "01",
        priceWayDesc: "按面积"
    }, {
        priceWay: "02",
        priceWayDesc: "按数量"
    }, {
        priceWay: "03",
        priceWayDesc: "按长度"
    }, {
        priceWay: "04",
        priceWayDesc: "按宽度"
    }, {
        priceWay: "05",
        priceWayDesc: "按较大值"
    }, {
        priceWay: "06",
        priceWayDesc: "较大值平方"
    },{
        priceWay: "07",
        priceWayDesc: "按周长"
    }];
// 全局配置每个页面配置数据 可在其他页面共享
// 如提示语 某些具体的css 某些js文件加载 配置方式和解析方式 自行处理
// salesRowInit 只作为参考标准
var globeConfigData = {
    salesData : "",
    salesRowInit:{
        "businessDesc": "",
        "businessType": "00",
        "length": "",
        "width": "",
        "priceWay": "01",
        "priceWayDesc": "按面积",
        "quantity": "",
        "requirements": "",
        "totalPrice": "",
        "unit": "",
        "unitPrice": ""

    },
    billList:[
        {
            id: "1",
            text: "增值税普通发票"
        }, {
            id: "2",
            text: "增值税专用发票"
        }],
    recpayAccountList:[
        {
            id: "现金",
            text: "现金"
        }, {
            id: "微信钱包",
            text: "微信钱包"
        }, {
            id: "支付宝",
            text: "支付宝"
        }, {
            id: "工商银行",
            text: "工商银行"
        }, {
            id: "建设银行",
            text: "建设银行"
        }, {
            id: "中国银行",
            text: "中国银行"
        }, {
            id: "农业银行",
            text: "农业银行"
        }, {
            id: "其他系统转移",
            text: "其他系统转移"
        }, {
            id: "预存款账户",
            text: "预存款账户"
        },  {
            id: "其他",
            text: "其他"
        }],
    orderData : ""
};

// 点击文本框可以自动选中内容
if(window.jQuery) {
    $(function () {
        $("body").on("click","input[data-s='select']",function(){
            $(this).select();
        })

    });

    (function ($) {
        $["mytoast"] = function(options){
            var defaults = {text: "", type: "success",time:2000,cls:""};
            var settings = $.extend( {}, defaults, options );
            var jq_toast = $("<div class='tips_contants' ></div>");
            jq_toast.html(settings.text);
            jq_toast.attr("style",settings.cls);
            jq_toast.addClass("dialog-fade-enter-active");
            jq_toast.appendTo($("body")).stop().fadeIn(500).delay(settings.time).fadeOut(500);
            var _jq_toast=jq_toast;
            setTimeout(function (){
                _jq_toast.remove();
            }, 10*1000);
        };
    }( jQuery ));
}

var makeProcessType=window.makeProcessType || {};
var getRequestParam={};
getRequestParam.GetRequest=function(){
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
makeProcessType=[
    {
        id: "01",
        text: "制作中"
    }, {
        id: "02",
        text: "已完工"
    }];
var wkListType=window.wkListType || {};
    wkListType=[
     {
        id: "01",
        text: "写真打印"
    }, {
        id: "09",
        text: "户外打印"
    }, {
        id: "02",
        text: "写真后道"
    },
    {
        id: "03",
        text: "喷绘打印"
    }, {
        id: "04",
        text: "喷绘后道"
    },
    {
        id: "05",
        text: "UV打印"
    }, {
        id: "06",
        text: "条幅打印"
    }, {
        id: "07",
        text: "条幅后道"
    }, {
        id: "08",
        text: "后道加工"
    }];
// window.__widgetYdz = function(w){
    // var version="?v=07312136";//pageConfig
    // var widgets = {
    //     'jquery': "/resources/jquery/jquery-2.1.3.js",
    //     'easyui': "/resources/easyui/jquery.easyui.min.js",
    //     'easyui/lang': "/resources/easyui/locale/easyui-lang-zh_CN.js",
    //     'bootstrap': "/resources/bootstrap/js/bootstrap.min.js",
    //     'bootstrap/datetimepicker': "/resources/bootstrap/bootstrap-datetimepicker.js",
    //     'bootstrap/zh': "/resources/bootstrap/locales/bootstrap-datetimepicker.zh-CN.js",
    //     'base/new': "/resources/business/base_new.js",
    //     'css/bootstrap': "/resources/bootstrap/css/bootstrap.min.css",
    //     'css/easyui': "/resources/easyui/themes/bootstrap/easyui.css",
    //     'css/base': "/resources/new/base_new.css",
    //     'sales/order/add': "/resources/business/dzorder/sales-order/add.js",
    //     'sales/order/list': "/resources/business/advert/sales-order/order-list.js"
    // };
    // if(!w) {
    //     //主要用于seajs 映射
    //     var maps = [];
    //     for(var m in widgets) {
    //         var mp = widgets[m];
    //         if(typeof mp != 'string') continue;
    //         maps.push([m, 'js/' + mp]);
    //     }
    //     return maps;
    // }
    // if(widgets[w]){
    //     return widgets[w]+version;
    // }else{
    //     return w+version;
    // }
    // return widgets[w]||w;
// }