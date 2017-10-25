/**
*  Module: search
*  Author: Jintl
*  Create Time:2015-5-19
*  Last Modify Time: 2015-5-19
 *******************************
 * 搜索公共函数
 * */
 
var hnctSearch={
	createNew:function(){
		var search={};
		var searchRecord=new Record();
		var totalPage=0;
		var loadReady=false;
		search.init=function(){
			//初设化时从session缓冲中寻找数据，如果有则加载，无则初始化
			var json=sinoMobileUtil.getSessionSearchDataJson();
			if(sinoMobileUtil.strIsNull(json)||json=="[]"||json=="{}"){
				searchRecord.addField("phoneSort","");
				searchRecord.addField("phoneSortUpOrDown","");
				searchRecord.addField("searchKeyword","");
				searchRecord.addField("priceStart","");
				searchRecord.addField("priceEnd","");
				searchRecord.addField("phoneScreenSizeStart","");
				searchRecord.addField("phoneScreenSizeEnd","");
				searchRecord.addField("phoneCpu","");
				searchRecord.addField("brandTypeValue","");
				searchRecord.addField("phoneTypeValue","");
				searchRecord.addField("priceTitle","");
				searchRecord.addField("screenTitle","");
				searchRecord.addField("cpuTitle","");
				searchRecord.addField("brandTitle","");
				searchRecord.addField("vendorId","");
				searchRecord.addField("type","");
				searchRecord.addField("currPage","1");	
				search.saveSessionDataJson();
				
			}else{
				searchRecord.fromJsonString(json);
			}
			//设置搜索条件输入文本
			var kk=search.getSearchKeywordTxt();
			
			if(!sinoMobileUtil.strIsNull(kk)){
				$("#"+sinoMobileConfig.CONST_KEYWORD_INPUT_FIELD).val(kk);
			}
			
			//设置分类条件按钮 
			var phoneSort=search.getPhoneSort();
			if(sinoMobileUtil.strIsNull(phoneSort)){
				phoneSort="default";
			}
			var sortType=search.getPhoneSortUpOrDown();
			var objSort=null;
			if(phoneSort=="default"){
				objSort=$("#sortDefault");
			}else if(phoneSort=="s"){
				objSort=$("#sortSale");
			}else if(phoneSort=="p"){
				objSort=$("#sortPrice");
			}
			if(sinoMobileUtil.strIsNull(sortType)){
				sortType="1";
			}
			
			if(sortType=="2"){
				objSort.attr("class","downon");
			}else if(sortType=="1"){
				objSort.attr("class","upon");
			}
			
		}
		
		/**
		* 清空缓存数据
		**/
		search.removeSessionData=function(){
			sinoMobileUtil.saveSessionSearchDataJson("");		
		}
		/**
		* 设置当前查询页返回的可加载的全部页数
		**/
		search.getTotalPage=function(){
			return totalPage;
		}
		/**
		* 以下为设置搜索条件
		**/		
		search.setPhoneSort=function(vv){
			searchRecord.setField("phoneSort",vv);
		};
		search.setPhoneSortUpOrDown=function(vv){
			searchRecord.setField("phoneSortUpOrDown",vv);
		};
		search.setSearchKeyword=function(vv){
			searchRecord.setField("searchKeyword",vv);
		};

		search.setPriceStart=function(vv){
			searchRecord.setField("priceStart",vv);
		};
		search.setPriceEnd=function(vv){
			searchRecord.setField("priceEnd",vv);
		};
		search.setPhoneScreenSizeStart=function(vv){
			searchRecord.setField("phoneScreenSizeStart",vv);
		};
		search.setPhoneScreenSizeEnd=function(vv){
			searchRecord.setField("phoneScreenSizeEnd",vv);
		};
		search.setPhoneCpu=function(vv){
			searchRecord.setField("phoneCpu",vv);
		};
		search.setBrandTypeValue=function(vv){
			searchRecord.setField("brandTypeValue",vv);
		};
		search.setPhoneTypeValue=function(vv){
			searchRecord.setField("phoneTypeValue",vv);
		};
		search.setPriceTitle=function(vv){
			searchRecord.setField("priceTitle",vv);
		};
		search.setScreenTitle=function(vv){
			searchRecord.setField("screenTitle",vv);
		};
		search.setCpuTitle=function(vv){
			searchRecord.setField("cpuTitle",vv);
		};
		search.setBrandTitle=function(vv){
			searchRecord.setField("brandTitle",vv);
		};
		search.setVendorId=function(vv){
			searchRecord.setField("vendorId",vv);	
		};
		search.setType=function(vv){
			searchRecord.setField("type",vv);
		};
		search.setCurrPage=function(vv){
			searchRecord.setField("currPage",vv);	
		};

		/**
		* 以下为获取搜索条件
		**/	
		search.getPhoneSort=function(){
			return searchRecord.getValue("phoneSort");
		};
		search.getPhoneSortUpOrDown=function(){
			return searchRecord.getValue("phoneSortUpOrDown");
		};
		search.getSearchKeyword=function(){
			var vv= searchRecord.getValue("searchKeyword");
			return (vv==sinoMobileConfig.CONST_KEYWORD_DEFAULT_TEXT||vv==sinoMobileConfig.CONST_KEYWORD_DEFAULT_TEXT2)?"":vv;
		};
		/**
		* 搜索条件显示文本
		*/
		search.getSearchKeywordTxt=function(){
			var vv=search.getSearchKeyword();
			return (vv=="")?sinoMobileConfig.CONST_KEYWORD_DEFAULT_TEXT:vv;
		}
		search.getPriceStart=function(){
			return searchRecord.getValue("priceStart");
		};
		search.getPriceEnd=function(){
			return searchRecord.getValue("priceEnd");
		};
		search.getPhoneScreenSizeStart=function(){
			return searchRecord.getValue("phoneScreenSizeStart");
		};
		search.getPhoneScreenSizeEnd=function(){
			return searchRecord.getValue("phoneScreenSizeEnd");
		};
		search.getPhoneCpu=function(){
			return searchRecord.getValue("phoneCpu");
		};
		search.getBrandTypeValue=function(){
			return searchRecord.getValue("brandTypeValue");
		};
		search.getPhoneTypeValue=function(){
			return searchRecord.getValue("phoneTypeValue");
		};
		search.getPriceTitle=function(){	
			return searchRecord.getValue("priceTitle");
		}
		search.getScreenTitle=function(){	
			return searchRecord.getValue("screenTitle");
		}
		search.getCpuTitle=function(){	
			return searchRecord.getValue("cpuTitle");
		}
		search.getBrandTitle=function(){	
			return searchRecord.getValue("brandTitle");
		}
		search.getVendorId=function(){	
			return searchRecord.getValue("vendorId");
		}
		search.getCurrPage=function(){
			return searchRecord.getValue("currPage");	
		};
		/**
		* 清空字典选择
		**/
		search.initDicCondition=function(){		
			search.setPriceStart("");
			search.setPriceEnd("");
			search.setPhoneScreenSizeStart("");
			search.setPhoneScreenSizeEnd("");
			search.setPhoneCpu("");
			search.setBrandTypeValue("");
			search.setPhoneTypeValue("");

			search.setPriceTitle("");
			search.setScreenTitle("");
			search.setBrandTitle("");
			search.setCpuTitle("");
			search.setVendorId("");
		}
		/**
		* 输入搜素条件
		**/
		search.onBlurInputSearch=function(obj){		
		  var vv=$("#"+sinoMobileConfig.CONST_KEYWORD_INPUT_FIELD).val();
		  if(sinoMobileUtil.strIsNull(vv)){
			 $("#"+sinoMobileConfig.CONST_KEYWORD_INPUT_FIELD).val(sinoMobileConfig.CONST_KEYWORD_DEFAULT_TEXT);
			 vv="";
		  }else{
			// $(".del-icon").show();
		  }
		  search.setSearchKeyword(vv);
		}
		/**
		* 删除搜索条件
		**/
		search.doDeleteSearch=function(obj){
			$("#"+sinoMobileConfig.CONST_KEYWORD_INPUT_FIELD).val(sinoMobileConfig.CONST_KEYWORD_DEFAULT_TEXT);
			//$(".del-icon").hide();
			search.setSearchKeyword("");
		}
		search.onFocusSearchInput=function(obj){
			var vv=$("#"+sinoMobileConfig.CONST_KEYWORD_INPUT_FIELD).val();
			if(vv==sinoMobileConfig.CONST_KEYWORD_DEFAULT_TEXT){
				$("#"+sinoMobileConfig.CONST_KEYWORD_INPUT_FIELD).val("");
			}
			var relatePath=sinoMobileUtil.getCurrent2RootRelatePath();
			document.location.href=relatePath+"apps/public/search.html";
			//ui.alert("正在建设中，敬请关注");
		}

		search.loadDataFromServer=function(){
			loadReady=false;
			search.init();
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_PRODUCT_LIST;
			var typeValue = searchRecord.getValue("type");
			if("sysOutProduct" == typeValue){
				sinoMobileUtil.ajaxCall(strUrl,"GET_SYSOUT_PRODUCT_LIST",searchRecord.toJsonString(),search.loadProductListSuccess,search.loadError);
			}else{
				sinoMobileUtil.ajaxCall(strUrl,"GET_PHONE_LIST",searchRecord.toJsonString(),search.loadProductListSuccess,search.loadError);
			}
		};
		
		search.loadError=function (result, textStatus, errorThrown){
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
		/**
		* 1. 加载产品列表
		**/
		
		search.loadProductListSuccess=function(data){
			loadReady=true;
		    if(data.code=="1"){
				var recs=sinoMobileUtil.getRecordsFromResponseData(data,"productListData");
				if(recs==null||recs.getLength()==0){
					//totalPage=0;
					if(search.getCurrPage()*1<=1){
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
		search.doClickSearch=function(obj){
			/*var vv=$("#"+sinoMobileConfig.CONST_KEYWORD_INPUT_FIELD).val();
			//如果未输入条件，则不执行搜素，光标停留在搜索框中
			if(sinoMobileUtil.strIsNull(vv)||vv==sinoMobileConfig.CONST_KEYWORD_DEFAULT_TEXT){
				$("#"+sinoMobileConfig.CONST_KEYWORD_INPUT_FIELD).focus();
				return;
			}*/
			search.doSearch();
		
		}
		/**
		* 根据搜索条件执行搜索
		**/
		search.saveSessionDataJson=function(){
			sinoMobileUtil.saveSessionSearchDataJson(searchRecord.toJsonString());
		}
		search.doSearch=function(){	
			sinoMobileUI.hideEmptyMsg();
			//搜索从第一页开始	
			search.setCurrPage("1");
			//搜索前缓冲数据	
			search.saveSessionDataJson();
			//alert(sinoMobileUtil.getSessionSearchDataJson());
			//打开产品列表
			sinoMobileUI.doOpenProductListPage();
		}
		search.getProductSearchKeyword=function(){
			var vv=$("#keywordInput").val();
			return (vv==sinoMobileConfig.CONST_KEYWORD_DEFAULT_TEXT||vv==sinoMobileConfig.CONST_KEYWORD_DEFAULT_TEXT2)?"":vv;
		}
		search.doProductSearch=function(){
			var keyWord=search.getProductSearchKeyword();
			if(sinoMobileUtil.strIsNull(keyWord)){
				sinoMobileUI.alert("请输入搜索条件");
				$("#keywordInput").focus();
				return;
			}
			search.removeSessionData();
			search.setSearchKeyword(keyWord);

			sinoMobileUI.hideEmptyMsg();
			//搜索从第一页开始	
			search.setCurrPage("1");
			//搜索前缓冲数据	
			search.saveSessionDataJson();
			//alert(sinoMobileUtil.getSessionSearchDataJson());
			//打开产品列表
			sinoMobileUI.doOpenProductListPage();
		
		}
		search.doLoadNextPage=function(){
			
			//上次未加载完毕，则不响应
			if(!loadReady){
				return;
			}
			
			var page=search.getCurrPage();
			if(sinoMobileUtil.strIsNull(page)){
				page=1;
			}else{
				page=page*1;
			}
			page=page+1;
			//如果到达最后一页，则不继续加载数据
			if(page>totalPage){
				return;
			}
			loadReady=false;
			
			//搜索从第一页开始	
			search.setCurrPage(page);
			//搜索前缓冲数据	
			search.saveSessionDataJson();
			$(".onLoad-next").show();
			search.loadDataFromServer();
		}
		
		/**
		* 执行分类及排序点击事件
		**/
        search.doClickSort=function(obj,type){
			
			search.setPhoneSort(type);
			var clsName=$(obj).attr("class");

			if(clsName=="up"){				
				$(obj).attr("class","upon");
				search.setPhoneSortUpOrDown("1");
			}else if(clsName=="down"){				
				$(obj).attr("class","downon");
				search.setPhoneSortUpOrDown("2");
			}else if(clsName=="upon"){	
				$(obj).attr("class","downon");
				search.setPhoneSortUpOrDown("2");	
				
			}else if(clsName=="downon"){				
				$(obj).attr("class","upon");
				search.setPhoneSortUpOrDown("1");
			}
			search.setCurrPage("1");

			search.doSearch();
		} 

		search.doCancelConditon=function(){
			search.initDicCondition();
			search.saveSessionDataJson();
			search.doSearch();		
		}
		search.doSelectDic=function(title,vv){				
			var dicName=$("#dicType").val();
			if(dicName=="price"){
				if(title==sinoMobileUtil.CONST_SEARCH_DIC_ALL){
					vv=""
				}else{
					vv=title;
				}
				search.doSelectPrice(title,vv)
			}else if(dicName=="cpu"){
				search.doSelectCpu(title,vv)
			}else if(dicName=="screen"){
				search.doSelectScreenSize(title,vv)
			}else if(dicName=="brand"){
				search.doSelectBrandType(title,vv)
			}
		}

		search.doSelectCategory=function(title,vv){				
			var dicName=$("#dicType").val();
			search.initDicCondition();
			if(dicName=="brand"){
				search.setBrandTypeValue(vv);
				search.setBrandTitle(title);
				search.setVendorId("");
				search.doSearch();
			}else if(dicName=="vendor"){
				search.setBrandTypeValue("");
				search.setBrandTitle("");
				search.setVendorId(vv);
				search.doSearch();
			}
		}

		/**
		* 选择价格字典值
		**/
		search.doSelectPrice=function(title,vv){
			if(sinoMobileUtil.strIsNull(vv)){
				search.setPriceStart("");
				search.setPriceEnd("");

			}else{
				var range=sinoMobileUtil.getDicRange(vv);
				if(range!=null){
					search.setPriceStart(range.from);
					search.setPriceEnd(range.to);
				}else{
					search.setPriceStart(vv);
					search.setPriceEnd("");
				}
			}
			search.setPriceTitle(title);
			search.saveSessionDataJson();
			sinoMobileUI.doOpenDicFilterPage();
		}
		/**
		* 选择手机类型字典值
		**/
		search.doSelectBrandType=function(title,vv){			
			search.setBrandTypeValue(vv);
			search.setBrandTitle(title);
			
			search.saveSessionDataJson();
			sinoMobileUI.doOpenDicFilterPage();
		}
		/**
		* 选择屏幕规格字典值
		**/
		search.doSelectScreenSize=function(title,vv){			
			if(sinoMobileUtil.strIsNull(vv)){
				search.setPhoneScreenSizeStart("");
				search.setPhoneScreenSizeEnd("");
			}else{
				var range=sinoMobileUtil.getDicRange(vv);
				if(range!=null){
					search.setPhoneScreenSizeStart(range.from);
					search.setPhoneScreenSizeEnd(range.to);
				}else{
					search.setPhoneScreenSizeStart(vv);
					search.setPhoneScreenSizeEnd();
				}				
			}
			search.setScreenTitle(title);
			search.saveSessionDataJson();
			sinoMobileUI.doOpenDicFilterPage();
		}
		/**
		* 选择CPU字典值
		**/
		search.doSelectCpu=function(title,vv){
			
			search.setPhoneCpu(vv);
			search.setCpuTitle(title);
			search.saveSessionDataJson();
			sinoMobileUI.doOpenDicFilterPage();
		}

		

		/**
		* 搜素选择页加载显示
		**/
		search.loadConditions=function(){		
			search.init();
		    var priceTag=sinoMobileUtil.getSafeString(search.getPriceTitle());
			var brandTag=sinoMobileUtil.getSafeString(search.getBrandTitle());
			var cpuTag=sinoMobileUtil.getSafeString(search.getCpuTitle());
			var screenTag=sinoMobileUtil.getSafeString(search.getScreenTitle());
			
			if(sinoMobileUtil.strIsNull(priceTag)){
				priceTag=sinoMobileConfig.CONST_SEARCH_DIC_ALL;
			}
			if(sinoMobileUtil.strIsNull(brandTag)){
				brandTag=sinoMobileConfig.CONST_SEARCH_DIC_ALL;
			}
			if(sinoMobileUtil.strIsNull(cpuTag)){
				cpuTag=sinoMobileConfig.CONST_SEARCH_DIC_ALL;
			}
			if(sinoMobileUtil.strIsNull(screenTag)){
				screenTag=sinoMobileConfig.CONST_SEARCH_DIC_ALL;
			}

			$("#brandTag").html(brandTag);
			$("#priceTag").html(priceTag);
			$("#screenTag").html(screenTag);
			$("#cpuTag").html(cpuTag);
		}
		/**
		* 打开字典
		**/
		search.doOpenDic=function(dicName){
			sinoMobileUI.doOpenDicChosePage(dicName);		
		}
		search.loadDic=function(dicName){
			//先清空界面数据
			$("#dicList").html("");
			search.init();
			var dic=hntcMemDic.createNew();
			var title="";
			if(dicName=="price"){
				title=memConfig.CONST_MEM_TITLE_PRICE;
				dic.loadPriceGroup(search.printDicNormal);
			}else if(dicName=="cpu"){
				title=memConfig.CONST_MEM_TITLE_CPU;
				dic.loadCpuGroup(search.printDicNormal);
			}else if(dicName=="screen"){
				title=memConfig.CONST_MEM_TITLE_SCREEN;
				dic.loadScreenGroup(search.printDicNormal);
			}else if(dicName=="brand"){
				title=memConfig.CONST_MEM_TITLE_BRAND;
				dic.loadBrand(search.printDicBrand);
			}else if(dicName=="vendor"){
				title=memConfig.CONST_MEM_DIC_VENDOR;
				dic.loadVendor(search.printDicVendor);
			}	
			$("#dicTitle").html(title+"选择");
		}
		/**
		* 获取打印字典列表条目模板
		**/
		search.getPrintTemplate=function(){
			return $("#template").html();
		}
		/**
		* 获取打印字典详细列表标识
		**/
		search.getPrintTag=function(){
			return $("#dicList");
		}
		/**
		* 根据传入数据格式化，打印文本
		**/
		search.formateTemplate=function(template,title,value,img){
			var fmtStr=template;
			fmtStr=fmtStr.replaceAll("{title}",title);
			fmtStr=fmtStr.replaceAll("{value}",value);
			fmtStr=fmtStr.replaceAll("{imgUrl}",img);
			fmtStr=fmtStr.replaceAll("{error}","sinoMobileSearch.loadImgError(this)");
			return fmtStr;
		}
		search.loadImgError=function(obj){
			obj.src=""
		}
		/**
		* 打印通用字典
		**/
		search.printDicNormal=function(recs){
		   var template=search.getPrintTemplate();
		   var objPrintTag=search.getPrintTag();
		   if(recs==null||recs.getLength()==0){
				return;
		   }
		   var nn=recs.getLength();
		   var html="";
		   var rec=null;
		   for(var ii=1;ii<=nn;ii++){
			  rec=recs.getNthRecord(ii);
			  html=search.formateTemplate(template,rec.getValue("stateValue"),rec.getValue("stateCode"),rec.getValue("imgUrl"));
			  objPrintTag.append(html+"\r");	
		   }
		   $(".onLoad").hide();
		}
		/**
		* 打印品牌字典
		**/
		search.printDicBrand=function(recs){
			var template=search.getPrintTemplate();
			var objPrintTag=search.getPrintTag();
			if(recs==null||recs.getLength()==0){
				return;
			}
			var brandTypeValue=search.getBrandTypeValue();
			var nn=recs.getLength();
			var html="";
			var rec=null;
			for(var ii=1;ii<=nn;ii++){
			  rec=recs.getNthRecord(ii);
			  rec.addField("imgUrl","../../images/brand/"+rec.getValue("brandTypeValue")+".jpg");
			  html=search.formateTemplate(template,rec.getValue("brandTypeName"),rec.getValue("brandTypeValue"),rec.getValue("imgUrl"));
			   /* 选准样式无用
			  if(brandTypeName==rec.getValue("brandTypeValue")){
				html=html.replace("<li ","<li class=\"on\" ");
				alert(html);
			  }*/
			  objPrintTag.append(html+"\r");	
			}
			$(".onLoad").hide();
		}
		/**
		* 打印供应商字典
		**/
		search.printDicVendor=function(recs){
			var vendorId=search.getVendorId();
			
			var template=search.getPrintTemplate();
			var objPrintTag=search.getPrintTag();
			if(recs==null||recs.getLength()==0){
				return;
			}
			
			var nn=recs.getLength();
			var html="";
			var rec=null;
			for(var ii=1;ii<=nn;ii++){
			  rec=recs.getNthRecord(ii);
			  rec.addField("imgUrl","../../images/vendor/"+rec.getValue("vendorId")+".jpg");
			  html=search.formateTemplate(template,rec.getValue("vendorNameAlt"),rec.getValue("vendorId"),rec.getValue("imgUrl"));
			  /* 选准样式无用
			  if(vendorId+""==rec.getValue("vendorId")+""){
				html=html.replace("<li ","<li class=\"on\" ");
				alert(html);
			  }*/
			  objPrintTag.append(html+"\r");	
			}	
			$(".onLoad").hide();
		}
		search.doClickCategoryBrand=function(){
		     $("#brandDic").attr("class","on");
			 $("#brandDic").find("i").attr("class","icon_pinpai-on");
			 $("#vendorDic").attr("class","");
			 $("#vendorDic").find("i").attr("class","icon_Gys");	
			 var dicType="brand";
			 $("#dicType").val(dicType);
			 sinoMobileSearch.loadDic(dicType);
		}
		search.doClickCategoryVendor=function(){
			 $("#brandDic").attr("class","");
			 $("#brandDic").find("i").attr("class","icon_pinpai");	
			 $("#vendorDic").attr("class","on");
			 $("#vendorDic").find("i").attr("class","icon_Gys-on");
			 var dicType="vendor";
			 $("#dicType").val(dicType);
			 sinoMobileSearch.loadDic(dicType);
		}

		return search;

	}
}

var sinoMobileSearch=hnctSearch.createNew();
