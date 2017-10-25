function Simple1DNoise(){
for(var t=256,e=t-1,n=1,i=1,o=[],a=0;t>a;++a)o.push(Math.random());
var s=function(t){
var a=t*i,s=Math.floor(a),r=a-s,c=r*r*(3-2*r),l=s&e,h=l+1&e,m=d(o[l],o[h],c);
return m*n;
},d=function(t,e,n){
return t*(1-n)+e*n;
};
return{
getVal:s,
setAmplitude:function(t){
n=t;
},
setScale:function(t){
i=t;
}
};
}
function preloadImg(){
var t=!1,e=!1;
if(maxMobileWidth>windowWidth){
var n=document.getElementById("wap_banner_img_before"),i=document.getElementById("wap_banner_img_after");
t=n.complete,e=i.complete,t&&e?setTimeout(function(){
imgAnimate();
},0):t?i.onload=function(){
imgAnimate();
}:e?n.onload=function(){
imgAnimate();
}:(n.onload=function(){
t=!0,e&&imgAnimate();
},i.onload=function(){
e=!0,t&&imgAnimate();
});
}else bannerWebShowImg.classList.add("show"),imgAnimate();
}
function imgAnimate(){
maxMobileWidth>windowWidth?(Array.prototype.forEach.call($bannerImages,function(t){
t.style["-webkit-transform"]="translate3d(0 , 0 , 0)",t.style.transform="translate3d(0 , 0 , 0)";
}),$bannerImages[0].addEventListener("transitionEnd",function(){},!1),$bannerImages[0].addEventListener("webkitTransitionEnd",function(t){
t.target.removeEventListener(t.type,arguments.callee),initAnimate(),showMainText(),
t.preventDefault();
},!1)):(bannerWebShowImg.classList.add("webshowimg"),bannerWebShowImg.addEventListener("transitionEnd",function(){},!1),
bannerWebShowImg.addEventListener("webkitTransitionEnd",function(t){
t.target.removeEventListener(t.type,arguments.callee),initAnimate(),t.preventDefault();
},!1));
}
function transitionEvnetHandler(){}
function showBgImg(){
Array.prototype.forEach.call($bannerImages,function(t){
t.style["-webkit-transform"]="translate3d(0 , 0 , 0)",t.style.transform="translate3d(0 , 0 , 0)";
}),$bannerImages[0].addEventListener("transitionEnd",function(){},!1),$bannerImages[0].addEventListener("webkitTransitionEnd",function(t){
t.target.removeEventListener(t.type,arguments.callee),initDots(),showMainText(),
t.preventDefault();
},!1);
}
function init(){
maxMobileWidth=1024,devicePixelRatio=window.devicePixelRatio?window.devicePixelRatio:1,
webBannerHeight=492,webBannerWrpWidth=1080,webCanvasHeight=webBannerHeight*devicePixelRatio,
windowWidth=window.innerWidth,windowHeight=window.innerHeight,canvas=document.getElementById("bubbles"),
canvasWidth=windowWidth*devicePixelRatio,scaleEvent=!1,swiperCreated=!1,maxMobileWidth>windowWidth?(dotsNum=windowHeight/16,
bannerText=document.getElementById("js_banner_text"),$bannerImages=document.querySelectorAll(".js_banner_img"),
stepContainer=document.getElementById("js_step_container"),bannerNotice=document.getElementById("js_banner_notice"),
bannerMask=document.getElementById("js_banner_mask"),bannerImgMoveContainer=document.getElementById("js_banner_move_container"),
touchEventElement=document.getElementById("js_bind_event"),touchEventElement.addEventListener("touchmove",touchMove,!1),
touchEventElement.addEventListener("touchstart",touchStart,!1),touchEventElement.addEventListener("touchend",touchEnd,!1),
containWidth=windowWidth*devicePixelRatio,canvasHeight=windowHeight*devicePixelRatio,
canvas.style.height=windowHeight+"px",canvas.style.width=windowWidth+"px",canvas.style.left=0,
canvas.height=canvasHeight,canvas.width=canvasWidth):(dotsNum=30,bannerWebShowImg=document.getElementById("js_banner_move_container"),
containWidth=578*devicePixelRatio,canvasHeight=webCanvasHeight,canvas.style.height=webBannerHeight+"px",
canvas.style.width=windowWidth+"px",canvas.style.left=(0>-1*(windowWidth-webBannerWrpWidth)/2?-1*(windowWidth-webBannerWrpWidth)/2:0)+"px",
canvas.height=canvasHeight,canvas.width=canvasWidth),colors=[{
r:8,
g:187,
b:7
},{
r:255,
g:137,
b:0
},{
r:255,
g:190,
b:0
},{
r:41,
g:140,
b:235
},{
r:255,
g:255,
b:255
}],window.addEventListener("resize",canvasResize,!1),touchPos={
start:{
x:0,
y:0
},
end:{
x:0,
y:0
}
};
}
function initDots(){
for(dotsHolder=[],i=10;dotsNum+10>i;i++)dotsHolder.push(new dots);
}
function clearDots(){
dotsHolder=[];
}
function initAnimate(){
context=canvas.getContext("2d"),initDots(),animate();
}
function showMainText(){
if(!bannerImgMoveContainer.classList.contains("scale")){
var t="translate3d(0 , 0 , 0)";
bannerText.classList.contains("hide")&&bannerText.classList.remove("hide"),bannerText.classList.add("show"),
bannerText.style["-webkit-transform"]=t,bannerText.style.transform=t,bannerText.addEventListener("transitionEnd",function(){},!1),
bannerText.addEventListener("webkitTransitionEnd",function(t){
t.target.removeEventListener(t.type,arguments.callee),bannerNotice.style.display="block";
},!1);
}
}
function initRAF(){
!function(){
for(var t=0,e=["ms","moz","webkit","o"],n=0;n<e.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[e[n]+"RequestAnimationFrame"],
window.cancelAnimationFrame=window[e[n]+"CancelAnimationFrame"]||window[e[n]+"CancelRequestAnimationFrame"];
window.requestAnimationFrame||(window.requestAnimationFrame=function(e){
var n=(new Date).getTime(),i=Math.max(0,21-(n-t)),o=window.setTimeout(function(){
e(n+i);
},i);
return t=n+i,o;
}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){
clearTimeout(t);
});
}();
}
function canvasResize(){
windowWidth=window.innerWidth,canvas.style.width=windowWidth+"px",canvas.style.left=(0>-1*(windowWidth-webBannerWrpWidth)/2?-1*(windowWidth-webBannerWrpWidth)/2:0)+"px",
canvas.width=windowWidth*devicePixelRatio,cancelAnimationFrame(animate),initDots();
}
function touchStart(t){
touchPos.start.x=t.changedTouches[0].pageX,touchPos.start.y=t.changedTouches[0].pageY;
}
function touchMove(t){
var e={};
e.x=t.changedTouches[0].pageX,e.y=t.changedTouches[0].pageY;
var n=e.y-touchPos.start.y;
if(0>n){
var i="translate3d(0,"+-1*n+"px, 0)";
Array.prototype.forEach.call($bannerImages,function(t){
t.style["-webkit-transform"]=i,t.style.transform=i;
}),bannerText.classList.remove("show"),bannerText.classList.add("hide"),bannerText.style["-webkit-transform"]="translate3d(0,"+n+"px, 0)",
bannerText.style.transform="translate3d(0,"+n+"px, 0)";
}
t.preventDefault();
}
function touchEnd(t){
touchPos.end.x=t.changedTouches[0].pageX,touchPos.end.y=t.changedTouches[0].pageY;
var e=touchPos.end.y-touchPos.start.y,n="translate3d(0 , 0 , 0)";
0>e&&(-50>e?(n="translate3d(0 , 100% , 0)",Array.prototype.forEach.call($bannerImages,function(t){
t.style["-webkit-transform"]=n,t.style.transform=n;
}),bannerText.classList.contains("opacity")&&bannerText.classList.remove("opacity"),
bannerImgMoveContainer.classList.add("scale"),bannerNotice.style.display="none",
bannerMask.style.display="block",bannerMask.classList.add("show"),scaleEvent=!0,
touchEventElement.removeEventListener("touchmove",touchMove),touchEventElement.removeEventListener("touchstart",touchStart),
touchEventElement.removeEventListener("touchend",touchEnd),stepContainer.style.display="block",
swiperCreated||createSwiper(),stepContainer.classList.add("show"),stepContainer.style["-webkit-transform"]="translate3d(0 , 0 , 0)",
stepContainer.style.transform="translate3d(0 , 0 , 0)"):(Array.prototype.forEach.call($bannerImages,function(t){
t.style["-webkit-transform"]=n,t.style.transform=n;
}),bannerText.classList.add("opacity"),bannerText.style["-webkit-transform"]=n,bannerText.style.transform=n)),
t.preventDefault();
}
function createSwiper(){
swiperCreated=!0;
new Swiper;
}
function dots(){
maxMobileWidth>windowWidth?(this.radius=(.07*Math.random()+.03)*windowWidth*devicePixelRatio,
this.radius2=2*this.radius,this.leftGap=.175*windowWidth*devicePixelRatio,this.startWidth=.735*windowWidth*devicePixelRatio,
this.xPos=this.leftGap+this.radius+Math.random()*(this.startWidth-2*this.radius),
this.yPos=-.61*(this.xPos-this.leftGap)+windowHeight*devicePixelRatio+windowHeight*devicePixelRatio*Math.random(),
this.vx=0,this.vy=-1*(1/this.radius)*40*(.3+.7*Math.random())*devicePixelRatio*devicePixelRatio,
this.vya=0):(this.radius=(37*Math.random()+21)*devicePixelRatio,this.radiusPlus=5,
this.leftGap=(windowWidth-1080)/2>0?((windowWidth-1080)/2+105)*devicePixelRatio:105*devicePixelRatio,
this.startWidth=405*devicePixelRatio,this.xPos=this.leftGap+this.radius+Math.random()*(this.startWidth-2*this.radius),
this.yPos=-.61*(this.xPos-this.leftGap)+420*devicePixelRatio+400*devicePixelRatio*Math.random(),
this.yMidPos=this.yPos-100,this.vx=0,this.vy=-1*(1/this.radius)*75*(.3+.7*Math.random())*devicePixelRatio,
this.vya=0),this.color=colors[Math.floor(Math.random()*colors.length)],this.fillOpacity=Math.floor(2*Math.random()+6)/10,
this.strokeOpacity=1,this.opacityDiff=.03,this.fillColor="rgba("+this.color.r+","+this.color.g+","+this.color.b+","+this.fillOpacity+")",
this.strokeColor="rgba("+this.color.r+","+this.color.g+","+this.color.b+","+this.strokeOpacity+")",
this.lineWidth=devicePixelRatio,this.i=0,this.generator=new Simple1DNoise;
}
function animate(){
requestAnimationFrame(animate),dots.draw();
}
window.onload=function(){
init(),initRAF(),preloadImg();
},dots.prototype._initRadius=function(){
var t=this;
maxMobileWidth>windowWidth?(t.radius=(.07*Math.random()+.03)*windowWidth*devicePixelRatio,
t.radius2=2*t.radius):t.radius=(37*Math.random()+21)*devicePixelRatio;
},dots.prototype._resetLoopPos=function(){
var t=this;
t.yPos=canvas.height+t.radius,t.xPos=t.leftGap+t.radius+Math.random()*(t.startWidth-2*t.radius);
},dots.draw=function(){
context.clearRect(0,0,canvas.width,canvas.height);
for(var t=0;t<dotsHolder.length;t++)dot=dotsHolder[t],context.beginPath(),dot.i+=.01,
scaleEvent?(dot.radius<dot.radius2?(dot.radius+=dot.radius/20,dot.vx+=dot.vx/20,
dot.vy+=dot.vy/20):(dot.vx=1.5*(dot.generator.getVal(dot.i)-.5)*devicePixelRatio,
dot.vy=1.5*(dot.generator.getVal(dot.i+2)-.5)*devicePixelRatio),t%2||(dot.xPos+=dot.vx,
dot.yPos+=dot.vy,context.arc(dot.xPos,dot.yPos,dot.radius,0,2*Math.PI,!1),context.fillStyle=dot.fillColor,
context.fill(),context.strokeStyle=dot.strokeColor,context.closePath(),context.lineWidth=dot.lineWidth,
context.stroke())):(dot.vx=2*(dot.generator.getVal(dot.i)-.5)*devicePixelRatio,dot.vy=-1*(1/dot.radius)*40*(.3+.7*Math.random())*devicePixelRatio*devicePixelRatio,
dot.xPos<dot.leftGap+dot.radius&&dot.yPos>canvasHeight-.37*containWidth-dot.radius&&dot.vx<0&&(dot.vx=-1*dot.vx),
dot.xPos>dot.leftGap+dot.startWidth-dot.radius&&dot.yPos>canvasHeight-.51*containWidth-dot.radius&&dot.vx>0&&(dot.vx=-1*dot.vx),
dot.xPos+=dot.vx,dot.yPos+=dot.vy,dot.yPos<-1*dot.radius&&(dot._resetLoopPos(),dot._initRadius()),
context.arc(dot.xPos,dot.yPos,dot.radius,0,2*Math.PI,!1),context.fillStyle=dot.fillColor,
context.fill(),context.strokeStyle=dot.strokeColor,context.closePath(),context.lineWidth=dot.lineWidth,
context.stroke());
};