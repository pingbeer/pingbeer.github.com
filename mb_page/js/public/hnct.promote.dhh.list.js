/**
*  Module: 订货会 block list
*  Author: Jintl
*  Create Time:2015-9-20
*  Last Modify Time: 2015-9-20
*/


dhhList={
	createNew:function(){
		var list={};
		//加载状态
		var loadReady=true;
		//请求的当前页
		var currPage=1;
		//var totalPage=0;
		var keyWord="";	
		var headerId = $.query.get("headerId");
        var isImportant = $.query.get("isImportant");
        var blockName = $.query.get("blockName");
        var keyWord = $.query.get("keyWord");

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
            $("#blockName").html(blockName);
			sinoMobileUI.hideEmptyMsg();
			loadReady=false;
			var parm=new Record();
			parm.addField("headerId",headerId);
			parm.addField("isImportant",isImportant);
			parm.addField("blockName",blockName);
			parm.addField("currPage",currPage);
			parm.addField("keyWord",keyWord);
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_DHH;
			sinoMobileUtil.ajaxCall(strUrl,"GET_DHH_BLOCK_LIST",parm.toJsonString(),list.loaddhhListSuccess,list.loadError);
		}; 
		list.loaddhhListSuccess=function(data){
			loadReady=true;
		    if(data.code=="1"){

				//var bannerUrl=sinoMobileUtil.getHostURL()+data.data.blockNameImg;
				//$("#blockNameImg").attr("src",bannerUrl);

				var recs=sinoMobileUtil.getRecordsFromResponseData(data,"dhhItemData");
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
					//if(nLen>0){
						//rec=recs.getNthRecord(1);
						//totalPage=rec.getValue("appTotalPage");
					//}
					for(var nn=1;nn<=nLen;nn++){
						rec=recs.getNthRecord(nn);
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

var promoteDhhList=dhhList.createNew();