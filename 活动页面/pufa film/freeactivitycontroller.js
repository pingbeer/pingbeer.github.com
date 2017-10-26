var rreeactivityModules = angular.module("FreeActivityModule", []);
//免费领取观影券
rreeactivityModules.controller('FreeActivityController', function ($scope, $state, $rootScope, $cookieStore, PH) {
    window.scrollTo(0, 0);//滚动到顶部
    var imgWidth = $(window).width();
    var imgHeight = imgWidth * 260 / 750;
    $scope.getstyle = {
        'width': '80%'
    };
    $scope.heightForm = {
        width: '100%',
        height: imgHeight + 'px'
    };
    $scope.load = function () {
        PH.api('account/getAllUnclaimedPrize', {
            activationCode: $scope.noticenum
        }, function (ret) {
            $scope.freecode = ret.data;
        }, function (ret) {

        });
    };
    $scope.freeName = '';
    $scope.disabledTime = '';
    $scope.getFreeTicket = function (id, index) {
        PH.api('account/recievePrize', {
            prizeId: id
        }, function (ret) {
            console.log(ret);
            $('.freeTicketModel').show();
            $scope.freeName = $scope.freecode[index].name;
            $scope.disabledTime = $scope.freecode[index].disabledTime.split(' ')[0];
        }, function (ret) {

        });
    };
    $scope.freeHide = function () {
        $('.freeTicketModel').hide();
        $scope.load();
    };
    $scope.load();
});
