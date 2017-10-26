angular.module('activityday.controllers', [])
.controller('allCtrl', function($scope,$state,actyService) {
    actyService.getActyList(function(data) {
		$scope.actyList = data.reply.actyList;
    });
    $scope.toProdList=function(actyObj){
		localStorage.actyId=actyObj.actyID;
		var orderType=parseInt(actyObj.orderType);
		if(orderType>=1010 && orderType<=1039){
			localStorage.actyType="true";
		}
		$state.go('prodList');
	};
	weShareTitle=localStorage.defaultShareTitle;
	weShareDesc=localStorage.defaultShareDesc;
	weShareUrl=localStorage.defaultShareUrl;
	weShareImgUrl=localStorage.defaultShareImgUrl;
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	if("1"==localStorage.isLogin){
		$scope.sharepop=false;
	}else{
		$scope.sharepop=true;
	}
	$scope.sharePop=function(){
		$scope.sharepop=false;
		localStorage.isLogin="1";
	}
})
.controller('exclusiveCtrl', function($scope,$state,actyService) {
	actyService.getActyList(function(data) {
		$scope.actyList = data.reply.actyList;
	});
	$scope.toProdList=function(actyObj){
		localStorage.actyId=actyObj.actyID;
		var orderType=parseInt(actyObj.orderType);
		if(orderType>=1010 && orderType<=1039){
			localStorage.actyType="true";
		}
		$state.go('prodList');
	};
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('allCardCtrl', function($scope,$state,actyService) {
	actyService.getActyList(function(data) {
		$scope.actyList = data.reply.actyList;
    });
	$scope.toProdList=function(actyObj){
		localStorage.actyId=actyObj.actyID;
		var orderType=parseInt(actyObj.orderType);
		if(orderType>=1010 && orderType<=1039){
			localStorage.actyType="true";
		}
		$state.go('prodList');
	};
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('niceLifeCtrl', function($scope,$state) { //惠生活
	wx.ready(function(){
		$scope.scanCode=function(){
			wx.scanQRCode({  
				needResult : 1, 					// 默认为0，扫描结果由微信处理，1则直接返回扫描结果，  
				scanType : [ "qrCode", "barCode" ], // 可以指定扫二维码还是一维码，默认二者都有  
				success : function(res) {  
					var scanResult = res.resultStr; 	// 当needResult 为 1 时，扫码返回的结果
					//alert("扫描成功!!!扫描码=" + scanResult); 					
					localStorage.mechId=scanResult.substr(3,7);//scanResult为MMC+posID(7位商户id+7位门店id+3位流水)
					$state.go('posPrecount');
				}  
			});
		}
	});
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
//活动组tab
.controller('actyGroupTabCtrl',function($scope,$state,$interval,$timeout,giftService,payService,cfpLoadingBar,actyService){
	if(!isEmpty(shareActy) && !isEmpty(shareActy[localStorage.actyId])){
 		localStorage.shareTitle=shareActy[localStorage.actyId].shareTitle;
 	 	localStorage.shareDesc=shareActy[localStorage.actyId].shareDesc;
 	 	try{
 	 		localStorage.shareUrl=eval(shareActy[localStorage.actyId].shareUrl);
 	 	}catch(exception){
 	 		localStorage.shareUrl=shareActy[localStorage.actyId].shareUrl;
 	 	}
 	 	localStorage.shareImgUrl=shareActy[localStorage.actyId].shareImgUrl;
 	 	weShareTitle=localStorage.shareTitle;
 		weShareDesc=localStorage.shareDesc;
 		weShareUrl=localStorage.shareUrl;
 		weShareImgUrl=localStorage.shareImgUrl;
 	}
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	
	if('0'==localStorage.index){
		$scope.tab1Class='prizesTab1Shadow';
		$scope.tab2Class='prizesTab2';
		$scope.sectionId='myPrizesSection';
	}else if('1'==localStorage.index){
		$scope.tab1Class='prizesTab1';
		$scope.tab2Class='prizesTab2Shadow';
		$scope.sectionId='myPrizesAccSection';
	}
	$scope.changeTab=function(actyGroup,index){
 		if(!isEmpty(actyGroup)&&!isEmpty(index+'')){
 			localStorage.actyId=actyGroup[index].actyID;
 			localStorage.actyGroupId=actyGroup[index].AGID;
 			localStorage.index=index;
 			$state.go('actyGroupTab',{},{reload: true});
 		}
 	};
	giftService.getActyGroupTab(function(data){
		$scope.prodList = data.reply.prodList;
		$scope.actyGroup= data.reply.actyList;
		$scope.giftGroupListMap= data.reply.giftGroupListMap;
	});
	$scope.showAll=function(){
		var swiper = new Swiper('#txtSwiper', {
	        scrollbar: '.swiper-scrollbar',
	        direction: 'vertical',
	        slidesPerView: 'auto',
	        mousewheelControl: true,
	        freeMode: true,
	        autoHeight: true,
	        scrollbarHide:true
	    });
	}
	if("mgm"==localStorage.templateType || "mgm2"==localStorage.templateType){
		var watch=$scope.$watch('qualfyLevel',function(){
			if(!isEmpty($scope.qualfyLevel)){
				$scope.prodList = $scope.prodList;
			}
			if(!isEmpty($scope.userQualifyTotal) && $scope.userQualifyTotal>0){
				actyService.sendMQ(function(data){});
			}
		});	
	}
	$scope.comparePrice=function(price,giftId,judgeOrder){
		var flag=false;
		var exchPrice=(isEmpty(price)||isEmpty(price.quality))?"0":price.quality.amt;
		var judgeResult=(judgeOrder=="true")?true:false;
		if("01"==$scope.qualfyLevel){
			flag=true;
			if(judgeResult||!isEmpty($scope.giftQualifyTotalMap[giftId]) && parseInt($scope.giftQualifyTotalMap[giftId])<parseInt(exchPrice)){
				flag=false;
			}
		}else if("03"==$scope.qualfyLevel){
			if(!judgeResult&&!isEmpty($scope.userQualifyTotal) &&parseInt($scope.userQualifyTotal)>=parseInt(exchPrice)){
				flag=true;
			}
		}else{}
		return flag;
	};
	$scope.prizeNote=function(exchPriceObj,giftId,judgeOrder){
		var exchPrice=(isEmpty(exchPriceObj)||isEmpty(exchPriceObj.quality))?"0":exchPriceObj.quality.amt;
		var note="";
		if(judgeOrder=="true"){
			note="已兑换";
		}else{
			if($scope.qualfyLevel=="01"){
				if(!isEmpty($scope.giftQuaMap)&&!isEmpty($scope.giftQuaMap[giftId])){
					note=angular.fromJson($scope.giftQuaMap[giftId]).qualifyDetail;
				}
			}else if($scope.qualfyLevel=="03"){
				var userQualifyTotal=$scope.userQualifyTotal||"0";
				var interval=parseInt(exchPrice)-parseInt(userQualifyTotal);
				if(interval>0){
					note="还差"+interval+"个人气值哦！";
				}
			}else{}
		}
		return note;
	};
	//弹出活动细则
	$scope.activityDetails=function(){
		var modal=document.getElementById("modal-5");
		modal.className +=" "+"md-show";
		var Romodal=document.getElementById("md-close");
		function removeClass(obj,cls){
			var reg=new RegExp('(\\s|^)'+ cls + '(\\s|$)');
			obj.className=obj.className.replace(reg,'');
		}
		Romodal.onclick=function(){
			removeClass(modal,'md-show');
		}
		var mySwiper = new Swiper('#swiper', {
			loop:true,
			pagination: '.swiper-pagination',
			autoplay: 1500,
			speed:1000,
			autoplayDisableOnInteraction: false,
		    direction: 'horizontal',
			mousewheelControl: true,
			watchSlidesProgress: true,
			onInit: function(swiper) {
				swiper.myactive = 0;
			},
			onProgress: function(swiper) {
				//console.log(swiper.myactive);
				for (var i = 0; i < swiper.slides.length; i++) {
					var slide = swiper.slides[i];
					var progress = slide.progress;
					var translate, boxShadow;			
					translate = progress * swiper.width * 0.3;
					scale = 1 - Math.min(Math.abs(progress * 0.6), 1);
					boxShadowOpacity = 0;
					slide.style.boxShadow = '0px 0px 10px rgba(0,0,0,' + boxShadowOpacity + ')';
					//console.log(swiper.myactive);
					var num=swiper.myactive;
					if (num==0)num=1;
					if (num==5)num=1;
					if (i == num) {
						es = slide.style;
						//es.opacity=scale;
						es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(' + (translate) + 'px,0,0) scale(' + scale + ')';
						es.zIndex=0;
					}else{
						es = slide.style;
						//es.opacity=1;
						es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform ='scale(' + scale + ')';
						es.zIndex=1;
					}
				}
			},
			onTransitionEnd: function(swiper, speed) {			
				var num=(swiper.activeIndex<=6)?swiper.activeIndex:8-swiper.activeIndex;				
				$("#prizesTag"+(num)).addClass("active");
				swiper.myactive = swiper.activeIndex;
			},
			onSetTransition: function(swiper, speed) {
				for (var i = 0; i < swiper.slides.length; i++) {
						$("#prizesTag"+(i+1)).removeClass("active");
						es = swiper.slides[i].style;
						es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
				}
			}		
			});
		//文本滚动域
	    var swiper = new Swiper('#txtSwiper1', {	    	
	        scrollbar: '.swiper-scrollbar',
	        direction: 'vertical',
	        slidesPerView: 'auto',
	        mousewheelControl: true,
	        freeMode: true,
	        autoHeight: true,
	        scrollbarHide:false,       
	        watchSlidesProgress: true,
	        onProgress: function(swiper, progress){
//	        	if(progress>1){
//	        		console.log("文本底部，注意，会多次触发！");
//	        	}
	        }        
	    });
	}
	$scope.backHome=function(){
		if("mgm"==localStorage.templateType){
			location.href=MGMHomeURL;
		} 
		if("mgm2"==localStorage.templateType){
			location.href=MGM2HomeURL;
		} 
 	};
 	$scope.backScore=function(){
 		if("mgm"==localStorage.templateType){
			location.href=MGMPopularityURL;
		} 
		if("mgm2"==localStorage.templateType){
			location.href=MGM2PopularityURL;
		} 
 	};
 	$scope.popClose=function(){
 		$scope.middleVarity.smsCode="";
 		$scope.isPopupResult=false;
 		$scope.isPopupChoseGift=false;
		$scope.pay_click=false;
		$scope.sub_click=false;
		if($scope.isReload){
	 		$state.go('actyGroupTab',{},{reload: true});
	 	}
 		if(!isCountDownTimes){
 			$scope.sendFlag=false;
 	 		$interval.cancel(timePromise);
 		}
 	};
 	$scope.choseGift=function(index){   //当前选中礼品的索引
 		$scope.currIndex=index;
 	}
 	$scope.giftOrder=function(giftItem){
 		if("true"==giftItem.isGroup){
 			$scope.currIndex=0;     //礼品组礼品默认选中项第一项
 			$scope.isPopupChoseGift=true;//礼品组礼品弹窗展示标识
 			$scope.giftItem=giftItem;
 			var groupId=giftItem.groupID;
 			$scope.giftListInGroup=$scope.giftGroupListMap[groupId];
 		}else{
 			$scope.subGiftOrder(giftItem);
 		}
 	};
 	$scope.subGiftOrder=function(giftItem){
 		$scope.isPopupChoseGift=false;   //选择礼品弹框消失
 		var price="";
 		var exchPrice=giftItem.exchPrice;
    	var exchNum=1;
 		if(isEmpty(exchPrice)){
 			$scope.isPay=false;
 		}else{
 			$scope.isPay=true;
 			$scope.payPageGiftName=giftItem.giftName;
 			$scope.payPagePrice=giftService.getGiftSumPrice(exchPrice[0],exchNum);
 		}
 		var payPageShowType="02";
 		if(!isEmpty(giftItem.giftListExchShowRule)){
 			payPageShowType=giftItem.giftListExchShowRule[0].payPageShowType;
 		}
		if(payPageShowType=="02"){
	    	$scope.sub_click=true;
	    	var groupId=giftItem.groupID ||"";
	    	var isCaptcha=false;
	    	cfpLoadingBar.start();
	    	giftService.order(giftItem.actyID,giftItem.giftID,groupId,giftItem.mchtID,exchNum,null,isCaptcha,function(data){
	    		$scope.succMess=data.reply.succMess;
	    		localStorage.orderId=data.reply.orderId;
	    		var isAsynchronous=data.reply.isAsynchronous;
				if(isAsynchronous){
					$timeout(function(){
        				queryOrderStatus(1,localStorage.orderId);
	     			},2000);
				}else{
					var orderCode=data.reply.orderCode;
					if(orderCode=="SSSSSS"){
						if($scope.isPay){
    						localStorage.removeItem("encryptMobile");
    						queryMobile(0);
						}else{
							cfpLoadingBar.complete();
							$scope.payTitle="恭喜您领取成功";
							$scope.payMessage=$scope.succMess;
							$scope.isReload=true;
							$scope.isPopupResult=true;
						}
					}else if(orderCode=="100151"){
						cfpLoadingBar.complete();
						$scope.payTitle="领取失败";
			    	    $scope.payMessage="您已经领取过了";
			    	    $scope.isReload=false;
						$scope.isPopupResult=true;
					}else{
						cfpLoadingBar.complete();
						$scope.payTitle="领取失败";
			    	    $scope.payMessage=data.reply.orderMessage;
						$scope.isReload=false;
						$scope.isPopupResult=true;
		 		    }
				}
    	   });
		}else{}
	};
 	function queryOrderStatus(countParam,orderIdParam){   
    	giftService.getStatus(orderIdParam,localStorage.userKey,null,function(data){
    		var retuCode=data.reply.retuCode;
    		if(retuCode=="100251" || data.reply.returnCode.code == 'LIMIT'){
    			if(countParam==3){
    				cfpLoadingBar.complete();
					$scope.payTitle="领取失败";
		    	    $scope.payMessage="领取失败！请重新领取";
					$scope.isReload=false;
					$scope.isPopupResult=true;
				}else{
					countParam++;
					$timeout(function(){
	     				 queryOrderStatus(countParam,orderIdParam);
	     			},2000);
				}
    		}else if(retuCode=="SSSSSS"){
				if($scope.isPay){
					localStorage.removeItem("encryptMobile");
					queryMobile(0);
				}else{
					cfpLoadingBar.complete();
					$scope.payTitle="恭喜您领取成功";
					$scope.payMessage=$scope.succMess;
					$scope.isReload=true;
					$scope.isPopupResult=true;
				}
    		}else if(retuCode=="100151"){
    			cfpLoadingBar.complete();
				$scope.payTitle="领取失败";
	    	    $scope.payMessage="您已经领取过了";
	    	    $scope.isReload=false;
				$scope.isPopupResult=true;
			}else{
    			cfpLoadingBar.complete();
				$scope.payTitle="领取失败";
	    	    $scope.payMessage=data.reply.returnMessage;
				$scope.isReload=false;
				$scope.isPopupResult=true;
    		}
    	});
   };
	$scope.reQueryMobile=function(){
		$scope.querying=true;
		$scope.mobileTipWords="获取中...";
		cfpLoadingBar.start();
		queryMobile(0);
	};
	function queryMobile(queryNum){     
		payService.getMobile(queryNum,function(data){
			var encryptMobile=data.reply.encryptMobile;
			if(isEmpty(encryptMobile)){
				if(queryNum==3){
					cfpLoadingBar.complete();
					$scope.querying=false;
					$scope.mobileTipWords="获取手机号";
					$scope.isPopupPayPage=true;
					$scope.mobileButton=true;
				}else{
					queryNum++;
					$timeout(function(){
						queryMobile(queryNum);
					},2000);
				}
			}else{
				cfpLoadingBar.complete();
				$scope.querying=false;
				$scope.mobileTipWords="获取手机号";
				$scope.encryptMobile=data.reply.encryptMobile;
				$scope.isPopupPayPage=true;
				$scope.mobileButton=false;
				$scope.sendFlag=false;
				$scope.isShowSendTip=false;
			}
		});
	};
	var countDownTimes=60;
	var timePromise;
	var isCountDownTimes;
	$scope.sendSMSCode=function($event){
		$event.stopPropagation();
		$event.preventDefault();
		isCountDownTimes=false;
		var mobile=$scope.encryptMobile;
		if(isEmpty(mobile)){
			$scope.payTitle="获取验证码失败";
    	    $scope.payMessage="手机号为空，请点击获取手机号";
			$scope.isReload=false;
			$scope.isPopupResult=true;
			$scope.mobileButton=true;
		}else{
			sendSMSCodeToServer(mobile,0);
		}
	};
	
	function sendSMSCodeToServer(mobile,queryNum){
		$scope.sendFlag=true;
		$scope.smsTxt="获取中……";
		payService.sendSMSCode(mobile,countDownTimes,function(data){
			if(data.reply.returnCode.code == 'LIMIT'){
				if(queryNum>=queryTotalNum){
					$scope.payTitle="获取验证码失败";
					$scope.payMessage="亲~，网络繁忙，请重新获取";
					$scope.isReload=false;
					$scope.isPopupResult=true;
					isCountDownTimes=false;
					$scope.sendFlag=false;
				}else{
					queryNum++;
					$timeout(function(){
						sendSMSCodeToServer(mobile,queryNum);
					},queryTime);
				}
			}else{
				var retCode=data.reply.retCode;		
				if(retCode=="1"){
					$scope.payTitle="获取验证码失败";       
					$scope.payMessage=data.reply.retMessage;
					$scope.isReload=false;
					$scope.isPopupResult=true;
					isCountDownTimes=true;
				}else{
					$scope.isShowSendTip=true;
				}
				var second = countDownTimes;
				$scope.smsTxt = second + " 秒后重发";  
				second--;
				timePromise = $interval(function(){  
					if(second==0){  
						$scope.sendFlag=false;
						$scope.isShowSendTip=false;
						second = countDownTimes;  
					}else{  
						$scope.smsTxt = second + " 秒后重发";  
						second--;
					}  
				},1000,countDownTimes);
			}
			
		});
	};
	
	var code;
	$scope.getSMSCode=function(smsCode){
		code=smsCode;
	};
	$scope.middleVarity={smsCode:code};
	$scope.payOrder=function(){
		var SMSCode=$scope.middleVarity.smsCode;
		if(isEmpty(SMSCode)){
			$scope.payTitle="领取失败";       
			$scope.payMessage="手机验证码不能为空";
			$scope.isReload=false;
			$scope.isPopupResult=true;
			isCountDownTimes=true;
		}else{
			isCountDownTimes=false;
			$scope.pay_click=true;
			cfpLoadingBar.start();
			payService.pay(null,SMSCode,null,function(data){
				var isAsynchronous=data.reply.isAsynchronous;
				if(isAsynchronous){
					$timeout(function(){
						queryPayStatus(1);
	     			},2000);
				}else{
					var payCode=data.reply.payCode;
					cfpLoadingBar.complete();
					if(payCode=="SSSSSS"){
						$scope.payTitle="恭喜您领取成功";       
						$scope.payMessage=$scope.succMess;
						$scope.isReload=true;
						$scope.isPopupPayPage=false;
						$scope.isPopupResult=true;
					}else{
						$scope.payTitle="领取失败";       
						$scope.payMessage=data.reply.payMessage;
						$scope.isReload=false;
						$scope.isPopupResult=true;
					}
				}
			});
		}
	};
	function queryPayStatus(countParam){
		var isPayAsyn=true;
		giftService.getStatus(localStorage.orderId,localStorage.userKey,isPayAsyn,function(data){
			var retuCode=data.reply.retuCode;
			if(retuCode=="100251" || data.reply.returnCode.code == 'LIMIT'){
				if(countParam==3){
					cfpLoadingBar.complete();
					var orderStatus=data.reply.orderStatus;
					if(orderStatus=="30" || data.reply.returnCode.code == 'LIMIT'){
						$scope.payTitle="领取中";       
						$scope.payMessage="领取中……，请稍候在我的礼品中查看";
						$scope.isReload=true;
						$scope.isPopupPayPage=false;
						$scope.isPopupResult=true;
					}else{
						$scope.payTitle="领取失败";       
						$scope.payMessage="领取失败！请重新操作";
						$scope.isReload=false;
						$scope.isPopupResult=true;
					}
				}else{
					countParam++;
					$timeout(function(){
						queryPayStatus(countParam);
					},2000);
				};
			}else if(retuCode=="SSSSSS"){
				cfpLoadingBar.complete();
				$scope.payTitle="恭喜您领取成功";       
				$scope.payMessage=$scope.succMess;
				$scope.isReload=true;
				$scope.isPopupPayPage=false;
				$scope.isPopupResult=true;
			}else{
				cfpLoadingBar.complete();
				$scope.payTitle="领取失败";       
				$scope.payMessage=data.reply.returnMessage;
				$scope.isReload=false;
				$scope.isPopupResult=true;
			}
		})
	};
})
//资质礼品列表
.controller('prodListGiftCtrl',function($scope,$state,giftService){
	giftService.getProdList(function(data){
		$scope.prodList = data.reply.prodList;
	});
	$scope.buttonName=function(item){
		var btnName="立即兑换";
		if(!isEmpty(localStorage.userKey) && "true"==localStorage.actyType && isEmpty($scope.userQualifyTotal)){
			btnName="查询资质信息";
		}else{
			if("03"==item.exchMode){
				btnName="查看详情";
			}else{
				btnName="立即兑换";
			}
		}
		return btnName;
	};
})
//资质页
.controller('prodListCtrl',function($scope,$state,giftService,$timeout,cfpLoadingBar){
	$scope.channelType=localStorage.ChannelType;
	if("true"!=localStorage.actyType){
		$scope.actyType=false;
		$scope.isQualify=false;
		$scope.isShowDetail=false;
		$scope.searching=false;
	}else{
		//活动资质页面DOM生成之后，显示是否有资质，是否重试
		if('mgm'==localStorage.templateType || "mgm2"==localStorage.templateType){
			queryQualifyTotal(0,0);
		}else{
			//两次查询资质间隔小于10分钟且这个活动的资质已经缓存在本地localStorage里
			var qualify=localStorage.getItem(localStorage.actyId);
			//初始化noQualify
			$scope.noQualify=false;
			if(!isEmpty(qualify)){
				//当前活动的资质的缓存信息
				var qualifyObj=JSON.parse(qualify);
				var lastQualifyTime=qualifyObj.reply.lastQualifyTime;
				if(!isInterval(lastQualifyTime)){
					var userQualifyTotal=qualifyObj.reply.userQualifyTotal;
					$scope.userQualifyTotal=userQualifyTotal;
					if(localStorage.UIFlag=="0202" || localStorage.UIFlag=="0102" ||!isEmpty(userQualifyTotal) || qualifyObj.reply.qualfyLevel=="01"){
						qualifyTotalDeal(qualifyObj);	
					}
					//当前活动需要资质而且该用户没有资质或者资质为0时，按钮为灰色
					if((localStorage.UIFlag=="0202" || localStorage.UIFlag=="0102"||$scope.userQualifyTotal<=0)&& "true"==localStorage.actyType){
						$scope.noQualify=true;
					}
				}else{
					giftService.getQualify(0,0,function(data) {
						var userQualifyTotal=data.reply.userQualifyTotal;
						$scope.userQualifyTotal=userQualifyTotal;
						if(localStorage.UIFlag=="0202" || localStorage.UIFlag=="0102" ||!isEmpty(userQualifyTotal) || data.reply.qualfyLevel=="01"){
							qualifyTotalDeal(data);	
							//当资质查询回来的时候,把活动的actyID当作KEY,资质当作value存入缓存中,并且记录查询资质时间
							data.reply.lastQualifyTime=new Date().getTime();
							localStorage.setItem(localStorage.actyId,JSON.stringify(data));
						}
						//当前活动需要资质而且该用户没有资质或者资质为0时，按钮为灰色
						if((localStorage.UIFlag=="0202" || localStorage.UIFlag=="0102"||$scope.userQualifyTotal<=0)&& "true"==localStorage.actyType){
							$scope.noQualify=true;
						}
					});
				}
			}else{
				giftService.getQualify(0,0,function(data) {
					var userQualifyTotal=data.reply.userQualifyTotal;
					$scope.userQualifyTotal=userQualifyTotal;
					if(localStorage.UIFlag=="0202" || localStorage.UIFlag=="0102" ||!isEmpty(userQualifyTotal) || data.reply.qualfyLevel=="01"){
						qualifyTotalDeal(data);	
						//当资质查询回来的时候,把活动的actyID当作KEY,资质当作value存入缓存中,并且记录查询资质时间
						data.reply.lastQualifyTime=new Date().getTime();
						localStorage.setItem(localStorage.actyId,JSON.stringify(data));
					}
					//当前活动需要资质而且该用户没有资质或者资质为0时，按钮为灰色
					if((localStorage.UIFlag=="0202" || localStorage.UIFlag=="0102"||$scope.userQualifyTotal<=0)&& "true"==localStorage.actyType){
						$scope.noQualify=true;
					}
				});
			}	
		}
	}
	function queryQualifyTotal(detailFlag,queryNum){
		if(queryNum == 0){cfpLoadingBar.start();}
		giftService.getQualify(detailFlag,queryNum,function(data) {
			var userQualifyTotal=data.reply.userQualifyTotal;	
			$scope.userQualifyTotal=userQualifyTotal;
			var isAsyn=data.reply.isAsyn;
			//当前活动需要资质而且该用户没有资质或者资质为0时，按钮为灰色
			if((localStorage.UIFlag=="0202" || localStorage.UIFlag=="0102"||$scope.userQualifyTotal<=0)&& "true"==localStorage.actyType){
				$scope.noQualify=true;
			}
			if(data.reply.qualfyLevel=="01"){
				cfpLoadingBar.complete();
				qualifyTotalDeal(data);
				data.reply.lastQualifyTime=new Date().getTime();
				localStorage.setItem(localStorage.actyId,JSON.stringify(data));
			}else{
				if(isEmpty(userQualifyTotal) || data.reply.limitCode=='LIMIT' || data.reply.returnCode.code == 'LIMIT'){
					$scope.titleShow="正在查询中......";
					queryNum++;	
					 var timer = $timeout(function(){
							queryQualifyTotal(0,queryNum);
						},queryTime);
					if(queryNum==queryTotalNum){
						$timeout.cancel(timer);
						cfpLoadingBar.complete();
						$scope.titleShow="活动火爆,请点击此处重试...";
						$scope.searching=true;							
					}
				}else{
					cfpLoadingBar.complete();
					qualifyTotalDeal(data);
					data.reply.lastQualifyTime=new Date().getTime();
					localStorage.setItem(localStorage.actyId,JSON.stringify(data));
					$scope.searching=false;	
				};
			}
		});
	}
//	重新请求轮询后台查询资质
	$scope.requestAgain = function(){
		queryQualifyTotal(0,0);		
	}
	function qualifyTotalDeal(data){    //资质总额数据处理
		var actyQuaMap = data.reply.actyQuaMap;
		if(!isEmpty(actyQuaMap)){
			localStorage.qualfyType=actyQuaMap.qualfyType;       
			localStorage.isShowTotal=actyQuaMap.isShowTotal;
		 	localStorage.qualifyUnit=actyQuaMap.qualfyCompany;
		}
		$scope.actyType=data.reply.actyType;
	 	$scope.isQualify=data.reply.isQualify;
	 	localStorage.isQualify=$scope.isQualify;
	 	var isShowDetail=data.reply.isShowDetail;
		var userQualifyTotal=data.reply.userQualifyTotal;
		if(userQualifyTotal<0){
			userQualifyTotal=0;
	 	}
		if('mgm'==localStorage.templateType || "mgm2"==localStorage.templateType){
			$scope.$parent.qualfyLevel=data.reply.qualfyLevel;
			$scope.$parent.giftQuaMap=data.reply.giftQuaMap;
			$scope.$parent.giftQualifyTotalMap=data.reply.giftQualifyTotalMap;   //礼品级;
			$scope.$parent.userQualifyTotal= userQualifyTotal;           //活动级
		}		
	 	if($scope.isQualify){
	 		$scope.isQueryDetail=isShowDetail;
	 		if(actyQuaMap.isShowTotal=="01"){
	 			$scope.title=actyQuaMap.qualifyedTitle+"："+userQualifyTotal+" "+actyQuaMap.qualfyCompany;
	 		}else{
	 			$scope.title=actyQuaMap.qualifyedTitle;
	 		}
	 	}else{
	 		if(!isEmpty(actyQuaMap)){
	 			$scope.isShowDetail=isShowDetail;
		 		$scope.title=actyQuaMap.qualifyTitle;
		 		$scope.qualifyDetail=actyQuaMap.qualifyDetail;
	 		};
	 	};
	}
	$scope.queryDetail=function(){
		cfpLoadingBar.start();
		queryQualifyDetail(1,0);
	}	
	function queryQualifyDetail(detailFlag,queryNum){     //明细轮询方法
		giftService.getQualify(detailFlag,queryNum,function(data) {
			var isAsyn=data.reply.isAsyn;
			var userQualifyList=data.reply.userQualifyList;
			var userQualifyTotal=data.reply.userQualifyTotal;
			if(isEmpty(userQualifyTotal) || isEmpty(userQualifyList) || data.reply.code == 'LIMIT' || data.reply.returnCode.code == 'LIMIT'){
				queryNum++;
				var timer = $timeout(function(){
					 queryQualifyDetail(1,queryNum);
				},queryTime);
				if(queryNum == queryTotalNum){
					$scope.hotEvent=true;
					$timeout.cancel(timer);
					cfpLoadingBar.complete();
				}
			}else{
				$scope.hotEvent=false;
				cfpLoadingBar.complete();
				qualifyTotalDeal(data);
				data.reply.lastQualifyTime=new Date().getTime();
				localStorage.setItem(localStorage.actyId,JSON.stringify(data));
				if(!isEmpty(userQualifyList)){
					$scope.isShowDetail=data.reply.isShowDetail;
					userQualifyList=userQualifyList.length>swipeMax?userQualifyList.slice(-swipeMax):userQualifyList;
					userQualifyList=userQualifyList.reverse();
				}
				$scope.userQualifyList=userQualifyList;
			}
		});
	}
	$scope.gift=function(prodObj){
		//是否在查询中资质中
		// if(!isEmpty($scope.userQualifyTotal) && $scope.userQualifyTotal>0){
	 		//isGroup判断是否礼品组
	 		// if(prodObj.isGroup=="true"){
	 		// 	localStorage.groupId=prodObj.giftID;
	 		// 	$state.go('giftGroupExchange');
	 		// }else{
	 			localStorage.giftId=prodObj.giftID;
	 			$state.go('giftExchange');
	 		// }
	 		// if(prodObj.exchMode=="03"){
	 		// 	$state.go('giftDetail');
	 		// 	localStorage.giftId=prodObj.giftID;
	 		// }
		// }else if(localStorage.UIFlag=="0202" || localStorage.UIFlag=="0102" || $scope.userQualifyTotal==0){
		// 	//无资质不做任何操作
		// }
		// else{
		// 	queryQualifyTotal(0,0);
		// }
	}
	$scope.isComplete=function(amount){
    	var swipePosition = $(".swipe_navpos li");
        window.mySwipe = $('#mySwipe').Swipe({
            continuous: true,//是否无限滚动
            disableScroll: false,
            stopPropagation: false, 
            callback: function(index, elem) {
                $(".swipe_navpos li").removeClass('on');
                var numSlides=amount;
                var reIndex=index;
                if(numSlides==2){//如果只有两张图片时的情况
                    reIndex=Math.ceil(index%numSlides);
                }
                swipePosition[reIndex].className='on';
            },
            auto:3000,
        });
    }
 	$scope.signURL=function(){
 		location.href=signURL;
 	};
 	$scope.bindBinURL=function(){
 		if("02" == localStorage.ChannelType){
 			location.href=appBindBinURL;
 		}else{
 			location.href=bindBinURL;
 		}
 	};
 	if(!isEmpty(shareActy) && !isEmpty(shareActy[localStorage.actyId])){
 		localStorage.shareTitle=shareActy[localStorage.actyId].shareTitle;
 	 	localStorage.shareDesc=shareActy[localStorage.actyId].shareDesc;
 	 	try{
 	 		localStorage.shareUrl=eval(shareActy[localStorage.actyId].shareUrl);
 	 	}catch(exception){
 	 		localStorage.shareUrl=shareActy[localStorage.actyId].shareUrl;
 	 	}
 	 	localStorage.shareImgUrl=shareActy[localStorage.actyId].shareImgUrl;
 	 	weShareTitle=localStorage.shareTitle;
 		weShareDesc=localStorage.shareDesc;
 		weShareUrl=localStorage.shareUrl;
 		weShareImgUrl=localStorage.shareImgUrl;
 	}
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
 //活动细则页面
.controller('actyDetailCtrl',function($scope,$state,actyService){
	actyService.getActyDetail(localStorage.actyId,function(data){
		$scope.actyDetail=data.reply.actyDetail;
		$scope.bannerPath=data.reply.bannerPath;
	});
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('giftGroupGiftDetailCtrl',function(giftService,$scope,$state){     //礼品组礼品详情页
	$scope.isMchtLevel=localStorage.isMchtLevel;
	giftService.getGroupGiftDetail(localStorage.actyId,localStorage.giftId,localStorage.groupId,function(data){
		$scope.giftDetail=data.reply.groupGiftDetailMap;
		$scope.useDetail=data.reply.useDetail;
		$scope.exchPrice=angular.fromJson(data.reply.groupGiftDetailMap.exchPrice);
		$scope.shopsType=data.reply.groupGiftDetailMap.shopsType;
	});
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('giftDetailCtrl',function(giftService,$scope,$state){       //线下商品详情页
	giftService.getActyGift(null,function(data) {
		$scope.goodsBannerPicPath=data.reply.actyGiftMap.goodsBannerPicPath;
		var giftRuleMap=data.reply.giftRuleMap;
		var offLineActy=JSON.parse(giftRuleMap.offLineActy);
		$scope.giftDesc=offLineActy.actyDesc;
		$scope.showPicArray=offLineActy.showPicPath.split(",");
	});  
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('giftGroupExchangeCtrl', function($scope,$state,$filter,$timeout,giftService,actyService,cfpLoadingBar) {
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	var giftId,giftGroupList,merchantId,giftName,groupId;
	function firstGiftInfo(){
		//礼品价格
		$scope.exchPrice=$scope.giftGroupList[0].exchPrice;
		//默认礼品图片
		$scope.goodsBannerPicPath=$scope.giftGroupList[0].goodsBannerPicPath;
		//根据价格是否为空判断是否需要支付
		if(!isEmpty($scope.exchPrice)){
			$scope.isPay=true;
		}else{
			$scope.isPay=false;
		}
		//数量是否可以加减
		$scope.exchType=$scope.giftGroupList[0].exchType;
		//页面初始化第一个服务商第一条类型的数量
		$scope.pGiftNum.giftNum=$scope.giftGroupList[0].exchNum||1;
		//下单需要的giftid 
		giftId=$scope.giftGroupList[0].giftID;
		//商户id
	 	merchantId=$scope.giftGroupList[0].mchtID;
	 	giftName=$scope.giftGroupList[0].giftName;
	}
	function priceExchangeCN(){
		$scope.giftSumPrice=giftService.getGiftSumPrice($scope.giftPrice,$scope.pGiftNum.giftNum);
		$scope.giftSumPriceCN=giftService.getPriceCN($scope.giftSumPrice);
	}
	giftService.getGroupGift(function(data){	
		groupId=data.reply.giftGroupBasicMap.groupID;
		$scope.isShowTotal=localStorage.isShowTotal;
		$scope.qualifyUnit=localStorage.qualifyUnit;
		var userQualifyTotal=data.reply.userQualifyTotal;	
		if(!isEmpty(userQualifyTotal)){
			$scope.userQualifyTotal=userQualifyTotal;
		}else{
			$scope.userQualifyTotal=0;
		}		
		$scope.giftGroupBasicMap = data.reply.giftGroupBasicMap;
		$scope.exchangeFlag =data.reply.exchangeFlag;	
		if(!$scope.exchangeFlag){
			var retCode=data.reply.retCode;
			if(retCode=="2" || retCode=="3"){
				$scope.timeFormat=data.reply.retMessage;
			}
		}
	 	giftGroupList=data.reply.giftGroupList; 
	 	//加油卡活动兑换---敬请期待
	 	if(!isEmpty(uselessActy) && !isEmpty(uselessActy[giftGroupList[0].actyID]) && !$scope.exchangeFlag){
	 		$scope.isFail=true;
	 		$scope.orderMessage=uselessActy[giftGroupList[0].actyID].promptMsg;
	 		$scope.timeFormat=uselessActy[giftGroupList[0].actyID].promptMsg;  //待定-------抢兑倒计时对应栏位提示信息
	 	}
	 	localStorage.exchMode=giftGroupList[0].exchMode;
	 	$scope.lifeSpan=giftGroupList[0].lifeSpan;
		//服务商标题，礼品标题
		$scope.giftClass=giftGroupList[0].giftClass;
		$scope.giftSpeName=giftGroupList[0].giftSpeName;	
		//isMchtLevel 01:按商户展示，02：不按商户展示
		var isMchtLevel=data.reply.giftGroupBasicMap.isMchtLevel;	
		localStorage.isMchtLevel=isMchtLevel;
		if(isMchtLevel=="01"){
			$scope.giftClassList=data.reply.giftClassList;	
			var giftClassName=$scope.giftClassList[0];
		    //筛选出服务商对应的礼品
		 	$scope.giftGroupList=giftGroupList.filter(function(obj){
		 		return obj.giftClassName==giftClassName;
		 	});
		}else if(isMchtLevel=="02"){
			$scope.giftGroupList=giftGroupList;
		}		
	 	if(!isEmpty($scope.giftClass)&&!isEmpty($scope.giftClassList)&&isMchtLevel=="01"){
	 		$scope.giftClassFlag=true;
	 	}else{
	 		$scope.giftClassFlag=false;
	 	}
	 	
	 	firstGiftInfo();
		var exchPrice=$scope.giftGroupList[0].exchPrice;
		if(!$scope.isPay || isEmpty(exchPrice)){
			$scope.giftPriceCN='<span class="jf_num">0</span>'+"<em>元</em>";
			$scope.giftSumPriceCN="<em>0</em>"+"元";
			$scope.isPay=false;
		}else{
			$scope.giftPriceList=angular.fromJson(exchPrice);
			$scope.giftPrice=angular.toJson($scope.giftPriceList[0]);	
			$scope.$watch('giftPrice',function(){
	    		if(!isEmpty($scope.giftPrice)){
	    			priceExchangeCN();
	    		}
	    	});	
		}
		//使用细则
	 	$scope.useDetail=data.reply.giftGroupBasicMap.useDetail;

	 	//可以兑换、需要支付才发送队列查询卡列表，手机号
	 	if($scope.exchangeFlag && $scope.isPay){
	 		actyService.sendMQ(function(data){
 				localStorage.lastMQTime=data.reply.lastMQTime;
 			});
	 	}
	});	
	$scope.pGiftNum={giftNum:""};
	$scope.changeNum=function(){
		if(!isEmpty($scope.pGiftNum.giftNum)){
			if(reNumber.test($scope.pGiftNum.giftNum)){
				if($scope.pGiftNum.giftNum>8){
					$scope.isFail=true;
					$scope.orderMessage="最多只能兑换8个";
					$scope.pGiftNum.giftNum=8;
				}		
			}else{
				$scope.pGiftNum.giftNum=1;
			}	
		}
		priceExchangeCN();
	}
	$scope.jcaptchaImg=servicePath+"jcaptcha.img?userKey="+encodeURIComponent(localStorage.userKey);
	$scope.plusBtn=function(){
		if(isEmpty($scope.pGiftNum.giftNum)){
			$scope.pGiftNum.giftNum=1;
	    }else if($scope.pGiftNum.giftNum>=8){
			$scope.isFail=true;
			$scope.orderMessage="最多只能兑换8个";
			$scope.pGiftNum.giftNum=8;
		}else{
			$scope.pGiftNum.giftNum=parseInt($scope.pGiftNum.giftNum)+1;	
		}	 
	 	if(!isEmpty($scope.giftPrice)){
	 		priceExchangeCN(); 	
			var giftSumPrice=$scope.giftSumPrice;
	        if(!isEmpty(giftSumPrice)&& !isEmpty(giftSumPrice["quality"])){
	    		//资质科目号 qualfyType
	        	var qualitySum=giftSumPrice["quality"]["amt"];
	        	var subjectId=giftSumPrice["quality"]["subjID"];	        	
	            if(localStorage.qualfyType==subjectId && $scope.userQualifyTotal < qualitySum){	            	
	            	$scope.pGiftNum.giftNum=$scope.pGiftNum.giftNum-1;	
	            	//总价格
	            	priceExchangeCN();
	            	$scope.isFail=true;
	    	    	$scope.orderMessage="资质总额不足";
	            }            
	        }
	 	}
	}
	$scope.minusBtn=function(){
		if($scope.pGiftNum.giftNum<=1){alert("不能再少啦!");return;}
		$scope.pGiftNum.giftNum=$scope.pGiftNum.giftNum-1;	
		if(!isEmpty($scope.giftPrice)){
			priceExchangeCN();
		}			
	}
	//价格转换
	function priceChangeCN(){		
		$scope.giftPriceList=angular.fromJson($scope.exchPrice);
		$scope.giftPrice=angular.toJson($scope.giftPriceList[0]);
		priceExchangeCN();	
	}	
	//服务商
	$scope.index1=0;
	$scope.chooseService=function(index,giftClassName){			
		$scope.index1=index;
		$scope.index2=0;
		 //筛选出服务商对应的礼品
	 	$scope.giftGroupList=giftGroupList.filter(function(obj){
	 		return obj.giftClassName==giftClassName;
	 	})
	 	firstGiftInfo();
	 	priceChangeCN();		 			
	}  
	//类型	
	$scope.index2=0;
	$scope.chooseGift=function(index,giftNum,exchPrice,gid,exchType,mchtID,giftNames){
		$scope.index2=index;
		giftId=gid;
		merchantId=mchtID;
		$scope.goodsBannerPicPath=$scope.giftGroupList[index].goodsBannerPicPath;
		$scope.exchPrice=exchPrice;		
		$scope.pGiftNum.giftNum=parseInt(giftNum)||1;
		$scope.exchType=exchType;
		giftName=giftNames;
		//是否需要支付
		if(!isEmpty($scope.exchPrice)){
			$scope.isPay=true;
		}else{
			$scope.isPay=false;
		}
		priceChangeCN();
	} 
	$scope.giftDetail=function(giftId){
		localStorage.giftId=giftId;		
		$state.go('giftGroupGiftDetail');
	}	
 	//下单
	$scope.submitOrder=function($event){
		//alert($event.target.$$hashKey);
		$event.stopPropagation();
		$event.preventDefault();
        var jcaptchaText=$scope.jcaptcha;       
		var giftPrice=angular.fromJson($scope.giftPrice);		
        var giftNum=$scope.pGiftNum.giftNum;
        var jcaptchaText=$scope.jcaptcha;
	 	//校验资质余额
        var giftSumPrice=$scope.giftSumPrice;
        if(!isEmpty(giftSumPrice)&& !isEmpty(giftSumPrice["quality"])){
    		//资质科目号 qualfyType
        	var qualitySum=giftSumPrice["quality"]["amt"];
        	var subjectId=giftSumPrice["quality"]["subjID"];
            if(localStorage.qualfyType==subjectId && $scope.userQualifyTotal < qualitySum){
            	$scope.isFail=true;
    	    	$scope.orderMessage="资质总额不足";
            }else{
            	subOrder();
            }            
        }else{
        	subOrder();
        }
        function subOrder(){
        	 // if(isEmpty($scope.pGiftNum.giftNum)){
     	    // 	$scope.isFail=true;
     	    // 	$scope.orderMessage="请填写兑换数量";
     	    // }else if(isEmpty(jcaptchaText)){
			// 	$scope.isFail=true;
			// 	$scope.orderMessage="请填写验证码";
			// }else{
    	    	$scope.sub_click=true;
    	    	var actyId=localStorage.actyId;
    	    	giftService.order(actyId,giftId,groupId,merchantId,giftNum,jcaptchaText,true,function(data){
    	    		$scope.succMess=data.reply.succMess;
    	    		localStorage.orderId=data.reply.orderId;
    	    		var isAsynchronous=data.reply.isAsynchronous;
            		if(isAsynchronous){
            			cfpLoadingBar.start();
            			$timeout(function(){
            				queryOrderStatus(1,localStorage.orderId);
		     			},2000);
            		}else{
            			var orderCode=data.reply.orderCode;
            			if(orderCode=="SSSSSS"){
    						if($scope.isPay){
    							localStorage.giftId=giftId;    							
    							localStorage.giftSumPrice=angular.toJson(giftSumPrice);
    							localStorage.giftName=giftName;
    							localStorage.giftNum=giftNum;
    							$state.go('pay');
    						}else{
    							$scope.isSuccess=true;
    							$scope.isFail=false;
    							$scope.orderMessage=$scope.succMess;
    						}
                		}else{
                			$scope.sub_click=false;
    		 		    	$scope.isSuccess=false;
    		 		    	$scope.isFail=true;
    		 		    	$scope.orderMessage=data.reply.orderMessage;
                		}
            		} 
            	});
    	    // }
        }
        function queryOrderStatus(countParam,orderParam){
	    	giftService.getStatus(orderParam,localStorage.userKey,null,function(data){
	    		var retuCode=data.reply.retuCode;
        		if(retuCode=="100251" || data.reply.returnCode.code == 'LIMIT'){
        			if(countParam==3){
        				cfpLoadingBar.complete();
						$scope.sub_click=false;
						$scope.isSuccess=false;
						$scope.isFail=true;
						$scope.orderMessage="兑换失败！请重新兑换";
					}else{
						countParam++;
						$timeout(function(){
		     				 queryOrderStatus(countParam,orderParam);
		     			},2000);
					}
        		}else if(retuCode=="SSSSSS"){
        			cfpLoadingBar.complete();
					if($scope.isPay){
						localStorage.giftId=giftId; 
						localStorage.giftSumPrice=angular.toJson(giftSumPrice);
						localStorage.giftName=giftName;
						localStorage.giftNum=giftNum;
						$state.go('pay');
					}else{
						$scope.isSuccess=true;
						$scope.isFail=false;
						$scope.orderMessage=$scope.succMess;
					}
        		}else{
        			cfpLoadingBar.complete();
        			$scope.sub_click=false;
	 		    	$scope.isSuccess=false;
	 		    	$scope.isFail=true;
	 		    	$scope.orderMessage=data.reply.returnMessage;
        		}
	    	});
         }
	}	
    $scope.popClose=function(){
    	$scope.isSuccess=false;
    	$scope.isFail=false;
    	$scope.jcaptchaImg=servicePath+"jcaptcha.img?userKey="+encodeURIComponent(localStorage.userKey)+"&timestamp="+new Date().getTime();
    	$scope.jcaptcha="";
    }		
})
//礼品兑换页
.controller('giftExchangeCtrl', function($scope,$state,$interval,$timeout,$filter,giftService,actyService,cfpLoadingBar) {
	// weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	var maxInterval=172800;
	var formaTime=function(time){
	 	if(time <10){
	 		return '0'+time;
	 	}else{
	 		return ''+time;
	 	}
	 };
 	var getTimeFormat=function(time){
 		var h = Math.floor(time / 3600);
        var m = Math.floor((time %3600) / 60);
        var s = time % 60;
        if(time >=0){
        	return "距离抢兑开始还有 "+formaTime(h)+":" +formaTime(m)+":"+formaTime(s);
 		}else{
	 		return "";
	 	}
 	};
	function priceExchangeCN(){
		$scope.giftSumPrice=giftService.getGiftSumPrice($scope.giftPrice,$scope.pGiftNum.giftNum);
		$scope.giftSumPriceCN=giftService.getPriceCN($scope.giftSumPrice);
	}
 	var merchantId;
	giftService.getActyGift(maxInterval,function(data) {
		var userQualifyTotal=data.reply.userQualifyTotal;
		if(!isEmpty(userQualifyTotal) && userQualifyTotal>0){
			$scope.userQualifyTotal=userQualifyTotal;
		}else{
			$scope.userQualifyTotal=0;
		}
		//倒计时
		var countDownTimes= data.reply.countDownTimes;
		var isCountDown=data.reply.isCountDown;
		var countNumAdd=countDownTimes+1;
	 	if(isCountDown){
		 	$scope.timeFormat=getTimeFormat(countDownTimes);
		 	var interval=$interval(function(){
		 		countDownTimes-=1;
		 		if(countDownTimes>=0){
		 			$scope.timeFormat=getTimeFormat(countDownTimes);
		 		}else{
		 			//倒计时秒数为0时重新请求服务返回判断是否可兑换
		 			/*giftService.getActyGift(maxInterval,function(data) {
		 				$scope.timeFormat="";
		 				$scope.exchangeFlag =data.reply.exchangeFlag;
		 				$interval.cancel(interval);
		 			});*/
		 			if($scope.userQualifyTotal>0){
		 				$scope.exchangeFlag =true;
		 			}
		 			$scope.timeFormat="";
		 			$interval.cancel(interval);
		 		}
		 	},1000,countNumAdd);
	 	}
		$scope.exchangeFlag =data.reply.exchangeFlag;
		if(!$scope.exchangeFlag){
			var retCode=data.reply.retCode;
			if(retCode=="2" || retCode=="3"){
				$scope.timeFormat=data.reply.retMessage;
			}
		}
		$scope.isShowTotal=localStorage.isShowTotal;
		$scope.qualifyUnit=localStorage.qualifyUnit;
		$scope.actyGiftMap = data.reply.actyGiftMap;
	 	$scope.giftRuleMap = data.reply.giftRuleMap;
	 	localStorage.exchMode=$scope.giftRuleMap.exchMode;
	 	if(!isEmpty($scope.actyGiftMap)){
		 	merchantId=data.reply.actyGiftMap.mchtID;
		 	$scope.giftSpeName=data.reply.actyGiftMap.giftSpeName;
		 	$scope.giftSpeSlctName=data.reply.actyGiftMap.giftSpeSlctName;
		 	$scope.giftClass=data.reply.actyGiftMap.giftClass;
		 	$scope.giftClassName=data.reply.actyGiftMap.giftClassName;
		 	$scope.shopsType=data.reply.actyGiftMap.shopsType;
		 	//加油卡活动兑换---敬请期待
		 	if(!isEmpty(uselessActy) && !isEmpty(uselessActy[$scope.actyGiftMap.actyID]) && !$scope.exchangeFlag){
		 		$scope.isFail=true;
		 		$scope.orderMessage=uselessActy[$scope.actyGiftMap.actyID].promptMsg;
		 		$scope.timeFormat=uselessActy[$scope.actyGiftMap.actyID].promptMsg;  //待定-------抢兑倒计时对应栏位提示信息
		 	}
		}
	 	//品牌服务商
	 	if(!isEmpty($scope.giftClass)&&!isEmpty($scope.giftClassName)){
	 		$scope.giftClassFlag=true;
	 	}else{
	 		$scope.giftClassFlag=false;
	 	}
	 	if(!isEmpty($scope.giftSpeName)&&!isEmpty($scope.giftSpeSlctName) ){
	 		$scope.giftSpeNameFlag=true;
	 	}else{
	 		$scope.giftSpeNameFlag=false;
	 	}
	 	if(!isEmpty($scope.giftRuleMap)){
		 	var exchNum=data.reply.giftRuleMap.exchNum||1;
			var exchPrice=data.reply.giftRuleMap.exchPrice;
	 	}
	 	$scope.pGiftNum.giftNum = parseInt(exchNum);
		//小计 金额
		$scope.isPay=data.reply.isPay;
		if(!$scope.isPay || isEmpty(exchPrice)){
			$scope.giftPriceCN='<span class="jf_num">0</span>'+"<em>元</em>";
			$scope.giftSumPriceCN="<em>0</em>"+"元";
			$scope.isPay=false;
		}else{
			$scope.giftPriceList=angular.fromJson(exchPrice);
			$scope.giftPrice=angular.toJson($scope.giftPriceList[0]);
	    	$scope.$watch('giftPrice',function(){
	    		if(!isEmpty($scope.giftPrice)){
	    			priceExchangeCN();
	    		}
	    	})
		}
	 	$scope.useDetail=data.reply.useDetail;

	 	//可以兑换、需要支付才发送队列查询卡列表，手机号
	 	if($scope.exchangeFlag && $scope.isPay){
	 		// actyService.sendMQ(function(data){
 			// 	localStorage.lastMQTime=data.reply.lastMQTime;
 			// });
	 	}

	});
	$scope.pGiftNum={giftNum:""};
	$scope.changeNum=function(){
		if(!isEmpty($scope.pGiftNum.giftNum)){
			if(reNumber.test($scope.pGiftNum.giftNum)){
				if($scope.pGiftNum.giftNum>8){
					$scope.isFail=true;
					$scope.orderMessage="最多只能兑换8个";
					$scope.pGiftNum.giftNum=8;
				}
			}else{
				$scope.pGiftNum.giftNum=1;
			}
		}
		priceExchangeCN();
	}
    $scope.plusBtn=function(){
        if(isEmpty($scope.pGiftNum.giftNum)){
            $scope.pGiftNum.giftNum=1;
        }else if($scope.pGiftNum.giftNum>=8){
            $scope.isFail=true;
            $scope.orderMessage="最多只能兑换8个";
            $scope.pGiftNum.giftNum=8;
        }else{
            $scope.pGiftNum.giftNum=parseInt($scope.pGiftNum.giftNum)+1;
        }
        if(!isEmpty($scope.giftPrice)){
            priceExchangeCN();
            var giftSumPrice=$scope.giftSumPrice;
            if(!isEmpty(giftSumPrice)&& !isEmpty(giftSumPrice["quality"])){
                //资质科目号 qualfyType
                var qualitySum=giftSumPrice["quality"]["amt"];
                var subjectId=giftSumPrice["quality"]["subjID"];
                if(localStorage.qualfyType==subjectId && $scope.userQualifyTotal < qualitySum){
                    $scope.pGiftNum.giftNum=$scope.pGiftNum.giftNum-1;
                    //总价格
                    priceExchangeCN();
                    $scope.isFail=true;
                    $scope.orderMessage="资质总额不足";
                }
            }
        }
    }
    $scope.minusBtn=function(){
        if($scope.pGiftNum.giftNum<=1){alert("不能再少啦!");return;}
        $scope.pGiftNum.giftNum=$scope.pGiftNum.giftNum-1;
        if(!isEmpty($scope.giftPrice)){
            priceExchangeCN();
        }
    }
    //下单
    $scope.submitOrder=function(actyId,giftId,$event){
        //alert($event.target.$$hashKey);
        $event.stopPropagation();
        $event.preventDefault();
        var giftPrice=angular.fromJson($scope.giftPrice);
        var giftNum=$scope.pGiftNum.giftNum;
        var giftSumPrice=$scope.giftSumPrice;
        var jcaptchaText=$scope.jcaptcha;
        //校验资质余额
        var giftSumPrice=$scope.giftSumPrice;
        if(!isEmpty(giftSumPrice)&& !isEmpty(giftSumPrice["quality"])){
            //资质科目号 qualfyType
            var qualitySum=giftSumPrice["quality"]["amt"];
            var subjectId=giftSumPrice["quality"]["subjID"];
            if(localStorage.qualfyType==subjectId && $scope.userQualifyTotal < qualitySum){
                $scope.isFail=true;
                $scope.orderMessage="资质总额不足";
            }else{
                subOrder();
            }
        }else{
            subOrder();
        }
        function subOrder(){
            // if(isEmpty($scope.pGiftNum.giftNum)){
            //     $scope.isFail=true;
            //     $scope.orderMessage="请填写兑换数量";
            // }else if(isEmpty(jcaptchaText)){
            //     $scope.isFail=true;
            //     $scope.orderMessage="请填写验证码";
            // }else{
                $scope.sub_click=true;
                var groupId="";
                giftService.order(actyId,giftId,groupId,merchantId,giftNum,jcaptchaText,true,function(data){   localStorage.giftId=giftId;
                    localStorage.giftSumPrice=angular.toJson(giftSumPrice);
                    localStorage.giftName=$scope.actyGiftMap.giftName;
                    localStorage.giftNum=giftNum;
                    $state.go('pay');

                    $scope.succMess=data.reply.succMess;
                    localStorage.orderId=data.reply.orderId;
                    var isAsynchronous=data.reply.isAsynchronous;
                    if(isAsynchronous){
                        cfpLoadingBar.start();
                        $timeout(function(){
                            queryOrderStatus(1,localStorage.orderId);
                        },2000);
                    }else{
                        var orderCode=data.reply.orderCode;
                        if(orderCode=="SSSSSS"){
                            if($scope.isPay){
                                localStorage.giftId=giftId;
                                localStorage.giftSumPrice=angular.toJson(giftSumPrice);
                                localStorage.giftName=$scope.actyGiftMap.giftName;
                                localStorage.giftNum=giftNum;
                                $state.go('pay');
                            }else{
                                $scope.isSuccess=true;
                                $scope.isFail=false;
                                $scope.orderMessage=$scope.succMess;
                            }
                        }else{
                            $scope.sub_click=false;
                            $scope.isSuccess=false;
                            $scope.isFail=true;
                            $scope.orderMessage=data.reply.orderMessage;
                        }
                    }
                });
            // }
        }
        function queryOrderStatus(countParam,orderIdParam){
            giftService.getStatus(orderIdParam,localStorage.userKey,null,function(data){
                var retuCode=data.reply.retuCode;
                if(retuCode=="100251" || data.reply.returnCode.code == 'LIMIT'){
                    if(countParam==3){
                        cfpLoadingBar.complete();
                        $scope.sub_click=false;
                        $scope.isSuccess=false;
                        $scope.isFail=true;
                        $scope.orderMessage="兑换失败！请重新兑换";
                    }else{
                        countParam++;
                        $timeout(function(){
                            queryOrderStatus(countParam,orderIdParam);
                        },2000);
                    }
                }else if(retuCode=="SSSSSS"){
                    cfpLoadingBar.complete();
                    if($scope.isPay){
                        localStorage.giftId=giftId;
                        localStorage.giftSumPrice=angular.toJson(giftSumPrice);
                        localStorage.giftName=$scope.actyGiftMap.giftName;
                        localStorage.giftNum=giftNum;
                        $state.go('pay');
                    }else{
                        $scope.isSuccess=true;
                        $scope.isFail=false;
                        $scope.orderMessage=$scope.succMess;
                    }
                }else{
                    cfpLoadingBar.complete();
                    $scope.sub_click=false;
                    $scope.isSuccess=false;
                    $scope.isFail=true;
                    $scope.orderMessage=data.reply.returnMessage;
                }
            });
        }
    }
    $scope.popClose=function(){
        $scope.isSuccess=false;
        $scope.isFail=false;
        $scope.jcaptchaImg=servicePath+"jcaptcha.img?userKey="+encodeURIComponent(localStorage.userKey)+"&timestamp="+new Date().getTime();
        $scope.jcaptcha="";
    };
	$scope.jcaptchaImg=servicePath+"jcaptcha.img?userKey="+encodeURIComponent(localStorage.userKey);
	// $scope.jcaptchaImg=servicePath+"jcaptcha.img?userKey="+encodeURIComponent(localStorage.userKey);

})

.controller('payMobileCtrl', function($scope,$timeout,payService,cfpLoadingBar) {
	/*if(!isEmpty(localStorage.mobile)){
		$scope.mobile=localStorage.mobile;
		$scope.encryptMobile=localStorage.encryptMobile;
	}else{*/
		localStorage.removeItem("encryptMobile");
		// cfpLoadingBar.start();
		var queryNum=0;
		// queryMobile(queryNum);
	/*}*/
	function queryMobile(queryNum){
		payService.getMobile(queryNum,function(data){
			/*if(data.reply.returnCode.code == "LIMIT"){
				$scope.mobileButton=true;
			}else{*/
				var encryptMobile=data.reply.encryptMobile;
				if(isEmpty(encryptMobile) || data.reply.returnCode.code == 'LIMIT'){
					if(queryNum==queryTotalNum){
						cfpLoadingBar.complete();
						//$scope.encryptMobile="查询手机号异常";
						$scope.mobileButton=true;
					}else{
						queryNum++;
						$timeout(function(){
							queryMobile(queryNum);
						},queryTime);
					}
				}else{
					cfpLoadingBar.complete();
					//$scope.mobile=mobile;
					$scope.encryptMobile=data.reply.encryptMobile;
					//localStorage.mobile=mobile;
					localStorage.encryptMobile=data.reply.encryptMobile;
					$scope.mobileButton=false;
				}
			//}
		});
	}
	$scope.reQueryMobile=function(){
		cfpLoadingBar.start();
		queryMobile(0);
	}
	
})
.controller('payCardListCtrl', function($scope,$timeout,payService,cfpLoadingBar) {
	// cfpLoadingBar.start();
	// queryCardList(0);
	function queryCardList(queryNum){
		payService.getCardList(queryNum,function(data){
			var queryResult=data.reply.queryResult;  //queryResult为空：轮循取卡列表 ；不为空：显示无有效卡号					
			var encryptCardList=data.reply.encryptCardList;	
			if(isEmpty(queryResult)){
				$scope.isAllUnuse=false;//isAllUnuse是否全部卡号不可用（是否全部为失效卡号）
				if(isEmpty(encryptCardList) || data.reply.returnCode.code == 'LIMIT'){
					if(queryNum==queryTotalNum){
						cfpLoadingBar.complete();
						$scope.cardListButton=true;
					}else{
						queryNum++;
						$timeout(function(){
							queryCardList(queryNum);
						},queryTime);
					}
				}else{
					cfpLoadingBar.complete();
					$scope.encryptCardList=data.reply.encryptCardList;
					$scope.midVariable.cardNo=angular.fromJson($scope.encryptCardList[0]).CardNo;//默认显示第一条卡号
					$scope.cardListButton=false;
				}
			}else{
				cfpLoadingBar.complete();
				$scope.isAllUnuse=true;
				$scope.queryResult=queryResult;	
				$scope.cardListButton=false;
			}
		});
	}
	$scope.reQueryCardList=function(){
		// cfpLoadingBar.start();
		queryCardList(0);
	}
})
//支付页
.controller('payCtrl', function($scope,$interval,$timeout,payService,giftService,cfpLoadingBar) {
	if(localStorage.exchMode=="02"){
		$scope.payTimeLimitTip="请在今日内完成支付哦~";
	}else{
		$scope.payTimeLimitTip="请在30分钟内完成支付哦~";
	}
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	//支付个人信息
	$scope.midVariable={cardNo:""};   //初始化选中卡号中间变量
	$scope.goodsBannerPicPath=localStorage.goodsBannerPicPath;
    // payService.getPersonInfo(function(data) {
		// $scope.succMess=data.reply.succMess;
		// var giftSumPrice=localStorage.giftSumPrice;
		// if(!isEmpty(giftSumPrice)){
    // 		$scope.giftSumPriceCN=giftService.getPriceCN(giftSumPrice);
		// }else{
		// 	$scope.giftSumPriceCN='<span class="col1">0</span>元';
		// }
		// $scope.giftNum=localStorage.giftNum;
		// $scope.giftName=localStorage.giftName;
		// //$scope.mobile=data.reply.mobile;
		// $scope.isCfca=data.reply.isCfca;
		// var serverRandom=data.reply.serverRandom;
		// if($scope.isCfca){
		// 	initNumberKeyboard("SIPBox","keyboardContainer",serverRandom);
		// 	hideKeyboard(["SIPBox","clearSIPBox","keyboardContainer"]);
		// }
		// if(cfpLoadingBar.status()==0 && isEmpty(localStorage.encryptMobile)){cfpLoadingBar.start();}
    // });

    // if($scope.isCfca){
    //     initNumberKeyboard("SIPBox","keyboardContainer",serverRandom);
    //     hideKeyboard(["SIPBox","clearSIPBox","keyboardContainer"]);
    // }

    // if(cfpLoadingBar.status()==0 && isEmpty(localStorage.encryptMobile)){cfpLoadingBar.start();}
    cfpLoadingBar.complete();

	$scope.popClose=function(){
		if(isCountDownTimes){
			$scope.isFail=false;
		}else{
			$scope.isFail=false;
			$scope.smsCode="";
			$scope.sendFlag=true;
			$interval.cancel(timePromise);
		}
	}
	//获取验证码
	var countDownTimes=60;
	var timePromise;
	$scope.sendFlag=true;
	var isCountDownTimes="";//判断关闭弹窗是否需要继续倒计时
	$scope.sendSMSCode=function(){
		var mobile=localStorage.encryptMobile;
		if(isEmpty(mobile)){
			$scope.isFail=true;
	    	$scope.payMessage="手机号不能为空";
		}else{
			sendSMSCodeToServer(mobile,0);
		}
	};
	function sendSMSCodeToServer(mobile,queryNum){
		$scope.sendFlag=false;
		$scope.smsTxt="获取中……";
		payService.sendSMSCode(mobile,countDownTimes,function(data){
			if(data.reply.returnCode.code == 'LIMIT'){
				if(queryNum>=queryTotalNum){
					$scope.payMessage="亲~，网络繁忙，请重新获取";
					$scope.isFail=true;
					$scope.isSuccess=false;
					isCountDownTimes=false;
					$scope.sendFlag=true;
				}else{
					queryNum++;
					$timeout(function(){
						sendSMSCodeToServer(mobile,queryNum);
					},queryTime);
				}
			}else{
				var retCode=data.reply.retCode;
				if(retCode=="1"){
					$scope.isFail=true;
					$scope.isSuccess=false;
					isCountDownTimes=true;
					$scope.payMessage=data.reply.retMessage;					
				}else{
					isCountDownTimes=false;
				}
				var second = countDownTimes;
				$scope.smsTxt = second + "秒后重发";  
				second--;
				timePromise = $interval(function(){  
					if(second==0){  
						$scope.sendFlag=true;
						second = countDownTimes;  
					}else{  
						$scope.smsTxt = second + "秒后重发";  
						second--;
					}  
				},1000,countDownTimes);
			}
			
		});
	};
   //支付订单
	$scope.payOrder=function($event){
		//alert($event.target.$$hashKey);
		$event.stopPropagation();
		$event.preventDefault();
		var SMSCode=$scope.smsCode;
		var cardNo=$scope.midVariable.cardNo;
		// if(isEmpty(SMSCode)){
		// 	$scope.isFail=true;
		// 	$scope.payMessage="手机验证码不能为空";
		// }else if(isEmpty(cardNo)){
		// 	$scope.isFail=true;
	    	// $scope.payMessage="支付卡号不能为空";
		// }else if($scope.isCfca && document.getElementById('SIPBox').value.length != 6){
		// 	$scope.isFail=true;
	    	// $scope.payMessage="请输入正确查询密码";
		// }else{
			var cipher;
			if($scope.isCfca){
				cipher=getEncrypt("SIPBox");
			}
			$scope.sub_click=true;
        $scope.isSuccess=true;
			// payService.pay(cipher,SMSCode,cardNo,function(data){
			// 	var isAsynchronous=data.reply.isAsynchronous;
			// 	if(isAsynchronous){
			// 		cfpLoadingBar.start();
			// 		$timeout(function(){
			// 			queryPayStatus(1);
	     	// 		},2000);
			// 	}else{
			// 		var payCode=data.reply.payCode;
			// 		if(payCode=="SSSSSS"){
			// 			$scope.isSuccess=true;
			// 			$scope.isFail=false;
			// 			$scope.payTitle="支付成功";
			// 			$scope.payMessage=$scope.succMess;//data.reply.payMessage;
			// 			localStorage.removeItem("giftSumPrice");
			// 			localStorage.removeItem("giftName");
			// 			localStorage.removeItem("giftNum");
			// 			localStorage.removeItem("orderId");
			// 		}else{
			// 			$scope.sub_click=false;
			// 			$scope.isSuccess=false;
			// 			$scope.isFail=true;
			// 			$scope.payMessage=data.reply.payMessage;
			// 		}
			// 	}
			// 	localStorage.removeItem(localStorage.actyId);
			// });
		// }
	}
	function queryPayStatus(countParam){
		var isPayAsyn=true;
		giftService.getStatus(localStorage.orderId,localStorage.userKey,isPayAsyn,function(data){
			var retuCode=data.reply.retuCode;
			if(retuCode=="100251" || data.reply.returnCode.code == 'LIMIT'){
				if(countParam==3){
					cfpLoadingBar.complete();
					var orderStatus=data.reply.orderStatus;
					if(orderStatus=="30" || data.reply.returnCode.code == 'LIMIT'){
						$scope.isSuccess=true;
						$scope.isFail=false;
						$scope.payTitle="支付中";
						$scope.payMessage="支付中……，请稍候在我的特权中查看";
					}else{
						$scope.sub_click=false;
						$scope.isSuccess=false;
						$scope.isFail=true;
						$scope.payMessage="支付失败！请重新支付";
					}
				}else{
					countParam++;
					$timeout(function(){
						queryPayStatus(countParam);
					},2000);
				};
			}else if(retuCode=="SSSSSS"){
				cfpLoadingBar.complete();
				$scope.isSuccess=true;
				$scope.isFail=false;
				$scope.payTitle="支付成功";
				$scope.payMessage=$scope.succMess;
				localStorage.removeItem("giftSumPrice");
				localStorage.removeItem("giftName");
				localStorage.removeItem("giftNum");
				localStorage.removeItem("orderId");
			}else{
				cfpLoadingBar.complete();
				$scope.sub_click=false;
				$scope.isSuccess=false;
				$scope.isFail=true;
				$scope.payMessage=data.reply.returnMessage;
			}
		})
	}   
})

.controller('giftOrderCtrl', function($scope,$state,giftService,$filter,encryptService) {	   //订单详情页
	localStorage.isRefresh="2";//解决地图返回不能再次点击问题
	var detailsInfo=angular.fromJson(localStorage.orderDetails);
	localStorage.actyId=detailsInfo.actyID;
	if(!isEmpty(shareActy) && !isEmpty(shareActy[localStorage.actyId])){
 		localStorage.shareTitle=shareActy[localStorage.actyId].shareTitle;
 	 	localStorage.shareDesc=shareActy[localStorage.actyId].shareDesc;
 	 	try{
 	 		localStorage.shareUrl=eval(shareActy[localStorage.actyId].shareUrl);
 	 	}catch(exception){
 	 		localStorage.shareUrl=shareActy[localStorage.actyId].shareUrl;
 	 	}
 	 	localStorage.shareImgUrl=shareActy[localStorage.actyId].shareImgUrl;
 	 	weShareTitle=localStorage.shareTitle;
 		weShareDesc=localStorage.shareDesc;
 		weShareUrl=localStorage.shareUrl;
 		weShareImgUrl=localStorage.shareImgUrl;
 	}
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	$scope.endDate=detailsInfo.endDate;
	$scope.couponId=detailsInfo.couponID;
	var orderId=detailsInfo.orderId;
	$scope.orderId=orderId;
	var couponPrice=detailsInfo.couponPrice;
	if(!isEmpty(couponPrice)){
		$scope.orderPriceHTML=giftService.getPriceCN(couponPrice);
	}else{
		$scope.orderPriceHTML='<span class="col1">0</span>元';
	}
	var initOrderStatus =detailsInfo.orderStatus;
	//modify jiangfan 20170620  电子礼券兑换码栏位隐藏条件：订单状态为99,券码为空
	if('99'==initOrderStatus && isEmpty($scope.couponId)){
		$scope.couponDiv=false;
	}else{
		$scope.couponDiv=true;
	}
	var giftActionList;
	giftService.orderDetail(detailsInfo.actyID,detailsInfo.giftID,function(data) {	
		$scope.giftDetailMap=data.reply.giftDetailMap;		
		if(!isEmpty($scope.giftDetailMap)){
			localStorage.mechId=data.reply.giftDetailMap.merchantId;
		}		
		//orderStatus所有状态99/60/70/80
		giftActionList=data.reply.giftActionList;	
		$scope.actionMap=actionListFilterToMap(giftActionList,initOrderStatus);
		var otherCodeObj=$scope.actionMap["IMEI"];
		tranCouponCode($scope.couponId);
		if(!isEmpty(otherCodeObj) && !isEmpty($scope.otherCouponId)){
			showOtherCode(otherCodeObj);
		}
	 	$scope.executeAction=function(actionObj){
	 		var actionName=actionObj.actionName;
	 		//special done
	 		if(actionName.indexOf("BindingService")>0){
	 			actionName="getCouponCode";
	 		}
	 		var fn=eval(actionName);
	 		fn.call(this,actionObj);
	 	}
    });
	//兑换码展示处理
	function tranCouponCode(couponId){
		var actionMap=$scope.actionMap;
		var splitArray=["|",","];
		var splitChar="";
		if(!isEmpty(couponId) && "1"!=couponId){  //非提前采购的抢兑券码号都为1
			for(var i=0;i<splitArray.length;i++){
				splitChar=splitArray[i];
				if(couponId.indexOf(splitChar)>0) break;
			}
			if(!isEmpty(splitChar) && couponId.indexOf(splitChar)>0){
				$scope.couponId=couponId.split(splitChar)[0];
				$scope.otherCouponId=couponId.split(splitChar)[1];
				var otherCodeObj=$scope.actionMap["IMEI"];
				if(!isEmpty(otherCodeObj) && !isEmpty($scope.otherCouponId)){
					showOtherCode(otherCodeObj);
				}
			}else{
				$scope.couponId=couponId;
			}
			//2个按钮时6个；单个按钮时18个字符；没有按钮时26个字符actionMap['getCouponCode']
			if(!isEmpty(actionMap['tranQRCode'])&&!isEmpty(actionMap['getCouponCode'])){
				$scope.couponCode=$scope.couponId.substr(0,6);
			}else if(!isEmpty(actionMap['tranQRCode'])){
				$scope.couponCode=$scope.couponId.substr(0,16);
			}else{
				$scope.couponCode=$scope.couponId;
			}
		}
	}
	
	//根据订单状态过滤页面按钮
	function actionListFilterToMap(giftActionList,orderStatus){
 		var actionMap={};
 		if(isEmpty(giftActionList)){
 			return actionMap;
 		}
	 	//组装页面显示按钮数据
	 	for(var i=0;i<giftActionList.length;i++){
	 		var obj=giftActionList[i];
	 		var actionName=obj.actionName;
	 		var actionParam=obj.actionParam;
	 		if(angular.isString(actionParam)){
	 			obj.actionParam=angular.fromJson(actionParam);
			}
	 		if(obj.orderStatus==orderStatus && obj.actor.indexOf("02")>=0){
	 			if(actionName.indexOf("BindingService")>0){
		 			actionName="getCouponCode";
		 			actionMap[actionName]=obj;
		 		}else if("confirmCouponUsed"==actionName){
	 				if("01"==obj.giftStatus){
	 					actionMap[actionName]=obj;
	 				}
	 			}else{
	 				actionMap[actionName]=obj;
	 			}
	 		}
	 	}
 		return actionMap;
 	}
	//获取兑换码
	function getCouponCode(actionObj){
		giftService.getCouponCode(orderId,actionObj.giftID,detailsInfo.id,actionObj.actionName,function(data) {
			if(data.reply.retCode=="SSSSSS"){		
				var couponId=data.reply.couponCode;
				var orderStatus=data.reply.orderStatus;
				if(orderStatus!=initOrderStatus){
					$scope.actionMap=actionListFilterToMap(giftActionList,orderStatus);
				}
				tranCouponCode(couponId);
				
				$scope.endDate=data.reply.endDate;  //数据变化，更新缓存
				detailsInfo.endDate=$scope.endDate;
				detailsInfo.couponID=couponId;
				detailsInfo.orderStatus=orderStatus;
				localStorage.orderDetails=angular.toJson(detailsInfo);				
			}else{
				var message=data.reply.retMessage;
				if(isEmpty(message)){
					message="获取兑换码失败，请重新获取!";
				}
				alert(message);
				return;
			}			
	    });   
	}
	//转为二维码
	function tranQRCode(actionObj){
		var couponClass =detailsInfo.couponClass;
		var couponSource =detailsInfo.couponSource;
		var stringCode;
		if(couponSource=="01"){		
			if(couponClass=="101010"){
				var ptGroup=[];		
				ptGroup.push({couponId:$scope.couponId,couponClass:couponClass,actyID:localStorage.actyId,giftID:actionObj.giftId});					
				ptGroup=angular.toJson(ptGroup);
				giftService.getTranQRCode(ptGroup,merchantId,function(data) {
					if(data.reply.retCode=="SSSSSS"){	
						//101010 定额代金券显示加密后的订单号
						stringCode=data.reply.encryptOrderId;	
						$scope.isShowQRCode=true;
					}
					else{
						alert(data.reply.retMessage);
						return;
					}
			    });   
			}else{
				stringCode=$scope.couponId;
				$scope.isShowQRCode=true;
			}
		}else{
			stringCode=$scope.couponId;
			$scope.isShowQRCode=true;
		}
		$scope.QRCodeImg=servicePath+"QRCode.img?stringCode="+encodeURIComponent(stringCode);	        			
	}
	//显示其他串码
	function showOtherCode(actionObj){
		var IMEI=actionObj.actionParam.IMEI;
		$scope.IMEINumber=IMEI+":"+$scope.otherCouponId;
	}
	//跳转
	function URLJump(actionObj){
		location.href=actionObj.actionParam.jmpURL;
	}
	
	//带加密参数的URL跳转，加密算法民生卡中心提供
	function URLJumpEncodeByCMBCC(actionObj){
		var paramMap={"orderId":$scope.orderId};
		encryptService.TDESEncryptByCMBCC(paramMap,function(data) {
			var encryptParamMap=data.reply.encryptParamMap;
			if(!isEmpty(encryptParamMap)){
				var queryStr="";
				for(var key in encryptParamMap){
					queryStr+="&"+key+"="+encodeURIComponent(encryptParamMap[key]);
				}
				queryStr="?"+queryStr.substring(1);
				location.href=actionObj.actionParam.jmpURL+queryStr;
			}else{
				location.href=actionObj.actionParam.jmpURL;
			}
		});
	}
	
	//确认使用
	function confirmCouponUsed(actionObj){
		if(confirm("请确认该兑换码是否已使用？")){
			$scope.sub_click=true;
			giftService.getSetCouponCompletion($scope.orderId,$scope.couponId,function(data) {
				$scope.retMsg=data.reply.retMsg;
				if(data.reply.retCode=="SSSSSS"){
					//$scope.actionMap=actionListFilterToMap(giftActionList,"99");
					$scope.isSuccess=true;
				}else{
					$scope.isFail=true;
				}
		    });
		}
	}
	$scope.popClose=function(){
		$scope.sub_click=false; 
		$scope.isFail=false; 
	};
 	$scope.queryShopList=function(){
 		localStorage.actyId=detailsInfo.actyID;
 		localStorage.giftId=detailsInfo.giftID;
 		$state.go('shopList');
 	}
})
 //附近的门店
.controller('searchNearbyStoreCtrl',function($scope,$state,$compile,giftService){
	var h=document.body.clientHeight;
	var allmap=document.getElementById("allmap");	
	allmap.style.height=(h*0.6)+'px';	
	$("#merchinfo").html("点击红色图标查看门店详情");
	var storeType=localStorage.mechId;
    var title="";
	function isEmptyObject(obj) {
		for ( var n in obj) {
			return false
		}
		return true;
	}
	function getCurrentLocation() {
		// 获取当前经纬度
		var oStorage = window.localStorage;
		//test
		/*oStorage.setItem('lng', '116.40387397');
		oStorage.setItem('lat', '39.91488908');
		oStorage.setItem('lastSyncTime', (new Date()).getTime() / 1000);
		oStorage.setItem('city', '北京市');*/
		// 百度地图API功能
		var city;
		if ((((new Date()).getTime() / 1000) - oStorage.getItem('lastSyncTime')) >= 3000) {
			// 超时5分钟，重新获取地理位置信息
			oStorage.removeItem("lng");
			oStorage.removeItem("lat");
			oStorage.removeItem("city");
		}
		if (isEmptyObject(oStorage.getItem('lng'))|| isEmptyObject(oStorage.getItem('lat'))|| isEmptyObject(oStorage.getItem('city'))) {
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(
				function(r) {
					if (this.getStatus() == BMAP_STATUS_SUCCESS) {
						var pointAdd = new BMap.Point(r.point.lng,r.point.lat);
						lng = r.point.lng;
						lat = r.point.lat;
						// 将获取的城市IP转换为城市地址信息 strat
						// 地址解析器 根据经纬度获取当前车辆所在地址
						// 创建地理编码实例
						var myGeo = new BMap.Geocoder();
						// 根据坐标得到地址描述
						myGeo.getLocation(pointAdd, function(result) {
							if (result) {
								city = result.addressComponents.city;
								oStorage.setItem('city', city);
							}
						});
						oStorage.setItem('lng', r.point.lng);
						oStorage.setItem('lat', r.point.lat);
						oStorage.setItem('getType', 'B');
						oStorage.setItem('lastSyncTime', (new Date())
								.getTime() / 1000);
					} else {
						alert('获取当前位置failed：' + this.getStatus());
					}
				}, {
					enableHighAccuracy : true
				});
		}
	}
	//获取当前经纬度
	getCurrentLocation();
	var oStorage = window.localStorage;
	var lat=oStorage.getItem("lat");
	var lng=oStorage.getItem("lng");
	var getType=oStorage.getItem("getType");
	var interval;
	var countTime=0;
	function timeTask(){
		lat=oStorage.getItem("lat");
		lng=oStorage.getItem("lng");
		if(lat||lng){
			interval=window.clearInterval(interval);
			searchStore(storeType,lat,lng);
		}else{
			countTime++;
			if(countTime>=20){
				$("#merchinfo").html("<a style='color:#ff0000'>&nbsp;&nbsp;&nbsp;&nbsp;获取当前位置失败，请点击刷新按钮。</a>");
			}
		}
	}
	if(lat==undefined||lng==undefined){
		interval=self.setInterval("timeTask()",1000);
	}else{
		//如果是微信渠道过来的经纬度，则需要进行地址转换
		if(getType=="W"){
			var ggPoint = new BMap.Point(lng,lat);
			setTimeout(function(){
		        var convertor = new BMap.Convertor();
		        var pointArr = [];
		        pointArr.push(ggPoint);
		        convertor.translate(pointArr, 1, 5, translateCallback)
		    }, 1000);
		}
		searchStore(storeType,lat,lng);
	}
	//坐标转换完之后的回调函数
	translateCallback = function (data){
	  if(data.status === 0) {
		oStorage.setItem('lng', data.points[0].lng);
		oStorage.setItem('lat', data.points[0].lat);
		oStorage.setItem('getType', 'B');  
	  }
	}
	//附近的经纬度
	var relist=new Array();
	var myObject = {
			value:3,
			func:function(relist){
			var obj2;
			//地图初始化
	        var map = new BMap.Map("allmap");
	        var myIcon = new BMap.Icon("activityday/image/markers.png", new BMap.Size(18,26));
	        //获取商户位置显示
	        var points=new Array();
	        var mk2=new Array();
	        var label2=new Array();
	        var infoWindow=new Array();
				for(var j=0;j<relist.length;j++){
	    		relist[j].info.split("|")[1];
	    		points[j]=new BMap.Point(relist[j].lng,relist[j].lat);
	    		
	    		mk2[j]=new BMap.Marker(points[j],{icon:myIcon});
	  			label2[j] = new BMap.Label(relist[j].info.split("|")[1],{offset:new BMap.Size(15,-10)});
	  			label2[j].setTitle(relist[j]);
	  			mk2[j].setLabel(label2[j]);
	  			map.addOverlay(mk2[j]);
	  			//开启点击事件
	  			mk2[j].addEventListener("click",function(abc){
	  				title=this.getLabel().getTitle();
	  				var source=title[0];
	  				var storeId=title[1];
	  				//获取当前点击的商户id进行查询,获取详细信
	  				$("#merchinfo").html("<br><a style='color:#ff0000'>"+title.info.split("|")[3]+title.info.split("|")[4]+"<br><br>距离:"+
	  						parseInt(title.dist)+"米<br></a><br><p ng-click='goBusSubway()'>到这里去</p>");
	  				//动态加载html内容
	  				$compile($("#merchinfo"))($scope);
	  			});						
	    	}
		       //获取我的位置显示 直接从上一页面进行获取
				obj2=new BMap.Point(lng,lat);
				var mk = new BMap.Marker(obj2,{icon:myIcon});
				var label = new BMap.Label("我的位置",{offset:new BMap.Size(15,-10)});
				map.centerAndZoom(obj2, 13);//设置当前视图位置
				mk.setLabel(label);
				map.addOverlay(mk);
				map.panTo(obj2);
		}
	};
	$scope.goBusSubway=function(){ 
		var goBusSubway={"nowlng":lng,"nowlat":lat,"lng":title.lng,"lat":title.lat};
		goBusSubway=angular.toJson(goBusSubway);		
		localStorage.goBusSubway=goBusSubway;	
		$state.go('busSubway');	
	}
	function searchStore(storeType,lat,lng){
		giftService.getSearchNearbyStore(storeType,lng,lat,function(data){
			relist=data.reply.nearbyStoreList;
			myObject.func(relist); 
			//解决地图返回不能再次点击问题
			if(localStorage.isRefresh=="2"){
				window.location.reload();			
				localStorage.isRefresh="1";
			}
		});	
	}
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})

//规划路线
.controller('busSubwayCtrl',function($scope,$state,$compile){	
	localStorage.isRefresh="2"; //解决地图返回不能再次点击问题
	var goBusSubway=angular.fromJson(localStorage.goBusSubway);
	var lng=goBusSubway.lng;
	var lat=goBusSubway.lat;
	var nowlng=goBusSubway.nowlng;
	var nowlat=goBusSubway.nowlat;
	var h=document.body.clientHeight;
	var allmap=document.getElementById("allmap");	
	allmap.style.height=(h/2)+'px';
	$("#navi").html('<h3>选择出行方式:</h3><a class="margin-r-25" ng-click=naviMethod("walk")>步行</a><a class="margin-r-25" ng-click=naviMethod("bus")>公交</a><a ng-click=naviMethod("drive")>驾车</a>');	
	$compile($("#navi"))($scope);	
	//获取当前经纬度
	$scope.naviMethod=function(method) {
		var map = new BMap.Map("allmap", {enableMapClick:false});
		var pointA=new BMap.Point(nowlng, nowlat);
		var pointB=new BMap.Point(lng, lat);
		//起点
		var mkA = new BMap.Marker(pointA);
		var labelA = new BMap.Label("我的位置",{offset:new BMap.Size(20,-10)});
		mkA.setLabel(labelA);
		map.addOverlay(mkA);
		map.panTo(pointA);
		//终点
		var mkB = new BMap.Marker(pointB);
		var labelB = new BMap.Label("终点",{offset:new BMap.Size(20,-10)});
		mkB.setLabel(labelB);
		map.addOverlay(mkB);
		map.panTo(pointB);
		//规划路线
		map.centerAndZoom(new BMap.Point((nowlng+lng)*0.5, (nowlat+lat)*0.5), 11);
		if(method=="bus"){
		var transit = new BMap.TransitRoute(map, {
			renderOptions: {map: map, panel: "result"}
		});
		}else if(method=="drive"){
		var transit = new BMap.DrivingRoute(map, {renderOptions: {map: map, panel: "result", autoViewport: true}});
		}else if(method=="walk"){
		var transit = new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "result", autoViewport: true}});
		}
		transit.search(pointA, pointB);
	}
	var interval;
	var countTime=0;
	var oStorage = window.localStorage;
	function timeTask(){
		nowlat=oStorage.getItem("lat");
		nowlng=oStorage.getItem("lng");
		if(lat||lng){
			interval=window.clearInterval(interval);
			$scope.naviMethod("drive");
		}else{
			countTime++;
			if(countTime>=20){
				$("#result").html("<a style='color:#ff0000'>&nbsp;&nbsp;&nbsp;&nbsp;获取当前位置失败，请点击刷新按钮。</a>");
			}
		}
	}
	if(isEmpty(lat)||isEmpty(lng)){
		interval=self.setInterval("timeTask()",1000);
	}else{
		$scope.naviMethod("drive");
	}	
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})


 //门店列表
.controller('shopListCtrl',function($state,$scope,giftService,$compile){
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	$scope.showTag=true;
	if(isEmpty(localStorage.preCity)){
		localStorage.preCity="北京";
	}
	$scope.preCity=localStorage.preCity;
	var city=encodeURIComponent($scope.preCity);
	giftService.getGiftShops(localStorage.actyId,localStorage.giftId,1,city,function(data){
		$scope.shopsTitle=data.reply.shopsTitle;
		$scope.shopDatas=data.reply.giftShopList;
		if($scope.shopDatas.length<recordsPerPage){
			$scope.showTag=false;
		}
	});
	var startNum,i=1;
	$scope.moreDatas=[];
	$scope.lookMore=function(){
		startNum=recordsPerPage*i+1; 
		giftService.getGiftShops(localStorage.actyId,localStorage.giftId,startNum,city,function(data){
			$scope.moreDatas[i]=data.reply.giftShopList;
			if($scope.moreDatas[i].length<recordsPerPage){
				$scope.showTag=false;
			}
			if($scope.moreDatas[i].length>0){
				var temp='<div class="addr_item" ng-repeat="shopdata in moreDatas['+i+']">';
				temp=temp+'<div class="city_addr border b_btm"><p class="name_p">{{shopdata.shopName}}</p><p class="addr_p">{{shopdata.addr}}</p></div></div>';
				temp=angular.element(temp);
				temp=$compile(temp)($scope);			
				$(".city_main").append(temp);
				i=i+1;
			}
		});
	}
})
.controller('shopCityCtrl',function(giftService,$state,$scope){ 
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	$(".top_bar").addClass("none");
	$scope.preCity=localStorage.preCity;
	giftService.getGiftShopCity(localStorage.actyId,localStorage.giftId,function(data){
		$scope.cityDatas=data.reply.cityMap;
	});
	$scope.toShopList=function(city){
		localStorage.preCity=city;		
		$state.go('shopList');
	}
	$scope.$on('$stateChangeStart',function(evt, toState, roParams, fromState, fromParams) {
		$(".top_bar").removeClass("none");
	});
})
//我的特权
.controller('myprivCtrl',function($scope,$state,$compile,privService,$timeout,cfpLoadingBar){ 
	if("mgm"!=localStorage.templateType && "mgm2"!=localStorage.templateType){
		weShareTitle=localStorage.defaultShareTitle;
		weShareDesc=localStorage.defaultShareDesc;
		weShareUrl=localStorage.defaultShareUrl;
		weShareImgUrl=localStorage.defaultShareImgUrl;
	}
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	var dbPageNo=1;
	var redisBeginIndex=0;
	var actyIdParam=localStorage.actyId; //mmc没要求，mgm必须要传actyId
	var i=0;
	var isDatabase,queryFlag,isQueying,orderList;
	//是否无数据
	$scope.emptyFlag=false;
	$scope.moreDatas=[];
	$scope.backHome=function(){
		if("mgm"==localStorage.templateType){
			location.href=MGMHomeURL;
		} 
		if("mgm2"==localStorage.templateType){
			location.href=MGM2HomeURL;
		} 
 	};
 	$scope.backScore=function(){
 		if("mgm"==localStorage.templateType){
			location.href=MGMPopularityURL;
		} 
		if("mgm2"==localStorage.templateType){
			location.href=MGM2PopularityURL;
		} 
 	};
	//弹出活动细则
	$scope.activityDetails=function(){
		var modal=document.getElementById("modal-5");
		modal.className +=" "+"md-show";
		var Romodal=document.getElementById("md-close");
		function removeClass(obj,cls){
			var reg=new RegExp('(\\s|^)'+ cls + '(\\s|$)');
			obj.className=obj.className.replace(reg,'');
		}
		Romodal.onclick=function(){
			removeClass(modal,'md-show');
		}
		var mySwiper = new Swiper('#swiper', {
			loop:true,
			pagination: '.swiper-pagination',
			autoplay: 1500,
			speed:1000,
			autoplayDisableOnInteraction: false,
		    direction: 'horizontal',
			mousewheelControl: true,
			watchSlidesProgress: true,
			onInit: function(swiper) {
				swiper.myactive = 0;
			},
			onProgress: function(swiper) {
				//console.log(swiper.myactive);
				for (var i = 0; i < swiper.slides.length; i++) {
					var slide = swiper.slides[i];
					var progress = slide.progress;
					var translate, boxShadow;			
					translate = progress * swiper.width * 0.3;
					scale = 1 - Math.min(Math.abs(progress * 0.6), 1);
					boxShadowOpacity = 0;
					slide.style.boxShadow = '0px 0px 10px rgba(0,0,0,' + boxShadowOpacity + ')';
					//console.log(swiper.myactive);
					var num=swiper.myactive;
					if (num==0)num=1;
					if (num==5)num=1;
					if (i == num) {
						es = slide.style;
						//es.opacity=scale;
						es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(' + (translate) + 'px,0,0) scale(' + scale + ')';
						es.zIndex=0;
					}else{
						es = slide.style;
						//es.opacity=1;
						es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform ='scale(' + scale + ')';
						es.zIndex=1;
					}
				}
			},
			onTransitionEnd: function(swiper, speed) {			
				var num=(swiper.activeIndex<=6)?swiper.activeIndex:8-swiper.activeIndex;				
				$("#prizesTag"+(num)).addClass("active");
				swiper.myactive = swiper.activeIndex;
			},
			onSetTransition: function(swiper, speed) {
				for (var i = 0; i < swiper.slides.length; i++) {
						$("#prizesTag"+(i+1)).removeClass("active");
						es = swiper.slides[i].style;
						es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
				}
			}		
			});
		//文本滚动域
	    var swiper = new Swiper('#txtSwiper1', {	    	
	        scrollbar: '.swiper-scrollbar',
	        direction: 'vertical',
	        slidesPerView: 'auto',
	        mousewheelControl: true,
	        freeMode: true,
	        autoHeight: true,
	        scrollbarHide:false,       
	        watchSlidesProgress: true,
	        onProgress: function(swiper, progress){
//	        	if(progress>1){
//	        		console.log("文本底部，注意，会多次触发！");
//	        	}
	        }        
	    });
	}
	function queryValidOrder(objFlag,queryNum){
		isQueying=true;
		var visibleFlag="01";
		if(localStorage.templateType=="mgm" || localStorage.templateType=="mgm2"){
		  	visibleFlag="02";
		}
		// if(queryNum == 0){cfpLoadingBar.start();}
		privService.getValidOrderList(dbPageNo,redisBeginIndex,actyIdParam,visibleFlag,function(data){
			isQueying=false;
			if(data.reply.returnCode.code == 'LIMIT'){				
				if(queryNum==queryTotalNum){
					cfpLoadingBar.complete();
					$scope.isRetry=true;
				}else{
					queryNum++;
					if(redisBeginIndex==0){
						$timeout(function(){						
							queryValidOrder(0,queryNum);
						},queryTime);
					}else{
						$timeout(function(){							
							queryValidOrder(1,queryNum);
						},queryTime);
					}
				}
			}else{
				cfpLoadingBar.complete();
				$scope.isRetry=false;
				orderList=data.reply.orderList;
				redisBeginIndex=data.reply.redisBeginIndex;
				isDatabase=data.reply.isDatabase;
				queryFlag=data.reply.queryFlag;
				if(localStorage.templateType=="mgm" || localStorage.templateType=="mgm2" ){
					if(isEmpty(orderList)){
						$scope.showTag=false;
						if(objFlag==0){
							$scope.emptyFlag=true;
						}
					}else{
						if(objFlag==0){
							$scope.orderList=orderList;
							if(orderList.length<3){
								$scope.showTag=true;
							}
						}else{
							//concat 拼接新加载list列表
							$scope.orderList=$scope.orderList.concat(orderList);
						}
						if(isDatabase){
							if(orderList.length==recordsPerPage){
								if(!queryFlag){
									$scope.showTag=false;
								}else{
									dbPageNo=dbPageNo+1;
								}
							}else{
								$scope.showTag=false;
							}
						}
					}
					$scope.privList=function(){
						//滚动域
					    var mySwiper = new Swiper('#txtSwiper', {
					        scrollbar: '.swiper-scrollbar',
					        direction: 'vertical',
					        slidesPerView: 'auto',
					        mousewheelControl: true,
					        freeMode: true,
					        autoHeight: true,
					        scrollbarHide:true,
					        onTouchStart:function(swiper){
					        },
					        onTouchEnd:function(swiper){
				        		if(swiper.translate < -40){
									if(mySwiper.isEnd){
										if(isDatabase){
											if(orderList.length == recordsPerPage && queryFlag){
												if(!isQueying)
												queryValidOrder(1,0);
												mySwiper.update(true);
											}
										}else{
											if(!isQueying)
											queryValidOrder(1,0);
											mySwiper.update(true);	
										}
									}
					        	}
					        }
				    });
				}
			}else{
				if(isEmpty(orderList)){ 	
					$scope.showTag=false;
					if(objFlag==0){
						$scope.emptyFlag=true;
					}
				}else{
					$scope.showTag=true;
					if(objFlag==0){
						$scope.orderList=orderList;
					}else{
						//concat 拼接新加载list列表
						$scope.orderList=$scope.orderList.concat(orderList);
					}
					if(isDatabase){
						if(orderList.length==recordsPerPage){
							if(!queryFlag){
								$scope.showTag=false;
							}else{
								dbPageNo=dbPageNo+1;
							}
						}else{
							$scope.showTag=false;
						}
					}
				}
			  }
			}
		});
	}
	// queryValidOrder(0,0);
	$scope.loadMore=function(){
		i++;
		$scope.showTag=false;
		queryValidOrder(1,0);
	}
	$scope.retry=function(){
		$scope.isRetry=false;
		if(redisBeginIndex == 0){
			queryValidOrder(0,0)
		}else{
			queryValidOrder(1,0);
		}
	}
	$scope.toGiftOrder=function(validData){
		if(validData.goodsType=="10"){
			var orderDetails={"orderId":validData.orderID,"couponID":validData.couponID,"startDate":validData.startDate,"endDate":validData.endDate,"couponPrice":validData.couponPrice,"actyID":validData.actyID,"giftID":validData.giftID,"orderStatus":validData.orderStatus,"couponClass":validData.couponClass,"couponSource":validData.couponSource,"id":validData.id};
			orderDetails=angular.toJson(orderDetails);		
			localStorage.orderDetails=orderDetails;		
			$state.go('giftOrder');
		}else{
			//实物礼品的物流信息
		}
	}
    cfpLoadingBar.complete();
})
.controller('myprvInvalidCtrl',function($scope,$state,privService,$compile,$timeout,cfpLoadingBar){
	var dbPageNo=1;
	var redisBeginIndex=0;
	var i=0;
	$scope.emptyFlag=false;
	$scope.moreDatas=[];
	function queryInvalidOrder(objFlag,queryNum){
		if(queryNum == 0){cfpLoadingBar.start();}
		privService.getInvalidOrderList(dbPageNo,redisBeginIndex,function(data){		
			if(data.reply.returnCode.code == 'LIMIT'){
				if(queryNum==queryTotalNum){
					cfpLoadingBar.complete();
					$scope.isRetry=true;
				}else{
					queryNum++;
					if(redisBeginIndex==0){
						$timeout(function(){						
							queryInvalidOrder(0,queryNum);
						},queryTime);
					}else{
						$timeout(function(){							
							queryInvalidOrder(1,queryNum);
						},queryTime);
					}
				}
			}else{
				cfpLoadingBar.complete();
				$scope.isRetry=false;
				redisBeginIndex=data.reply.redisBeginIndex;
				var isDatabase=data.reply.isDatabase;
				var orderList=data.reply.orderList;	
				if(isEmpty(orderList)){
					$scope.showTag=false;
					if(objFlag==0){
						$scope.emptyFlag=true;
					}
				}else{
					$scope.showTag=true;
					if(objFlag==0){
						$scope.orderList=orderList;
					}else{
						$scope.moreDatas[i]=orderList;
						var temp='<div class="cvt_item border b_lrb" ng-repeat="invalidData in moreDatas['+i+']"><span class="ico_top"></span><span class="ico_ylt"></span><span class="ico_yrt"></span><p class="cvt_img"><img ng-src={{invalidData.goodsBannerPicPath}}></p><p class="cvt_btm" ng-if="invalidData.goodsType==10"><span></span><span ng-bind="invalidData.endDate | effectDate"></span></p></div>';
						temp=angular.element(temp);
						temp=$compile(temp)($scope);
						$(".cvt_item_txt").append(temp);
					}
					if(isDatabase){
						if(orderList.length==recordsPerPage){
							var queryFlag=data.reply.queryFlag;
							if(!queryFlag){
								$scope.showTag=false;
							}else{
								dbPageNo=dbPageNo+1;
							}
						}else{
							$scope.showTag=false;
						}
					}
				};
			}
	    });
	}
	// queryInvalidOrder(0,0);
	$scope.loadMore=function(){
		i++;
		$scope.showTag=false;
		queryInvalidOrder(1,0);
	};
	$scope.retry=function(){
		$scope.isRetry=false;
		if(redisBeginIndex == 0){
			queryInvalidOrder(0,0);
		}else{
			queryInvalidOrder(1,0);
		}
	}
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('myprivWaitCtrl',function(privService,payService,giftService,$scope,$state,$compile,cfpLoadingBar,$timeout){
	var redisBeginIndex=0;
	var i=0;
	$scope.emptyFlag=false;
	$scope.priceArry=[]; $scope.moreDatas=[];
	function queryPayOrder(objFlag){
		privService.getPayOrderList(redisBeginIndex,function(data){
			var orderList=data.reply.orderList;
			if(isEmpty(orderList)){
				$scope.showTag=false;
				if(objFlag==0){
					$scope.emptyFlag=true;
				}
			}else{
				if(orderList.length < recordsPerPage){
					$scope.showTag=false;
				}else{
					$scope.showTag=true;
				}
				redisBeginIndex=data.reply.redisBeginIndex;
				specialStyle(orderList);
				if(objFlag==0){
					$scope.orderList=orderList;
				}else{
					$scope.moreDatas[i]=orderList;
					var temp='<div class="cvt_item border b_lrb" ng-repeat="waitPay in moreDatas['+i+']"><span class="ico_top"></span><span class="ico_ylt"></span><span class="ico_yrt"></span><p class="cvt_img"><img ng-src={{waitPay.goodsBannerPicPath}}></p><p class="cvt_btm" ng-if="isPayBtn(waitPay.needPayValid,waitPay.orderPrice)"><span ng-bind-html="priceArry['+i+'][$index]"></span><span class="button" ng-click="toPayTwo(waitPay.actyID,waitPay.giftID,waitPay.orderID,waitPay.goodsBannerPicPath,waitPay.orderPrice,waitPay.giftNum,waitPay.giftName)">立即支付</span></p><p class="cvt_btm" ng-if="!isPayBtn(waitPay.needPayValid,waitPay.orderPrice)"><span></span><span class="button" ng-click="sub_click||getForFree(waitPay.actyID,waitPay.giftID,waitPay.orderID,waitPay.orderPrice)">免费领取</span></p></div>';
					temp=angular.element(temp);
					temp=$compile(temp)($scope);			
					$(".cvt_item_txt").append(temp);
				}
			}
	    });
	}
    function specialStyle(list){
    	$scope.priceArry[i]=[];
		for(var j in list){
			var price="",obj;
			if(isEmpty(list[j].orderPrice)){
				$scope.priceArry[i].push("");
			}else{
				if(angular.isString(list[j].orderPrice)){
					obj=angular.fromJson(list[j].orderPrice);
		    	}else{
		    		obj=price;
		    	}
				for(var key in obj){
					var unitObj=angular.fromJson(obj[key]);
					price+="<em>"+unitObj.amt+"</em>"+unitObj["unitDesc"]+"+";
		    	}
				$scope.priceArry[i].push("待支付:"+price.substr(0,price.length-1));
			}
		}
		return $scope.priceArry[i];
	}
    // queryPayOrder(0);
	$scope.loadMore=function(){ 
		i++;
		$scope.showTag=false;
		queryPayOrder(1);
	}
	$scope.isPayBtn=function(needPayValid,exchPrice){
		var payFlag=true;
		if(isEmpty(exchPrice)||needPayValid=="02"){
			payFlag=false;
		}
		return payFlag;
	}
	$scope.toPayTwo=function(actyId,giftId,orderId,goodsBannerPicPath,orderPrice,giftNum,giftName){
		localStorage.actyId=actyId;
		localStorage.giftId=giftId;    
		localStorage.orderId=orderId;
		localStorage.goodsBannerPicPath=goodsBannerPicPath;
		localStorage.giftSumPrice=orderPrice;
		localStorage.giftNum=giftNum;
		localStorage.giftName=giftName;
		$state.go('payTwo');
	};
	$scope.getForFree=function(actyId,giftId,orderId,orderPrice){
		$scope.sub_click=true;
		localStorage.actyId=actyId;
		localStorage.giftId=giftId;
		localStorage.orderId=orderId;
		localStorage.giftSumPrice=orderPrice;
		payService.getPersonInfo(function(datas){
			$scope.succMess=datas.reply.succMess;//成功信息；
			payService.pay(null,null,null,function(data){//cipher,SMSCode,cardNo
				var isAsynchronous=data.reply.isAsynchronous;
				if(isAsynchronous){
					cfpLoadingBar.start();
					$timeout(function(){
						queryPayStatus(1);
	     			},2000);
				}else{
					var payCode=data.reply.payCode;
					if(payCode=="SSSSSS"){
						$scope.isSuccess=true;
						$scope.isFail=false;
						$scope.payTitle="支付成功";
						$scope.payMessage=$scope.succMess;
					}else{
						$scope.sub_click=false;
						$scope.isSuccess=false;
						$scope.isFail=true;
						$scope.payMessage=data.reply.payMessage;
					}
				}
			})
		});
    };
	function queryPayStatus(countParam){
		var isPayAsyn=true;
		giftService.getStatus(localStorage.orderId,localStorage.userKey,isPayAsyn,function(data){
			var retuCode=data.reply.retuCode;
			if(retuCode=="100251" || data.reply.returnCode.code == 'LIMIT'){
				if(countParam==3){
					cfpLoadingBar.complete();
					var orderStatus=data.reply.orderStatus;
					if(orderStatus=="30" || data.reply.returnCode.code == 'LIMIT'){
						$scope.isSuccess=true;
						$scope.isFail=false;
						$scope.payTitle="领取中";
						$scope.payMessage="领取中……，请稍候在我的特权中查看";
					}else{
						$scope.sub_click=false;
						$scope.isSuccess=false;
						$scope.isFail=true;
						$scope.payMessage="领取失败！请重新领取";
					}
				}else{
					countParam++;
					$timeout(function(){
						queryPayStatus(countParam);
					},2000);
				};
			}else if(retuCode=="SSSSSS"){
				cfpLoadingBar.complete();
				$scope.isSuccess=true;
				$scope.isFail=false;
				$scope.payTitle="支付成功";
				$scope.payMessage=$scope.succMess;
			}else{
				cfpLoadingBar.complete();
				$scope.sub_click=false;
				$scope.isSuccess=false;
				$scope.isFail=true;
				$scope.payMessage=data.reply.returnMessage;
			}
		})
	}
	$scope.popClose=function(){
		$scope.isFail=false;
	}
    // cfpLoadingBar.complete();
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('posPrecountCtrl', function($scope,$state,posService,$compile){    //商户所有券码页面+预计算
	var orderType="5020";
	localStorage.mechId="";
	posService.getCouponList(localStorage.mechId,1,1,function(data) {  
		$scope.mchtName=data.reply.mchtName;
		$scope.prefActySpec=data.reply.prefActySpec;
		$scope.mechPayData=data.reply.result.RESPONSE.BODY.ROW;
		if($scope.mechPayData.length<8){
			$scope.loadMore=function(){return false;}
		}
	});
	var i=1;$scope.moreDatas=[];
	$scope.loadMore=function(){   
		posService.getCouponList(localStorage.mechId,1,i+1,function(data){
			$scope.moreDatas[i]=data.reply.result.RESPONSE.BODY.ROW;
			if($scope.moreDatas[i].length<8){
				$scope.loadMore=function(){return false;}
			}
			if($scope.moreDatas[i].length>0){
				var temp='<div class="w_cvt border b_top_btm" style="margin:10px 0px;" ng-repeat="paydata in moreDatas['+i+']">';
				temp=temp+'<label><div style="height:100px"><div style="height:100px;width:300px;margin-left:10px;float:left;background:lightblue"><p class="w_txt" ng-bind="paydata.VPURSENAME"></p><p style="height:20px;"><span style="font-size:14px;" ng-bind="paydata.VOUCHERCODE"></span><span style="font-size:12px;" ng-bind="paydata.ENDDATE | effectDate"></span></p></div><input type="checkbox" name="test" ng-init="asd[$index]=false" ng-click="isCheck({{paydata}})" ng-model="asd[$index]" /></div></label></div>';
				temp=angular.element(temp);
				temp=$compile(temp)($scope);			
				$(".cont_box").append(temp);
				i++;
			}
	    });
	}
	var ptGroup=[];
	$scope.isAll=false;
	$scope.asd=[];
	$scope.isCheck=function(indata){     //存入参参数
		var leng=ptGroup.length;
		for(var j in ptGroup){
			if(ptGroup[j].VOUCHERCODE==indata.VOUCHERCODE){
				ptGroup.splice(j,1);
				break;
			}
		}
		if(ptGroup.length==leng){
			var addData={"couponId":indata.VOUCHERCODE,"couponClass":indata.DISCOUNTTYPE,"actyID":indata.CAMPAIGNID,"giftID":indata.CUSTDATA3};
			ptGroup.push(addData);
		}
		for(var i in $scope.asd){    //对应是否全选判断
			if(!$scope.asd[i]){
				$scope.isAll=false;
				break;
			}else{
				$scope.isAll=true;
			}
		}
	}
	$scope.checkAll=function(){
		if($scope.isAll){
			ptGroup=[];
			for(var i in $scope.asd){
				$scope.asd[i]=$scope.isAll;
				addData={"couponId":$scope.mechPayData[i].VOUCHERCODE,"couponClass":$scope.mechPayData[i].DISCOUNTTYPE,"actyID":$scope.mechPayData[i].CAMPAIGNID,"giftID":$scope.mechPayData[i].CUSTDATA3};
				ptGroup.push(addData);
			}
		}else{
			ptGroup=[];
			for(var j in $scope.asd){
				$scope.asd[j]=$scope.isAll;
			}
		}
	}
	$scope.precount=function(payPrice){
		if(isEmpty(payPrice)){
			alert("请您输入价格");
			return;
		}
		ptGroup=angular.toJson(ptGroup);
		posService.preCompute("00",ptGroup,payPrice,null,orderType,function(data){   //预计算方法调用
			var precountData=data.reply;
			precountData={"tranAmount":10,"postPrefAmount":140,"prefAmount":140,"prefDetail":"优惠明细内容","orderId":"EOD201610260000334857"};
			$state.go('posPrecountConfirm',{
				precountResult:precountData
			});
		});
	};
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('posPrecountConfirmCtrl',function($scope,$state,$stateParams,posService){   //预计算确认
	var orderType="5020";
	$scope.orderList=$stateParams.precountResult;
	if(isEmpty($scope.orderList.tranAmount)){
		$scope.unable=true;
	}
	$scope.confirm=function(orderId){
		posService.preCompute("01",null,null,orderId,orderType,function(data){
			var confirmData=data.reply.result;
			$state.go('posOrder',{
				confirmResult:confirmData
			});
		});
	};
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('posOrderCtrl',function($scope,$state,$stateParams,posService){
	$scope.orderId=$stateParams.confirmResult.returnBody.orderID;
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('posUnpayOrderCtrl',function($scope,$state,posService){   //订单等待支付
	posService.getPosOrderList("10",null,function(data){
		$scope.orderList=data.reply.orderList;
		$scope.orderDetail=[];
		for(var i in $scope.orderList){
			$scope.orderDetail[i]=angular.fromJson($scope.orderList[i].orderDetail);
		}
	});
	$scope.toConfirmOrPosOrder=function(tranStatus,orderId,payPrice){
		var orderType="5020";
		if(tranStatus=="20"){
			ptGroup=[];   //优惠缺少DISCOUNTTYPE,CAMPAIGNID,CUSTDATA3数据，未进行ptGroup优惠组合处理
			posService.preCompute("00",ptGroup,payPrice,null,orderType,function(data){   //预计算方法调用
				var precountData=data.reply;
				$state.go('posPrecountConfirm',{
					precountResult:precountData
				});
			});
		}else{      
			posService.preCompute("01",null,null,orderId,orderType,function(data){
				var confirmData=data.reply.result;
				$state.go('posOrder',{
					confirmResult:confirmData
				});
			});
		}
	}
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('posFinishOrderCtrl',function($scope,$state,posService){   //订单已经完成页面 +分页未做
	var startNum=1;
	posService.getPosOrderList("60",startNum,function(data){
		console.log("已完成订单",data);
		//$scope.orderList=data.reply.orderList;
	});
	$scope.orderList=[{"tranAmount":10,"postPrefAmount":140,"prefAmount":140,"prefDetail":"优惠明细内容11111","orderId":"EOD201610260000337"},
	        		  {"tranAmount":20,"postPrefAmount":100,"prefAmount":10,"prefDetail":"优惠明细内容22222","orderId":"EOD20161026000035"},
	        		  {"tranAmount":10,"postPrefAmount":140,"prefAmount":140,"prefDetail":"优惠明细内容33333","orderId":"EOD20161026000033"},
	        		  {"tranAmount":10,"postPrefAmount":140,"prefAmount":140,"prefDetail":"优惠明细内容11111","orderId":"EOD201610260000"},
	        		  {"tranAmount":20,"postPrefAmount":100,"prefAmount":10,"prefDetail":"优惠明细内容22222","orderId":"EOD201610260485734"},];
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
})
.controller('errorCtrl',function($scope,$state){
	weShare(weShareTitle,weShareDesc,weShareUrl,weShareImgUrl);
	var status=localStorage.responseStatus;
	if(!isEmpty(status)){
		$scope.errorCode="返回码："+status;
	}
	var errorTitle={"-1":"网络异常","F":"活动火爆","504":"网络超时","requestError":"网络超时"};
	var errorMsg={"-1":"wifi或移动数据已断开，请检查网络后，敬请重试！","F":"活动火爆，敬请重试！","504":"网络超时，请检查网络后，敬请重试！","requestError":"请求超时，请检查网络后，敬请重试！","empty":"网络超时，请检查网络后，敬请重试！"};
	if(errorTitle[status]){
		$scope.errorTitle=errorTitle[status];
	}else{
		$scope.errorTitle="活动火爆";
	}
	
	if(errorMsg[status]){
		$scope.errorMsg=errorMsg[status];
	}else{
		$scope.errorMsg="活动火爆，敬请重试！";
	}
	$scope.goHome=function(){
		if("mgm"==localStorage.templateType){
			location.href="./home_mgm.$13516.html"+"#/actyGroupTab";
		}else if("mgm2"==localStorage.templateType){
			location.href="./home_mgm2.$13516.html"+"#/actyGroupTab";
		}else{
			location.href="./home.$13516.html"+"#/all";
		}
	}
})
 //头部控制器
.controller('headerCtrl', function ($scope) {
    if (localStorage.ChannelType == "02") {
        $scope.app_channle = true;
        $scope.wei_channle = false;
    } else {
        $scope.app_channle = false;
        $scope.wei_channle = true;
    }
})

 