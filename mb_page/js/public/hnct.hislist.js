/**
*  Module: 我的足迹
*  Author: Jintl
*  Create Time:2015-6-4
*  Last Modify Time: 2015-6-6
*/


hisList={
	createNew:function(){
		var his={};
		//加载状态
		var loadReady=true;
		//请求的当前页
		var currPage=1;
		//var totalPage=0;
		var keyWord="";	
	
		his.doLoadNextPage=function(){			
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
			his.loadDataFromServer();
		}
		his.loadDataFromServer=function(){
			sinoMobileUI.hideEmptyMsg();
			loadReady=false;
			var parm=new Record();
			parm.addField("currPage",currPage);
			parm.addField("keyWord",keyWord);
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_MY_HIS;
			sinoMobileUtil.ajaxCall(strUrl,"GET_VIEW_HIS_LIST",parm.toJsonString(),his.loadHisListSuccess,his.loadError); 		
		}; 
		his.loadHisListSuccess=function(data){
			loadReady=true;
		    if(data.code=="1"){
				var recs=sinoMobileUtil.getRecordsFromResponseData(data,"viewHisData");
				if(recs==null||recs.getLength()==0){
					//totalPage=0;
					if(currPage<=1){
						sinoMobileUI.showEmptyMsg("");
					}
				}else{				
					var template=$("#template").html();
					var productList=$("#productList");
					var nLen=recs.getLength();
					var rec=null;
					var html="";
					if(nLen>0){
						rec=recs.getNthRecord(1);
						totalPage=rec.getValue("appTotalPage");
					}
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
		his.loadError=function (result, textStatus, errorThrown){
			loadReady=true;
			
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
					//sinoMobileUtil.autoLogin();
					//sinoMobileUI.alert("服务器没有响应，或访问地址不可用！");
					sinoMobileUI.doOpen404Page();
				}else if(httpErrorCode=="200" ){						
						//sinoMobileUI.alert("内部错误：！");
				}else if(httpErrorCode=="401" ){
						util.autoLogin(util.getCurrent2RootRelateFullPath());
				}else{
					sinoMobileUI.alert("服务器返回错误，操作不能继续！") ;
				}
			}
		}
	
		
		return his;

	}
	
}

var sinoHisList=hisList.createNew();