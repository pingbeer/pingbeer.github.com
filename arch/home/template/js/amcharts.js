var inheriting = {},
	AmCharts = {
		Class: function(a) {
			var b = function() {
					arguments[0] !== inheriting && (this.events = {}, this.construct.apply(this, arguments))
				};
			a.inherits ? (b.prototype = new a.inherits(inheriting), b.base = a.inherits.prototype, delete a.inherits) : (b.prototype.createEvents = function() {
				for (var a = 0, b = arguments.length; a < b; a++) this.events[arguments[a]] = []
			}, b.prototype.listenTo = function(a, b, d) {
				a.events[b].push({
					handler: d,
					scope: this
				})
			}, b.prototype.addListener = function(a, b, d) {
				this.events[a].push({
					handler: b,
					scope: d
				})
			}, b.prototype.removeListener = function(a, b, d) {
				a = a.events[b];
				for (b = a.length - 1; 0 <= b; b--) a[b].handler === d && a.splice(b, 1)
			}, b.prototype.fire = function(a, b) {
				for (var d = this.events[a], h = 0, i = d.length; h < i; h++) {
					var j = d[h];
					j.handler.call(j.scope, b)
				}
			});
			for (var d in a) b.prototype[d] = a[d];
			return b
		},
		charts: [],
		addChart: function(a) {
			AmCharts.charts.push(a)
		},
		removeChart: function(a) {
			for (var b = AmCharts.charts, d = b.length - 1; 0 <= d; d--) b[d] == a && b.splice(d, 1)
		}
	};
