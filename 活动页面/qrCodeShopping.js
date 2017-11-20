var Utils = {
    webType: "jhtml"
};

function addActivityOrder(buyType){
    $.ajax({
        type:"POST",
        url:realpath+"/exchangecenter/product/checkActivityTime."+Utils.webType,
        data:"productId="+$('input[name="pId"]').val(),
        success:function(res){
            if(0 == res.activityTimeFlag){
                addOrder(buyType);
            }else if(1 == res.activityTimeFlag){
                alert("抱歉，活动还没开始");
            }else if(2 == res.activityTimeFlag){
                alert("抱歉，活动已经结束");
            }
        },
        error:function(data){
            alert("系统繁忙");
        }
    });
}

function addOrder(buyType){
    //判断登录，ajax
    //查询库存，缓存至页面，跟随页面跳转
    //跳转页面

    productId=$('input[name="pId"]').val();
    orderType=$('input[name="otype"]').val();
    quantity=$('input[name="count"]').val();
    shopId=$('#movie_selectid option:selected').val();
    var inventoryCount = $('#pint').html();
    if("" == quantity){
        alert("请填写兑换数量");
        return;
    }
    if(parseInt(quantity)>parseInt(inventoryCount)){
        alert("抱歉，您输入的商品数量超过了库存数量");
        return;
    }

    if("1" == $("#o2oFlag").val()){
        if(typeof(shopId) == "undefined" || shopId==="0"){
            alert("请选择店铺!");
            return;
        }
    }

    //保存登录后将要跳转的链接
    var params = {productId:productId,orderType:orderType,quantity:quantity,shopId:shopId,buyType:buyType};
    var str = jQuery.param(params);
    afterLoginUrl = realpath + "/exchangecenter/qr/submitorderdetail."+Utils.webType+"?"+str;
    $.cookie("afterLoginUrl", afterLoginUrl);

    if('0' == buyType){
        $.ajax({
            type:"POST",
            url:realpath+"/exchangecenter/orderCheckLogin."+Utils.webType,
            dataType:"json",
            success:function(res){

                if(res&&res.userId){//登录
                    //商户登录后，不可进行商品兑换  刘浩
                    if(res.userType == '1'){
                        alert("商户不可兑换商品！");
                    }
                    else
                    {
                        //var params = {productId:productId,orderType:orderType,quantity:quantity,shopId:shopId};
                        //var str = jQuery.param(params);
                        //location.href = realpath + "/exchangecenter/qr/submitorderdetail?"+str;
                        location.href = afterLoginUrl;
                    }

                }//未登录
                else{
                    //跳转到登录页面
                    window.location.href = realpath + "/exchangecenter/qr/showLogin."+Utils.webType;
                }
            },
            error:function(){
                alert("系统繁忙");
            }
        });
    }else if('1' == buyType && '1' == orderType){
        $.cookie("buyType", buyType);
        location.href = realpath + "/exchangecenter/qr/adress."+Utils.webType;
    }else{
        location.href = afterLoginUrl;
    }


}

function checkSubmit(){
    var userAccount = $("#username");
    var password = $("#password");
    var randomCode = $("#randomCode");
    var tips = document.getElementById("loginTip");

    if("" == userAccount.val()){
        tips.innerHTML="请输入用户名";
        tips.style.display="block";
        userAccount.focus();
        return false;
    }
    if("" == randomCode.val()){
        tips.innerHTML="请输入验证码";
        tips.style.display="block";
        randomCode.focus();
        return false;
    }

    if(password.val().length < 6 || password.val().length > 16){
        tips.innerHTML="密码长度为6至16位字符，注意区分大小写";
        tips.style.display="block";
        password.focus();
        return false;
    }else{
        password.val(calcMD5(password.val()));

    }

    return true;
}

