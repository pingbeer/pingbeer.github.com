require(['js/zepto.picLazyLoad.min.js','../js/wap20/dom.js?d=' + Date.now(),'../js/wap20/tools.js?d=' + Date.now(),'../js/wxshare.js'], function() {
    var that;
    var beginTime,endTime,nowTime,leftTime,maxOrdernum,producttype,qgLeftNum,qgUnbuyNum;
    var G = {};
    var source = "wap";
    var flag = true,isQg = true,isMore=false;
    var isHaveProvince;
    var local="http://m.spider.com.cn/busybuy/"; //接口路径
    // var local="http://192.168.1.121:8089/spiderwap/busybuy/"; //接口路径
    var qgId =tools.getQueryString("qgId");//抢购id
    var detail = {
        init: function() {
            that = this;
            $(".product .back").bind("touchend", function() {
                history.go(-1);
            });
            if(tools.getQueryString('productType')){
              isMore=true;
            }
            that.fevent();
            that.querySet();//获得抢购信息
        },
        fevent:function(){
            //时间换算
            G.transdate = function(endTime) { //2011-3-16 16:50:43
                var date = new Date();
                date.setFullYear(endTime.substring(0, 4));
                date.setMonth(endTime.substring(5, 7) - 1);
                date.setDate(endTime.substring(8, 10));
                date.setHours(endTime.substring(11, 13));
                date.setMinutes(endTime.substring(14, 16));
                date.setSeconds(endTime.substring(17, 19));
                return Date.parse(date) / 1000;
            }
        },
        //获得抢购信息
        querySet:function(){
            $.ajax({
                type: "GET",
                url: local+"querySet.action?callback=?",
                data: {
                    "busybuysetid": qgId,
                    "source":source,
                    "version":'2.0'
                },
                dataType: "json",
                success: function(data) {
                    if (data.errCode != '0000') {
                        that.showError(data.errMsg);
                    } else {
                        that.drewDetails(data);
                    }
                },
                error: function(data) {
                    that.showError('系统错误，请稍后再试');
                }
            });
        },
        // 绘制商品详情
        drewDetails:function(data){
            var payType;
            var busybuyset = data.busybuyset;
            var replaytype = data.replytype;
            var nameico='',pulishName = '';
            meta.drawTkd({'tkd_title':busybuyset.title,'keywords':busybuyset.seokeywords,'description':busybuyset.seodescription});
            tools.addLocal('replaytype',replaytype);
            isHaveProvince=data.orderProvinceflag;
            // console.log(data.busybuyset.publishstaff);

            // 这里注释掉的是商家和蜘蛛网自营的判断
            if(data.busybuyset.publishstaff == 'zzw'){
                nameico = '<span class="zzw">蜘蛛网</span>';
                $('#actSj').hide();
            }else{
                nameico = '<span class="sj"><img src="images/ico_sj.png"></span>';
                $('#actSj .actcont').html(data.bussInfo);   //适用商家内容
                if(busybuyset.publishname){
                    pulishName = '<p class="pbname">'+busybuyset.publishname+'</p>'
                }
            }
            $('.product .name').html(nameico+busybuyset.title+pulishName);
            if(busybuyset.adpicture){
                $('.proInn .pic').html('<img src="http://pic.spider.com.cn/pic/'+busybuyset.adpicture+'" alt="">');
            }
            // var wxPic = '<div style="display:none"><img src="http://pic.spider.com.cn/pic/bookpic/201509/14425572579150.jpg" alt=""></div>';
            // $('body').prepend(wxPic);
            if(replaytype=='1'){
              if(isMore){
                var str='<div class="selectProperty mt10 bg_fff">'+
                  '<div>选择:'+tools.getQueryString('productType')+'</div><span></span>'+
                '</div>'
              }else{
                var str='<div class="selectProperty mt10 bg_fff">'+
                  '<div>选择商品属性</div><span></span>'+
                '</div>'
              }
        $('#actSm').before(str);
            }
            $('.selectProperty').on('click',function(){
              if(data.orderProvinceflag){
                tools.goPage(tools.localhost+"busybuy/chooseArea.html?qgId="+tools.getQueryString('qgId'))
              }else{
                tools.goPage(tools.localhost+"busybuy/goodsPro.html?qgId="+qgId);
              }
            })
            tools.addLocal('productName',busybuyset.title);
            tools.addLocal('adsPicUrl',busybuyset.adpicture);
            tools.addLocal('proPrice',busybuyset.price);
            tools.addLocal('proMPrice',busybuyset.marketprice);
            maxOrdernum = busybuyset.maxproductnum != "-1" ? 1 : busybuyset.productnum;
            tools.addLocal("maxOrdernum",busybuyset.maxOrdernum);
            tools.addLocal("maxOrdernumtwo",busybuyset.maxproductnum);
            tools.addLocal("productnum",busybuyset.productnum);
            tools.addLocal("dyqs",busybuyset.dyqs);  //订阅期数
            tools.addLocal("deliverarea",busybuyset.deliverarea);  //配送范围
            // 支付方式
            if(busybuyset.payType.indexOf("|")> -1 ){
              var payTypes = busybuyset.payType.split("|");
              payType = payTypes[0].indexOf("wap") > -1 ? payTypes[0].split(":")[1] : payTypes[1].split(":")[1];
            }else{
                payType = busybuyset.payType.indexOf("wap") > -1 ? busybuyset.payType.split(":")[1] : '';
            }

            // 已抢比例
            // var yqpercent;

            // if("undefined"==data.remaindaynum || data.remaindaynum==0){
            //     yqpercent = 100;
            // }
            // else{
            //     yqpercent = parseInt((1-data.dayqianggonum/data.remaindaynum)*100);
            // }
            //开始时间
            beginTime = G.transdate(new Date(parseInt(data.daybegintime)).format('yyyy-MM-dd hh:mm:ss'));
            //结束时间
            endTime = G.transdate(new Date(parseInt(data.dayendtime)).format('yyyy-MM-dd hh:mm:ss'));
            //当前时间
            nowTime = G.transdate(new Date(data.now).format('yyyy-MM-dd hh:mm:ss'));
            // 仅剩数量
            var leftNum = nowTime - beginTime >= 0 ? data.dayqianggonum : (busybuyset.pagedaycount == 'null' ? data.dayqianggonum : busybuyset.pagedaycount);
            // 商品类型 k-卡券，s-实物，z-报刊
            producttype = busybuyset.producttype;
            qgLeftNum = data.dayqianggonum;
            qgUnbuyNum = data.unpayOrders;
            var proDetail = '<p class="fl font_fff"><span class="fs_18">&yen;</span>' +
                            '<em class="fs_30">'+busybuyset.price+'</em></p>' +
                            '<p class="fl fs_12 ml10">' +
                            '<span class="block oldprice">&yen;'+busybuyset.marketprice+'</span>' +
                            '<span class="block font_fff over">仅剩'+leftNum+'件</span>' +
                            '</p><div class="state fs_12">' +
                            '<span class="block" id="leftTime">00:00:00</span>' +
                            '<p class="progress center pr"><em>已抢'+data.percent+'%</em>' +
                            '<i class="pa" style="width:'+data.percent+'%"></i></p></div>';
            $('.proDetail').html(proDetail);
            setInterval(that.setRemainTime, 1000);
            // 限购人数
            var xqnum = busybuyset.onecount;
            if(xqnum=='-1' || !xqnum){
                $('.limit').hide();
            }
            else{
                $('.limit span').text(xqnum);
            }
            // 活动说明
            $('#actSm .actcont').html(busybuyset.actdesc);
            // 商品详情
            $('#actXq .actcont').html(busybuyset.productdesc);
            var xqimgsrc;
            // 图片懒加载
            for(var i=0;i<$('#actXq .actcont img').length;i++){
                xqimgsrc = $('#actXq .actcont img').eq(i).attr('src');
                $('#actXq .actcont img').eq(i).attr({'data-original':xqimgsrc,'src':'images/blank.gif'}).removeAttr('style');
                $('#actXq .actcont img').picLazyLoad();
            }
            // 购买须知
            $('#actGm .actcont').html(busybuyset.remind);
            $('.proBtn span').bind('tap',function(){
                // 检验黄牛
                if (flag == false) {return;}
                if (isQg) {
                    isQg = false;
                    if(!tools.ifNotNull(tools.getLocal('userId'))){
                        if(tools.ifNotNull(tools.getLocal('userTel'))){
                            //如果用户没有登录，可能之前登录过别的账号，清掉之前账号绑定的手机
                            tools.delLocal('userTel');
                        }
                        tools.goLogin();
                        // isQg = true;
                    }else{
                        //蛛元活动必须绑定手机号，不根据后台配置来判断
                        if(!tools.ifNotNull(tools.getLocal('userTel')) && (payType.indexOf('zzk')>-1 || producttype == 'k')){
                            that.showError("您还没有绑定手机，前去绑定？",3);
                        }else{
                            that.checkBuy(); //验证
                        }
                    }
                }
            });
            // 设置微信分享
            new wxShare({
                wxTitle: busybuyset.title,
                wxDesc: busybuyset.seodescription,
                wxImgUrl: 'http://pic.spider.com.cn/pic/'+busybuyset.adpicture
            });

        },
        //判断资格
        checkBuy:function(){
          var data;
          if(isMore){
            data={
                    "busybuysetid": qgId,
                    "userId": tools.getLocal('userId'),
                    "param.platform": source,
                    "param.productnum": maxOrdernum,
                    "param.productid":tools.getLocal('productId')
                }
          }else{
            data={
                    "busybuysetid": qgId,
                    "userId": tools.getLocal('userId'),
                    "param.platform": source,
                    "param.productnum": maxOrdernum
                }
          }
            $.ajax({
                type: "GET",
                url: local+"verifyBuylimit.action?callback=?",
                // url:"http://test.spider.com.cn:9090/spiderwap/busybuy/verifyBuylimit.action?callback=?",
                data:data,
                dataType: "json",
                success: function(data) {
                    isQg = true;
                    if(data.errCode == "0000" || data.errCode == "0008"){
                      if(isMore){
                        tools.goPage("order.html?qgId=" + qgId + "&producttype=" + producttype+"&productId="+tools.getLocal('productId')+"&productType1="+tools.getLocal('productType'));
                      }else{
                        tools.goPage("order.html?qgId=" + qgId + "&producttype=" + producttype);
                      }

                    }
                    else if(data.errCode == "0002") {
                        if(tools.ifNotNull(tools.getLocal('userTel'))){
                            //如果用户没有登录，可能之前登录过别的账号，清掉之前账号绑定的手机
                            tools.delLocal('userTel');
                        }
                        tools.addLocal("userName","");
                        tools.addLocal("userId","");
                        tools.g_userId = "";
                        tools.g_userName = "";
                        if(tools.getLocal("utm_source") == "bankcomm"){
                            var nwurl=window.location.href;
                            tools.goPage(tools.localhost+"BocomLogin?method=toLogin&resUrl="+nwurl);
                        }else{
                            tools.goLogin();
                        }
                    }
                    else if(data.errCode == "3004" || data.errCode == "3006" ||data.errCode == "3008"){
                        that.showError(data.errMsg,2);
                    }
                    //黄牛判断
                    else if(data.errCode == "hacker001"){
                        $(".queue").css("visibility", "visible");
                    }
                    //蛛元不足
                    else if(data.errCode == "5001"){
                        dom.popup({
                            txt: '此活动限蛛元余额不少于'+data.errMsg+'元，您的余额不足',
                            btn: 2,
                            txt_true : '去充值',
                            txt_false : '我知道了'
                        });
                        $("#popup_true").bind('tap',function(){
                            tools.goPage('../movie20/zycz.html');
                        });
                    }
                    else if(data.errCode == "5002" || data.errCode == "5003"){
                      if(isHaveProvince){
                    tools.goPage(tools.localhost+"busybuy/chooseArea.html?qgId="+tools.getQueryString('qgId'))
                  }else{
                    tools.goPage(tools.localhost+"busybuy/goodsPro.html?qgId="+qgId);
                  }
                    }
                    else {
                        that.showError(data.errMsg);
                    }
                },
                error: function(data) {
                    isQg = true;
                    that.showError('系统错误，请稍后再试');
                }
            });
        },
        // 距离结束时间
        setRemainTime:function(){

                    flag = true;
                    nowTime++;
                    $('.proBtn span').text('立即抢购').removeClass().addClass('n_btn');
                    $('.proBtn').show();
                    leftTime = that.time(endTime - nowTime, "ljBuy");
                    $("#leftTime").text("距结束"+leftTime);
                    $('.progress').show();
                    $('.state').removeAttr('style');



        },
        time:function(leftTime, qgflag){
            var leftsecond = parseInt(leftTime);
            var day1 = Math.floor(leftsecond / (60 * 60 * 24));
            var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
            var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
            var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
            hour = hour < 10 ? '0' + '' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            if (qgflag == "ljBuy") {
                if (day1 <= 0) {
                    return hour + ":" + minute + ":" + second;
                } else {
                    return day1 + ":" + hour + ":" + minute + ":" + second;
                }

            } else if (qgflag == "ddBuy") {
                if (day1 <= 0) {
                    return hour + ":" + minute + ":" + second;
                } else {
                    return day1 + ":" + hour + ":" + minute + ":" + second;
                }
            }
        },
        // 弹框
        showError:function(msg,type){
            var btns;
            if(type == '2'){
                btns = '<p class="btn_ok">我知道了</p><p class="myorder">查看我的订单</p>';
            }
            else if(type == '3'){
                btns = '<p class="btn_ok">我知道了</p><p class="bindphone">去绑定</p>';
            }
            else{
                btns = '<p class="btn_ok">我知道了</p>';
            }
            var html = '<div class="bbpop font_333">'+
                       '<div class="boxpop">' +
                       '<h3 class="fs_16 center">提示</h3>' +
                       '<p class="ppcont fs_14 center">'+msg+'</p>' +
                       '<span class="xcolse fs_30">x</span>'+
                       '<div class="ppbtn">' + btns +
                       '</div></div></div>';
            $("body").append(html);
            $('.xcolse,.btn_ok').bind('touchend',function(){
                $('.bbpop').remove();
            });
            $('.bindphone').bind('touchend',function(){
                 tools.goPage(tools.localhost + "movie20/bdmobile.html?qgId=" + tools.getQueryString('qgId'));
            });
            $('.myorder').bind('touchend',function(){
                 tools.goPage(tools.localhost + "baokan20/orderlist.html");
            });
        }
    }
    detail.init();
});