angular.module('activityday.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state("tab1", {
			url: "/all",
			//abstartct:true,
			templateUrl: "./activityday/template/tabAll.$11295.html",
			controller: "allCtrl"
		})
	    .state("tab2", {
	        url: "/exclusive",
	        templateUrl: "./activityday/template/tabExclusive.$11295.html",
	        controller: "exclusiveCtrl"
	    })   
	    .state("tab3", {
	        url: "/allCard",
	        templateUrl: "./activityday/template/tabAllCard.$11295.html",
	        controller: "allCardCtrl"
	    })
	    .state("tab4", {
	        url: "/niceLife",
	        templateUrl: "./activityday/template/tabNiceLife.$11295.html",
	        controller: "niceLifeCtrl"
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
			    			return "./mgm2/template/actyGroupTab.$12503.html";
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
			    		}else{
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
		    		templateUrl: "./activityday/template/prodList.$12832.html",
		    		controller: "prodListCtrl"
		    	},
		    	"gift@prodList":{
		    		//templateUrl: function(){return getTemplateType()+"/template/prodList-gift.html";},
		    		templateUrl: "./activityday/template/prodList-gift.$11860.html",
				    controller: "prodListGiftCtrl"
		    	}
		    }
		}) 
		/*.state("prodList.gift", {
		    url: "/giftList",
		    templateUrl: "activityday/template/prodList-gift.html?rev",
		    controller: "prodListGiftCtrl"
		}) */
	    .state('actyDetail',{           
	    	url:"/actyDetail",
	    	templateUrl: "./activityday/template/actyDetail.$11295.html",
	        controller: "actyDetailCtrl"
	    })
	    .state("giftExchange", {
	        url: "/giftExchange",
	        templateUrl: "./activityday/template/giftExchange.$13460.html",
	        controller: "giftExchangeCtrl"
	    })
	    .state("giftGroupExchange", {
	        url: "/giftGroupExchange",
	        templateUrl: "./activityday/template/giftGroupExchange.$13460.html",
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
		    		templateUrl: "./activityday/template/pay.$13460.html",
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
		    		templateUrl: "./activityday/template/payTwo.$13460.html",
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
	    			return "./mgm/template/mypriv.$11619.html";
	    		}else if("mgm2"==localStorage.templateType){
	    			return "./mgm2/template/mypriv.$12503.html";
	    		}else{
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
			templateUrl: "./activityday/template/giftOrder.$13040.html",
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