//登录处理
function loginSubmit(){
    var tips = document.getElementById("loginTip");
    if(checkSubmit()){
        $.ajax({
            type:"POST",
            url:realpath+"/exchangecenter/qr/login."+Utils.webType,
            data:$("#loginForm").serialize(),
            dataType:"json",
            success:function(data){

                if(!data.result){
                    tips.innerHTML=data.errTip;
                    tips.style.display="block";
                    //$("#username").val('');
                    $("#password").val('');
                }else{
                    tips.innerHTML="";
                    tips.style.display="none";
                    location.href = $.cookie("afterLoginUrl");
                    /*if(data.afterLoginUrl!=''){

                     location.href = $.cookie("afterLoginUrl");
                     }else{
                     window.location.reload();
                     }*/

                }
            }
        });
    }
}

//获取国标地址的同一级地址
function getFirstLevelGBAddress(level,selectNo){

    for(var i  in gb_address){
        $("#provinceCode").append("<option class='proOpt' value='"+gb_address[i]['value']+"'>"+gb_address[i]['key']+"</option>");
    }
    sortOption("provinceCode");
    $("#provinceCode option[value="+selectNo+"]").attr("selected",true);

}

//获取国标地址的子地址
function getChildrenAddress(pid,pLevel,selectNo){
    var province = $("#provinceCode");
    var city = $("#cityCode");

    if(pLevel==1){
        if($("#provinceCode option:selected").val()==""){
            return ;
        }
        for(var i in gb_address[province.val()]["city"]){
            city.append("<option class='cityOpt' value='"+gb_address[province.val()]["city"][i]["value"]+"'>"+gb_address[province.val()]["city"][i]["key"]+"</option>");
        }
        sortOption("cityCode");
        $("#cityCode option[value="+selectNo+"]").attr("selected",true);
    }
    if(pLevel==2){
        if($("#cityCode option:selected").val()==""){
            return ;
        }

        var addressCode = $("#addressCode");
        for(var i in gb_address[province.val()]["city"][city.val()]["area"]){
            addressCode.append("<option class='adrOpt' value='"+gb_address[province.val()]["city"][city.val()]["area"][i]["value"]+"'>"+gb_address[province.val()]["city"][city.val()]["area"][i]["key"]+"</option>");
        }
        sortOption("addressCode");
        $("#addressCode option[value="+selectNo+"]").attr("selected",true);
    }
}

//校验提交的地址内容
function checkConsignee(){
    var postcodereg=/^\d{6}$/;
    var phoneReg=/^(13|15|17|18|14)[0-9]{9}$/;
    var telReg = /^0[1-9]{11}$/;
    var consigneeName = $("#consigneeName").val();
    var provinceCode = $("#provinceCode").val();
    var cityCode = $("#cityCode").val();
    var addressCode = $("#addressCode").val();
    var address = $("#address").val();
    var postCode = $("#postCode").val();
    var mobile = $("#mobile").val();
    if(consigneeName == ""){
        alert("收货人不能为空");
        return false;
    }
    if(consigneeName.trim().length>20){
        alert("收货人最多输入20个字符");
        return false;
    }
    if(provinceCode == ""){
        alert("请选择省份");
        return false;
    }
    if(cityCode == ""){
        alert("请选择市");
        return false;
    }
    if(addressCode == ""){
        alert("请选择区/镇");
        return false;
    }
    if(address==""){
        alert("地址不能为空");
        return false;
    }
    if(mobile==""){
        alert("手机号不能为空");
        return false;
    }
    if(!(postcodereg.test(postCode))){
        alert("邮政编码格式输入错误！");
        return false;
    }
    if(!(phoneReg.test(mobile)||telReg.test(mobile))){
        alert("电话/手机格式错误!");
        return false;
    }
    return true;
}

function addAddress()
{
    if(checkConsignee()){
        jQuery.ajax({
            type:"POST",
            url:realpath+"/customercenter/account/addAddress."+Utils.webType,
            data:$("#consigneeForm").serialize(),
            dataType:"json",
            success:function(data){
                //alert(data.msg);
                if(data.result){
                    //window.location.reload();
                    location.href = $.cookie("afterLoginUrl");
                }else{
                    alert(data.msg);
                }
            },
            error:function(data){
                alert("系统繁忙，请检查您的登录状态");
            },
            beforeSend:function ()
            {
                $('#save').attr('disabled',true);
            },
            complete: function ()
            {
                $('#save').attr('disabled',false);
            }
        });
    }
}

