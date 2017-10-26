function addToCartCheck(){

return true;
    var result=$('td.sx').text();
    var sx = result.substring(0,result.length-1);
    sx = sx.replace(/：/g,',');
    var pdt_id = $('#pdt_id').val();
    var is_global_stock = $('#is_global_stock').val();
    var pdt_stock = parseInt($('#pdt_stock').val());
    var limited = parseInt($('#limited').val());
    var num = parseInt($('#item_num').val());
    var flag = 0;
    if(is_global_stock == '1'){
        var cr_id = parseInt($("#cr_ids").val());
        var cr_name = $('.province').html();
        if(isNaN(cr_id) || cr_name =='请选择配送区域'){
            $.ThinkBox.error("请选择配送区域");
            return false;
        }
    }
    /*
    if (isNaN(num)){

        $.ThinkBox.error(nullNum);
        return false;
    }
    if (num < 1){
        $.ThinkBox.error(nullNum);
        return false;
    }
  */
    if (pdt_stock < 1){
        $.ajax({
            url: "/Wap/Cart/ajaxGetStock",
            type : 'GET',
            data: "&pdt_id="+pdt_id,
            success: function(Sdata) {
                can_ajax = true;
                if(Sdata.status=='success'){

                    $('#pdt_stock').val(Sdata.stock);
                            pdt_stock = Sdata.stock;
                            flag = 1;
                                if (num > pdt_stock){
                                    $.ThinkBox.error(reselection);
                                    flag = 0;
                                    return false;
                                }
                                 if(limited){
                                    if (num > limited){
                                    $.ThinkBox.error("每人限购"+limited+"件");
                                    flag = 0;
                                    return false;
                                }
                                }
                                if (pdt_id == "" || pdt_stock == ""){
                                    $.ThinkBox.error("温馨提示：请返回选择您需要的"+sx+"!");
                                    flag = 0;
                                    return false;
                                }
                                if (pdt_id == ""){
                                    $.ThinkBox.error("温馨提示：请返回选择您需要的"+sx+"!");
                                    flag = 0;
                                    return false;
                                }
                }else {
                                $.ThinkBox.error(notEnough);
                                flag = 0;
                                return false;
                }
            },
            dataType : "json"
        });
    }else {
        if (num > pdt_stock){
            $.ThinkBox.error(reselection);
            return false;
        }
        if(limited){
                                    if (num > limited){
                                    $.ThinkBox.error("每人限购"+limited+"件");
                                    flag = 0;
                                    return false;
                                }
                    }

        if (pdt_id == "" || pdt_stock == ""){
            $.ThinkBox.error("温馨提示：请返回选择您需要的"+sx+"!");
            return false;
        }
        if (pdt_id == ""){
            $.ThinkBox.error("温馨提示：请返回选择您需要的"+sx+"!");
            return false;
        }
        return true;
    }
    if(flag == 0) {
        return false;
    }else {
        return true;
    }
}
function addToCart(){
    var shopid = $("#sid").val();
    var mid = $("#m_id").val();
     if ((shopid == 9 || shopid == 8) && mid == '') {
        document.getElementById('div1').style.display='block';
        document.getElementById('div2').style.display='block';
         $(document).on('touchmove',function(e){
            e.preventDefault();
        });
         var screenheight = document.documentElement.scrollTop || document.body.scrollTop;
         $("#mytable").css('margin-top',screenheight);
         $("#div1").height($("body").height());
        return;
    };
    if(!addToCartCheck()){
        return;
    }
    //发送ajax请求
    var data = $('#goodsForm').serialize();

        if (data != ''){
            $.post('/Wap/Cart/doAdd', data, function(dataMsg){
                if(dataMsg.status){
                    $.ThinkBox.success(dataMsg.info);
                }else{
                    $.ThinkBox.error(dataMsg.info);
                    location.href="/Wap/User/Login";
                }

            }, 'json');
    }
}
function addToCartPay(){
    var shopid = $("#sid").val();
    var mid = $("#m_id").val();
    var pids = $("#pdt_id").val();
    var seller_id = $("#shopid").val();
    var seller_nick = $("#shopname").val();
    var postUrl = $("#post_url").val();
       var st_ms_already = $("#st_ms_already").val();
    // alert(shopid);
    if ((shopid == 9 || shopid == 8) && mid == '') {
        document.getElementById('div1').style.display='block';
        document.getElementById('div2').style.display='block';
         $(document).on('touchmove',function(e){
            e.preventDefault();
        });
         var screenheight = document.documentElement.scrollTop || document.body.scrollTop;
         $("#mytable").css('margin-top',screenheight);
         $("#div1").height($("body").height());
        return;
    };
    if(!addToCartCheck()){
        return;
    }
    //发送ajax请求
    if ((shopid == 9 || shopid == 8)  && mid != '') {
    // if(st_ms_already == 1) {
    //         $.ThinkBox.error("秒杀还未开始！");
    //     return;
    // }
        var data = $('#goodsForm').serializeArray();
            $.ajax({
            url: '/Wap/Orders/specialajaxCheckOrder',
            cache:false,
            dataType:'json',
            data:{shopconfig:data,pid:pids, seller_id:seller_id, seller_nick:seller_nick},
            type:"POST",
            success:function(msgObj){
                if(msgObj.status == '1'){
                    // $("#cartForm").attr('action',postUrl);
                    // $("#cartForm").submit();
                    window.location.href=postUrl;
                }else{
                    showAlert(false,msgObj.info);
                }
            }
            });
            return;
        };
    var data = $('#goodsForm').serialize();
        if (data != ''){
            $.post('/Wap/Cart/doAdd', data, function(dataMsg){
                if(dataMsg.status){
                    location.href="/Wap/Cart/pageCartList";
                }else{
                //    alert(dataMsg);
                    // $.ThinkBox.error(dataMsg.info);
                    // location.href="/Wap/User/Login";
                }

            }, 'json');
    }
}
function buyNow(){
    if(!addToCartCheck()){
        return;
    }
    //发送ajax请求
    var data = $('#goodsForm').serialize();
        if (data != ''){
            data = data + '&skip=1';
            $.post('/Wap/Cart/doAdd',data,function(dataMsg){
                if(dataMsg.status){
                    $("#addOrderPid").val($('#pdt_id').val());
                    $("#addOrdertype").val('0');
                    $.ThinkBox.success(dataMsg.info);
                    $("#orderAddFrom").submit();
                }else{
                    $.ThinkBox.error(dataMsg.info);
                }
            },'json');
    }

}

