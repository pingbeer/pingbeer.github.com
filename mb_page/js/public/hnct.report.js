/**
*  Module: report
*  Author: qyj
*  Create Time:
*  Last Modify Time: 
 *******************************
 * 发现排行
 * */

var ReportClass={
	createNew:function(){
		var report={};
		var ajaxJsonProp={
            //servlet访问接口
            servlet:'',
            //操作参数 act
            act:'',
            //提交服务器参数
            parmData:'',
            //执行成功后的回调函数
            successCallbackFunc:null
        };
		// 处理错误日志
        report.loadError=function (result, textStatus, errorThrown){
			sinoShopping.setUIButtonDisabledStatus(false);
			$(".onLoad").hide();
			
            if (textStatus!=null) {
					if (textStatus == 'timeout') {
						sinoMobileUI.alert("服务器连接超时.");
						return;
					}else if(textStatus == 'parsererror'){
						sinoMobileUI.alert("服务器处理发生错误，返回数据解析失败.");
						return;
					}
			}	

            var httpErrorCode=result.status;
            if(httpErrorCode==null||httpErrorCode==""||httpErrorCode=="undefined"){
                sinoMobileUI.alert("服务器返回错误，操作不能继续！");
            }else{
                httpErrorCode=httpErrorCode+"";
                if(httpErrorCode=="403"){
                    //session失效，重新登录
                    sinoMobileUtil.autoLogin(sinoMobileUtil.getCurrent2RootRelateFullPath());
                }else if(httpErrorCode=="404"){
                    //sinoMobileUtil.autoLogin(sinoMobileUtil.getCurrent2RootRelateFullPath());
                    sinoMobileUI.alert("服务器没有响应，或访问地址不可用！");
                }else if(httpErrorCode=="200" ){						
						//sinoMobileUI.alert("内部错误：！");
				}else if(httpErrorCode=="401" ){
						util.autoLogin(util.getCurrent2RootRelateFullPath());
				}else{
                    sinoMobileUI.alert("服务器返回错误，操作不能继续！") ;
                }
            }
        }
		
		report.goCityOrderDetailPage=function(IoId){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href="top_order_qty_left_detail.html?IoId="+IoId;	
		}
		report.goCityOrderListPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href="dhh_top_order_qty_left.html";	
		}
		report.goMobileOrderListPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href="dhh_top_order_qty.html";	
		}
		report.goChannelOrderListPage=function(){
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href="dhh_top_channel_left.html";	
		}
		//从后台调用数据的总入口
        report.loadDataFromServer=function(){
            var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
            sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,report.loadError);
        };
        
        //1.地市排行榜
		report.loadCityOrderListByServer=function() {
			var parm = '{}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_REPORT;
            ajaxJsonProp.act="DHH_TOP_ORDER_QTY_LEFT";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=report.loadCityOrderListByServerSuccess;
            report.loadDataFromServer();
		}
        report.loadCityOrderListByServerSuccess = function (data) {
             if (data.code + "" == "1") {
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_FIND_CITYORDER_LIST,sinoMobileUtil.getJsonStringFromResponseData(data,"reportData"));
				report.loadCityOrderListBySession();
            } else {
                sinoMobileUI.alert("加载银联出现错误！" + data.msg);
            }
        }
        report.loadCityOrderListBySession=function() {
			 var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_FIND_CITYORDER_LIST);
			var	 datalist=$.parseJSON(datas);
			var templateHtml=$("#template").html();
			var sb=new Array();
			var currQuantity=0,quantity=0,k=0;
			for(var i=0;i<datalist.length;i++) {
				var obj=datalist[i];
				quantity+=parseInt(obj.quantity);
				currQuantity+=parseInt(obj.currQuantity);
				var rec=new Record();
				k++;
				rec.addField("no",k);
				rec.addField("companyName",obj.companyName);
				rec.addField("organizationId",obj.organizationId);
				rec.addField("currQuantity",obj.currQuantity);
				rec.addField("quantity",obj.quantity);
				rec.addField("totalQuantity",obj.totalQuantity);
				rec.addField("totalCurrQuantity",obj.totalCurrQuantity);
				var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,rec);
				sb.push(html);
			}
			sb.push(' <li><span>合计</span><span>--</span><span>'+currQuantity+'</span><span>'+quantity+'</span><span></span></li>');
			var content=$("#content");
			content.html(sb.join(''));	
		}
		/**
		* 2.地市排行详细
		**/
		report.loadCityOrderDetail=function(){	
			var IoId = $.query.get("IoId");
			var parm = '{"ioId":'+IoId+'}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_REPORT;
            ajaxJsonProp.act="TOP_ORDER_QTY_LEFT_DETAIL";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=report.loadCityOrderDetailSuccess;
            report.loadDataFromServer();
			
		}
		 report.loadCityOrderDetailSuccess = function (data) {
             if (data.code + "" == "1") {
				var	 datalist=data.data.reportData;
				var templateHtml=$("#template").html();
				var sb=new Array();
				var currQuantity=0,quantity=0,k=0;
				for(var i=0;i<datalist.length;i++) {
					var obj=datalist[i];
					quantity+=parseInt(obj.quantity);
					currQuantity+=parseInt(obj.currQuantity);
					var rec=new Record();
					k++;
					rec.addField("no",k);
					rec.addField("subinventoryCode",obj.subinventoryCode);
					rec.addField("currQuantity",obj.currQuantity);
					rec.addField("quantity",obj.quantity);
					var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,rec);
					sb.push(html);
				}
				sb.push(' <li><span>合计</span><span>--</span><span>'+currQuantity+'</span><span>'+quantity+'</span><span></span></li>');
				console.log(datalist);
				console.log(sb.join(''));
				var content=$("#content");
				content.html(sb.join(''));	
				
            } else {
                sinoMobileUI.alert("加载地市排行详细出现错误！" + data.msg);
            }
        }
		
		 //2. 机型排行榜
		report.loadMobileOrderListByServer=function() {
			var parm = '{}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_REPORT;
            ajaxJsonProp.act="DHH_TOP_ORDER_QTY";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=report.loadMobileOrderListByServerSuccess;
            report.loadDataFromServer();
		}
        report.loadMobileOrderListByServerSuccess = function (data) {
             if (data.code + "" == "1") {
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_FIND_MOBILEORDER_LIST,sinoMobileUtil.getJsonStringFromResponseData(data,"reportData"));
				report.loadMobileOrderListBySession();
            } else {
                sinoMobileUI.alert("加载银联出现错误！" + data.msg);
            }
        }
         report.loadMobileOrderListBySession=function() {
			var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_FIND_MOBILEORDER_LIST);
			var	 datalist=$.parseJSON(datas);
			var templateHtml=$("#template").html();
			var sb=new Array();
			var quantity=0,rcvQuantity=0,k=0;
			for(var i=0;i<datalist.length;i++) {
				var obj=datalist[i];
				if(obj.isSum=='Y') {
					quantity=obj.quantity;
					rcvQuantity=obj.rcvQuantity;
					continue;
				}
				k++;
				//quantity+=parseInt(obj.quantity);
				//rcvQuantity+=parseInt(obj.rcvQuantity);
				var rec=new Record();
				rec.addField("no",k);
				rec.addField("isSum  ",obj.isSum  );
				rec.addField("itemName",obj.itemName);
				rec.addField("quantity",obj.quantity);
				rec.addField("rcvQuantity",obj.rcvQuantity);
				var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,rec);
				sb.push(html);
			}
			var content=$("#content");
			sb.push(' <li><span>合计</span><span>--</span><span>'+quantity+'</span><span>'+rcvQuantity+'</span><span></span></li>');
			content.html(sb.join(''));	
		}
         //3. 目标渠道排行榜
		report.loadChannelOrderListByServer=function() {
			var parm = '{}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_REPORT;
            ajaxJsonProp.act="DHH_TOP_CHANNEL_LEFT";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=report.loadChannelOrderListByServerSuccess;
            report.loadDataFromServer();
		}
        report.loadChannelOrderListByServerSuccess = function (data) {
             if (data.code + "" == "1") {
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_FIND_CHANNELORDER_LIST,sinoMobileUtil.getJsonStringFromResponseData(data,"reportData"));
				report.loadChannelOrderListBySession();
            } else {
                sinoMobileUI.alert("加载目标渠道排行榜出现错误！" + data.msg);
            }
        }
         report.loadChannelOrderListBySession=function() {
			var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_FIND_CHANNELORDER_LIST);
			var	 datalist=$.parseJSON(datas);
			var templateHtml=$("#template").html();
			var sb=new Array();
			var sum=0,k=0;
			for(var i=0;i<datalist.length;i++) {
				var obj=datalist[i];
				if(obj.isSum=='Y' || obj.companyName=='合计') {
					sum=obj.orderOrgCnt;
					continue;
				}
				k++;
				//sum+=parseInt(obj.orderOrgCnt);
				var rec=new Record();
				rec.addField("no",k);
				rec.addField("companyName",obj.companyName);
				rec.addField("orderOrgCnt",obj.orderOrgCnt);
				var html=sinoMobileUtil.getFormatedTemplateHtml(templateHtml,rec);
				sb.push(html);
			}
			sb.push(' <li><span>合计</span><span>--</span><span>'+sum+'</span><span></span></li>');
			var content=$("#content");
			content.html(sb.join(''));
		}
		return report;
	}
}
var report=ReportClass.createNew();