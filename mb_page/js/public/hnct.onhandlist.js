/**
*  Module: 现有量列表
*  Author: Jintl
*  Create Time:2015-6-4
*  Last Modify Time: 2015-6-17
*/

/**
*  说明该函数中的搜索条件为预留
**/

hnctOnhandList={
	createNew:function(){
		var onhandList={};
		//加载状态
		var loadReady=true;
		//默认为未付款查询
		//请求的当前页
		var currPage=1;
		var totalPage=0;
		
		var keyWord="";
		var type="";
		onhandList.initAndLoad=function(obj){
			currPage=1;
			loadReady=false;
			var vv=$("#keyWord").val();
			if(vv=="输入你要搜索的关键字"){
				vv="";
			}
			keyWord=vv;
			$("#onhandList").html("");
			$(".onLoad").show();
			$(".onLoad-next").hide();
			$("#type").val(queryStatus);
			onhandList.doSetSelectedStatus(obj);
			onhandList.loadDataFromServer();		
		}

		onhandList.doClickSearch=function(){
			onhandList.initAndLoad(null);
		}
		
		onhandList.doLoadNextPage=function(){
			
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
			onhandList.loadDataFromServer();
		}
		onhandList.loadDataFromServer=function(){
			var parm=new Record();
			parm.addField("currPage",currPage);
			parm.addField("keyWord",keyWord);
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_ONHAND_LIST;
			
			sinoMobileUtil.ajaxCall(strUrl,"GET_ON_HAND_QTY",parm.toJsonString(),onhandList.loadOnhandListSuccess,onhandList.loadError); 		
		}; 
		onhandList.loadError=function (result, textStatus, errorThrown){	
			loadReady=true;
			$(".onLoad").hide();
			$(".onLoad-next").hide();
			
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
		onhandList.loadOnhandListSuccess=function(data){
			loadReady=true;
			if(data.code=="1"){
				var recs=sinoMobileUtil.getRecordsFromResponseData(data,"onHandQtyData");
				if(recs==null||recs.getLength()==0){
					//totalPage=0;
					if(currPage<=1){
						sinoMobileUI.showEmptyMsg("");
					}
				}else{
					var template=$("#template").html();

					var onhandList=$("#onhandList");
					var nLen=recs.getLength();
					var rec=null;
					var html="";	
					var orderStatus="";
					if(nLen>0){
						rec=recs.getNthRecord(1);
						totalPage=rec.getValue("appTotalPage");
					}
					var lines=null;
					for(var nn=1;nn<=nLen;nn++){
						rec=recs.getNthRecord(nn);
						html=template;						
						html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);						
						onhandList.append(html+"\r");						
					}
				}			
			}else{			
				sinoMobileUI.alert("加载数据失败:"+data.msg);
			}
			$(".onLoad").hide();
			$(".onLoad-next").hide();
		
		};
		
		onhandList.clickSeachBar=function(){
			if($(".search-box").is(":hidden")){				
				$(".search-box").show();
				$("#keyWord").focus();
			}else{
				$(".search-box").hide();
			}
		}
		return onhandList;

	}
  
	
}

var sinoOnhandList=hnctOnhandList.createNew();