function fastAddAddress()
{
    if(checkConsignee()){
        $.cookie("consigneeName", $("#consigneeName").val());
        $.cookie("mobile", $("#mobile").val());
        $.cookie("postCode", $("#postCode").val());
        $.cookie("provinceCode", $("#provinceCode").val());
        $.cookie("cityCode", $("#cityCode").val());
        $.cookie("addressCode", $("#addressCode").val());
        $.cookie("address", $("#address").val());

        $.cookie("provinceName", $("#provinceCode").find("option:selected").text());
        $.cookie("cityName", $("#cityCode").find("option:selected").text());
        $.cookie("addressName", $("#addressCode").find("option:selected").text());

        location.href = $.cookie("afterLoginUrl");
    }
}

function updateAddress()
{
    if(checkConsignee()){
        jQuery.ajax({
            type:"POST",
            url:realpath+"/customercenter/account/updateAddress."+Utils.webType,
            data:$("#consigneeForm").serialize(),
            dataType:"json",
            success:function(data){
                //alert(data.msg);
                if(data.result){
                    location.href = $.cookie("afterLoginUrl");
                }else{
                    alert(data.msg);
                }
            },
            error:function(data){
                alert("系统繁忙，请检查您的登录状态");
            },
            beforeSend:function ()
            {
                $('#save').attr('disabled',true);
            },
            complete: function ()
            {
                $('#save').attr('disabled',false);
            }
        });
    }
}

//删除地址
function deleteAddress(id){
    if(confirm("您确定要删除此收货地址吗？")){
        var data = {consigneeInfoId:id};
        jQuery.ajax({
            type:"POST",
            url:realpath+"/customercenter/account/deleteAddress."+Utils.webType,
            data:data,
            dataType:"json",
            success:function(data){
                alert(data.msg);
                if(data.result){
                    window.location.reload();
                }
            },
            error:function(data){
                alert("系统繁忙，请检查您的登录状态");
            },
            beforeSend:function ()
            {
                $('#save').attr('disabled',true);
            },
            complete: function ()
            {
                $('#save').attr('disabled',false);
            }
        });
    }

}

//修改为默认地址
function updateDefault(id){
    var data = {"consigneeInfo.consigneeInfoId":id};
    jQuery.ajax({
        type:"POST",
        url:realpath+"/customercenter/account/updateDefauleAddress."+Utils.webType,
        data:data,
        dataType:"json",
        success:function(data){
            if(data.result){
                alert(data.msg);
                window.location.reload();
            }else{
                alert(data.msg);
            }

        },
        error:function(data){
            alert("系统繁忙，请检查您的登录状态");
        }
    });
}

function setOrderAddress(){
    var buyType = $("#buyType").val();
    if("1" == buyType){
        $("#consigneeNm").val($.cookie("consigneeName"));
        $("#consigneePhone").val($.cookie("mobile"));
        $("#mobileSubmited").val($.cookie("mobile"));
        $("#consigneeAddressSubmited").val($.cookie("address"));
        $("#consigneePostCode").val($.cookie("postCode"));

        $("#consigneeProvinceId").val($.cookie("provinceCode"));
        $("#consigneeCityId").val($.cookie("cityCode"));
        $("#consigneeAreaId").val($.cookie("addressCode"));
        //新增三个字段 2014-8-15
        $("#consigneeProvinceName").val($.cookie("provinceName"));
        $("#consigneeCityName").val($.cookie("cityName"));
        $("#consigneeAreaName").val($.cookie("addressName"));

        $("#ord-contacts").html($.cookie("consigneeName") + "<i>" + $.cookie("mobile")+"</i>");
        $("#ord-address-detail").html($.cookie("provinceName") + " " + $.cookie("cityName") + " " + $.cookie("addressName")+" "+$.cookie("address"));
    }else{
        $("#consigneeNm").val($(".address-on .consigNmStr").text());
        $("#consigneePhone").val($(".address-on .mobileStr").text());
        $("#mobileSubmited").val($(".address-on .mobileStr").text());
        $("#consigneeAddressSubmited").val($(".address-on .adrsStr").text());
        $("#consigneePostCode").val($(".address-on .postCodeStr").text());

        $("#consigneeProvinceId").val($(".address-on .proCodeStr").text());
        $("#consigneeCityId").val($(".address-on .cityCodeStr").text());
        $("#consigneeAreaId").val($(".address-on .adrCodeStr").text());
        //新增三个字段 2014-8-15
        $("#consigneeProvinceName").val($(".address-on .proNmStr").text());
        $("#consigneeCityName").val($(".address-on .cityNmStr").text());
        $("#consigneeAreaName").val($(".address-on .adrNmStr").text());
    }
}

