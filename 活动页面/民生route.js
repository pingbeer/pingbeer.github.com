angular.module('activityday.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state("tab1", {
			url: "/all",
			//abstartct:true,
			templateUrl: "./activityday/template/tabAll.$13997.html",
			controller: "allCtrl"
		})
	    .state("tab2", {
	        url: "/exclusive",
	        templateUrl: "./activityday/template/tabExclusive.$13997.html",
	        controller: "exclusiveCtrl"
	    })   
	    .state("tab3", {
	        url: "/allCard",
	        templateUrl: "./activityday/template/tabAllCard.$13997.html",
	        controller: "allCardCtrl"
	    })
	    .state("tab4", {
	        url: "/niceLife",
	        templateUrl: "./activityday/template/tabNiceLife.$11295.html",
	        controller: "niceLifeCtrl"
	    })
	    .state("actyGroupActyList", {
	        url: "/actyGroupActyList",
	        templateUrl: "./activityday/template/actyGroupActyList.$14099.html",
	        controller: "actyGroupActyListCtrl"
	    })
	    .state("actyGroupTab", {
		    url: "/actyGroupTab",
		    views: {
		    	"":{
		    		//templateUrl: function(){return getTemplateType()+"/template/actyGroupTab.html";},
		    		templateUrl: function(){
			    		if("mgm"==localStorage.templateType){
			    			return "./mgm/template/actyGroupTab.$11619.html";
			    		}else if("mgm2"==localStorage.templateType){
			    			return "./mgm2/template/actyGroupTab.$14473.html";
			    		}else if("mgm3"==localStorage.templateType){
			    			return "./mgm3/template/actyGroupTab.$16544.html";
			    		}else if("drama"==localStorage.templateType){
			    			return "./drama/template/actyGroupTab.$15336.html";
			    		}else if("jzyf"==localStorage.templateType){
			    			return "./jzyf/template/actyGroupTab.$16069.html";
			    		}else if("xkzm"==localStorage.templateType){
							return "./xkzm/template/actyGroupTab.$16778.html";
						}else if("student"==localStorage.templateType){
							return "./student/template/actyGroupTab.$16776.html";
						}else{
			    			return "";
			    		}
			    	},
		    		controller: "actyGroupTabCtrl"
		    	},
		    	"qualify@actyGroupTab":{
		    		//templateUrl: function(){return getTemplateType()+"/template/qualify.html";},
		    		templateUrl: function(){
			    		if("mgm"==localStorage.templateType){
			    			return "./mgm/template/qualify.$11295.html";
			    		}else if("mgm2"==localStorage.templateType){
			    			return "./mgm2/template/qualify.$12503.html";
			    		}else if("mgm3"==localStorage.templateType){
			    			return "./mgm3/template/qualify.$16397.html";
			    		}else if("drama"==localStorage.templateType){
			    			return "./drama/template/qualify.$15336.html";
			    		}else if("jzyf"==localStorage.templateType){
						return "./jzyf/template/qualify.$15960.html";
					}else if("student"==localStorage.templateType){
						return "./student/template/qualify.$16876.html";
						}
			    		else{
			    			return "";
			    		}
			    	},
				    controller: "prodListCtrl"
		    	}
		    }
		}) 
		.state("prodList", {
		    url: "/prodList",
		    views: {
		    	"":{
		    		//templateUrl: function(){return getTemplateType()+"/template/prodList.html";},
		    		templateUrl: "./activityday/template/prodList.$17751.html",
		    		controller: "prodListCtrl"
		    	},
		    	"gift@prodList":{
		    		//templateUrl: function(){return getTemplateType()+"/template/prodList-gift.html";},
		    		templateUrl: "./activityday/template/prodList-gift.$11860.html",
				    controller: "prodListGiftCtrl"
		    	}
		    }
		}) 
		 .state('giftList',{           
	    	url:"/giftList",
	    	templateUrl: "./activityday/template/giftList.$17751.html",
	        controller: "giftListCtrl"
	    })
		/*.state("prodList.gift", {
		    url: "/giftList",
		    templateUrl: "activityday/template/prodList-gift.html?rev",
		    controller: "prodListGiftCtrl"
		}) */
	    .state('actyDetail',{           
	    	url:"/actyDetail",
	    	templateUrl: "./activityday/template/actyDetail.$16786.html",
	        controller: "actyDetailCtrl"
	    })
	    .state("giftExchange", {
	        url: "/giftExchange",
			cache:false,
	        templateUrl: "./activityday/template/giftExchange.$14097.html",
	        controller: "giftExchangeCtrl"
	    })
	    .state("giftGroupExchange", {
	        url: "/giftGroupExchange",
	        templateUrl: "./activityday/template/giftGroupExchange.$14097.html",
	        controller: "giftGroupExchangeCtrl"
	    })	
	    .state('giftGroupGiftDetail',{               
	    	url:"/giftGroupGiftDetail",
	    	templateUrl: "./activityday/template/giftGroupGiftDetail.$11295.html",
	        controller: "giftGroupGiftDetailCtrl"
	    })
		.state('giftDetail',{       		
			url:"/giftDetail",
			templateUrl: "./activityday/template/giftDetail.$11689.html",
			controller: "giftDetailCtrl"
		})
	    .state('shopList',{           
	    	url:"/shopList",
	    	templateUrl: "./activityday/template/shopList.$11295.html",
	        controller: "shopListCtrl"
	    })
	    .state('shopCity',{           
	    	url:"/shopCity",
	    	templateUrl: "./activityday/template/shopCity.$11295.html",
	        controller: "shopCityCtrl"
	    })
	    .state('pay', {
	        url: '/pay',
	        views: {
		    	"":{
		    		templateUrl: "./activityday/template/pay.$14097.html",
			        controller: "payCtrl"
		    	},
		    	"mobile@pay":{
		    		templateUrl: "./activityday/template/mobile.$11295.html",
		    		//template:'<div class="font_32" ng-bind="encryptMobile"></div><input type="hidden" ng-model="mobile">',
				    controller: "payMobileCtrl"
		    	},
		    	"cardList@pay":{
		    		templateUrl: "./activityday/template/cardList.$11295.html",
				    controller: "payCardListCtrl"
		    	}
		    }
	    })
		.state('payTwo', {
			url: '/payTwo',
			views: {
		    	"":{
		    		templateUrl: "./activityday/template/payTwo.$14097.html",
					controller: "payCtrl"
		    	},
		    	"mobile@payTwo":{
		    		templateUrl: "./activityday/template/mobile.$11295.html",
		    		//template:'<div class="font_32" ng-bind="encryptMobile"></div><input type="hidden" ng-model="mobile">',
				    controller: "payMobileCtrl"
		    	},
		    	"cardList@payTwo":{
		    		templateUrl: "./activityday/template/cardList.$11295.html",
				    controller: "payCardListCtrl"
		    	}
		    }
		})
		.state('posPrecount', {      //预计算
			url: '/posPrecount',
			templateUrl: "./activityday/template/posPrecount.$11295.html",
			controller: "posPrecountCtrl"
		})
		.state('posPrecountConfirm', {     //预计算确认
			url: '/posPrecountConfirm',
			templateUrl: "./activityday/template/posPrecountConfirm.$11295.html",
			params:{
				precountResult:""
			},
			controller: "posPrecountConfirmCtrl"
		})
		.state('posOrder', {    //商户支付
			url: '/posOrder',
			templateUrl: "./activityday/template/posOrder.$11295.html",
			params:{
				confirmResult:""
			},
			controller: "posOrderCtrl"
		})
		.state('posUnpayOrder', {    //订单待支付
			url: '/posUnpayOrder',
			templateUrl: "./activityday/template/posUnpayOrder.$11295.html",
			controller: "posUnpayOrderCtrl"
		})
		.state('posFinishOrder', {    //订单已完成
			url: '/posFinishOrder',
			templateUrl: "./activityday/template/posFinishOrder.$11295.html",
			controller: "posFinishOrderCtrl"
		})
	    .state('mypriv',{                          
	    	url:"/mypriv",
	    	templateUrl: function(){
	    		//return getTemplateType()+"/template/mypriv.html";
	    		if("mgm"==localStorage.templateType){
	    			return "./mgm/template/mypriv.$14369.html";
	    		}else if("mgm2"==localStorage.templateType){
	    			return "./mgm2/template/mypriv.$14473.html";
	    		}else if("mgm3"==localStorage.templateType){
	    			return "./mgm3/template/mypriv.$16397.html";
	    		}else if("jzyf"==localStorage.templateType){
	    			return "./jzyf/template/mypriv.$16015.html";
	    		}else if("xkzm"==localStorage.templateType){
				return "./xkzm/template/mypriv.$16744.html";
			} else if("student"==localStorage.templateType){
				return "./student/template/mypriv.$16888.html";
			}
	    		else{
	    			return "./activityday/template/mypriv.$11860.html";
	    		}
	    	},
	    	//templateUrl: "./activityday/template/mypriv.$11860.html",
	        controller: "myprivCtrl"
	    })
	    .state('myprvInvalid',{                    
	    	url:"/myprvInvalid",
	    	templateUrl: "./activityday/template/myprvInvalid.$11295.html",
	        controller: "myprvInvalidCtrl"
	    })
		.state('myprivWait',{               
			url:"/myprivWait",
			templateUrl: "./activityday/template/myprivWait.$11295.html",
			controller: "myprivWaitCtrl"
		 })
	    .state('giftOrder', {
			url: '/giftOrder',
			templateUrl: function(){
				//return getTemplateType()+"/template/mypriv.html";
				 if("student"==localStorage.templateType){
					return "./student/template/giftOrder.$16924.html";
				}
				else{
					return "./activityday/template/giftOrder.$12719.html";
				}
			},
			controller: "giftOrderCtrl"
		})
	    .state('giftJDOrder', {
			url: '/giftJDOrder',
			templateUrl: "./jzyf/template/giftJDOrder.$16055.html",
			controller: "giftOrderCtrl"
		})
	    .state('location', {
			url: '/location',
			templateUrl: "./activityday/template/location.$11295.html",
			controller: "searchNearbyStoreCtrl"
		})
	    .state('busSubway', {
			url: '/busSubway',
			templateUrl: "./activityday/template/busSubway.$11295.html",
			controller: "busSubwayCtrl"
		})
		.state('error', {
			url: '/error',
			templateUrl: "./activityday/template/error.$12537.html",
			controller: "errorCtrl"
		})
		
	    $urlRouterProvider.otherwise("/all");
});