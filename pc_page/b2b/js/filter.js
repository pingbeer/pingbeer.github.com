$(document).ready(function(){
			
	$("#select1 a").click(function () {
		$(this).addClass("current").siblings().removeClass("current");
		if ($(this).hasClass("select-all")) {
			$("#select-1").remove();
		} else {
			var copyThisA = $(this).clone();
			if ($("#select-1").length > 0) {
				$("#select-1").html($(this).text());
			} else {
				$(".select-result").append(copyThisA.attr("id", "select-1"));
			}
		}
	});
	$("#select2 a").click(function () {
		$(this).addClass("current").siblings().removeClass("current");
		if ($(this).hasClass("select-all")) {
			$("#select-2").remove();
		} else {
			var copyThisB = $(this).clone();
			if ($("#select-2").length > 0) {
				$("#select-2").html($(this).text());
			} else {
				$(".select-result").append(copyThisB.attr("id", "select-2"));
			}
		}
	});
	$("#select3 a").click(function () {
		$(this).addClass("current").siblings().removeClass("current");
		if ($(this).hasClass("select-all")) {
			$("#select-3").remove();
		} else {
			var copyThisC = $(this).clone();
			if ($("#select-3").length > 0) {
				$("#select-3").html($(this).text());
			} else {
				$(".select-result").append(copyThisC.attr("id", "select-3"));
			}
		}
	});
	$("#select4 a").click(function () {
		$(this).addClass("current").siblings().removeClass("current");
		if ($(this).hasClass("select-all")) {
			$("#select-4").remove();
		} else {
			var copyThisC = $(this).clone();
			if ($("#select-4").length > 0) {
				$("#select-4").html($(this).text());
			} else {
				$(".select-result").append(copyThisC.attr("id", "select-4"));
			}
		}
	});
	$("#select5 a").click(function () {
		$(this).addClass("current").siblings().removeClass("current");
		if ($(this).hasClass("select-all")) {
			$("#select-5").remove();
		} else {
			var copyThisC = $(this).clone();
			if ($("#select-5").length > 0) {
				$("#select-5").html($(this).text());
			} else {
				$(".select-result").append(copyThisC.attr("id", "select-5"));
			}
		}
	});
	
	
	$("#select-1").live("click", function () {
		$(this).remove();
		$("#select1 .select-all").addClass("current").siblings().removeClass("current");
	});
	$("#select-2").live("click", function () {
		$(this).remove();
		$("#select2 .select-all").addClass("current").siblings().removeClass("current");
	});
	$("#select-3").live("click", function () {
		$(this).remove();
		$("#select3 .select-all").addClass("current").siblings().removeClass("current");
	});
	$("#select-4").live("click", function () {
		$(this).remove();
		$("#select4 .select-all").addClass("current").siblings().removeClass("current");
	});
	$("#select-5").live("click", function () {
		$(this).remove();
		$("#select5 .select-all").addClass("current").siblings().removeClass("current");
	});
	
	$(".filter-box a").live("click", function () {
		if ($(".select-result a").length > 0) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
	});
	
	$(".filter-loadmore a").live("click", function () {
		if ($(this).hasClass("ups")) {
			$(this).removeClass("ups").html("更多选项");
			$(".filter-box .filter-gshow").hide();
		}else{
			$(this).addClass("ups").html("收起");
			$(".filter-box .filter-gshow").show();
		}
	});
	
});