document.attachEvent && (AmCharts.isNN = !1, AmCharts.isIE = !0, AmCharts.dx = 0, AmCharts.dy = 0);
if (document.addEventListener || window.opera) AmCharts.isNN = !0, AmCharts.isIE = !1, AmCharts.dx = 0.5, AmCharts.dy = 0.5;
window.chrome && (AmCharts.chrome = !0);
AmCharts.IEversion = 0; - 1 != navigator.appVersion.indexOf("MSIE") && document.documentMode && (AmCharts.IEversion = document.documentMode);
9 <= AmCharts.IEversion && (AmCharts.ddd = 0.5);
AmCharts.handleResize = function() {
	for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
		var d = a[b];
		d && d.div && d.handleResize()
	}
};
AmCharts.handleMouseUp = function(a) {
	for (var b = AmCharts.charts, d = 0; d < b.length; d++) {
		var e = b[d];
		e && e.handleReleaseOutside(a)
	}
};
AmCharts.handleMouseMove = function(a) {
	for (var b = AmCharts.charts, d = 0; d < b.length; d++) {
		var e = b[d];
		e && e.handleMouseMove(a)
	}
};
AmCharts.resetMouseOver = function() {
	for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
		var d = a[b];
		if (d) d.mouseIsOver = false
	}
};
AmCharts.onReadyArray = [];
AmCharts.ready = function(a) {
	AmCharts.onReadyArray.push(a)
};
AmCharts.handleLoad = function() {
	for (var a = AmCharts.onReadyArray, b = 0; b < a.length; b++)(0, a[b])()
};
AmCharts.useUTC = !1;
AmCharts.updateRate = 40;
AmCharts.uid = 0;
AmCharts.getUniqueId = function() {
	AmCharts.uid++;
	return "AmChartsEl-" + AmCharts.uid
};
AmCharts.isNN && (document.addEventListener("mousemove", AmCharts.handleMouseMove, !0), window.addEventListener("resize", AmCharts.handleResize, !0), document.addEventListener("mouseup", AmCharts.handleMouseUp, !0), window.addEventListener("load", AmCharts.handleLoad, !0));
AmCharts.isIE && (document.attachEvent("onmousemove", AmCharts.handleMouseMove), window.attachEvent("onresize", AmCharts.handleResize), document.attachEvent("onmouseup", AmCharts.handleMouseUp), window.attachEvent("onload", AmCharts.handleLoad));
AmCharts.AmChart = AmCharts.Class({
	construct: function() {
		this.version = "2.6.13";
		AmCharts.addChart(this);
		this.createEvents("dataUpdated");
		this.height = this.width = "100%";
		this.dataChanged = !0;
		this.chartCreated = !1;
		this.previousWidth = this.previousHeight = 0;
		this.backgroundColor = "#FFFFFF";
		this.borderAlpha = this.backgroundAlpha = 0;
		this.color = this.borderColor = "#000000";
		this.fontFamily = "Verdana";
		this.fontSize = 11;
		this.numberFormatter = {
			precision: -1,
			decimalSeparator: ".",
			thousandsSeparator: ","
		};
		this.percentFormatter = {
			precision: 2,
			decimalSeparator: ".",
			thousandsSeparator: ","
		};
		this.labels = [];
		this.allLabels = [];
		this.titles = [];
		this.autoMarginOffset = 0;
		var a = document.createElement("div"),
			b = a.style;
		b.overflow = "hidden";
		b.position = "relative";
		b.textAlign = "left";
		this.chartDiv = a;
		a = document.createElement("div");
		b = a.style;
		b.overflow = "hidden";
		b.position = "relative";
		this.legendDiv = a;
		this.balloon = new AmCharts.AmBalloon;
		this.balloon.chart = this;
		this.titleHeight = 0;
		this.prefixesOfBigNumbers = [{
			number: 1E3,
			prefix: "k"
		}, {
			number: 1E6,
			prefix: "M"
		}, {
			number: 1E9,
			prefix: "G"
		}, {
			number: 1E12,
			prefix: "T"
		}, {
			number: 1E15,
			prefix: "P"
		}, {
			number: 1E18,
			prefix: "E"
		}, {
			number: 1.0E21,
			prefix: "Z"
		}, {
			number: 1.0E24,
			prefix: "Y"
		}];
		this.prefixesOfSmallNumbers = [{
			number: 1.0E-24,
			prefix: "y"
		}, {
			number: 1.0E-21,
			prefix: "z"
		}, {
			number: 1.0E-18,
			prefix: "a"
		}, {
			number: 1.0E-15,
			prefix: "f"
		}, {
			number: 1.0E-12,
			prefix: "p"
		}, {
			number: 1.0E-9,
			prefix: "n"
		}, {
			number: 1.0E-6,
			prefix: "��"
		}, {
			number: 0.001,
			prefix: "m"
		}];
		this.panEventsEnabled = !1
	},
	drawChart: function() {
		var a = this.container,
			b = this.realWidth,
			d = this.realHeight,
			e = this.set,
			f = AmCharts.polygon(a, [0, b - 1, b - 1, 0], [0, 0, d - 1, d - 1], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
		this.background = f;
		e.push(f);
		if (f = this.backgroundImage) this.path && (f = this.path + f), this.bgImg = a = a.image(f, 0, 0, b, d), e.push(a);
		this.redrawLabels();
		this.drawTitles()
	},
	drawTitles: function() {
		var a = this.titles;
		if (AmCharts.ifArray(a)) for (var b = 20, d = 0; d < a.length; d++) {
			var e = a[d],
				f = e.color;
			void 0 == f && (f = this.color);
			var g = e.size;
			isNaN(e.alpha);
			var h = this.marginLeft,
				f = AmCharts.text(this.container, e.text, f, this.fontFamily, g);
			f.translate(h + (this.divRealWidth - this.marginRight - h) / 2, b);
			h = !0;
			void 0 != e.bold && (h = e.bold);
			h && f.attr({
				"font-weight": "bold"
			});
			b += g + 6;
			this.freeLabelsSet.push(f)
		}
	},
	write: function(a) {
		var b = this.balloon;
		b && !b.chart && (b.chart = this);
		this.listenersAdded || (this.addListeners(), this.listenersAdded = !0);
		this.div = a = "object" != typeof a ? document.getElementById(a) : a;
		a.style.overflow = "hidden";
		var b = this.chartDiv,
			d = this.legendDiv,
			e = this.legend,
			f = d.style,
			g = b.style;
		this.measure();
		if (e) switch (e.position) {
		case "bottom":
			a.appendChild(b);
			a.appendChild(d);
			break;
		case "top":
			a.appendChild(d);
			a.appendChild(b);
			break;
		case "absolute":
			var h = document.createElement("div");
			h.style.position = "relative";
			a.appendChild(h);
			f.position = "absolute";
			g.position = "absolute";
			void 0 != e.left && (f.left = e.left);
			void 0 != e.right && (f.right = e.right);
			void 0 != e.top && (f.top = e.top);
			void 0 != e.bottom && (f.bottom = e.bottom);
			h.appendChild(b);
			h.appendChild(d);
			break;
		case "right":
			f.position = "relative";
			g.position = "absolute";
			a.appendChild(b);
			a.appendChild(d);
			break;
		case "left":
			f.position = "relative", g.position = "absolute", a.appendChild(b), a.appendChild(d)
		} else a.appendChild(b);
		this.initChart()
	},
	createLabelsSet: function() {
		AmCharts.remove(this.labelsSet);
		this.labelsSet = this.container.set();
		this.freeLabelsSet.push(this.labelsSet)
	},
	initChart: function() {
		this.divIsFixed = AmCharts.findIfFixed(this.chartDiv);
		this.previousHeight = this.realHeight;
		this.previousWidth = this.realWidth;
		this.destroy();
		var a = 0;
		if (document.attachEvent && !window.opera) {
			var a = 1,
				b = this.legend;
			if (b && (b = b.position, "right" == b || "left" == b)) a = 2
		}
		AmCharts.isNN && AmCharts.findIfAuto(this.chartDiv) && (a = 3);
		this.mouseMode = a;
		a = this.container = new AmCharts.AmDraw(this.chartDiv, this.realWidth, this.realHeight);
		this.set = a.set();
		this.gridSet = a.set();
		this.columnSet = a.set();
		this.graphsSet = a.set();
		this.trendLinesSet = a.set();
		this.axesLabelsSet = a.set();
		this.axesSet = a.set();
		this.cursorSet = a.set();
		this.scrollbarsSet = a.set();
		this.bulletSet = a.set();
		this.freeLabelsSet = a.set();
		this.balloonsSet = a.set();
		this.zoomButtonSet = a.set();
		this.linkSet = a.set();
		this.drb();
		this.renderFix()
	},
	measure: function() {
		var a = this.div,
			b = this.chartDiv,
			d = a.offsetWidth,
			e = a.offsetHeight,
			f = this.container;
		a.clientHeight && (d = a.clientWidth, e = a.clientHeight);
		var a = AmCharts.toCoordinate(this.width, d),
			g = AmCharts.toCoordinate(this.height, e);
		if (a != this.previousWidth || g != this.previousHeight) b.style.width = a + "px", b.style.height = g + "px", f && f.setSize(a, g), this.balloon.setBounds(2, 2, a - 2, g);
		this.realWidth = a;
		this.realHeight = g;
		this.divRealWidth = d;
		this.divRealHeight = e
	},
	destroy: function() {
		this.chartDiv.innerHTML = "";
		this.clearTimeOuts()
	},
	clearTimeOuts: function() {
		var a = this.timeOuts;
		if (a) for (var b = 0; b < a.length; b++) clearTimeout(a[b]);
		this.timeOuts = []
	},
	clear: function() {
		AmCharts.callMethod("clear", [this.chartScrollbar, this.scrollbarV, this.scrollbarH, this.chartCursor]);
		this.chartCursor = this.scrollbarH = this.scrollbarV = this.chartScrollbar = null;
		this.clearTimeOuts();
		this.container && this.container.remove();
		AmCharts.removeChart(this)
	},
	setMouseCursor: function(a) {
		"auto" == a && AmCharts.isNN && (a = "default");
		this.chartDiv.style.cursor = a;
		this.legendDiv.style.cursor = a
	},
	redrawLabels: function() {
		this.labels = [];
		var a = this.allLabels;
		this.createLabelsSet();
		for (var b = 0; b < a.length; b++) this.drawLabel(a[b])
	},
	drawLabel: function(a) {
		if (this.container) {
			var b = a.y,
				d = a.text,
				e = a.align,
				f = a.size,
				g = a.color,
				h = a.rotation,
				i = a.alpha,
				j = a.bold,
				k = AmCharts.toCoordinate(a.x, this.realWidth),
				b = AmCharts.toCoordinate(b, this.realHeight);
			k || (k = 0);
			b || (b = 0);
			void 0 == g && (g = this.color);
			isNaN(f) && (f = this.fontSize);
			e || (e = "start");
			"left" == e && (e = "start");
			"right" == e && (e = "end");
			"center" == e && (e = "middle", h ? b = this.realHeight - b + b / 2 : k = this.realWidth / 2 - k);
			void 0 == i && (i = 1);
			void 0 == h && (h = 0);
			b += f / 2;
			a = AmCharts.text(this.container, d, g, this.fontFamily, f, e, j, i);
			a.translate(k, b);
			0 != h && a.rotate(h);
			this.labelsSet.push(a);
			this.labels.push(a)
		}
	},
	addLabel: function(a, b, d, e, f, g, h, i, j) {
		a = {
			x: a,
			y: b,
			text: d,
			align: e,
			size: f,
			color: g,
			alpha: i,
			rotation: h,
			bold: j
		};
		this.container && this.drawLabel(a);
		this.allLabels.push(a)
	},
	clearLabels: function() {
		for (var a = this.labels, b = a.length - 1; 0 <= b; b--) a[b].remove();
		this.labels = [];
		this.allLabels = []
	},
	updateHeight: function() {
		var a = this.divRealHeight,
			b = this.legend;
		if (b) {
			var d = this.legendDiv.offsetHeight,
				b = b.position;
			if ("top" == b || "bottom" == b) a -= d, 0 > a && (a = 0), this.chartDiv.style.height = a + "px"
		}
		return a
	},
	updateWidth: function() {
		var a = this.divRealWidth,
			b = this.divRealHeight,
			d = this.legend;
		if (d) {
			var e = this.legendDiv,
				f = e.offsetWidth,
				g = e.offsetHeight,
				e = e.style,
				h = this.chartDiv.style,
				d = d.position;
			if ("right" == d || "left" == d) a -= f, 0 > a && (a = 0), h.width = a + "px", "left" == d ? h.left = AmCharts.findPosX(this.div) + f + "px" : e.left = a + "px", e.top = (b - g) / 2 + "px"
		}
		return a
	},
	getTitleHeight: function() {
		var a = 0,
			b = this.titles;
		if (0 < b.length) for (var a = 15, d = 0; d < b.length; d++) a += b[d].size + 6;
		return a
	},
	addTitle: function(a, b, d, e, f) {
		isNaN(b) && (b = this.fontSize + 2);
		a = {
			text: a,
			size: b,
			color: d,
			alpha: e,
			bold: f
		};
		this.titles.push(a);
		return a
	},
	addListeners: function() {
		var a = this,
			b = a.chartDiv;
		AmCharts.isNN && (a.panEventsEnabled && "ontouchstart" in document.documentElement && (b.addEventListener("touchstart", function(b) {
			a.handleTouchMove.call(a, b)
		}, !0), b.addEventListener("touchmove", function(b) {
			a.handleTouchMove.call(a, b)
		}, !0), b.addEventListener("touchstart", function(b) {
			a.handleTouchStart.call(a, b)
		}), b.addEventListener("touchend", function(b) {
			a.handleTouchEnd.call(a, b)
		})), b.addEventListener("mousedown", function(b) {
			a.handleMouseDown.call(a, b)
		}, !0), b.addEventListener("mouseover", function(b) {
			a.handleMouseOver.call(a, b)
		}, !0), b.addEventListener("mouseout", function(b) {
			a.handleMouseOut.call(a, b)
		}, !0));
		AmCharts.isIE && (b.attachEvent("onmousedown", function(b) {
			a.handleMouseDown.call(a, b)
		}), b.attachEvent("onmouseover", function(b) {
			a.handleMouseOver.call(a, b)
		}), b.attachEvent("onmouseout", function(b) {
			a.handleMouseOut.call(a, b)
		}))
	},
	dispDUpd: function() {
		this.dispatchDataUpdated && (this.dispatchDataUpdated = !1, this.fire("dataUpdated", {
			type: "dataUpdated",
			chart: this
		}))
	},
	drb: function() {
		var a = "moc.strahcma".split("").reverse().join(""),
			b = window.location.hostname.split(".");
		if (2 <= b.length) var d = b[b.length - 2] + "." + b[b.length - 1];
		AmCharts.remove(this.bbset);
		if (d == a) {
			a += "/?utm_source=swf&utm_medium=demo&utm_campaign=jsDemo";
			b = AmCharts.rect(this.container, 145, 20, "#FFFFFF", 1);
			d = AmCharts.text(this.container, "moc.strahcma yb trahc".split("").reverse().join(""), "#000000", "Verdana", 11, "start");
			d.translate(5, 8);
			this.bbset = b = this.container.set([b, d]);
			this.linkSet.push(b);
			b.click(function() {
				window.location.href = "http://" + a
			});
			for (d = 0; d < b.length; d++) b[d].attr({
				cursor: "pointer"
			})
		}
	},
	invalidateSize: function() {
		var a = this;
		a.measure();
		var b = a.legend;
		if ((a.realWidth != a.previousWidth || a.realHeight != a.previousHeight) && a.chartCreated) {
			if (b) {
				clearTimeout(a.legendInitTO);
				var d = setTimeout(function() {
					b.invalidateSize()
				}, 100);
				a.timeOuts.push(d);
				a.legendInitTO = d
			}
			clearTimeout(a.initTO);
			d = setTimeout(function() {
				a.initChart()
			}, 100);
			a.timeOuts.push(d);
			a.initTO = d
		}
		a.renderFix();
		b && b.renderFix()
	},
	validateData: function(a) {
		this.chartCreated && (this.dataChanged = !0, this.initChart(a))
	},
	validateNow: function() {
		this.initChart()
	},
	showItem: function(a) {
		a.hidden = !1;
		this.initChart()
	},
	hideItem: function(a) {
		a.hidden = !0;
		this.initChart()
	},
	hideBalloon: function() {
		var a = this;
		a.hoverInt = setTimeout(function() {
			a.hideBalloonReal.call(a)
		}, 80)
	},
	hideBalloonReal: function() {
		var a = this.balloon;
		a && a.hide()
	},
	showBalloon: function(a, b, d, e, f) {
		var g = this;
		clearTimeout(g.balloonTO);
		g.balloonTO = setTimeout(function() {
			g.showBalloonReal.call(g, a, b, d, e, f)
		}, 1)
	},
	showBalloonReal: function(a, b, d, e, f) {
		this.handleMouseMove();
		var g = this.balloon;
		g.enabled && (g.followCursor(!1), g.changeColor(b), d || g.setPosition(e, f), g.followCursor(d), a && g.showBalloon(a))
	},
	handleTouchMove: function(a) {
		this.hideBalloon();
		var b = this.chartDiv;
		a.touches && (a = a.touches.item(0), this.mouseX = a.pageX - AmCharts.findPosX(b), this.mouseY = a.pageY - AmCharts.findPosY(b))
	},
	handleMouseOver: function() {
		AmCharts.resetMouseOver();
		this.mouseIsOver = !0
	},
	handleMouseOut: function() {
		AmCharts.resetMouseOver();
		this.mouseIsOver = !1
	},
	handleMouseMove: function(a) {
		if (this.mouseIsOver) {
			var b = this.chartDiv;
			a || (a = window.event);
			var d, e;
			if (a) {
				switch (this.mouseMode) {
				case 3:
					d = a.pageX - AmCharts.findPosX(b) + AmCharts.findScrollLeft(b, 0);
					e = a.pageY - AmCharts.findPosY(b) + AmCharts.findScrollTop(b, 0);
					break;
				case 2:
					d = a.x - AmCharts.findPosX(b);
					e = a.y - AmCharts.findPosY(b);
					break;
				case 1:
					d = a.x;
					e = a.y;
					break;
				case 0:
					this.divIsFixed ? (d = a.clientX - AmCharts.findPosX(b), e = a.clientY - AmCharts.findPosY(b)) : (d = a.pageX - AmCharts.findPosX(b), e = a.pageY - AmCharts.findPosY(b))
				}
				this.mouseX = d;
				this.mouseY = e
			}
		}
	},
	handleTouchStart: function(a) {
		this.handleMouseDown(a)
	},
	handleTouchEnd: function(a) {
		AmCharts.resetMouseOver();
		this.handleReleaseOutside(a)
	},
	handleReleaseOutside: function() {},
	handleMouseDown: function(a) {
		AmCharts.resetMouseOver();
		this.mouseIsOver = !0;
		a && a.preventDefault && a.preventDefault()
	},
	addLegend: function(a) {
		this.legend = a;
		a.chart = this;
		a.div = this.legendDiv;
		var b = this.handleLegendEvent;
		this.listenTo(a, "showItem", b);
		this.listenTo(a, "hideItem", b);
		this.listenTo(a, "clickMarker", b);
		this.listenTo(a, "rollOverItem", b);
		this.listenTo(a, "rollOutItem", b);
		this.listenTo(a, "rollOverMarker", b);
		this.listenTo(a, "rollOutMarker", b);
		this.listenTo(a, "clickLabel", b)
	},
	removeLegend: function() {
		this.legend = void 0
	},
	handleResize: function() {
		(AmCharts.isPercents(this.width) || AmCharts.isPercents(this.height)) && this.invalidateSize();
		this.renderFix()
	},
	renderFix: function() {
		if (!AmCharts.VML) {
			var a = this.container;
			a && a.renderFix()
		}
	},
	getSVG: function() {
		if (AmCharts.hasSVG) return this.container
	}
});
AmCharts.Slice = AmCharts.Class({
	construct: function() {}
});
AmCharts.SerialDataItem = AmCharts.Class({
	construct: function() {}
});
AmCharts.GraphDataItem = AmCharts.Class({
	construct: function() {}
});
AmCharts.Guide = AmCharts.Class({
	construct: function() {}
});
AmCharts.toBoolean = function(a, b) {
	if (void 0 == a) return b;
	switch (("" + a).toLowerCase()) {
	case "true":
	case "yes":
	case "1":
		return !0;
	case "false":
	case "no":
	case "0":
	case null:
		return !1;
	default:
		return Boolean(a)
	}
};
AmCharts.removeFromArray = function(a, b) {
	for (var d = a.length - 1; 0 <= d; d--) a[d] == b && a.splice(d, 1)
};
AmCharts.getURL = function(a, b) {
	if (a) if ("_self" == b || !b) window.location.href = a;
	else {
		var d = document.getElementsByName(b)[0];
		d ? d.src = a : window.open(a)
	}
};
AmCharts.formatMilliseconds = function(a, b) {
	if (-1 != a.indexOf("fff")) {
		var d = b.getMilliseconds(),
			e = "" + d;
		10 > d && (e = "00" + d);
		10 <= d && 100 > d && (e = "0" + d);
		a = a.replace(/fff/g, e)
	}
	return a
};
AmCharts.ifArray = function(a) {
	return a && 0 < a.length ? !0 : !1
};
AmCharts.callMethod = function(a, b) {
	for (var d = 0; d < b.length; d++) {
		var e = b[d];
		if (e) {
			if (e[a]) e[a]();
			var f = e.length;
			if (0 < f) for (var g = 0; g < f; g++) {
				var h = e[g];
				if (h && h[a]) h[a]()
			}
		}
	}
};
AmCharts.toNumber = function(a) {
	return "number" == typeof a ? a : Number(("" + a).replace(/[^0-9\-.]+/g, ""))
};
AmCharts.toColor = function(a) {
	if ("" != a && void 0 != a) if (-1 != a.indexOf(",")) for (var a = a.split(","), b = 0; b < a.length; b++) {
		var d = a[b].substring(a[b].length - 6, a[b].length);
		a[b] = "#" + d
	} else a = a.substring(a.length - 6, a.length), a = "#" + a;
	return a
};
AmCharts.toCoordinate = function(a, b, d) {
	var e;
	void 0 != a && (a = a.toString(), d && d < b && (b = d), e = Number(a), -1 != a.indexOf("!") && (e = b - Number(a.substr(1))), -1 != a.indexOf("%") && (e = b * Number(a.substr(0, a.length - 1)) / 100));
	return e
};
AmCharts.fitToBounds = function(a, b, d) {
	a < b && (a = b);
	a > d && (a = d);
	return a
};
AmCharts.isDefined = function(a) {
	return void 0 == a ? !1 : !0
};
AmCharts.stripNumbers = function(a) {
	return a.replace(/[0-9]+/g, "")
};
AmCharts.extractPeriod = function(a) {
	var b = AmCharts.stripNumbers(a),
		d = 1;
	b != a && (d = Number(a.slice(0, a.indexOf(b))));
	return {
		period: b,
		count: d
	}
};
AmCharts.resetDateToMin = function(a, b, d, e) {
	void 0 == e && (e = 1);
	var f = a.getFullYear(),
		g = a.getMonth(),
		h = a.getDate(),
		i = a.getHours(),
		j = a.getMinutes(),
		k = a.getSeconds(),
		l = a.getMilliseconds(),
		a = a.getDay();
	switch (b) {
	case "YYYY":
		f = Math.floor(f / d) * d;
		g = 0;
		h = 1;
		l = k = j = i = 0;
		break;
	case "MM":
		g = Math.floor(g / d) * d;
		h = 1;
		l = k = j = i = 0;
		break;
	case "WW":
		0 == a && 0 < e && (a = 7);
		h = h - a + e;
		l = k = j = i = 0;
		break;
	case "DD":
		h = Math.floor(h / d) * d;
		l = k = j = i = 0;
		break;
	case "hh":
		i = Math.floor(i / d) * d;
		l = k = j = 0;
		break;
	case "mm":
		j = Math.floor(j / d) * d;
		l = k = 0;
		break;
	case "ss":
		k = Math.floor(k / d) * d;
		l = 0;
		break;
	case "fff":
		l = Math.floor(l / d) * d
	}
	return a = new Date(f, g, h, i, j, k, l)
};
AmCharts.getPeriodDuration = function(a, b) {
	void 0 == b && (b = 1);
	var d;
	switch (a) {
	case "YYYY":
		d = 316224E5;
		break;
	case "MM":
		d = 26784E5;
		break;
	case "WW":
		d = 6048E5;
		break;
	case "DD":
		d = 864E5;
		break;
	case "hh":
		d = 36E5;
		break;
	case "mm":
		d = 6E4;
		break;
	case "ss":
		d = 1E3;
		break;
	case "fff":
		d = 1
	}
	return d * b
};
AmCharts.roundTo = function(a, b) {
	if (0 > b) return a;
	var d = Math.pow(10, b);
	return Math.round(a * d) / d
};
AmCharts.intervals = {
	s: {
		nextInterval: "ss",
		contains: 1E3
	},
	ss: {
		nextInterval: "mm",
		contains: 60,
		count: 0
	},
	mm: {
		nextInterval: "hh",
		contains: 60,
		count: 1
	},
	hh: {
		nextInterval: "DD",
		contains: 24,
		count: 2
	},
	DD: {
		nextInterval: "",
		contains: Infinity,
		count: 3
	}
};
AmCharts.getMaxInterval = function(a, b) {
	var d = AmCharts.intervals;
	return a >= d[b].contains ? (a = Math.round(a / d[b].contains), b = d[b].nextInterval, AmCharts.getMaxInterval(a, b)) : "ss" == b ? d[b].nextInterval : b
};
AmCharts.formatDuration = function(a, b, d, e, f, g) {
	var h = AmCharts.intervals,
		i = g.decimalSeparator;
	if (a >= h[b].contains) {
		var j = a - Math.floor(a / h[b].contains) * h[b].contains;
		"ss" == b && (j = AmCharts.formatNumber(j, g), 1 == j.split(i)[0].length && (j = "0" + j));
		if (("mm" == b || "hh" == b) && 10 > j) j = "0" + j;
		d = j + "" + e[b] + "" + d;
		a = Math.floor(a / h[b].contains);
		b = h[b].nextInterval;
		return AmCharts.formatDuration(a, b, d, e, f, g)
	}
	"ss" == b && (a = AmCharts.formatNumber(a, g), 1 == a.split(i)[0].length && (a = "0" + a));
	if (("mm" == b || "hh" == b) && 10 > a) a = "0" + a;
	d = a + "" + e[b] + "" + d;
	if (h[f].count > h[b].count) for (a = h[b].count; a < h[f].count; a++) b = h[b].nextInterval, "ss" == b || "mm" == b || "hh" == b ? d = "00" + e[b] + "" + d : "DD" == b && (d = "0" + e[b] + "" + d);
	":" == d.charAt(d.length - 1) && (d = d.substring(0, d.length - 1));
	return d
};
AmCharts.formatNumber = function(a, b, d, e, f) {
	a = AmCharts.roundTo(a, b.precision);
	isNaN(d) && (d = b.precision);
	var g = b.decimalSeparator,
		b = b.thousandsSeparator,
		h = 0 > a ? "-" : "",
		a = Math.abs(a),
		i = a.toString();
	if (-1 == i.indexOf("e")) {
		for (var i = i.split("."), j = "", k = i[0].toString(), l = k.length; 0 <= l; l -= 3) j = l != k.length ? 0 != l ? k.substring(l - 3, l) + b + j : k.substring(l - 3, l) + j : k.substring(l - 3, l);
		void 0 != i[1] && (j = j + g + i[1]);
		void 0 != d && (0 < d && "0" != j) && (j = AmCharts.addZeroes(j, g, d))
	} else j = i;
	j = h + j;
	"" == h && (!0 == e && 0 != a) && (j = "+" + j);
	!0 == f && (j += "%");
	return j
};
AmCharts.addZeroes = function(a, b, d) {
	a = a.split(b);
	void 0 == a[1] && 0 < d && (a[1] = "0");
	return a[1].length < d ? (a[1] += "0", AmCharts.addZeroes(a[0] + b + a[1], b, d)) : void 0 != a[1] ? a[0] + b + a[1] : a[0]
};
AmCharts.scientificToNormal = function(a) {
	var b, a = a.toString().split("e");
	if ("-" == a[1].substr(0, 1)) {
		b = "0.";
		for (var d = 0; d < Math.abs(Number(a[1])) - 1; d++) b += "0";
		b += a[0].split(".").join("")
	} else {
		var e = 0;
		b = a[0].split(".");
		b[1] && (e = b[1].length);
		b = a[0].split(".").join("");
		for (d = 0; d < Math.abs(Number(a[1])) - e; d++) b += "0"
	}
	return b
};
AmCharts.toScientific = function(a, b) {
	if (0 == a) return "0";
	var d = Math.floor(Math.log(Math.abs(a)) * Math.LOG10E);
	Math.pow(10, d);
	mantissa = mantissa.toString().split(".").join(b);
	return mantissa.toString() + "e" + d
};
AmCharts.randomColor = function() {
	function a() {
		return Math.floor(256 * Math.random()).toString(16)
	}
	return "#" + a() + a() + a()
};
AmCharts.hitTest = function(a, b, d) {
	var e = !1,
		f = a.x,
		g = a.x + a.width,
		h = a.y,
		i = a.y + a.height,
		j = AmCharts.isInRectangle;
	e || (e = j(f, h, b));
	e || (e = j(f, i, b));
	e || (e = j(g, h, b));
	e || (e = j(g, i, b));
	!e && !0 != d && (e = AmCharts.hitTest(b, a, !0));
	return e
};
AmCharts.isInRectangle = function(a, b, d) {
	return a >= d.x - 5 && a <= d.x + d.width + 5 && b >= d.y - 5 && b <= d.y + d.height + 5 ? !0 : !1
};
AmCharts.isPercents = function(a) {
	if (-1 != ("" + a).indexOf("%")) return !0
};
AmCharts.dayNames = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
AmCharts.shortDayNames = "Sun Mon Tue Wed Thu Fri Sat".split(" ");
AmCharts.monthNames = "January February March April May June July August September October November December".split(" ");
AmCharts.shortMonthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
AmCharts.formatDate = function(a, b) {
	var d, e, f, g, h, i, j, k;
	AmCharts.useUTC ? (d = a.getUTCFullYear(), e = a.getUTCMonth(), f = a.getUTCDate(), g = a.getUTCDay(), h = a.getUTCHours(), i = a.getUTCMinutes(), j = a.getUTCSeconds(), k = a.getUTCMilliseconds()) : (d = a.getFullYear(), e = a.getMonth(), f = a.getDate(), g = a.getDay(), h = a.getHours(), i = a.getMinutes(), j = a.getSeconds(), k = a.getMilliseconds());
	var l = ("" + d).substr(2, 2),
		o = e + 1;
	9 > e && (o = "0" + o);
	var p = f;
	10 > f && (p = "0" + f);
	var m = "0" + g,
		n = h;
	24 == n && (n = 0);
	var q = n;
	10 > q && (q = "0" + q);
	b = b.replace(/JJ/g, q);
	b = b.replace(/J/g, n);
	n = h;
	0 == n && (n = 24);
	q = n;
	10 > q && (q = "0" + q);
	b = b.replace(/HH/g, q);
	b = b.replace(/H/g, n);
	n = h;
	11 < n && (n -= 12);
	q = n;
	10 > q && (q = "0" + q);
	b = b.replace(/KK/g, q);
	b = b.replace(/K/g, n);
	n = h;
	0 == n && (n = 12);
	12 < n && (n -= 12);
	q = n;
	10 > q && (q = "0" + q);
	b = b.replace(/LL/g, q);
	b = b.replace(/L/g, n);
	n = i;
	10 > n && (n = "0" + n);
	b = b.replace(/NN/g, n);
	b = b.replace(/N/g, i);
	i = j;
	10 > i && (i = "0" + i);
	b = b.replace(/SS/g, i);
	b = b.replace(/S/g, j);
	j = k;
	10 > j && (j = "00" + j);
	100 > j && (j = "0" + j);
	i = k;
	10 > i && (i = "00" + i);
	b = b.replace(/QQQ/g, j);
	b = b.replace(/QQ/g, i);
	b = b.replace(/Q/g, k);
	b = 12 > h ? b.replace(/A/g, "am") : b.replace(/A/g, "pm");
	b = b.replace(/YYYY/g, "@IIII@");
	b = b.replace(/YY/g, "@II@");
	b = b.replace(/MMMM/g, "@XXXX@");
	b = b.replace(/MMM/g, "@XXX@");
	b = b.replace(/MM/g, "@XX@");
	b = b.replace(/M/g, "@X@");
	b = b.replace(/DD/g, "@RR@");
	b = b.replace(/D/g, "@R@");
	b = b.replace(/EEEE/g, "@PPPP@");
	b = b.replace(/EEE/g, "@PPP@");
	b = b.replace(/EE/g, "@PP@");
	b = b.replace(/E/g, "@P@");
	b = b.replace(/@IIII@/g, d);
	b = b.replace(/@II@/g, l);
	b = b.replace(/@XXXX@/g, AmCharts.monthNames[e]);
	b = b.replace(/@XXX@/g, AmCharts.shortMonthNames[e]);
	b = b.replace(/@XX@/g, o);
	b = b.replace(/@X@/g, e + 1);
	b = b.replace(/@RR@/g, p);
	b = b.replace(/@R@/g, f);
	b = b.replace(/@PPPP@/g, AmCharts.dayNames[g]);
	b = b.replace(/@PPP@/g, AmCharts.shortDayNames[g]);
	b = b.replace(/@PP@/g, m);
	return b = b.replace(/@P@/g, g)
};
AmCharts.findPosX = function(a) {
	for (var b = a.offsetLeft; a = a.offsetParent;) b += a.offsetLeft, a != document.body && a != document.documentElement && (b -= a.scrollLeft);
	return b
};
AmCharts.findPosY = function(a) {
	for (var b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop, a != document.body && a != document.documentElement && (b -= a.scrollTop);
	return b
};
AmCharts.findIfFixed = function(a) {
	for (; a = a.offsetParent;) if ("fixed" == a.style.position) return !0;
	return !1
};
AmCharts.findIfAuto = function(a) {
	return a.style && "auto" == a.style.overflow ? !0 : a.parentNode ? AmCharts.findIfAuto(a.parentNode) : !1
};
AmCharts.findScrollLeft = function(a, b) {
	a.scrollLeft && (b += a.scrollLeft);
	return a.parentNode ? AmCharts.findScrollLeft(a.parentNode, b) : b
};
AmCharts.findScrollTop = function(a, b) {
	a.scrollTop && (b += a.scrollTop);
	return a.parentNode ? AmCharts.findScrollTop(a.parentNode, b) : b
};
AmCharts.formatValue = function(a, b, d, e, f, g, h, i) {
	if (b) {
		void 0 == f && (f = "");
		for (var j = 0; j < d.length; j++) {
			var k = d[j],
				l = b[k];
			void 0 != l && (l = g ? AmCharts.addPrefix(l, i, h, e) : AmCharts.formatNumber(l, e), a = a.replace(RegExp("\\[\\[" + f + "" + k + "\\]\\]", "g"), l))
		}
	}
	return a
};
AmCharts.formatDataContextValue = function(a, b) {
	if (a) for (var d = a.match(/\[\[.*?\]\]/g), e = 0; e < d.length; e++) {
		var f = d[e],
			f = f.substr(2, f.length - 4);
		void 0 != b[f] && (a = a.replace(RegExp("\\[\\[" + f + "\\]\\]", "g"), b[f]))
	}
	return a
};
AmCharts.massReplace = function(a, b) {
	for (var d in b) {
		var e = b[d];
		void 0 == e && (e = "");
		a = a.replace(d, e)
	}
	return a
};
AmCharts.cleanFromEmpty = function(a) {
	return a.replace(/\[\[[^\]]*\]\]/g, "")
};
AmCharts.addPrefix = function(a, b, d, e) {
	var f = AmCharts.formatNumber(a, e),
		g = "",
		h;
	if (0 == a) return "0";
	0 > a && (g = "-");
	a = Math.abs(a);
	if (1 < a) for (h = b.length - 1; - 1 < h; h--) {
		if (a >= b[h].number) {
			a /= b[h].number;
			e = Number(e.precision);
			1 > e && (e = 1);
			a = AmCharts.roundTo(a, e);
			f = g + "" + a + "" + b[h].prefix;
			break
		}
	} else for (h = 0; h < d.length; h++) if (a <= d[h].number) {
		a /= d[h].number;
		e = Math.abs(Math.round(Math.log(a) * Math.LOG10E));
		a = AmCharts.roundTo(a, e);
		f = g + "" + a + "" + d[h].prefix;
		break
	}
	return f
};
AmCharts.remove = function(a) {
	a && a.remove()
};
AmCharts.copyProperties = function(a, b) {
	for (var d in a)"events" != d && (void 0 != a[d] && "function" != typeof a[d]) && (b[d] = a[d])
};
AmCharts.recommended = function() {
	var a = "js";
	document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") || swfobject && swfobject.hasFlashPlayerVersion("8") && (a = "flash");
	return a
};
AmCharts.getEffect = function(a) {
	">" == a && (a = "easeOutSine");
	"<" == a && (a = "easeInSine");
	"elastic" == a && (a = "easeOutElastic");
	return a
};
AmCharts.Bezier = AmCharts.Class({
	construct: function(a, b, d, e, f, g, h, i, j, k) {
		"object" == typeof h && (h = h[0]);
		"object" == typeof i && (i = i[0]);
		g = {
			fill: h,
			"fill-opacity": i,
			"stroke-width": g
		};
		void 0 != j && 0 < j && (g["stroke-dasharray"] = j);
		isNaN(f) || (g["stroke-opacity"] = f);
		e && (g.stroke = e);
		e = "M" + Math.round(b[0]) + "," + Math.round(d[0]);
		f = [];
		for (j = 0; j < b.length; j++) f.push({
			x: b[j],
			y: d[j]
		});
		1 < f.length && (b = this.interpolate(f), e += this.drawBeziers(b));
		k ? e += k : AmCharts.VML || (e += "M0,0 L0,0");
		this.path = a.path(e).attr(g)
	},
	interpolate: function(a) {
		var b = [];
		b.push({
			x: a[0].x,
			y: a[0].y
		});
		var d = a[1].x - a[0].x,
			e = a[1].y - a[0].y;
		b.push({
			x: a[0].x + d / 6,
			y: a[0].y + e / 6
		});
		for (var f = 1; f < a.length - 1; f++) {
			var g = a[f - 1],
				h = a[f],
				e = a[f + 1],
				d = e.x - h.x,
				e = e.y - g.y,
				g = h.x - g.x;
			g > d && (g = d);
			b.push({
				x: h.x - g / 3,
				y: h.y - e / 6
			});
			b.push({
				x: h.x,
				y: h.y
			});
			b.push({
				x: h.x + g / 3,
				y: h.y + e / 6
			})
		}
		e = a[a.length - 1].y - a[a.length - 2].y;
		d = a[a.length - 1].x - a[a.length - 2].x;
		b.push({
			x: a[a.length - 1].x - d / 3,
			y: a[a.length - 1].y - e / 6
		});
		b.push({
			x: a[a.length - 1].x,
			y: a[a.length - 1].y
		});
		return b
	},
	drawBeziers: function(a) {
		for (var b = "", d = 0; d < (a.length - 1) / 3; d++) b += this.drawBezierMidpoint(a[3 * d], a[3 * d + 1], a[3 * d + 2], a[3 * d + 3]);
		return b
	},
	drawBezierMidpoint: function(a, b, d, e) {
		var f = Math.round,
			g = this.getPointOnSegment(a, b, 0.75),
			h = this.getPointOnSegment(e, d, 0.75),
			i = (e.x - a.x) / 16,
			j = (e.y - a.y) / 16,
			k = this.getPointOnSegment(a, b, 0.375),
			a = this.getPointOnSegment(g, h, 0.375);
		a.x -= i;
		a.y -= j;
		b = this.getPointOnSegment(h, g, 0.375);
		b.x += i;
		b.y += j;
		d = this.getPointOnSegment(e, d, 0.375);
		i = this.getMiddle(k, a);
		g = this.getMiddle(g, h);
		h = this.getMiddle(b, d);
		k = " Q" + f(k.x) + "," + f(k.y) + "," + f(i.x) + "," + f(i.y);
		k += " Q" + f(a.x) + "," + f(a.y) + "," + f(g.x) + "," + f(g.y);
		k += " Q" + f(b.x) + "," + f(b.y) + "," + f(h.x) + "," + f(h.y);
		return k += " Q" + f(d.x) + "," + f(d.y) + "," + f(e.x) + "," + f(e.y)
	},
	getMiddle: function(a, b) {
		return {
			x: (a.x + b.x) / 2,
			y: (a.y + b.y) / 2
		}
	},
	getPointOnSegment: function(a, b, d) {
		return {
			x: a.x + (b.x - a.x) * d,
			y: a.y + (b.y - a.y) * d
		}
	}
});
AmCharts.Cuboid = AmCharts.Class({
	construct: function(a, b, d, e, f, g, h, i, j, k, l, o, p) {
		this.set = a.set();
		this.container = a;
		this.h = Math.round(d);
		this.w = Math.round(b);
		this.dx = e;
		this.dy = f;
		this.colors = g;
		this.alpha = h;
		this.bwidth = i;
		this.bcolor = j;
		this.balpha = k;
		this.colors = g;
		p ? 0 > b && 0 == l && (l = 180) : 0 > d && 270 == l && (l = 90);
		this.gradientRotation = l;
		0 == e && 0 == f && (this.cornerRadius = o);
		this.draw()
	},
	draw: function() {
		var a = this.set;
		a.clear();
		var b = this.container,
			d = this.w,
			e = this.h,
			f = this.dx,
			g = this.dy,
			h = this.colors,
			i = this.alpha,
			j = this.bwidth,
			k = this.bcolor,
			l = this.balpha,
			o = this.gradientRotation,
			p = this.cornerRadius;
		if (0 < f || 0 < g) {
			var m = h,
				n = h;
			"object" == typeof h && (m = h[0], n = h[h.length - 1]);
			var q = n,
				r = AmCharts.adjustLuminosity(m, -0.2),
				r = AmCharts.adjustLuminosity(m, -0.2),
				m = AmCharts.polygon(b, [0, f, d + f, d, 0], [0, g, g, 0, 0], r, i, 0, 0, 0, o);
			if (0 < l) var s = AmCharts.line(b, [0, f, d + f], [0, g, g], k, l, j);
			n = AmCharts.polygon(b, [0, 0, d, d, 0], [0, e, e, 0, 0], r, i, 0, 0, 0, 0, o);
			n.translate(f, g);
			if (0 < l) var t = AmCharts.line(b, [f, f], [g, g + e], k, 1, j);
			var w = AmCharts.polygon(b, [0, 0, f, f, 0], [0, e, e + g, g, 0], r, i, 0, 0, 0, o),
				x = AmCharts.polygon(b, [d, d, d + f, d + f, d], [0, e, e + g, g, 0], r, i, 0, 0, 0, o);
			if (0 < l) var C = AmCharts.line(b, [d, d + f, d + f, d], [0, g, e + g, e], k, l, j);
			r = AmCharts.adjustLuminosity(q, 0.2);
			q = AmCharts.polygon(b, [0, f, d + f, d, 0], [e, e + g, e + g, e, e], r, i, 0, 0, 0, o);
			if (0 < l) var u = AmCharts.line(b, [0, f, d + f], [e, e + g, e + g], k, l, j)
		}
		1 > Math.abs(e) && (e = 0);
		1 > Math.abs(d) && (d = 0);
		b = 0 == e ? AmCharts.line(b, [0, d], [0, 0], k, l, j) : 0 == d ? AmCharts.line(b, [0, 0], [0, e], k, l, j) : 0 < p ? AmCharts.rect(b, d, e, h, i, j, k, l, p, o) : AmCharts.polygon(b, [0, 0, d, d, 0], [0, e, e, 0, 0], h, i, j, k, l, o);
		e = 0 > e ? [m, s, n, t, w, x, C, q, u, b] : [q, u, n, t, w, x, m, s, C, b];
		for (s = 0; s < e.length; s++)(t = e[s]) && a.push(t)
	},
	width: function(a) {
		this.w = a;
		this.draw()
	},
	height: function(a) {
		this.h = a;
		this.draw()
	},
	animateHeight: function(a, b) {
		var d = this;
		d.easing = b;
		d.totalFrames = 1E3 * a / AmCharts.updateRate;
		d.rh = d.h;
		d.frame = 0;
		d.height(1);
		setTimeout(function() {
			d.updateHeight.call(d)
		}, AmCharts.updateRate)
	},
	updateHeight: function() {
		var a = this;
		a.frame++;
		var b = a.totalFrames;
		a.frame <= b && (b = a.easing(0, a.frame, 1, a.rh - 1, b), a.height(b), setTimeout(function() {
			a.updateHeight.call(a)
		}, AmCharts.updateRate))
	},
	animateWidth: function(a, b) {
		var d = this;
		d.easing = b;
		d.totalFrames = 1E3 * a / AmCharts.updateRate;
		d.rw = d.w;
		d.frame = 0;
		d.width(1);
		setTimeout(function() {
			d.updateWidth.call(d)
		}, AmCharts.updateRate)
	},
	updateWidth: function() {
		var a = this;
		a.frame++;
		var b = a.totalFrames;
		a.frame <= b && (b = a.easing(0, a.frame, 1, a.rw - 1, b), a.width(b), setTimeout(function() {
			a.updateWidth.call(a)
		}, AmCharts.updateRate))
	}
});
AmCharts.AmLegend = AmCharts.Class({
	construct: function() {
		this.createEvents("rollOverMarker", "rollOverItem", "rollOutMarker", "rollOutItem", "showItem", "hideItem", "clickMarker", "rollOverItem", "rollOutItem", "clickLabel");
		this.position = "bottom";
		this.borderColor = this.color = "#000000";
		this.borderAlpha = 0;
		this.markerLabelGap = 5;
		this.verticalGap = 10;
		this.align = "left";
		this.horizontalGap = 0;
		this.spacing = 10;
		this.markerDisabledColor = "#AAB3B3";
		this.markerType = "square";
		this.markerSize = 16;
		this.markerBorderAlpha;
		this.markerBorderThickness = 1;
		this.marginBottom = this.marginTop = 0;
		this.marginLeft = this.marginRight = 20;
		this.autoMargins = !0;
		this.valueWidth = 50;
		this.switchable = !0;
		this.switchType = "x";
		this.switchColor = "#FFFFFF";
		this.rollOverColor = "#CC0000";
		this.selectedColor;
		this.reversedOrder = !1;
		this.labelText = "[[title]]";
		this.valueText = "[[value]]";
		this.useMarkerColorForLabels = !1;
		this.rollOverGraphAlpha = 1;
		this.textClickEnabled = !1;
		this.equalWidths = !0;
		this.dateFormat = "DD-MM-YYYY";
		this.backgroundColor = "#FFFFFF";
		this.backgroundAlpha = 0;
		this.ly;
		this.lx
	},
	setData: function(a) {
		this.data = a;
		this.invalidateSize()
	},
	invalidateSize: function() {
		this.destroy();
		this.entries = [];
		this.valueLabels = [];
		AmCharts.ifArray(this.data) && this.drawLegend()
	},
	drawLegend: function() {
		var a = this.chart,
			b = this.position,
			d = this.width,
			e = a.realWidth,
			f = a.realHeight,
			g = this.div,
			h = this.data;
		isNaN(this.fontSize) && (this.fontSize = a.fontSize);
		if ("right" == b || "left" == b) this.maxColumns = 1, this.marginLeft = this.marginRight = 10;
		else if (this.autoMargins) {
			this.marginRight = a.marginRight;
			this.marginLeft = a.marginLeft;
			var i = a.autoMarginOffset;
			"bottom" == b ? (this.marginBottom = i, this.marginTop = 0) : (this.marginTop = i, this.marginBottom = 0)
		}
		this.divWidth = b = void 0 != d ? AmCharts.toCoordinate(d, e) : a.realWidth;
		g.style.width = b + "px";
		this.container = new AmCharts.AmDraw(g, b, f);
		this.lx = 0;
		this.ly = 8;
		f = this.markerSize;
		f > this.fontSize && (this.ly = f / 2 - 1);
		0 < f && (this.lx += f + this.markerLabelGap);
		this.titleWidth = 0;
		if (f = this.title) a = AmCharts.text(this.container, f, this.color, a.fontFamily, this.fontSize, "start", !0), a.translate(0, this.marginTop + this.verticalGap + this.ly + 1), a = a.getBBox(), this.titleWidth = a.width + 15, this.titleHeight = a.height + 6;
		for (a = this.index = this.maxLabelWidth = 0; a < h.length; a++) this.createEntry(h[a]);
		for (a = this.index = 0; a < h.length; a++) this.createValue(h[a]);
		this.arrangeEntries();
		this.updateValues()
	},
	arrangeEntries: function() {
		var a = this.position,
			b = this.marginLeft + this.titleWidth,
			d = this.marginRight,
			e = this.marginTop,
			f = this.marginBottom,
			g = this.horizontalGap,
			h = this.div,
			i = this.divWidth,
			j = this.maxColumns,
			k = this.verticalGap,
			l = this.spacing,
			o = i - d - b,
			p = 0,
			m = 0,
			n = this.container,
			q = n.set();
		this.set = q;
		n = n.set();
		q.push(n);
		for (var r = this.entries, s = 0; s < r.length; s++) {
			var t = r[s].getBBox(),
				w = t.width;
			w > p && (p = w);
			t = t.height;
			t > m && (m = t)
		}
		for (var x = w = 0, C = g, s = 0; s < r.length; s++) {
			var u = r[s];
			this.reversedOrder && (u = r[r.length - s - 1]);
			var t = u.getBBox(),
				A;
			this.equalWidths ? A = g + x * (p + l + this.markerLabelGap) : (A = C, C = C + t.width + g + l);
			A + t.width > o && 0 < s && (w++, x = 0, A = g, C = A + t.width + g + l);
			u.translate(A, (m + k) * w);
			x++;
			!isNaN(j) && x >= j && (x = 0, w++);
			n.push(u)
		}
		t = n.getBBox();
		j = t.height + 2 * k - 1;
		"left" == a || "right" == a ? (i = t.width + 2 * g, h.style.width = i + b + d + "px") : i = i - b - d - 1;
		d = AmCharts.polygon(this.container, [0, i, i, 0], [0, 0, j, j], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
		q.push(d);
		q.translate(b, e);
		d.toBack();
		b = g;
		if ("top" == a || "bottom" == a)"center" == this.align ? b = g + (i - t.width) / 2 : "right" == this.align && (b = g + i - t.width);
		n.translate(b, k + 1);
		this.titleHeight > j && (j = this.titleHeight);
		a = j + e + f + 1;
		0 > a && (a = 0);
		h.style.height = Math.round(a) + "px"
	},
	createEntry: function(a) {
		if (!1 !== a.visibleInLegend) {
			var b = this.chart,
				d = a.markerType;
			d || (d = this.markerType);
			var e = a.color,
				f = a.alpha;
			a.legendKeyColor && (e = a.legendKeyColor());
			a.legendKeyAlpha && (f = a.legendKeyAlpha());
			!0 == a.hidden && (e = this.markerDisabledColor);
			var g = this.createMarker(d, e, f);
			this.addListeners(g, a);
			f = this.container.set([g]);
			this.switchable && f.setAttr("cursor", "pointer");
			var h = this.switchType;
			if (h) {
				var i;
				i = "x" == h ? this.createX() : this.createV();
				i.dItem = a;
				!0 != a.hidden ? "x" == h ? i.hide() : i.show() : "x" != h && i.hide();
				this.switchable || i.hide();
				this.addListeners(i, a);
				a.legendSwitch = i;
				f.push(i)
			}
			h = this.color;
			a.showBalloon && (this.textClickEnabled && void 0 != this.selectedColor) && (h = this.selectedColor);
			this.useMarkerColorForLabels && (h = e);
			!0 == a.hidden && (h = this.markerDisabledColor);
			e = AmCharts.massReplace(this.labelText, {
				"[[title]]": a.title
			});
			i = this.fontSize;
			var j = this.markerSize;
			if (g && j < i) {
				var k = 0;
				if ("bubble" == d || "circle" == d) k = j / 2;
				g.translate(k, k + this.ly - i / 2 + (i + 2 - j) / 2)
			}
			if (e) {
				var l = AmCharts.text(this.container, e, h, b.fontFamily, i, "start");
				l.translate(this.lx, this.ly);
				f.push(l);
				b = l.getBBox().width;
				this.maxLabelWidth < b && (this.maxLabelWidth = b)
			}
			this.entries[this.index] = f;
			a.legendEntry = this.entries[this.index];
			a.legendLabel = l;
			this.index++
		}
	},
	addListeners: function(a, b) {
		var d = this;
		a && a.mouseover(function() {
			d.rollOverMarker(b)
		}).mouseout(function() {
			d.rollOutMarker(b)
		}).click(function() {
			d.clickMarker(b)
		})
	},
	rollOverMarker: function(a) {
		this.switchable && this.dispatch("rollOverMarker", a);
		this.dispatch("rollOverItem", a)
	},
	rollOutMarker: function(a) {
		this.switchable && this.dispatch("rollOutMarker", a);
		this.dispatch("rollOutItem", a)
	},
	clickMarker: function(a) {
		this.switchable ? !0 == a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a) : this.textClickEnabled && this.dispatch("clickMarker", a)
	},
	rollOverLabel: function(a) {
		a.hidden || (this.textClickEnabled && a.legendLabel && a.legendLabel.attr({
			fill: this.rollOverColor
		}), this.dispatch("rollOverItem", a))
	},
	rollOutLabel: function(a) {
		if (!a.hidden) {
			if (this.textClickEnabled && a.legendLabel) {
				var b = this.color;
				void 0 != this.selectedColor && a.showBalloon && (b = this.selectedColor);
				this.useMarkerColorForLabels && (b = a.lineColor, void 0 == b && (b = a.color));
				a.legendLabel.attr({
					fill: b
				})
			}
			this.dispatch("rollOutItem", a)
		}
	},
	clickLabel: function(a) {
		this.textClickEnabled ? a.hidden || this.dispatch("clickLabel", a) : this.switchable && (!0 == a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a))
	},
	dispatch: function(a, b) {
		this.fire(a, {
			type: a,
			dataItem: b,
			target: this,
			chart: this.chart
		})
	},
	createValue: function(a) {
		var b = this,
			d = b.fontSize;
		if (!1 !== a.visibleInLegend) {
			var e = b.maxLabelWidth;
			b.equalWidths || (b.valueAlign = "left");
			"left" == b.valueAlign && (e = a.legendEntry.getBBox().width);
			var f = e;
			if (b.valueText) {
				var g = b.color;
				b.useMarkerColorForLabels && (g = a.color);
				!0 == a.hidden && (g = b.markerDisabledColor);
				var h = b.valueText,
					e = e + b.lx + b.markerLabelGap + b.valueWidth,
					i = "end";
				"left" == b.valueAlign && (e -= b.valueWidth, i = "start");
				g = AmCharts.text(b.container, h, g, b.chart.fontFamily, d, i);
				g.translate(e, b.ly);
				b.entries[b.index].push(g);
				f += b.valueWidth + b.markerLabelGap;
				g.dItem = a;
				b.valueLabels.push(g)
			}
			b.index++;
			g = b.markerSize;
			g < d + 7 && (g = d + 7, AmCharts.VML && (g += 3));
			d = b.container.rect(b.markerSize + b.markerLabelGap, 0, f, g, 0, 0).attr({
				stroke: "none",
				fill: "#FFFFFF",
				"fill-opacity": 0.005
			});
			d.dItem = a;
			b.entries[b.index - 1].push(d);
			d.mouseover(function() {
				b.rollOverLabel(a)
			}).mouseout(function() {
				b.rollOutLabel(a)
			}).click(function() {
				b.clickLabel(a)
			})
		}
	},
	createV: function() {
		var a = this.markerSize;
		return AmCharts.polygon(this.container, [a / 5, a / 2, a - a / 5, a / 2], [a / 3, a - a / 5, a / 5, a / 1.7], this.switchColor)
	},
	createX: function() {
		var a = this.markerSize - 3,
			b = {
				stroke: this.switchColor,
				"stroke-width": 3
			},
			d = this.container,
			e = AmCharts.line(d, [3, a], [3, a]).attr(b),
			a = AmCharts.line(d, [3, a], [a, 3]).attr(b);
		return this.container.set([e, a])
	},
	createMarker: function(a, b, d) {
		var e = this.markerSize,
			f = this.container,
			g, h = this.markerBorderThickness,
			i = this.markerBorderAlpha;
		switch (a) {
		case "square":
			g = AmCharts.polygon(f, [0, e, e, 0], [0, 0, e, e], b, d, h, b, i);
			break;
		case "circle":
			g = AmCharts.circle(f, e / 2, b, d, h, b, i);
			g.translate(e / 2, e / 2);
			break;
		case "line":
			g = AmCharts.line(f, [0, e], [e / 2, e / 2], b, d, h);
			break;
		case "dashedLine":
			g = AmCharts.line(f, [0, e], [e / 2, e / 2], b, d, h, 3);
			break;
		case "triangleUp":
			g = AmCharts.polygon(f, [0, e / 2, e, e], [e, 0, e, e], b, d, h, b, i);
			break;
		case "triangleDown":
			g = AmCharts.polygon(f, [0, e / 2, e, e], [0, e, 0, 0], b, d, h, b, i);
			break;
		case "bubble":
			g = AmCharts.circle(f, e / 2, b, d, h, b, i, !0), g.translate(e / 2, e / 2)
		}
		return g
	},
	validateNow: function() {
		this.invalidateSize()
	},
	updateValues: function() {
		for (var a = this.valueLabels, b = this.chart, d = 0; d < a.length; d++) {
			var e = a[d],
				f = e.dItem;
			if (void 0 != f.type) {
				var g = f.currentDataItem;
				if (g) {
					var h = this.valueText;
					f.legendValueText && (h = f.legendValueText);
					f = h;
					f = b.formatString(f, g);
					e.text(f)
				} else e.text(" ")
			} else g = b.formatString(this.valueText, f), e.text(g)
		}
	},
	renderFix: function() {
		if (!AmCharts.VML) {
			var a = this.container;
			a && a.renderFix()
		}
	},
	destroy: function() {
		this.div.innerHTML = "";
		AmCharts.remove(this.set)
	}
});
AmCharts.AmBalloon = AmCharts.Class({
	construct: function() {
		this.enabled = !0;
		this.fillColor = "#CC0000";
		this.fillAlpha = 1;
		this.borderThickness = 2;
		this.borderColor = "#FFFFFF";
		this.borderAlpha = 1;
		this.cornerRadius = 6;
		this.maximumWidth = 220;
		this.horizontalPadding = 8;
		this.verticalPadding = 5;
		this.pointerWidth = 10;
		this.pointerOrientation = "V";
		this.color = "#FFFFFF";
		this.textShadowColor = "#000000";
		this.adjustBorderColor = !1;
		this.showBullet = !0;
		this.show = this.follow = !1;
		this.bulletSize = 3
	},
	draw: function() {
		var a = this.pointToX,
			b = this.pointToY;
		if (!isNaN(a)) {
			var d = this.chart,
				e = d.container,
				f = this.set;
			AmCharts.remove(f);
			AmCharts.remove(this.pointer);
			this.set = f = e.set();
			if (this.show) {
				var g = this.l,
					h = this.t,
					i = this.r,
					j = this.b,
					k = this.textShadowColor;
				this.color == k && (k = void 0);
				var l = this.balloonColor,
					o = this.fillColor,
					p = this.borderColor;
				void 0 != l && (this.adjustBorderColor ? p = l : o = l);
				var m = this.horizontalPadding,
					n = this.verticalPadding,
					l = this.pointerWidth,
					q = this.pointerOrientation,
					r = this.cornerRadius,
					s = d.fontFamily,
					t = this.fontSize;
				void 0 == t && (t = d.fontSize);
				d = AmCharts.text(e, this.text, this.color, s, t);
				f.push(d);
				if (void 0 != k) {
					var w = AmCharts.text(e, this.text, k, s, t, "middle", !1, 0.4);
					f.push(w)
				}
				s = d.getBBox();
				k = s.height + 2 * n;
				m = s.width + 2 * m;
				window.opera && (k += 2);
				n = m / 2;
				t = t / 2 + 5;
				d.translate(n, t);
				w && w.translate(n + 1, t + 1);
				"H" != q ? (n = a - m / 2, t = b < h + k + 10 && "down" != q ? b + l : b - k - l) : (2 * l > k && (l = k / 2), t = b - k / 2, n = a < g + (i - g) / 2 ? a + l : a - m - l);
				t + k >= j && (t = j - k);
				t < h && (t = h);
				n < g && (n = g);
				n + m > i && (n = i - m);
				0 < r || 0 == l ? (p = AmCharts.rect(e, m, k, o, this.fillAlpha, this.borderThickness, p, this.borderAlpha, this.cornerRadius), this.showBullet && (e = AmCharts.circle(e, this.bulletSize, o, this.fillAlpha), e.translate(a, b), this.pointer = e)) : (j = [], r = [], "H" != q ? (g = a - n, g > m - l && (g = m - l), g < l && (g = l), j = [0, g - l, a - n, g + l, m, m, 0, 0], r = b < h + k + 10 && "down" != q ? [0, 0, b - t, 0, 0, k, k, 0] : [k, k, b - t, k, k, 0, 0, k]) : (h = b - t, h > k - l && (h = k - l), h < l && (h = l), r = [0, h - l, b - t, h + l, k, k, 0, 0], j = a < g + (i - g) / 2 ? [0, 0, a - n, 0, 0, m, m, 0] : [m, m, a - n, m, m, 0, 0, m]), p = AmCharts.polygon(e, j, r, o, this.fillAlpha, this.borderThickness, p, this.borderAlpha));
				f.push(p);
				p.toFront();
				w && w.toFront();
				d.toFront();
				f.translate(n, t);
				s = p.getBBox();
				this.bottom = t + s.y + s.height;
				this.yPos = s.y + t
			}
		}
	},
	followMouse: function() {
		if (this.follow && this.show) {
			var a = this.chart.mouseX,
				b = this.chart.mouseY - 3;
			this.pointToX = a;
			this.pointToY = b;
			if (a != this.previousX || b != this.previousY) if (this.previousX = a, this.previousY = b, 0 == this.cornerRadius) this.draw();
			else {
				var d = this.set;
				if (d) {
					var e = d.getBBox(),
						a = a - e.width / 2,
						f = b - e.height - 10;
					a < this.l && (a = this.l);
					a > this.r - e.width && (a = this.r - e.width);
					f < this.t && (f = b + 10);
					d.translate(a, f)
				}
			}
		}
	},
	changeColor: function(a) {
		this.balloonColor = a
	},
	setBounds: function(a, b, d, e) {
		this.l = a;
		this.t = b;
		this.r = d;
		this.b = e
	},
	showBalloon: function(a) {
		this.text = a;
		this.show = !0;
		this.draw()
	},
	hide: function() {
		this.follow = this.show = !1;
		this.destroy()
	},
	setPosition: function(a, b, d) {
		this.pointToX = a;
		this.pointToY = b;
		d && (a != this.previousX || b != this.previousY) && this.draw();
		this.previousX = a;
		this.previousY = b
	},
	followCursor: function(a) {
		var b = this;
		(b.follow = a) ? (b.pShowBullet = b.showBullet, b.showBullet = !1) : void 0 != b.pShowBullet && (b.showBullet = b.pShowBullet);
		clearInterval(b.interval);
		var d = b.chart.mouseX,
			e = b.chart.mouseY;
		!isNaN(d) && a && (b.pointToX = d, b.pointToY = e - 3, b.interval = setInterval(function() {
			b.followMouse.call(b)
		}, 40))
	},
	destroy: function() {
		clearInterval(this.interval);
		AmCharts.remove(this.set);
		AmCharts.remove(this.pointer)
	}
});
AmCharts.AmCoordinateChart = AmCharts.Class({
	inherits: AmCharts.AmChart,
	construct: function() {
		AmCharts.AmCoordinateChart.base.construct.call(this);
		this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem");
		this.plotAreaFillColors = "#FFFFFF";
		this.plotAreaFillAlphas = 0;
		this.plotAreaBorderColor = "#000000";
		this.plotAreaBorderAlpha = 0;
		this.startAlpha = 1;
		this.startDuration = 0;
		this.startEffect = "elastic";
		this.sequencedAnimation = !0;
		this.colors = "#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(" ");
		this.balloonDateFormat = "MMM DD, YYYY";
		this.valueAxes = [];
		this.graphs = []
	},
	initChart: function() {
		AmCharts.AmCoordinateChart.base.initChart.call(this);
		this.createValueAxes();
		AmCharts.VML && (this.startAlpha = 1);
		var a = this.legend;
		a && a.setData(this.graphs)
	},
	createValueAxes: function() {
		0 == this.valueAxes.length && this.addValueAxis(new AmCharts.ValueAxis)
	},
	parseData: function() {
		this.processValueAxes();
		this.processGraphs()
	},
	parseSerialData: function() {
		AmCharts.AmSerialChart.base.parseData.call(this);
		var a = this.graphs,
			b = this.seriesIdField;
		b || (b = this.categoryField);
		this.chartData = [];
		var d = this.dataProvider;
		if (d) {
			var e = !1;
			this.categoryAxis && (e = this.categoryAxis.parseDates);
			if (e) var f = AmCharts.extractPeriod(this.categoryAxis.minPeriod),
				g = f.period,
				f = f.count;
			var h = {};
			this.lookupTable = h;
			for (var i = 0; i < d.length; i++) {
				var j = {},
					k = d[i],
					l = k[this.categoryField];
				j.category = l;
				h[k[b]] = j;
				e && (l = new Date(l.getFullYear(), l.getMonth(), l.getDate(), l.getHours(), l.getMinutes(), l.getSeconds(), l.getMilliseconds()), l = AmCharts.resetDateToMin(l, g, f), j.category = l, j.time = l.getTime());
				var o = this.valueAxes;
				j.axes = {};
				j.x = {};
				for (var p = 0; p < o.length; p++) {
					var m = o[p].id;
					j.axes[m] = {};
					j.axes[m].graphs = {};
					for (var n = 0; n < a.length; n++) {
						var l = a[n],
							q = l.id,
							r = l.periodValue;
						if (l.valueAxis.id == m) {
							j.axes[m].graphs[q] = {};
							var s = {};
							s.index = i;
							s.values = this.processValues(k, l, r);
							this.processFields(l, s, k);
							s.category = j.category;
							s.serialDataItem = j;
							s.graph = l;
							j.axes[m].graphs[q] = s
						}
					}
				}
				this.chartData[i] = j
			}
		}
		for (b = 0; b < a.length; b++) l = a[b], l.dataProvider && this.parseGraphData(l)
	},
	processValues: function(a, b, d) {
		var e = {},
			f = Number(a[b.valueField + d]);
		isNaN(f) || (e.value = f);
		f = Number(a[b.openField + d]);
		isNaN(f) || (e.open = f);
		f = Number(a[b.closeField + d]);
		isNaN(f) || (e.close = f);
		f = Number(a[b.lowField + d]);
		isNaN(f) || (e.low = f);
		f = Number(a[b.highField + d]);
		isNaN(f) || (e.high = f);
		return e
	},
	parseGraphData: function(a) {
		var b = a.dataProvider,
			d = a.seriesIdField;
		d || (d = this.seriesIdField);
		d || (d = this.categoryField);
		for (var e = 0; e < b.length; e++) {
			var f = b[e],
				g = this.lookupTable["" + f[d]],
				h = a.valueAxis.id;
			g && (h = g.axes[h].graphs[a.id], h.serialDataItem = g, h.values = this.processValues(f, a, a.periodValue), this.processFields(a, h, f))
		}
	},
	addValueAxis: function(a) {
		a.chart = this;
		this.valueAxes.push(a);
		this.validateData()
	},
	removeValueAxesAndGraphs: function() {
		for (var a = this.valueAxes, b = a.length - 1; - 1 < b; b--) this.removeValueAxis(a[b])
	},
	removeValueAxis: function(a) {
		var b = this.graphs,
			d;
		for (d = b.length - 1; 0 <= d; d--) {
			var e = b[d];
			e && e.valueAxis == a && this.removeGraph(e)
		}
		b = this.valueAxes;
		for (d = b.length - 1; 0 <= d; d--) b[d] == a && b.splice(d, 1);
		this.validateData()
	},
	addGraph: function(a) {
		this.graphs.push(a);
		this.chooseGraphColor(a, this.graphs.length - 1);
		this.validateData()
	},
	removeGraph: function(a) {
		for (var b = this.graphs, d = b.length - 1; 0 <= d; d--) b[d] == a && (b.splice(d, 1), a.destroy());
		this.validateData()
	},
	processValueAxes: function() {
		for (var a = this.valueAxes, b = 0; b < a.length; b++) {
			var d = a[b];
			d.chart = this;
			d.id || (d.id = "valueAxis" + b);
			if (!0 === this.usePrefixes || !1 === this.usePrefixes) d.usePrefixes = this.usePrefixes
		}
	},
	processGraphs: function() {
		for (var a = this.graphs, b = 0; b < a.length; b++) {
			var d = a[b];
			d.chart = this;
			d.valueAxis || (d.valueAxis = this.valueAxes[0]);
			d.id || (d.id = "graph" + b)
		}
	},
	formatString: function(a, b) {
		var d = b.graph,
			e = d.valueAxis;
		e.duration && b.values.value && (e = AmCharts.formatDuration(b.values.value, e.duration, "", e.durationUnits, e.maxInterval, e.numberFormatter), a = a.split("[[value]]").join(e));
		a = AmCharts.massReplace(a, {
			"[[title]]": d.title,
			"[[description]]": b.description,
			"<br>": "\n"
		});
		return a = AmCharts.cleanFromEmpty(a)
	},
	getBalloonColor: function(a, b) {
		var d = a.lineColor,
			e = a.balloonColor,
			f = a.fillColors;
		"object" == typeof f ? d = f[0] : void 0 != f && (d = f);
		if (b.isNegative) {
			var f = a.negativeLineColor,
				g = a.negativeFillColors;
			"object" == typeof g ? f = g[0] : void 0 != g && (f = g);
			void 0 != f && (d = f)
		}
		void 0 != b.color && (d = b.color);
		void 0 == e && (e = d);
		return e
	},
	getGraphById: function(a) {
		return this.getObjById(this.graphs, a)
	},
	getValueAxisById: function(a) {
		return this.getObjById(this.valueAxes, a)
	},
	getObjById: function(a, b) {
		for (var d, e = 0; e < a.length; e++) {
			var f = a[e];
			f.id == b && (d = f)
		}
		return d
	},
	processFields: function(a, b, d) {
		if (a.itemColors) {
			var e = a.itemColors,
				f = b.index;
			b.color = f < e.length ? e[f] : AmCharts.randomColor()
		}
		e = "color alpha fillColors description bullet customBullet bulletSize bulletConfig url".split(" ");
		for (f = 0; f < e.length; f++) {
			var g = e[f],
				h = a[g + "Field"];
			h && (h = d[h], AmCharts.isDefined(h) && (b[g] = h))
		}
		b.dataContext = d
	},
	chooseGraphColor: function(a, b) {
		if (void 0 == a.lineColor) {
			var d;
			d = this.colors.length > b ? this.colors[b] : AmCharts.randomColor();
			a.lineColor = d
		}
	},
	handleLegendEvent: function(a) {
		var b = a.type;
		if (a = a.dataItem) {
			var d = a.hidden,
				e = a.showBalloon;
			switch (b) {
			case "clickMarker":
				e ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
				break;
			case "clickLabel":
				e ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
				break;
			case "rollOverItem":
				d || this.highlightGraph(a);
				break;
			case "rollOutItem":
				d || this.unhighlightGraph();
				break;
			case "hideItem":
				this.hideGraph(a);
				break;
			case "showItem":
				this.showGraph(a)
			}
		}
	},
	highlightGraph: function(a) {
		var b = this.graphs,
			d, e = 0.2;
		this.legend && (e = this.legend.rollOverGraphAlpha);
		if (1 != e) for (d = 0; d < b.length; d++) {
			var f = b[d];
			f != a && f.changeOpacity(e)
		}
	},
	unhighlightGraph: function() {
		this.legend && (alpha = this.legend.rollOverGraphAlpha);
		if (1 != alpha) for (var a = this.graphs, b = 0; b < a.length; b++) a[b].changeOpacity(1)
	},
	showGraph: function(a) {
		a.hidden = !1;
		this.initChart()
	},
	hideGraph: function(a) {
		a.hidden = !0;
		this.initChart()
	},
	hideGraphsBalloon: function(a) {
		a.showBalloon = !1;
		this.updateLegend()
	},
	showGraphsBalloon: function(a) {
		a.showBalloon = !0;
		this.updateLegend()
	},
	updateLegend: function() {
		this.legend && this.legend.invalidateSize()
	},
	animateAgain: function() {
		var a = this.graphs;
		if (a) for (var b = 0; b < a.length; b++) a[b].animationPlayed = !1
	}
});
AmCharts.AmRectangularChart = AmCharts.Class({
	inherits: AmCharts.AmCoordinateChart,
	construct: function() {
		AmCharts.AmRectangularChart.base.construct.call(this);
		this.createEvents("zoomed");
		this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 20;
		this.verticalPosition = this.horizontalPosition = this.depth3D = this.angle = 0;
		this.heightMultiplyer = this.widthMultiplyer = 1;
		this.zoomOutText = "Show all";
		this.zbSet;
		this.zoomOutButton = {
			backgroundColor: "#b2e1ff",
			backgroundAlpha: 1
		};
		this.trendLines = [];
		this.autoMargins = !0;
		this.marginsUpdated = !1;
		this.autoMarginOffset = 10
	},
	initChart: function() {
		AmCharts.AmRectangularChart.base.initChart.call(this);
		this.updateDxy();
		var a = !0;
		!this.marginsUpdated && this.autoMargins && (this.resetMargins(), a = !1);
		this.updateMargins();
		this.updatePlotArea();
		this.updateScrollbars();
		this.updateTrendLines();
		this.updateChartCursor();
		this.updateValueAxes();
		a && (this.scrollbarOnly || this.updateGraphs())
	},
	drawChart: function() {
		AmCharts.AmRectangularChart.base.drawChart.call(this);
		this.drawPlotArea();
		if (AmCharts.ifArray(this.chartData)) {
			var a = this.chartCursor;
			a && a.draw();
			a = this.zoomOutText;
			"" != a && a && this.drawZoomOutButton()
		}
	},
	resetMargins: function() {
		var a = {};
		if ("serial" == this.chartType) {
			for (var b = this.valueAxes, d = 0; d < b.length; d++) {
				var e = b[d];
				e.ignoreAxisWidth || (e.setOrientation(this.rotate), e.fixAxisPosition(), a[e.position] = !0)
			}
			if ((d = this.categoryAxis) && !d.ignoreAxisWidth) d.setOrientation(!this.rotate), d.fixAxisPosition(), d.fixAxisPosition(), a[d.position] = !0
		} else {
			e = this.xAxes;
			b = this.yAxes;
			for (d = 0; d < e.length; d++) {
				var f = e[d];
				f.ignoreAxisWidth || (f.setOrientation(!0), f.fixAxisPosition(), a[f.position] = !0)
			}
			for (d = 0; d < b.length; d++) e = b[d], e.ignoreAxisWidth || (e.setOrientation(!1), e.fixAxisPosition(), a[e.position] = !0)
		}
		a.left && (this.marginLeft = 0);
		a.right && (this.marginRight = 0);
		a.top && (this.marginTop = 0);
		a.bottom && (this.marginBottom = 0);
		this.fixMargins = a
	},
	measureMargins: function() {
		var a = this.valueAxes,
			b, d = this.autoMarginOffset,
			e = this.fixMargins,
			f = this.realWidth,
			g = this.realHeight,
			h = d,
			i = d,
			j = f - d;
		b = g - d;
		for (var k = 0; k < a.length; k++) b = this.getAxisBounds(a[k], h, j, i, b), h = b.l, j = b.r, i = b.t, b = b.b;
		if (a = this.categoryAxis) b = this.getAxisBounds(a, h, j, i, b), h = b.l, j = b.r, i = b.t, b = b.b;
		e.left && h < d && (this.marginLeft = Math.round(-h + d));
		e.right && j > f - d && (this.marginRight = Math.round(j - f + d));
		e.top && i < d && (this.marginTop = Math.round(this.marginTop - i + d + this.titleHeight));
		e.bottom && b > g - d && (this.marginBottom = Math.round(b - g + d));
		this.animateAgain();
		this.initChart()
	},
	getAxisBounds: function(a, b, d, e, f) {
		if (!a.ignoreAxisWidth) {
			var g = a.labelsSet,
				h = a.tickLength;
			a.inside && (h = 0);
			if (g) switch (g = a.getBBox(), a.position) {
			case "top":
				a = g.y;
				e > a && (e = a);
				break;
			case "bottom":
				a = g.y + g.height;
				f < a && (f = a);
				break;
			case "right":
				a = g.x + g.width + h + 3;
				d < a && (d = a);
				break;
			case "left":
				a = g.x - h, b > a && (b = a)
			}
		}
		return {
			l: b,
			t: e,
			r: d,
			b: f
		}
	},
	drawZoomOutButton: function() {
		var a = this,
			b = a.container.set();
		a.zoomButtonSet.push(b);
		var d = a.color,
			e = a.fontSize,
			f = a.zoomOutButton;
		if (f && (f.fontSize && (e = f.fontSize), f.color)) d = f.color;
		d = AmCharts.text(a.container, a.zoomOutText, d, a.fontFamily, e, "start");
		e = d.getBBox();
		d.translate(29, 6 + e.height / 2);
		f = AmCharts.rect(a.container, e.width + 40, e.height + 15, f.backgroundColor, f.backgroundAlpha);
		b.push(f);
		a.zbBG = f;
		void 0 != a.pathToImages && (f = a.container.image(a.pathToImages + "lens.png", 0, 0, 16, 16), f.translate(7, e.height / 2 - 1), f.toFront(), b.push(f));
		d.toFront();
		b.push(d);
		f = b.getBBox();
		b.translate(a.marginLeftReal + a.plotAreaWidth - f.width, a.marginTopReal);
		b.hide();
		b.mouseover(function() {
			a.rollOverZB()
		}).mouseout(function() {
			a.rollOutZB()
		}).click(function() {
			a.clickZB()
		}).touchstart(function() {
			a.rollOverZB()
		}).touchend(function() {
			a.rollOutZB();
			a.clickZB()
		});
		for (f = 0; f < b.length; f++) b[f].attr({
			cursor: "pointer"
		});
		a.zbSet = b
	},
	rollOverZB: function() {
		this.zbBG.show()
	},
	rollOutZB: function() {
		this.zbBG.hide()
	},
	clickZB: function() {
		this.zoomOut()
	},
	zoomOut: function() {
		this.updateScrollbar = !0;
		this.zoom()
	},
	drawPlotArea: function() {
		var a = this.dx,
			b = this.dy,
			d = this.marginLeftReal,
			e = this.marginTopReal,
			f = this.plotAreaWidth,
			g = this.plotAreaHeight,
			h = this.plotAreaFillColors,
			i = this.plotAreaFillAlphas,
			j = this.plotAreaBorderColor,
			k = this.plotAreaBorderAlpha;
		this.trendLinesSet.clipRect(d, e, f, g);
		"object" == typeof i && (i = i[0]);
		h = AmCharts.polygon(this.container, [0, f, f, 0], [0, 0, g, g], h, i, 1, j, k, this.plotAreaGradientAngle);
		h.translate(d + a, e + b);
		this.set.push(h);
		0 != a && 0 != b && (h = this.plotAreaFillColors, "object" == typeof h && (h = h[0]), h = AmCharts.adjustLuminosity(h, -0.15), f = AmCharts.polygon(this.container, [0, a, f + a, f, 0], [0, b, b, 0, 0], h, i, 1, j, k), f.translate(d, e + g), this.set.push(f), a = AmCharts.polygon(this.container, [0, 0, a, a, 0], [0, g, g + b, b, 0], h, i, 1, j, k), a.translate(d, e), this.set.push(a))
	},
	updatePlotArea: function() {
		this.realWidth = this.updateWidth() - 1;
		this.realHeight = this.updateHeight() - 1;
		var a = this.realWidth - this.marginLeftReal - this.marginRightReal - this.dx,
			b = this.realHeight - this.marginTopReal - this.marginBottomReal;
		1 > a && (a = 1);
		1 > b && (b = 1);
		this.plotAreaWidth = Math.round(a);
		this.plotAreaHeight = Math.round(b)
	},
	updateDxy: function() {
		this.dx = this.depth3D * Math.cos(this.angle * Math.PI / 180);
		this.dy = -this.depth3D * Math.sin(this.angle * Math.PI / 180)
	},
	updateMargins: function() {
		var a = this.getTitleHeight();
		this.titleHeight = a;
		this.marginTopReal = this.marginTop - this.dy + a;
		this.marginBottomReal = this.marginBottom;
		this.marginLeftReal = this.marginLeft;
		this.marginRightReal = this.marginRight
	},
	updateValueAxes: function() {
		for (var a = this.valueAxes, b = this.marginLeftReal, d = this.marginTopReal, e = this.plotAreaHeight, f = this.plotAreaWidth, g = 0; g < a.length; g++) {
			var h = a[g];
			h.axisRenderer = AmCharts.RecAxis;
			h.guideFillRenderer = AmCharts.RecFill;
			h.axisItemRenderer = AmCharts.RecItem;
			h.dx = this.dx;
			h.dy = this.dy;
			h.viW = f;
			h.viH = e;
			h.marginsChanged = !0;
			h.viX = b;
			h.viY = d;
			this.updateObjectSize(h)
		}
	},
	updateObjectSize: function(a) {
		a.width = this.plotAreaWidth * this.widthMultiplyer;
		a.height = this.plotAreaHeight * this.heightMultiplyer;
		a.x = this.marginLeftReal + this.horizontalPosition;
		a.y = this.marginTopReal + this.verticalPosition
	},
	updateGraphs: function() {
		for (var a = this.graphs, b = 0; b < a.length; b++) {
			var d = a[b];
			d.x = this.marginLeftReal + this.horizontalPosition;
			d.y = this.marginTopReal + this.verticalPosition;
			d.width = this.plotAreaWidth * this.widthMultiplyer;
			d.height = this.plotAreaHeight * this.heightMultiplyer;
			d.index = b;
			d.dx = this.dx;
			d.dy = this.dy;
			d.rotate = this.rotate;
			d.chartType = this.chartType
		}
	},
	updateChartCursor: function() {
		var a = this.chartCursor;
		a && (a.x = this.marginLeftReal, a.y = this.marginTopReal, a.width = this.plotAreaWidth, a.height = this.plotAreaHeight, a.chart = this)
	},
	updateScrollbars: function() {},
	addChartCursor: function(a) {
		AmCharts.callMethod("destroy", [this.chartCursor]);
		a && (this.listenTo(a, "changed", this.handleCursorChange), this.listenTo(a, "zoomed", this.handleCursorZoom));
		this.chartCursor = a
	},
	removeChartCursor: function() {
		AmCharts.callMethod("destroy", [this.chartCursor]);
		this.chartCursor = null
	},
	zoomTrendLines: function() {
		for (var a = this.trendLines, b = 0; b < a.length; b++) {
			var d = a[b];
			d.valueAxis.recalculateToPercents ? d.set && d.set.hide() : (d.x = this.marginLeftReal + this.horizontalPosition, d.y = this.marginTopReal + this.verticalPosition, d.draw())
		}
	},
	addTrendLine: function(a) {
		this.trendLines.push(a)
	},
	removeTrendLine: function(a) {
		for (var b = this.trendLines, d = b.length - 1; 0 <= d; d--) b[d] == a && b.splice(d, 1)
	},
	adjustMargins: function(a, b) {
		var d = a.scrollbarHeight;
		"top" == a.position ? b ? this.marginLeftReal += d : this.marginTopReal += d : b ? this.marginRightReal += d : this.marginBottomReal += d
	},
	getScrollbarPosition: function(a, b, d) {
		a.position = b ? "bottom" == d || "left" == d ? "bottom" : "top" : "top" == d || "right" == d ? "bottom" : "top"
	},
	updateChartScrollbar: function(a, b) {
		if (a) {
			a.rotate = b;
			var d = this.marginTopReal,
				e = this.marginLeftReal,
				f = a.scrollbarHeight,
				g = this.dx,
				h = this.dy;
			"top" == a.position ? b ? (a.y = d, a.x = e - f) : (a.y = d - f + h, a.x = e + g) : b ? (a.y = d + h, a.x = e + this.plotAreaWidth + g) : (a.y = d + this.plotAreaHeight + 1, a.x = this.marginLeftReal)
		}
	},
	showZB: function(a) {
		var b = this.zbSet;
		b && (a ? b.show() : b.hide(), this.zbBG.hide())
	},
	handleReleaseOutside: function(a) {
		AmCharts.AmRectangularChart.base.handleReleaseOutside.call(this, a);
		(a = this.chartCursor) && a.handleReleaseOutside()
	},
	handleMouseDown: function(a) {
		AmCharts.AmRectangularChart.base.handleMouseDown.call(this, a);
		var b = this.chartCursor;
		b && b.handleMouseDown(a)
	},
	handleCursorChange: function() {}
});
AmCharts.TrendLine = AmCharts.Class({
	construct: function() {
		this.createEvents("click");
		this.isProtected = !1;
		this.dashLength = 0;
		this.lineColor = "#00CC00";
		this.lineThickness = this.lineAlpha = 1
	},
	draw: function() {
		var a = this;
		a.destroy();
		var b = a.chart,
			d = b.container,
			e, f, g, h, i = a.categoryAxis,
			j = a.initialDate,
			k = a.initialCategory,
			l = a.finalDate,
			o = a.finalCategory,
			p = a.valueAxis,
			m = a.valueAxisX,
			n = a.initialXValue,
			q = a.finalXValue,
			r = a.initialValue,
			s = a.finalValue,
			t = p.recalculateToPercents;
		i && (j && (e = i.dateToCoordinate(j)), k && (e = i.categoryToCoordinate(k)), l && (f = i.dateToCoordinate(l)), o && (f = i.categoryToCoordinate(o)));
		m && !t && (isNaN(n) || (e = m.getCoordinate(n)), isNaN(q) || (f = m.getCoordinate(q)));
		p && !t && (isNaN(r) || (g = p.getCoordinate(r)), isNaN(s) || (h = p.getCoordinate(s)));
		!isNaN(e) && (!isNaN(f) && !isNaN(g) && !isNaN(g)) && (b.rotate ? (i = [g, h], f = [e, f]) : (i = [e, f], f = [g, h]), g = a.lineColor, e = AmCharts.line(d, i, f, g, a.lineAlpha, a.lineThickness, a.dashLength), f = AmCharts.line(d, i, f, g, 0.005, 5), d = d.set([e, f]), d.translate(b.marginLeftReal, b.marginTopReal), b.trendLinesSet.push(d), a.line = e, a.set = d, f.mouseup(function() {
			a.handleLineClick()
		}).mouseover(function() {
			a.handleLineOver()
		}).mouseout(function() {
			a.handleLineOut()
		}))
	},
	handleLineClick: function() {
		var a = {
			type: "click",
			trendLine: this,
			chart: this.chart
		};
		this.fire(a.type, a)
	},
	handleLineOver: function() {
		var a = this.rollOverColor;
		void 0 != a && this.line.attr({
			stroke: a
		})
	},
	handleLineOut: function() {
		this.line.attr({
			stroke: this.lineColor
		})
	},
	destroy: function() {
		AmCharts.remove(this.set)
	}
});
AmCharts.AmSerialChart = AmCharts.Class({
	inherits: AmCharts.AmRectangularChart,
	construct: function() {
		AmCharts.AmSerialChart.base.construct.call(this);
		this.createEvents("changed");
		this.columnSpacing = 5;
		this.columnWidth = 0.8;
		this.updateScrollbar = !0;
		var a = new AmCharts.CategoryAxis;
		a.chart = this;
		this.categoryAxis = a;
		this.chartType = "serial";
		this.zoomOutOnDataUpdate = !0;
		this.skipZoom = !1;
		this.minSelectedTime = 0
	},
	initChart: function() {
		AmCharts.AmSerialChart.base.initChart.call(this);
		this.updateCategoryAxis();
		this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
		this.updateScrollbar = !0;
		this.drawChart();
		this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins())
	},
	validateData: function(a) {
		this.marginsUpdated = !1;
		this.zoomOutOnDataUpdate && !a && (this.endTime = this.end = this.startTime = this.start = NaN);
		AmCharts.AmSerialChart.base.validateData.call(this)
	},
	drawChart: function() {
		AmCharts.AmSerialChart.base.drawChart.call(this);
		var a = this.chartData;
		if (AmCharts.ifArray(a)) {
			var b = this.chartScrollbar;
			b && b.draw();
			var b = a.length - 1,
				d, e;
			d = this.categoryAxis;
			if (d.parseDates && !d.equalSpacing) {
				if (d = this.startTime, e = this.endTime, isNaN(d) || isNaN(e)) d = a[0].time, e = a[b].time
			} else if (d = this.start, e = this.end, isNaN(d) || isNaN(e)) d = 0, e = b;
			this.endTime = this.startTime = this.end = this.start = void 0;
			this.zoom(d, e)
		} else this.cleanChart();
		this.chartCreated = !0;
		this.dispDUpd()
	},
	cleanChart: function() {
		AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.categoryAxis, this.chartScrollbar, this.chartCursor])
	},
	updateCategoryAxis: function() {
		var a = this.categoryAxis;
		a.id = "categoryAxis";
		a.rotate = this.rotate;
		a.axisRenderer = AmCharts.RecAxis;
		a.guideFillRenderer = AmCharts.RecFill;
		a.axisItemRenderer = AmCharts.RecItem;
		a.setOrientation(!this.rotate);
		a.x = this.marginLeftReal;
		a.y = this.marginTopReal;
		a.dx = this.dx;
		a.dy = this.dy;
		a.width = this.plotAreaWidth;
		a.height = this.plotAreaHeight;
		a.viW = this.plotAreaWidth;
		a.viH = this.plotAreaHeight;
		a.viX = this.marginLeftReal;
		a.viY = this.marginTopReal;
		a.marginsChanged = !0
	},
	updateValueAxes: function() {
		AmCharts.AmSerialChart.base.updateValueAxes.call(this);
		for (var a = this.valueAxes, b = 0; b < a.length; b++) {
			var d = a[b],
				e = this.rotate;
			d.rotate = e;
			d.setOrientation(e);
			e = this.categoryAxis;
			if (!e.startOnAxis || e.parseDates) d.expandMinMax = !0
		}
	},
	updateData: function() {
		this.parseData();
		var a = this.countColumns(),
			b = this.chartCursor;
		b && b.updateData();
		for (var b = this.graphs, d = 0; d < b.length; d++) {
			var e = b[d];
			e.columnCount = a;
			e.data = this.chartData
		}
	},
	updateMargins: function() {
		AmCharts.AmSerialChart.base.updateMargins.call(this);
		var a = this.chartScrollbar;
		a && (this.getScrollbarPosition(a, this.rotate, this.categoryAxis.position), this.adjustMargins(a, this.rotate))
	},
	updateScrollbars: function() {
		this.updateChartScrollbar(this.chartScrollbar, this.rotate)
	},
	zoom: function(a, b) {
		var d = this.categoryAxis;
		d.parseDates && !d.equalSpacing ? this.timeZoom(a, b) : this.indexZoom(a, b);
		this.updateColumnsDepth()
	},
	timeZoom: function(a, b) {
		var d = this.maxSelectedTime;
		if (!isNaN(d) && (b != this.endTime && b - a > d && (a = b - d, this.updateScrollbar = !0), a != this.startTime && b - a > d)) b = a + d, this.updateScrollbar = !0;
		var e = this.minSelectedTime;
		if (0 < e && b - a < e) var f = Math.round(a + (b - a) / 2),
			e = Math.round(e / 2),
			a = f - e,
			b = f + e;
		var g = this.chartData,
			f = this.categoryAxis;
		if (AmCharts.ifArray(g) && (a != this.startTime || b != this.endTime)) {
			var h = f.minDuration();
			this.firstTime = e = g[0].time;
			var i = g[g.length - 1].time;
			this.lastTime = i;
			a || (a = e, isNaN(d) || (a = i - d));
			b || (b = i);
			a > i && (a = i);
			b < e && (b = e);
			a < e && (a = e);
			b > i && (b = i);
			b < a && (b = a + h);
			this.startTime = a;
			this.endTime = b;
			d = g.length - 1;
			h = this.getClosestIndex(g, "time", a, !0, 0, d);
			g = this.getClosestIndex(g, "time", b, !1, h, d);
			f.timeZoom(a, b);
			f.zoom(h, g);
			this.start = AmCharts.fitToBounds(h, 0, d);
			this.end = AmCharts.fitToBounds(g, 0, d);
			this.zoomAxesAndGraphs();
			this.zoomScrollbar();
			a != e || b != i ? this.showZB(!0) : this.showZB(!1);
			this.dispatchTimeZoomEvent()
		}
	},
	indexZoom: function(a, b) {
		var d = this.maxSelectedSeries;
		if (!isNaN(d) && (b != this.end && b - a > d && (a = b - d, this.updateScrollbar = !0), a != this.start && b - a > d)) b = a + d, this.updateScrollbar = !0;
		if (a != this.start || b != this.end) {
			var e = this.chartData.length - 1;
			isNaN(a) && (a = 0, isNaN(d) || (a = e - d));
			isNaN(b) && (b = e);
			b < a && (b = a);
			b > e && (b = e);
			a > e && (a = e - 1);
			0 > a && (a = 0);
			this.start = a;
			this.end = b;
			this.categoryAxis.zoom(a, b);
			this.zoomAxesAndGraphs();
			this.zoomScrollbar();
			0 != a || b != this.chartData.length - 1 ? this.showZB(!0) : this.showZB(!1);
			this.dispatchIndexZoomEvent()
		}
	},
	updateGraphs: function() {
		AmCharts.AmSerialChart.base.updateGraphs.call(this);
		for (var a = this.graphs, b = 0; b < a.length; b++) {
			var d = a[b];
			d.columnWidth = this.columnWidth;
			d.categoryAxis = this.categoryAxis
		}
	},
	updateColumnsDepth: function() {
		var a, b = this.graphs;
		AmCharts.remove(this.columnsSet);
		this.columnsArray = [];
		for (a = 0; a < b.length; a++) {
			var d = b[a],
				e = d.columnsArray;
			if (e) for (var f = 0; f < e.length; f++) this.columnsArray.push(e[f])
		}
		this.columnsArray.sort(this.compareDepth);
		if (0 < this.columnsArray.length) {
			b = this.container.set();
			this.columnSet.push(b);
			for (a = 0; a < this.columnsArray.length; a++) b.push(this.columnsArray[a].column.set);
			d && b.translate(d.x, d.y);
			this.columnsSet = b
		}
	},
	compareDepth: function(a, b) {
		return a.depth > b.depth ? 1 : -1
	},
	zoomScrollbar: function() {
		var a = this.chartScrollbar,
			b = this.categoryAxis;
		a && this.updateScrollbar && (b.parseDates && !b.equalSpacing ? a.timeZoom(this.startTime, this.endTime) : a.zoom(this.start, this.end), this.updateScrollbar = !0)
	},
	updateTrendLines: function() {
		for (var a = this.trendLines, b = 0; b < a.length; b++) {
			var d = a[b];
			d.chart = this;
			d.valueAxis || (d.valueAxis = this.valueAxes[0]);
			d.categoryAxis = this.categoryAxis
		}
	},
	zoomAxesAndGraphs: function() {
		if (!this.scrollbarOnly) {
			for (var a = this.valueAxes, b = 0; b < a.length; b++) a[b].zoom(this.start, this.end);
			a = this.graphs;
			for (b = 0; b < a.length; b++) a[b].zoom(this.start, this.end);
			this.zoomTrendLines();
			(b = this.chartCursor) && b.zoom(this.start, this.end, this.startTime, this.endTime)
		}
	},
	countColumns: function() {
		for (var a = 0, b = this.valueAxes.length, d = this.graphs.length, e, f, g = !1, h, i = 0; i < b; i++) {
			f = this.valueAxes[i];
			var j = f.stackType;
			if ("100%" == j || "regular" == j) {
				g = !1;
				for (h = 0; h < d; h++) e = this.graphs[h], !e.hidden && (e.valueAxis == f && "column" == e.type) && (!g && e.stackable && (a++, g = !0), e.stackable || a++, e.columnIndex = a - 1)
			}
			if ("none" == j || "3d" == j) for (h = 0; h < d; h++) e = this.graphs[h], !e.hidden && (e.valueAxis == f && "column" == e.type) && (e.columnIndex = a, a++);
			if ("3d" == j) {
				for (i = 0; i < d; i++) e = this.graphs[i], e.depthCount = a;
				a = 1
			}
		}
		return a
	},
	parseData: function() {
		AmCharts.AmSerialChart.base.parseData.call(this);
		this.parseSerialData()
	},
	getCategoryIndexByValue: function(a) {
		for (var b = this.chartData, d, e = 0; e < b.length; e++) b[e].category == a && (d = e);
		return d
	},
	handleCursorChange: function(a) {
		this.updateLegendValues(a.index)
	},
	handleCursorZoom: function(a) {
		this.updateScrollbar = !0;
		this.zoom(a.start, a.end)
	},
	handleScrollbarZoom: function(a) {
		this.updateScrollbar = !1;
		this.zoom(a.start, a.end)
	},
	dispatchTimeZoomEvent: function() {
		if (this.prevStartTime != this.startTime || this.prevEndTime != this.endTime) {
			var a = {
				type: "zoomed"
			};
			a.startDate = new Date(this.startTime);
			a.endDate = new Date(this.endTime);
			a.startIndex = this.start;
			a.endIndex = this.end;
			this.startIndex = this.start;
			this.endIndex = this.end;
			this.prevStartTime = this.startTime;
			this.prevEndTime = this.endTime;
			var b = this.categoryAxis,
				d = AmCharts.extractPeriod(b.minPeriod).period,
				b = b.dateFormatsObject[d];
			a.startValue = AmCharts.formatDate(a.startDate, b);
			a.endValue = AmCharts.formatDate(a.endDate, b);
			a.chart = this;
			a.target = this;
			this.fire(a.type, a)
		}
	},
	dispatchIndexZoomEvent: function() {
		if (this.prevStartIndex != this.start || this.prevEndIndex != this.end) {
			this.startIndex = this.start;
			this.endIndex = this.end;
			var a = this.chartData;
			if (AmCharts.ifArray(a) && !isNaN(this.start) && !isNaN(this.end)) {
				var b = {
					chart: this,
					target: this,
					type: "zoomed"
				};
				b.startIndex = this.start;
				b.endIndex = this.end;
				b.startValue = a[this.start].category;
				b.endValue = a[this.end].category;
				this.categoryAxis.parseDates && (this.startTime = a[this.start].time, this.endTime = a[this.end].time, b.startDate = new Date(this.startTime), b.endDate = new Date(this.endTime));
				this.prevStartIndex = this.start;
				this.prevEndIndex = this.end;
				this.fire(b.type, b)
			}
		}
	},
	updateLegendValues: function(a) {
		for (var b = this.graphs, d = 0; d < b.length; d++) {
			var e = b[d];
			e.currentDataItem = isNaN(a) ? void 0 : this.chartData[a].axes[e.valueAxis.id].graphs[e.id]
		}
		this.legend && this.legend.updateValues()
	},
	getClosestIndex: function(a, b, d, e, f, g) {
		0 > f && (f = 0);
		g > a.length - 1 && (g = a.length - 1);
		var h = f + Math.round((g - f) / 2),
			i = a[h][b];
		if (1 >= g - f) {
			if (e) return f;
			e = a[g][b];
			return Math.abs(a[f][b] - d) < Math.abs(e - d) ? f : g
		}
		return d == i ? h : d < i ? this.getClosestIndex(a, b, d, e, f, h) : this.getClosestIndex(a, b, d, e, h, g)
	},
	zoomToIndexes: function(a, b) {
		this.updateScrollbar = !0;
		var d = this.chartData;
		if (d) {
			var e = d.length;
			0 < e && (0 > a && (a = 0), b > e - 1 && (b = e - 1), e = this.categoryAxis, e.parseDates && !e.equalSpacing ? this.zoom(d[a].time, d[b].time) : this.zoom(a, b))
		}
	},
	zoomToDates: function(a, b) {
		this.updateScrollbar = !0;
		var d = this.chartData;
		if (this.categoryAxis.equalSpacing) {
			var e = this.getClosestIndex(d, "time", a.getTime(), !0, 0, d.length),
				d = this.getClosestIndex(d, "time", b.getTime(), !1, 0, d.length);
			this.zoom(e, d)
		} else this.zoom(a.getTime(), b.getTime())
	},
	zoomToCategoryValues: function(a, b) {
		this.updateScrollbar = !0;
		this.zoom(this.getCategoryIndexByValue(a), this.getCategoryIndexByValue(b))
	},
	formatString: function(a, b) {
		var d = b.graph;
		if (-1 != a.indexOf("[[category]]")) {
			var e = b.serialDataItem.category;
			if (this.categoryAxis.parseDates) {
				var f = this.balloonDateFormat,
					g = this.chartCursor;
				g && (f = g.categoryBalloonDateFormat); - 1 != a.indexOf("[[category]]") && (f = AmCharts.formatDate(e, f), -1 != f.indexOf("fff") && (f = AmCharts.formatMilliseconds(f, e)), e = f)
			}
			a = a.replace(/\[\[category\]\]/g, "" + e)
		}
		d = d.numberFormatter;
		d || (d = this.numberFormatter);
		e = b.graph.valueAxis;
		if ((f = e.duration) && !isNaN(b.values.value)) e = AmCharts.formatDuration(b.values.value, f, "", e.durationUnits, e.maxInterval, d), a = a.replace(RegExp("\\[\\[value\\]\\]", "g"), e);
		e = ["value", "open", "low", "high", "close"];
		f = this.percentFormatter;
		a = AmCharts.formatValue(a, b.percents, e, f, "percents.");
		a = AmCharts.formatValue(a, b.values, e, d, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
		a = AmCharts.formatValue(a, b.values, ["percents"], f); - 1 != a.indexOf("[[") && (a = AmCharts.formatDataContextValue(a, b.dataContext));
		return a = AmCharts.AmSerialChart.base.formatString.call(this, a, b)
	},
	addChartScrollbar: function(a) {
		AmCharts.callMethod("destroy", [this.chartScrollbar]);
		a && (a.chart = this, this.listenTo(a, "zoomed", this.handleScrollbarZoom));
		this.rotate ? void 0 == a.width && (a.width = a.scrollbarHeight) : void 0 == a.height && (a.height = a.scrollbarHeight);
		this.chartScrollbar = a
	},
	removeChartScrollbar: function() {
		AmCharts.callMethod("destroy", [this.chartScrollbar]);
		this.chartScrollbar = null
	},
	handleReleaseOutside: function(a) {
		AmCharts.AmSerialChart.base.handleReleaseOutside.call(this, a);
		AmCharts.callMethod("handleReleaseOutside", [this.chartScrollbar])
	}
});
AmCharts.AmRadarChart = AmCharts.Class({
	inherits: AmCharts.AmCoordinateChart,
	construct: function() {
		AmCharts.AmRadarChart.base.construct.call(this);
		this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 0;
		this.chartType = "radar";
		this.radius = "35%"
	},
	initChart: function() {
		AmCharts.AmRadarChart.base.initChart.call(this);
		this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
		this.drawChart()
	},
	updateData: function() {
		this.parseData();
		for (var a = this.graphs, b = 0; b < a.length; b++) a[b].data = this.chartData
	},
	updateGraphs: function() {
		for (var a = this.graphs, b = 0; b < a.length; b++) {
			var d = a[b];
			d.index = b;
			d.width = this.realRadius;
			d.height = this.realRadius;
			d.x = this.marginLeftReal;
			d.y = this.marginTopReal;
			d.chartType = this.chartType
		}
	},
	parseData: function() {
		AmCharts.AmRadarChart.base.parseData.call(this);
		this.parseSerialData()
	},
	updateValueAxes: function() {
		for (var a = this.valueAxes, b = 0; b < a.length; b++) {
			var d = a[b];
			d.axisRenderer = AmCharts.RadAxis;
			d.guideFillRenderer = AmCharts.RadarFill;
			d.axisItemRenderer = AmCharts.RadItem;
			d.autoGridCount = !1;
			d.x = this.marginLeftReal;
			d.y = this.marginTopReal;
			d.width = this.realRadius;
			d.height = this.realRadius
		}
	},
	drawChart: function() {
		AmCharts.AmRadarChart.base.drawChart.call(this);
		var a = this.updateWidth(),
			b = this.updateHeight(),
			d = this.marginTop + this.getTitleHeight(),
			e = this.marginLeft,
			b = b - d - this.marginBottom;
		this.marginLeftReal = e + (a - e - this.marginRight) / 2;
		this.marginTopReal = d + b / 2;
		this.realRadius = AmCharts.toCoordinate(this.radius, a, b);
		this.updateValueAxes();
		this.updateGraphs();
		a = this.chartData;
		if (AmCharts.ifArray(a)) {
			a = a.length - 1;
			e = this.valueAxes;
			for (d = 0; d < e.length; d++) e[d].zoom(0, a);
			e = this.graphs;
			for (d = 0; d < e.length; d++) e[d].zoom(0, a)
		} else this.cleanChart();
		this.chartCreated = !0;
		this.dispDUpd()
	},
	formatString: function(a, b) {
		var d = b.graph; - 1 != a.indexOf("[[category]]") && (a = a.replace(/\[\[category\]\]/g, "" + b.serialDataItem.category));
		d = d.numberFormatter;
		d || (d = this.numberFormatter);
		a = AmCharts.formatValue(a, b.values, ["value"], d, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
		return a = AmCharts.AmRadarChart.base.formatString.call(this, a, b)
	},
	cleanChart: function() {
		this.callMethod("destroy", [this.valueAxes, this.graphs])
	}
});
AmCharts.AxisBase = AmCharts.Class({
	construct: function() {
		this.viY = this.viX = this.y = this.x = this.dy = this.dx = 0;
		this.axisWidth;
		this.axisThickness = 1;
		this.axisColor = "#000000";
		this.axisAlpha = 1;
		this.gridCount = this.tickLength = 5;
		this.gridAlpha = 0.15;
		this.gridThickness = 1;
		this.gridColor = "#000000";
		this.dashLength = 0;
		this.labelFrequency = 1;
		this.showLastLabel = this.showFirstLabel = !0;
		this.fillColor = "#FFFFFF";
		this.fillAlpha = 0;
		this.labelsEnabled = !0;
		this.labelRotation = 0;
		this.autoGridCount = !0;
		this.valueRollOverColor = "#CC0000";
		this.offset = 0;
		this.guides = [];
		this.visible = !0;
		this.counter = 0;
		this.guides = [];
		this.ignoreAxisWidth = this.inside = !1;
		this.titleColor;
		this.titleFontSize;
		this.titleBold = !0
	},
	zoom: function(a, b) {
		this.start = a;
		this.end = b;
		this.dataChanged = !0;
		this.draw()
	},
	fixAxisPosition: function() {
		var a = this.position;
		"H" == this.orientation ? ("left" == a && (a = "bottom"), "right" == a && (a = "top")) : ("bottom" == a && (a = "left"), "top" == a && (a = "right"));
		this.position = a
	},
	draw: function() {
		var a = this.chart;
		void 0 == this.titleColor && (this.titleColor = a.color);
		isNaN(this.titleFontSize) && (this.titleFontSize = a.fontSize + 1);
		this.allLabels = [];
		this.counter = 0;
		this.destroy();
		this.fixAxisPosition();
		this.labels = [];
		var b = a.container,
			d = b.set();
		a.gridSet.push(d);
		this.set = d;
		b = b.set();
		a.axesLabelsSet.push(b);
		this.labelsSet = b;
		this.axisLine = new this.axisRenderer(this);
		this.autoGridCount && ("V" == this.orientation ? (a = this.height / 35, 3 > a && (a = 3)) : a = this.width / 75, this.gridCount = a);
		this.axisWidth = this.axisLine.axisWidth;
		this.addTitle()
	},
	setOrientation: function(a) {
		this.orientation = a ? "H" : "V"
	},
	addTitle: function() {
		var a = this.title;
		if (a) {
			var b = this.chart;
			this.titleLabel = AmCharts.text(b.container, a, this.titleColor, b.fontFamily, this.titleFontSize, "middle", this.titleBold)
		}
	},
	positionTitle: function() {
		var a = this.titleLabel;
		if (a) {
			var b, d, e = this.labelsSet,
				f = {};
			0 < e.length() ? f = e.getBBox() : (f.x = 0, f.y = 0, f.width = this.viW, f.height = this.viH);
			e.push(a);
			var e = f.x,
				g = f.y;
			AmCharts.VML && (this.rotate ? e -= this.x : g -= this.y);
			var h = f.width,
				f = f.height,
				i = this.viW,
				j = this.viH;
			a.getBBox();
			var k = 0,
				l = this.titleFontSize / 2,
				o = this.inside;
			switch (this.position) {
			case "top":
				b = i / 2;
				d = g - 10 - l;
				break;
			case "bottom":
				b = i / 2;
				d = g + f + 10 + l;
				break;
			case "left":
				b = e - 10 - l;
				o && (b -= 5);
				d = j / 2;
				k = -90;
				break;
			case "right":
				b = e + h + 10 + l - 3, o && (b += 7), d = j / 2, k = -90
			}
			this.marginsChanged ? (a.translate(b, d), this.tx = b, this.ty = d) : a.translate(this.tx, this.ty);
			this.marginsChanged = !1;
			0 != k && a.rotate(k)
		}
	},
	pushAxisItem: function(a) {
		var b = a.graphics();
		0 < b.length() && this.set.push(b);
		(a = a.getLabel()) && this.labelsSet.push(a)
	},
	addGuide: function(a) {
		this.guides.push(a)
	},
	removeGuide: function(a) {
		for (var b = this.guides, d = 0; d < b.length; d++) b[d] == a && b.splice(d, 1)
	},
	handleGuideOver: function(a) {
		clearTimeout(this.chart.hoverInt);
		var b = a.graphics.getBBox(),
			d = b.x + b.width / 2,
			b = b.y + b.height / 2,
			e = a.fillColor;
		void 0 == e && (e = a.lineColor);
		this.chart.showBalloon(a.balloonText, e, !0, d, b)
	},
	handleGuideOut: function() {
		this.chart.hideBalloon()
	},
	addEventListeners: function(a, b) {
		var d = this;
		a.mouseover(function() {
			d.handleGuideOver(b)
		});
		a.mouseout(function() {
			d.handleGuideOut(b)
		})
	},
	getBBox: function() {
		var a = this.labelsSet.getBBox();
		AmCharts.VML || (a = {
			x: a.x + this.x,
			y: a.y + this.y,
			width: a.width,
			height: a.height
		});
		return a
	},
	destroy: function() {
		AmCharts.remove(this.set);
		AmCharts.remove(this.labelsSet);
		var a = this.axisLine;
		a && AmCharts.remove(a.set);
		AmCharts.remove(this.grid0)
	}
});
AmCharts.ValueAxis = AmCharts.Class({
	inherits: AmCharts.AxisBase,
	construct: function() {
		this.createEvents("axisChanged", "logarithmicAxisFailed", "axisSelfZoomed", "axisZoomed");
		AmCharts.ValueAxis.base.construct.call(this);
		this.dataChanged = !0;
		this.gridCount = 8;
		this.stackType = "none";
		this.position = "left";
		this.unitPosition = "right";
		this.recalculateToPercents = this.includeHidden = this.includeGuidesInMinMax = this.integersOnly = !1;
		this.duration;
		this.durationUnits = {
			DD: "d. ",
			hh: ":",
			mm: ":",
			ss: ""
		};
		this.scrollbar = !1;
		this.maxDecCount;
		this.baseValue = 0;
		this.radarCategoriesEnabled = !0;
		this.gridType = "polygons";
		this.useScientificNotation = !1;
		this.axisTitleOffset = 10
	},
	updateData: function() {
		0 >= this.gridCount && (this.gridCount = 1);
		this.data = this.chart.chartData;
		"xy" != this.chart.chartType && (this.stackGraphs("smoothedLine"), this.stackGraphs("line"), this.stackGraphs("column"), this.stackGraphs("step"));
		this.recalculateToPercents && this.recalculate();
		this.synchronizationMultiplyer && this.synchronizeWithAxis ? this.foundGraphs = !0 : (this.foundGraphs = !1, this.getMinMax())
	},
	draw: function() {
		AmCharts.ValueAxis.base.draw.call(this);
		var a = this.chart,
			b = this.set;
		"duration" == this.type && (this.duration = "ss");
		!0 == this.dataChanged && (this.updateData(), this.dataChanged = !1);
		if (this.logarithmic && (0 >= this.getMin(0, this.data.length - 1) || 0 >= this.minimum)) this.fire("logarithmicAxisFailed", {
			type: "logarithmicAxisFailed",
			chart: a
		});
		else {
			this.grid0 = null;
			var d, e, f = a.dx,
				g = a.dy,
				h = !1,
				i = this.logarithmic,
				j = a.chartType;
			if (!isNaN(this.min) && !isNaN(this.max) && this.foundGraphs && Infinity != this.min && -Infinity != this.max) {
				var k = this.labelFrequency,
					l = this.showFirstLabel,
					o = this.showLastLabel,
					p = 1,
					m = 0,
					n = Math.round((this.max - this.min) / this.step) + 1;
				if (!0 == i) {
					var q = Math.log(this.max) * Math.LOG10E - Math.log(this.minReal) * Math.LOG10E;
					this.stepWidth = this.axisWidth / q;
					2 < q && (n = Math.ceil(Math.log(this.max) * Math.LOG10E) + 1, m = Math.round(Math.log(this.minReal) * Math.LOG10E), n > this.gridCount && (p = Math.ceil(n / this.gridCount)))
				} else this.stepWidth = this.axisWidth / (this.max - this.min);
				d = 0;
				1 > this.step && -1 < this.step && (e = this.step.toString(), d = -1 != e.indexOf("e-") ? Number(e.split("-")[1]) : e.split(".")[1].length);
				this.integersOnly && (d = 0);
				d > this.maxDecCount && (d = this.maxDecCount);
				isNaN(this.precision) || (d = this.precision);
				this.max = AmCharts.roundTo(this.max, this.maxDecCount);
				this.min = AmCharts.roundTo(this.min, this.maxDecCount);
				var r = {};
				r.precision = d;
				r.decimalSeparator = a.numberFormatter.decimalSeparator;
				r.thousandsSeparator = a.numberFormatter.thousandsSeparator;
				this.numberFormatter = r;
				var s = this.guides,
					t = s.length;
				if (0 < t) {
					var w = this.fillAlpha;
					for (e = this.fillAlpha = 0; e < t; e++) {
						var x = s[e],
							C = NaN;
						if (!isNaN(x.toValue)) {
							var C = this.getCoordinate(x.toValue),
								u = new this.axisItemRenderer(this, C, "", !0, NaN, NaN, x);
							this.pushAxisItem(u)
						}
						var A = NaN;
						isNaN(x.value) || (A = this.getCoordinate(x.value), u = new this.axisItemRenderer(this, A, x.label, !0, NaN, (C - A) / 2, x), this.pushAxisItem(u));
						isNaN(C - A) || (u = new this.guideFillRenderer(this, A, C, x), this.pushAxisItem(u), u = u.graphics(), x.graphics = u, x.balloonText && this.addEventListeners(u, x))
					}
					this.fillAlpha = w
				}
				s = !1;
				for (e = m; e < n; e += p) u = AmCharts.roundTo(this.step * e + this.min, d), -1 != ("" + u).indexOf("e") && (s = !0, ("" + u).split("e"));
				this.duration && (this.maxInterval = AmCharts.getMaxInterval(this.max, this.duration));
				for (e = m; e < n; e += p) if (m = this.step * e + this.min, m = AmCharts.roundTo(m, this.maxDecCount + 1), !(this.integersOnly && Math.round(m) != m)) {
					!0 == i && (0 == m && (m = this.minReal), 2 < q && (m = Math.pow(10, e)), s = -1 != ("" + m).indexOf("e") ? !0 : !1);
					this.useScientificNotation && (s = !0);
					this.usePrefixes && (s = !1);
					s ? (u = -1 == ("" + m).indexOf("e") ? m.toExponential(15) : "" + m, u = u.split("e"), d = Number(u[0]), u = Number(u[1]), 10 == d && (d = 1, u += 1), u = d + "e" + u, 0 == m && (u = "0"), 1 == m && (u = "1")) : (i && (d = ("" + m).split("."), r.precision = d[1] ? d[1].length : -1), u = this.usePrefixes ? AmCharts.addPrefix(m, a.prefixesOfBigNumbers, a.prefixesOfSmallNumbers, r) : AmCharts.formatNumber(m, r, r.precision));
					this.duration && (u = AmCharts.formatDuration(m, this.duration, "", this.durationUnits, this.maxInterval, r));
					this.recalculateToPercents ? u += "%" : (d = this.unit) && (u = "left" == this.unitPosition ? d + u : u + d);
					Math.round(e / k) != e / k && (u = void 0);
					if (0 == e && !l || e == n - 1 && !o) u = " ";
					d = this.getCoordinate(m);
					u = new this.axisItemRenderer(this, d, u);
					this.pushAxisItem(u);
					if (m == this.baseValue && "radar" != j) {
						var N, D, t = this.viW,
							w = this.viH,
							m = this.viX,
							u = this.viY;
						"H" == this.orientation ? 0 <= d && d <= t + 1 && (N = [d, d, d + f], D = [w, 0, g]) : 0 <= d && d <= w + 1 && (N = [0, t, t + f], D = [d, d, d + g]);
						N && (d = AmCharts.fitToBounds(2 * this.gridAlpha, 0, 1), d = AmCharts.line(a.container, N, D, this.gridColor, d, 1, this.dashLength), d.translate(m, u), this.grid0 = d, a.axesSet.push(d), d.toBack())
					}
				}
				f = this.baseValue;
				this.min > this.baseValue && this.max > this.baseValue && (f = this.min);
				this.min < this.baseValue && this.max < this.baseValue && (f = this.max);
				i && f < this.minReal && (f = this.minReal);
				this.baseCoord = this.getCoordinate(f);
				a = {
					type: "axisChanged",
					target: this,
					chart: a
				};
				a.min = i ? this.minReal : this.min;
				a.max = this.max;
				this.fire("axisChanged", a);
				this.axisCreated = !0
			} else h = !0;
			i = this.axisLine.set;
			a = this.labelsSet;
			this.positionTitle();
			"radar" != j ? (j = this.viX, f = this.viY, b.translate(j, f), a.translate(j, f)) : i.toFront();
			!this.visible || h ? (b.hide(), i.hide(), a.hide()) : (b.show(), i.show(), a.show())
		}
	},
	stackGraphs: function(a) {
		var b = this.stackType;
		"stacked" == b && (b = "regular");
		"line" == b && (b = "none");
		"100% stacked" == b && (b = "100%");
		this.stackType = b;
		var d = [],
			e = [],
			f = [],
			g = [],
			h, i = this.chart.graphs,
			j, k, l, o = this.baseValue;
		if (("line" == a || "step" == a || "smoothedLine" == a) && ("regular" == b || "100%" == b)) for (l = 0; l < i.length; l++) h = i[l], h.hidden || (k = h.type, h.chart == this.chart && (h.valueAxis == this && a == k && h.stackable) && (j && (h.stackGraph = j), j = h));
		for (j = this.start; j <= this.end; j++) for (l = 0; l < i.length; l++) if (h = i[l], !h.hidden && (k = h.type, h.chart == this.chart && (h.valueAxis == this && a == k && h.stackable) && (k = this.data[j].axes[this.id].graphs[h.id], h = k.values.value, !isNaN(h) && (g[j] = isNaN(g[j]) ? Math.abs(h) : g[j] + Math.abs(h), "regular" == b)))) {
			if ("line" == a || "step" == a || "smoothedLine" == a) isNaN(d[j]) ? (d[j] = h, k.values.close = h, k.values.open = this.baseValue) : (k.values.close = isNaN(h) ? d[j] : h + d[j], k.values.open = d[j], d[j] = k.values.close);
			"column" == a && !isNaN(h) && (k.values.close = h, 0 > h ? (k.values.close = h, isNaN(e[j]) ? k.values.open = o : (k.values.close += e[j], k.values.open = e[j]), e[j] = k.values.close) : (k.values.close = h, isNaN(f[j]) ? k.values.open = o : (k.values.close += f[j], k.values.open = f[j]), f[j] = k.values.close))
		}
		for (j = this.start; j <= this.end; j++) for (l = 0; l < i.length; l++) h = i[l], h.hidden || (k = h.type, h.chart == this.chart && (h.valueAxis == this && a == k && h.stackable) && (k = this.data[j].axes[this.id].graphs[h.id], h = k.values.value, isNaN(h) || (d = 100 * (h / g[j]), k.values.percents = d, k.values.total = g[j], "100%" == b && (isNaN(e[j]) && (e[j] = 0), isNaN(f[j]) && (f[j] = 0), 0 > d ? (k.values.close = d + e[j], k.values.open = e[j], e[j] = k.values.close) : (k.values.close = d + f[j], k.values.open = f[j], f[j] = k.values.close)))))
	},
	recalculate: function() {
		for (var a = this.chart.graphs, b = 0; b < a.length; b++) {
			var d = a[b];
			if (d.valueAxis == this) {
				var e = "value";
				if ("candlestick" == d.type || "ohlc" == d.type) e = "open";
				var f, g, h = this.end + 2,
					h = AmCharts.fitToBounds(this.end + 1, 0, this.data.length - 1),
					i = this.start;
				0 < i && i--;
				for (var j = this.start; j <= h && !(g = this.data[j].axes[this.id].graphs[d.id], f = g.values[e], !isNaN(f)); j++);
				for (e = i; e <= h; e++) {
					g = this.data[e].axes[this.id].graphs[d.id];
					g.percents = {};
					var i = g.values,
						k;
					for (k in i) g.percents[k] = "percents" != k ? 100 * (i[k] / f) - 100 : i[k]
				}
			}
		}
	},
	getMinMax: function() {
		for (var a = !1, b = this.chart, d = b.graphs, e = 0; e < d.length; e++) {
			var f = d[e].type;
			if ("line" == f || "step" == f || "smoothedLine" == f) this.expandMinMax && (a = !0)
		}
		a && (0 < this.start && this.start--, this.end < this.data.length - 1 && this.end++);
		"serial" == b.chartType && !0 == b.categoryAxis.parseDates && !a && this.end < this.data.length - 1 && this.end++;
		this.min = this.getMin(this.start, this.end);
		this.max = this.getMax();
		a = this.guides.length;
		if (this.includeGuidesInMinMax && 0 < a) for (b = 0; b < a; b++) if (d = this.guides[b], d.toValue < this.min && (this.min = d.toValue), d.value < this.min && (this.min = d.value), d.toValue > this.max && (this.max = d.toValue), d.value > this.max) this.max = d.value;
		isNaN(this.minimum) || (this.min = this.minimum);
		isNaN(this.maximum) || (this.max = this.maximum);
		this.min > this.max && (a = this.max, this.max = this.min, this.min = a);
		isNaN(this.minTemp) || (this.min = this.minTemp);
		isNaN(this.maxTemp) || (this.max = this.maxTemp);
		this.minReal = this.min;
		this.maxReal = this.max;
		0 == this.min && 0 == this.max && (this.max = 9);
		this.min > this.max && (this.min = this.max - 1);
		a = this.min;
		b = this.max;
		d = this.max - this.min;
		e = 0 == d ? Math.pow(10, Math.floor(Math.log(Math.abs(this.max)) * Math.LOG10E)) / 10 : Math.pow(10, Math.floor(Math.log(Math.abs(d)) * Math.LOG10E)) / 10;
		isNaN(this.maximum) && isNaN(this.maxTemp) && (this.max = Math.ceil(this.max / e) * e + e);
		isNaN(this.minimum) && isNaN(this.minTemp) && (this.min = Math.floor(this.min / e) * e - e);
		0 > this.min && 0 <= a && (this.min = 0);
		0 < this.max && 0 >= b && (this.max = 0);
		"100%" == this.stackType && (this.min = 0 > this.min ? -100 : 0, this.max = 0 > this.max ? 0 : 100);
		d = this.max - this.min;
		e = Math.pow(10, Math.floor(Math.log(Math.abs(d)) * Math.LOG10E)) / 10;
		this.step = Math.ceil(d / this.gridCount / e) * e;
		d = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E));
		d = d.toExponential(0).split("e");
		e = Number(d[1]);
		9 == Number(d[0]) && e++;
		d = this.generateNumber(1, e);
		e = Math.ceil(this.step / d);
		5 < e && (e = 10);
		5 >= e && 2 < e && (e = 5);
		this.step = Math.ceil(this.step / (d * e)) * d * e;
		1 > d ? (this.maxDecCount = Math.abs(Math.log(Math.abs(d)) * Math.LOG10E), this.maxDecCount = Math.round(this.maxDecCount), this.step = AmCharts.roundTo(this.step, this.maxDecCount + 1)) : this.maxDecCount = 0;
		this.min = this.step * Math.floor(this.min / this.step);
		this.max = this.step * Math.ceil(this.max / this.step);
		0 > this.min && 0 <= a && (this.min = 0);
		0 < this.max && 0 >= b && (this.max = 0);
		1 < this.minReal && 1 < this.max - this.minReal && (this.minReal = Math.floor(this.minReal));
		d = Math.pow(10, Math.floor(Math.log(Math.abs(this.minReal)) * Math.LOG10E));
		0 == this.min && (this.minReal = d);
		0 == this.min && 1 < this.minReal && (this.minReal = 1);
		0 < this.min && 0 < this.minReal - this.step && (this.minReal = this.min + this.step < this.minReal ? this.min + this.step : this.min);
		d = Math.log(b) * Math.LOG10E - Math.log(a) * Math.LOG10E;
		this.logarithmic && (2 < d ? (this.minReal = this.min = Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)), this.max = Math.pow(10, Math.ceil(Math.log(Math.abs(b)) * Math.LOG10E))) : (b = Math.pow(10, Math.floor(Math.log(Math.abs(this.min)) * Math.LOG10E)) / 10, a = Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)) / 10, b < a && (this.minReal = this.min = 10 * a)))
	},
	generateNumber: function(a, b) {
		var d = "",
			e;
		e = 0 > b ? Math.abs(b) - 1 : Math.abs(b);
		for (var f = 0; f < e; f++) d += "0";
		return 0 > b ? Number("0." + d + ("" + a)) : Number("" + a + d)
	},
	getMin: function(a, b) {
		for (var d, e = a; e <= b; e++) {
			var f = this.data[e].axes[this.id].graphs,
				g;
			for (g in f) {
				var h = this.chart.getGraphById(g);
				if (h.includeInMinMax && (!h.hidden || this.includeHidden)) {
					isNaN(d) && (d = Infinity);
					this.foundGraphs = !0;
					h = f[g].values;
					this.recalculateToPercents && (h = f[g].percents);
					var i;
					if (this.minMaxField) i = h[this.minMaxField], i < d && (d = i);
					else for (var j in h)"percents" != j && "total" != j && (i = h[j], i < d && (d = i))
				}
			}
		}
		return d
	},
	getMax: function() {
		for (var a, b = this.start; b <= this.end; b++) {
			var d = this.data[b].axes[this.id].graphs,
				e;
			for (e in d) {
				var f = this.chart.getGraphById(e);
				if (f.includeInMinMax && (!f.hidden || this.includeHidden)) {
					isNaN(a) && (a = -Infinity);
					this.foundGraphs = !0;
					f = d[e].values;
					this.recalculateToPercents && (f = d[e].percents);
					var g;
					if (this.minMaxField) g = f[this.minMaxField], g > a && (a = g);
					else for (var h in f)"percents" != h && "total" != h && (g = f[h], g > a && (a = g))
				}
			}
		}
		return a
	},
	dispatchZoomEvent: function(a, b) {
		var d = {
			type: "axisZoomed",
			startValue: a,
			endValue: b,
			target: this,
			chart: this.chart
		};
		this.fire(d.type, d)
	},
	zoomToValues: function(a, b) {
		if (b < a) var d = b,
			b = a,
			a = d;
		a < this.min && (a = this.min);
		b > this.max && (b = this.max);
		d = {
			type: "axisSelfZoomed"
		};
		d.chart = this.chart;
		d.valueAxis = this;
		d.multiplyer = this.axisWidth / Math.abs(this.getCoordinate(b) - this.getCoordinate(a));
		d.position = "V" == this.orientation ? this.reversed ? this.getCoordinate(a) - this.y : this.getCoordinate(b) - this.y : this.reversed ? this.getCoordinate(b) - this.x : this.getCoordinate(a) - this.x;
		this.fire(d.type, d)
	},
	coordinateToValue: function(a) {
		if (isNaN(a)) return NaN;
		var b = this.axisWidth,
			d = this.stepWidth,
			e = this.reversed,
			f = this.rotate,
			g = this.min,
			h = this.minReal;
		return !0 == this.logarithmic ? Math.pow(10, (f ? !0 == e ? (b - a) / d : a / d : !0 == e ? a / d : (b - a) / d) + Math.log(h) * Math.LOG10E) : !0 == e ? f ? g - (a - b) / d : a / d + g : f ? a / d + g : g - (a - b) / d
	},
	getCoordinate: function(a) {
		if (isNaN(a)) return NaN;
		var b = this.rotate,
			d = this.reversed,
			e = this.axisWidth,
			f = this.stepWidth,
			g = this.min,
			h = this.minReal;
		!0 == this.logarithmic ? (a = Math.log(a) * Math.LOG10E - Math.log(h) * Math.LOG10E, b = b ? !0 == d ? e - f * a : f * a : !0 == d ? f * a : e - f * a) : b = !0 == d ? b ? e - f * (a - g) : f * (a - g) : b ? f * (a - g) : e - f * (a - g);
		b = this.rotate ? b + (this.x - this.viX) : b + (this.y - this.viY);
		return Math.round(b)
	},
	synchronizeWithAxis: function(a) {
		this.synchronizeWithAxis = a;
		this.removeListener(this.synchronizeWithAxis, "axisChanged", this.handleSynchronization);
		this.listenTo(this.synchronizeWithAxis, "axisChanged", this.handleSynchronization)
	},
	handleSynchronization: function() {
		var a = this.synchronizeWithAxis,
			b = a.min,
			d = a.max,
			a = a.step,
			e = this.synchronizationMultiplyer;
		e && (this.min = b * e, this.max = d * e, this.step = a * e, b = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E)), b = Math.abs(Math.log(Math.abs(b)) * Math.LOG10E), this.maxDecCount = b = Math.round(b), this.draw())
	}
});
AmCharts.CategoryAxis = AmCharts.Class({
	inherits: AmCharts.AxisBase,
	construct: function() {
		AmCharts.CategoryAxis.base.construct.call(this);
		this.minPeriod = "DD";
		this.equalSpacing = this.parseDates = !1;
		this.position = "bottom";
		this.startOnAxis = !1;
		this.firstDayOfWeek = 1;
		this.gridPosition = "middle";
		this.boldPeriodBeginning = !0;
		this.periods = [{
			period: "ss",
			count: 1
		}, {
			period: "ss",
			count: 5
		}, {
			period: "ss",
			count: 10
		}, {
			period: "ss",
			count: 30
		}, {
			period: "mm",
			count: 1
		}, {
			period: "mm",
			count: 5
		}, {
			period: "mm",
			count: 10
		}, {
			period: "mm",
			count: 30
		}, {
			period: "hh",
			count: 1
		}, {
			period: "hh",
			count: 3
		}, {
			period: "hh",
			count: 6
		}, {
			period: "hh",
			count: 12
		}, {
			period: "DD",
			count: 1
		}, {
			period: "WW",
			count: 1
		}, {
			period: "MM",
			count: 1
		}, {
			period: "MM",
			count: 2
		}, {
			period: "MM",
			count: 3
		}, {
			period: "MM",
			count: 6
		}, {
			period: "YYYY",
			count: 1
		}, {
			period: "YYYY",
			count: 2
		}, {
			period: "YYYY",
			count: 5
		}, {
			period: "YYYY",
			count: 10
		}, {
			period: "YYYY",
			count: 50
		}, {
			period: "YYYY",
			count: 100
		}];
		this.dateFormats = [{
			period: "fff",
			format: "JJ:NN:SS"
		}, {
			period: "ss",
			format: "JJ:NN:SS"
		}, {
			period: "mm",
			format: "JJ:NN"
		}, {
			period: "hh",
			format: "JJ:NN"
		}, {
			period: "DD",
			format: "MMM DD"
		}, {
			period: "WW",
			format: "MMM DD"
		}, {
			period: "MM",
			format: "MMM"
		}, {
			period: "YYYY",
			format: "YYYY"
		}];
		this.nextPeriod = {};
		this.nextPeriod.fff = "ss";
		this.nextPeriod.ss = "mm";
		this.nextPeriod.mm = "hh";
		this.nextPeriod.hh = "DD";
		this.nextPeriod.DD = "MM";
		this.nextPeriod.MM = "YYYY"
	},
	draw: function() {
		AmCharts.CategoryAxis.base.draw.call(this);
		this.generateDFObject();
		var a = this.chart.chartData;
		this.data = a;
		if (AmCharts.ifArray(a)) {
			var b = this.chart,
				d = this.start,
				e = this.labelFrequency,
				f = 0,
				g = this.end - d + 1,
				h = this.gridCount,
				i = this.showFirstLabel,
				j = this.showLastLabel,
				k, l = "",
				l = AmCharts.extractPeriod(this.minPeriod);
			k = AmCharts.getPeriodDuration(l.period, l.count);
			var o, p, m, n, q;
			o = this.rotate;
			var r = this.firstDayOfWeek,
				a = AmCharts.resetDateToMin(new Date(a[a.length - 1].time + 1.05 * k), this.minPeriod, 1, r).getTime();
			this.endTime > a && (this.endTime = a);
			if (this.parseDates && !this.equalSpacing) {
				if (this.timeDifference = this.endTime - this.startTime, d = this.choosePeriod(0), e = d.period, o = d.count, p = AmCharts.getPeriodDuration(e, o), p < k && (e = l.period, o = l.count, p = k), a = e, "WW" == a && (a = "DD"), this.stepWidth = this.getStepWidth(this.timeDifference), h = Math.ceil(this.timeDifference / p) + 1, l = AmCharts.resetDateToMin(new Date(this.startTime - p), e, o, r).getTime(), a == e && 1 == o && (m = p * this.stepWidth), this.cellWidth = k * this.stepWidth, g = Math.round(l / p), d = -1, g / 2 == Math.round(g / 2) && (d = -2, l -= p), 0 < this.gridCount) for (g = d; g <= h; g++) {
					n = l + 1.5 * p;
					n = AmCharts.resetDateToMin(new Date(n), e, o, r).getTime();
					k = (n - this.startTime) * this.stepWidth;
					q = !1;
					this.nextPeriod[a] && (q = this.checkPeriodChange(this.nextPeriod[a], 1, n, l));
					var s = !1;
					q ? (l = this.dateFormatsObject[this.nextPeriod[a]], s = !0) : l = this.dateFormatsObject[a];
					this.boldPeriodBeginning || (s = !1);
					l = AmCharts.formatDate(new Date(n), l);
					if (g == d && !i || g == h && !j) l = " ";
					k = new this.axisItemRenderer(this, k, l, !1, m, 0, !1, s);
					this.pushAxisItem(k);
					l = n
				}
			} else if (this.parseDates) {
				if (this.parseDates && this.equalSpacing) {
					f = this.start;
					this.startTime = this.data[this.start].time;
					this.endTime = this.data[this.end].time;
					this.timeDifference = this.endTime - this.startTime;
					d = this.choosePeriod(0);
					e = d.period;
					o = d.count;
					p = AmCharts.getPeriodDuration(e, o);
					p < k && (e = l.period, o = l.count, p = k);
					a = e;
					"WW" == a && (a = "DD");
					this.stepWidth = this.getStepWidth(g);
					h = Math.ceil(this.timeDifference / p) + 1;
					l = AmCharts.resetDateToMin(new Date(this.startTime - p), e, o, r).getTime();
					this.cellWidth = this.getStepWidth(g);
					g = Math.round(l / p);
					d = -1;
					g / 2 == Math.round(g / 2) && (d = -2, l -= p);
					g = this.start;
					g / 2 == Math.round(g / 2) && g--;
					0 > g && (g = 0);
					m = this.end + 2;
					m >= this.data.length && (m = this.data.length);
					r = !1;
					for (this.end - this.start > this.gridCount && (r = !0); g < m; g++) if (n = this.data[g].time, this.checkPeriodChange(e, o, n, l)) {
						k = this.getCoordinate(g - this.start);
						q = !1;
						this.nextPeriod[a] && (q = this.checkPeriodChange(this.nextPeriod[a], 1, n, l));
						s = !1;
						q ? (l = this.dateFormatsObject[this.nextPeriod[a]], s = !0) : l = this.dateFormatsObject[a];
						l = AmCharts.formatDate(new Date(n), l);
						if (g == d && !i || g == h && !j) l = " ";
						r ? r = !1 : (k = new this.axisItemRenderer(this, k, l, void 0, void 0, void 0, void 0, s), k.graphics(), this.pushAxisItem(k));
						l = n
					}
				}
			} else if (this.cellWidth = this.getStepWidth(g), g < h && (h = g), f += this.start, this.stepWidth = this.getStepWidth(g), 0 < h) {
				h = Math.floor(g / h);
				g = f;
				g / 2 == Math.round(g / 2) && g--;
				0 > g && (g = 0);
				for (m = 0; g <= this.end + 2; g += h) {
					m++;
					l = 0 <= g && g < this.data.length ? this.data[g].category : "";
					k = this.getCoordinate(g - f);
					r = 0;
					"start" == this.gridPosition && (k -= this.cellWidth / 2, r = this.cellWidth / 2);
					if (g == d && !i || g == this.end && !j) l = " ";
					Math.round(m / e) != m / e && (l = " ");
					a = this.cellWidth;
					o && (a = NaN);
					k = new this.axisItemRenderer(this, k, l, !0, a, r, void 0, !1, r);
					this.pushAxisItem(k)
				}
			}
			for (g = 0; g < this.data.length; g++) if (i = this.data[g]) j = this.parseDates && !this.equalSpacing ? Math.round((i.time - this.startTime) * this.stepWidth + this.cellWidth / 2) : this.getCoordinate(g - f), i.x[this.id] = j
		}
		i = this.guides.length;
		for (g = 0; g < i; g++) j = this.guides[g], m = h = d = NaN, j.toCategory && (m = b.getCategoryIndexByValue(j.toCategory), isNaN(m) || (d = this.getCoordinate(m - f), k = new this.axisItemRenderer(this, d, "", !0, NaN, NaN, j), this.pushAxisItem(k))), j.category && (m = b.getCategoryIndexByValue(j.category), isNaN(m) || (h = this.getCoordinate(m - f), m = (d - h) / 2, k = new this.axisItemRenderer(this, h, j.label, !0, NaN, m, j), this.pushAxisItem(k))), j.toDate && (this.equalSpacing ? (m = b.getClosestIndex(this.data, "time", j.toDate.getTime(), !1, 0, this.data.length - 1), isNaN(m) || (d = this.getCoordinate(m - f))) : d = (j.toDate.getTime() - this.startTime) * this.stepWidth, k = new this.axisItemRenderer(this, d, "", !0, NaN, NaN, j), this.pushAxisItem(k)), j.date && (this.equalSpacing ? (m = b.getClosestIndex(this.data, "time", j.date.getTime(), !1, 0, this.data.length - 1), isNaN(m) || (h = this.getCoordinate(m - f))) : h = (j.date.getTime() - this.startTime) * this.stepWidth, m = (d - h) / 2, k = "H" == this.orientation ? new this.axisItemRenderer(this, h, j.label, !1, 2 * m, NaN, j) : new this.axisItemRenderer(this, h, j.label, !1, NaN, m, j), this.pushAxisItem(k)), d = new this.guideFillRenderer(this, h, d, j), h = d.graphics(), this.pushAxisItem(d), j.graphics = h, h.index = g, j.balloonText && this.addEventListeners(h, j);
		this.axisCreated = !0;
		b = this.x;
		f = this.y;
		this.set.translate(b, f);
		this.labelsSet.translate(b, f);
		this.positionTitle();
		(b = this.axisLine.set) && b.toFront()
	},
	choosePeriod: function(a) {
		var b = AmCharts.getPeriodDuration(this.periods[a].period, this.periods[a].count);
		return Math.ceil(this.timeDifference / b) <= this.gridCount ? this.periods[a] : a + 1 < this.periods.length ? this.choosePeriod(a + 1) : this.periods[a]
	},
	getStepWidth: function(a) {
		var b;
		this.startOnAxis ? (b = this.axisWidth / (a - 1), 1 == a && (b = this.axisWidth)) : b = this.axisWidth / a;
		return b
	},
	getCoordinate: function(a) {
		a *= this.stepWidth;
		this.startOnAxis || (a += this.stepWidth / 2);
		return Math.round(a)
	},
	timeZoom: function(a, b) {
		this.startTime = a;
		this.endTime = b + this.minDuration()
	},
	minDuration: function() {
		var a = AmCharts.extractPeriod(this.minPeriod);
		return AmCharts.getPeriodDuration(a.period, a.count)
	},
	checkPeriodChange: function(a, b, d, e) {
		var e = new Date(e),
			f = this.firstDayOfWeek,
			d = AmCharts.resetDateToMin(new Date(d), a, b, f).getTime(),
			a = AmCharts.resetDateToMin(e, a, b, f).getTime();
		return d != a ? !0 : !1
	},
	generateDFObject: function() {
		this.dateFormatsObject = {};
		for (var a = 0; a < this.dateFormats.length; a++) {
			var b = this.dateFormats[a];
			this.dateFormatsObject[b.period] = b.format
		}
	},
	xToIndex: function(a) {
		var b = this.data,
			d = this.chart,
			e = d.rotate,
			f = this.stepWidth;
		this.parseDates && !this.equalSpacing ? (a = this.startTime + Math.round(a / f) - this.minDuration() / 2, d = d.getClosestIndex(b, "time", a, !1, this.start, this.end + 1)) : (this.startOnAxis || (a -= f / 2), d = this.start + Math.round(a / f));
		var d = AmCharts.fitToBounds(d, 0, b.length - 1),
			g;
		b[d] && (g = b[d].x[this.id]);
		e ? g > this.height + 1 && d-- : g > this.width + 1 && d--;
		0 > g && d++;
		return d = AmCharts.fitToBounds(d, 0, b.length - 1)
	},
	dateToCoordinate: function(a) {
		return this.parseDates && !this.equalSpacing ? (a.getTime() - this.startTime) * this.stepWidth : this.parseDates && this.equalSpacing ? this.getCoordinate(this.chart.getClosestIndex(this.data, "time", a.getTime(), !1, 0, this.data.length - 1) - this.start) : NaN
	},
	categoryToCoordinate: function(a) {
		return this.chart ? this.getCoordinate(this.chart.getCategoryIndexByValue(a) - this.start) : NaN
	},
	coordinateToDate: function(a) {
		return this.equalSpacing ? (a = this.xToIndex(a), new Date(this.data[a].time)) : new Date(this.startTime + a / this.stepWidth)
	}
});
AmCharts.RecAxis = AmCharts.Class({
	construct: function(a) {
		var b = a.chart,
			d = a.axisThickness,
			e = a.axisColor,
			f = a.axisAlpha,
			g = a.offset,
			h = a.dx,
			i = a.dy,
			j = a.viX,
			k = a.viY,
			l = a.viH,
			o = a.viW,
			p = b.container;
		"H" == a.orientation ? (e = AmCharts.line(p, [0, o], [0, 0], e, f, d), this.axisWidth = a.width, "bottom" == a.position ? (a = d / 2 + g + l + k - 1, d = j) : (a = -d / 2 - g + k + i, d = h + j)) : (this.axisWidth = a.height, "right" == a.position ? (e = AmCharts.line(p, [0, 0, -h], [0, l, l - i], e, f, d), a = k + i, d = d / 2 + g + h + o + j - 1) : (e = AmCharts.line(p, [0, 0], [0, l], e, f, d), a = k, d = -d / 2 - g + j));
		e.translate(d, a);
		b.axesSet.push(e);
		this.set = e
	}
});
AmCharts.RecItem = AmCharts.Class({
	construct: function(a, b, d, e, f, g, h, i, j) {
		b = Math.round(b);
		void 0 == d && (d = "");
		j || (j = 0);
		void 0 == e && (e = !0);
		var k = a.chart.fontFamily,
			l = a.fontSize;
		void 0 == l && (l = a.chart.fontSize);
		var o = a.color;
		void 0 == o && (o = a.chart.color);
		var p = a.chart.container,
			m = p.set();
		this.set = m;
		var n = a.axisThickness,
			q = a.axisColor,
			r = a.axisAlpha,
			s = a.tickLength,
			t = a.gridAlpha,
			w = a.gridThickness,
			x = a.gridColor,
			C = a.dashLength,
			u = a.fillColor,
			A = a.fillAlpha,
			N = a.labelsEnabled,
			D = a.labelRotation,
			T = a.counter,
			I = a.inside,
			K = a.dx,
			E = a.dy,
			U = a.orientation,
			J = a.position,
			P = a.previousCoord,
			da = a.viH,
			$ = a.viW,
			aa = a.offset,
			ba, L;
		if (h) {
			if (N = !0, isNaN(h.tickLength) || (s = h.tickLength), void 0 != h.lineColor && (x = h.lineColor), isNaN(h.lineAlpha) || (t = h.lineAlpha), isNaN(h.dashLength) || (C = h.dashLength), isNaN(h.lineThickness) || (w = h.lineThickness), !0 == h.inside && (I = !0), !isNaN(h.labelRotation)) D = h.labelRotation
		} else d || (t /= 3, s /= 2);
		L = "start";
		f && (L = "middle");
		var Q = D * Math.PI / 180,
			ga, B = 0,
			v = 0,
			ea = 0,
			ca = ga = 0;
		"V" == U && (D = 0);
		if (N) var R = AmCharts.text(p, d, o, k, l, L, i),
			ca = R.getBBox().width;
		if ("H" == U) {
			if (0 <= b && b <= $ + 1 && (0 < s && (0 < r && b + j <= $ + 1) && (ba = AmCharts.line(p, [b + j, b + j], [0, s], q, r, w), m.push(ba)), 0 < t)) L = AmCharts.line(p, [b, b + K, b + K], [da, da + E, E], x, t, w, C), m.push(L);
			v = 0;
			B = b;
			h && 90 == D && (B -= l);
			!1 == e ? (L = "start", v = "bottom" == J ? I ? v + s : v - s : I ? v - s : v + s, B += 3, f && (B += f / 2, L = "middle"), 0 < D && (L = "middle")) : L = "middle";
			1 == T && (0 < A && !h && P < $) && (e = AmCharts.fitToBounds(b, 0, $), P = AmCharts.fitToBounds(P, 0, $), ga = e - P, 0 < ga && (fill = AmCharts.rect(p, ga, a.height, u, A), fill.translate(e - ga + K, E), m.push(fill)));
			"bottom" == J ? (v += da + l / 2 + aa, I ? 0 < D ? (v = da - ca / 2 * Math.sin(Q) - s - 3, B += ca / 2 * Math.cos(Q)) : v -= s + l + 3 + 3 : 0 < D ? (v = da + ca / 2 * Math.sin(Q) + s + 3, B -= ca / 2 * Math.cos(Q)) : v += s + n + 3 + 3) : (v += E + l / 2 - aa, B += K, I ? 0 < D ? (v = ca / 2 * Math.sin(Q) + s + 3, B -= ca / 2 * Math.cos(Q)) : v += s + 3 : 0 < D ? (v = -(ca / 2) * Math.sin(Q) - s - 6, B += ca / 2 * Math.cos(Q)) : v -= s + l + 3 + n + 3);
			"bottom" == J ? ga = (I ? da - s - 1 : da + n - 1) + aa : (ea = K, ga = (I ? E : E - s - n + 1) - aa);
			g && (B += g);
			E = B;
			0 < D && (E += ca / 2 * Math.cos(Q));
			if (R && (J = 0, I && (J = ca * Math.cos(Q)), E + J > $ + 1 || 0 > E)) R.remove(), R = null
		} else {
			if (0 <= b && b <= da + 1 && (0 < s && (0 < r && b + j <= da + 1) && (ba = AmCharts.line(p, [0, s], [b + j, b + j], q, r, w), m.push(ba)), 0 < t)) L = AmCharts.line(p, [0, K, $ + K], [b, b + E, b + E], x, t, w, C), m.push(L);
			L = "end";
			if (!0 == I && "left" == J || !1 == I && "right" == J) L = "start";
			v = b - l / 2;
			1 == T && (0 < A && !h) && (e = AmCharts.fitToBounds(b, 0, da), P = AmCharts.fitToBounds(P, 0, da), Q = e - P, fill = AmCharts.polygon(p, [0, a.width, a.width, 0], [0, 0, Q, Q], u, A), fill.translate(K, e - Q + E), m.push(fill));
			v += l / 2;
			"right" == J ? (B += K + $ + aa, v += E, I ? (B -= s + 4, g || (v -= l / 2 + 3)) : (B += s + 4 + n, v -= 2)) : I ? (B += s + 4 - aa, g || (v -= l / 2 + 3), h && (B += K, v += E)) : (B += -s - n - 4 - 2 - aa, v -= 2);
			ba && ("right" == J ? (ea += K + aa + $, ga += E, ea = I ? ea - n : ea + n) : (ea -= aa, I || (ea -= s + n)));
			g && (v += g);
			I = -3;
			"right" == J && (I += E);
			if (R && (v > da + 1 || v < I)) R.remove(), R = null
		}
		ba && ba.translate(ea, ga);
		!1 == a.visible && (ba && ba.remove(), R && (R.remove(), R = null));
		R && (R.attr({
			"text-anchor": L
		}), R.translate(B, v), 0 != D && R.rotate(-D), a.allLabels.push(R), " " != d && (this.label = R));
		a.counter = 0 == T ? 1 : 0;
		a.previousCoord = b;
		0 == this.set.node.childNodes.length && this.set.remove()
	},
	graphics: function() {
		return this.set
	},
	getLabel: function() {
		return this.label
	}
});
AmCharts.RecFill = AmCharts.Class({
	construct: function(a, b, d, e) {
		var f = a.dx,
			g = a.dy,
			h = a.orientation,
			i = 0;
		if (d < b) var j = b,
			b = d,
			d = j;
		var k = e.fillAlpha;
		isNaN(k) && (k = 0);
		j = a.chart.container;
		e = e.fillColor;
		"V" == h ? (b = AmCharts.fitToBounds(b, 0, a.viH), d = AmCharts.fitToBounds(d, 0, a.viH)) : (b = AmCharts.fitToBounds(b, 0, a.viW), d = AmCharts.fitToBounds(d, 0, a.viW));
		d -= b;
		isNaN(d) && (d = 4, i = 2, k = 0);
		0 > d && "object" == typeof e && (e = e.join(",").split(",").reverse());
		"V" == h ? (a = AmCharts.rect(j, a.width, d, e, k), a.translate(f, b - i + g)) : (a = AmCharts.rect(j, d, a.height, e, k), a.translate(b - i + f, g));
		this.set = j.set([a])
	},
	graphics: function() {
		return this.set
	},
	getLabel: function() {}
});
AmCharts.RadAxis = AmCharts.Class({
	construct: function(a) {
		var b = a.chart,
			d = a.axisThickness,
			e = a.axisColor,
			f = a.axisAlpha,
			g = a.x,
			h = a.y;
		this.set = b.container.set();
		b.axesSet.push(this.set);
		var i = a.axisTitleOffset,
			j = a.radarCategoriesEnabled,
			k = a.chart.fontFamily,
			l = a.fontSize;
		void 0 == l && (l = a.chart.fontSize);
		var o = a.color;
		void 0 == o && (o = a.chart.color);
		if (b) {
			this.axisWidth = a.height;
			for (var a = b.chartData, p = a.length, m = 0; m < p; m++) {
				var n = 180 - 360 / p * m,
					q = g + this.axisWidth * Math.sin(n / 180 * Math.PI),
					r = h + this.axisWidth * Math.cos(n / 180 * Math.PI);
				this.set.push(AmCharts.line(b.container, [g, q], [h, r], e, f, d));
				if (j) {
					var s = "start",
						q = g + (this.axisWidth + i) * Math.sin(n / 180 * Math.PI),
						r = h + (this.axisWidth + i) * Math.cos(n / 180 * Math.PI);
					if (180 == n || 0 == n) s = "middle", q -= 5;
					0 > n && (s = "end", q -= 10);
					180 == n && (r -= 5);
					0 == n && (r += 5);
					n = AmCharts.text(b.container, a[m].category, o, k, l, s);
					n.translate(q + 5, r);
					this.set.push(n);
					n.getBBox()
				}
			}
		}
	}
});
AmCharts.RadItem = AmCharts.Class({
	construct: function(a, b, d, e, f, g, h) {
		void 0 == d && (d = "");
		var i = a.chart.fontFamily,
			j = a.fontSize;
		void 0 == j && (j = a.chart.fontSize);
		var k = a.color;
		void 0 == k && (k = a.chart.color);
		var l = a.chart.container;
		this.set = e = l.set();
		var o = a.axisColor,
			p = a.axisAlpha,
			m = a.tickLength,
			n = a.gridAlpha,
			q = a.gridThickness,
			r = a.gridColor,
			s = a.dashLength,
			t = a.fillColor,
			w = a.fillAlpha,
			x = a.labelsEnabled,
			f = a.counter,
			C = a.inside,
			u = a.gridType,
			b = b - a.height,
			A, g = a.x,
			N = a.y;
		h ? (x = !0, isNaN(h.tickLength) || (m = h.tickLength), void 0 != h.lineColor && (r = h.lineColor), isNaN(h.lineAlpha) || (n = h.lineAlpha), isNaN(h.dashLength) || (s = h.dashLength), isNaN(h.lineThickness) || (q = h.lineThickness), !0 == h.inside && (C = !0)) : d || (n /= 3, m /= 2);
		var D = "end",
			T = -1;
		C && (D = "start", T = 1);
		if (x) {
			var I = AmCharts.text(l, d, k, i, j, D);
			I.translate(g + (m + 3) * T, b);
			e.push(I);
			this.label = I;
			A = AmCharts.line(l, [g, g + m * T], [b, b], o, p, q);
			e.push(A)
		}
		b = a.y - b;
		if ("polygons" == u) {
			for (var K = [], E = [], U = a.data.length, d = 0; d < U; d++) i = 180 - 360 / U * d, K.push(b * Math.sin(i / 180 * Math.PI)), E.push(b * Math.cos(i / 180 * Math.PI));
			K.push(K[0]);
			E.push(E[0]);
			d = AmCharts.line(l, K, E, r, n, q, s)
		} else d = AmCharts.circle(l, b, "#FFFFFF", 0, q, r, n);
		d.translate(g, N);
		e.push(d);
		if (1 == f && 0 < w && !h) {
			h = a.previousCoord;
			if ("polygons" == u) {
				for (d = U; 0 <= d; d--) i = 180 - 360 / U * d, K.push(h * Math.sin(i / 180 * Math.PI)), E.push(h * Math.cos(i / 180 * Math.PI));
				K = AmCharts.polygon(l, K, E, t, w)
			} else K = AmCharts.wedge(l, 0, 0, 0, -360, b, b, h, 0, {
				fill: t,
				"fill-opacity": w,
				stroke: 0,
				"stroke-opacity": 0,
				"stroke-width": 0
			});
			e.push(K);
			K.translate(g, N)
		}!1 == a.visible && (A && A.hide(), I && I.hide());
		a.counter = 0 == f ? 1 : 0;
		a.previousCoord = b
	},
	graphics: function() {
		return this.set
	},
	getLabel: function() {
		return this.label
	}
});
AmCharts.RadarFill = AmCharts.Class({
	construct: function(a, b, d, e) {
		var f = Math.max(b, d),
			b = d = Math.min(b, d),
			d = a.chart.container,
			g = e.fillAlpha,
			h = e.fillColor,
			f = Math.abs(f) - a.y,
			b = Math.abs(b) - a.y,
			i = -e.angle,
			e = -e.toAngle;
		isNaN(i) && (i = 0);
		isNaN(e) && (e = -360);
		this.set = d.set();
		void 0 == h && (h = "#000000");
		isNaN(g) && (g = 0);
		if ("polygons" == a.gridType) {
			for (var e = [], j = [], k = a.data.length, l = 0; l < k; l++) i = 180 - 360 / k * l, e.push(f * Math.sin(i / 180 * Math.PI)), j.push(f * Math.cos(i / 180 * Math.PI));
			e.push(e[0]);
			j.push(j[0]);
			for (l = k; 0 <= l; l--) i = 180 - 360 / k * l, e.push(b * Math.sin(i / 180 * Math.PI)), j.push(b * Math.cos(i / 180 * Math.PI));
			this.fill = AmCharts.polygon(d, e, j, h, g)
		} else this.fill = AmCharts.wedge(d, 0, 0, i, e - i, f, f, b, 0, {
			fill: h,
			"fill-opacity": g,
			stroke: 0,
			"stroke-opacity": 0,
			"stroke-width": 0
		});
		this.set.push(this.fill);
		this.fill.translate(a.x, a.y)
	},
	graphics: function() {
		return this.set
	},
	getLabel: function() {}
});
AmCharts.AmGraph = AmCharts.Class({
	construct: function() {
		this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem");
		this.type = "line";
		this.stackable = !0;
		this.columnCount = 1;
		this.columnIndex = 0;
		this.centerCustomBullets = this.showBalloon = !0;
		this.maxBulletSize = 50;
		this.minBulletSize = 0;
		this.balloonText = "[[value]]";
		this.hidden = this.scrollbar = this.animationPlayed = !1;
		this.columnWidth = 0.8;
		this.pointPosition = "middle";
		this.depthCount = 1;
		this.includeInMinMax = !0;
		this.negativeBase = 0;
		this.visibleInLegend = !0;
		this.showAllValueLabels = !1;
		this.showBalloonAt = "close";
		this.lineThickness = 1;
		this.dashLength = 0;
		this.connect = !0;
		this.lineAlpha = 1;
		this.bullet = "none";
		this.bulletBorderThickness = 2;
		this.bulletAlpha = this.bulletBorderAlpha = 1;
		this.bulletSize = 8;
		this.hideBulletsCount = this.bulletOffset = 0;
		this.labelPosition = "top";
		this.cornerRadiusTop = 0;
		this.cursorBulletAlpha = 1;
		this.gradientOrientation = "vertical";
		this.dy = this.dx = 0;
		this.periodValue = "";
		this.y = this.x = 0
	},
	draw: function() {
		var a = this.chart,
			b = a.container;
		this.container = b;
		this.destroy();
		var d = b.set();
		a.graphsSet.push(d);
		var e = b.set();
		a.bulletSet.push(e);
		this.bulletSet = e;
		if (!this.scrollbar) {
			var f = a.marginLeftReal,
				a = a.marginTopReal;
			d.translate(f, a);
			e.translate(f, a)
		}
		if ("column" == this.type) var g = b.set();
		AmCharts.remove(this.columnsSet);
		d.push(g);
		this.set = d;
		this.columnsSet = g;
		this.columnsArray = [];
		this.ownColumns = [];
		this.allBullets = [];
		this.animationArray = [];
		AmCharts.ifArray(this.data) && (b = !1, "xy" == this.chartType ? this.xAxis.axisCreated && this.yAxis.axisCreated && (b = !0) : this.valueAxis.axisCreated && (b = !0), !this.hidden && b && this.createGraph())
	},
	createGraph: function() {
		var a = this.chart;
		"inside" == this.labelPosition && (this.labelPosition = "bottom");
		this.startAlpha = a.startAlpha;
		this.seqAn = a.sequencedAnimation;
		this.baseCoord = this.valueAxis.baseCoord;
		this.fillColors || (this.fillColors = this.lineColor);
		void 0 == this.fillAlphas && (this.fillAlphas = 0);
		void 0 == this.bulletColor && (this.bulletColor = this.lineColor, this.bulletColorNegative = this.negativeLineColor);
		void 0 == this.bulletAlpha && (this.bulletAlpha = this.lineAlpha);
		this.bulletBorderColor || (this.bulletBorderAlpha = 0);
		if (!isNaN(this.valueAxis.min) && !isNaN(this.valueAxis.max)) {
			switch (this.chartType) {
			case "serial":
				this.createSerialGraph();
				break;
			case "radar":
				this.createRadarGraph();
				break;
			case "xy":
				this.createXYGraph(), this.positiveClip(this.set)
			}
			this.animationPlayed = !0
		}
	},
	createXYGraph: function() {
		var a = [],
			b = [],
			d = this.xAxis,
			e = this.yAxis;
		this.pmh = e.viH + 1;
		this.pmw = d.viW + 1;
		this.pmy = this.pmx = 0;
		for (var f = this.start; f <= this.end; f++) {
			var g = this.data[f].axes[d.id].graphs[this.id],
				h = g.values,
				i = h.x,
				j = h.y,
				h = d.getCoordinate(i),
				k = e.getCoordinate(j);
			!isNaN(i) && !isNaN(j) && (a.push(h), b.push(k), (i = this.createBullet(g, h, k, f)) || (i = 0), this.labelText && (g = this.createLabel(g, h, k), this.positionLabel(h, k, g, this.labelPosition, i)))
		}
		this.drawLineGraph(a, b);
		this.launchAnimation()
	},
	createRadarGraph: function() {
		for (var a = this.valueAxis.stackType, b = [], d = [], e, f, g = this.start; g <= this.end; g++) {
			var h = this.data[g].axes[this.valueAxis.id].graphs[this.id],
				i;
			i = "none" == a || "3d" == a ? h.values.value : h.values.close;
			if (isNaN(i)) this.drawLineGraph(b, d), b = [], d = [];
			else {
				var j = this.y - (this.valueAxis.getCoordinate(i) - this.height),
					k = 180 - 360 / (this.end - this.start + 1) * g;
				i = j * Math.sin(k / 180 * Math.PI);
				j *= Math.cos(k / 180 * Math.PI);
				b.push(i);
				d.push(j);
				(k = this.createBullet(h, i, j, g)) || (k = 0);
				this.labelText && (h = this.createLabel(h, i, j), this.positionLabel(i, j, h, this.labelPosition, k));
				isNaN(e) && (e = i);
				isNaN(f) && (f = j)
			}
		}
		b.push(e);
		d.push(f);
		this.drawLineGraph(b, d);
		this.launchAnimation()
	},
	positionLabel: function(a, b, d, e, f) {
		var g = d.getBBox();
		switch (e) {
		case "left":
			a -= (g.width + f) / 2 + 2;
			break;
		case "top":
			b -= (f + g.height) / 2 + 1;
			break;
		case "right":
			a += (g.width + f) / 2 + 2;
			break;
		case "bottom":
			b += (f + g.height) / 2 + 1
		}
		d.translate(a, b)
	},
	createSerialGraph: function() {
		var a = this.id,
			b = this.index,
			d = this.data,
			e = this.chart.container,
			f = this.valueAxis,
			g = this.type,
			h = this.columnWidth,
			i = this.width,
			j = this.height,
			k = this.y,
			l = this.rotate,
			o = this.columnCount,
			p = AmCharts.toCoordinate(this.cornerRadiusTop, h / 2),
			m = this.connect,
			n = [],
			q = [],
			r, s, t = this.chart.graphs.length,
			w, x = this.dx / this.depthCount,
			C = this.dy / this.depthCount,
			u = f.stackType,
			A = this.labelPosition,
			N = this.start,
			D = this.end,
			T = this.scrollbar,
			I = this.categoryAxis,
			K = this.baseCoord,
			E = this.negativeBase,
			U = this.columnIndex,
			J = this.lineThickness,
			P = this.lineAlpha,
			da = this.lineColor,
			$ = this.dashLength,
			aa = this.set;
		"above" == A && (A = "top");
		"below" == A && (A = "bottom");
		var ba = 270;
		"horizontal" == this.gradientOrientation && (ba = 0);
		this.gradientRotation = ba;
		var L = this.chart.columnSpacing,
			Q = I.cellWidth,
			ga = (Q * h - o) / o;
		L > ga && (L = ga);
		var B, v, ea, ca = j + 1,
			R = i + 1,
			Fa = 0,
			Na = 0,
			Oa, Pa, Ga, Ha, nb = this.fillColors,
			Ba = this.negativeFillColors,
			ua = this.negativeLineColor,
			Ca = this.fillAlphas,
			Da = this.negativeFillAlphas;
		"object" == typeof Ca && (Ca = Ca[0]);
		"object" == typeof Da && (Da = Da[0]);
		var Ia = f.getCoordinate(f.min);
		f.logarithmic && (Ia = f.getCoordinate(f.minReal));
		this.minCoord = Ia;
		this.resetBullet && (this.bullet = "none");
		if (!T && ("line" == g || "smoothedLine" == g || "step" == g)) if (1 == d.length && ("step" != g && "none" == this.bullet) && (this.bullet = "round", this.resetBullet = !0), Ba || void 0 != ua) {
			var va = E;
			va > f.max && (va = f.max);
			va < f.min && (va = f.min);
			f.logarithmic && (va = f.minReal);
			var oa = f.getCoordinate(va),
				gb = f.getCoordinate(f.max);
			l ? (ca = j, R = Math.abs(gb - oa), Oa = j, Pa = Math.abs(Ia - oa), Ha = Na = 0, f.reversed ? (Fa = 0, Ga = oa) : (Fa = oa, Ga = 0)) : (R = i, ca = Math.abs(gb - oa), Pa = i, Oa = Math.abs(Ia - oa), Ga = Fa = 0, f.reversed ? (Ha = k, Na = oa) : Ha = oa + 1)
		}
		var pa = Math.round;
		this.pmx = pa(Fa);
		this.pmy = pa(Na);
		this.pmh = pa(ca);
		this.pmw = pa(R);
		this.nmx = pa(Ga);
		this.nmy = pa(Ha);
		this.nmh = pa(Oa);
		this.nmw = pa(Pa);
		h = "column" == g ? (Q * h - L * (o - 1)) / o : Q * h;
		1 > h && (h = 1);
		var M;
		if ("line" == g || "step" == g || "smoothedLine" == g) {
			if (0 < N) for (M = N - 1; - 1 < M; M--) if (B = d[M], v = B.axes[f.id].graphs[a], ea = v.values.value) {
				N = M;
				break
			}
			if (D < d.length - 1) for (M = D + 1; M < d.length; M++) if (B = d[M], v = B.axes[f.id].graphs[a], ea = v.values.value) {
				D = M;
				break
			}
		}
		D < d.length - 1 && D++;
		var ja = [],
			ka = [],
			Qa = !1;
		if ("line" == g || "step" == g || "smoothedLine" == g) if (this.stackable && "regular" == u || "100%" == u) Qa = !0;
		for (M = N; M <= D; M++) {
			B = d[M];
			v = B.axes[f.id].graphs[a];
			v.index = M;
			var la = NaN,
				z = NaN,
				y = NaN,
				X = NaN,
				S = NaN,
				Ja = NaN,
				wa = NaN,
				Ka = NaN,
				xa = NaN,
				V = NaN,
				W = NaN,
				qa = NaN,
				ra = NaN,
				O = NaN,
				ia = void 0,
				sa = nb,
				Ea = Ca,
				Y = da;
			void 0 != v.color && (sa = v.color);
			v.fillColors && (sa = v.fillColors);
			isNaN(v.alpha) || (Ea = v.alpha);
			var ma = v.values;
			f.recalculateToPercents && (ma = v.percents);
			if (ma) {
				O = !this.stackable || "none" == u || "3d" == u ? ma.value : ma.close;
				if ("candlestick" == g || "ohlc" == g) var O = ma.close,
					Ra = ma.low,
					wa = f.getCoordinate(Ra),
					Sa = ma.high,
					xa = f.getCoordinate(Sa);
				var ha = ma.open,
					y = f.getCoordinate(O);
				isNaN(ha) || (S = f.getCoordinate(ha));
				if (!T) switch (this.showBalloonAt) {
				case "close":
					v.y = y;
					break;
				case "open":
					v.y = S;
					break;
				case "high":
					v.y = xa;
					break;
				case "low":
					v.y = wa
				}
				var la = B.x[I.id],
					ya = Math.round(Q / 2),
					Ta = ya;
				"start" == this.pointPosition && (la -= Q / 2, ya = 0, Ta = Q);
				T || (v.x = la); - 1E5 > la && (la = -1E5);
				la > i + 1E5 && (la = i + 1E5);
				l ? (z = y, X = S, S = y = la, isNaN(ha) && (X = K), Ja = wa, Ka = xa) : (X = z = la, isNaN(ha) && (S = K));
				switch (g) {
				case "line":
					if (isNaN(O)) m || (this.drawLineGraph(n, q, ja, ka), n = [], q = [], ja = [], ka = []);
					else if (O < E && (v.isNegative = !0), n.push(z), q.push(y), V = z, W = y, qa = z, ra = y, Qa) ja.push(X), ka.push(S);
					break;
				case "smoothedLine":
					if (isNaN(O)) m || (this.drawSmoothedGraph(n, q, ja, ka), n = [], q = [], ja = [], ka = []);
					else if (O < E && (v.isNegative = !0), n.push(z), q.push(y), V = z, W = y, qa = z, ra = y, Qa) ja.push(X), ka.push(S);
					break;
				case "step":
					isNaN(O) ? m || (s = NaN, this.drawLineGraph(n, q, ja, ka), n = [], q = [], ja = [], ka = []) : (O < E && (v.isNegative = !0), l ? (isNaN(r) || (n.push(r), q.push(y - ya)), q.push(y - ya), n.push(z), q.push(y + Ta), n.push(z)) : (isNaN(s) || (q.push(s), n.push(z - ya)), n.push(z - ya), q.push(y), n.push(z + Ta), q.push(y)), r = z, s = y, V = z, W = y, qa = z, ra = y);
					break;
				case "column":
					if (!isNaN(O)) {
						O < E && (v.isNegative = !0, Ba && (sa = Ba), void 0 != ua && (Y = ua));
						var hb = f.min,
							ib = f.max;
						if (!(O < hb && (ha < hb || void 0 == ha) || O > ib && ha > ib)) if (l) {
							if ("3d" == u) var G = y - 0.5 * (h + L) + L / 2 + C * U,
								H = X + x * U;
							else G = y - (o / 2 - U) * (h + L) + L / 2, H = X;
							var F = h,
								V = z,
								W = G + h / 2,
								qa = z,
								ra = G + h / 2;
							G + F > j && (F = j - G);
							0 > G && (F += G, G = 0);
							var Z = z - X,
								ob = H,
								H = AmCharts.fitToBounds(H, 0, i),
								Z = Z + (ob - H),
								Z = AmCharts.fitToBounds(Z, -H, i - H + x * U);
							G < j && 0 < F && (ia = new AmCharts.Cuboid(e, Z, F, x, C, sa, Ea, J, Y, P, ba, p, l), "bottom" != A && (A = "right", 0 > O ? A = "left" : (V += this.dx, "regular" != u && "100%" != u && (W += this.dy))))
						} else {
							"3d" == u ? (H = z - 0.5 * (h + L) + L / 2 + x * U, G = S + C * U) : (H = z - (o / 2 - U) * (h + L) + L / 2, G = S);
							F = h;
							V = H + h / 2;
							W = y;
							qa = H + h / 2;
							ra = y;
							H + F > i + U * x && (F = i - H + U * x);
							0 > H && (F += H, H = 0);
							var Z = y - S,
								pb = G,
								G = AmCharts.fitToBounds(G, 0, j),
								Z = Z + (pb - G),
								Z = AmCharts.fitToBounds(Z, -G + C * U, j - G);
							H < i + U * x && 0 < F && (ia = new AmCharts.Cuboid(e, F, Z, x, C, sa, Ea, J, Y, this.lineAlpha, ba, p, l), 0 > O ? A = "bottom" : ("regular" != u && "100%" != u && (V += this.dx), W += this.dy))
						}
						if (ia) {
							var na = ia.set;
							na.translate(H, G);
							this.columnsSet.push(na);
							v.url && na.setAttr("cursor", "pointer");
							if (!T) {
								"none" == u && (w = l ? (this.end + 1 - M) * t - b : t * M + b);
								"3d" == u && (l ? (w = (t - b) * (this.end + 1 - M), W = G + h / 2) : (w = (t - b) * (M + 1), V += x * this.columnIndex), W += C * this.columnIndex);
								if ("regular" == u || "100%" == u) A = "middle", w = l ? 0 < ma.value ? (this.end + 1 - M) * t + b : (this.end + 1 - M) * t - b : 0 < ma.value ? t * M + b : t * M - b;
								this.columnsArray.push({
									column: ia,
									depth: w
								});
								v.x = l ? G + F / 2 : H + F / 2;
								this.ownColumns.push(ia);
								this.animateColumns(ia, M, z, X, y, S);
								this.addListeners(na, v)
							}
							v.columnSprite = na
						}
					}
					break;
				case "candlestick":
					if (!isNaN(ha) && !isNaN(Sa) && !isNaN(Ra) && !isNaN(O)) {
						var La, Ua;
						O < ha && (v.isNegative = !0, Ba && (sa = Ba), Da && (Ea = Da), void 0 != ua && (Y = ua));
						if (l) {
							if (G = y - h / 2, H = X, F = h, G + F > j && (F = j - G), 0 > G && (F += G, G = 0), G < j && 0 < F) {
								var Va, Wa;
								O > ha ? (Va = [z, Ka], Wa = [X, Ja]) : (Va = [X, Ka], Wa = [z, Ja]);
								y < j && 0 < y && (La = AmCharts.line(e, Va, [y, y], Y, P, J), Ua = AmCharts.line(e, Wa, [y, y], Y, P, J));
								Z = z - X;
								ia = new AmCharts.Cuboid(e, Z, F, x, C, sa, Ca, J, Y, P, ba, p, l)
							}
						} else if (H = z - h / 2, G = S + J / 2, F = h, H + F > i && (F = i - H), 0 > H && (F += H, H = 0), Z = y - S, H < i && 0 < F) {
							var ia = new AmCharts.Cuboid(e, F, Z, x, C, sa, Ea, J, Y, P, ba, p, l),
								Xa, Ya;
							O > ha ? (Xa = [y, xa], Ya = [S, wa]) : (Xa = [S, xa], Ya = [y, wa]);
							z < i && 0 < z && (La = AmCharts.line(e, [z, z], Xa, Y, P, J), Ua = AmCharts.line(e, [z, z], Ya, Y, P, J))
						}
						if (ia && (na = ia.set, aa.push(na), na.translate(H, G), v.url && na.setAttr("cursor", "pointer"), La && (aa.push(La), aa.push(Ua)), V = z, W = y, qa = z, ra = y, !T)) v.x = l ? G + F / 2 : H + F / 2, this.animateColumns(ia, M, z, X, y, S), this.addListeners(na, v)
					}
					break;
				case "ohlc":
					if (!isNaN(ha) && !isNaN(Sa) && !isNaN(Ra) && !isNaN(O)) {
						O < ha && (v.isNegative = !0, void 0 != ua && (Y = ua));
						var Za, $a, ab;
						if (l) {
							var bb = y - h / 2,
								bb = AmCharts.fitToBounds(bb, 0, j),
								jb = AmCharts.fitToBounds(y, 0, j),
								cb = y + h / 2,
								cb = AmCharts.fitToBounds(cb, 0, j);
							$a = AmCharts.line(e, [X, X], [bb, jb], Y, P, J, $);
							0 < y && y < j && (Za = AmCharts.line(e, [Ja, Ka], [y, y], Y, P, J, $));
							ab = AmCharts.line(e, [z, z], [jb, cb], Y, P, J, $)
						} else {
							var db = z - h / 2,
								db = AmCharts.fitToBounds(db, 0, i),
								kb = AmCharts.fitToBounds(z, 0, i),
								eb = z + h / 2,
								eb = AmCharts.fitToBounds(eb, 0, i);
							$a = AmCharts.line(e, [db, kb], [S, S], Y, P, J, $);
							0 < z && z < i && (Za = AmCharts.line(e, [z, z], [wa, xa], Y, P, J, $));
							ab = AmCharts.line(e, [kb, eb], [y, y], Y, P, J, $)
						}
						aa.push($a);
						aa.push(Za);
						aa.push(ab);
						V = z;
						W = y;
						qa = z;
						ra = y
					}
				}
				if (!T && !isNaN(O)) {
					var lb = this.hideBulletsCount;
					if (this.end - this.start <= lb || 0 == lb) {
						var za = this.createBullet(v, qa, ra, M);
						za || (za = 0);
						if (this.labelText) {
							var fa = this.createLabel(v, 0, 0),
								ta = 0,
								Aa = 0,
								mb = fa.getBBox(),
								Ma = mb.width,
								fb = mb.height;
							switch (A) {
							case "left":
								ta = -(Ma / 2 + za / 2 + 3);
								break;
							case "top":
								Aa = -(fb / 2 + za / 2 + 3);
								break;
							case "right":
								ta = za / 2 + 2 + Ma / 2;
								break;
							case "bottom":
								l && "column" == g ? (V = K, 0 > O ? (ta = -6, fa.attr({
									"text-anchor": "end"
								})) : (ta = 6, fa.attr({
									"text-anchor": "start"
								}))) : (Aa = za / 2 + fb / 2, fa.x = -(Ma / 2 + 2));
								break;
							case "middle":
								"column" == g && (l ? (ta = -(z - X) / 2 - x, 0 > Z && (ta += x), Math.abs(z - X) < Ma && !this.showAllValueLabels && (fa.remove(), fa = null)) : (Aa = -(y - S) / 2, 0 > Z && (Aa -= C), Math.abs(y - S) < fb && !this.showAllValueLabels && (fa.remove(), fa = null)))
							}
							if (fa) if (V += ta, W += Aa, fa.translate(V, W), l) {
								if (0 > W || W > j) fa.remove(), fa = null
							} else if (0 > V || V > i) fa.remove(), fa = null
						}
					}
				}
			}
		}
		if ("line" == g || "step" == g || "smoothedLine" == g)"smoothedLine" == g ? this.drawSmoothedGraph(n, q, ja, ka) : this.drawLineGraph(n, q, ja, ka), T || this.launchAnimation()
	},
	animateColumns: function(a, b) {
		var d = this,
			e = d.chart.startDuration;
		0 < e && !d.animationPlayed && (d.seqAn ? (a.set.hide(), d.animationArray.push(a), e = setTimeout(function() {
			d.animate.call(d)
		}, 1E3 * e / (d.end - d.start + 1) * (b - d.start)), d.timeOuts.push(e)) : d.animate(a))
	},
	createLabel: function(a, b, d) {
		var e = this.chart,
			f = this.color;
		void 0 == f && (f = e.color);
		var g = this.fontSize;
		void 0 == g && (g = e.fontSize);
		a = e.formatString(this.labelText, a, this);
		a = AmCharts.cleanFromEmpty(a);
		e = AmCharts.text(this.container, a, f, e.fontFamily, g);
		e.translate(b, d);
		this.bulletSet.push(e);
		this.allBullets.push(e);
		return e
	},
	positiveClip: function(a) {
		a.clipRect(this.pmx, this.pmy, this.pmw, this.pmh)
	},
	negativeClip: function(a) {
		a.clipRect(this.nmx, this.nmy, this.nmw, this.nmh)
	},
	drawLineGraph: function(a, b, d, e) {
		if (1 < a.length) {
			var f = this.set,
				g = this.container,
				h = g.set(),
				i = g.set();
			f.push(h);
			f.push(i);
			var j = this.lineAlpha,
				k = this.lineThickness,
				l = this.dashLength,
				f = this.fillAlphas,
				o = this.fillColors,
				p = this.negativeLineColor,
				m = this.negativeFillColors,
				n = this.negativeFillAlphas,
				q = this.baseCoord,
				r = AmCharts.line(g, a, b, this.lineColor, j, k, l, !1, !0);
			h.push(r);
			void 0 != p && (j = AmCharts.line(g, a, b, p, j, k, l, !1, !0), i.push(j));
			if (0 < f && (j = a.join(";").split(";"), k = b.join(";").split(";"), "serial" == this.chartType && (0 < d.length ? (d.reverse(), e.reverse(), j = a.concat(d), k = b.concat(e)) : this.rotate ? (k.push(k[k.length - 1]), j.push(q), k.push(k[0]), j.push(q), k.push(k[0]), j.push(j[0])) : (j.push(j[j.length - 1]), k.push(q), j.push(j[0]), k.push(q), j.push(a[0]), k.push(k[0]))), a = AmCharts.polygon(g, j, k, o, f, 0, 0, 0, this.gradientRotation), h.push(a), m || void 0 != p)) n || (n = f), m || (m = p), g = AmCharts.polygon(g, j, k, m, n, 0, 0, 0, this.gradientRotation), i.push(g);
			this.applyMask(i, h)
		}
	},
	applyMask: function(a, b) {
		var d = a.length();
		"serial" == this.chartType && !this.scrollbar && (this.positiveClip(b), 0 < d && this.negativeClip(a));
		0 == d && AmCharts.remove(a)
	},
	drawSmoothedGraph: function(a, b) {
		if (1 < a.length) {
			var d = this.set,
				e = this.container,
				f = e.set(),
				g = e.set();
			d.push(f);
			d.push(g);
			var h = this.lineAlpha,
				i = this.lineThickness,
				d = this.dashLength,
				j = this.fillAlphas,
				k = this.fillColors,
				l = this.negativeLineColor,
				o = this.negativeFillColors,
				p = this.negativeFillAlphas,
				m = this.baseCoord,
				n = new AmCharts.Bezier(e, a, b, this.lineColor, h, i, k, 0, d);
			f.push(n.path);
			void 0 != l && (h = new AmCharts.Bezier(e, a, b, l, h, i, k, 0, d), g.push(h.path));
			if (0 < j && (h = "", this.rotate ? (h += " L" + m + "," + b[b.length - 1], h += " L" + m + "," + b[0]) : (h += " L" + a[a.length - 1] + "," + m, h += " L" + a[0] + "," + m), h += " L" + a[0] + "," + b[0], k = new AmCharts.Bezier(e, a, b, NaN, 0, 0, k, j, d, h), f.push(k.path), o || void 0 != l)) p || (p = j), o || (o = l), e = new AmCharts.Bezier(e, a, b, NaN, 0, 0, o, p, d, h), g.push(e.path);
			this.applyMask(g, f)
		}
	},
	launchAnimation: function() {
		var a = this,
			b = a.chart.startDuration;
		if (0 < b && !a.animationPlayed) {
			var d = a.set,
				e = a.bulletSet;
			AmCharts.VML || (d.attr({
				opacity: a.startAlpha
			}), e.attr({
				opacity: a.startAlpha
			}));
			d.hide();
			e.hide();
			a.seqAn ? (b = setTimeout(function() {
				a.animateGraphs.call(a)
			}, 1E3 * a.index * b), a.timeOuts.push(b)) : a.animateGraphs()
		}
	},
	animateGraphs: function() {
		var a = this.chart,
			b = this.set,
			d = this.bulletSet,
			e = this.x,
			f = this.y;
		b.show();
		d.show();
		var g = a.startDuration,
			a = a.startEffect;
		b && (this.rotate ? (b.translate(-1E3, f), d.translate(-1E3, f)) : (b.translate(e, -1E3), d.translate(e, -1E3)), b.animate({
			opacity: 1,
			translate: e + "," + f
		}, g, a), d.animate({
			opacity: 1,
			translate: e + "," + f
		}, g, a))
	},
	animate: function(a) {
		var b = this.chart,
			d = this.container,
			e = this.animationArray;
		!a && 0 < e.length && (a = e[0], e.shift());
		d = d[AmCharts.getEffect(b.startEffect)];
		b = b.startDuration;
		a && (this.rotate ? a.animateWidth(b, d) : a.animateHeight(b, d), a.set.show())
	},
	legendKeyColor: function() {
		var a = this.legendColor,
			b = this.lineAlpha;
		void 0 == a && (a = this.lineColor, 0 == b && (b = this.fillColors) && (a = "object" == typeof b ? b[0] : b));
		return a
	},
	legendKeyAlpha: function() {
		var a = this.legendAlpha;
		void 0 == a && (a = this.lineAlpha, 0 == a && this.fillAlphas && (a = this.fillAlphas), 0 == a && (a = this.bulletAlpha), 0 == a && (a = 1));
		return a
	},
	createBullet: function(a, b, d) {
		var e = this.container,
			f = this.bulletOffset,
			g = this.bulletSize;
		isNaN(a.bulletSize) || (g = a.bulletSize);
		if (!isNaN(this.maxValue)) {
			var h = a.values.value;
			isNaN(h) || (g = h / this.maxValue * this.maxBulletSize)
		}
		g < this.minBulletSize && (g = this.minBulletSize);
		this.rotate ? b += f : d -= f;
		var i;
		if ("none" != this.bullet || a.bullet) {
			var j = this.bulletColor;
			a.isNegative && void 0 != this.bulletColorNegative && (j = this.bulletColorNegative);
			void 0 != a.color && (j = a.color);
			f = this.bullet;
			a.bullet && (f = a.bullet);
			var h = this.bulletBorderThickness,
				k = this.bulletBorderColor,
				l = this.bulletBorderAlpha,
				o = this.bulletAlpha,
				p = a.alpha;
			isNaN(p) || (o = p);
			switch (f) {
			case "round":
				i = AmCharts.circle(e, g / 2, j, o, h, k, l);
				break;
			case "square":
				i = AmCharts.polygon(e, [0, g, g, 0], [0, 0, g, g], j, o, h, k, l);
				b -= g / 2;
				d -= g / 2;
				break;
			case "triangleUp":
				i = AmCharts.triangle(e, g, 0, j, o, h, k, l);
				break;
			case "triangleDown":
				i = AmCharts.triangle(e, g, 180, j, o, h, k, l);
				break;
			case "triangleLeft":
				i = AmCharts.triangle(e, g, 270, j, o, h, k, l);
				break;
			case "triangleRight":
				i = AmCharts.triangle(e, g, 90, j, o, h, k, l);
				break;
			case "bubble":
				i = AmCharts.circle(e, g / 2, j, o, h, k, l, !0)
			}
		}
		if (this.customBullet || a.customBullet) if (f = this.customBullet, a.customBullet && (f = a.customBullet), f) i && i.remove(), "function" == typeof f ? (i = new f, i.chart = this.chart, a.bulletConfig && (i.availableSpace = d, i.graph = this, a.bulletConfig.minCoord = this.minCoord - d, i.bulletConfig = a.bulletConfig), i.write(e), i = i.set) : (this.chart.path && (f = this.chart.path + f), i = e.image(f, 0, 0, g, g).attr({
			preserveAspectRatio: !0
		}), this.centerCustomBullets && (b -= g / 2, d -= g / 2));
		if (i) {
			a.url && i.setAttr("cursor", "pointer");
			this.allBullets.push(i);
			if ("serial" == this.chartType && (0 > b || b > this.width || d < -g / 2 || d > this.height)) i.remove(), i = null;
			i && (this.bulletSet.push(i), i.translate(b, d), this.addListeners(i, a))
		}
		return g
	},
	showBullets: function() {
		for (var a = this.allBullets, b = 0; b < a.length; b++) a[b].show()
	},
	hideBullets: function() {
		for (var a = this.allBullets, b = 0; b < a.length; b++) a[b].hide()
	},
	addListeners: function(a, b) {
		var d = this;
		a.mouseover(function() {
			d.handleRollOver(b)
		}).mouseout(function() {
			d.handleRollOut(b)
		}).click(function() {
			d.handleClick(b)
		}).dblclick(function() {
			d.handleDoubleClick(b)
		})
	},
	handleRollOver: function(a) {
		if (a) {
			var b = this.chart,
				d = {
					type: "rollOverGraphItem",
					item: a,
					index: a.index,
					graph: this,
					target: this,
					chart: this.chart
				};
			this.fire("rollOverGraphItem", d);
			b.fire("rollOverGraphItem", d);
			clearTimeout(b.hoverInt);
			d = this.showBalloon;
			b.chartCursor && "serial" == this.chartType && (d = !1, !b.chartCursor.valueBalloonsEnabled && this.showBalloon && (d = !0));
			d && (d = b.formatString(this.balloonText, a, a.graph), d = AmCharts.cleanFromEmpty(d), a = b.getBalloonColor(this, a), b.balloon.showBullet = !1, b.balloon.pointerOrientation = "V", b.showBalloon(d, a, !0))
		}
	},
	handleRollOut: function(a) {
		this.chart.hideBalloon();
		a && (a = {
			type: "rollOutGraphItem",
			item: a,
			index: a.index,
			graph: this,
			target: this,
			chart: this.chart
		}, this.fire("rollOutGraphItem", a), this.chart.fire("rollOutGraphItem", a))
	},
	handleClick: function(a) {
		if (a) {
			var b = {
				type: "clickGraphItem",
				item: a,
				index: a.index,
				graph: this,
				target: this,
				chart: this.chart
			};
			this.fire("clickGraphItem", b);
			this.chart.fire("clickGraphItem", b);
			AmCharts.getURL(a.url, this.urlTarget)
		}
	},
	handleDoubleClick: function(a) {
		a && (a = {
			type: "doubleClickGraphItem",
			item: a,
			index: a.index,
			graph: this,
			target: this,
			chart: this.chart
		}, this.fire("doubleClickGraphItem", a), this.chart.fire("doubleClickGraphItem", a))
	},
	zoom: function(a, b) {
		this.start = a;
		this.end = b;
		this.draw()
	},
	changeOpacity: function(a) {
		var b = this.set;
		b && b.setAttr("opacity", a);
		if (b = this.ownColumns) for (var d = 0; d < b.length; d++) {
			var e = b[d].set;
			e && e.setAttr("opacity", a)
		}(b = this.bulletSet) && b.setAttr("opacity", a)
	},
	destroy: function() {
		AmCharts.remove(this.set);
		AmCharts.remove(this.bulletSet);
		var a = this.timeOuts;
		if (a) for (var b = 0; b < a.length; b++) clearTimeout(a[b]);
		this.timeOuts = []
	}
});
AmCharts.ChartCursor = AmCharts.Class({
	construct: function() {
		this.createEvents("changed", "zoomed", "onHideCursor", "draw");
		this.enabled = !0;
		this.cursorAlpha = 1;
		this.selectionAlpha = 0.2;
		this.cursorColor = "#CC0000";
		this.categoryBalloonAlpha = 1;
		this.color = "#FFFFFF";
		this.type = "cursor";
		this.zoomed = !1;
		this.zoomable = !0;
		this.pan = !1;
		this.animate = !0;
		this.categoryBalloonDateFormat = "MMM DD, YYYY";
		this.categoryBalloonEnabled = this.valueBalloonsEnabled = !0;
		this.rolledOver = !1;
		this.cursorPosition = "middle";
		this.bulletsEnabled = this.skipZoomDispatch = !1;
		this.bulletSize = 8;
		this.oneBalloonOnly = !1
	},
	draw: function() {
		var a = this;
		a.destroy();
		var b = a.chart,
			d = b.container;
		a.rotate = b.rotate;
		a.container = d;
		d = d.set();
		d.translate(a.x, a.y);
		a.set = d;
		b.cursorSet.push(d);
		d = new AmCharts.AmBalloon;
		d.chart = b;
		a.categoryBalloon = d;
		d.cornerRadius = 0;
		d.borderThickness = 0;
		d.borderAlpha = 0;
		d.showBullet = !1;
		var e = a.categoryBalloonColor;
		void 0 == e && (e = a.cursorColor);
		d.fillColor = e;
		d.fillAlpha = a.categoryBalloonAlpha;
		d.borderColor = e;
		d.color = a.color;
		a.rotate && (d.pointerOrientation = "H");
		if (a.valueBalloonsEnabled) for (d = 0; d < b.graphs.length; d++) e = new AmCharts.AmBalloon, e.chart = b, AmCharts.copyProperties(b.balloon, e), b.graphs[d].valueBalloon = e;
		"cursor" == a.type ? a.createCursor() : a.createCrosshair();
		a.interval = setInterval(function() {
			a.detectMovement.call(a)
		}, 40)
	},
	updateData: function() {
		var a = this.chart.chartData;
		this.data = a;
		AmCharts.ifArray(a) && (this.firstTime = a[0].time, this.lastTime = a[a.length - 1].time)
	},
	createCursor: function() {
		var a = this.chart,
			b = this.cursorAlpha,
			d = a.categoryAxis,
			e = d.position,
			f = d.inside,
			g = d.axisThickness,
			h = this.categoryBalloon,
			i, j, k = a.dx,
			l = a.dy,
			o = this.x,
			p = this.y,
			m = this.width,
			n = this.height,
			a = a.rotate,
			q = d.tickLength;
		h.pointerWidth = q;
		a ? (i = [0, m, m + k], j = [0, 0, l]) : (i = [k, 0, 0], j = [l, 0, n - 1]);
		this.line = b = AmCharts.line(this.container, i, j, this.cursorColor, b, 1);
		this.set.push(b);
		a ? (f && (h.pointerWidth = 0), "right" == e ? f ? h.setBounds(o, p + l, o + m + k, p + n + l) : h.setBounds(o + m + k + g, p + l, o + m + 1E3, p + n + l) : f ? h.setBounds(o, p, m + o, n + p) : h.setBounds(-1E3, -1E3, o - q - g, p + n + 15)) : (h.maxWidth = m, d.parseDates && (q = 0, h.pointerWidth = 0), "top" == e ? f ? h.setBounds(o + k, p + l, m + k + o, n + p) : h.setBounds(o + k, -1E3, m + k + o, p + l - q - g) : f ? h.setBounds(o, p, m + o, n + p - q) : h.setBounds(o, p + n + q + g - 1, o + m, p + n + q + g));
		this.hideCursor()
	},
	createCrosshair: function() {
		var a = this.cursorAlpha,
			b = this.container,
			d = AmCharts.line(b, [0, 0], [0, this.height], this.cursorColor, a, 1),
			a = AmCharts.line(b, [0, this.width], [0, 0], this.cursorColor, a, 1);
		this.set.push(d);
		this.set.push(a);
		this.vLine = d;
		this.hLine = a;
		this.hideCursor()
	},
	detectMovement: function() {
		var a = this.chart;
		if (a.mouseIsOver) {
			var b = a.mouseX - this.x,
				d = a.mouseY - this.y;
			0 < b && b < this.width && 0 < d && d < this.height ? (this.drawing ? this.rolledOver || a.setMouseCursor("crosshair") : this.pan && (this.rolledOver || a.setMouseCursor("move")), this.rolledOver = !0, this.setPosition()) : this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
		} else this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
	},
	getMousePosition: function() {
		var a, b = this.width,
			d = this.height;
		a = this.chart;
		this.rotate ? (a = a.mouseY - this.y, 0 > a && (a = 0), a > d && (a = d)) : (a = a.mouseX - this.x, 0 > a && (a = 0), a > b && (a = b));
		return a
	},
	updateCrosshair: function() {
		var a = this.chart,
			b = a.mouseX - this.x,
			d = a.mouseY - this.y,
			e = this.vLine,
			f = this.hLine,
			b = AmCharts.fitToBounds(b, 0, this.width),
			d = AmCharts.fitToBounds(d, 0, this.height);
		0 < this.cursorAlpha && (e.show(), f.show(), e.translate(b, 0), f.translate(0, d));
		this.zooming && this.updateSelectionSize(b, d);
		!a.mouseIsOver && !this.zooming && this.hideCursor()
	},
	updateSelectionSize: function(a, b) {
		AmCharts.remove(this.selection);
		var d = this.selectionPosX,
			e = this.selectionPosY,
			f = 0,
			g = 0,
			h = this.width,
			i = this.height;
		if (!isNaN(a) && (d > a && (f = a, h = d - a), d < a && (f = d, h = a - d), d == a)) f = a, h = 0;
		if (!isNaN(b) && (e > b && (g = b, i = e - b), e < b && (g = e, i = b - e), e == b)) g = b, i = 0;
		0 < h && 0 < i && (d = AmCharts.rect(this.container, h, i, this.cursorColor, this.selectionAlpha), d.translate(f + this.x, g + this.y), this.selection = d)
	},
	arrangeBalloons: function() {
		var a = this.valueBalloons,
			b = this.x,
			d = this.y,
			e = this.height + d;
		a.sort(this.compareY);
		for (var f = 0; f < a.length; f++) {
			var g = a[f].balloon;
			g.setBounds(b, d, b + this.width, e);
			g.draw();
			e = g.yPos - 3
		}
		this.arrangeBalloons2()
	},
	compareY: function(a, b) {
		return a.yy < b.yy ? 1 : -1
	},
	arrangeBalloons2: function() {
		var a = this.valueBalloons;
		a.reverse();
		for (var b, d = this.x, e, f = 0; f < a.length; f++) {
			var g = a[f].balloon;
			b = g.bottom;
			var h = g.bottom - g.yPos;
			0 < f && b - h < e + 3 && (g.setBounds(d, e + 3, d + this.width, e + h + 3), g.draw());
			g.set && g.set.show();
			e = g.bottom
		}
	},
	showBullets: function() {
		AmCharts.remove(this.allBullets);
		var a = this.container,
			b = a.set();
		this.set.push(b);
		this.set.show();
		this.allBullets = b;
		for (var b = this.chart.graphs, d = 0; d < b.length; d++) {
			var e = b[d];
			if (!e.hidden && e.balloonText) {
				var f = this.data[this.index].axes[e.valueAxis.id].graphs[e.id],
					g = f.y;
				if (!isNaN(g)) {
					var h, i;
					h = f.x;
					this.rotate ? (i = g, g = h) : i = h;
					e = AmCharts.circle(a, this.bulletSize / 2, this.chart.getBalloonColor(e, f), e.cursorBulletAlpha);
					e.translate(i, g);
					this.allBullets.push(e)
				}
			}
		}
	},
	destroy: function() {
		this.clear();
		AmCharts.remove(this.selection);
		this.selection = null;
		var a = this.categoryBalloon;
		a && a.destroy();
		this.destroyValueBalloons();
		AmCharts.remove(this.set)
	},
	clear: function() {
		clearInterval(this.interval)
	},
	destroyValueBalloons: function() {
		var a = this.valueBalloons;
		if (a) for (var b = 0; b < a.length; b++) a[b].balloon.hide()
	},
	zoom: function(a, b, d, e) {
		var f = this.chart;
		this.destroyValueBalloons();
		this.zooming = !1;
		var g;
		this.rotate ? this.selectionPosY = g = f.mouseY : this.selectionPosX = g = f.mouseX;
		this.start = a;
		this.end = b;
		this.startTime = d;
		this.endTime = e;
		this.zoomed = !0;
		var h = f.categoryAxis,
			f = this.rotate;
		g = this.width;
		var i = this.height;
		h.parseDates && !h.equalSpacing ? (a = e - d + h.minDuration(), a = f ? i / a : g / a) : a = f ? i / (b - a) : g / (b - a);
		this.stepWidth = a;
		this.setPosition();
		this.hideCursor()
	},
	hideObj: function(a) {
		a && a.hide()
	},
	hideCursor: function(a) {
		void 0 == a && (a = !0);
		this.hideObj(this.set);
		this.hideObj(this.categoryBalloon);
		this.hideObj(this.line);
		this.hideObj(this.vLine);
		this.hideObj(this.hLine);
		this.hideObj(this.allBullets);
		this.destroyValueBalloons();
		AmCharts.remove(this.selection);
		this.previousIndex = NaN;
		a && this.fire("onHideCursor", {
			type: "onHideCursor",
			chart: this.chart,
			target: this
		});
		this.drawing || this.chart.setMouseCursor("auto")
	},
	setPosition: function(a, b) {
		void 0 == b && (b = !0);
		if ("cursor" == this.type) {
			if (AmCharts.ifArray(this.data)) {
				a || (a = this.getMousePosition());
				if ((a != this.previousMousePosition || !0 == this.zoomed || this.oneBalloonOnly) && !isNaN(a)) {
					var d = this.chart.categoryAxis.xToIndex(a);
					if (d != this.previousIndex || this.zoomed || "mouse" == this.cursorPosition || this.oneBalloonOnly) this.updateCursor(d, b), this.zoomed = !1
				}
				this.previousMousePosition = a
			}
		} else this.updateCrosshair()
	},
	updateCursor: function(a, b) {
		var d = this.chart,
			e = d.mouseX - this.x,
			f = d.mouseY - this.y;
		this.drawingNow && (AmCharts.remove(this.drawingLine), this.drawingLine = AmCharts.line(this.container, [this.x + this.drawStartX, this.x + e], [this.y + this.drawStartY, this.y + f], this.cursorColor, 1, 1));
		if (this.enabled) {
			void 0 == b && (b = !0);
			this.index = a;
			var g = d.categoryAxis,
				h = d.dx,
				i = d.dy,
				j = this.x,
				k = this.y,
				l = this.width,
				o = this.height,
				p = this.data[a],
				m = p.x[g.id],
				n = d.rotate,
				q = g.inside,
				r = this.stepWidth,
				s = this.categoryBalloon,
				t = this.firstTime,
				w = this.lastTime,
				x = this.cursorPosition,
				C = g.position,
				u = this.zooming,
				A = this.panning,
				N = d.graphs,
				D = g.axisThickness;
			if (d.mouseIsOver || u || A || this.forceShow) if (this.forceShow = !1, A) {
				l = this.panClickPos;
				d = this.panClickEndTime;
				u = this.panClickStartTime;
				j = this.panClickEnd;
				k = this.panClickStart;
				e = (n ? l - f : l - e) / r;
				if (!g.parseDates || g.equalSpacing) e = Math.round(e);
				0 != e && (l = {
					type: "zoomed",
					target: this
				}, l.chart = this.chart, g.parseDates && !g.equalSpacing ? (d + e > w && (e = w - d), u + e < t && (e = t - u), l.start = u + e, l.end = d + e, this.fire(l.type, l)) : j + e >= this.data.length || 0 > k + e || (l.start = k + e, l.end = j + e, this.fire(l.type, l)))
			} else {
				"start" == x && (m -= g.cellWidth / 2);
				"mouse" == x && (m = n ? f - 2 : e - 2);
				if (n) {
					if (0 > m) if (u) m = 0;
					else {
						this.hideCursor();
						return
					}
					if (m > o + 1) if (u) m = o + 1;
					else {
						this.hideCursor();
						return
					}
				} else {
					if (0 > m) if (u) m = 0;
					else {
						this.hideCursor();
						return
					}
					if (m > l) if (u) m = l;
					else {
						this.hideCursor();
						return
					}
				}
				0 < this.cursorAlpha && (t = this.line, n ? t.translate(0, m + i) : t.translate(m, 0), t.show());
				this.linePos = n ? m + i : m;
				u && (n ? this.updateSelectionSize(NaN, m) : this.updateSelectionSize(m, NaN));
				t = !0;
				u && (t = !1);
				this.categoryBalloonEnabled && t ? (n ? (q && ("right" == C ? s.setBounds(j, k + i, j + l + h, k + m + i) : s.setBounds(j, k + i, j + l + h, k + m)), "right" == C ? q ? s.setPosition(j + l + h, k + m + i) : s.setPosition(j + l + h + D, k + m + i) : q ? s.setPosition(j, k + m) : s.setPosition(j - D, k + m)) : "top" == C ? q ? s.setPosition(j + m + h, k + i) : s.setPosition(j + m + h, k + i - D + 1) : q ? s.setPosition(j + m, k + o) : s.setPosition(j + m, k + o + D - 1), g.parseDates) ? (g = AmCharts.formatDate(p.category, this.categoryBalloonDateFormat), -1 != g.indexOf("fff") && (g = AmCharts.formatMilliseconds(g, p.category)), s.showBalloon(g)) : s.showBalloon(p.category) : s.hide();
				N && this.bulletsEnabled && this.showBullets();
				this.destroyValueBalloons();
				if (N && this.valueBalloonsEnabled && t && d.balloon.enabled) {
					this.valueBalloons = g = [];
					if (this.oneBalloonOnly) for (var h = Infinity, T, t = 0; t < N.length; t++) r = N[t], r.showBalloon && (!r.hidden && r.balloonText) && (s = p.axes[r.valueAxis.id].graphs[r.id], w = s.y, isNaN(w) || (n ? Math.abs(e - w) < h && (h = Math.abs(e - w), T = r) : Math.abs(f - w) < h && (h = Math.abs(f - w), T = r)));
					for (t = 0; t < N.length; t++) if (r = N[t], !(this.oneBalloonOnly && r != T) && (r.showBalloon && !r.hidden && r.balloonText) && (s = p.axes[r.valueAxis.id].graphs[r.id], w = s.y, !isNaN(w))) {
						i = s.x;
						m = !0;
						if (n) {
							if (h = w, 0 > i || i > o) m = !1
						} else if (h = i, i = w, 0 > h || h > l) m = !1;
						m && (m = r.valueBalloon, q = d.getBalloonColor(r, s), m.setBounds(j, k, j + l, k + o), m.pointerOrientation = "H", m.changeColor(q), void 0 != r.balloonAlpha && (m.fillAlpha = r.balloonAlpha), void 0 != r.balloonTextColor && (m.color = r.balloonTextColor), m.setPosition(h + j, i + k), r = d.formatString(r.balloonText, s, r), "" != r && m.showBalloon(r), !n && m.set && m.set.hide(), g.push({
							yy: w,
							balloon: m
						}))
					}
					n || this.arrangeBalloons()
				}
				b ? (l = {
					type: "changed"
				}, l.index = a, l.target = this, l.chart = this.chart, l.zooming = u, l.position = n ? f : e, l.target = this, d.fire("changed", l), this.fire("changed", l), this.skipZoomDispatch = !1) : (this.skipZoomDispatch = !0, d.updateLegendValues(a));
				this.previousIndex = a
			}
		} else this.hideCursor()
	},
	enableDrawing: function(a) {
		this.enabled = !a;
		this.hideCursor();
		this.rolledOver = !1;
		this.drawing = a
	},
	isZooming: function(a) {
		a && a != this.zooming && this.handleMouseDown("fake");
		!a && a != this.zooming && this.handleMouseUp()
	},
	handleMouseOut: function() {
		if (this.enabled) if (this.zooming) this.setPosition();
		else {
			this.index = void 0;
			var a = {
				type: "changed",
				index: void 0,
				target: this
			};
			a.chart = this.chart;
			this.fire("changed", a);
			this.hideCursor()
		}
	},
	handleReleaseOutside: function() {
		this.handleMouseUp()
	},
	handleMouseUp: function() {
		var a = this.chart,
			b = a.mouseX - this.x,
			d = a.mouseY - this.y;
		if (this.drawingNow) {
			this.drawingNow = !1;
			AmCharts.remove(this.drawingLine);
			var e = this.drawStartX,
				f = this.drawStartY;
			if (2 < Math.abs(e - b) || 2 < Math.abs(f - d)) a = {
				type: "draw",
				target: this,
				chart: a,
				initialX: e,
				initialY: f,
				finalX: b,
				finalY: d
			}, this.fire(a.type, a)
		}
		if (this.enabled) {
			if (this.pan) this.rolledOver = !1;
			else if (this.zoomable && this.zooming) {
				a = {
					type: "zoomed",
					target: this
				};
				a.chart = this.chart;
				if ("cursor" == this.type) {
					if (this.rotate ? this.selectionPosY = d : this.selectionPosX = d = b, !(2 > Math.abs(d - this.initialMouse) && this.fromIndex == this.index)) this.index < this.fromIndex ? (a.end = this.fromIndex, a.start = this.index) : (a.end = this.index, a.start = this.fromIndex), d = this.chart.categoryAxis, d.parseDates && !d.equalSpacing && (a.start = this.data[a.start].time, a.end = this.data[a.end].time), this.skipZoomDispatch || this.fire(a.type, a)
				} else {
					var g = this.initialMouseX,
						h = this.initialMouseY;
					3 > Math.abs(b - g) && 3 > Math.abs(d - h) || (e = Math.min(g, b), f = Math.min(h, d), b = Math.abs(g - b), d = Math.abs(h - d), a.selectionHeight = d, a.selectionWidth = b, a.selectionY = f, a.selectionX = e, this.skipZoomDispatch || this.fire(a.type, a))
				}
				AmCharts.remove(this.selection)
			}
			this.panning = this.zooming = this.skipZoomDispatch = !1
		}
	},
	handleMouseDown: function(a) {
		if (this.zoomable || this.pan || this.drawing) {
			var b = this.rotate,
				d = this.chart,
				e = d.mouseX - this.x,
				f = d.mouseY - this.y;
			if (0 < e && e < this.width && 0 < f && f < this.height || "fake" == a) this.setPosition(), this.drawing ? (this.drawStartY = f, this.drawStartX = e, this.drawingNow = !0) : this.pan ? (this.zoomable = !1, d.setMouseCursor("move"), this.panning = !0, this.panClickPos = b ? f : e, this.panClickStart = this.start, this.panClickEnd = this.end, this.panClickStartTime = this.startTime, this.panClickEndTime = this.endTime) : this.zoomable && ("cursor" == this.type ? (this.fromIndex = this.index, b ? (this.initialMouse = f, this.selectionPosY = this.linePos) : (this.initialMouse = e, this.selectionPosX = this.linePos)) : (this.initialMouseX = e, this.initialMouseY = f, this.selectionPosX = e, this.selectionPosY = f), this.zooming = !0)
		}
	}
});
AmCharts.SimpleChartScrollbar = AmCharts.Class({
	construct: function() {
		this.createEvents("zoomed");
		this.backgroundColor = "#D4D4D4";
		this.backgroundAlpha = 1;
		this.selectedBackgroundColor = "#EFEFEF";
		this.scrollDuration = this.selectedBackgroundAlpha = 1;
		this.resizeEnabled = !0;
		this.hideResizeGrips = !1;
		this.scrollbarHeight = 20;
		this.updateOnReleaseOnly = !1;
		9 > document.documentMode && (this.updateOnReleaseOnly = !0);
		this.dragIconWidth = 11;
		this.dragIconHeight = 18
	},
	draw: function() {
		var a = this;
		a.destroy();
		a.interval = setInterval(function() {
			a.updateScrollbar.call(a)
		}, 40);
		var b = a.chart.container,
			d = a.rotate,
			e = a.chart,
			f = b.set();
		a.set = f;
		e.scrollbarsSet.push(f);
		var g, h;
		d ? (g = a.scrollbarHeight, h = e.plotAreaHeight) : (h = a.scrollbarHeight, g = e.plotAreaWidth);
		a.width = g;
		if ((a.height = h) && g) {
			var i = AmCharts.rect(b, g, h, a.backgroundColor, a.backgroundAlpha);
			a.bg = i;
			f.push(i);
			i = AmCharts.rect(b, g, h, "#000", 0.005);
			f.push(i);
			a.invisibleBg = i;
			i.click(function() {
				a.handleBgClick()
			}).mouseover(function() {
				a.handleMouseOver()
			}).mouseout(function() {
				a.handleMouseOut()
			}).touchend(function() {
				a.handleBgClick()
			});
			i = AmCharts.rect(b, g, h, a.selectedBackgroundColor, a.selectedBackgroundAlpha);
			a.selectedBG = i;
			f.push(i);
			g = AmCharts.rect(b, g, h, "#000", 0.005);
			a.dragger = g;
			f.push(g);
			g.mousedown(function(b) {
				a.handleDragStart(b)
			}).mouseup(function() {
				a.handleDragStop()
			}).mouseover(function() {
				a.handleDraggerOver()
			}).mouseout(function() {
				a.handleMouseOut()
			}).touchstart(function(b) {
				a.handleDragStart(b)
			}).touchend(function() {
				a.handleDragStop()
			});
			g = e.pathToImages;
			d ? (i = g + "dragIconH.gif", h = a.dragIconWidth, g = a.dragIconHeight) : (i = g + "dragIcon.gif", g = a.dragIconWidth, h = a.dragIconHeight);
			d = b.image(i, 0, 0, g, h);
			g = b.image(i, 0, 0, g, h);
			h = AmCharts.rect(b, 10, 20, "#000", 0.005);
			i = AmCharts.rect(b, 10, 20, "#000", 0.005);
			d = b.set([d, i]);
			b = b.set([g, h]);
			a.iconLeft = d;
			f.push(a.iconLeft);
			a.iconRight = b;
			f.push(b);
			d.mousedown(function() {
				a.leftDragStart()
			}).mouseup(function() {
				a.leftDragStop()
			}).mouseover(function() {
				a.iconRollOver()
			}).mouseout(function() {
				a.iconRollOut()
			}).touchstart(function() {
				a.leftDragStart()
			}).touchend(function() {
				a.leftDragStop()
			});
			b.mousedown(function() {
				a.rightDragStart()
			}).mouseup(function() {
				a.rightDragStop()
			}).mouseover(function() {
				a.iconRollOver()
			}).mouseout(function() {
				a.iconRollOut()
			}).touchstart(function() {
				a.rightDragStart()
			}).touchend(function() {
				a.rightDragStop()
			});
			AmCharts.ifArray(e.chartData) ? f.show() : f.hide();
			a.hideDragIcons()
		}
		f.translate(a.x, a.y);
		a.clipDragger(!1)
	},
	updateScrollbarSize: function(a, b) {
		var d = this.dragger,
			e, f, g, h;
		this.rotate ? (e = 0, f = a, g = this.width + 1, h = b - a, d.setAttr("height", b - a), d.setAttr("y", f)) : (e = a, f = 0, g = b - a, h = this.height + 1, d.setAttr("width", b - a), d.setAttr("x", e));
		this.clipAndUpdate(e, f, g, h)
	},
	updateScrollbar: function() {
		var a, b = !1,
			d, e, f = this.x,
			g = this.y,
			h = this.dragger,
			i = this.getDBox();
		d = i.x + f;
		e = i.y + g;
		var j = i.width,
			i = i.height,
			k = this.rotate,
			l = this.chart,
			o = this.width,
			p = this.height,
			m = l.mouseX,
			n = l.mouseY;
		a = this.initialMouse;
		l.mouseIsOver && (this.dragging && (l = this.initialCoord, k ? (a = l + (n - a), 0 > a && (a = 0), l = p - i, a > l && (a = l), h.setAttr("y", a)) : (a = l + (m - a), 0 > a && (a = 0), l = o - j, a > l && (a = l), h.setAttr("x", a))), this.resizingRight && (k ? (a = n - e, a + e > p + g && (a = p - e + g), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 == a && (a = 0.1), h.setAttr("height", a))) : (a = m - d, a + d > o + f && (a = o - d + f), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 == a && (a = 0.1), h.setAttr("width", a)))), this.resizingLeft && (k ? (d = e, e = n, e < g && (e = g), e > p + g && (e = p + g), a = !0 == b ? d - e : i + d - e, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, h.setAttr("y", d + i - g)) : (0 == a && (a = 0.1), h.setAttr("y", e - g), h.setAttr("height", a))) : (e = m, e < f && (e = f), e > o + f && (e = o + f), a = !0 == b ? d - e : j + d - e, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, h.setAttr("x", d + j - f)) : (0 == a && (a = 0.1), h.setAttr("x", e - f), h.setAttr("width", a)))), this.clipDragger(!0))
	},
	clipDragger: function(a) {
		var b = this.getDBox(),
			d = b.x,
			e = b.y,
			f = b.width,
			b = b.height,
			g = !1;
		if (this.rotate) {
			if (d = 0, f = this.width + 1, this.clipY != e || this.clipH != b) g = !0
		} else if (e = 0, b = this.height + 1, this.clipX != d || this.clipW != f) g = !0;
		g && (this.clipAndUpdate(d, e, f, b), a && (this.updateOnReleaseOnly || this.dispatchScrollbarEvent()))
	},
	maskGraphs: function() {},
	clipAndUpdate: function(a, b, d, e) {
		this.clipX = a;
		this.clipY = b;
		this.clipW = d;
		this.clipH = e;
		this.selectedBG.clipRect(a, b, d, e);
		this.updateDragIconPositions();
		this.maskGraphs(a, b, d, e)
	},
	dispatchScrollbarEvent: function() {
		if (this.skipEvent) this.skipEvent = !1;
		else {
			var a = this.chart;
			a.hideBalloon();
			var b = this.getDBox(),
				d = b.x,
				e = b.y,
				f = b.width,
				b = b.height;
			this.rotate ? (d = e, f = this.height / b) : f = this.width / f;
			a = {
				type: "zoomed",
				position: d,
				chart: a,
				target: this,
				multiplyer: f
			};
			this.fire(a.type, a)
		}
	},
	updateDragIconPositions: function() {
		var a = this.getDBox(),
			b = a.x,
			d = a.y,
			e = this.iconLeft,
			f = this.iconRight,
			g, h, i = this.scrollbarHeight;
		this.rotate ? (g = this.dragIconWidth, h = this.dragIconHeight, e.translate((i - h) / 2, d - g / 2), f.translate((i - h) / 2, d + a.height - g / 2)) : (g = this.dragIconHeight, h = this.dragIconWidth, e.translate(b - h / 2, (i - g) / 2), f.translate(b + -h / 2 + a.width, (i - g) / 2))
	},
	showDragIcons: function() {
		this.resizeEnabled && (this.iconLeft.show(), this.iconRight.show())
	},
	hideDragIcons: function() {
		!this.resizingLeft && (!this.resizingRight && !this.dragging) && (this.hideResizeGrips && (this.iconLeft.hide(), this.iconRight.hide()), this.removeCursors())
	},
	removeCursors: function() {
		this.chart.setMouseCursor("auto")
	},
	relativeZoom: function(a, b) {
		this.dragger.stop();
		this.multiplyer = a;
		this.position = b;
		this.updateScrollbarSize(b, this.rotate ? b + this.height / a : b + this.width / a)
	},
	destroy: function() {
		this.clear();
		AmCharts.remove(this.set)
	},
	clear: function() {
		clearInterval(this.interval)
	},
	handleDragStart: function() {
		var a = this.chart;
		this.dragger.stop();
		this.removeCursors();
		this.dragging = !0;
		var b = this.getDBox();
		this.rotate ? (this.initialCoord = b.y, this.initialMouse = a.mouseY) : (this.initialCoord = b.x, this.initialMouse = a.mouseX)
	},
	handleDragStop: function() {
		this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent());
		this.dragging = !1;
		this.mouseIsOver && this.removeCursors();
		this.updateScrollbar()
	},
	handleDraggerOver: function() {
		this.handleMouseOver()
	},
	leftDragStart: function() {
		this.dragger.stop();
		this.resizingLeft = !0
	},
	leftDragStop: function() {
		this.resizingLeft = !1;
		this.mouseIsOver || this.removeCursors();
		this.updateOnRelease()
	},
	rightDragStart: function() {
		this.dragger.stop();
		this.resizingRight = !0
	},
	rightDragStop: function() {
		this.resizingRight = !1;
		this.mouseIsOver || this.removeCursors();
		this.updateOnRelease()
	},
	iconRollOut: function() {
		this.removeCursors()
	},
	iconRollOver: function() {
		this.rotate ? this.chart.setMouseCursor("n-resize") : this.chart.setMouseCursor("e-resize");
		this.handleMouseOver()
	},
	getDBox: function() {
		return this.dragger.getBBox()
	},
	handleBgClick: function() {
		if (!this.resizingRight && !this.resizingLeft) {
			this.zooming = !0;
			var a, b, d = this.scrollDuration,
				e = this.dragger;
			a = this.getDBox();
			var f = a.height,
				g = a.width;
			b = this.chart;
			var h = this.y,
				i = this.x,
				j = this.rotate;
			j ? (a = "y", b = b.mouseY - f / 2 - h, b = AmCharts.fitToBounds(b, 0, this.height - f)) : (a = "x", b = b.mouseX - g / 2 - i, b = AmCharts.fitToBounds(b, 0, this.width - g));
			this.updateOnReleaseOnly ? (this.skipEvent = !1, e.setAttr(a, b), this.dispatchScrollbarEvent(), this.clipDragger()) : (b = Math.round(b), j ? e.animate({
				y: b
			}, d, ">") : e.animate({
				x: b
			}, d, ">"))
		}
	},
	updateOnRelease: function() {
		this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent())
	},
	handleReleaseOutside: function() {
		if (this.set) {
			if (this.resizingLeft || this.resizingRight || this.dragging) this.updateOnRelease(), this.removeCursors();
			this.mouseIsOver = this.dragging = this.resizingRight = this.resizingLeft = !1;
			this.hideDragIcons();
			this.updateScrollbar()
		}
	},
	handleMouseOver: function() {
		this.mouseIsOver = !0;
		this.showDragIcons()
	},
	handleMouseOut: function() {
		this.mouseIsOver = !1;
		this.hideDragIcons()
	}
});
AmCharts.ChartScrollbar = AmCharts.Class({
	inherits: AmCharts.SimpleChartScrollbar,
	construct: function() {
		AmCharts.ChartScrollbar.base.construct.call(this);
		this.graphLineColor = "#BBBBBB";
		this.graphLineAlpha = 0;
		this.graphFillColor = "#BBBBBB";
		this.graphFillAlpha = 1;
		this.selectedGraphLineColor = "#888888";
		this.selectedGraphLineAlpha = 0;
		this.selectedGraphFillColor = "#888888";
		this.selectedGraphFillAlpha = 1;
		this.gridCount = 0;
		this.gridColor = "#FFFFFF";
		this.gridAlpha = 0.7;
		this.skipEvent = this.autoGridCount = !1;
		this.color = "#FFFFFF";
		this.scrollbarCreated = !1
	},
	init: function() {
		var a = this.categoryAxis,
			b = this.chart;
		a || (this.categoryAxis = a = new AmCharts.CategoryAxis);
		a.chart = b;
		a.id = "scrollbar";
		a.dateFormats = b.categoryAxis.dateFormats;
		a.axisItemRenderer = AmCharts.RecItem;
		a.axisRenderer = AmCharts.RecAxis;
		a.guideFillRenderer = AmCharts.RecFill;
		a.inside = !0;
		a.fontSize = this.fontSize;
		a.tickLength = 0;
		a.axisAlpha = 0;
		if (this.graph && (a = this.valueAxis, a || (this.valueAxis = a = new AmCharts.ValueAxis, a.visible = !1, a.scrollbar = !0, a.axisItemRenderer = AmCharts.RecItem, a.axisRenderer = AmCharts.RecAxis, a.guideFillRenderer = AmCharts.RecFill, a.labelsEnabled = !1, a.chart = b), b = this.unselectedGraph, b || (b = new AmCharts.AmGraph, b.scrollbar = !0, this.unselectedGraph = b), b = this.selectedGraph, !b)) b = new AmCharts.AmGraph, b.scrollbar = !0, this.selectedGraph = b;
		this.scrollbarCreated = !0
	},
	draw: function() {
		var a = this;
		AmCharts.ChartScrollbar.base.draw.call(a);
		a.scrollbarCreated || a.init();
		var b = a.chart,
			d = b.chartData,
			e = a.categoryAxis,
			f = a.rotate,
			g = a.x,
			h = a.y,
			i = a.width,
			j = a.height,
			k = b.categoryAxis,
			l = a.set;
		e.setOrientation(!f);
		e.parseDates = k.parseDates;
		e.rotate = f;
		e.equalSpacing = k.equalSpacing;
		e.minPeriod = k.minPeriod;
		e.startOnAxis = k.startOnAxis;
		e.viW = i;
		e.viH = j;
		e.width = i;
		e.height = j;
		e.gridCount = a.gridCount;
		e.gridColor = a.gridColor;
		e.gridAlpha = a.gridAlpha;
		e.color = a.color;
		e.autoGridCount = a.autoGridCount;
		e.parseDates && !e.equalSpacing && e.timeZoom(d[0].time, d[d.length - 1].time);
		e.zoom(0, d.length - 1);
		if (k = a.graph) {
			var o = a.valueAxis,
				p = k.valueAxis;
			o.id = p.id;
			o.rotate = f;
			o.setOrientation(f);
			o.width = i;
			o.height = j;
			o.viW = i;
			o.viH = j;
			o.dataProvider = d;
			o.reversed = p.reversed;
			o.logarithmic = p.logarithmic;
			o.gridAlpha = 0;
			o.axisAlpha = 0;
			l.push(o.set);
			f ? o.y = h : o.x = g;
			for (var g = Infinity, h = -Infinity, m = 0; m < d.length; m++) {
				var n = d[m].axes[p.id].graphs[k.id].values,
					q;
				for (q in n) if ("percents" != q && "total" != q) {
					var r = n[q];
					r < g && (g = r);
					r > h && (h = r)
				}
			}
			Infinity != g && (o.minimum = g); - Infinity != h && (o.maximum = h + 0.1 * (h - g));
			g == h && (o.minimum -= 1, o.maximum += 1);
			o.zoom(0, d.length - 1);
			q = a.unselectedGraph;
			q.id = k.id;
			q.rotate = f;
			q.chart = b;
			q.chartType = b.chartType;
			q.data = d;
			q.valueAxis = o;
			q.chart = k.chart;
			q.categoryAxis = a.categoryAxis;
			q.valueField = k.valueField;
			q.openField = k.openField;
			q.closeField = k.closeField;
			q.highField = k.highField;
			q.lowField = k.lowField;
			q.lineAlpha = a.graphLineAlpha;
			q.lineColor = a.graphLineColor;
			q.fillAlphas = a.graphFillAlpha;
			q.fillColors = a.graphFillColor;
			q.connect = k.connect;
			q.hidden = k.hidden;
			q.width = i;
			q.height = j;
			p = a.selectedGraph;
			p.id = k.id;
			p.rotate = f;
			p.chart = b;
			p.chartType = b.chartType;
			p.data = d;
			p.valueAxis = o;
			p.chart = k.chart;
			p.categoryAxis = e;
			p.valueField = k.valueField;
			p.openField = k.openField;
			p.closeField = k.closeField;
			p.highField = k.highField;
			p.lowField = k.lowField;
			p.lineAlpha = a.selectedGraphLineAlpha;
			p.lineColor = a.selectedGraphLineColor;
			p.fillAlphas = a.selectedGraphFillAlpha;
			p.fillColors = a.selectedGraphFillColor;
			p.connect = k.connect;
			p.hidden = k.hidden;
			p.width = i;
			p.height = j;
			b = a.graphType;
			b || (b = k.type);
			q.type = b;
			p.type = b;
			d = d.length - 1;
			q.zoom(0, d);
			p.zoom(0, d);
			p.set.click(function() {
				a.handleBackgroundClick()
			}).mouseover(function() {
				a.handleMouseOver()
			}).mouseout(function() {
				a.handleMouseOut()
			});
			q.set.click(function() {
				a.handleBackgroundClick()
			}).mouseover(function() {
				a.handleMouseOver()
			}).mouseout(function() {
				a.handleMouseOut()
			});
			l.push(q.set);
			l.push(p.set)
		}
		l.push(e.set);
		l.push(e.labelsSet);
		a.bg.toBack();
		a.invisibleBg.toFront();
		a.dragger.toFront();
		a.iconLeft.toFront();
		a.iconRight.toFront()
	},
	timeZoom: function(a, b) {
		this.startTime = a;
		this.endTime = b;
		this.timeDifference = b - a;
		this.skipEvent = !0;
		this.zoomScrollbar()
	},
	zoom: function(a, b) {
		this.start = a;
		this.end = b;
		this.skipEvent = !0;
		this.zoomScrollbar()
	},
	dispatchScrollbarEvent: function() {
		if (this.skipEvent) this.skipEvent = !1;
		else {
			var a = this.chart.chartData,
				b, d, e = this.dragger.getBBox();
			b = e.x;
			d = e.y;
			var f = e.width,
				e = e.height;
			this.rotate ? (b = d, d = e) : d = f;
			f = {
				type: "zoomed",
				target: this
			};
			f.chart = this.chart;
			var e = this.categoryAxis,
				g = this.stepWidth;
			if (e.parseDates && !e.equalSpacing) {
				var a = a[0].time,
					h = e.minDuration(),
					e = Math.round(b / g) + a,
					a = this.dragging ? e + this.timeDifference : Math.round((b + d) / g) + a - h;
				e > a && (e = a);
				if (e != this.startTime || a != this.endTime) this.startTime = e, this.endTime = a, f.start = e, f.end = a, f.startDate = new Date(e), f.endDate = new Date(a), this.fire(f.type, f)
			} else if (e.startOnAxis || (b += g / 2), d -= this.stepWidth / 2, g = e.xToIndex(b), b = e.xToIndex(b + d), g != this.start || this.end != b) {
				e.startOnAxis && (this.resizingRight && g == b && b++, this.resizingLeft && g == b && (0 < g ? g-- : b = 1));
				this.start = g;
				this.end = this.dragging ? this.start + this.difference : b;
				f.start = this.start;
				f.end = this.end;
				if (e.parseDates && (a[this.start] && (f.startDate = new Date(a[this.start].time)), a[this.end])) f.endDate = new Date(a[this.end].time);
				this.fire(f.type, f)
			}
		}
	},
	zoomScrollbar: function() {
		var a, b;
		b = this.chart.chartData;
		var d = this.categoryAxis,
			e;
		d.parseDates && !d.equalSpacing ? (e = d.stepWidth, b = b[0].time, a = e * (this.startTime - b), b = e * (this.endTime - b + d.minDuration())) : (a = b[this.start].x[d.id], b = b[this.end].x[d.id], e = d.stepWidth, d.startOnAxis || (d = e / 2, a -= d, b += d));
		this.stepWidth = e;
		this.updateScrollbarSize(a, b)
	},
	maskGraphs: function(a, b, d, e) {
		var f = this.selectedGraph;
		f && f.set.clipRect(a, b, d, e)
	},
	handleDragStart: function() {
		AmCharts.ChartScrollbar.base.handleDragStart.call(this);
		this.difference = this.end - this.start;
		this.timeDifference = this.endTime - this.startTime;
		0 > this.timeDifference && (this.timeDifference = 0)
	},
	handleBackgroundClick: function() {
		AmCharts.ChartScrollbar.base.handleBackgroundClick.call(this);
		this.dragging || (this.difference = this.end - this.start, this.timeDifference = this.endTime - this.startTime, 0 > this.timeDifference && (this.timeDifference = 0))
	}
});
AmCharts.circle = function(a, b, d, e, f, g, h, i) {
	if (void 0 == f || 0 == f) f = 1;
	void 0 == g && (g = "#000000");
	void 0 == h && (h = 0);
	e = {
		fill: d,
		stroke: g,
		"fill-opacity": e,
		"stroke-width": f,
		"stroke-opacity": h
	};
	a = a.circle(0, 0, b).attr(e);
	i && a.gradient("radialGradient", [d, AmCharts.adjustLuminosity(d, -0.6)]);
	return a
};
AmCharts.text = function(a, b, d, e, f, g, h, i) {
	g || (g = "middle");
	d = {
		fill: d,
		"font-family": e,
		"font-size": f,
		opacity: i
	};
	!0 == h && (d["font-weight"] = "bold");
	d["text-anchor"] = g;
	return a.text(b, d)
};
AmCharts.polygon = function(a, b, d, e, f, g, h, i, j) {
	isNaN(g) && (g = 0);
	isNaN(i) && (i = f);
	var k = e,
		l = !1;
	"object" == typeof k && 1 < k.length && (l = !0, k = k[0]);
	void 0 == h && (h = k);
	for (var f = {
		fill: k,
		stroke: h,
		"fill-opacity": f,
		"stroke-width": g,
		"stroke-opacity": i
	}, g = AmCharts.dx, h = AmCharts.dy, i = Math.round, k = "M" + (i(b[0]) + g) + "," + (i(d[0]) + h), o = 1; o < b.length; o++) k += " L" + (i(b[o]) + g) + "," + (i(d[o]) + h);
	a = a.path(k + " Z").attr(f);
	l && a.gradient("linearGradient", e, j);
	return a
};
AmCharts.rect = function(a, b, d, e, f, g, h, i, j, k) {
	isNaN(g) && (g = 0);
	void 0 == j && (j = 0);
	void 0 == k && (k = 270);
	isNaN(f) && (f = 0);
	var l = e,
		o = !1;
	"object" == typeof l && (l = l[0], o = !0);
	void 0 == h && (h = l);
	void 0 == i && (i = f);
	var b = Math.round(b),
		d = Math.round(d),
		p = 0,
		m = 0;
	0 > b && (b = Math.abs(b), p = -b);
	0 > d && (d = Math.abs(d), m = -d);
	p += AmCharts.dx;
	m += AmCharts.dy;
	f = {
		fill: l,
		stroke: h,
		"fill-opacity": f,
		"stroke-opacity": i
	};
	a = a.rect(p, m, b, d, j, g).attr(f);
	o && a.gradient("linearGradient", e, k);
	return a
};
AmCharts.triangle = function(a, b, d, e, f, g, h, i) {
	if (void 0 == g || 0 == g) g = 1;
	void 0 == h && (h = "#000");
	void 0 == i && (i = 0);
	var e = {
		fill: e,
		stroke: h,
		"fill-opacity": f,
		"stroke-width": g,
		"stroke-opacity": i
	},
		b = b / 2,
		j;
	0 == d && (j = " M" + -b + "," + b + " L0," + -b + " L" + b + "," + b + " Z");
	180 == d && (j = " M" + -b + "," + -b + " L0," + b + " L" + b + "," + -b + " Z");
	90 == d && (j = " M" + -b + "," + -b + " L" + b + ",0 L" + -b + "," + b + " Z");
	270 == d && (j = " M" + -b + ",0 L" + b + "," + b + " L" + b + "," + -b + " Z");
	return a.path(j).attr(e)
};
AmCharts.line = function(a, b, d, e, f, g, h, i, j) {
	g = {
		fill: "none",
		"stroke-width": g
	};
	void 0 != h && 0 < h && (g["stroke-dasharray"] = h);
	isNaN(f) || (g["stroke-opacity"] = f);
	e && (g.stroke = e);
	for (var e = Math.round, f = AmCharts.dx, h = AmCharts.dy, i = "M" + (e(b[0]) + f) + "," + (e(d[0]) + h), k = 1; k < b.length; k++) i += " L" + (e(b[k]) + f) + "," + (e(d[k]) + h);
	if (AmCharts.VML) return a.path(i, void 0, !0).attr(g);
	j && (i += " M0,0 L0,0");
	return a.path(i).attr(g)
};
AmCharts.wedge = function(a, b, d, e, f, g, h, i, j, k) {
	var l = Math.round,
		g = l(g),
		h = l(h),
		i = l(i),
		o = l(h / g * i),
		p = AmCharts.VML; - 359.9 >= f && (f = -359.9);
	var m = 1 / 180 * Math.PI,
		n = b + Math.cos(e * m) * i,
		q = d + Math.sin(-e * m) * o,
		r = b + Math.cos(e * m) * g,
		s = d + Math.sin(-e * m) * h,
		t = b + Math.cos((e + f) * m) * g,
		w = d + Math.sin((-e - f) * m) * h,
		x = b + Math.cos((e + f) * m) * i,
		m = d + Math.sin((-e - f) * m) * o,
		C = {
			fill: AmCharts.adjustLuminosity(k.fill, -0.2),
			"stroke-opacity": 0
		},
		u = 0;
	180 < Math.abs(f) && (u = 1);
	var e = a.set(),
		A;
	p && (n = l(10 * n), r = l(10 * r), t = l(10 * t), x = l(10 * x), q = l(10 * q), s = l(10 * s), w = l(10 * w), m = l(10 * m), b = l(10 * b), j = l(10 * j), d = l(10 * d), g *= 10, h *= 10, i *= 10, o *= 10, 1 > Math.abs(f) && (1 >= Math.abs(t - r) && 1 >= Math.abs(w - s)) && (A = !0));
	if (0 < j) {
		var N;
		p ? (path = " M" + n + "," + (q + j) + " L" + r + "," + (s + j), A || (path += " A" + (b - g) + "," + (j + d - h) + "," + (b + g) + "," + (j + d + h) + "," + r + "," + (s + j) + "," + t + "," + (w + j)), path += " L" + x + "," + (m + j), 0 < i && (A || (path += " B" + (b - i) + "," + (j + d - o) + "," + (b + i) + "," + (j + d + o) + "," + x + "," + (j + m) + "," + n + "," + (j + q)))) : (path = " M" + n + "," + (q + j) + " L" + r + "," + (s + j), path += " A" + g + "," + h + ",0," + u + ",1," + t + "," + (w + j) + " L" + x + "," + (m + j), 0 < i && (path += " A" + i + "," + o + ",0," + u + ",0," + n + "," + (q + j)));
		path += " Z";
		c = a.path(path, void 0, void 0, "1000,1000").attr(C);
		e.push(c);
		f = a.path(" M" + n + "," + q + " L" + n + "," + (q + j) + " L" + r + "," + (s + j) + " L" + r + "," + s + " L" + n + "," + q + " Z", void 0, void 0, "1000,1000").attr(C);
		j = a.path(" M" + t + "," + w + " L" + t + "," + (w + j) + " L" + x + "," + (m + j) + " L" + x + "," + m + " L" + t + "," + w + " Z", void 0, void 0, "1000,1000").attr(C);
		e.push(f);
		e.push(j)
	}
	p ? (A || (N = " A" + l(b - g) + "," + l(d - h) + "," + l(b + g) + "," + l(d + h) + "," + l(r) + "," + l(s) + "," + l(t) + "," + l(w)), g = " M" + l(n) + "," + l(q) + " L" + l(r) + "," + l(s) + N + " L" + l(x) + "," + l(m)) : g = " M" + n + "," + q + " L" + r + "," + s + (" A" + g + "," + h + ",0," + u + ",1," + t + "," + w) + " L" + x + "," + m;
	0 < i && (p ? A || (g += " B" + (b - i) + "," + (d - o) + "," + (b + i) + "," + (d + o) + "," + x + "," + m + "," + n + "," + q) : g += " A" + i + "," + o + ",0," + u + ",0," + n + "," + q);
	a = a.path(g + " Z", void 0, void 0, "1000,1000").attr(k);
	e.push(a);
	return e
};
AmCharts.adjustLuminosity = function(a, b) {
	a = ("" + a).replace(/[^0-9a-f]/gi, "");
	6 > a.length && (a = "" + a[0] + ("" + a[0]) + ("" + a[1]) + ("" + a[1]) + ("" + a[2]) + ("" + a[2]));
	var b = b || 0,
		d = "#",
		e, f;
	for (f = 0; 3 > f; f++) e = parseInt(a.substr(2 * f, 2), 16), e = Math.round(Math.min(Math.max(0, e + e * b), 255)).toString(16), d += ("00" + e).substr(e.length);
	return d
};
AmCharts.AmPieChart = AmCharts.Class({
	inherits: AmCharts.AmChart,
	construct: function() {
		this.createEvents("rollOverSlice", "rollOutSlice", "clickSlice", "pullOutSlice", "pullInSlice");
		AmCharts.AmPieChart.base.construct.call(this);
		this.colors = "#FF0F00 #FF6600 #FF9E01 #FCD202 #F8FF01 #B0DE09 #04D215 #0D8ECF #0D52D1 #2A0CD0 #8A0CCF #CD0D74 #754DEB #DDDDDD #999999 #333333 #000000 #57032A #CA9726 #990000 #4B0C25".split(" ");
		this.pieAlpha = 1;
		this.pieBaseColor;
		this.pieBrightnessStep = 30;
		this.groupPercent = 0;
		this.groupedTitle = "Other";
		this.groupedPulled = !1;
		this.groupedAlpha = 1;
		this.marginLeft = 0;
		this.marginBottom = this.marginTop = 10;
		this.marginRight = 0;
		this.minRadius = 10;
		this.hoverAlpha = 1;
		this.depth3D = 0;
		this.startAngle = 90;
		this.angle = this.innerRadius = 0;
		this.outlineColor = "#FFFFFF";
		this.outlineAlpha = 0;
		this.outlineThickness = 1;
		this.startRadius = "500%";
		this.startDuration = this.startAlpha = 1;
		this.startEffect = "bounce";
		this.sequencedAnimation = !1;
		this.pullOutRadius = "20%";
		this.pullOutDuration = 1;
		this.pullOutEffect = "bounce";
		this.pullOnHover = this.pullOutOnlyOne = !1;
		this.labelsEnabled = !0;
		this.labelRadius = 30;
		this.labelTickColor = "#000000";
		this.labelTickAlpha = 0.2;
		this.labelText = "[[title]]: [[percents]]%";
		this.hideLabelsPercent = 0;
		this.balloonText = "[[title]]: [[percents]]% ([[value]])\n[[description]]";
		this.dataProvider;
		this.urlTarget = "_self";
		this.previousScale = 1;
		this.autoMarginOffset = 10
	},
	initChart: function() {
		AmCharts.AmPieChart.base.initChart.call(this);
		this.dataChanged && (this.parseData(), this.dispatchDataUpdated = !0, this.dataChanged = !1, this.legend && this.legend.setData(this.chartData));
		this.drawChart()
	},
	handleLegendEvent: function(a) {
		var b = a.type;
		if (a = a.dataItem) {
			var d = a.hidden;
			switch (b) {
			case "clickMarker":
				d || this.clickSlice(a);
				break;
			case "clickLabel":
				d || this.clickSlice(a);
				break;
			case "rollOverItem":
				d || this.rollOverSlice(a, !1);
				break;
			case "rollOutItem":
				d || this.rollOutSlice(a);
				break;
			case "hideItem":
				this.hideSlice(a);
				break;
			case "showItem":
				this.showSlice(a)
			}
		}
	},
	invalidateVisibility: function() {
		this.recalculatePercents();
		this.initChart();
		var a = this.legend;
		a && a.invalidateSize()
	},
	drawChart: function() {
		var a = this;
		AmCharts.AmPieChart.base.drawChart.call(a);
		var b = a.chartData;
		if (AmCharts.ifArray(b)) {
			AmCharts.VML && (a.startAlpha = 1);
			var d = a.startDuration,
				e = a.container,
				f = a.updateWidth();
			a.realWidth = f;
			var g = a.updateHeight();
			a.realHeight = g;
			var h = AmCharts.toCoordinate,
				i = h(a.marginLeft, f),
				j = h(a.marginRight, f),
				k = h(a.marginTop, g) + a.getTitleHeight(),
				l = h(a.marginBottom, g);
			a.chartDataLabels = [];
			a.ticks = [];
			var o, p, m, n = AmCharts.toNumber(a.labelRadius),
				q = a.measureMaxLabel();
			if (!a.labelText || !a.labelsEnabled) n = q = 0;
			o = void 0 == a.pieX ? (f - i - j) / 2 + i : h(a.pieX, a.realWidth);
			p = void 0 == a.pieY ? (g - k - l) / 2 + k : h(a.pieY, g);
			m = h(a.radius, f, g);
			a.pullOutRadiusReal = AmCharts.toCoordinate(a.pullOutRadius, m);
			m || (f = 0 <= n ? f - i - j - 2 * q : f - i - j, g = g - k - l, m = Math.min(f, g), g < f && (m /= 1 - a.angle / 90, m > f && (m = f)), a.pullOutRadiusReal = AmCharts.toCoordinate(a.pullOutRadius, m), m = 0 <= n ? m - 1.8 * (n + a.pullOutRadiusReal) : m - 1.8 * a.pullOutRadiusReal, m /= 2);
			m < a.minRadius && (m = a.minRadius);
			a.pullOutRadiusReal = h(a.pullOutRadius, m);
			h = h(a.innerRadius, m);
			h >= m && (h = m - 1);
			g = AmCharts.fitToBounds(a.startAngle, 0, 360);
			0 < a.depth3D && (g = 270 <= g ? 270 : 90);
			k = m - m * a.angle / 90;
			for (l = 0; l < b.length; l++) if (f = b[l], !0 != f.hidden && 0 < f.percents) {
				var r = 360 * -f.percents / 100,
					j = Math.cos((g + r / 2) / 180 * Math.PI),
					q = Math.sin((-g - r / 2) / 180 * Math.PI) * (k / m),
					i = {
						fill: f.color,
						stroke: a.outlineColor,
						"stroke-width": a.outlineThickness,
						"stroke-opacity": a.outlineAlpha
					};
				f.url && (i.cursor = "pointer");
				i = AmCharts.wedge(e, o, p, g, r, m, k, h, a.depth3D, i);
				a.addEventListeners(i, f);
				f.startAngle = g;
				b[l].wedge = i;
				if (0 < d) {
					var s = a.startAlpha;
					a.chartCreated && (s = f.alpha);
					i.setAttr("opacity", s)
				}
				f.ix = j;
				f.iy = q;
				f.wedge = i;
				f.index = l;
				if (a.labelsEnabled && a.labelText && f.percents >= a.hideLabelsPercent) {
					r = g + r / 2;
					0 >= r && (r += 360);
					var j = o + j * (m + n),
						s = p + q * (m + n),
						t, q = 0;
					if (0 <= n) {
						var w;
						90 >= r && 0 <= r ? (w = 0, t = "start", q = 8) : 360 >= r && 270 < r ? (w = 1, t = "start", q = 8) : 270 >= r && 180 < r ? (w = 2, t = "end", q = -8) : 180 >= r && 90 < r && (w = 3, t = "end", q = -8);
						f.labelQuarter = w
					} else t = "middle";
					r = a.formatString(a.labelText, f);
					r = AmCharts.text(e, r, a.color, a.fontFamily, a.fontSize, t);
					r.translate(j + 1.5 * q, s);
					f.tx = j + 1.5 * q;
					f.ty = s;
					s = setTimeout(function() {
						a.showLabels.call(a)
					}, 1E3 * d);
					a.timeOuts.push(s);
					0 <= a.labelRadius ? i.push(r) : a.freeLabelsSet.push(r);
					f.label = r;
					a.chartDataLabels[l] = r;
					f.tx = j;
					f.tx2 = j + q
				}
				a.graphsSet.push(i);
				(0 == f.alpha || 0 < d && !a.chartCreated) && i.hide();
				g -= 360 * f.percents / 100;
				0 >= g && (g += 360)
			}
			0 < n && a.arrangeLabels();
			a.pieXReal = o;
			a.pieYReal = p;
			a.radiusReal = m;
			a.innerRadiusReal = h;
			0 < n && a.drawTicks();
			a = this;
			a.chartCreated ? a.pullSlices(!0) : (s = setTimeout(function() {
				a.pullSlices.call(a)
			}, 1200 * d), a.timeOuts.push(s));
			a.chartCreated || a.startSlices();
			a.chartCreated = !0;
			a.dispDUpd()
		}
		a.setDepths()
	},
	setDepths: function() {
		for (var a = this.chartData, b = 0; b < a.length; b++) {
			var d = a[b],
				e = d.wedge,
				d = d.startAngle;
			90 >= d && 0 <= d || 360 >= d && 270 < d ? e.toFront() : (270 >= d && 180 < d || 180 >= d && 90 < d) && e.toBack()
		}
	},
	addEventListeners: function(a, b) {
		var d = this;
		a.mouseover(function() {
			d.rollOverSlice(b, !0)
		}).mouseout(function() {
			d.rollOutSlice(b)
		}).click(function() {
			d.clickSlice(b)
		})
	},
	formatString: function(a, b) {
		a = AmCharts.formatValue(a, b, ["value"], this.numberFormatter, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
		a = AmCharts.formatValue(a, b, ["percents"], this.percentFormatter);
		a = AmCharts.massReplace(a, {
			"[[title]]": b.title,
			"[[description]]": b.description,
			"<br>": "\n"
		});
		return a = AmCharts.cleanFromEmpty(a)
	},
	drawTicks: function() {
		for (var a = this.chartData, b = 0; b < a.length; b++) if (this.chartDataLabels[b]) {
			var d = a[b],
				e = d.ty,
				f = this.radiusReal,
				e = AmCharts.line(this.container, [this.pieXReal + d.ix * f, d.tx, d.tx2], [this.pieYReal + d.iy * f, e, e], this.labelTickColor, this.labelTickAlpha);
			d.wedge.push(e);
			this.ticks[b] = e
		}
	},
	arrangeLabels: function() {
		for (var a = this.chartData, b = a.length, d, e = b - 1; 0 <= e; e--) d = a[e], 0 == d.labelQuarter && !d.hidden && this.checkOverlapping(e, d, 0, !0, 0);
		for (e = 0; e < b; e++) d = a[e], 1 == d.labelQuarter && !d.hidden && this.checkOverlapping(e, d, 1, !1, 0);
		for (e = b - 1; 0 <= e; e--) d = a[e], 2 == d.labelQuarter && !d.hidden && this.checkOverlapping(e, d, 2, !0, 0);
		for (e = 0; e < b; e++) d = a[e], 3 == d.labelQuarter && !d.hidden && this.checkOverlapping(e, d, 3, !1, 0)
	},
	checkOverlapping: function(a, b, d, e, f) {
		var g, h, i = this.chartData,
			j = i.length,
			k = b.label;
		if (k) {
			if (!0 == e) for (h = a + 1; h < j; h++)(g = this.checkOverlappingReal(b, i[h], d)) && (h = j);
			else for (h = a - 1; 0 <= h; h--)(g = this.checkOverlappingReal(b, i[h], d)) && (h = 0);
			!0 == g && 100 > f && (g = b.ty + 3 * b.iy, b.ty = g, k.translate(b.tx2, g), this.checkOverlapping(a, b, d, e, f + 1))
		}
	},
	checkOverlappingReal: function(a, b, d) {
		var e = !1,
			f = a.label,
			g = b.label;
		a.labelQuarter == d && (!a.hidden && !b.hidden && g) && (f = f.getBBox(), d = {}, d.width = f.width, d.height = f.height, d.y = a.ty, d.x = a.tx, a = g.getBBox(), g = {}, g.width = a.width, g.height = a.height, g.y = b.ty, g.x = b.tx, AmCharts.hitTest(d, g) && (e = !0));
		return e
	},
	startSlices: function() {
		for (var a = this, b = 500 * (a.startDuration / a.chartData.length), d = 0; d < a.chartData.length; d++) if (0 < a.startDuration && a.sequencedAnimation) {
			var e = setTimeout(function() {
				a.startSequenced.call(a)
			}, b * d);
			a.timeOuts.push(e)
		} else a.startSlice(a.chartData[d])
	},
	pullSlices: function(a) {
		for (var b = this.chartData, d = 0; d < b.length; d++) {
			var e = b[d];
			e.pulled && this.pullSlice(e, 1, a)
		}
	},
	startSequenced: function() {
		for (var a = this.chartData, b = 0; b < a.length; b++) if (!a[b].started) {
			this.startSlice(this.chartData[b]);
			break
		}
	},
	startSlice: function(a) {
		a.started = !0;
		var b = a.wedge,
			d = this.startDuration;
		if (b && 0 < d) {
			0 < a.alpha && b.show();
			var e = AmCharts.toCoordinate(this.startRadius, this.radiusReal);
			b.translate(Math.round(a.ix * e), Math.round(a.iy * e));
			b.animate({
				opacity: a.alpha,
				translate: "0,0"
			}, d, this.startEffect)
		}
	},
	showLabels: function() {
		for (var a = this.chartData, b = 0; b < a.length; b++) if (0 < a[b].alpha) {
			var d = this.chartDataLabels[b];
			d && d.show();
			(d = this.ticks[b]) && d.show()
		}
	},
	showSlice: function(a) {
		isNaN(a) ? a.hidden = !1 : this.chartData[a].hidden = !1;
		this.hideBalloon();
		this.invalidateVisibility()
	},
	hideSlice: function(a) {
		isNaN(a) ? a.hidden = !0 : this.chartData[a].hidden = !0;
		this.hideBalloon();
		this.invalidateVisibility()
	},
	rollOverSlice: function(a, b) {
		isNaN(a) || (a = this.chartData[a]);
		clearTimeout(this.hoverInt);
		this.pullOnHover && this.pullSlice(a, 1);
		var d = this.innerRadiusReal + (this.radiusReal - this.innerRadiusReal) / 2;
		a.pulled && (d += this.pullOutRadiusReal);
		1 > this.hoverAlpha && a.wedge && a.wedge.attr({
			opacity: this.hoverAlpha
		});
		var e;
		e = a.ix * d + this.pieXReal;
		var d = a.iy * d + this.pieYReal,
			f = this.formatString(this.balloonText, a),
			g = AmCharts.adjustLuminosity(a.color, -0.15);
		this.showBalloon(f, g, b, e, d);
		e = {
			type: "rollOverSlice",
			dataItem: a,
			chart: this
		};
		this.fire(e.type, e)
	},
	rollOutSlice: function(a) {
		isNaN(a) || (a = this.chartData[a]);
		a.wedge && a.wedge.attr({
			opacity: a.alpha
		});
		this.hideBalloon();
		a = {
			type: "rollOutSlice",
			dataItem: a,
			chart: this
		};
		this.fire(a.type, a)
	},
	clickSlice: function(a) {
		isNaN(a) || (a = this.chartData[a]);
		this.hideBalloon();
		a.pulled ? this.pullSlice(a, 0) : this.pullSlice(a, 1);
		AmCharts.getURL(a.url, this.urlTarget);
		a = {
			type: "clickSlice",
			dataItem: a,
			chart: this
		};
		this.fire(a.type, a)
	},
	pullSlice: function(a, b, d) {
		var e = a.ix,
			f = a.iy,
			g = this.pullOutDuration;
		!0 === d && (g = 0);
		var d = a.wedge,
			h = this.pullOutRadiusReal;
		d && d.animate({
			translate: b * e * h + "," + b * f * h
		}, g, this.pullOutEffect);
		1 == b ? (a.pulled = !0, this.pullOutOnlyOne && this.pullInAll(a.index), a = {
			type: "pullOutSlice",
			dataItem: a,
			chart: this
		}) : (a.pulled = !1, a = {
			type: "pullInSlice",
			dataItem: a,
			chart: this
		});
		this.fire(a.type, a)
	},
	pullInAll: function(a) {
		for (var b = this.chartData, d = 0; d < this.chartData.length; d++) d != a && b[d].pulled && this.pullSlice(b[d], 0)
	},
	pullOutAll: function() {
		for (var a = this.chartData, b = 0; b < a.length; b++) a[b].pulled || this.pullSlice(a[b], 1)
	},
	parseData: function() {
		var a = [];
		this.chartData = a;
		var b = this.dataProvider;
		if (void 0 != b) {
			for (var d = b.length, e = 0, f = 0; f < d; f++) {
				var g = {},
					h = b[f];
				g.dataContext = h;
				g.value = Number(h[this.valueField]);
				var i = h[this.titleField];
				i || (i = "");
				g.title = i;
				g.pulled = AmCharts.toBoolean(h[this.pulledField], !1);
				(i = h[this.descriptionField]) || (i = "");
				g.description = i;
				g.url = h[this.urlField];
				g.visibleInLegend = AmCharts.toBoolean(h[this.visibleInLegendField], !0);
				i = h[this.alphaField];
				g.alpha = void 0 != i ? Number(i) : this.pieAlpha;
				h = h[this.colorField];
				void 0 != h && (g.color = AmCharts.toColor(h));
				e += g.value;
				g.hidden = !1;
				a[f] = g
			}
			for (f = b = 0; f < d; f++) g = a[f], g.percents = 100 * (g.value / e), g.percents < this.groupPercent && b++;
			1 < b && (this.groupValue = 0, this.removeSmallSlices(), a.push({
				title: this.groupedTitle,
				value: this.groupValue,
				percents: 100 * (this.groupValue / e),
				pulled: this.groupedPulled,
				color: this.groupedColor,
				url: this.groupedUrl,
				description: this.groupedDescription,
				alpha: this.groupedAlpha
			}));
			for (f = 0; f < a.length; f++) if (this.pieBaseColor ? h = AmCharts.adjustLuminosity(this.pieBaseColor, f * this.pieBrightnessStep / 100) : (h = this.colors[f], void 0 == h && (h = AmCharts.randomColor())), void 0 == a[f].color) a[f].color = h;
			this.recalculatePercents()
		}
	},
	recalculatePercents: function() {
		for (var a = this.chartData, b = 0, d = 0; d < a.length; d++) {
			var e = a[d];
			!e.hidden && 0 < e.value && (b += e.value)
		}
		for (d = 0; d < a.length; d++) e = this.chartData[d], e.percents = !e.hidden && 0 < e.value ? 100 * e.value / b : 0
	},
	removeSmallSlices: function() {
		for (var a = this.chartData, b = a.length - 1; 0 <= b; b--) a[b].percents < this.groupPercent && (this.groupValue += a[b].value, a.splice(b, 1))
	},
	animateAgain: function() {
		var a = this;
		a.startSlices();
		var b = setTimeout(function() {
			a.pullSlices.call(a)
		}, 1200 * a.startDuration);
		a.timeOuts.push(b)
	},
	measureMaxLabel: function() {
		for (var a = this.chartData, b = 0, d = 0; d < a.length; d++) {
			var e = this.formatString(this.labelText, a[d]),
				e = AmCharts.text(this.container, e, this.color, this.fontFamily, this.fontSize),
				f = e.getBBox().width;
			f > b && (b = f);
			e.remove()
		}
		return b
	}
});
AmCharts.AmXYChart = AmCharts.Class({
	inherits: AmCharts.AmRectangularChart,
	construct: function() {
		AmCharts.AmXYChart.base.construct.call(this);
		this.createEvents("zoomed");
		this.xAxes;
		this.yAxes;
		this.scrollbarV;
		this.scrollbarH;
		this.maxZoomFactor = 20;
		this.chartType = "xy"
	},
	initChart: function() {
		AmCharts.AmXYChart.base.initChart.call(this);
		this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
		this.updateScrollbar = !0;
		this.drawChart();
		this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins());
		var a = this.marginLeftReal,
			b = this.marginTopReal,
			d = this.plotAreaWidth,
			e = this.plotAreaHeight;
		this.graphsSet.clipRect(a, b, d, e);
		this.bulletSet.clipRect(a, b, d, e);
		this.trendLinesSet.clipRect(a, b, d, e)
	},
	createValueAxes: function() {
		var a = [],
			b = [];
		this.xAxes = a;
		this.yAxes = b;
		for (var d = this.valueAxes, e = 0; e < d.length; e++) {
			var f = d[e],
				g = f.position;
			if ("top" == g || "bottom" == g) f.rotate = !0;
			f.setOrientation(f.rotate);
			g = f.orientation;
			"V" == g && b.push(f);
			"H" == g && a.push(f)
		}
		0 == b.length && (f = new AmCharts.ValueAxis, f.rotate = !1, f.setOrientation(!1), d.push(f), b.push(f));
		0 == a.length && (f = new AmCharts.ValueAxis, f.rotate = !0, f.setOrientation(!0), d.push(f), a.push(f));
		for (e = 0; e < d.length; e++) this.processValueAxis(d[e], e);
		a = this.graphs;
		for (e = 0; e < a.length; e++) this.processGraph(a[e], e)
	},
	drawChart: function() {
		AmCharts.AmXYChart.base.drawChart.call(this);
		AmCharts.ifArray(this.chartData) ? (this.chartScrollbar && (this.updateScrollbars(), this.scrollbarH.draw(), this.scrollbarV.draw()), this.zoomChart()) : this.cleanChart();
		this.chartCreated = !0;
		this.dispDUpd()
	},
	cleanChart: function() {
		AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.scrollbarV, this.scrollbarH, this.chartCursor])
	},
	zoomChart: function() {
		this.toggleZoomOutButton();
		this.zoomObjects(this.valueAxes);
		this.zoomObjects(this.graphs);
		this.zoomTrendLines();
		this.dispatchAxisZoom()
	},
	toggleZoomOutButton: function() {
		1 == this.heightMultiplyer && 1 == this.widthMultiplyer ? this.showZB(!1) : this.showZB(!0)
	},
	dispatchAxisZoom: function() {
		for (var a = this.valueAxes, b = 0; b < a.length; b++) {
			var d = a[b];
			if (!isNaN(d.min) && !isNaN(d.max)) {
				var e, f;
				"V" == d.orientation ? (e = d.coordinateToValue(-this.verticalPosition), f = d.coordinateToValue(-this.verticalPosition + this.plotAreaHeight)) : (e = d.coordinateToValue(-this.horizontalPosition), f = d.coordinateToValue(-this.horizontalPosition + this.plotAreaWidth));
				if (!isNaN(e) && !isNaN(f)) {
					if (e > f) {
						var g = f;
						f = e;
						e = g
					}
					d.dispatchZoomEvent(e, f)
				}
			}
		}
	},
	zoomObjects: function(a) {
		for (var b = a.length, d = 0; d < b; d++) {
			var e = a[d];
			this.updateObjectSize(e);
			e.zoom(0, this.chartData.length - 1)
		}
	},
	updateData: function() {
		this.parseData();
		for (var a = this.chartData, b = a.length - 1, d = this.graphs, e = this.dataProvider, f = 0; f < d.length; f++) {
			var g = d[f];
			g.data = a;
			g.zoom(0, b);
			var h = g.valueField,
				i = 0;
			if (h) for (var j = 0; j < e.length; j++) {
				var k = e[j][h];
				k > i && (i = k)
			}
			g.maxValue = i
		}
		if (a = this.chartCursor) a.updateData(), a.type = "crosshair", a.valueBalloonsEnabled = !1
	},
	zoomOut: function() {
		this.verticalPosition = this.horizontalPosition = 0;
		this.heightMultiplyer = this.widthMultiplyer = 1;
		this.zoomChart();
		this.zoomScrollbars()
	},
	processValueAxis: function(a) {
		a.chart = this;
		a.minMaxField = "H" == a.orientation ? "x" : "y";
		a.minTemp = NaN;
		a.maxTemp = NaN;
		this.listenTo(a, "axisSelfZoomed", this.handleAxisSelfZoom)
	},
	processGraph: function(a) {
		a.xAxis || (a.xAxis = this.xAxes[0]);
		a.yAxis || (a.yAxis = this.yAxes[0])
	},
	parseData: function() {
		AmCharts.AmXYChart.base.parseData.call(this);
		this.chartData = [];
		for (var a = this.dataProvider, b = this.valueAxes, d = this.graphs, e = 0; e < a.length; e++) {
			for (var f = {
				axes: {},
				x: {},
				y: {}
			}, g = a[e], h = 0; h < b.length; h++) {
				var i = b[h].id;
				f.axes[i] = {};
				f.axes[i].graphs = {};
				for (var j = 0; j < d.length; j++) {
					var k = d[j],
						l = k.id;
					if (k.xAxis.id == i || k.yAxis.id == i) {
						var o = {};
						o.serialDataItem = f;
						o.index = e;
						var p = {},
							m = Number(g[k.valueField]);
						isNaN(m) || (p.value = m);
						m = Number(g[k.xField]);
						isNaN(m) || (p.x = m);
						m = Number(g[k.yField]);
						isNaN(m) || (p.y = m);
						o.values = p;
						this.processFields(k, o, g);
						o.serialDataItem = f;
						o.graph = k;
						f.axes[i].graphs[l] = o
					}
				}
			}
			this.chartData[e] = f
		}
	},
	formatString: function(a, b) {
		var d = b.graph.numberFormatter;
		d || (d = this.numberFormatter);
		a = AmCharts.formatValue(a, b.values, ["value", "x", "y"], d); - 1 != a.indexOf("[[") && (a = AmCharts.formatDataContextValue(a, b.dataContext));
		return a = AmCharts.AmSerialChart.base.formatString.call(this, a, b)
	},
	addChartScrollbar: function(a) {
		AmCharts.callMethod("destroy", [this.chartScrollbar, this.scrollbarH, this.scrollbarV]);
		if (a) {
			var b = new AmCharts.SimpleChartScrollbar,
				d = new AmCharts.SimpleChartScrollbar;
			b.skipEvent = !0;
			d.skipEvent = !0;
			b.chart = this;
			d.chart = this;
			this.listenTo(b, "zoomed", this.handleVSBZoom);
			this.listenTo(d, "zoomed", this.handleHSBZoom);
			var e = "backgroundColor backgroundAlpha selectedBackgroundColor selectedBackgroundAlpha scrollDuration resizeEnabled hideResizeGrips scrollbarHeight updateOnReleaseOnly".split(" ");
			AmCharts.copyProperties(a, b, e);
			AmCharts.copyProperties(a, d, e);
			b.rotate = !0;
			d.rotate = !1;
			this.scrollbarHeight = a.scrollbarHeight;
			this.scrollbarH = d;
			this.scrollbarV = b;
			this.chartScrollbar = a
		}
	},
	updateTrendLines: function() {
		for (var a = this.trendLines, b = 0; b < a.length; b++) {
			var d = a[b];
			d.chart = this;
			d.valueAxis || (d.valueAxis = this.yAxes[0]);
			d.valueAxisX || (d.valueAxisX = this.xAxes[0])
		}
	},
	updateMargins: function() {
		AmCharts.AmXYChart.base.updateMargins.call(this);
		var a = this.scrollbarV;
		a && (this.getScrollbarPosition(a, !0, this.yAxes[0].position), this.adjustMargins(a, !0));
		if (a = this.scrollbarH) this.getScrollbarPosition(a, !1, this.xAxes[0].position), this.adjustMargins(a, !1)
	},
	updateScrollbars: function() {
		this.updateChartScrollbar(this.scrollbarV, !0);
		this.updateChartScrollbar(this.scrollbarH, !1)
	},
	zoomScrollbars: function() {
		var a = this.scrollbarH;
		a && a.relativeZoom(this.widthMultiplyer, -this.horizontalPosition / this.widthMultiplyer);
		(a = this.scrollbarV) && a.relativeZoom(this.heightMultiplyer, -this.verticalPosition / this.heightMultiplyer)
	},
	fitMultiplyer: function(a) {
		a > this.maxZoomFactor && (a = this.maxZoomFactor);
		return a
	},
	handleHSBZoom: function(a) {
		var b = this.fitMultiplyer(a.multiplyer),
			a = -a.position * b,
			d = -(this.plotAreaWidth * b - this.plotAreaWidth);
		a < d && (a = d);
		this.widthMultiplyer = b;
		this.horizontalPosition = a;
		this.zoomChart()
	},
	handleVSBZoom: function(a) {
		var b = this.fitMultiplyer(a.multiplyer),
			a = -a.position * b,
			d = -(this.plotAreaHeight * b - this.plotAreaHeight);
		a < d && (a = d);
		this.heightMultiplyer = b;
		this.verticalPosition = a;
		this.zoomChart()
	},
	handleCursorZoom: function(a) {
		var b = this.widthMultiplyer * this.plotAreaWidth / a.selectionWidth,
			d = this.heightMultiplyer * this.plotAreaHeight / a.selectionHeight,
			b = this.fitMultiplyer(b),
			d = this.fitMultiplyer(d);
		this.horizontalPosition = (this.horizontalPosition - a.selectionX) * b / this.widthMultiplyer;
		this.verticalPosition = (this.verticalPosition - a.selectionY) * d / this.heightMultiplyer;
		this.widthMultiplyer = b;
		this.heightMultiplyer = d;
		this.zoomChart();
		this.zoomScrollbars()
	},
	handleAxisSelfZoom: function(a) {
		if ("H" == a.valueAxis.orientation) {
			var b = this.fitMultiplyer(a.multiplyer),
				a = -a.position / this.widthMultiplyer * b,
				d = -(this.plotAreaWidth * b - this.plotAreaWidth);
			a < d && (a = d);
			this.horizontalPosition = a;
			this.widthMultiplyer = b
		} else b = this.fitMultiplyer(a.multiplyer), a = -a.position / this.heightMultiplyer * b, d = -(this.plotAreaHeight * b - this.plotAreaHeight), a < d && (a = d), this.verticalPosition = a, this.heightMultiplyer = b;
		this.zoomChart();
		this.zoomScrollbars()
	},
	removeChartScrollbar: function() {
		AmCharts.callMethod("destroy", [this.scrollbarH, this.scrollbarV]);
		this.scrollbarV = this.scrollbarH = null
	},
	handleReleaseOutside: function(a) {
		AmCharts.AmXYChart.base.handleReleaseOutside.call(this, a);
		AmCharts.callMethod("handleReleaseOutside", [this.scrollbarH, this.scrollbarV])
	}
});
AmCharts.AmDraw = AmCharts.Class({
	construct: function(a, b, d) {
		AmCharts.SVG_NS = "http://www.w3.org/2000/svg";
		AmCharts.SVG_XLINK = "http://www.w3.org/1999/xlink";
		AmCharts.hasSVG = !! document.createElementNS && !! document.createElementNS(AmCharts.SVG_NS, "svg").createSVGRect;
		1 > b && (b = 10);
		1 > d && (d = 10);
		this.div = a;
		this.width = b;
		this.height = d;
		this.rBin = document.createElement("div");
		if (AmCharts.hasSVG) {
			var e = this.createSvgElement("svg");
			e.style.position = "absolute";
			e.style.width = b + "px";
			e.style.height = d + "px";
			e.setAttribute("version", "1.1");
			a.appendChild(e);
			this.container = e;
			this.R = new AmCharts.SVGRenderer(this)
		} else AmCharts.isIE && (AmCharts.VML = !0, AmCharts.vmlStyleSheet || (document.namespaces.add("v", "urn:schemas-microsoft-com:vml"), b = document.createStyleSheet(), b.addRule("v\\:shape", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:polyline", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:roundrect", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:stroke", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:fill", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:oval", "behavior:url(#default#VML); display:inline-block; antialias:true"), b.addRule("v\\:curve", "behavior:url(#default#VML); display:inline-block; antialias:true"), AmCharts.vmlStyleSheet = b), this.container = a, this.R = new AmCharts.VMLRenderer(this), this.R.disableSelection(a))
	},
	createSvgElement: function(a) {
		return document.createElementNS(AmCharts.SVG_NS, a)
	},
	circle: function(a, b, d, e) {
		var f = new AmCharts.AmDObject("circle", this);
		f.attr({
			r: d,
			cx: a,
			cy: b
		});
		this.addToContainer(f.node, e);
		return f
	},
	setSize: function() {},
	rect: function(a, b, d, e, f, g, h) {
		var i = new AmCharts.AmDObject("rect", this);
		AmCharts.VML && (f = 100 * f / Math.min(d, e), d += 2 * g, e += 2 * g, i.bw = g, i.node.style.marginLeft = -g, i.node.style.marginTop = -g);
		1 > d && (d = 1);
		1 > e && (e = 1);
		i.attr({
			x: a,
			y: b,
			width: d,
			height: e,
			rx: f,
			ry: f,
			"stroke-width": g
		});
		this.addToContainer(i.node, h);
		return i
	},
	image: function(a, b, d, e, f, g) {
		var h = new AmCharts.AmDObject("image", this);
		h.attr({
			x: b,
			y: d,
			width: e,
			height: f
		});
		this.R.path(h, a);
		this.addToContainer(h.node, g);
		return h
	},
	addToContainer: function(a, b) {
		b || (b = this.container);
		b.appendChild(a)
	},
	text: function(a, b, d) {
		return this.R.text(a, b, d)
	},
	path: function(a, b, d, e) {
		var f = new AmCharts.AmDObject("path", this);
		e || (e = "100,100");
		f.attr({
			cs: e
		});
		d ? f.attr({
			dd: a
		}) : f.attr({
			d: a
		});
		this.addToContainer(f.node, b);
		return f
	},
	set: function(a) {
		return this.R.set(a)
	},
	remove: function(a) {
		if (a) {
			var b = this.rBin;
			b.appendChild(a);
			b.innerHTML = ""
		}
	},
	bounce: function(a, b, d, e, f) {
		return (b /= f) < 1 / 2.75 ? e * 7.5625 * b * b + d : b < 2 / 2.75 ? e * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + d : b < 2.5 / 2.75 ? e * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + d : e * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + d
	},
	easeInSine: function(a, b, d, e, f) {
		return -e * Math.cos(b / f * (Math.PI / 2)) + e + d
	},
	easeOutSine: function(a, b, d, e, f) {
		return e * Math.sin(b / f * (Math.PI / 2)) + d
	},
	easeOutElastic: function(a, b, d, e, f) {
		var a = 1.70158,
			g = 0,
			h = e;
		if (0 == b) return d;
		if (1 == (b /= f)) return d + e;
		g || (g = 0.3 * f);
		h < Math.abs(e) ? (h = e, a = g / 4) : a = g / (2 * Math.PI) * Math.asin(e / h);
		return h * Math.pow(2, -10 * b) * Math.sin((b * f - a) * 2 * Math.PI / g) + e + d
	},
	renderFix: function() {
		var a = this.container,
			b = a.style;
		b.left = "0px";
		b.top = "0px";
		a = a.getScreenCTM() || a.createSVGMatrix();
		b.left = -(a.e - Math.floor(a.e)) + "px";
		b.top = -(a.f - Math.floor(a.f)) + "px"
	}
});
AmCharts.AmDObject = AmCharts.Class({
	construct: function(a, b) {
		this.D = b;
		this.R = b.R;
		this.node = this.R.create(this, a);
		this.children = []
	},
	attr: function(a) {
		this.R.attr(this, a);
		return this
	},
	getAttr: function(a) {
		return this.node.getAttribute(a)
	},
	setAttr: function(a, b) {
		this.R.setAttr(this, a, b);
		return this
	},
	clipRect: function(a, b, d, e) {
		this.R.clipRect(this, a, b, d, e)
	},
	translate: function(a, b) {
		this.R.move(this, Math.round(a), Math.round(b))
	},
	rotate: function(a) {
		this.R.rotate(this, a)
	},
	animate: function(a, b, d) {
		for (var e in a) {
			var f = e,
				g = a[e],
				d = AmCharts.getEffect(d);
			this.R.animate(this, f, g, b, d)
		}
	},
	push: function(a) {
		if (a) {
			var b = this.node;
			b.appendChild(a.node);
			var d = a.clipPath;
			d && b.appendChild(d);
			(d = a.grad) && b.appendChild(d);
			this.children.push(a)
		}
	},
	text: function(a) {
		this.R.setText(this, a)
	},
	remove: function() {
		this.R.remove(this)
	},
	clear: function() {
		var a = this.node;
		if (a.hasChildNodes()) for (; 1 <= a.childNodes.length;) a.removeChild(a.firstChild)
	},
	hide: function() {
		this.setAttr("visibility", "hidden")
	},
	show: function() {
		this.setAttr("visibility", "visible")
	},
	getBBox: function() {
		return this.R.getBBox(this)
	},
	toFront: function() {
		var a = this.node;
		if (a) {
			var b = a.parentNode;
			b && b.appendChild(a)
		}
	},
	toBack: function() {
		var a = this.node;
		if (a) {
			var b = a.parentNode;
			if (b) {
				var d = b.firstChild;
				d && b.insertBefore(a, d)
			}
		}
	},
	mouseover: function(a) {
		this.R.addListener(this, "mouseover", a);
		return this
	},
	mouseout: function(a) {
		this.R.addListener(this, "mouseout", a);
		return this
	},
	click: function(a) {
		this.R.addListener(this, "click", a);
		return this
	},
	dblclick: function(a) {
		this.R.addListener(this, "dblclick", a);
		return this
	},
	mousedown: function(a) {
		this.R.addListener(this, "mousedown", a);
		return this
	},
	mouseup: function(a) {
		this.R.addListener(this, "mouseup", a);
		return this
	},
	touchstart: function(a) {
		this.R.addListener(this, "touchstart", a);
		return this
	},
	touchend: function(a) {
		this.R.addListener(this, "touchend", a);
		return this
	},
	stop: function() {
		var a = this.animationX;
		a && AmCharts.removeFromArray(this.R.animations, a);
		(a = this.animationY) && AmCharts.removeFromArray(this.R.animations, a)
	},
	length: function() {
		return this.node.childNodes.length
	},
	gradient: function(a, b, d) {
		this.R.gradient(this, a, b, d)
	}
});
AmCharts.VMLRenderer = AmCharts.Class({
	construct: function(a) {
		this.D = a;
		this.cNames = {
			circle: "oval",
			rect: "roundrect",
			path: "shape"
		};
		this.styleMap = {
			x: "left",
			y: "top",
			width: "width",
			height: "height",
			"font-family": "fontFamily",
			"font-size": "fontSize",
			visibility: "visibility"
		};
		this.animations = []
	},
	create: function(a, b) {
		var d;
		if ("group" == b) d = document.createElement("div"), a.type = "div";
		else if ("text" == b) d = document.createElement("div"), a.type = "text";
		else if ("image" == b) d = document.createElement("img"), a.type = "image";
		else {
			a.type = "shape";
			a.shapeType = this.cNames[b];
			d = document.createElement("v:" + this.cNames[b]);
			var e = document.createElement("v:stroke");
			d.appendChild(e);
			a.stroke = e;
			e = document.createElement("v:fill");
			d.appendChild(e);
			a.fill = e
		}
		d.style.position = "absolute";
		d.style.top = 0;
		d.style.left = 0;
		return d
	},
	path: function(a, b) {
		a.node.setAttribute("src", b)
	},
	setAttr: function(a, b, d) {
		if (void 0 !== d) {
			if (8 === document.documentMode) var e = !0;
			var f = a.node,
				g = a.type,
				h = f.style;
			"r" == b && (h.width = 2 * d, h.height = 2 * d);
			if ("roundrect" == a.shapeType && ("width" == b || "height" == b)) d -= 1;
			"cursor" == b && (h.cursor = d);
			"cx" == b && (h.left = d - this.removePx(h.width) / 2);
			"cy" == b && (h.top = d - this.removePx(h.height) / 2);
			var i = this.styleMap[b];
			void 0 != i && (h[i] = d);
			if ("text" == g) {
				if ("text-anchor" == b && (a.anchor = d, i = f.clientWidth, "end" == d && (h.marginLeft = -i + "px"), "middle" == d && (h.marginLeft = -(i / 2) + "px"), "start" == d)) h.marginLeft = "0px";
				"fill" == b && (h.color = d);
				"font-weight" == b && (h.fontWeight = d)
			}
			h = a.children;
			for (i = 0; i < h.length; i++) h[i].setAttr(b, d);
			if ("shape" == g) {
				"cs" == b && (f.style.width = "100px", f.style.height = "100px", f.setAttribute("coordsize", d));
				"d" == b && f.setAttribute("path", this.svgPathToVml(d));
				"dd" == b && f.setAttribute("path", d);
				g = a.stroke;
				a = a.fill;
				"stroke" == b && (e ? g.color = d : g.setAttribute("color", d));
				"stroke-width" == b && (e ? g.weight = d : g.setAttribute("weight", d));
				"stroke-opacity" == b && (e ? g.opacity = d : g.setAttribute("opacity", d));
				"stroke-dasharray" == b && (h = "solid", 0 < d && 3 > d && (h = "dot"), 3 <= d && 6 >= d && (h = "dash"), 6 < d && (h = "longdash"), e ? g.dashstyle = h : g.setAttribute("dashstyle", h));
				if ("fill-opacity" == b || "opacity" == b) 0 == d ? e ? a.on = !1 : a.setAttribute("on", !1) : e ? a.opacity = d : a.setAttribute("opacity", d);
				"fill" == b && (e ? a.color = d : a.setAttribute("color", d));
				"rx" == b && (e ? f.arcSize = d + "%" : f.setAttribute("arcsize", d + "%"))
			}
		}
	},
	attr: function(a, b) {
		for (var d in b) this.setAttr(a, d, b[d])
	},
	text: function(a, b, d) {
		var e = new AmCharts.AmDObject("text", this.D),
			f = e.node;
		f.style.whiteSpace = "pre";
		a = document.createTextNode(a);
		f.appendChild(a);
		this.D.addToContainer(f, d);
		this.attr(e, b);
		return e
	},
	getBBox: function(a) {
		return this.getBox(a.node)
	},
	getBox: function(a) {
		var b = a.offsetLeft,
			d = a.offsetTop,
			e = a.offsetWidth,
			f = a.offsetHeight,
			g;
		if (a.hasChildNodes()) {
			for (var h, i, j = 0; j < a.childNodes.length; j++) {
				g = this.getBox(a.childNodes[j]);
				var k = g.x;
				isNaN(k) || (isNaN(h) ? h = k : k < h && (h = k));
				var l = g.y;
				isNaN(l) || (isNaN(i) ? i = l : l < i && (i = l));
				k = g.width + k;
				isNaN(k) || (e = Math.max(e, k));
				g = g.height + l;
				isNaN(g) || (f = Math.max(f, g))
			}
			0 > h && (b += h);
			0 > i && (d += i)
		}
		return {
			x: b,
			y: d,
			width: e,
			height: f
		}
	},
	setText: function(a, b) {
		var d = a.node;
		d && (d.removeChild(d.firstChild), d.appendChild(document.createTextNode(b)));
		this.setAttr(a, "text-anchor", a.anchor)
	},
	addListener: function(a, b, d) {
		a.node["on" + b] = d
	},
	move: function(a, b, d) {
		var e = a.node,
			f = e.style;
		"text" == a.type && (d -= this.removePx(f.fontSize) / 2 - 1);
		"oval" == a.shapeType && (b -= this.removePx(f.width) / 2, d -= this.removePx(f.height) / 2);
		a = a.bw;
		isNaN(a) || (b -= a, d -= a);
		e.style.left = b + "px";
		e.style.top = d + "px"
	},
	removePx: function(a) {
		return Number(a.substring(0, a.length - 2))
	},
	svgPathToVml: function(a) {
		for (var b = a.split(" "), a = "", d, e = Math.round, f = 0; f < b.length; f++) {
			var g = b[f],
				h = g.substring(0, 1),
				g = g.substring(1),
				i = g.split(","),
				j = e(i[0]) + "," + e(i[1]);
			"M" == h && (a += " m " + j);
			"L" == h && (a += " l " + j);
			"Z" == h && (a += " x e");
			if ("Q" == h) {
				var k = d.length,
					l = d[k - 1],
					o = i[0],
					p = i[1],
					j = i[2],
					m = i[3];
				d = e(d[k - 2] / 3 + 2 / 3 * o);
				l = e(l / 3 + 2 / 3 * p);
				o = e(2 / 3 * o + j / 3);
				p = e(2 / 3 * p + m / 3);
				a += " c " + d + "," + l + "," + o + "," + p + "," + j + "," + m
			}
			"A" == h && (a += " wa " + g);
			"B" == h && (a += " at " + g);
			d = i
		}
		return a
	},
	animate: function(a, b, d, e, f) {
		var g = this,
			h = a.node;
		if ("translate" == b) {
			var i = d.split(","),
				b = i[1],
				d = h.offsetTop,
				h = {
					obj: a,
					frame: 0,
					attribute: "left",
					from: h.offsetLeft,
					to: i[0],
					time: e,
					effect: f
				};
			g.animations.push(h);
			e = {
				obj: a,
				frame: 0,
				attribute: "top",
				from: d,
				to: b,
				time: e,
				effect: f
			};
			g.animations.push(e);
			a.animationX = h;
			a.animationY = e
		}
		g.interval || (g.interval = setInterval(function() {
			g.updateAnimations.call(g)
		}, AmCharts.updateRate))
	},
	updateAnimations: function() {
		for (var a = this.animations.length - 1; 0 <= a; a--) {
			var b = this.animations[a],
				d = 1E3 * b.time / AmCharts.updateRate,
				e = b.frame + 1,
				f = b.obj,
				g = b.attribute;
			if (e <= d) {
				b.frame++;
				var h = Number(b.from),
					i = Number(b.to) - h,
					b = this.D[b.effect](0, e, h, i, d);
				0 == i ? this.animations.splice(a, 1) : f.node.style[g] = b
			} else f.node.style[g] = Number(b.to), this.animations.splice(a, 1)
		}
	},
	clipRect: function(a, b, d, e, f) {
		a.node.style.clip = "rect(" + d + "px " + (b + e) + "px " + (d + f) + "px " + b + "px)"
	},
	rotate: function(a, b) {
		var d = a.node,
			e = d.style,
			f = this.getBGColor(d.parentNode);
		e.backgroundColor = f;
		e.paddingLeft = 1;
		var f = b * Math.PI / 180,
			g = Math.cos(f),
			h = Math.sin(f),
			i = this.removePx(e.left),
			j = this.removePx(e.top),
			k = d.offsetWidth,
			d = d.offsetHeight,
			l = b / Math.abs(b);
		e.left = i + k / 2 - k / 2 * Math.cos(f) - l * d / 2 * Math.sin(f) + 3;
		e.top = j - l * k / 2 * Math.sin(f) + l * d / 2 * Math.sin(f);
		e.cssText = e.cssText + "; filter:progid:DXImageTransform.Microsoft.Matrix(M11='" + g + "', M12='" + -h + "', M21='" + h + "', M22='" + g + "', sizingmethod='auto expand');"
	},
	getBGColor: function(a) {
		var b = "#FFFFFF";
		if (a.style) {
			var d = a.style.backgroundColor;
			"" != d ? b = d : a.parentNode && (b = this.getBGColor(a.parentNode))
		}
		return b
	},
	set: function(a) {
		var b = new AmCharts.AmDObject("group", this.D);
		this.D.container.appendChild(b.node);
		if (a) for (var d = 0; d < a.length; d++) b.push(a[d]);
		return b
	},
	gradient: function(a, b, d, e) {
		var f = "";
		"radialGradient" == b && (b = "gradientradial", d.reverse());
		"linearGradient" == b && (b = "gradient");
		for (var g = 0; g < d.length; g++) {
			var h = Math.round(100 * g / (d.length - 1)),
				f = f + (h + "% " + d[g]);
			g < d.length - 1 && (f += ",")
		}
		a = a.fill;
		90 == e ? e = 0 : 270 == e ? e = 180 : 180 == e ? e = 90 : 0 == e && (e = 270);
		8 === document.documentMode ? (a.type = b, a.angle = e) : (a.setAttribute("type", b), a.setAttribute("angle", e));
		f && (a.colors.value = f)
	},
	remove: function(a) {
		a.clipPath && this.D.remove(a.clipPath);
		this.D.remove(a.node)
	},
	disableSelection: function(a) {
		void 0 != typeof a.onselectstart && (a.onselectstart = function() {
			return !1
		});
		a.style.cursor = "default"
	}
});
AmCharts.SVGRenderer = AmCharts.Class({
	construct: function(a) {
		this.D = a;
		this.animations = []
	},
	create: function(a, b) {
		return document.createElementNS(AmCharts.SVG_NS, b)
	},
	attr: function(a, b) {
		for (var d in b) this.setAttr(a, d, b[d])
	},
	setAttr: function(a, b, d) {
		void 0 !== d && a.node.setAttribute(b, d)
	},
	animate: function(a, b, d, e, f) {
		var g = this,
			h = a.node;
		"translate" == b ? (h = (h = h.getAttribute("transform")) ? ("" + h).substring(10, h.length - 1) : "0,0", h = h.split(", ").join(" "), h = h.split(" ").join(","), 0 == h && (h = "0,0")) : h = h.getAttribute(b);
		b = {
			obj: a,
			frame: 0,
			attribute: b,
			from: h,
			to: d,
			time: e,
			effect: f
		};
		g.animations.push(b);
		a.animationX = b;
		g.interval || (g.interval = setInterval(function() {
			g.updateAnimations.call(g)
		}, AmCharts.updateRate))
	},
	updateAnimations: function() {
		for (var a = this.animations.length - 1; 0 <= a; a--) {
			var b = this.animations[a],
				d = 1E3 * b.time / AmCharts.updateRate,
				e = b.frame + 1,
				f = b.obj,
				g = b.attribute;
			if (e <= d) {
				b.frame++;
				if ("translate" == g) var h = b.from.split(","),
					g = Number(h[0]),
					h = Number(h[1]),
					i = b.to.split(","),
					j = Number(i[0]),
					i = Number(i[1]),
					j = 0 == j - g ? j : Math.round(this.D[b.effect](0, e, g, j - g, d)),
					b = 0 == i - h ? i : Math.round(this.D[b.effect](0, e, h, i - h, d)),
					g = "transform",
					b = "translate(" + j + "," + b + ")";
				else h = Number(b.from), j = Number(b.to), j -= h, b = this.D[b.effect](0, e, h, j, d), 0 == j && this.animations.splice(a, 1);
				this.setAttr(f, g, b)
			} else "translate" == g ? (i = b.to.split(","), j = Number(i[0]), i = Number(i[1]), f.translate(j, i)) : (j = Number(b.to), this.setAttr(f, g, j)), this.animations.splice(a, 1)
		}
	},
	getBBox: function(a) {
		if (a = a.node) try {
			return a.getBBox()
		} catch (b) {}
		return {
			width: 0,
			height: 0,
			x: 0,
			y: 0
		}
	},
	path: function(a, b) {
		a.node.setAttributeNS(AmCharts.SVG_XLINK, "xlink:href", b)
	},
	clipRect: function(a, b, d, e, f) {
		var g = a.node,
			h = a.clipPath;
		h && this.D.remove(h);
		var i = g.parentNode;
		i && (g = document.createElementNS(AmCharts.SVG_NS, "clipPath"), h = AmCharts.getUniqueId(), g.setAttribute("id", h), this.D.rect(b, d, e, f, 0, 0, g), i.appendChild(g), b = "#", AmCharts.baseHref && (b = window.location.href + b), this.setAttr(a, "clip-path", "url(" + b + h + ")"), this.clipPathC++, a.clipPath = g)
	},
	text: function(a, b, d) {
		for (var e = new AmCharts.AmDObject("text", this.D), a = ("" + a).split("\n"), f = b["font-size"], g = 0; g < a.length; g++) {
			var h = this.create(null, "tspan");
			h.appendChild(document.createTextNode(a[g]));
			h.setAttribute("y", (f + 2) * g + f / 2 + 0);
			h.setAttribute("x", 0);
			e.node.appendChild(h)
		}
		e.node.setAttribute("y", f / 2 + 0);
		this.attr(e, b);
		this.D.addToContainer(e.node, d);
		return e
	},
	setText: function(a, b) {
		var d = a.node;
		d && (d.removeChild(d.firstChild), d.appendChild(document.createTextNode(b)))
	},
	move: function(a, b, d) {
		this.setAttr(a, "transform", "translate(" + b + "," + d + ")")
	},
	rotate: function(a, b) {
		var d = a.node.getAttribute("transform"),
			e = "rotate(" + b + ")";
		d && (e = d + " " + e);
		this.setAttr(a, "transform", e)
	},
	set: function(a) {
		var b = new AmCharts.AmDObject("g", this.D);
		this.D.container.appendChild(b.node);
		if (a) for (var d = 0; d < a.length; d++) b.push(a[d]);
		return b
	},
	addListener: function(a, b, d) {
		a.node["on" + b] = d
	},
	gradient: function(a, b, d, e) {
		var f = a.node,
			g = a.grad;
		g && this.D.remove(g);
		b = document.createElementNS(AmCharts.SVG_NS, b);
		g = AmCharts.getUniqueId();
		b.setAttribute("id", g);
		if (!isNaN(e)) {
			var h = 0,
				i = 0,
				j = 0,
				k = 0;
			90 == e ? j = 100 : 270 == e ? k = 100 : 180 == e ? h = 100 : 0 == e && (i = 100);
			b.setAttribute("x1", h + "%");
			b.setAttribute("x2", i + "%");
			b.setAttribute("y1", j + "%");
			b.setAttribute("y2", k + "%")
		}
		for (e = 0; e < d.length; e++) h = document.createElementNS(AmCharts.SVG_NS, "stop"), i = 100 * e / (d.length - 1), 0 == e && (i = 0), h.setAttribute("offset", i + "%"), h.setAttribute("stop-color", d[e]), b.appendChild(h);
		f.parentNode.appendChild(b);
		d = "#";
		AmCharts.baseHref && (d = window.location.href + d);
		f.setAttribute("fill", "url(" + d + g + ")");
		a.grad = b
	},
	remove: function(a) {
		a.clipPath && this.D.remove(a.clipPath);
		a.grad && this.D.remove(a.grad);
		this.D.remove(a.node)
	}
});
AmCharts.AmDSet = AmCharts.Class({
	construct: function() {
		this.create("g")
	},
	attr: function(a) {
		this.R.attr(this.node, a)
	},
	move: function(a, b) {
		this.R.move(this.node, a, b)
	}
});