Captcha = function(I) {
	var R = "captcha.e-pointchina.com";
	var b = window.location.protocol + "//" + R + "/captcha";
	var G = b + "/cloudDataService.do";
	var i = "captcha.ws.service.CaptchaService";
	var k = 30000;
	var e = "网络错误，请重试";
	var x = "验证码验证成功";
	var S = "验证码已过期，请重试";
	var l = "验证码验证失败，请重试";
	var n = "操作被冻结，\n请稍后几秒重试";
	var f = k;
	if (I.wsTimeout) {
		f = I.wsTimeout
	}
	var c = I.app;
	var v = I.userId;
	var C = "0";
	if (I.captchaType) {
		C = I.captchaType
	}
	var y = I.appTimestamp;
	var h = I.appToken;
	var g = I.callback;
	var r = I.container;
	var u = I.funcShowMsg;
	var p = I.funcShowQuestion;
	var H = I.funcShowDisplayText;
	var Q = I.funcGetDisplayText;
	this.onRetry = function() {
		B()
	};
	this.onReset = function() {
		a()
	};
	this.onSubmit = function() {
		q()
	};
	this.onNumber0 = function() {
		N(0)
	};
	this.onNumber1 = function() {
		N(1)
	};
	this.onNumber2 = function() {
		N(2)
	};
	this.onNumber3 = function() {
		N(3)
	};
	this.onNumber4 = function() {
		N(4)
	};
	this.onNumber5 = function() {
		N(5)
	};
	this.onNumber6 = function() {
		N(6)
	};
	this.onNumber7 = function() {
		N(7)
	};
	this.onNumber8 = function() {
		N(8)
	};
	this.onNumber9 = function() {
		N(9)
	};
	var t = new m();
	_this = this;
	var F = new D();
	var d;
	var P;
	var s = setInterval(J, 1000);
	var z = -1;

	function M(U) {
		u(U)
	}
	function j() {
		return t.showLoading()
	}
	function A() {
		return t.hideLoading()
	}
	this.toggle = function() {
		if (o().css("display") == "none") {
			this.show()
		} else {
			this.hide()
		}
	};
	this.show = function() {
		O();
		o().show()
	};
	this.hide = function() {
		o().hide()
	};
	this.getVerifyResult = function() {
		var U = $(d).find("Answer").find("captchaId").text();
		var V = $(P).find("captchaPass").text();
		return {
			captchaId: U,
			captchaPass: V
		}
	};

	function B() {
		O()
	}
	function a() {
		H("")
	}
	// 点击弹出算法确定按钮的方法 test3
	function q() {
		var U = Number(Q());
		K(U)
	}
	function N(U) {
		var V = Q() + String(U);
		H(V)
	}
	function o() {
		return $('[id="' + r + '"]')
	}
	function K(W) {
		if (!d) {
			return
		}
		var V = $(d).find("Answer").find("captchaId").text();
		var U = $(d).find("Answer").find("answerIdList").find("String");
		if (U == undefined || U.length == 0) {
			return
		}
		var X = $(U[W]).text();
		if (X == undefined || X.length == 0) {
			return
		}
		E({
			url: G,
			params: {
				serviceType: i,
				serviceMethod: "verifyCaptcha",
				captchaId: V,
				app: c,
				userId: v,
				answerId: X,
				timestamp: (new Date()).getTime()
			},
			success: function(Z) {
				H("");
				var Y = w(Z);
				if (Y) {
					P = Z;
					var aa = $(P).find("captchaPass").text();
					
					// 返回方法 test6 callback
					
					g("success", {
						captchaId: V,
						captchaPass: aa
					})
				} else {
					P = null;
					O()
				}
			},
			error: function() {
				H("");
				//M(e);
				//O()
			}
		})
	}
	function O() {
		a();
		E({
			url: G,
			params: {
				serviceType: i,
				serviceMethod: "newCaptcha",
				app: c,
				userId: v,
				captchaType: C,
				appTimestamp: y,
				appToken: h,
				timestamp: (new Date()).getTime()
			},
			success: function(V) {
			
				var U = w(V);
				if (U) {
					d = V;
					
					var W = $(d).find("Answer").find("captchaId").text();
					var X = G + "?serviceType=" + i + "&serviceMethod=downloadCaptchaImage&captchaId=" + W + "&app=" + c + "&userId=" + v;
					//test 生成图片地址的断点
					p(X)
				} else {
					d = null
				}
			},
			error: function() {
				//M(e)
				alert("error test4");
			}
		})
	}
	function w(X) {
		if (X == undefined || X.length == 0) {
			M(e);
			return false
		}
		var V = $(X).find("result").text();
		if (V == "success") {
			return true
		} else {
			if (V == "frozen") {
				var W = $(X).find("frozenRemainTime").text();
				var U = Math.floor(W / 1000);
				L(U)
			} else {
				if (V == "invalid") {
					M(l)
				} else {
					M(S)
				}
			}
			return false
		}
	}
	function J() {
		if (z > 0) {
			z--;
			j();
			if (z > 0) {
				M(n + "(" + z + " 秒)")
			}
		} else {
			if (z == 0) {
				z--;
				A();
				O()
			}
		}
	}
	function L(U) {
		z = U
	}
	function E(U) {
		if (!j()) {
			return
		}
		F.jsonp({
			url: U.url,
			params: U.params,
			timeout: f == undefined ? k : f,
			success: function(V) {
				A();
				U.success(V)
			},
			error: function() {
				A();
				U.error(response)
			}
		})
	}
	function m() {
		var W = false;
		var aa, X;
		if (window.__MY_LOADING_IMG_URL) {
			aa = window.__MY_LOADING_IMG_URL
		} else {
			aa = Y(96)
		}
		if (window.__MY_EMPTY_IMG_URL) {
			X = window.__MY_EMPTY_IMG_URL
		} else {
			X = V(1, 1)
		}
		var U = "anim-loading-container_" + (new Date()).getTime();
		var Z = '<style>.icon-rotating {	background-position:0 100%;	-webkit-transform:rotate(0deg) translateZ(0);	-webkit-transition-duration:0ms;	-webkit-animation-name:rotating;	-webkit-animation-duration:0.8s;	-webkit-animation-iteration-count:infinite;	-webkit-animation-timing-function:linear;}@-webkit-keyframes rotating {	from { -webkit-transform:rotate(0deg) translateZ(0); }	to { -webkit-transform:rotate(360deg) translateZ(0); }}</style>	<div id="' + U + '" style="position:absolute; width: 100%; height: 100%;display:none;z-index:99999"> 		<div id="anim-loading" style="z-index: 50000;position:fixed; width: 48px; height: 48px; background: center; border-radius: 4px; filter:alpha(Opacity=229);-moz-opacity:0.9;opacity: 0.9;left:50%;top:50%;margin-top:-24px;margin-left:-24px;"> 			<img class="icon-rotating" style="background-image: url(); background-size:38px 38px; position:absolute; width: 48px; height:48px;background-repeat:no-repeat;background-position:center center" src="' + X + '" />   		</div> 	</div> ';
		this.setLoadingImg = function(ab) {
			aa = ab
		};
		this.enableShowLoading = true;
		this.showLoading = function() {
			if (!this.enableShowLoading) {
				return false
			}
			if (W) {
				return false
			} else {
				W = true;
				var ab = $("#" + U);
				if (ab.length == 0) {
					$(document.body).append(Z);
					ab = $("#" + U)
				}
				$(ab).show();
				var ae = $(ab).find("#anim-loading");
				var ad = (ab.clientWidth - ae.clientWidth) / 2;
				var ac = (ab.clientHeight - ae.clientHeight) / 2;
				$(ae).css("left", String(ad) + "px");
				$(ae).css("top", String(ac) + "px");
				$(ab).unbind("click").bind("click", function() {
					$(this).hide()
				});
				return true
			}
		};
		this.hideLoading = function() {
			var ab = $("#" + U);
			if (ab.length > 0) {
				$(ab).hide()
			}
			W = false
		};

		function V(af, ab) {
			var ad = document.createElement("canvas");
			ad.width = af;
			ad.height = ab;
			var ac = ad.getContext("2d");
			ac.clearRect(0, 0, af, ab);
			var ae = ad.toDataURL();
			delete ad;
			return ae
		}
		function Y(ac) {
			var al = ac;
			var ad = document.createElement("canvas");
			ad.width = ac;
			ad.height = al;
			var an = ad.getContext("2d");
			an.clearRect(0, 0, ac, al);
			var ak = 10;
			var ag = 5;
			var ab = {
				x: ac / 2,
				y: al / 2
			};
			var ah = ac / 2 - ag - ak;
			var ai = -Math.PI * (45 / 180);
			var ae = Math.PI * 2;
			var af = {
				x: ab.x + ah * Math.cos(ai),
				y: ab.y + ah * Math.sin(ai)
			};
			var aj = ag * 4;
			an.lineWidth = ag;
			an.strokeStyle = "rgba(206, 206, 206, 1)";
			an.beginPath();
			an.arc(ab.x, ab.y, ah, ai, ae, true);
			an.moveTo(af.x, af.y + ag * 0.36);
			an.lineTo(af.x, af.y - aj);
			an.moveTo(af.x + ag * 0.36, af.y);
			an.lineTo(af.x - aj, af.y);
			an.stroke();
			var am = ad.toDataURL();
			delete ad;
			return am
		}
	}
	function D() {
		var W = 0;
		var U = 0;
		var X = 0;
		var V = new T();
		this.jsonp = function(aa) {
			var ab = null;
			var Y = null;
			var Z = null;
			Z = "salama_ws_jsonp_val_" + String(++X);
			aa.params.jsonpReturn = Z;
			if (aa.params.responseType == undefined) {
				aa.params.responseType = "xml.jsonp"
			} else {
				aa.params.responseType += ".jsonp"
			}
			if ((aa.success != undefined) && (aa.success != null)) {
				ab = "salama_ws_jsonp_suc_" + String(++W);
				window[ab] = function(ac) {
					delete window[ab];
					delete window[Y];
					aa.success(decodeURIComponent(window[Z]));
					delete window[Z]
				}
			}
			if ((aa.error != undefined) && (aa.error != null)) {
				Y = "salama_ws_jsonp_err_" + String(++U);
				window[Y] = function(ac) {
					delete window[ab];
					delete window[Y];
					delete window[Z];
					aa.error(ac)
				}
			}
			V.jsonp({
				url: aa.url,
				params: aa.params,
				success: window[ab],
				error: window[Y],
				timeout: aa.timeout
			})
		}
	}
	function T() {
		var V = 1;
		var W = 30000;
		this.jsonp = function(Z) {
			var ab = Z.success;
			if (ab == undefined) {
				ab = Z.callbackWhenAjaxSuccess
			}
			var aa = Z.error;
			if (aa == undefined) {
				aa = Z.callbackWhenAjaxError
			}
			U(Z.url, Z.params, ab, aa, Z.timeout)
		};

		function U(Z, ad, ag, ab, ai) {
			var aa = Z;
			var ae = 0;
			for (var af in ad) {
				if (ae == 0) {
					aa += "?" + af + "=" + encodeURIComponent(ad[af])
				} else {
					aa += "&" + af + "=" + encodeURIComponent(ad[af])
				}
				ae++
			}
			if (ae == 0) {
				aa += "jsoncallback=?"
			} else {
				aa += "&jsoncallback=?"
			}
			var ac = W;
			if (ai > 0) {
				ac = ai
			}
			if (X()) {
				var ah = "jsonp_callback" + (++V);
				aa = aa.replace(/=\?/, "=" + ah);
				$.ajax({
					url: aa,
					dataType: "script",
					timeout: ac,
					success: function(aj) {
						if (ag != null && ag != undefined) {
							ag(aj)
						}
					},
					error: function(ak, aj) {
						if (ab != null && ab != undefined) {
							ab(aj)
						}
					}
				})
			} else {
				Y({
					url: aa,
					timeout: ac,
					success: function(aj) {
						if (ag != null && ag != undefined) {
							ag(aj)
						}
					},
					error: function(ak, aj) {
						if (ab != null && ab != undefined) {
							ab(aj)
						}
					}
				})
			}
		}
		function Y(aa) {
			var ad = "jsonp_callback" + (++V);
			var ac = "",
				ab;
			var Z = document.createElement("script");
			var ae = function() {
					$(Z).remove();
					if (window[ad]) {
						window[ad] = empty
					}
				};
			window[ad] = function(af) {
				clearTimeout(ac);
				$(Z).remove();
				delete window[ad];
				aa.success.call(ab, af)
			};
			Z.type = "text/javascript";
			Z.language = "jsonp";
			Z.src = aa.url.replace(/=\?/, "=" + ad);
			Z.onload = window[ad];
			if (aa.error) {
				Z.onerror = function() {
					clearTimeout(ac);
					aa.error.call(ab, "", "error")
				}
			}
			$("head").append(Z);
			if (aa.timeout > 0) {
				ac = setTimeout(function() {
					aa.error.call(ab, "", "timeout")
				}, aa.timeout)
			}
			return {}
		}
		function X() {
			return ($(document.body).after != undefined)
		}
	}
};