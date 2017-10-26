var pieceactivity = angular.module('MypieceModule', []);
pieceactivity.controller('MypieceController', function ($scope, PH, $sessionStorage, $stateParams) {
    window.scrollTo(0, 0);//滚动到顶部
    $scope.hasFreePrize = $sessionStorage.hasFreePrize;
    $scope.Paramstype = $stateParams.type;
    var imgHeight = $(window).height()-22;
    var imgWidth = $(window).width();
    $scope.wkhistory = {
        'background': "url('./images/iphonebg.png') 0 center no-repeat",
        'background-size': '100% 100%',
        'height': (imgHeight-50) + 'px',
        'width': imgWidth + 'px',
        'position': 'fixed',
        'z-index': '-1',
        'top': '50px',
        'overflow': 'hide'
    };
    $scope.wkcount = {
        'height': (imgHeight-100) + 'px',
        'overflow-y': 'auto',
        'margin-top':'60px'
    };


    var lastkey = 0;
    $scope.load = function () {
        lastkey++;
        PH.api('activity/matterprize', {
            lastkey: lastkey
        }, function (ret) {
            console.log(ret.data.prizes);
            if (ret.data.length == 0 && lastkey == 1) {
                $scope.isHistory = false;
                $scope.weekCount = ret.data.prizes.length;
                $scope.errormessage = '暂无中奖记录';
                return;
            } else if (ret.data.length == 0 && lastkey > 1) {
                return;
            }
            if (lastkey > 1) {
                $scope.weeklist = $scope.weeklist.concat(ret.data.prizes);
            }
            else {
                $scope.weeklist = ret.data.prizes;
            }
            $scope.weekCount = ret.data.prizes.length;
            // $scope.isHistory = true;

        }, function (ret) {
            $scope.errormessage = '暂无中奖记录';
        });
    };
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
        if ($scope.weekCount ==10) {
            $scope.load();
        }
    };
    $scope.load();
});