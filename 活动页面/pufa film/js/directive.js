var creatDirective = function (app) {
    app.directive('repeatFinish', function () {
        return {
            link: function (scope, element, attr) {
                if (scope.$last == true) {
                    scope.$eval(attr.repeatFinish);
                }
            }
        }
    });
    app.directive('loadingView', function () {
        var directive = {};
        directive.restrict = 'E';
        /* restrict this directive to elements */
        directive.templateUrl = "./view/widget/loading_view.html";
        return directive;
    });

    app.directive('errorView', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                customerInfo: '=info',
                close: '&onClose'
            },
            templateUrl: './view/widget/error_view.html'
        };
    });
    app.directive('footerView', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                activeNum: '=typenum',
                newPage: '&'
            },
            templateUrl: './view/widget/footer.html'
        };
    });
    app.directive('hotView', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                swiperImg: '=typenum',
                hotrec: '=hotStyle'
            },
            templateUrl: './view/widget/hot_view.html'
        };
    });

};



