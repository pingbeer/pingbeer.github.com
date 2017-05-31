/**
 * Created by daiem on 2017/5/12.
 * 检测当前页面网络状态
 */
window.mg_online = true;
window.dropload_refresh = '下拉刷新...';
window.dropload_update = '释放刷新...';
window.dropload_load = '加载中...';
var EventUtil={
    addHandler:function(element,type,handler){
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        }else if(element.attachEvent){
            element.attachEvent("on"+type,handler);
        }else{
            element["on"+type] = handler;
        }
    }
};
EventUtil.addHandler(window,"online",function(){
    window.mg_online = true;// 有网络
    window.dropload_refresh = '下拉刷新...';
    window.dropload_update = '释放刷新...';
    window.dropload_load = '加载中...';
    if(mydropload && typeof(mydropload) == "function")mydropload();
});
EventUtil.addHandler(window, "offline", function(){
    window.mg_online = false;// 无网络
    window.dropload_refresh = '无网络连接!';
    window.dropload_update = '无网络连接!';
    window.dropload_load = '无网络连接!';
    if(mydropload && typeof(mydropload) == "function")mydropload();
});