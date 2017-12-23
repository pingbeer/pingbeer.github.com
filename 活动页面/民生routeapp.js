// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('activityday', ['ngAnimate', 'ngSanitize', 'ui.router',
    'activityday.controllers', 'activityday.routes','activityday.services', 'activityday.directives','activityday.filters',
    'angular-loading-bar','chieffancypants.loadingBar','ngTouch'
])

.config(['$httpProvider', function($httpProvider) {
  if(!$httpProvider.defaults.headers.get){
    $httpProvider.defaults.headers.get={};
  }
    $httpProvider.defaults.headers.common["X-Requested-with"]='XMLHttpRequest';
    $httpProvider.defaults.headers.get["Cache-Control"]='no-cache';
    $httpProvider.defaults.headers.get["Pragma"]='no-cache';

  $httpProvider.interceptors.push('httpInterceptor');
}])

.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  //cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
  cfpLoadingBarProvider.latencyThreshold = 2000;
  //cfpLoadingBarProvider.spinnerTemplate = '<div class="pop_wraper"><div class="pop_outer"><span class="lookMore"><em class="spinMore"></em>Loading......</span></div></div>';
  cfpLoadingBarProvider.spinnerTemplate = '<div class="loading_wraper"><div class="loading_outer"><div class="loading_cont"><em class="loading_img"></em><em>加载中，请稍候...</em></div></div></div>';
}])
  
.factory('httpInterceptor', ['$q', '$injector' ,'$location','$rootScope',function($q, $injector, $location,$rootScope) {
  var httpInterceptor = {
    'request' : function(config) {
      //获取当前路由地址
      var path=$location.path();
      //根据不同页面显示不同的title
      if(path=="/all"||path=="/exclusive"||path=="/allCard"){
        $rootScope.top_title="我的特权";
      }else if(path=="/mypriv"||path=="/myprvInvalid"||path=="/myprivWait"){
        $rootScope.top_title="个人礼券";
      }else{
        $rootScope.top_title="详情";
      }
      return config;
    },
    'requestError' : function(err) {
      localStorage.responseStatus="requestError";
      $injector.get("$state").go("error");
      return $q.reject(err);
    },
    'response' : function(response) {
      if(angular.isObject(response.data.reply) && response.data.reply.returnCode.type!="S"){
        if($injector.get("cfpLoadingBar").status()!=0){    //执行function返回returnCode.type不为"S"时，判断loading状态不为0时关闭
          $injector.get("cfpLoadingBar").complete();
        }
        localStorage.responseStatus="F";
        $injector.get("$state").go("error");
      }
      return response;
    },
    'responseError' : function(response) {
      if($injector.get("cfpLoadingBar").status()!=0){    //https请求系统响应失败，判断loading状态不为0时关闭
        $injector.get("cfpLoadingBar").complete();
      }
      if(isEmpty(response.status)){
        localStorage.responseStatus="empty";
      }else{
        localStorage.responseStatus=response.status;
      }
      $injector.get("$state").go("error");
      return $q.reject(response);
    }
  }
  return httpInterceptor;
} 
])

.run(function() {
  //FastClick.attach(document.body);
});

