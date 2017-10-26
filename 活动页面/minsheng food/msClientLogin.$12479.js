var Fw = {

    sendThirdLoginReq: function (cfg) {
        Fw.Client.sendThirdLoginReq(cfg);
    },
    sendNewThirdLoginReq: function (cfg) {
        Fw.Client.sendNewThirdLoginReq(cfg);
    },
    returnPage: function () {
        Fw.Client.returnPage();
    },
    goBack: function () {
        //if(window.history.length>1){
    		//window.history.go(-1);
    	//}else{
    		//Fw.Client.goBack();
    	//}
    	if(window.location.hash=="#/prodList"){
    		//document.location.href='https://m.creditcard.cmbc.com.cn/mbank/page/threePage/carService.html';
    		document.location.href='https://rs.creditcard.cmbc.com.cn/mbank/page/threePage/carService.html';
    	}else{
    		if(window.history.length>1){
				window.history.go(-1);
	    	}
    	}
    },
    JsonToStr: function (json) {
        return JSON.stringify(json);
    },
    initPageTitle: function () {
        Fw.Client.initPageTitle();
    },


};

;(function () {

    window.Device = (function () {
        var device = {};
        var ua = navigator.userAgent;

        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

        device.ios = device.android = device.iphone = device.ipad = false;

        device.os = 'web';
        // Android
        if (android) {
            device.os = 'android';
            device.osVersion = android[2];
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = 'iphone';
            device.ios = true;
        }
        // iOS
        if (iphone && !ipod) {
            device.osVersion = iphone[2].replace(/_/g, '.');
            device.iphone = true;
        }
        if (ipad) {
            device.osVersion = ipad[2].replace(/_/g, '.');
            device.ipad = true;
        }
        if (ipod) {
            device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
            device.iphone = true;
        }
        // iOS 8+ changed UA
        if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
            if (device.osVersion.split('.')[0] === '10') {
                device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
            }
        }
        // Webview
        //device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
        // Export object
        return device;
    })();

    console.info(window.Device.os);

    if (window.Device.os == 'iphone') {
        var x5 = {
            commandQueue: [],// 数组
            commandQueueFlushing: false,
            resources: {
                base: !0
            }
        };

        window.x5 = x5;

        x5.callbackId = 0;
        x5.callbacks = {};
        x5.callbackStatus = {
            NO_RESULT: 0,
            OK: 1,
            CLASS_NOT_FOUND_EXCEPTION: 2,
            ILLEGAL_ACCESS_EXCEPTION: 3,
            INSTANTIATION_EXCEPTION: 4,
            MALFORMED_URL_EXCEPTION: 5,
            IO_EXCEPTION: 6,
            INVALID_ACTION: 7,
            JSON_EXCEPTION: 8,
            ERROR: 9
        };

        x5.createBridge = function () {
            var bridge = document.createElement("iframe");
            bridge.setAttribute("style", "display:none;");
            bridge.setAttribute("height", "0px");
            bridge.setAttribute("width", "0px");
            bridge.setAttribute("frameborder", "0");
            document.documentElement.appendChild(bridge);
            return bridge;
        };

        x5.exec = function (service, action, options) {
            var command = {
                className: service,
                methodName: action,
                options: {},
            };

            for (var i = 0; i < options.length; ++i) {
                var arg = options[i];
                if (arg == undefined || arg == null) {
                    continue;
                } else if (typeof (arg) == 'object') {
                    command.options = arg;
                }
            }

            x5.commandQueue.push(JSON.stringify(command));

            if (x5.commandQueue.length == 1 && !x5.commandQueueFlushing) {
                if (!x5.bridge) {
                    x5.bridge = x5.createBridge();
                }
                x5.bridge.src = "mszx:" + service + ":" + action;
            }

        };

        // 浏览器调用接口
        x5.getAndClearQueuedCommands = function () {
            var json = JSON.stringify(x5.commandQueue);
            x5.commandQueue = [];
            return json;
        };

        var iphone = {

            _getPageTitle: function () {

                var cfg = {
                    title: "民生信用卡"
                };
                cfg.leftButton = {
                    exist: true,
                    name: "返回",
                    func: "Fw.goBack()"
                };
                cfg.rightButton = {
                    exist: false
                };
                console.log(cfg);
                return cfg;
            },
            /**
             * 初始化导航栏
             *
             */
            initPageTitle: function () {
                var titleJson = this._getPageTitle();
                console.log('----YT log initPageTitle----');
                console.log(titleJson);
                x5.exec("demoid", "executeJSCode_JSDict_", [{
                    "1": "setNavgationBar",
                    "2": titleJson
                }]);
            },


            sendThirdLoginReq: function (cfg) {
                try {
                    x5.exec("demoid", "executeJSCode_JSDict_", [{
                        "1": "sendThirdLoginReq",
                        "2": cfg
                    }]);
                } catch (e) {
                    alert('hideWaitPanel=' + e);
                }
            },

            sendNewThirdLoginReq: function (cfg) {
                try {
                    x5.exec("demoid", "executeJSCode_JSDict_", [{
                        "1": "sendNewThirdLoginReq",
                        "2": cfg
                    }]);
                } catch (e) {
                    alert('sendNewThirdLoginReq=' + e);
                }
            },
            returnPage: function (cfg) {
                try {
                    x5.exec("demoid", "executeJSCode_JSDict_", [{
                        "1": "returnPage",
                        "2": cfg
                    }]);
                } catch (e) {
                    alert('returnPage=' + e);
                }
            },
            goBack: function (cfg) {
                try {
                    x5.exec("demoid", "executeJSCode_JSDict_", [{
                        "1": "returnPage",
                        "2": cfg
                    }]);
                } catch (e) {
                    alert('returnPage=' + e);
                }
            }

        };

        Fw.Client = iphone;

    } else {
        var cmbc = {};
        window.cmbc = cmbc;

        var callClient = function (action, param, className) {
            var funcStr = "window." + className + "." + action + "('"
                + JSON.stringify(param) + "')";
            eval(funcStr);
        };

        cmbc.callClientForComm = function (action, param) {
            var className = "InteractJsForComm";
            callClient(action, param, className);
        };

        cmbc.callClientForUI = function (action, param) {
            var className = "InteractJsForUI";
            callClient(action, param, className);
        };

        var android = {

            _getPageTitle: function () {

                var cfg = {
                    title: "民生信用卡"
                };
                return cfg;
            },

            initPageTitle: function () {
                var json = this._getPageTitle();
                cmbc.callClientForUI("updateTitle", json);
            },

            sendThirdLoginReq: function (cfg) {
                window.cmbc.callClientForComm("sendThirdLoginReq", cfg);
            },

            sendNewThirdLoginReq: function (cfg) {
                window.cmbc.callClientForComm("sendNewThirdLoginReq", cfg);
            },
            goBack: function () {
                window.cmbc.callClientForComm("returnPage", {});
            },
            goPay: function (cfg) {
                window.cmbc.callClientForComm("goPay", cfg);
            }
        };

        Fw.Client = android;
    }

})();