function submitOrder() {
    var sId = "1070004";
    //var mobile_regex = /^(((13[0-9]{1})|159|(15[0-9]{1})|(14[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    //前端校验
    var otype = $('input[name="orderType"]').val();
    var productId = $('input[name="productId"]').val();
    if(otype==1){
        //先判断是否为空，再转换中文
        var name = $('input[name="mvo.consigneeName"]').val();
        var Address = $('input[name="mvo.consigneePhone"]').val();
        var PostCode = $('input[name="mvo.consigneeAddressSubmited"]').val();
        var mobile = $('input[name="mvo.mobileSubmited"]').val();
    }else if(otype==2 || otype==3){
        //卡券判断手机号
        var mobile = $('input[name="vvo.mobile"]').val();
        var secmobile = $('input[name="vvo.secmobile"]').val();
        var cardMemNo = $('#cardMemNo').val();

        if(!$.trim(mobile)){
            return alert('手机号码不能为空');
        }
        if($.trim(mobile).length < 11){
            return alert('手机号码长度不足11位');
        }
        if(sId != productId){
            if(!$.trim(secmobile)){
                return alert('确认手机号码不能为空');
            }
            if(mobile!=secmobile){
                return alert('手机号码不一致');
            }
            if($.trim(secmobile).length < 11){
                return alert('确认手机号码长度不足11位');
            }
        }else{
            if(!$.trim(cardMemNo)){
                return alert('会员号不能为空');
            }
        }
        //else if(!mobile_regex.test(mobile)){
        //	return alert('手机输入有误');
        //}
        //else if(!mobile_regex.test(secmobile)){
        //	return alert('确认手机号码输入有误');
        //}
    }else if(otype==91 || otype==90){
        //捐赠人姓名团体，手机号
        var fastDonate = $('input[name="dvo.fastDonate"]').val();
        var mobile= $('input[name="dvo.mobile"]').val();
        var groupName= $('input[name="dvo.groupName"]').val();
        var donateName= $('input[name="dvo.donateName"]').val();

        if(!$.trim(mobile)){
            return alert('捐赠人手机号不能为空');
        }
        else if(!$.trim(donateName)){
            return alert('捐赠人姓名不能为空');
        }
    }else if(otype==4){
        //航空
        var reg = /^[0-9]*$/;
        var memberno = $('input[name="avo.memberno"]').val();
        var cardNoLastSix = $('input[name="avo.cardNoLastSix"]').val();
        var mobile = $('input[name="avo.mobile"]').val();

        if(!$.trim(memberno)){
            return alert('航空会员号不能为空');
        }
        else if(!reg.test($.trim(memberno))){
            return alert('航空会员号请输入数字');
        }
        else if(!$.trim(cardNoLastSix)){
            return alert('证件号不能为空');
        }
        else if($.trim(cardNoLastSix).length < 6){
            return alert('证件号长度不足6位');
        }
        else if(!$.trim(mobile)){
            return alert('手机号码不能为空');
        }
        else if($.trim(mobile).length < 11){
            return alert('手机号码长度不足11位');
        }
        //else if(!mobile_regex.test(mobile)){
        //	return alert('手机号码输入有误');
        //}
    }else{
        location.href="/";
    }

    $('#submitOrder').attr('disabled','disabled');
    var form = $('form[id="orderform"]').serialize();
    //$("form").submit();
    var limitedFlag = $('#limitedFlag').val();
    var buyType = $('#buyType').val();
    showBg("正在提交订单...");
    // if('1' == limitedFlag && '0' == buyType){
        var quantity = $('input[name="vo.q"]').val();
        var memberNo = $('input[name="avo.memberno"]').val();
        jQuery.ajax({
            url:realpath+"/exchangecenter/qr/checkProductLimit."+Utils.webType,
            type:"POST",
            data:"productId="+productId + "&" + "quantity=" + quantity + "&" + "type=" + otype + "&" + "memberNo=" + memberNo,
            dataType:"json",
            success:function(data){
                if(!data.result){
                    if("login" == data.msg){

                        location.href = realpath+"/exchangecenter/qr/showLogin."+Utils.webType;
                    }
                    else{
                        setTimeout(function () {
                            submitOrder();
                        },2000);
                        hideBg();
                     //   alert(data.msg);
                    }
                }
                else{
                    //$('#submitOrder').attr('disabled','disabled');
                    $('form[id="orderform"]').submit();
                    //hideBg();
                }
            },
            error:function(data){
                hideBg();
                setTimeout(function () {
                    submitOrder();
                },2000);
            }
        });
    // }
    // else{
    //     setTimeout(function () {
    //         submitOrder();
    //     },2000);
        //$('#submitOrder').attr('disabled','disabled');
  //      $('form[id="orderform"]').submit();
        //hideBg();
    // }
    /*var url = realpath + '/exchangecenter/qr/checkOrder';
     jQuery.ajax({
     type:"POST",
     url:url,
     data:form,
     dataType:"json",
     success:function(data){
     if(data&&data.formVerifyToken=='ok'){
     $("form").submit();
     }

     },
     error:function(data){
     alert(data.formVerifyToken);
     }
     });*/

}

