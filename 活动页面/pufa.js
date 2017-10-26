//解决Android某些版本click事件会发生2次的问题
document.addEventListener('click', function(eventObj){
	var curTime = (new Date()).getTime();
	if(window.lastClickEventTime != undefined 
		&& (curTime - window.lastClickEventTime) <= 600) {
		eventObj.stopPropagation();
	}
	
	window.lastClickEventTime = (new Date()).getTime();
}, true);