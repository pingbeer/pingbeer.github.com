var require, define;
!function (e) {
    function r(e) {
        if (!(e in u)) {
            u[e] = !0;
            var n = document.createElement("script");
            return n.onerror = function () {
                if (f.traceBack) {
                    var n = e.replace(f.cdnDomain, f.mainDomain);
                    if (n == e)return;
                    r(n)
                }
            }, n.type = "text/javascript", n.src = e, t.appendChild(n), n
        }
    }

    function n(e, n, t) {
        var a = i[e] || (i[e] = []);
        a.push(n);
        var o, u = s[e] || {}, f = u.pkg;
        o = f ? c[f].url : u.url || e, r(o, t && function () {
                t(e)
            })
    }

    var t = document.getElementsByTagName("head")[0], i = {}, a = {}, o = {}, u = {}, s = {}, c = {}, f = {};
    window.loadingMap = i, define = function (e, r) {
        a[e] = r;
        var n = i[e];
        if (n) {
            for (var t = 0, o = n.length; o > t; t++)n[t]();
            delete i[e]
        }
    }, require = function (e) {
        if (e && e.splice)return require.async.apply(this, arguments);
        e = require.alias(e);
        var r = o[e];
        if (r)return r.exports;
        var n = a[e];
        if (!n)throw"[ModJS] Cannot find module `" + e + "`";
        r = o[e] = {exports: {}};
        var t = "function" == typeof n ? n.apply(r, [require, r.exports, r]) : n;
        return t && (r.exports = t), r.exports
    }, require.async = function (r, t, i) {
        function o(e) {
            for (var r = 0, t = e.length; t > r; r++) {
                var c = e[r];
                if (c in a) {
                    var f = s[c];
                    f && "deps" in f && o(f.deps)
                } else if (!(c in p)) {
                    p[c] = !0, l++, n(c, u, i);
                    var f = s[c];
                    f && "deps" in f && o(f.deps)
                }
            }
        }

        function u() {
            if (0 == l--) {
                for (var n = [], i = 0, a = r.length; a > i; i++)n[i] = require(r[i]);
                t && t.apply(e, n)
            }
        }

        "string" == typeof r && (r = [r]);
        for (var c = 0, f = r.length; f > c; c++)r[c] = require.alias(r[c]);
        var p = {}, l = 0;
        o(r), u()
    }, require.resourceMap = function (e) {
        var r, n;
        n = e.res;
        for (r in n)n.hasOwnProperty(r) && (s[r] = n[r]);
        n = e.pkg;
        for (r in n)n.hasOwnProperty(r) && (c[r] = n[r])
    }, require.config = function (e) {
        f = e || {}
    }, require.loadJs = function (e) {
        r(e)
    }, require.loadCss = function (e) {
        if (e.content) {
            var r = document.createElement("style");
            r.type = "text/css", r.styleSheet ? r.styleSheet.cssText = e.content : r.innerHTML = e.content, t.appendChild(r)
        } else if (e.url) {
            var n = document.createElement("link");
            n.href = e.url, n.rel = "stylesheet", n.type = "text/css", t.appendChild(n)
        }
    }, require.alias = function (e) {
        return e
    }, require.timeout = 5e3
}(this);
!function () {
    require.config({traceBack: !0, mainDomain: "/apps/", cdnDomain: "//oss3.rabbitpre.com/rp2/apps/"})
}();
require.resourceMap({
    "res": {
        "zepto": {"pkg": "p0"},
        "page/mobile": {
            "pkg": "p1",
            "deps": ["common", "loading", "pageManagement", "zepto/touch", "bounceFix", "slideProgress", "animation/animation.async.css"]
        },
        "common": {"pkg": "p1", "deps": ["async", "common/requestAnimationFrame"]},
        "loading": {"pkg": "p1", "deps": ["zepto", "zepto/fx", "zepto/fx.method", "animation"]},
        "pageManagement": {
            "pkg": "p1",
            "deps": ["zepto", "common", "point", "db", "common/cdnmap", "stat", "zepto/touch", "pageManagement/lastads", "pageManagement/loading.tpl", "pageManagement/formSubmitSuccess.tpl", "pageManagement/form.tpl", "pageManagement/video.tpl", "pageManagement/oneCall.tpl", "pageManagement/oneCallPic.tpl", "pageManagement/fingerprint.tpl", "pageManagement/fingerprintwhite.tpl", "pageManagement/blessing.tpl"]
        },
        "zepto/touch": {"pkg": "p1", "deps": ["zepto"]},
        "bounceFix": {"pkg": "p1"},
        "slideProgress": {"pkg": "p1", "deps": ["zepto"]},
        "animation/animation.async.css": {"pkg": "p1"},
        "async": {"pkg": "p1"},
        "common/requestAnimationFrame": {"pkg": "p1"},
        "zepto/fx": {"pkg": "p1"},
        "zepto/fx.method": {"pkg": "p1"},
        "animation": {"pkg": "p1"},
        "point": {"pkg": "p1"},
        "db": {"pkg": "p1", "deps": ["zepto"]},
        "common/cdnmap": {"pkg": "p1"},
        "stat": {"pkg": "p1", "deps": ["zepto"]},
        "pageManagement/lastads": {"pkg": "p1"},
        "pageManagement/loading.tpl": {"pkg": "p1"},
        "pageManagement/formSubmitSuccess.tpl": {"pkg": "p1"},
        "pageManagement/form.tpl": {"pkg": "p1"},
        "pageManagement/video.tpl": {"pkg": "p1"},
        "pageManagement/oneCall.tpl": {"pkg": "p1"},
        "pageManagement/oneCallPic.tpl": {"pkg": "p1"},
        "pageManagement/fingerprint.tpl": {"pkg": "p1"},
        "pageManagement/fingerprintwhite.tpl": {"pkg": "p1"},
        "pageManagement/blessing.tpl": {"pkg": "p1"},
        "pluginWechat": {"pkg": "p2"},
        "page/mobile/mobile2.async": {
            "pkg": "p3",
            "deps": ["animation/page-animation.async.css", "page/mobile/mobile2.async.less", "qrCode/zepto.qrCode", "zepto", "common"]
        },
        "animation/page-animation.async.css": {"pkg": "p3"},
        "page/mobile/mobile2.async.less": {"pkg": "p3"},
        "qrCode/zepto.qrCode": {"pkg": "p3", "deps": ["qrCode"]},
        "qrCode": {"pkg": "p3"},
        "effect/effect.async": {"pkg": "p4", "deps": ["effect/rainy", "effect/fireworks", "effect/erase"]},
        "effect/rainy": {"pkg": "p4", "deps": ["zepto", "effect/rainy/rainyDay"]},
        "effect/fireworks": {"pkg": "p4"},
        "effect/erase": {"pkg": "p4", "deps": ["effect/erase/stackblur", "zepto"]},
        "effect/rainy/rainyDay": {"pkg": "p4"},
        "effect/erase/stackblur": {"pkg": "p4"},
        "page/mobile/mobile.async": {
            "pkg": "p5",
            "deps": ["page/mobile/mobile.async.less", "effect", "common", "music", "share", "db", "fingerprintDialog", "shareMask", "blessingList", "reportAbuse", "stat"]
        },
        "page/mobile/mobile.async.less": {"pkg": "p5"},
        "effect": {"pkg": "p5", "deps": ["zepto"]},
        "music": {"pkg": "p5", "deps": ["common", "zepto"]},
        "share": {"pkg": "p5", "deps": ["zepto", "common", "async", "db", "stat"]},
        "fingerprintDialog": {"pkg": "p5", "deps": ["zepto", "dialog"]},
        "shareMask": {"pkg": "p5", "deps": ["zepto", "shareMask/shareMask.async.less"]},
        "blessingList": {
            "pkg": "p5",
            "deps": ["zepto", "common", "blessingList/blessingList.tpl", "blessingList/blessingItem.tpl", "db", "pageManagement/loading.tpl", "pageManagement/formSubmitSuccess.tpl"]
        },
        "reportAbuse": {
            "pkg": "p5",
            "deps": ["zepto", "dialog", "dialog/alert", "reportAbuse/postAd", "reportAbuse/reportAbuse.tpl", "reportAbuse/reportAbuse.async.less", "db"]
        },
        "dialog": {"pkg": "p5", "deps": ["zepto", "dialog/dialog.tpl", "dialog/dialog.async.less"]},
        "shareMask/shareMask.async.less": {"pkg": "p5"},
        "blessingList/blessingList.tpl": {"pkg": "p5"},
        "blessingList/blessingItem.tpl": {"pkg": "p5"},
        "dialog/alert": {"pkg": "p5", "deps": ["zepto", "dialog"]},
        "reportAbuse/postAd": {"pkg": "p5", "deps": ["zepto", "db", "dialog/alert"]},
        "reportAbuse/reportAbuse.tpl": {"pkg": "p5"},
        "reportAbuse/reportAbuse.async.less": {"pkg": "p5"},
        "dialog/dialog.tpl": {"pkg": "p5"},
        "dialog/dialog.async.less": {"pkg": "p5"},
        "comment": {
            "url": "/apps/widget/comment/comment_691b54c.js",
            "deps": ["zepto", "common", "db", "comment/commentitem.tpl"]
        },
        "comment/commentitem.tpl": {"url": "/apps/widget/comment/commentitem.tpl.js"}
    },
    "pkg": {
        "p0": {"url": "tu/zepto_min_757725c.js"},
        "p1": {"url": "tu/mobile_min_2fdeebc.js"},
        "p2": {"url": "/apps/static/pkg/pluginWechat_min_352b14d.js"},
        "p3": {"url": "/apps/static/pkg/page/mobile/mobile2.async_min_bc42023.js"},
        "p4": {"url": "/apps/static/pkg/effect/effect.async_min_656d208.js"},
        "p5": {"url": "/apps/static/pkg/page/mobile/mobile.async_min_46d882a.js"}
    }
});