var shoplist = angular.module("shopListModule", []);

//首页
shoplist.controller('shopListController', function ($scope, $rootScope, $state, $stateParams, $sessionStorage, PH) {
        window.scrollTo(0, 0);//滚动到顶部
        var subjectId = '';
        var categoryId = '';
        var sort = '';
        var page = '';
        var imgWidth = $(window).width();
        var height = imgWidth * 0.33 * 0.9;
        $scope.subjectsimg = "./images/shop/selectup.png";
        $scope.categoriesimg = "./images/shop/selectup.png";
        $scope.sortimg = "./images/shop/selectup.png";
        $scope.subShow = false;
        $scope.catShow = false;
        $scope.sorShow = false;
        $scope.subCheck = '主题';
        $scope.catCheck = '分类';
        $scope.sorCheck = '排序';
        $scope.imgHeight = {
            height: imgWidth * 0.33 * 0.8 + 'px',
            width: '80%'
        };
        $scope.lineHeight = {
            'line-height': height / 4.5 + 'px',
            'max-height': (height / 4.5) * 2 + 'px'
        };
        $scope.isShow = false;
        $scope.shopsearch = function () {
            PH.api('mall/search', {
                'title': $sessionStorage.title,
                'categoryId': '',
                'page': ''
            }, function (ret) {
                $sessionStorage.title = '';
                $scope.goodlist = ret.data.goods;
                if ($scope.goodlist.length == 0) {
                    $scope.isShow = true;
                    $scope.errormeg = '暂无内容';
                }
                $scope.subjects = ret.data.subjects;//主题
                $scope.categories = ret.data.categories;//分类
            }, function () {

            });
        };
        if ($stateParams.type == 'subject') {
            subjectId = $stateParams.id;
            categoryId = '';
        } else if ($stateParams.type == 'category') {
            subjectId = '';
            categoryId = $stateParams.id;
        }
        else if ($stateParams.type == 'search') {
            $scope.shopsearch();
        }
        $scope.selectClass = function (id, name, type) {
            $('.selectOpt ul').show();
            $('.selectOpt ul').show();
            if (type == 'subject' && id < 0 && !$scope.subShow) {
                $scope.categoriesimg = "./images/shop/selectup.png";
                $scope.sortimg = "./images/shop/selectup.png";
                $scope.catShow = false;
                $scope.sorShow = false;
                $scope.subShow = true;
                $scope.subjectsimg = "./images/shop/selectdown.png";
                return;
            }
            else if (type == 'category' && id < 0 && !$scope.catShow) {
                $scope.subjectsimg = "./images/shop/selectup.png";
                $scope.sortimg = "./images/shop/selectup.png";
                $scope.subShow = false;
                $scope.sorShow = false;
                $scope.catShow = true;
                $scope.categoriesimg = "./images/shop/selectdown.png";
                return;
            }
            else if (type == 'sort' && id < 0 && !$scope.sorShow) {
                $scope.subjectsimg = "./images/shop/selectup.png";
                $scope.categoriesimg = "./images/shop/selectup.png";
                $scope.subShow = false;
                $scope.catShow = false;
                $scope.sorShow = true;
                $scope.sortimg = "./images/shop/selectdown.png";
                return;
            }
            var newname = name;
            var newtype = type;
            $scope.shopLoad(newname, newtype);
        };
        window.onscroll = function () {
            //变量t就是滚动条滚动时，到顶部的距离
            var t = document.body.scrollTop;
            if (t > 2) {
                $('.selectOpt ul').hide();
                $('.selectOpt img').attr({'src': './images/shop/selectup.png'});
            }
        };
        $scope.shopLoad = function (name, type) {
            $scope.subjectsimg = "./images/shop/selectup.png";
            $scope.categoriesimg = "./images/shop/selectup.png";
            $scope.sortimg = "./images/shop/selectup.png";
            $scope.subShow = false;
            $scope.catShow = false;
            $scope.sorShow = false;
            if (type) {
                if (type == 'subject') {
                    $scope.subCheck = name;
                    for (var i = 0; i < $scope.subjects.length; i++) {
                        if ($scope.subjects[i].name == $scope.subCheck) {
                            subjectId = $scope.subjects[i].id;
                        } else if (!$scope.subCheck) {
                            subjectId = '';
                        }
                    }
                }
                else if (type == 'category' || type == "priority") {
                    $scope.catCheck = name;
                    for (var i = 0; i < $scope.categories.length; i++) {
                        if ($scope.categories[i].name == $scope.catCheck) {
                            categoryId = $scope.categories[i].id;
                        } else if (!$scope.catCheck) {
                            categoryId = '';
                        }
                    }
                }
                else if (type == 'sort') {
                    $scope.sorCheck = name;
                    for (var i = 0; i < $scope.sort.length; i++) {
                        if ($scope.sort[i].name == $scope.sorCheck) {
                            sort = $scope.sort[i].id;
                        } else if (!$scope.sorCheck) {
                            sort = '';
                        }
                    }
                }
            }
            else {
                if ($stateParams.type == 'subject') {
                    subjectId = $stateParams.id;
                }
                else if ($stateParams.type == 'category' || $stateParams.type == "priority") {
                    categoryId = $stateParams.id;
                }
                else if ($stateParams.type == 'sort') {
                    sort = $stateParams.id;
                }
            }
            PH.api('mall/goodlist', {
                'subjectId': subjectId,
                'categoryId': categoryId,
                'sort': sort,
                'page': page
            }, function (ret) {
                if (ret.data.goods.length == 0) {
                    $rootScope.errorHidden = true;
                    $scope.errormeg = '暂无内容';
                    $scope.isShow = true;
                    return;
                }
                $scope.isShow = false;
                $scope.goodlist = ret.data.goods;
                $scope.subjects = ret.data.subjects;//主题
                $scope.categories = ret.data.categories;//分类
                if (!type) {
                    if ($stateParams.type == 'subject') {
                        for (var i = 0; i < $scope.subjects.length; i++) {
                            if ($scope.subjects[i].id == $stateParams.id) {
                                $scope.subCheck = $scope.subjects[i].name;
                            }
                        }
                    }
                    else if ($stateParams.type == 'priority') {
                        for (var i = 0; i < $scope.categories.length; i++) {
                            if ($scope.categories[i].id == $stateParams.id) {
                                $scope.catCheck = $scope.categories[i].name;
                            }
                        }
                    }
                }
            }, function (ret) {
                $scope.errormeg = '暂无内容';
                $scope.isShow = true;
            })
        };
        $scope.sort = [
            {
                'name': '销量最多',
                'id': 1
            },
            {
                'name': '价格最高',
                'id': 2
            },
            {
                'name': '价格最低',
                'id': 3
            },
            {
                'name': '最新上架',
                'id': 4
            }
        ];
        if ($stateParams.type != 'search') {
            $scope.shopLoad('', '');
        }


    }
);