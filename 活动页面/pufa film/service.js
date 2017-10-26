var createService = function (app) {
    app.service('PH', Service);
};
var Service = function ($http, $rootScope, $cookieStore, $sessionStorage) {
    this.api = function (url, params, success, failed) {
        if (arguments.length == 2) {
            success = params;
            params = null;
        }
        $rootScope.dialogIsHidden = false;
        $http({
            method: 'POST',
            url: $rootScope.baseUrl + url,
            timeout: 30000,
            params: angular.extend({}, params, {
                'longitude': $sessionStorage.longitude,
                'latitude': $sessionStorage.latitude,
                'inType': $rootScope.inType,
                'XSessionId': $rootScope.XSessionId,
                'certNo': $rootScope.certNo
            })
        }).success(function (ret) {
            $rootScope.dialogIsHidden = true;
            if (ret.errorCode > 0) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = ret.message;
                if (failed) {
                    failed(ret);
                }
                return;
            }
            if (success) {
                success(ret);
                //$rootScope.naomi = ret.message;
            }

        }).error(function (data, status) {
            var ret = {
                errorCode: 1000,
                message: "系额统繁忙"
            };
            if (status == 404) {
                ret.errorCode = status;
                ret.message = "系统繁忙";
            } else if (status == 408) {
                ret.errorCode = status;
                ret.message = "系统繁忙";
            }
            if (failed) {
                $rootScope.errorHidden = false;
                $rootScope.naomi = ret.message;
                failed(ret);
            }

            $rootScope.dialogIsHidden = true;
        });
    };
    this.regetLocation = function (success, error) {
        $sessionStorage.longitude = '121.508824';
        $sessionStorage.latitude = '31.243637';
        // $rootScope.dialogIsHidden = false;
        // var geolocation = new BMap.Geolocation();
        // geolocation.getCurrentPosition(function (r) {
        //     $rootScope.dialogIsHidden = true;
        //     // if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        //     //     var latitude = r.point.lat;
        //     //     var longitude = r.point.lng;
        //     //     $sessionStorage.longitude = longitude;
        //     //     $sessionStorage.latitude = latitude;
        //     //     success();
        //     // }
        //     // else {
        //     //     $sessionStorage.longitude = '121.508824';
        //     //     $sessionStorage.latitude = '31.243637';
        //     //     $rootScope.formatAddress = '';
        //     //     $sessionStorage.cityName = '上海';
        //     //     $sessionStorage.cityId = 2;
        //     //     error();
        //     // }
        //     $sessionStorage.longitude = '121.508824';
        //     $sessionStorage.latitude = '31.243637';
        //     $rootScope.formatAddress = '';
        //     $sessionStorage.cityName = '上海';
        //     $sessionStorage.cityId = 2;
        //     success();
        //
        // }, {enableHighAccuracy: true});
        $rootScope.dialogIsHidden = true;
        $sessionStorage.longitude = '121.508824';
        $sessionStorage.latitude = '31.243637';
        $rootScope.formatAddress = '';
        $sessionStorage.cityName = '上海';
        $sessionStorage.cityId = 2;
        success();
    };
    this.getPara = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    };
};




