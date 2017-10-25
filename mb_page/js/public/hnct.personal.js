/**
*  Module:  个人工具函数
*  Author: Jintl
*  Create Time:2015-6-11
*  Last Modify Time: 2015-6-11
*/

/**
* 全局参数
**/
hnctPersonal={
	createNew:function(){
		var personal={};
		//加载状态
		var loadReady=true;
		
		
		personal.loadPersonalQty=function(){
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_PERSONAL;			
			sinoMobileUtil.ajaxCall(strUrl,"GET_PERSONAL_QTYS","",personal.loadPersonalQtySuccess,personal.loadError); 		
		}; 
		personal.loadError=function (result, textStatus, errorThrown){	
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
		personal.loadPersonalQtySuccess=function(data){
			if(data.code=="1"){
				userName=sinoMobileUtil.getJsonObjectFromResponseData(data,"userName");
				unPayOrderQty=personal.formatQty(sinoMobileUtil.getJsonObjectFromResponseData(data,"unPayOrderQty"));
				unRcvOrderQty=personal.formatQty(sinoMobileUtil.getJsonObjectFromResponseData(data,"unRcvOrderQty"));
                viewHisQty=personal.formatQty(sinoMobileUtil.getJsonObjectFromResponseData(data,"viewHisQty"));
				favoriteQty=personal.formatQty(sinoMobileUtil.getJsonObjectFromResponseData(data,"favoriteQty"));
		
				$("#userName").html(userName);
				$("#unPayOrderQty").html(unPayOrderQty);
				$("#unRcvOrderQty").html(unRcvOrderQty);
				$("#viewHisQty").html(viewHisQty);
				$("#favoriteQty").html(favoriteQty);
				
			}else{			
				sinoMobileUI.alert("加载数据失败:"+data.msg);
			}
	
		};
		personal.formatQty=function(obj){
			if(obj==null){
				return "0";
			}
			return sinoMobileUtil.strIsNull(obj)?"0":obj;
		}
		personal.loadLogout=function(){
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_LOGOUT;			
			sinoMobileUtil.ajaxCall(strUrl,"","",personal.loadLogoutSuccess,personal.loadLogoutError); 		
		}; 
		
		personal.loadLogoutSuccess=function(data){
			if(data.code=="1"){
				sinoMobileUI.doOpenLoginPage();				
			}else{			
				sinoMobileUI.alert("签出登录失败:"+data.msg);
				setTimeout(sinoMobileUI.doOpenLoginPage,2000);
			}
	
		};
		personal.loadLogoutError=function (result, textStatus, errorThrown){				
			sinoMobileUI.doOpenLoginPage();	
		}
		personal.relogin=function(){
			sinoMobileUI.confirm("您确定要退出登录吗？",function(){personal.loadLogout()},null);
			
		}
		
		return personal;

	}
  
	
}

var sinoPersonal=hnctPersonal.createNew();