//加入收藏夹
function addToCollect(){

    var pdt_id = $('#pdt_id').val();
    var m_id = $('#m_id').val();
    var pdt_stock = parseInt($('#pdt_stock').val());
    var num = parseInt($('#item_num').val());
    if (m_id == ""){
        showAlert(false, notLogin);
        return;
    }
    if (pdt_id == ""){
        showAlert(false, nonxEistent);
        return;
    }
    var data = {
        type:'item',
        pid:pdt_id
    };
    if (data != ''){
        ajaxReturn('/Ucenter/Collect/doAddCollect', data, 'post');
    }

}

//商品数量更改
function countNum(i){
    var _this = $("#item_num");
    var num=parseInt(_this.val());
    var max = $("#pdt_stock").val();
    if(max ==''){
        return false;
    }
    max = parseInt(max);
    num=num+i;
    //if((num<=0)||(num>max)||(num>999) || max==0 || max ==null){return false;}
    if((num<=0 ||(num>999) || max ==null)){
        return false;
    }

    _this.val(num);
    return false;
}

//选择规格
var MixPdtStock = 0;
function showSelect(obj){
    var _this = jQuery(obj);
    var item_id = $("#gid").val();
    var rate = $("#rate").val();
    var name = '';
    var cr_id = jQuery('#cr_ids').val();
    if(parseInt(cr_id) <= 0){
        $("#pdt_stock").val("");
        $("#pdt_id").val("");
        $("#showNum").html = "";
        $("#showError").html = "请勾选您要的商品信息";
    }
    if (_this && typeof _this == 'object'){
        name = _this.attr('name');
        $("#pdt_stock").val("");
        $("#pdt_id").val("");
        $("#showNum").html = "";
        $("#showError").html = "请勾选您要的商品信息";
    }
    var _item_id = jQuery('#' + item_id);
    if (_this.hasClass('on')){
        _this.removeClass("on");
        $("#pdt_stock").val("");
        $("#pdt_id").val("");
        $("#showNum").html = "";
        $("#showError").html = "请勾选您要的商品信息";
    } else{
        _this.siblings().removeClass("on");
        _this.addClass("on");
        var rsize = "";
        var showvalue = "";
        var _parent_color = jQuery("#sku" + item_id + '_1').find('a.on');
        var _parent_size = jQuery("#sku" + item_id + '_2').find('a.on');
        var color_len = _parent_color.length;
        var size_len = _parent_size.length;
        if (size_len > 0 && color_len > 0){
            $("#propError").html("");
            var color = "", size = "";
            color = _parent_color.attr('name');
            size = _parent_size.attr('name');
            if (color != '' && size != ''){
                var info = size + ";" + color;
                showvalue = arr[info]?arr[info]:"";
                var vale = showvalue.split("|");
                if (vale.length > 0){
                    if (vale[0]){
                        $("#pdt_id").val(vale[0]);
                    }
                    if(parseInt(vale[1]) < 30 && parseInt(vale[1])-MixPdtStock>0){
                        $("#pdt_stock").val(vale[1]);
                        if($("#item_num").val() <= 0){
                            $("#item_num").val(1);
                        }
                        $("#showNum").html("<strong style='font-size:14px;'>有货</strong>，仅剩余"+vale[1]+"件，下单后立即发货");
                    }else if(parseInt(vale[1]) > 30){
                        $("#pdt_stock").val(vale[1]);
                        if($("#item_num").val() <= 0){
                            $("#item_num").val(1);
                        }
                        $("#showNum").html("<strong style='font-size:14px;'>有货</strong>，下单后立即发货");
                    }else if(parseInt(vale[1])-MixPdtStock <= 0){
                        $("#pdt_stock").val(0);
                        $("#item_num").val(0);
                        $("#showNum").html("<strong style='font-size:14px;'>无货</strong>，此商品暂时售完");
                    }
                    if($("#item_num").val() > vale[1]){
                        if(vale[1]>0)
                        $("#item_num").val(1);
                        else
                        $("#item_num").val(0);
                    }
                    if (vale[2]){
                        $("#showPrice").html(parseFloat(vale[2]).toFixed(2));
                        $("#MarketPirice").html(parseFloat(vale[3]).toFixed(2));
                        $("#showPrice2").html(Math.ceil(rate*parseFloat(vale[2]).toFixed(2)));
                        $("#showMarketPirice").html(parseFloat(vale[3]).toFixed(2));
                        $("#savePrice").html(parseFloat(vale[3] - vale[2]).toFixed(2));
                        $("#discountPrice").html(parseFloat(((vale[2]/vale[3])*10).toFixed(2)));
                    }
                }
            }
        } else{
            var _parent_li = _this.parent().parent().find('a.on');
            rsize = _parent_li.attr('name');

            if (rsize != ""){
                var info = rsize;
                showvalue = arr[info];
                if (showvalue != undefined){
                    var vale = showvalue.split("|");
                    if (vale.length > 0){
                        if (vale[0]){
                            $("#pdt_id").val(vale[0]);
                        }
                        if(parseInt(vale[1]) < 30 && parseInt(vale[1])-MixPdtStock>0){
                            $("#pdt_stock").val(vale[1]);
                            $("#showNum").html("<strong style='font-size:14px;'>有货</strong>，仅剩余"+vale[1]+"件，下单后立即发货");
                        }else if(parseInt(vale[1]) > 30){
                            $("#pdt_stock").val(vale[1]);
                            $("#item_num").val(1);
                            $("#showNum").html("<strong style='font-size:14px;'>有货</strong>，下单后立即发货");
                        }else if(parseInt(vale[1])-MixPdtStock <= 0){
                            $("#pdt_stock").val(0);
                            $("#item_num").val(0);
                            $("#showNum").html("<strong style='font-size:14px;'>无货</strong>，此商品暂时售完");
                        }
                        if($("#item_num").val() > vale[1]){

                            $("#item_num").val(vale[1]);
                        }
                        if (vale[2]){
                            $("#showPrice").html(parseFloat(vale[2]).toFixed(2));
                            $("#MarketPirice").html(parseFloat(vale[3]).toFixed(2));
                            $("#showPrice2").html(Math.ceil(rate*parseFloat(vale[2]).toFixed(2)));
                            $("#showMarketPirice").html(parseFloat(vale[3]).toFixed(2));
                            $("#savePrice").html(parseFloat(vale[3] - vale[2]).toFixed(2));
                            $("#discountPrice").html(parseFloat(((vale[2]/vale[3])*10).toFixed(2)));
                        }
                    }else{
                        $("#pdt_stock").val(0);
                        $("#item_num").val(0);
                        $("#showNum").html("<strong style='font-size:14px;'>无货</strong>，此商品暂时售完");
                    }
                }else{
                    $("#pdt_stock").val(0);
                    $("#item_num").val(0);
                    $("#showNum").html("<strong style='font-size:14px;'>无货</strong>，此商品暂时售完");
                }
            }
        }
    }
}