function setCountFormatValue(obj){
    if("" == obj.value){
        return;
    }
    var value = '';
    var number = '1234567890';
    for(var i=0;i<obj.value.length;i++){
        if(number.indexOf(obj.value.charAt(i))>=0){
            value = value+obj.value.charAt(i);
        }
    }
    obj.value = value;
}

function checkAmount(){

    //var countInput = $("#t1_"+id);
    var invent = parseInt($.trim($('#pint').html()));
    var count = parseInt($.trim($('#count').val()));

    if(0===count){
        //alert("请输入正整数");
        //$("#countTip_"+id).html("请输入正整数");
        var count = 1;
    }
    else if(invent < count){
        alert("该商品目前库存为"+invent+"件，请重新填写兑换数量");
        count = 1;
    }
    else if(pageCache.pLimit < count){
        alert("每件商品一次最多只能兑换"+pageCache.pLimit+"件");
        count = 1;
    }

    $('#count').val(count);
}

function setInputFormatValue(obj){
    var value = '';
    var number = '1234567890';
    for(var i=0;i<obj.value.length;i++){
        if(number.indexOf(obj.value.charAt(i))>=0){
            value = value+obj.value.charAt(i);
        }
    }
    obj.value = value;
}

function showBg(msg){
    var strMsg='正在加载...';
    if(msg){
        strMsg=msg;
    }
    if(document.getElementById("fullBg")){
        document.getElementsByClassName("full-bg-t")[0].innerHTML='<i class="load-ani"></i>'+strMsg;
        document.getElementById("fullBg").style.display="block";
        return false;
    }
    var body=document.getElementsByTagName('body');
    var bg=document.createElement('div');
    bg.className="full-bg";
    bg.id="fullBg";
    bg.innerHTML='<h2 class="full-bg-t"><i class="load-ani"></i>'+strMsg+'<h2>';
    if(typeof(document.ontouchmove)=='undefined'){
        bg.style.position='fixed';
    }
    body[0].appendChild(bg);
    bg.onclick=function(){
        hideBg();
    }
    bg.ontouchmove=function(){
        return false;
    }
}

function hideBg(){
    var bg=document.getElementById("fullBg");
    if(!bg){
        return false;
    }
    bg.style.display='none';
}