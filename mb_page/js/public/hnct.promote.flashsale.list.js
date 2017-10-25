/**
*  Module: 抢购列表
*  Author: Jintl
*  Create Time:2015-9-20
*  Last Modify Time: 2015-9-20
*/


flashSaleList={
	createNew:function(){
		var list={};
		//加载状态
		var loadReady=true;
		//请求的当前页
		var currPage=1;
		

		list.doLoadNextPage=function(){			
			//上次未加载完毕，则不响应
			if(!loadReady){
				return;
			}
			currPage=currPage+1;
			loadReady=false;
			//如果到达最后一页则不加载
			//if(currPage>totalPage){
			//	return;
			//}
			$(".onLoad-next").show();			
			list.loadDataFromServer();
		}
		list.loadDataFromServer=function(){			

			sinoMobileUI.hideEmptyMsg();
			loadReady=false;
			var parm=new Record();
			parm.addField("currPage",currPage);
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_FLASH_SALE;
			sinoMobileUtil.ajaxCall(strUrl,"GET_FLASH_SALE_LIST",parm.toJsonString(),list.loadFlashSaleListSuccess,list.loadError);
		}; 
		list.loadFlashSaleListSuccess=function(data){
			loadReady=true;
		    if(data.code=="1"){
				var recs=sinoMobileUtil.getRecordsFromResponseData(data,"flashSaleItemData");
				if(recs==null||recs.getLength()==0){
					//totalPage=0;
					if(currPage<=1){
						sinoMobileUI.showEmptyMsg("");
					}
				}else{				
					var template=$("#template").html();
					var templateSaleControl=$("#templateSaleControl").html();
					var productList=$("#promoteList");
					var nLen=recs.getLength();
					var rec=null;
					var html="";
					var saleControl="";
					for(var nn=1;nn<=nLen;nn++){
						rec=recs.getNthRecord(nn);
						minPrice=rec.getValue("minPrice");
						currentPrice=rec.getValue("currentPrice");
					
						rec.addField("discountPrice",sinoMobileUtil.getDiscountHtml(minPrice,currentPrice));
			            rec.addField("restTime",sinoMobileUtil.getRestTimeHtml(rec.getValue("promoteEndDate")));
						rec.addField("saleControl1","");
						saleControl=rec.getValue("saleControl");
						if(!sinoMobileUtil.strIsNull(saleControl)){
							saleControl=sinoMobileUtil.getFormatedTemplateHtml(templateSaleControl,rec);
							rec.setField("saleControl",saleControl);
							rec.setField("saleControl1","1");
						}
						html=template;
						html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);	
						productList.append(html+"\r");
					}
				}
				$(".onLoad").hide();
				$(".onLoad-next").hide();
			}else{
				sinoMobileUI.alert(data.msg);
			
			}
			
		}
		list.loadError=function (result, textStatus, errorThrown){
			loadReady=true;			
			$(".onLoad").hide();
			sinoMobileUtil.loadErrorCall(result, textStatus, errorThrown,true);
		}	
		list.showSaleControl=function(msg){
			$(".qgzgsm_con").html(msg);
			$(".editshopcart-bg").show();
			$(".qgzgsm_t").show();
		} 
		list.closeSaleControl=function(msg){
			$(".editshopcart-bg").hide();
			$(".qgzgsm_t").hide();
		} 
		return list;

	}
	
}

var promoteFlashSaleList=flashSaleList.createNew();