function showSelect1(obj){
    var _this = jQuery(obj);
    var item_id = $("#gid").val();
    var name = '';
    var cr_id = jQuery('#cr_ids').val();
    if(parseInt(cr_id) <= 0){
        $("#pdt_stock").val("");
        $("#pdt_id").val("");
        $("#showNum").html = "";
        $("#showError").html = "请勾选您要的商品信息";
    }
    if (_this && typeof _this == 'object'){
        name = _this.attr('name');
        $("#pdt_stock").val("");
        $("#pdt_id").val("");
        $("#showNum").html = "";
        $("#showError").html = "请勾选您要的商品信息";
    }
    var _item_id = jQuery('#' + item_id);
    if (_this.hasClass('on')){
        _this.removeClass("on");
        $("#pdt_stock").val("");
        $("#pdt_id").val("");
        $("#showNum").html = "";
        $("#showError").html = "请勾选您要的商品信息";
    } else{
        _this.siblings().removeClass("on");
        _this.addClass("on");
        var rsize = "";
        var showvalue = "";
        var _parent_color = jQuery("#sku" + item_id + '_1').find('a.on');
        var _parent_size = jQuery("#sku" + item_id + '_2').find('a.on');
        var color_len = _parent_color.length;
        var size_len = _parent_size.length;
        if (size_len > 0 && color_len > 0){
            $("#propError").html("");
            var color = "", size = "";
            color = _parent_color.attr('name');
            size = _parent_size.attr('name');
            if (color != '' && size != ''){
                var info = size + ";" + color;
                showvalue = arr[info]?arr[info]:"";
                var vale = showvalue.split("|");
                if (vale.length > 0){
                    if (vale[0]){
                        $("#pdt_id").val(vale[0]);
                    }
                    if(parseInt(vale[1]) < 30 && parseInt(vale[1])-MixPdtStock>0){
                        $("#pdt_stock").val(vale[1]);
                        if($("#item_num").val() <= 0){
                            $("#item_num").val(1);
                        }
                        $("#showNum").html("<strong style='font-size:14px;'>有货</strong>，仅剩余"+vale[1]+"件，下单后立即发货");
                    }else if(parseInt(vale[1]) > 30){
                        $("#pdt_stock").val(vale[1]);
                        if($("#item_num").val() <= 0){
                            $("#item_num").val(1);
                        }
                        $("#showNum").html("<strong style='font-size:14px;'>有货</strong>，下单后立即发货");
                    }else if(parseInt(vale[1])-MixPdtStock <= 0){
                        $("#pdt_stock").val(0);
                        $("#item_num").val(0);
                        $("#showNum").html("<strong style='font-size:14px;'>无货</strong>，此商品暂时售完");
                    }
                    if($("#item_num").val() > vale[1]){
                        if(vale[1]>0)
                        $("#item_num").val(1);
                        else
                        $("#item_num").val(0);
                    }

                }
            }
        } else{
            var _parent_li = _this.parent().parent().find('a.on');
            rsize = _parent_li.attr('name');

            if (rsize != ""){
                var info = rsize;
                showvalue = arr[info];
                if (showvalue != undefined){
                    var vale = showvalue.split("|");
                    if (vale.length > 0){
                        if (vale[0]){
                            $("#pdt_id").val(vale[0]);
                        }
                        if(parseInt(vale[1]) < 30 && parseInt(vale[1])-MixPdtStock>0){
                            $("#pdt_stock").val(vale[1]);
                            $("#showNum").html("<strong style='font-size:14px;'>有货</strong>，仅剩余"+vale[1]+"件，下单后立即发货");
                        }else if(parseInt(vale[1]) > 30){
                            $("#pdt_stock").val(vale[1]);
                            $("#item_num").val(1);
                            $("#showNum").html("<strong style='font-size:14px;'>有货</strong>，下单后立即发货");
                        }else if(parseInt(vale[1])-MixPdtStock <= 0){
                            $("#pdt_stock").val(0);
                            $("#item_num").val(0);
                            $("#showNum").html("<strong style='font-size:14px;'>无货</strong>，此商品暂时售完");
                        }
                        if($("#item_num").val() > vale[1]){

                            $("#item_num").val(vale[1]);
                        }

                    }else{
                        $("#pdt_stock").val(0);
                        $("#item_num").val(0);
                        $("#showNum").html("<strong style='font-size:14px;'>无货</strong>，此商品暂时售完");
                    }
                }else{
                    $("#pdt_stock").val(0);
                    $("#item_num").val(0);
                    $("#showNum").html("<strong style='font-size:14px;'>无货</strong>，此商品暂时售完");
                }
            }
        }
    }
}
/**
 * 获取自由推荐商品
 * @param {type} gid
 * @returns {undefined}
 */
function getCollGoodsPage(gid){
    $.ajax({
        url:'/Wap/Products/getCollGoodsPage',
        dataType:'HTML',
        type:'POST',
        data:{
            gid:gid
        },
        success:function(msgObj){
            $("#coll_goods").html(msgObj);
            return false;
        }
    });
}

function getRelateGoodsPage(gid){
    $.ajax({
        url:'/Home/Products/getRelateGoodsPage',
        dataType:'HTML',
        type:'POST',
        data:{
            gid:gid
        },
        success:function(msgObj){
            $("#relate_goods").html(msgObj);
            return false;
        }
    });
}

function getGoodsAdvice(gid,page){
    $.ajax({
        url:'/Home/Products/getGoodsAdvice',
        dataType:'HTML',
        type:'POST',
        data:{
            gid:gid,
            page:page
        },
        success:function(msgObj){

            $("#question_title").val('');
            $("#question_content").val('');
            $("#con_tabAbp_3").html(msgObj);
            return false;
        }
    });
}