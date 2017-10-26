//地图
var mapModule = angular.module('MapModule', []);
mapModule.controller('MapController', function ($scope, $cookieStore, $state, $sessionStorage, $stateParams) {

    window.scrollTo(0, 0);//滚动到顶部

    $scope.load = function () {
        var width = screen.width;
        var height = screen.height;
        $('#allmap').width(width);
        $('#allmap').height(height - 30);
        var longitude = '';
        var latitude = '';
        var title = '';
        var addr = '';
        var len = $stateParams.type.split('-').length - 1;
        if ($stateParams.type.split('-')[len] == 1) {
            longitude = $sessionStorage.longitude;
            latitude = $sessionStorage.latitude;
            title = '您当前位置';
            addr = $sessionStorage.formatAddress;
            $scope.Paramstype = 4;
            $scope.Paramsid = '';
            $scope.ParamsName = 'cinema';
        } else {
            longitude = $sessionStorage.currlongitude;
            latitude = $sessionStorage.currlatitude;
            title = $sessionStorage.currtitle;
            addr = $sessionStorage.curraddress;
            $scope.Paramstype = $stateParams.type.substr(0, $stateParams.type.length - 2);
            $scope.Paramsid = $stateParams.id;
            $scope.ParamsName = 'cinemadetail';
        }
        // 百度地图API功能
        // var map = new BMap.Map("allmap");
        // var point = new BMap.Point(longitude, latitude);
        // map.centerAndZoom(point, 15);
        //
        // var marker = new BMap.Marker(point);  // 创建标注
        // map.addOverlay(marker);               // 将标注添加到地图中
        // map.panTo(point);
        //
        // var opts = {
        //
        //     width: 200,     // 信息窗口宽度
        //     title: title, // 信息窗口标题
        //     enableMessage: false,//设置允许信息窗发送短息
        // }
        // var infoWindow = new BMap.InfoWindow("地址：" + addr, opts);  // 创建信息窗口对象
        // map.openInfoWindow(infoWindow, point); //开启信息窗口
        // marker.addEventListener("click", function () {
        //     map.openInfoWindow(infoWindow, point); //开启信息窗口
        // });
        //
        // // 添加定位控件
        // var geolocationControl = new BMap.GeolocationControl();
        // map.addControl(geolocationControl);
    };
    $scope.load();
});
