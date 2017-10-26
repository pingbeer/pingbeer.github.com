//我的红包
var mypacket = angular.module('MyPacketModule', []);
mypacket.controller('MyPacketController', function ($scope, $rootScope, $http, $cookieStore, $sessionStorage, PH) {

    window.scrollTo(0, 0);//滚动到顶部
    //获取卡号
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 200 / 750;
    $scope.ckedcode = true;
    $scope.activeimg = {
        'width': imgWidth + 'px',
        'height': imgHeight + 'px'
    };
    $scope.isHistory = false;
    $scope.ckedcode = true;
    var lasttype = 1;
    var lastkey = 0;
    $scope.cgcode = function (type) {
        if (type == lasttype) {
            return;
        }
        $scope.weeklist = '';
        lastkey = 0;
        lasttype = type;
        $scope.ckedcode = !$scope.ckedcode;
        $scope.load(type);
    };
    //判断是否定位
    $scope.curraddress = function () {
        // PH.regetLocation(function () {
        //     PH.api('main/refreshlocation', function (ret) {
        //         $sessionStorage.cityName = ret.data.name;
        //         $sessionStorage.cityId = ret.data.id;
        //         $scope.formatAddress = ret.data.formatAddress;
        //         $sessionStorage.formatAddress = $scope.formatAddress;
        //         $scope.pname = ret.data.name;
        //     });
        //     $sessionStorage.getDirection = 1;
        //     $rootScope.dialogIsHidden = false;
        //     $scope.load();
        // }, function (ret) {
        //     $sessionStorage.getDirection = 1;
        //     $rootScope.formatAddress = '';
        //     $sessionStorage.cityName = '上海';
        //     $sessionStorage.cityId = 2;
        //     $scope.pname = '上海';
        //     $scope.id = 2;
        //     $rootScope.dialogIsHidden = false;
        //     $scope.load();
        // });

    };
    if (!$sessionStorage.longitude) {
        $scope.curraddress();
    }

    $scope.load = function (type) {
        lastkey++;
        PH.api('data/rechargePrize.json', {
            inType: $rootScope.inType,
            status: type,
            lastkey: lastkey
        }, function (ret) {
            if (ret.data.length == 0 && lastkey == 1) {
                $scope.isHistory = false;
                $scope.weekCount = ret.data.length;
                $scope.errormsg = '暂无记录';
                return;
            }else if (ret.data.length == 0 && lastkey > 1) {
                return;
            }
            if (lastkey > 1) {
                $scope.weeklist = $scope.weeklist.concat(ret.data);
            }
            else {
                $scope.weeklist = ret.data;
            }
            $scope.weekCount = ret.data.length;
            $scope.isHistory = true;
        }, function (ret) {
            $scope.errormsg = '暂无记录';
        });
    };
    $scope.load(1);
    var time1 = '';
    $scope.myPagingFunction = function () {
        if (time1) {
            var time2 = new Date().getTime();
            if (time2 - time1 < 300) {
                time1 = time2;
                return;
            } else {
                time1 = time2;
            }
        } else {
            time1 = new Date().getTime();
        }
        if ($scope.weekCount == 10) {
            $scope.load(lasttype);
        }
    };
});
//红包使用说明
var packetrule = angular.module('PacketRuleModule', []);
packetrule.controller('PacketRuleController', function ($scope) {

});
