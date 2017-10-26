/**
 * 遮罩层
 * @param _cursorStyle 鼠标样式
 *  cursour一般有如下值:
 *      default 默认光标（通常是一个箭头）
 *      auto  默认。浏览器设置的光标。
 *      pointer 光标呈现为指示链接的指针（一只手）
 *      move  此光标指示某对象可被移动(带四个箭头的十字)。
 *      text  此光标指示文本。
 *      wait  此光标指示程序正忙（通常是转圈或一只表）。
 *      progress通常是鼠标箭头右上方转圈
 *      help  此光标指示可用的帮助（通常是鼠标箭头右下方一个问号或一个气球）
 * @param _zindex 设置遮罩层的堆叠顺序。拥有更高堆叠顺序的元素总是会处于堆叠顺序较低的元素的前面。
 * @returns {Mask}
 */
function Mask(_cursorStyle,_zindex){
    this.cursorStyle = _cursorStyle ? _cursorStyle : "wait";
    this.zIndex = _zindex ? _zindex : 10;
    var mask;
    /**
     * 显示遮罩层
     * @param isShowCursor 是否显示光标样式
     */
    this.show = function (isShowCursor) {
        if(mask){
            mask.show();//jQuery显示方法
        }

        //创建用于遮罩的div层
        mask = $("<div/>");
        mask.css("position","absolute");
        mask.css("z-index",this.zIndex);
        //设置遮罩层全屏
        mask.css("top",0);
        mask.css("left",0);
        mask.css("width",$(document).width());
        mask.css("height",$(document).height());
        mask.css("background","#000");
        //设置遮罩层的透明度(filter只针对于IE)
        mask.css("filter","alpha(opacity=30)");
        mask.css("opacity","0.3");

        /*var img = $("<img src='images/loading.gif' />");
        img.css("display","block");
        img.css("padding-top","25%");
        img.appendTo(mask);*/

        $("body").append(mask);
        if(isShowCursor){
            mask.css("cursor",this.cursorStyle);
        }else{
            mask.css("cursor","auto");
        }
    };
    /**
     * 隐藏遮罩层
     */
    this.hide = function () {
      if(mask){
        mask.css("cursor","default");
          mask.hide();
      }
    };
    /**
     * 关闭遮罩层
     */
    this.close = function () {
        if(mask){
          mask.css("cursor","default");
            mask.remove();
        }
    };
    /**
     * 遮罩层样式设置与取值
     * @param cssAttr 样式属性
     * @param cssVal 样式值
     * @returns {*} 无 || 样式值
     */
    this.css = function (cssAttr,cssVal) {
        if(cssAttr && cssVal){
            mask.css(cssAttr,cssVal);
        }else if(cssAttr && !cssVal){
            return mask.css(cssAttr);
        }
    };
}