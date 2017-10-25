(function($){
	var msie = (function(w,d){return ("XMLHttpRequest" in w ? d.querySelector ? d.documentMode : 7 : 6)})(top,top.document),
		minWidth = msie < 7 ? "width" : "minWidth",
		activeElement,
		selectQueue,
		loopTimer,
		fixie;

	function create(className, nodeName){
		return $("<" + ( nodeName || "span" ) + "/>").addClass(className);
	}

	


	function modifyText(select){
		//select方式变化时，写入当先选择项文本
		var index = select.selectedIndex,
			text = index < 0 ? "" : select.options[index].innerHTML,
			textdiv = $(select).prev(".select_text_ui");
		if(!textdiv.length){
			textdiv = create("select_text_ui").insertBefore(select);
		}
		text = text || "&nbsp;"
		if(textdiv.html() != text ){
			textdiv.html(text);
		}
	}

	//使用定时器来刷select文字
	function startInterval(select){
		if(selectQueue){
			selectQueue.push(select);
		} else {
			selectQueue = [select];
			clearInterval(loopTimer);
			loopTimer = setInterval(function(){
				$.each(selectQueue, function(){
					//解决bug，火狐下selectIndex会随菜单项滑动而变化
					if((activeElement || document.activeElement) !== this){
						modifyText(this);
					}
				});
			}, 200);
		}
	}

	$.fn.selectui = function(){
		return this.each(function(){

			var modifyTextTimer,
				select = $(this),
				selectui = select.closest(".select_ui");

			if(select.css("display") !== "none"){

				//给select标签加包裹
				if(!selectui.length){
					selectui = create("select_ui", "span");
				}

				//监听可能改变select选中项的事件
				select.bind("change propertychange DOMAttrModified DOMNodeInserted DOMNodeRemoved keypress", function(e){
					//利用定时器过滤多次事件触发，短时间内只运行最后一次
					clearTimeout(modifyTextTimer);
					var select = this;
					modifyTextTimer = setTimeout(function(){
						modifyText(select);
					}, 10);
				}).each(function(){
					modifyText(this);
				});
				if( fixie ) {
					//IE6、7中模拟select，并非原生
					fixie(selectui, this);
				} else {
					//其他浏览器添加焦点态样式即可
					select.focus(function(e){
						selectui.addClass("select_focus_ui");
					}).blur(function(e) {
						selectui.removeClass("select_focus_ui");
					});
				}

				startInterval(this);
			}
		});
	};

	$(function(){
		if(document.querySelector){
			$("select").selectui();
		} else {
			//ie6，7下，用户中心页面中，不在这里调用该插件，而在Jumei.Usercenter.ie.js来调用，以便减小界面闪动
			$("select:not(.profile select)").selectui();
		}
	});
})(jQuery);
