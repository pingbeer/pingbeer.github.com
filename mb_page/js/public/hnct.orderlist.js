/**
*  Module: 订单列表工具函数
*  Author: Jintl
*  Create Time:2015-6-4
*  Last Modify Time: 2015-6-6
*/

/**
* 全局参数
**/

hnctOrderList={
	createNew:function(){
		var orderList={};
		//加载状态
		var loadReady=true;
		//默认为未付款查询
		var queryStatus=hnctShoppingConfig.STATUS_UN_PAY;
		//请求的当前页
		var currPage=1;
		var totalPage=0;
		var keyWord="";
		var type="";
		orderList.initAndLoad=function(obj){
			currPage=1;
			loadReady=false;
			var vv=$("#keyWord").val();
			if(vv=="输入你要搜索的关键字"){
				vv="";
			}
			keyWord=vv;
			$("#orderList").html("");
			$(".onLoad").show();
			$(".onLoad-next").hide();
			$("#type").val(queryStatus);
			orderList.doSetSelectedStatus(obj);
			orderList.loadDataFromServer();
			
		
		}
		orderList.doClickSearch=function(){
			orderList.initAndLoad(null);
		}
		/**
		* 点击分类列表
		**/

		orderList.doClickList=function(type,obj){
			//上次未加载完毕，则不响应
			if(!loadReady){
				return;
			}		
			queryStatus=type;
			if(obj==null){
				if(type==hnctShoppingConfig.STATUS_UN_PAY){
					obj=$("#menuUnPay")
				}else if(type==hnctShoppingConfig.STATUS_UN_RCV){
					obj=$("#menuUnRcv")
				}else if(type==hnctShoppingConfig.STATUS_REFUND){
					obj=$("#menuRefund")
				}else if(type==hnctShoppingConfig.STATUS_ALL){
					obj=$("#menuAll")
				}
			}
			orderList.initAndLoad(obj);
		}
		
		/**
		* 更改查询选择状态
		**/	
		orderList.doSetSelectedStatus=function(obj){
			if(obj==null){
				return;
			}
			var selectedItems=$(".waitfk-txt-on");
			if(selectedItems==null||selectedItems.length==0){
				return;
			}
			var nLen=selectedItems.length;
			for(var ii=0;ii<nLen;ii++){
				$(selectedItems[ii]).attr("class","waitfk-txt");
			}
			$(obj).attr("class","waitfk-txt-on");
		}
		orderList.doLoadNextPage=function(){
			
			//上次未加载完毕，则不响应
			if(!loadReady){
				return;
			}
			
			currPage=currPage+1;
			//如果到达最后一页则不加载
			if(currPage>totalPage){
				return;
			}
			loadReady=false;
			$(".onLoad-next").show();			
			orderList.loadDataFromServer();
		}
		orderList.loadDataFromServer=function(){
			sinoMobileUI.hideEmptyMsg();
			var parm=new Record();
			parm.addField("currPage",currPage);
			parm.addField("status",queryStatus);
			parm.addField("keyWord",keyWord);
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_ORDER_LIST;
			sinoMobileUtil.ajaxCall(strUrl,"GET_ORDER_LIST",parm.toJsonString(),orderList.loadOrderListSuccess,orderList.loadError); 		
		}; 
		orderList.loadError=function (result, textStatus, errorThrown){	
			loadReady=true;
			$(".onLoad").hide();
			$(".onLoad-next").hide();
			sinoMobileUtil.loadErrorCall=(result, textStatus, errorThrown,true);
		}
		orderList.loadOrderListSuccess=function(data){
			loadReady=true;
			if(data.code=="1"){
				var orderDataJsonObj=sinoMobileUtil.getJsonObjectFromResponseData(data,"orderData");
				var recs=sinoMobileUtil.getRecordsFromResponseData(data,"orderData");
				if(recs!=null&&recs.getLength()>0){
					var templateUnPay=$("#templateUnPay").html();
					var templateUnRcv=$("#templateUnRcv").html();
					var templateRefund=$("#templateRefund").html();
					var templateComplete=$("#templateComplete").html();

					var orderList=$("#orderList");
					var nLen=recs.getLength();
					var rec=null;
					var html="";	
					var orderStatus="";
					if(nLen>0){
						rec=recs.getNthRecord(1);
						totalPage=rec.getValue("totalPage");
					}
					var lines=null;
					for(var nn=1;nn<=nLen;nn++){
						rec=recs.getNthRecord(nn);
						orderStatus=sinoOrderList.getListOrderStatus(rec);
						//回调函数中只能用全局函数调用
						if(orderStatus==hnctShoppingConfig.STATUS_UN_PAY){
							html=templateUnPay;
						}else if(orderStatus==hnctShoppingConfig.STATUS_UN_RCV){
							html=templateUnRcv;
						}else if(orderStatus==hnctShoppingConfig.STATUS_REFUND){
							html=templateRefund;
						}else if(orderStatus==hnctShoppingConfig.STATUS_COMPLETE){
							html=templateComplete;
						}else{
							
							html=templateComplete;
						} 
						
						html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
						lines=orderDataJsonObj[nn-1].lineData;
						lineHtml="";
						if(lines!=null){							
							var recsLine=new Records();
							recsLine.fromJson(lines);							
							lineHtml=sinoOrderList.getOrderLinesHtml(recsLine);
						}
						html=html.replace("{lineHtml}",lineHtml);
						orderList.append(html+"\r");
						
					}
				}else{
					//totalPage=0;
					if(currPage<=1){
						sinoMobileUI.showEmptyMsg("");
					}
				}				
			}else{			
				sinoMobileUI.alert("加载数据失败:"+data.msg);
			}
			$(".onLoad").hide();
			$(".onLoad-next").hide();
		
		};
		/**
		* 获取当前订单状态
		**/
		orderList.getListOrderStatus=function(rec){	
			return sinoShopping.getOrderStatus(rec);
		};
		orderList.getOrderLinesHtml=function(recs){
			if(recs==null||recs.getLength()==0){
				return "";
			}
			var linesHtml="";
			var nLines=recs.getLength();
			var line=null;
			
			for(var jj=1;jj<=nLines;jj++){
				line=recs.getNthRecord(jj);
				if(jj>1){
					linesHtml+="<span class=\"blankw1rem\"></span>";
				}
				linesHtml+="<a ><img src=\""+line.getValue("ImgURL")+"\"></a>";	
			}
			
			return linesHtml;
		}
		orderList.clickSeachBar=function(){
			if($(".search-box").is(":hidden")){				
				$(".search-box").show();
				$("#keyWord").focus();
			}else{
				$(".search-box").hide();
			}
		}
		orderList.openOrderDetail=function(poHeaderId){
			var type=$("#type").val();
			sinoMobileUI.doOpenOrderDetailPage(poHeaderId,type,false);
		}
		orderList.openRefund=function(poHeaderId){
			var from=$("#type").val();
			sinoMobileUI.doOpenRefundPage(poHeaderId,from);
			
		}
		return orderList;

	}
  
	
}

var sinoOrderList=hnctOrderList.createNew();