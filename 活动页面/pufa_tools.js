/*
* 弹窗 example
* 
PubTools.Alert.init({
	title :"", //提示语标题   非必填 
 	message :"", //提示语   非必填
 	cancelOr:true, // 是否显示取消按钮  默认不显示
 	callback: null // 确定按钮的回调函数  非必填

 });
 
 分享遮罩层 example
 PubTools.Share.init();

* 
*
*/

(function() {
	var Tools = {
		Input: {
			options: {
				id: null, //输入框id				
				val: "默认提示", //需要的 提示信息
				or: "success" //成功样式或者警告样式			
			},
			keyup: function(obj) {
				$.extend(this.options, obj);
				$("#" + this.options.id).attr({
					"data-value": this.options.val,
					"data-or": this.options.or
				});
				$("#" + this.options.id).keyup(function() {
					var value = $(this).val();
					var parent = $(this).parent().parent();
					var theVal = $(this).attr("data-value");
					var dataOr = $(this).attr("data-or");
					var dataOrIcon = $(this).parent().find("span");
					(value == theVal) ? parent.addClass("has-" + dataOr) && dataOrIcon.addClass("icon-" + dataOr).show(): dataOrIcon.addClass("icon-" + dataOr).hide() && parent.removeClass("has-" + dataOr);

				})
			} 
		},
		Share: {
			options: {
				img: "../images/share-pic.png",//分享图片
				plane:"../images/icon_hkli.png",
				callback:null
			},
			init: function(obj) {
				$.extend(this.options, obj);
				 $("body").append(this.creat());
				 $(".share-contain-img img").fadeIn(3000);
				  $(".share-contain-img-fly").animate({
				  	bottom:"91%",
				  	left:"83%",
				  	opacity:1	
				  },5000,function(){
				  	$(".share-contain-img-fly").fadeOut(1000)
				  });
				  
				 
			},
			creat:function(){
				var append ='<div class="share-contain" onclick="PubTools.Share.close()">';
				append += '<div class="share-contain-background" ></div>';
				append +='<div class="share-contain-img"><img src="'+this.options.img+'"></div><img src="'+this.options.plane+'" class="share-contain-img-fly"></div>';
				return append
			},
			close:function(){
				$(".share-contain").remove();
			}			
		},
		Alert: {          
			options: {
				title: "温馨提示",
				confirm:"确定",
				cancel: "取消",
				message: '系统繁忙，请稍后再试~',
				visible: true,
				cancelOr:true,
				callback: null
			}, 
			init: function(obj) {
           $.extend(this.options, obj);
           $("body").append(this.creat());
           
			},
			creat: function() {
				var append = '<div class="toShowContainer"><div class="toShowAlert" onclick="PubTools.Alert.close()"></div>';
				append += this.options.visible?'<div class="newAlert-contain" >':'<div class="newAlert-contain" style="height:80px" >';
				append += '<div class="newAlert-contain-paddingTop">' + this.options.title + '</div>';
			    append += '<div class="newAlert-contain-paddingBottom">' + this.options.message + '</div><ul>';
			    append += this.options.visible?this.btn():'';
				append += '</ul></div></div>';
			    return append
			},
			close : function() {
			$(".toShowContainer").remove();
		},
			callback : function() {
			this.options.callback();
			this.close()
		},
		btn:function(){
			return this.options.cancelOr?'<li class="submit" onclick="PubTools.Alert.close()" style="width: 100%" >'+ this.options.confirm +'</li>':'<li onclick="PubTools.Alert.close()">'+ this.options.cancel +'</li><li class="submit" onclick="PubTools.Alert.confirm()">'+ this.options.confirm +'</li>';
		},
		confirm : function() {
			(typeof this.options.callback === "function") ?this.callback(): this.close();
		}
		},
		AlertCj: {          
			options: {
				title: "温馨提示",
				confirm:"确定",
				cancel: "取消",
				messageTitle: '系统繁忙，请稍后再试~',
				message: '系统繁忙~',
				visible: true,
				cancelOr:true,
				callback: null
			}, 
			init: function(obj) {
           $.extend(this.options, obj);
           $("body").append(this.creat());
           
			},
			creat: function() {
				var append = '<div class="toShowContainer"><div class="toShowAlert" onclick="PubTools.Alert.close()"></div>';
				append += this.options.visible?'<div class="newAlert-contain newAlert-contain-color" >':'<div class="newAlert-contain" style="height:80px" >';
				append += '<div class="newAlert-contain-cj-paddingTop newAlert-contain-borderBottom">' + this.options.title + '</div>';
			    append += '<div class="newAlert-contain-fontSize">' + this.options.messageTitle + '</div>';
			    append += '<div class="newAlert-contain-fontSize fontSmall">' + this.options.message + '</div>';
			    append += this.options.visible?this.btn():'';
				append += '</div></div>';
			    return append
			},
			close : function() {
			$(".toShowContainer").remove();
		},
			callback : function() {
			this.options.callback();
			this.close()
		},
		btn:function(){
			return '<div class="newAlert-contain-btn" onclick="PubTools.AlertCj.close()">'+ this.options.confirm +'</div>';
		},
		confirm : function() {
			(typeof this.options.callback === "function") ?this.callback(): this.close();
		}
		},   
		Search: {
			options: {
				id: null,
				list: null, //
				callback: null //
			},
			keyup: function(obj) {

				$.extend(this.options, obj);
				$("#" + this.options.id).css({
					'position': 'relative',
					'width': '50%'
				});
				$("#" + this.options.id).append(
					'<div class="dropListSearch radius">' +
					'<div class="dropText-color">请选择 </div>' +
					'<div class="icon-backGround up">' +
					'<div class="icon-down1"></div>' +
					'</div></div>' +
					'<div class="drop-down-s">' +
					'<div class="search-input"><input id ="choose-search-' + this.options.id + '"/><div class="select-search-icon"></div></div>' +
					'<ul class="drop-down-search" id="search-list-' + this.options.id + '"></ul></div>');
				//					for(){
				//						$("#search-list-" +Tools.Search.options.id).append('<li></li>');
				//					}

				$("#" + this.options.id).find(".dropListSearch").click(function() {
					var thisParent = $(this).parent().find(".drop-down-s");
					var display = thisParent.css("display");
					if(display == "none") {
						$(this).children().find(".icon-down").removeClass("icon-down").addClass("icon-up");
					} else {
						$(this).children().find(".icon-up").removeClass("icon-up").addClass("icon-down");
					}
					thisParent.toggle();   
					//return false;
				});
				$("#choose-search-" + this.options.id).keyup(function() {

					var value = $(this).val();

					$("#search-list-" + Tools.Search.options.id).each(function() {
						var text = $(this).text();
						(text.indexOf(value) > -1) ? $(this).show(): $(this).hide()
					})
				});
			}
		}
	}
	window.PubTools = Tools;
})();