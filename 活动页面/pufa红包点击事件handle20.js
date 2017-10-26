$(function () {			
	$("#b3").click(function () {
		$('#my-confirm').modal({
			relatedTarget : this,
			onConfirm : function(options) {
				$('#button1').hide();
				$('#button2').hide();
				$('#text1').hide();				
			},
			onCancel : function() {
			
			}
		});
	
	});
	$("#b2").click(function () {
		$('#my-confirm1').modal({
			relatedTarget : this,
			onConfirm : function(options) {
				$('#button1').hide();
				$('#button2').hide();
				$('#text1').hide();	
			},
			onCancel : function() {
			
			}
		});
	
	});
	
})
function closeE(){	
	$('#my-confirm').hide();
	$.ajax({
		url:"MulOpenRedPackets?count=8",
		type:"post",		
		success:function(data){
			if("f"==data){				
				$('#button1').show();
				$('#button2').show();
				$('#text1').show();
				alert("您目前红包数量未满8个噢！");
			}else{			
				if('0'==data){
					window.location.href='redPacketResjsp';
				}else if("spe"==data){				
					window.location.href='speicalGiftjsp';
				}else if("45"==data){
					
					window.location.href='mysteryjsp';
				}else if("46"==data){
					
					window.location.href='goldFreejsp';
				}else if("47"==data){
					
					window.location.href='silveryFreejsp';
				}else if("00"==data){
					
					window.location.href='flowjsp';
				}else if("13"==data){
					
					window.location.href='birthdayjsp';				
				}else if("48"==data || "49"==data){
					//Apple专区立减权益 、Apple新品立减权益
					window.location.href='appleViewjsp';				
				}else if("50"==data || "51"==data){
					//第三套人民币珍藏版、第四套人民币珍藏版
					window.location.href='rmbCollectorViewjsp';				
				}else{
					
					window.location.href='neterror';
				}						
			}
		}		
	})
	
}


function closeT(){
	$('#my-confirm1').hide();
	$.ajax({
		url:"MulOpenRedPackets?count=20",
		type:"post",		
		success:function(data){
			if("f"==data){				
				$('#button1').show();
				$('#button2').show();
				$('#text1').show();
				alert("您目前红包数量未满20个噢！");
			}else{			
				if('0'==data){
					window.location.href='redPacketResjsp';
				}else if("spe"==data){				
					window.location.href='speicalGiftjsp';
				}else if("45"==data){
					
					window.location.href='mysteryjsp';
				}else if("46"==data){
					
					window.location.href='goldFreejsp';
				}else if("47"==data){
					
					window.location.href='silveryFreejsp';
				}else if("00"==data){
					
					window.location.href='flowjsp';
				}else if("13"==data){
					
					window.location.href='birthdayjsp';				
				}else if("48"==data || "49"==data){
					//Apple专区立减权益 、Apple新品立减权益
					window.location.href='appleViewjsp';				
				}else if("50"==data || "51"==data){
					//第三套人民币珍藏版、第四套人民币珍藏版
					window.location.href='rmbCollectorViewjsp';				
				}else{
					
					window.location.href='neterror';
				}						
			}
		}		
	})
}





$(function () {
	//var height = $(window).height(); 
	var buttonWidth = $("#button").width();
	var width = $("#button").width()*0.3;
	$("#b1").click(
			function() {
				$('#button1').empty();
				$('#button2').empty();													
				//setTimeout(function(){
				$("#form1").attr("action","SingleOpenRedPacketsPage");
				$("#form1").submit();
				//},2000);
				//$("#form1").attr("action","./StatusDistrubServlet.do?status=submit");
			    //$("#form1").submit();
	});
 
	
});



function giftRedPackets() {
	window.location.href = 'myCanGiftRedPackets';
}
function shakeRedPackets(Mul) {
	window.location.href = '/wxrp-page-shakepage/shakeIndex?shakePacketNums='+Mul;
}
function gloryRedPackets() {
	window.location.href = '/wxrp-page-glorypage/gloryIndex';
}
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
WeixinJSBridge.call('hideToolbar');
WeixinJSBridge.call('hideOptionMenu');
});

function show1(popupdiv) { 
var Idiv=document.getElementById(popupdiv);  
Idiv.style.display="block";  
//以下部分要将弹出层居中显示  
Idiv.style.left=(document.documentElement.clientWidth-Idiv.clientWidth)+document.documentElement.scrollLeft+"px";  
//Idiv.style.top=(document.documentElement.clientHeight-Idiv.clientHeight)/2+document.documentElement.scrollTop-50+"px"; 
Idiv.style.top=document.documentElement.scrollTop+"px";   
	document.body.style.overflow = "hidden"; //取消滚动条   
//setTimeout("closeDiv('popupdiv')",10000);
} 
function closeDiv(popupdiv) {  
var Idiv=document.getElementById(popupdiv);  
Idiv.style.display="none";  
document.body.style.overflow = "auto"; //恢复页面滚动条  
}

function regURL(){
var url = "/wxrp-page-registerpage/listCardRegister";
window.location.href = url;
}

