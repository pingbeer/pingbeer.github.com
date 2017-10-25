$(function(){
	//侧栏浮动
	$(window).scroll(function(){
		if ($(window).scrollTop()>10){
			$(".rbar-linkb").animate({ bottom: '0' });
		}else{
			$(".rbar-linkb").animate({ bottom: '-35px' });
		}
	});
	$(".rbar-link > li").hover(function(){
			$(this).find("h1").show();
			$(this).find("h1").stop().animate({ left: '-73px',opacity:'1'});
		}, function() {
			$(this).find("h1").hide();
			$(this).find("h1").stop().animate({ left: '-90',opacity:'0'});  
	});
	//placeholder插件
	$('input, textarea').placeholder();
	//顶部二维码显示隐藏
	$(".mobile-box").hover(function(){
			$(".mobile-ewm").show();
		}, function() {
			$(".mobile-ewm").hide(); 
	});
	$(".mobile-ewm").hover(function(){
			$(this).show();
			$(".mobile-box a").addClass("current");
		}, function() {
			$(this).hide();
			$(".mobile-box a").removeClass("current"); 
	});
});
/* 商品详情页数量控制 */
var setAmount = {
    min: 1,
    max: 999,
    reg: function(x) {
        return new RegExp("^[1-9]\\d*$").test(x);
    },
    amount: function(obj, mode) {
        var x = $(obj).val();
        if (this.reg(x)) {
            if (mode) {
                x++;
            } else {
                x--;
            }
        } else {
            alert("请输入正确的数量!");
            $(obj).val(1);
            $(obj).focus();
        }
        return x;
    },
    reduce: function(obj, id) {
        var x = this.amount(obj, false);
        if (x >= this.min) {
            $(obj).val(x);
            recalc();
        } else {
            alert("商品数量最少为" + this.min);
            $(obj).val(1);
            $(obj).focus();
        }
    },
    add: function(obj,id) {
        var x = this.amount(obj, true);
        if (x <= this.max) {
            $(obj).val(x);
            recalc();
        } else {
            alert("商品数量最多为" + this.max);
            $(obj).val(999);
            $(obj).focus();
        }
    },
    modify: function(obj) {
        var x = $(obj).val();
        if (x < this.min || x > this.max || !this.reg(x)) {
            alert("请输入正确的数量!");
            $(obj).val(1);
            $(obj).focus();
        }
    }
}