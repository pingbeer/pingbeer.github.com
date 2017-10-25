/**
*  Module: 团购列表
*  Author: Jintl
*  Create Time:2015-9-20
*  Last Modify Time: 2015-9-20
*/


groupPurchaseList={
	createNew:function(){
		var list={};
		//加载状态
		var loadReady=true;
		//请求的当前页
		var currPage=1;
		//var totalPage=0;
			
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
			var parm='{"currPage":"'+currPage+'"}';
			
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_GROUP_PURCHASE;
			sinoMobileUtil.ajaxCall(strUrl,"GET_GROUP_PURCHASE_LIST",parm,list.loadGroupPurchaseListSuccess,list.loadError);
		}; 
		list.loadGroupPurchaseListSuccess=function(data){
			loadReady=true;
		    if(data.code=="1"){
				var recs=sinoMobileUtil.getRecordsFromResponseData(data,"groupPurchaseItemData");
				if(recs==null||recs.getLength()==0){
					//totalPage=0;
					if(currPage<=1){
						sinoMobileUI.showEmptyMsg("");
					}
				}else{				
					var template=$("#template").html();
					var productList=$("#promoteList");
					var nLen=recs.getLength();
					var rec=null;
					var html="";
					var minPrice=0;
					var currentPrice=0;
					
					for(var nn=1;nn<=nLen;nn++){
						rec=recs.getNthRecord(nn);
						minPrice=rec.getValue("minPrice");
						currentPrice=rec.getValue("currentPrice");
						rec.addField("discountPrice",sinoMobileUtil.getDiscountHtml(minPrice,currentPrice));

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
		
		return list;

	}
	
}

var promoteGroupPurchaseList=groupPurchaseList.createNew();