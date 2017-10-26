angular.module('activityday.services', [])
.factory("actyService",function($http){
	return{
		getActyList:function(callback){
			 return $http.get("./activityday/data/actyList.$13515.html").success(callback);
		},
		/*getActyList:function(callback){
			return $http({
				method:'GET',
				url:servicePath+"main/QueryActyList.json",
				params:{"userKey":localStorage.userKey}
				})
			.success(callback);
		},*/
		getActyDetail:function(actyId,callback){          
			return $http({
				method:'GET',
				url:servicePath+"data/QueryActyDetail.json",
				params:{"actyId":actyId}
			})
			.success(callback);
		},
		sendMQ:function(callback){
			var lastMQTime=localStorage.lastMQTime;
			if(isEmpty(lastMQTime)){
				lastMQTime="";
			}
			return $http({
				method:'GET',
				url:servicePath+"main/SendMQ.json",
				ignoreLoadingBar:true,
				params:{"actyId":localStorage.actyId,"userKey":localStorage.userKey,"lastMQTime":lastMQTime}
			})
			.success(callback);
		},
	}
})
.factory("giftService",function($http){  
	return{
		getQualify:function(detailFlag,queryNum,callback){			
			var datas={"actyId":localStorage.actyId,"userKey":localStorage.userKey,"UIFlag":localStorage.UIFlag,"detailFlag":detailFlag,"queryNum":queryNum};
			return $http({
					method:'GET',
					url:servicePath+"data/QueryQualify.json",
					params:datas,
					ignoreLoadingBar:true
				})
				.success(callback);
		},
		getProdList:function(callback){			
			var datas={"actyId":localStorage.actyId,"userKey":localStorage.userKey,"UIFlag":localStorage.UIFlag};
			return $http({
					method:'GET',
					url:servicePath+"data/QueryProdList.json",
					params:datas,
					ignoreLoadingBar:true
				})
				.success(callback);
		},
		getActyGroupTab:function(callback){			
			var datas={"actyId":localStorage.actyId,"actyGroupId":localStorage.actyGroupId,"userKey":localStorage.userKey};
			return $http({
					method:'GET',
					url:servicePath+"main/QueryActyGroupTab.json",
					params:datas,
					ignoreLoadingBar:true
				})
				.success(callback);
		},
		getActyGift:function(maxInterval,callback){
			var datas={"actyId":localStorage.actyId,"giftId":localStorage.giftId,"maxInterval":maxInterval,"userKey":localStorage.userKey,"isQualify":localStorage.isQualify,"UIFlag":localStorage.UIFlag};
			return $http({
	    			method:'GET',
	    			url:servicePath+"data/QueryGift.json",
	    			params:datas
				})
				.success(callback);
		},
		//礼品组
		getGroupGift:function(callback){
			var datas={"actyId":localStorage.actyId,"groupId":localStorage.groupId,"userKey":localStorage.userKey,"isQualify":localStorage.isQualify,"UIFlag":localStorage.UIFlag};
			return $http({
	    			method:'GET',
	    			url:servicePath+"main/QueryGroupGift.json",
	    			params:datas
				})
				.success(callback);
		},
		getGroupGiftDetail: function(actyId,giftId,groupId,callback) { //礼品组详情页
			return $http({
					method:'GET',
					url:servicePath+"main/QueryGroupGiftDetail.json",
					params:{
						"actyId":actyId,
						"giftId":giftId,
						"userKey":localStorage.userKey,
						"groupId":groupId
					}
			})
			.success(callback);
		},	
		getGiftShops: function(actyId,giftId,startNum,city,callback) { 
            return $http({
    			method:'GET',
    			url:servicePath+"main/QueryGiftShops.json",
    			params:{
        		   "actyId":actyId,
				   "giftId":giftId,
				   "pageStart":startNum,
				   "recordsPerPage":recordsPerPage,
				   "cityCode":city
				}
			})
			.success(callback);
        },
		getGiftShopCity: function(actyId,giftId,callback) { 
            return $http({
    			method:'GET',
    			url:servicePath+"main/QueryGiftShopCity.json",
    			params:{
    				"actyId":actyId,
    				"giftId":giftId
    				}
			})
			.success(callback);
        },	   
		//提交订单
        order: function(actyId,giftId,groupId,merchantId,giftNum,jcaptchaText,isCaptcha,callback) {
			var datas={"actyId":actyId,"giftId":giftId,"groupId":groupId,"merchantId":merchantId,"giftNum":giftNum,"jcaptchaText":jcaptchaText,"userKey":localStorage.userKey,"isCaptcha":isCaptcha,"channelType":localStorage.templateType,"timp":getTmp()};
			return $http({
	    			method:'GET',
	    			url:servicePath+"data/Order.json",
	    			params:datas,
	    			ignoreLoadingBar:true
				})
				.success(callback);
        },
        getStatus: function(orderId,userKey,isPayAsyn,callback) { 		
			var datas={"orderId":orderId,"userKey":userKey,"channelType":localStorage.templateType,"isPayAsyn":isPayAsyn};
			return $http({
	    			method:'GET',
	    			url:servicePath+"main/QueryExchOrderStatus.json",
	    			params:datas,
	    			ignoreLoadingBar:true
				})
				.success(callback);
        },
        orderDetail: function(actyId,giftId,callback) { 
			var datas={"actyId":actyId,"giftId":giftId,"userKey":localStorage.userKey};
			return $http({
	    			method:'GET',
	    			url:servicePath+"main/QueryOrderDetail.json",
	    			params:datas
				})
				.success(callback);
        },
        getCouponCode: function(orderID,giftID,subOrderId,actionName,callback) { 		
			var datas={"userKey":localStorage.userKey,"orderId":orderID,"giftId":giftID,"subOrderId":subOrderId,"actionName":actionName};
			return $http({
	    			method:'GET',
	    			url:servicePath+"main/GetCouponCode.json",
	    			params:datas
				})
				.success(callback);
        },
        getTranQRCode: function(ptGroup,merchantId,callback) { 		
			var datas={"ptGroup":ptGroup,"userKey":localStorage.userKey,"orderType":"5010","merchantId":merchantId};
			return $http({
	    			method:'GET',
	    			url:servicePath+"main/Precompute.json",
	    			params:datas
				})
				.success(callback);
        },
        getSetCouponCompletion: function(orderId,couponId,callback) { 
			var datas={"orderId":orderId,"couponId":couponId,"userKey":localStorage.userKey};
			return $http({
	    			method:'GET',
	    			url:servicePath+"main/SetCouponCompletion.json",
	    			params:datas
				})
				.success(callback);
        },
        getSearchNearbyStore: function(storeType,lng,lat,callback) { 
			var datas={"storeType":storeType,"lng":lng,"lat":lat,"radius":"5000"};
			return $http({
	    			method:'GET',
	    			cache : true,
	    			url:servicePath+"main/SearchNearbyStore.json",
	    			params:datas
				})
				.success(callback);
        },
        getPriceCN: function(price){
        	var priceCN="";
        	var priceObj;
        	if(angular.isString(price)){
        		priceObj=angular.fromJson(price);
        	}else{
        		priceObj=price;
        	}
        	for(var key in priceObj){
        		var unitObj=angular.fromJson(priceObj[key]);
        		priceCN=priceCN+" + "+'<span class="col1">'+unitObj["amt"]+"</span>"+unitObj["unitDesc"];
        	}
        	if(!isEmpty(priceCN)){
        		priceCN=priceCN.substring(3);
        	}
        	return priceCN;
        },
        getGiftSumPrice: function(price,num){
        	var priceObj;
        	var sumPriceObj={};
        	if(angular.isString(price)){
        		priceObj=angular.fromJson(price);
        	}else{
        		priceObj=angular.copy(price);
        	}
        	for(var key in priceObj){
        		var valueObj=priceObj[key];
        		sumPriceObj[key]=valueObj;
        		sumPriceObj[key]["amt"]=valueObj["amt"]*num;
        	}
        	return sumPriceObj;
        },
    }
})
//我的特权
.factory("privService", function($http) { 
    return {
    	getValidOrderList:function(dbPageNo,redisBeginIndex,actyId,visibleFlag,callback) {
    		return $http({
    			method:'GET',
    			url:servicePath+"data/QueryValidOrderList.json",
    			params:{
  				  "userKey":localStorage.userKey,
  				  "channelType":localStorage.templateType,
  				  "actyId":actyId,
  				  "dbPageNo":dbPageNo,
  				  "redisBeginIndex":redisBeginIndex,
  				  "recordsPerPage":recordsPerPage,
  				  "visibleFlag":visibleFlag
    			},
    			ignoreLoadingBar:true
    		})
    		.success(callback);
    	},
    	getInvalidOrderList: function(dbPageNo,redisBeginIndex,callback) {
    		return $http({
    			method:'GET',
    			url:servicePath+"data/QueryInvalidOrderList.json",
    			params:{
    				  "userKey":localStorage.userKey,
    				  "dbPageNo":dbPageNo,
    				  "redisBeginIndex":redisBeginIndex,
    				  "recordsPerPage":recordsPerPage
    			},
    			ignoreLoadingBar:true
			})
			.success(callback);
        },
        getPayOrderList: function(redisBeginIndex,callback) {
    		return $http({
    			method:'GET',
    			url:servicePath+"data/QueryPayOrderList.json",
    			params:{
	    			  "userKey":localStorage.userKey,
	  				  "redisBeginIndex":redisBeginIndex
  				}
			})
			.success(callback);
        }
    }
})
.factory("payService",function($http){  	
	return{
		//获取验证码
		sendSMSCode: function(mobile,countDownTimes,callback) { 
			 var datas={"mobile":mobile,"countDownTimes":countDownTimes,"userKey":localStorage.userKey};
			 return $http({
	    			method:'GET',
	    			url:servicePath+"main/SendSMSCode.json",
	    			params:datas,
	    			ignoreLoadingBar:true
				})
				.success(callback);
        },
		//支付订单
		pay: function(cipher,SMSCode,cardNo,callback) { 
			 var datas={"userKey":localStorage.userKey,"orderId":localStorage.orderId,"cipher":cipher,"SMSCode":SMSCode,"cardNo":cardNo,"channelType":localStorage.templateType};
			 return $http({
	    			method:'GET',
	    			url:servicePath+"main/Pay.json",
	    			params:datas,
	    			ignoreLoadingBar:true
				})
				.success(callback);
        },
		//卡列表手机号
		getPersonInfo:function(callback){
			var datas={"userKey":localStorage.userKey,"actyId":localStorage.actyId,"giftId":localStorage.giftId,"giftSumPrice":localStorage.giftSumPrice};
			 return $http({
	    			method:'GET',
	    			url:servicePath+"main/QueryPersonInfo.json",
	    			params:datas,
	    			ignoreLoadingBar:true
				})
				.success(callback);
		},
		getMobile:function(queryNum,callback){
			var datas={"userKey":localStorage.userKey,"queryNum":queryNum};
			 return $http({
	    			method:'GET',
	    			url:servicePath+"main/QueryMobile.json",
	    			params:datas,
	    			ignoreLoadingBar:true
				})
				.success(callback);
		},
		getCardList:function(queryNum,callback){
			var datas={"userKey":localStorage.userKey,"queryNum":queryNum,"giftSumPrice":localStorage.giftSumPrice};
			 return $http({
	    			method:'GET',
	    			url:servicePath+"main/QueryCardList.json",
	    			params:datas,
	    			ignoreLoadingBar:true
				})
				.success(callback);
		}
	}
})
.factory("posService",function($http){
	return{
        //商户支付-扫一扫后查询有效票券
        getCouponList: function(mechId,pageStart,frequency,callback) {
            return $http({
    			method:'GET',
    			url:servicePath+"main/QueryCouponList.json",
    			params:{
    				"userKey":localStorage.userKey,
    				"merchantId":mechId,
    				"pageStart":pageStart,
    				"frequency":frequency,
	  				"recordsPerPage":8
    			}
			})
			.success(callback);
        },
        //预计算结果和确认的结果
        preCompute:function(calFlag,ptGroup,payPrice,orderId,orderType,callback) { 
        	var data;
        	if(calFlag=="00"){
        		data={	
        				"userKey":localStorage.userKey,
        				"ptGroup":ptGroup,
        				"payPrice":payPrice,
        				"calFlag":calFlag,
        				"orderType":orderType
        			}
        	}else if(calFlag=="01"){
        		data={
        				"userKey":localStorage.userKey,
        				"calFlag":calFlag,
        				"orderId":orderId,
        				"orderType":orderType
        			}
        	}
            return $http({
    			method:'GET',
    			url:servicePath+"main/Precompute.json",
    			params:data
			})
			.success(callback);
        },
        //60已完成、待支付订单列表
        getPosOrderList: function(tranStatus,startNum,callback) {
            return $http({
    			method:'GET',
    			url:servicePath+"main/QueryPosOrderList.json",
    			params:{
    				"userKey":localStorage.userKey,
    				"tranStatus":tranStatus,
    				'pageStart':startNum,
    				'recordsPerPage':recordsPerPage
    			}
			})
			.success(callback);
        }
	}
})
.factory("encryptService",function($http){
	return{
		TDESEncryptByCMBCC:function(paramMap,callback){          
			return $http({
				method:'GET',
				url:servicePath+"main/TDESEncryptByCMBCC.json",
				params:{"paramMap":paramMap}
			})
			.success(callback);
		}
	}
})
