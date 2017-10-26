var creatrootscrop = function (rootscope, PH, sessionStorage, start, cookies) {
    //2app 1微信
    // if (PH.getPara('inType') == 'PDXB') {
        rootscope.orderType = 'PDXB';
        rootscope.platform = 2;
        rootscope.indexUrl = 'data/indexUrl.json';
        rootscope.baseUrl = "";
    // main/hotfilms
        // rootscope.baseUrl = "https://spdbwx.idoupiao.com/superfilm/";
        rootscope.inType = 'PDXB';
    // }
    // else if (PH.getPara('inType') == 'PFWX') {
    //     rootscope.orderType = 'PFWX';
    //     rootscope.inType = 'PFWX';
    //     rootscope.platform = 1;
    //     rootscope.indexUrl = 'pufaweixinindex';
    //     rootscope.baseUrl = "https://spdbwx.idoupiao.com/superfilm/";
    // }
    // else if (PH.getPara('inType') == 'HSH') {
    //     rootscope.orderType = 'HSH';
    //     rootscope.inType = 'HSH';
    //     rootscope.platform = 2;
    //     rootscope.indexUrl = 'pufaappindex';
    //     rootscope.baseUrl = "https://spdbwx.idoupiao.com/superfilm/";
    // }
    // else {
    //     rootscope.orderType = 'PDXB';
    //     rootscope.platform = 2;
    //     rootscope.inType = 'JBZWX';
    //     rootscope.indexUrl = 'betaindex';
    //     rootscope.baseUrl = "https://sandbox.idoupiao.com/superfilm/";
    //     //rootscope.baseUrl = "http://192.168.6.174/superfilmWeb/";
    //
    // }
    rootscope.XSessionId = PH.getPara('XSessionId');
    rootscope.certNo = PH.getPara('certNo');
    rootscope.dialogIsHidden = true;
    rootscope.errorHidden = true;
    localStorage.JBZsession = PH.getPara('X-JBZ-Session');
    rootscope.staticUrl = '/';
    // rootscope.staticUrl = '/';
    //关闭错误提示
    rootscope.hideDialog = function () {
        rootscope.errorHidden = true;
    };
    //共用底
    rootscope.getFooter = function (index) {
        rootscope.pagetype = index;
        if (index == 1) {
            start.go('main');
        }
        else if (index == 2) {
            sessionStorage.filmtype = 1;
            start.go('films');
        }
        else if (index == 3) {
            start.go('cinema');
        }
        else if (index == 4) {
            start.go('mine');
        }
        else if (index == 5) {
            start.go('find');
        }
    };
    //返回
    rootscope.returnHistory = function (name, type, id) {//路由，模块，参数
        if (type == 1) {
            if (id) {
                var name = name ? name : 'main';
                start.go(name, {'id': id, 'type': type});
                return;
            }
            start.go('main');
            return;
        }
        else if (type == 2) {
            if (id) {
                var name = name ? name : 'films';
                start.go(name, {'id': id, 'type': type});
                return;
            }
            start.go('films');
            return;
        }
        else if (type == 3) {
            if (id) {
                var name = name ? name : 'find';
                start.go(name, {'id': id, 'type': type});
                return;
            }
            start.go('find');
            return;
        }
        else if (type == 4) {
            if (id) {
                var name = name ? name : 'cinema';
                start.go(name, {'id': id, 'type': type});
                return;
            }
            start.go('cinema');
            return;
        }
        else if (type == 5) {
            if (id) {
                var name = name ? name : 'mine';
                start.go(name, {'id': id, 'type': type});
                return;
            }
            start.go('mine');
            return;
        }

        else {
            if (id) {
                start.go(name, {'id': id, 'type': type});
                return
            }
            start.go(name);
        }
    };

    //充值兑换
    rootscope.rootPaycheck = function (type) {
        PH.api('account/xiaopucharge', {}, function (ret) {
            if (ret.data) {
                rootscope.dialogIsHidden = false;
                var urlCharge;
                if (rootscope.inType == 'JBZWX') {
                    urlCharge = 'https://jbz-dev.idoupiao.com/supercharge-h5/index.html';
                } else {
                    //urlCharge = 'http://charge.jinbaozheng.com/web/charge/main';
                    urlCharge = 'http://charge.jinbaozheng.com/h5';
                }
                window.location.href = urlCharge + '?openId=' + encodeURIComponent(ret.data.newOpenId)
                    + '&cardNo=' + encodeURIComponent(ret.data.newCardNo)
                    + '&inType=' + rootscope.inType + '&XSessionId=' + rootscope.XSessionId +
                    '&platform=' + rootscope.platform + '&fromtype=' + type + '&certNo=' + rootscope.certNo;

            }
        }, function (ret) {
        });
    };

    //返回当前选择的时间

    rootscope.currtime = function (date) {
        var date = date;
        var curDate = moment();
        var str1 = curDate.format('MM-DD');
        var str2 = curDate.add(1, 'd').format('MM-DD');
        var str3 = curDate.add(1, 'd').format('MM-DD');
        if (date == str1) {

        } else if (date == str2) {
            rootscope.naomi = "您选的是<span class='text-col-E5302F'>" +
                "<span class='pr-5'>明天</span>" + date + "</span>的场次，<br />请仔细核对哦";
            rootscope.errorHidden = false;
        } else if (date == str3) {
            rootscope.naomi = "您选的是<span class='text-col-E5302F'>" +
                "<span class='pr-5'>后天</span>" + date + "</span>的场次，<br />请仔细核对哦";
            rootscope.errorHidden = false;
        } else {
            rootscope.naomi = "您选的是<span class='text-col-E5302F'>" + date + "</span>的场次，<br />请仔细核对哦";
            rootscope.errorHidden = false;
        }
    };

    function isIos9later() {
        // 判断是否 iPhone 或者 iPod
        if (navigator.userAgent.match(/iPhone/i)) {
            // 判断系统版本号是否大于 9
            var isIosLater = '"' + navigator.userAgent.match(/OS [\d_\d]*/i) + '"';
            if (parseInt(isIosLater.replace(/[^0-9]/ig, "")) >1032) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    if (isIos9later()) {
        rootscope.scrollStyle1 = {
            'padding-bottom': '36px'
        };
        rootscope.scrollStyleCinema = {
            'padding-bottom': '60px'
        };
    } else {
        rootscope.scrollStyle1 = {
            'padding-bottom': '56px'
        };
        rootscope.scrollStyleCinema = {
            'padding-bottom': '80px'
        };
    }
};

