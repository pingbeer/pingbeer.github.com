angular.module('activityday.directives', [])
	.directive('rjCloseBackDrop', [function() {
	    return {
	        scope: false,
	        restrict: 'A',
	        replace: false,
	        link: function(scope, iElm, iAttrs, controller) {
	            var htmlEl = angular.element(document.querySelector('html'));
	            htmlEl.on("click", function(event) {
	                if (event.target.nodeName === "HTML" &&
	                    scope.popup.optionsPopup &&
	                    scope.popup.isPopup) {
	                    scope.popup.optionsPopup.close();
	                    scope.popup.isPopup = false;
	                }
	            });
	        }
	    };
	}])
    .directive('resizeFootBar', ['$ionicScrollDelegate', function($ionicScrollDelegate){
        // Runs during compile
        return {
            replace: false,
            link: function(scope, iElm, iAttrs, controller) {
                scope.$on("taResize", function(e, ta) {
                    if (!ta) return;
                    var scroll = document.body.querySelector("#message-detail-content");
                    var scrollBar = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
                    // console.log(scroll);
                    var taHeight = ta[0].offsetHeight;
                    var newFooterHeight = taHeight + 10;
                    newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

                    iElm[0].style.height = newFooterHeight + 'px';
                    scroll.style.bottom = newFooterHeight + 'px';
                    scrollBar.scrollBottom();
                });
            }
        };
    }])
    .directive('rjPositionMiddle', ['$window', function($window){
        return{
            replace: false,
            link: function(scope, iElm, iAttrs, controller){
                var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
                if (height >= 0) {
                    iElm[0].style.top = (height / 2 + 44) + 'px';
                }else{
                    iElm[0].style.top = 44 + 'px';
                }
            }
        }
    }])
    .directive('repeatDone',function(){
    	return{
    		link:function(scope,element,attrs){
    			if(scope.$last){
    				scope.$eval(attrs.repeatDone);
    			}
    		}
    	}
    })
    .directive('infiniteScroll',['$rootScope','$window','$timeout',function($rootScope, $window, $timeout){
		return {
			link : function(scope, elem, attrs) {
				var handler,elementBottom, remaining, shouldScroll, windowBottom;
				$window = angular.element(window);
				elem.on('scroll', handler);
				function handler() {
					windowBottom = elem[0].offsetHeight	+ elem[0].scrollTop;
					elementBottom = elem[0].scrollHeight; 
					remaining = elementBottom - windowBottom;
					if (remaining <= 130) {
						elem.off('scroll', handler);
						$timeout(function() {
							windowBottom = elem[0].offsetHeight	+ elem[0].scrollTop;
							elementBottom = elem[0].scrollHeight;
							remaining = elementBottom- windowBottom;
							//console.log(remaining);
							if (remaining < 130) {
								scope.loadMore();
								elem.on('scroll', handler);
							} else {
								elem.on('scroll', handler);
							}
						}, 500);
					}
				};
			}
		};
    }])
    .directive('myScript', function(){
		return { 
			restrict: 'EA', 
			//terminal: true, 
			link: function(scope, element, attr){ 
				if (attr.ngSrc){ 
					var s = angular.element('<script>'); 
					s.attr('type','text/javascript');
					s.attr('src',attr.ngSrc);
					element.after(s);
				} 
			} 
		}; 
	})
	.directive('myId', function(){
		return { 
			restrict: 'A', 
			link: function(scope, element, attr){ 
				if (attr.myId){
					element.attr("id",scope[attr.myId]);
				} 
			} 
		}; 
	})
	.directive('actDetails',function(){
		return {
			restrict:'EA',
			templateUrl:'./mgm/template/activityDetails.$11692.html',
		}
	})
	.directive('newActDetails',function(){
		return {
			restrict:'EA',
			templateUrl:'./mgm2/template/activityDetails.$12503.html',
		}
	})
    .directive('header', function () {
        return {
            restrict: 'EA',
            templateUrl: './activityday/template/header.$12211.html',
        }
    });