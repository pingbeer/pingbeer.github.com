/**
*  Module: 加载主页数据
*  Author: Jintl
*  Create Time:2015-4-27
*  Last Modify Time: 2015-5-4
**/
var bannerTimer=null;

var hnctHomepage={
	createNew:function(){
		/**
		 * ++++++++++++++++++++++++++++
		 * 主页模块显示内容调用
		 * +++++++++++++++++++++++++++++
		GET_BANNER   		---------广告位
		GET_INFO			---------通知
		GET_FLASH_SALE		---------抢购
		GET_GROUP_PURCHASE	---------团购
		GET_ONE_FLOOR		---------低端机型
		GET_TWO_FLOOR		---------中端机型
		GET_THEE_FLOOR		---------高档机型
		GET_BRAND			---------品牌机
		GET_VENDOR			---------供应商
		*/
		/**
		* 以下为广告位图片加载成功状态标志
		**/
		var banner1=false;
		var banner2=false;
		var banner3=false;
		var banner4=false;
		var banner5=false;
		var banner6=false;
	
		
		var bannerInterval=1000;
        //公告切换时间间隔
		var changeNoticeTime=3000;
		//公告记录集
		var recsNotice=null;
		//当前显示公告位
		var changeNoticeCurrent=0;

		var homepage={};
		////全局变量，记录抢购到期时间
		var flashSaleEndTime=null;
        homepage.loadSection1=function(){
			var jsonBanner=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_BANNER);
			var jsonInfo  =sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_INFO);
            //从缓冲中读取数据
			if(sinoMobileConfig.CONST_SESSION_CACHE_HOME==true&&!sinoMobileUtil.strIsNull(jsonBanner)&&!sinoMobileUtil.strIsNull(jsonInfo)
				&&jsonBanner!="[]"&&jsonInfo!="[]"){
				$(".onLoad").hide();
				homepage.printPopBanner();
				homepage.printBanner();
				//轮询
				//bannerTimer = setInterval(homepageLoader.imageBannerLoader,bannerInterval);
				homepage.onBannerLoaded();
				//公告					
				homepage.printInfo();
				homepage.loadSection2();
				
			}else{
				var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
				sinoMobileUtil.ajaxCall(strUrl,"GET_BANNER;GET_INFO;GET_POP_BANNER","",homepage.loadSectionSuccess1,homepage.loadError); 
			}
		}; 
		homepage.loadSection2=function(){
			var flashSale		=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_FLASH_SALE);
			var groupPurchase   =sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_GROUP_PURCHASE);
			if(sinoMobileConfig.CONST_SESSION_CACHE_HOME&&!sinoMobileUtil.strIsNull(flashSale)&&!sinoMobileUtil.strIsNull(groupPurchase)
				&&flashSale!="[]"&&groupPurchase!="[]"){
				homepage.printFlashSale();
				homepage.printGroupPurchase();
				$(".groupPurchase").show();
				homepage.loadSection3();
			}else{
				var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
				sinoMobileUtil.ajaxCall(strUrl,"GET_FLASH_SALE;GET_GROUP_PURCHASE","",homepage.loadSectionSuccess2,homepage.loadError);
			}
		
		};
		/**
		* 入门智能机
		**/
		homepage.loadSection3=function(){
			var oneFloor=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_ONE_FLOOR);
			if(sinoMobileConfig.CONST_SESSION_CACHE_HOME&&!sinoMobileUtil.strIsNull(oneFloor)&&oneFloor!="[]"){
				homepage.printOneFloor();				
				$(".oneFloor").show();
				homepage.loadSection4();	
			}else{
				var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
				sinoMobileUtil.ajaxCall(strUrl,"GET_ONE_FLOOR","",homepage.loadSectionSuccess3,homepage.loadError);
			}
		
		};
		/**
		* 中端智能机
		**/
		homepage.loadSection4=function(){
			var twoFloor=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_TWO_FLOOR);
			if(sinoMobileConfig.CONST_SESSION_CACHE_HOME&&!sinoMobileUtil.strIsNull(twoFloor)&&twoFloor!="[]"){
				homepage.printTwoFloor();
				$(".twoFloor").show();
				homepage.loadSection5();	
			}else{
				if(twoFloor == "[]"){
					$("#twoFloor_1_Detail").hide();
				}
				var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
				sinoMobileUtil.ajaxCall(strUrl,"GET_TWO_FLOOR","",homepage.loadSectionSuccess4,homepage.loadError); 
			}
		
		};
		/**
		* 高端智能机
		**/
		homepage.loadSection5=function(){
			var threeFloor=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_THREE_FLOOR);
			if(sinoMobileConfig.CONST_SESSION_CACHE_HOME&&!sinoMobileUtil.strIsNull(threeFloor)&&threeFloor!="[]"){
				homepage.printThreeFloor();
				$(".threeFloor").show();
				$(".buttomMenu").show();	
				homepage.loadSection5();
			}else{
				var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
				sinoMobileUtil.ajaxCall(strUrl,"GET_THREE_FLOOR","",homepage.loadSectionSuccess5,homepage.loadError);
			}
		
		};
		
		
		//首页热销排行榜
		homepage.loadHotSaleTopList=function(){
			var strUrl=sinoMobileUtil.getHostURL()+sinoMobileConfig.CONST_SERVLET_HOMEPAGE;
			sinoMobileUtil.ajaxCall(strUrl,"GET_HOT_SALE_TOP","",homepage.loadSaleHotTopListSuccess,homepage.loadError); 		
		};
		homepage.loadSaleHotTopListSuccess=function(data){
			//该回调函数赞未实现
		}
		
		homepage.loadSectionSuccess1=function(data){
			if(data==null){
				homepage.loadSection2();
				return;
			}
			if(data.code+"" == "1"){

				 //弹出广告
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_POP_BANNER,sinoMobileUtil.getJsonStringFromResponseData(data,"popBannerData"));
				homepage.printPopBanner();

			    //广告
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_BANNER,sinoMobileUtil.getJsonStringFromResponseData(data,"bannerData"));
				homepage.printBanner();
                
				//轮询
				//bannerTimer = setInterval(homepageLoader.imageBannerLoader,bannerInterval);
				 homepage.onBannerLoaded();
				
				//公告
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_INFO,sinoMobileUtil.getJsonStringFromResponseData(data,"infoData"));				
				homepage.printInfo();
				
				//加载第2块内容
				homepage.loadSection2();
			}else{
				sinoMobileUI.alert("加载主页区块1，出现错误！"+data.msg);
				
			}
		
		}
		homepage.loadSectionSuccess2=function(data){
			if(data.code+"" == "1"){
				//抢购
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_FLASH_SALE,sinoMobileUtil.getJsonStringFromResponseData(data,"flashSaleData"));
				homepage.printFlashSale();
				//团购
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_GROUP_PURCHASE,sinoMobileUtil.getJsonStringFromResponseData(data,"groupPurchaseData"));
				homepage.printGroupPurchase();

				
				homepage.loadSection3();
			}else{
				sinoMobileUI.alert("加载主页区块2，出现错误！"+data.msg);
				
			}
		
		}
		homepage.loadSectionSuccess3=function(data){
			if(data.code+"" == "1"){
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_ONE_FLOOR,sinoMobileUtil.getJsonStringFromResponseData(data,"oneFloorData"));
				homepage.printOneFloor();
				$(".onLoad").hide();
				$(".oneFloor").show();
				homepage.loadSection4();
			}else{
				sinoMobileUI.alert("加载入门智能机，出现错误！"+data.msg);
				
			}
		
		}	
		homepage.loadSectionSuccess4=function(data){
			if(data.code+"" == "1"){				
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_TWO_FLOOR,sinoMobileUtil.getJsonStringFromResponseData(data,"twoFloorData"));
				homepage.printTwoFloor();
				$(".twoFloor").show();
				homepage.loadSection5();
			}else{
				sinoMobileUI.alert("加载中端智能机器，出现错误！"+data.msg);
				
			}
		
		}	
		homepage.loadSectionSuccess5=function(data){
			if(data.code+"" == "1"){

				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_HOME_THREE_FLOOR,sinoMobileUtil.getJsonStringFromResponseData(data,"threeFloorData"));
				homepage.printThreeFloor();
				$(".threeFloor").show();
				$(".buttomMenu").show();
			}else{
				sinoMobileUI.alert("加载高端智能机器，出现错误！"+data.msg);
				
			}
		
		}	
		homepage.loadError=function (result, textStatus, errorThrown){	
				
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
						sinoMobileUtil.autoLogin("");
					}else if(httpErrorCode=="404"){
						//session失效，重新登录
						//sinoMobileUtil.autoLogin("");
						//sinoMobileUI.alert("服务器没有响应，或访问地址不可用！");
						sinoMobileUI.doOpen404Page();
					}else if(httpErrorCode=="200" || httpErrorCode=="401" ){
						//sinoMobileUI.alert("内部错误：！");
					}else{
						sinoMobileUI.alert("服务器返回错误，操作不能继续！") ;
					}
				}
		}
		
		
		/**
		 * 1.打印首页广告位
		 * @param data
		 */
		homepage.printBanner=function(){
		   var json=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_BANNER);
		   var recs=new Records();
		   recs.fromJsonString(json);
		   if(recs==null||recs.getLength()<=0){
			 return;
		   }
		   var nLen=recs.getLength();
		   var imageValue="";
		   var rec=null;
		   var templateHtml=$("#bannerTemplate").html();
		   var bannerList=$("#bannerList");
		   var html="";
		
		   for(var nn=1;nn<=nLen;nn++){
				/*rec=recs.getNthRecord(nn);
				imageValue=rec.getValue("imageUrl");	
				imageValue=homepage.getBannerImgUrl(imageValue);
					rec.setField("imageUrl",imageValue);
				rec.addField("id","bannerImg_"+nn);
				rec.addField("onloadFnc","homepageLoader.onloadBannerImage("+nn+")");				
				html=templateHtml;
				html=sinoMobileUtil.getFormatedTemplateHtml(html,rec);						
				bannerList.append(html+"\r");*/
				
				rec=recs.getNthRecord(nn);
				htmlValue=rec.getValue("imageUrl");	
				htmlValue=homepage.getBannerImgUrl(htmlValue);
				$("#bannerImg_"+nn).data("json",rec.toJsonString());
				$("#bannerImg_"+nn).attr("src",htmlValue);
		   }
		
		}
		/**
		 * 2. 打印首页公告
		 * @param data
		 */
		homepage.printInfo=function(){
		   var json=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_INFO);
		   var recs=new Records();
		   recs.fromJsonString(json);
		  /* if(recs==null||recs.getLength()<=0){
			 return;
		   }
		   var nLen=recs.getLength();
		   var htmlValue="";
		   var rec=null;
		   for(var nn=1;nn<=nLen;nn++){
				rec=recs.getNthRecord(nn);
				htmlValue=rec.getValue("title");
				$("#noticeInfo_"+nn).data("json",rec.toJsonString());
				$("#noticeInfo_"+nn+"_Title").html(htmlValue);	
				htmlValue=homepage.getFormatDate(rec.getValue("publishDate"));
				$("#noticeInfo_"+nn+"_PublishDate").html(htmlValue);	
		   }*/
		   recsNotice=recs;
		   if(recs!=null&&recs.getLength()>0){
			   setInterval(homepage.changeNoticeText,changeNoticeTime);
		   }		
		}

		/**
		 * 3.打印首页抢购
		 * @param data
		 */
		homepage.printFlashSale=function(){
			var json=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_FLASH_SALE);
		    var recs=new Records();
		    recs.fromJsonString(json);

			if(recs==null||recs.getLength()<=0){
				return;
			}
			var nLen=recs.getLength();
			var htmlValue="";
			var rec=null;
			idName="#flashSale_1";
			rec=recs.getNthRecord(1);

			$(idName).data("itemId",rec.getValue("itemId"));
			$(idName).data("vendorId",rec.getValue("vendorId"));
			$(idName).data("vendorType",rec.getValue("vendorType"));
			$(idName).data("lineId",rec.getValue("lineId"));
			$(idName).data("saleControl",rec.getValue("saleControl"));
			$(idName).data("promoteEndDate",rec.getValue("promoteEndDate"));

			htmlValue=rec.getValue("brandName");
			$(idName+"_BrandName").html(htmlValue);
			htmlValue=rec.getValue("itemName");		
			$(idName+"_ItemName").html(htmlValue);
			htmlValue=rec.getValue("peopleNumber");	
			$(idName+"_PeopleNumber").html(htmlValue);				
			htmlValue=rec.getValue("currentPrice");	
			$(idName+"_Price").html(htmlValue);
			htmlValue=rec.getValue("imageUrl");				
			$(idName+"_ImageUrl").attr("src",htmlValue);
			htmlValue=rec.getValue("promoteEndDate");



			//打印日期
			if(htmlValue!=null&&htmlValue!=""){
				flashSaleEndTime=sinoMobileUtil.str2DateTime(htmlValue);
				htmlValue=homepage.getRestTimeHtml();
				$(idName+"_Time").html(htmlValue);		
				var dtNow=new Date();
				//如果尚未到终止时间，则设置时钟倒计时
				if(dtNow.getTime()<flashSaleEndTime.getTime()){
					setInterval(homepage.printRestTimeHtml,1000);  
				}
			}
		   
		
		}
				//打印剩余时间
		homepage.printRestTimeHtml=function(){
			var htmlValue=homepage.getRestTimeHtml();	
			$("#flashSale_1_Time").html(htmlValue);		
		}
		
		/**
		 * 4.打印首页团购
		 * @param data
		 */
		homepage.printGroupPurchase=function(){

			var json=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_GROUP_PURCHASE);
		    var recs=new Records();
		    recs.fromJsonString(json);


		   if(recs==null||recs.getLength()<=0){			  
			 return;
		   }
		   var nLen=recs.getLength();
		   var htmlValue="";
		   var rec=null;
		   idName="#groupPurchase_";
		   for(var nn=1;nn<=nLen;nn++){
				rec=recs.getNthRecord(nn);
				$(idName+nn).data("itemId",rec.getValue("itemId"));
				$(idName+nn).data("vendorId",rec.getValue("vendorId"));
				$(idName+nn).data("vendorType",rec.getValue("vendorType"));
				$(idName+nn).data("vendorName",rec.getValue("vendorName"));
				$(idName+nn).data("lineId",rec.getValue("lineId"));
				
				htmlValue=rec.getValue("brandName");
				$(idName+nn+"_BrandName").html(htmlValue);
				htmlValue=rec.getValue("itemName");		
				$(idName+nn+"_ItemName").html(htmlValue);
				htmlValue=rec.getValue("peopleNumber");				
				$(idName+nn+"_PeopleNumber").html(htmlValue);				
				htmlValue=rec.getValue("currentPrice");	
				$(idName+nn+"_Price").html(htmlValue);
				htmlValue=rec.getValue("imageUrl");				
				$(idName+nn+"_ImageUrl").attr("src",htmlValue);		   
		   }
		   $(".groupPurchase").show();
		}
		homepage.printFloor=function(idName,recs){				
		   
		   if(recs==null||recs.getLength()<=0){
			 return;
		   }
		   var nLen=recs.getLength();
		   var htmlValue="";
		   var rec=null;
		   idName="#"+idName;
		   for(var nn=1;nn<=nLen;nn++){
				rec=recs.getNthRecord(nn);
				$(idName+nn).data("itemId",rec.getValue("itemId"));
				$(idName+nn).data("vendorId",rec.getValue("vendorId"));
				$(idName+nn).data("vendorType",rec.getValue("vendorType"));
				$(idName+nn).data("vendorName",rec.getValue("vendorName"));
				htmlValue=rec.getValue("ItemName");	
				$(idName+nn+"_ItemName").html(htmlValue);
				htmlValue=rec.getValue("BrandName");				
				$(idName+nn+"_BrandName").html(htmlValue);
				htmlValue=rec.getValue("Price");				
				$(idName+nn+"_Price").html(htmlValue);
				htmlValue=rec.getValue("ImageUrl");				
				$(idName+nn+"_ImageUrl").attr("src",htmlValue);	
				if(nn>=6){
					break;
				}
		   }	
		}
		/**
		 * 5.打印低档机型
		 * @param data
		 */
		homepage.printOneFloor=function(){
		   var json=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_ONE_FLOOR);
		   var recs=new Records();
		   recs.fromJsonString(json);
		   homepage.printFloor("oneFloor_",recs); 
		}
		/**
		 * 6.打印中档机型
		 */
		homepage.printTwoFloor=function(){
		   var json=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_TWO_FLOOR);		  
		   var recs=new Records();
		   recs.fromJsonString(json);		   
		   homepage.printFloor("twoFloor_",recs); 
		   
		}
		/**
		 * 7.打印高档机型
		 * @param data
		 */
		homepage.printThreeFloor=function(){
			var json=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_THREE_FLOOR);
		    var recs=new Records();
		    recs.fromJsonString(json);
			homepage.printFloor("threeFloor_",recs); 
		
		}
		
		
		/**
		 * 公告切动显示
		 * @param data
		 */
		
		homepage.changeNoticeText=function(){
			var nLen=recsNotice.getLength();
			if(changeNoticeCurrent>nLen||changeNoticeCurrent==0){
				changeNoticeCurrent=1;
			}
			
			var rec=recsNotice.getNthRecord(changeNoticeCurrent);
			if(rec!=null){
				$("#noticeInfo").html(rec.getValue("title"));
				//add by chenwj 2015/09/07 start
				//点击时打开公告列表
				$("#divNotice i").click(function(){
					sinoMobileUI.doOpenInfolistPage();
				});
				//公告点击时打开公告详细
				$("#noticeInfo").click( function(){
					 sinoMobileUI.doOpenInfoDetailPage(rec.getValue("publishId"));
					 }
					);
			    //add by chenwj 2015/09/07 end
			}
			changeNoticeCurrent=changeNoticeCurrent+1;			
		}
		homepage.getBannerImgUrl=function(url){			
			return sinoMobileUtil.getHostURL()+url;
		};
		homepage.getRestTimeHtml=function(){
			return sinoMobileUtil.getRestTimeHtmlByDateTime(flashSaleEndTime);		
		};
		homepage.getFormatDate=function(dtStr){
		    if(dtStr==null||dtStr==""){
				return "";
			}
			var dtDate=sinoMobileUtil.str2DateTime(dtStr);
			return dtDate.getMonth()+"月"+dtDate.getDay()+"日";
		};

		//在广告位图片加载成功后执行
		homepage.onBannerLoaded=function(){
			var viewSize=sinoMobileUtil.getViewSize();		
			var windowWidth=viewSize.w;		
			var imgHeight=(windowWidth/320)*100;	
			$("#sliderBanner").yxMobileSlider({width:windowWidth,height:imgHeight,during:5000});
			$("#defaultBanner").hide();	
			
		};	
		
		
		homepage.onloadBannerImage=function(index){
			switch(index){
				case 1:
					banner1=1;
				    break;
				case 2:
					banner2=2;
					break;
				case 3:
					banner3=3;
					break;
				case 4:
					banner4=4;
					break;
				case 5:
					banner5=5;
					break;
				case 6:
					banner6=6;
					break;
				default:
					break;
			}
		}
		homepage.imageBannerLoader=function(){
			//只有在图片全部加载完毕后，设置轮播
			if(banner1&&banner2&&banner3&&banner4&&banner5&&banner6){
				//移除定时器
				clearInterval(bannerTimer);
				homepage.onBannerLoaded();
			}	
		}
		homepage.doClickMobile=function(obj){		
			var itemId=$(obj).data("itemId");
			var vendorId=$(obj).data("vendorId");
			var vendorType=$(obj).data("vendorType");
			var vendorName=$(obj).data("vendorName");
			sinoMobileUI.doOpenProductInfo(itemId,vendorId,vendorType,vendorName);
		}
		//首页系统外机型
		homepage.doClickSysOutMobile=function(obj){		
			var itemId=$(obj).data("itemId");
			var vendorId=$(obj).data("vendorId");
			var vendorType=$(obj).data("vendorType");
			var vendorName=$(obj).data("vendorName");
			sinoMobileUI.doOpenSysOutProductInfo(itemId,vendorId,vendorType,vendorName);
		}
		homepage.doBannerImgClick=function(id){
			var obj=$('#'+id);	
		 	var data=JSON.parse(obj.data("json"));
			//if(data.categoryType!=2) return;
		 	if( data.vendorType=='') data.vendorType=1;
			var itemId=data.itemId;
			var vendorId=data.vendorId;
			var vendorType=data.vendorType;
			var vendorName=data.vendorName;
			sinoMobileUI.doOpenProductInfo(itemId,vendorId,vendorType,vendorName);
		
		}
		homepage.doOpenProductListByPriceRange=function(price){
			sinoMobileSearch.init();
			var range=sinoMobileUtil.getDicRange(price);			
			sinoMobileSearch.setPriceStart(range.from);
			sinoMobileSearch.setPriceEnd(range.to);
			sinoMobileSearch.setPriceTitle(price);
			sinoMobileSearch.setType("");
			sinoMobileSearch.doSearch();
		}
		
		//系统外终端列表
		homepage.doOpenSysOutProductList = function(type){
			sinoMobileSearch.init();
			sinoMobileSearch.setType(type);
			sinoMobileSearch.setPriceTitle("");
			sinoMobileSearch.doSearch();
		}
		/**
		 * 打印弹出广告位
		 */
		homepage.printPopBanner=function(){
		   var json=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_HOME_POP_BANNER);
		   console.log(json);
		   var recs=new Records();
		   recs.fromJsonString(json);
		   if(recs==null||recs.getLength()<=0){
			 return;
		   }
		   var nLen=recs.getLength();
		   var imageValue="";
		   var rec=null;;
		
		   for(var nn=1;nn<=nLen;nn++){
				rec=recs.getNthRecord(nn);
				htmlValue=rec.getValue("imageUrl");	
				htmlValue=homepage.getBannerImgUrl(htmlValue);
				$("#popBannerImg").data("json",rec.toJsonString());
				$("#popBannerImg").attr("src",htmlValue);
				$('#popBanner').show();
		   }
		
		}
		return homepage;	
	}

}
