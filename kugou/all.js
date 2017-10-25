//歌曲列表
var Zzx = function(o){
	this.setting     = (typeof o === 'object') ? o : {};
	this.target 	 = this.setting.target || 'newSong';
	this.type        = typeof this.setting.type === 'number' ? this.setting.type : parseInt(this.setting.type);
	this.firstCount  = typeof this.setting.firstCount === 'number' ? this.setting.firstCount : parseInt(this.setting.firstCount);
	this.Count  	 = typeof this.setting.Count === 'number' ? this.setting.Count : parseInt(this.setting.Count);
	this.content     = $("#content");					
	//初始化
	this.init();		
}

Zzx.prototype ={
	init:function(){
		//列表初始化
		this.content.html("");
		//堆栈指针初始化
		this.stack = 0;
		//图片路径
		this.imgPath = '';		
		//定时器
		this.timer = null;			
		//测试JSON数据（可以替换为AJAX请求返回值）
		this.testJson = {
						list:[
							
								{src:"./logo.png",title:"让泪化作相思雨",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_ae15a7ea82f24014b2e447230b01641a.f1110.m4a?vkey=074FAA43EBB42D8445D6C631ADA20965696A0D3764D2F08473798E15F303C82BECFF005B40C14744201BA356FE68940CF5C1374FDD0B4CDBAC40D28578591023197B8B3106FBCDDE5E21DCE2B1FCD87BE7E978D8E661C2D0&sha=851b3ee0dd48f17999bacbecea5ddebecb78d366&ocid=123456&fromtag=1507&sdtfrom=v1507"},
								{src:"./logo.png",title:"相思赋予谁",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_42749911f29540a79e1568efeab446e5.f1110.m4a?vkey=D07BA3845460E71EE02DEE0112A049D205E6FCDDD52F65DF82CAD01FD3B7DAE1E474A810ADBB82D4C5E31DF1D734F9944518628FCA9B9BC395250EFFBE7D2E2AB19F141326454BF784C95D4874C85A179A9A2A27BF609D05&amp;sha=6b758da7417b92bea84a3522cf37a998d31d3e88&amp;ocid=123456&amp;fromtag=1507&amp;sdtfrom=v1507"},
								{src:"./logo.png",title:"断桥残雪",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_8fadda93d2e84a6f8ad32bb315d59c87.f1110.m4a?vkey=6869A1B4146E010CF29C531B26F8F3CEB4A0FD6D54A241DA65C15785C718D5E6CA4DA38C757068CB403F5C4570B96566583E17C599075807C03A006A65CDC2029C7606EA97D465A1188DD33D45C803B7726B6C22C6C29D1A&sha=60de6bbc5d12a4ba4e08dca93acd0ca6ea0709e6&ocid=123456&fromtag=1507&sdtfrom=v1507"},
								{src:"./logo.png",title:"穷开心",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_73c02b4ad73f4265a79c296a7ba245ed.f1110.m4a?vkey=33D015F397D172F05C006C639411F95BAA93814661348F6D2680FCF9BF706D821F9D23BC2706B732239A2F72E0B3F2B2D8FDF3780803C34F1D7E75E050B46B418C79C4A9E401F6BB7CD0DBEF0498D281A71AFED44CBD2349&amp;sha=05a63335d3afe449521340068bb149aeaa8d1ae2&amp;ocid=123456&amp;fromtag=1507&amp;sdtfrom=v1507"},
								{src:"./logo.png",title:"东风破",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_cfca09a2bbf64d1bbd698455786bf03f.f1110.m4a?vkey=B45289CF0CD7DE916DA586A93DF9F22A64AD0296DC8FB7AD8939E94ACBD6E509182F4EC1DA7C2603DFA800E84C0F01E9821E523CABD99FC44B99575B0F1D7C9F9DA5DFBD785A42A4B1D1EE70D507ABEB0641363B5144C62E&amp;sha=7e9ca745156d1d74570c0cef7a7648fd972c444c&amp;ocid=123456&amp;fromtag=1507&amp;sdtfrom=v1507"},
								{src:"./logo.png",title:"昆明湖",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_b0171cfe1f2b465f891e8f7e22ad0009.f1110.m4a?vkey=BE8B8921F972FF7D24F809D27C796F218DE3E72F7D89992536D557F434D1AFF44E39C4510B28891BFC0373798905A262D712796C198B7A4B3EE2789A5E3CDA719503E44D1143A95406498B7F91D90B596C6734C0BC930D9F&amp;sha=386df2906eff482db54eb6c5a20a5cf0730d6cf1&amp;ocid=123456&amp;fromtag=1507&amp;sdtfrom=v1507"},
								{src:"./logo.png",title:"包容",author:"合唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_98aa7cd1553a41969424857872519ab0.f0.m4a?vkey=9A58B9D284A004C9F3175BCA0C42602903064C7FE376BA12FEE99A89BE3A3A499736871CB5F1E1FB9AFE2460ABE3BCEF8ED4C5EBF8712EF617131913E5898C2AA9698C34D58A864C26399BBE872E4A5DD8C19FF08FDEB9F1&amp;sha=e6390da1a3258077e4e2b2c4275c141426c89ca5&amp;ocid=123456&amp;fromtag=1506&amp;sdtfrom=v1506"},
								{src:"./logo.png",title:"本草纲目",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_8287dfeda1fd48398b188efa1cfbfaa3.f1110.m4a?vkey=548CE32979AE2EBDAA39C1BDC0ADB4F90D9542BFC744F375F42EB8FBA2CF9DCD69467C3C9523B1A9CA7B3B3A4FDB4C12EBFE1B6FF39C8DE5CB13BF556A3517E42BFA7592D0BF30F398F90BB04CFA77405434E313EFA8FDF3&amp;sha=5ddba7051ef4e1341c0a861b97a78e50a4437c84&amp;ocid=123456&amp;fromtag=1507&amp;sdtfrom=v1507"},
								{src:"./logo.png",title:"得到你的人却得不到你的心",author:"合唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_bdc9e140b2344668982743790e6927e3.f0.m4a?vkey=897BAF2455C7B573FD36555C284CB0B6E1386A80F9AE90DACDD5C2E5DBF0AE534FA93C2A36E99C227F82F7CBFE048784C173D951EB82163C9E01012FB9139DD4DD3622EA113701284C1F104236B28CE50986F201581463C4&amp;sha=6857ce59524ed7c2601356aad29eec580bc5b0df&amp;ocid=123456&amp;fromtag=1506&amp;sdtfrom=v1506"},
								{src:"./logo.png",title:"缘分",author:"翻唱",song:"http://ws.stream.kg.qq.com/vcloud1021.tc.qq.com/1021_b017006c754f4e39b9bcce9921d77aff.f0.m4a?vkey=2D48AD59759D079136769B7A33B9C4122AD7A087855ACC7E3F608B6C5E771174F3F776B40FBEF993C6424362836B02288A0A267AF96346FB02E48DC3452A1535E0DC2562671F1D0BFAECBF58B941A3D4F6D73F6FF88DA839&amp;sha=cb651e168928d46f5f8e17939ce6303cfb2818a5&amp;ocid=123456&amp;fromtag=1506&amp;sdtfrom=v1506"}
							]
						}
		this.createList(true);
		this.addHandle();
	},
	
	//创建内容列表
	createList:function(boolen){		
		//boolen:true/false确定是否初次载入，
		this.ulNode = document.createElement("ul");
		this.ulNode.id = this.target+"list";
		this.content.append(this.ulNode);
		this.ulTarget = $("#"+this.ulNode.id);
		this.createMore();
		this.loadList(boolen);
	},
	
	//创建更多按钮
	createMore:function(){	
		this.moreNode = document.createElement("div");
		this.moreNode.className = 'm';
		this.moreNode.innerHTML = '更多';
		this.moreNode.id = this.target+'more';
		this.moreTarget = $("#"+this.moreNode.id);
	},
	
	//加载列表	
	loadList:function(boolen){		
		var oList = this.testJson.list;
		var oLength;		
		if(boolen){  //计算加载歌曲数
			oLength = oList.length > this.firstCount ? this.firstCount: oList.length;			
		}else{
			oLength = (oList.length-this.stack) > this.Count ? this.Count: (oList.length-this.stack);				
		}	
		if(oLength<=0){
			this.moreTarget.text("这是最后一页了！");
		};
		
		if(!this.moreTarget[0]){
			this.content.append(this.moreNode);				
		};
		
		for(var i = 0 ; i < oLength ; i++){				
			this.loadDate(oList);
		}
		
	},
	
	//加载列表数据	
	loadDate:function(oList){			
		switch(this.type){  
			//根据不同的模块 定制不同的数据展示形式
		
			case 1:	console.log(oList[this.stack].title);
			this.ulTarget.append('<li onclick="myControl.selectList(this,'+this.stack+')">'
									  + '<div class="frmPlay"><i></i></div>'
									  + '<span style="display:none;" class="musicData" pic='+oList[this.stack].src+' title="'+oList[this.stack].title+'"  value='+oList[this.stack].song+'></span>'
									  + '<div class="l"><img class="picStyle" src="'+this.imgPath+oList[this.stack].src+'"/></div>'
									  + '<div class="textBox">'+oList[this.stack].title+'<p>'+oList[this.stack].author+'</p></div>'
									  + '</li>');
										break;
										
			case 2:	
			if((Math.floor(Math.random()*9+1))%2==0){
					this.ulTarget.append('<li onclick="myControl.selectList(this,'+this.stack+')">'
									  + '<div class="frmPlay"><i></i></div>'
									  + '<span style="display:none;" class="musicData" pic='+oList[this.stack].src+' title="'+oList[this.stack].title+'"  value='+oList[this.stack].song+'></span>'
									  + '<div class="l"><img class="picStyle" src="'+this.imgPath+oList[this.stack].src+'"/></div>'
									  + '<div class="textBox">'+oList[this.stack].title+'<p>'+oList[this.stack].author+'</p></div>'
									  + '</li>');
			}else{
					this.ulTarget.prepend('<li onclick="myControl.selectList(this,'+this.stack+')">'
									  + '<div class="frmPlay"><i></i></div>'
									  + '<span style="display:none;" class="musicData" pic='+oList[this.stack].src+' title="'+oList[this.stack].title+'"  value='+oList[this.stack].song+'></span>'
									  + '<div class="l"><img class="picStyle" src="'+this.imgPath+oList[this.stack].src+'"/></div>'
									  + '<div class="textBox">'+oList[this.stack].title+'<p>'+oList[this.stack].author+'</p></div>'
									  + '</li>');
			}
										break;
			default :this.content[0].innerHTML  = '此模块建设中...';
		}
		this.stack+=1;
	},
	
	//绑定事件
	addHandle:function(){
		var that = this;
		$("#"+this.moreNode.id).bind('click',function(){
			//加载更多列表
			that.createList(false);
		});
	}
	
}
//播放器控制面板	
var Control = function(o){
	this.setting         = (typeof o === 'object')? o : {};		
	this.audio           = this.setting.audio;
	this.progressWrap    = this.setting.progressWrap;
	this.playModeNode    = this.setting.playModeNode;
	this.playBtn         = this.setting.playBtn;
	this.playTitle       = this.setting.playTitle;
	this.singerHead      = this.setting.singerHead;
	this.progress        = this.setting.progress;
	this.oWinObj         = this.setting.oWinObj;
	this.allTimeNode     = this.setting.allTimeNode;	  
	this.currentTimeNode = this.setting.currentTimeNode;  
	this.path            = 'media/';  //歌曲路径（相对于html）
	this.imgPath         = '';   //图片路径（相对于html）
	this.init();
}

Control.prototype = {	
	//初始化
	init:function(){
		//播放控制	
		this.start = true;
		//定时器
		this.timer = null;				
		this.audio.src = null;			
		//可选播放模式
		this.ModeData = [
			{mode:'default',text:'顺序播放模式'},
			{mode:'random',text:'随机播放模式'},
			{mode:'single',text:'单曲循环模式'}
		];
		//默认播放模式
		this.ModeIndex = 0;
		this.playMode = this.ModeData[this.ModeIndex].mode;	
	},
	
	//选择歌曲列表
	selectList:function(_this,stack){	
		var allow = true;
		var index = null;
		this.oLi = _this;
		this.oUl = _this.parentNode;	
		if(index == stack && !this.start ){
			allow = false;
		}
		index = stack;
		this.loadMusic();
		if(allow){
			this.goPlay();
		}else{
			this.goPause();
		}											
	},
	
	//上一首
	prev:function(){
		if(this.oLi.previousSibling!=null){	
			this.oLi = this.oLi.previousSibling;
			this.loadMusic();
		}else{
			this.oWindow("已经是第一首了哦！");
		}
		this.goPlay();
	},
	
	//主控
	mainControl:function(){
		if(this.start){
			this.goPlay();
		}else{
			this.goPause();
		}	
	},
	
	//下一首
	next:function(){
		if(this.oLi.nextSibling!=null){
			this.oLi = this.oLi.nextSibling;
			this.loadMusic();
		}else{
			this.oWindow("已经是最后一首了哦！")
		}
		this.goPlay();
	},
	
	//播放模式选择
	selectMode:function(){
		this.ModeIndex = (this.ModeIndex<(this.ModeData.length-1))?(this.ModeIndex+1):0;
		this.playMode = this.ModeData[this.ModeIndex].mode;
		this.oWindow(this.ModeData[this.ModeIndex].text);
		this.playModeNode.attr("class","mode-"+this.playMode);
	},
	
	//播放进度选择
	selectTime:function(event){
		var moveTo = event.pageX - this.progressWrap.offset().left;
		this.audio.currentTime = moveTo/parseInt(this.progressWrap.css("width"))*this.audio.duration;
		this.progress.css("width",moveTo+"px");
	},
	
	//自动播放
	autoPlay:function(){
		//监听歌曲结束
		var that = this;
		this.audio.addEventListener('ended', function () {
			if(typeof that.playMode==='string')
			{	//播放模式判断	
				switch(that.playMode){
					case 'default': that.oLi = (that.oLi.nextSibling!=null)?that.oLi.nextSibling:that.oUl.childNodes[0];
									break;
					 case 'random': that.oLi = that.oUl.childNodes[Math.round(Math.random()*(that.oUl.childNodes.length-1))];
									break;
					 case 'single': ;
						   default: ;
				}
				that.loadMusic();
				that.goPlay();
			}else{
				that.oWindow("循环类型不符!");		
			}
		},false);
	},
	
	//加载要播放的歌曲
	loadMusic:function(){
			$obj = $(this.oLi)
			var song = $obj.find(".musicData").attr("value");	
			var pic = $obj.find(".musicData").attr("pic");
			var title = $obj.find(".musicData").attr("title");
			this.singerHead.attr("src",this.imgPath + pic)
			this.audio.src =  song;
		//	this.audio.src = this.path + song +'.mp3';
		
			this.playTitle.html(title);
	},
	
	//判断当前是否歌曲列表
	songReady:function(){
		if(!this.audio.src){
			this.oWindow("请先选择歌曲！")
			return false;
		}else{
			return true;
		}
	},
	
	//转换为时间格式
	timeDispose:function (number) {
		var minute = parseInt(number / 60);
		var second = parseInt(number % 60);
		minute = minute >= 10 ? minute : "0" + minute;
		second = second >= 10 ? second : "0" + second;
		return minute + ":" + second;
	},	
	
	//自定义提示框
	oWindow:function(oText){
		this.oWinObj.show();
		this.oWinObj.html(oText);
		var doc = document.documentElement;
		var oWinX = (doc.clientWidth - this.oWinObj[0].offsetWidth)/2;
		var oWinY = (doc.clientHeight - this.oWinObj[0].offsetHeight-50)/2;
		this.oWinObj.css('left',oWinX+'px');
		this.oWinObj.css('top',oWinY+'px');
		var _this = this;
		setTimeout(function(){_this.oWinObj.hide();},1000)
	},
	
	//播放时间
	oTime:function(){
		if(this.audio.readyState >=4){
			var currentProgress = Math.round(this.audio.currentTime/this.audio.duration*parseInt(this.progressWrap.css("width")));
			this.progress.css("width",currentProgress+"px");
			this.allTimeNode.html(this.timeDispose(this.audio.duration));
			this.currentTimeNode.html(this.timeDispose(this.audio.currentTime));
		}
	},
	
	//播放
	goPlay:function(){
		if(this.songReady()){		
			this.audio.play();
			var _this = this;
			this.goPlayStyle();
			this.timer = setInterval(function(){_this.oTime()},1000)
			this.start = false;
			this.autoPlay();
		}
	},
	
	//暂停
	goPause:function(){
		this.audio.pause();
		this.goPauseStyle();
		clearInterval(this.timer);
		this.start = true;
	},
	
	//播放样式
	goPlayStyle:function(){
		var $oLiIndex = $(this.oLi);
		$(".frmPause").removeClass("frmPause");
		$oLiIndex.find(".frmPlay").addClass("frmPause");				
		this.playBtn.addClass("pause");
		this.playBtn.removeClass("play");
	},
	
	//暂停样式
	goPauseStyle:function(){
		var $oLiIndex = $(this.oLi);
		$(".frmPause").removeClass("frmPause");
		this.playBtn.addClass("play");
		this.playBtn.removeClass("pause");	
	}			
}

function ZzxMusic(){

	var aa={};
	//模块设置
	var setting = {
		newSong:{'target':'newSong','type':'1','firstCount':6,'Count':5},
		songCharts:{'target':'newSong','type':'2','firstCount':5,'Count':4},
		radioStation:{'target':'newSong','type':'2','firstCount':9,'Count':2}
	};
	
	//默认加载模块
	aa.newSong = new Zzx(setting.newSong);	
	
	//模块初始化
	$(".menu_tagList").children("li").bind('click',function(){
		for(var i in setting){
			if($(this).attr("id")==i){
				if(typeof aa[i]==='undefined'){
					aa[i] = new Zzx(setting[i]);
				}else{
					aa[i].init();
				}				
			}
		}
		$(".menu_hover").removeClass("menu_hover");
		$(this).addClass("menu_hover");
	})		
}

//实例化控制台
var myControl = new Control({
			 audio : document.getElementById("myMusic"), //播放器
	  playModeNode : $("#modeButton"),	 //模式选择按钮
		   playBtn : $("#playButton"),   //主控按钮
		 playTitle : $("#musicTitle"),   //歌曲TITLE容器
		singerHead : $("#singerHead"),   //歌曲插图容器
	  progressWrap : $("#progressWrap"), //歌曲进度条容器
		  progress : $("#progress"),     //歌曲进度条
		   oWinObj : $("#oWindow"),		 //警告窗容器
	   allTimeNode : $("#totleTime"),    //当前时间容器
   currentTimeNode : $("#currentTime")   //当前时间容器
});	

ZzxMusic();	
