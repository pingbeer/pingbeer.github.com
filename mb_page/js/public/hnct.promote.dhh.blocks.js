/**
*  Module: 订货会分区列表
*  Author: Jintl
*  Create Time:2015-9-16
*  Last Modify Time: 2015-9-16
*/


dhhBlocks={
	createNew:function(){
		var blocks={};
		
		//订货会主页面
		blocks.loadDataFromServer=function(){
			sinoMobileUI.hideEmptyMsg();
			loadReady=false;
			var parm=new Record();
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_DHH;
			sinoMobileUtil.ajaxCall(strUrl,"GET_DHH_HOME_PAGE_LIST",parm.toJsonString(),blocks.loadPromoteListSuccess,blocks.loadError); 		
		}; 
        

		blocks.loadPromoteListSuccess=function(data){
			loadReady=true;
		    if(data.code=="1"){
				//顶部图片
				var bannerUrl=sinoMobileUtil.getHostURL()+data.data.dhhImagUrl;
				$("#dhhImagUrl").attr("src",bannerUrl);

				var recs=sinoMobileUtil.getRecordsFromResponseData(data,"dhhItemData");
				if(recs==null||recs.getLength()==0){
					//totalPage=0;
					if(currPage<=1){
						sinoMobileUI.showEmptyMsg("");
					}
				}else{	
					
					var templateBlock=$("#templateBlock").html();
					var templateBlockLine=$("#templateBlockLine").html();
					var nLen=recs.getLength();
					var rec=null;
					var html="";
					var blockHtml="";
					var linesHtml="";
					var lineHtml="";
					var lastBlockName="";
					var thisBlockName="";
				    var blockHtml="";
					var imagUrl="";
					var blockNameImg="";
					var lastRec=null;


					for(var nn=1;nn<=nLen;nn++){
						rec=recs.getNthRecord(nn);
						//图片地址格式化
						imageUrl=rec.getValue("imageUrl");
						if(imageUrl!=null&&imageUrl.indexOf("http:")<0){
							imageUrl=sinoMobileUtil.getHostURL()+imageUrl;
						}
						rec.setField("imageUrl",imageUrl);

						blockNameImg=rec.getValue("blockNameImg");
						if(blockNameImg!=null&&blockNameImg.indexOf("http:")<0){
							blockNameImg=sinoMobileUtil.getHostURL()+blockNameImg;
						}
						rec.setField("blockNameImg",blockNameImg);
						
						thisBlockName=rec.getValue("blockName");
						if(thisBlockName!=lastBlockName&nn>1){
							
							blockHtml=templateBlock;
							blockHtml=sinoMobileUtil.getFormatedTemplateHtml(blockHtml,lastRec);
							blockHtml=blockHtml.replaceAll("{blockLines}",linesHtml);
							html+=blockHtml;
							linesHtml="";
							lineHtml="";

						}

						lineHtml=templateBlockLine;
						lineHtml=sinoMobileUtil.getFormatedTemplateHtml(lineHtml,rec);						
						linesHtml+=lineHtml;
						lastBlockName=thisBlockName;
						lastRec=rec;
					}
					
					blockHtml=templateBlock;
					blockHtml=sinoMobileUtil.getFormatedTemplateHtml(blockHtml,rec);
					blockHtml=blockHtml.replaceAll("{blockLines}",linesHtml);
					html+=blockHtml;
					//html=templateBlock.replaceAll("{blockLines}",html);
					$("#blockList").html(html);

				}
				$(".onLoad").hide();
			}else{
				$(".onLoad").hide();
				sinoMobileUI.alert(data.msg);			
			}
			
		}       
		blocks.loadError=function (result, textStatus, errorThrown){
			$(".onLoad").hide();
			sinoMobileUtil.loadErrorCall(result, textStatus, errorThrown,true);
		}		
		return blocks;
	}
	
}

var promoteDhhBlocks=dhhBlocks.createNew();