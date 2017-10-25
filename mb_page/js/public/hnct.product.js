/**
 *  Module: product
 *  Author: Ljp
 *  Create Time:2015-5-27
 *  Last Modify Time: 2015-6-25
 *******************************
 * 产品详情页面信息处理
 * */
var hnctProduct = {

    createNew: function () {
        var productPage = {};
		
        var itemId = $.query.get("itemId");
        var vendorId = $.query.get("vendorId");
        var vendorName = $.query.get("vendorName");
        vendorType = $.query.get("vendorType");
		var createType=6;
	

        

        var ajaxJsonProp={
            //servlet访问接口
            servlet:'',
            //操作参数 act
            act:'',
            //提交服务器参数
            parmData:'',
            //执行成功后的回调函数
            successCallbackFunc:null
        }
        //从后台调用数据的总入口
        productPage.loadDataFromServer=function(flag){
            var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
			if(flag){
				sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,productPage.loadCanReloadError);
			}else{
				sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,productPage.loadError);
			}
        };


        productPage.loadInfo = function () {
			if (itemId == "" || vendorId == "" || vendorType == "" || vendorName == "") {
				sinoMobileUI.alert("参数错误，操作不能继续！");
				return;
			 }
            var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PRODUCT_INFO;
            ajaxJsonProp.act="GET_PHONE_DETAIL";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=productPage.loadProductInoSuccess;
            productPage.loadDataFromServer(true);
        };
		productPage.loadProductConfig = function(itemId,vendorId,vendorType){
			
            var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PRODUCT_INFO;
            ajaxJsonProp.act="GET_PHONE_DETAIL";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=productPage.loadProductConfigSuccess;
            productPage.loadDataFromServer(true);
        };
        // 下单和加入购物车都调用这个方法 canorder 隐藏域是否能够下单
        productPage.canOrder = function (obj) {

            var color = $(".colorinput").val();
            if (color == "") {
                sinoMobileUI.alert("请选择颜色");
                return false;
            }
			 if(  ( vendorType==1 && vendorConfigFlg=='1' || vendorType==4 ) && kucun==0) {
				sinoMobileUI.alert("库存不足" );
				return;
			 }
            var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            rec.addField("ioId", $(".mainInfo4").find("select").val());

            var parm = rec.toJsonString();

            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
            ajaxJsonProp.act="GET_CAN_ORDER";
            ajaxJsonProp.parmData=parm;
            if (obj == "shop") {ajaxJsonProp.successCallbackFunc=productPage.loadCanOrderSuccess;}
            if (obj == "order") {ajaxJsonProp.successCallbackFunc=productPage.loadCanOrder2Success;}
            productPage.loadDataFromServer(false);

        };
        productPage.addCart = function () {
            var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("ioId", $(".mainInfo4").find("select").val());
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            rec.addField("organizationId", $(".mainInfo4").find("select").val());
            rec.addField("color", $(".colorinput").val());
            rec.addField("quantity", $(".quantityhtml").val());
            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_SHOPPING_CART;
            ajaxJsonProp.act="ADD_CART";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=productPage.loadCartSuccess;
            productPage.loadDataFromServer(false);

        };
        productPage.addOrder = function () {

            //需要获取 供应商联系人ID 和订单类型
            var rec = new Record();
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            rec.addField("ioId", $(".mainInfo4").find("select").val());

            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
            ajaxJsonProp.act="GET_VENDOR_CONTACT_ID";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=productPage.loadOrderSuccess;
            productPage.loadDataFromServer(false);

        };
        productPage.getPoType = function () {

            //和订单类型
            var rec = new Record();
            rec.addField("itemId", itemId);
            rec.addField("vendorId", vendorId);
            rec.addField("vendorType", vendorType);
            rec.addField("ioId", $(".mainInfo4").find("select").val());

            var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
            ajaxJsonProp.act="GET_PO_TYPE";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=productPage.loadPoTypeSuccess;
            productPage.loadDataFromServer(false);


        };
        productPage.createOrder = function () {

            var rec = new Record();
            //主数据信息
           
			/*
			vendorId
			vendorContactId
			organizationId
			realityPayAmount
			poType
			createType
			promoteApplyHeaderId 
			*/
			//rec.addField("itemId", itemId);
			rec.addField("vendorId", vendorId);
            rec.addField("vendorContactId", $(".vendorContactIdinput").val());
			rec.addField("organizationId", $(".mainInfo4").find("select").val());
			rec.addField("realityPayAmount", Number($(".quantityhtml").val() * $(".text-price").html()).toFixed(2));
			rec.addField("poType", $(".poTypeinput").val());
			rec.addField("createType", createType);
			rec.addField("promoteApplyHeaderId", "");
		
            //rec.addField("ioId", $(".mainInfo4").find("select").val());
           
			//行信息
			/*
			itemId
			unitPrice
			quantity
			color
			*/
			var lineData = new Record();
            lineData.addField("itemId", itemId);
            lineData.addField("unitPrice", $(".text-price").html());
			lineData.addField("quantity", $(".quantityhtml").val());
            lineData.addField("color", $(".colorinput").val());
            //lineData.addField("itemDescription", $(".itemDescriptioninput").val());
            
			var lines=new Records();
			lines.addRecord(lineData);
           // var lineArray = [];
            //lineArray.push(lineData.toJsonString());
            rec.addFieldChildren("lineData", lines.toJsonString());
            var parm = rec.toJsonString();
		
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_ORDER_CREATE;
            ajaxJsonProp.act="CREATE_ORDER";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=productPage.loadCreateOrderSuccess;
            productPage.loadDataFromServer(false);

        };
       
        productPage.loadCanOrderSuccess = function (data) {
            if (data.code + "" == "1") {
                if (data.msg == "") {
                    productPage.addCart();
                } else {
                    sinoMobileUI.alert("" + data.msg);
                }
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }

        productPage.loadCanOrder2Success = function (data) {
            if (data.code + "" == "1") {
                if (data.msg == "") {

                    productPage.addOrder();

                } else {

                    sinoMobileUI.alert("" + data.msg);
                }

            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
        productPage.loadOrderSuccess = function (data) {
            if (data.code + "" == "1") {
                $(".vendorContactIdinput").val(data.msg);
                productPage.getPoType();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
        productPage.loadPoTypeSuccess = function (data) {
            if (data.code + "" == "1") {
                $(".poTypeinput").val(data.msg);
                productPage.createOrder();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
        productPage.loadCreateOrderSuccess = function (data) {
            if (data.code + "" == "1") {
				var orderData=sinoMobileUtil.getJsonObjectFromResponseData(data,"orderData");
				if(orderData!=null){
					var poHeaderId=orderData["poHeaderId"];
					sinoMobileUI.doOpenCreateOrderPage(poHeaderId,"");
				}else{
					sinoMobileUI.alert("创建订单成功，但返回数据有错！");	
				}
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
        productPage.loadCartSuccess = function (data) {
            if (data.code + "" == "1") {
                //sinoMobileUI.alert("成功加入购物车");
				productPage.alertAddCartSuccess();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
        }
		productPage.alertAddCartSuccess=function(){
			$("#add_cart_OK").fadeIn(1000);
			setTimeout(function(){$("#add_cart_OK").fadeOut(2000);},3000);
		}
        productPage.loadProductInoSuccess = function (data) {
			$(".onLoad").hide();
			$(".content").show();
			$(".cart-footer").show();
            if (data.code + "" == "1") {
                productPage.printInfo(sinoMobileUtil.getJsonObjectFromResponseData(data,"productInfoData"));
                productPage.printConfig(sinoMobileUtil.getJsonObjectFromResponseData(data,"phoneConfigData"));
                // productInfoData  phoneConfigData  detailShowImgData
                productPage.printImg(productPage.getImgRecords(sinoMobileUtil.getJsonObjectFromResponseData(data,"detailShowImgData")));
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
		productPage.loadProductConfigSuccess = function (data) {
			$(".onLoad").hide();
			$(".content").show();
			$(".cart-footer").show();
	        if (data.code + "" == "1") {
				
                productPage.printConfig(sinoMobileUtil.getJsonObjectFromResponseData(data,"phoneConfigData"));
				
                // productInfoData  phoneConfigData  detailShowImgData
                productPage.printImg(productPage.getImgRecords(sinoMobileUtil.getJsonObjectFromResponseData(data,"detailShowImgData")));
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }

        }
		productPage.doSelectColor=function(obj){
		   var cls=$(obj).attr("class");
		   
		   var parent=$(obj).parent();
		   var children=$(parent).children();
		   var nLen=children.length;
		   for(var nn=0;nn<nLen;nn++){
				$(children[nn]).attr("class","p-color1");
		   }
		   $(".colorinput").val($(this).text());
		   $(obj).attr("class","p-color1-s");
		}
        productPage.printInfo = function (jsonObj) {
            if (jsonObj == null || jsonObj == "undefined") {
                return;
            }
            var num = jsonObj["price"];
            var htmlValue = jsonObj["phoneBrands"] + "&nbsp;" + jsonObj["itemName"] + jsonObj["phoneSellingPoint"];//  phoneBrands
            $(".text-price").html(num);
            $(".sellpoint").prepend(htmlValue);
            $(".itemDescriptioninput").val(jsonObj["itemName"]);
			//$(".comments").html(jsonObj["comments"]);


			var commentsHtml=jsonObj["comments"];
			$("#commentsMsg").html(commentsHtml);
			if(!sinoMobileUtil.strIsNull(commentsHtml)&&commentsHtml.length>24){
				//不截取，截取后显示不正确。click事件无效
				commentsHtml=commentsHtml.substring(0,24)+"...<span onclick='productDetail.showSaleControl(2)'>   更多>></span>";
			}
			$(".comments").html(commentsHtml);
			
            var colorArr ;
	
			//qyj 2016-3-8
			vendorConfigFlg=jsonObj["vendorConfigFlg"];
			if( vendorConfigFlg=='1') {
				if(jsonObj["phoneColorsQty"].indexOf(",") != -1){
					colorArr = jsonObj["phoneColorsQty"].split(",");
				}else{
					colorArr = jsonObj["phoneColorsQty"].split(";");
				}
			} else {
            	if(jsonObj["phoneColors"].indexOf(",") != -1){
					colorArr = jsonObj["phoneColors"].split(",");
				}else{
					colorArr = jsonObj["phoneColors"].split(";");
				}
			}
			//qyj 
			if( vendorType==4) {
				kucun= parseInt( jsonObj["vendorInventory"] );
			}

            var colorhtml = "";
            if (colorArr.length == 1) {
                colorhtml =
                    '<a class="p-color1-s" onclick="productDetail.doSelectColor(this)">' + colorArr[0].split('-')[0] + '</a>';
					$(".colorinput").val( colorArr[0].split('-')[0] );
            } else {
                for (var j in colorArr) {
                   // var active = j == 0 ? "p-color1-s active" : "p-color1";
				    var active = "p-color1"; //qyj 2016-2-29
                    colorhtml +=
                        '<a class="' + active + ' "  onclick="productDetail.doSelectColor(this)">' + colorArr[j].split('-')[0] + '</a>';
                }
            }
            //$(".colorinput").val(colorArr[0]);
            $(".colorhtml").append(colorhtml);
            productPage.colorSelect();

            $(".mainInfo1").html(jsonObj["itemCode"]);
            $(".mainInfo2").html(vendorName);
            //qyj 2016-2-24
			
			if( vendorConfigFlg=='1') {
				var phoneColorsQty=jsonObj["phoneColorsQty"];
				numList=phoneColorsQty.split(',');
				var total=0;
				for(var i=0;i<numList.length;i++) {
					var kk=numList[i].split('-');
					if(kk.length==2) {
						total+=parseInt( kk[1] );
					}
				}
				$(".mainInfo3").html(total);
			} else {
            	$(".mainInfo3").html(jsonObj["vendorInventory"]);
			}
           
			//对于只有一个元素进行处理
			if(jsonObj["orgOpt"].lastIndexOf("<option")==0){
				$(".mainInfo4").html("<select class=\"select-no-list\" disabled=\"disabled\"> >" + jsonObj["orgOpt"] + "</select>");
			}else{
				 $(".mainInfo4").html("<select>" + jsonObj["orgOpt"] + "</select>");
			}

        }
        productPage.colorSelect = function () {
            $(".colorhtml a").click(function () {
                $(".colorinput").val($(this).text());
				$(this).siblings().removeClass("active");
                $(this).addClass("active");
				//qyj 2016-2-24
				if(vendorType==1 && vendorConfigFlg=='1') {
					kucun=0;
					for(var i=0;i<numList.length;i++) {
						var kk=numList[i].split('-');
						if( $(this).text()==kk[0] ) {
							kucun=kk[1];	
						}
					}
					$('.mainInfo3').html(kucun);
					if(kucun==0) {
						$('.quantityhtml').val(0);
					} else {
						$('.quantityhtml').val(1);	
					}
				} else {
					$('.quantityhtml').val(1);	
				}
                
            });
        }
        productPage.printConfig = function (jsonObj) {
            if (jsonObj == null || jsonObj == "undefined") {
                return;
            }
			
				


            var template=$(".zt_table_list");
            var recs=new Records();
            if(typeof(jsonObj)=="object"){
                rec=new Record();
                rec.fromJson(jsonObj);
                recs.addRecord(rec);
            }
            if(recs!=null&&recs.getLength()>0){
                var nLen=recs.getLength();
                var rec=null;
                var html="";
                var rphtml="";
                var templateHtml=template.html();
                for(var nn=1;nn<=nLen;nn++){
                    rec=recs.getNthRecord(nn);
                    html=templateHtml;
                    rphtml +=sinoMobileUtil.getFormatedTemplateHtml(html,rec);
                }
                template.html(rphtml);
            }

        }
        productPage.getImgRecords = function (jsonObj) {
            var recs = new Records();
            recs.fromJson(jsonObj);

            return recs;
        }
        productPage.printImg = function (recs) {

            if (recs == null || recs.getLength() <= 0) {
                $(".page-numb-txt").hide();
                return;
            }
            var nLen = recs.getLength();
            var htmlValue = "";
            var num = "";
            var img = "";
            var rec = null;
            for (var nn = 1; nn <= nLen; nn++) {
                rec = recs.getNthRecord(nn);
                var active = nn == 1 ? "active" : "";
                htmlValue +=rec.getValue("normImageUrl")+",";
                if(nn ==1){
                    $(".carousel-inner").append('<LI class="item"><img src="' + rec.getValue("normImageUrl") + '"></li>');

                }else{
                    $(".carousel-inner").append('<LI class="item"><img data-imgurl="'+rec.getValue("normImageUrl")+'" src=""></li>');
                }
//                $(".carousel-inner").append('<LI class="item"><img data-imgurl="'+rec.getValue("normImageUrl")+'" src="' + rec.getValue("normImageUrl") + '"></li>');
//                $(".carousel-inner").append('<div class="item ' + active + '"><img src="' + rec.getValue("normImageUrl") + '"></div>');
//                $(".carousel-indicators").append('<li data-target="#myCarousel" class="' + active + '" data-slide-to="' + (nn - 1) + '"> </li>');
            }
			$(".curNumhtml").html("1");
            $(".numallhtml").append(recs.getLength());
            $("#carouselimgs").val(htmlValue);
			var viewSize=sinoMobileUtil.getViewSize();
            var windowWidth=viewSize.w;
			var imgHeight=(viewSize.h)/1.5;
            //$("#myCarousel").yxMobileSlider({width:windowWidth-20,height:imgHeight,during:1000000});
            //$("#myCarousel").yxMobileSlider({width:"25rem",height:"30rem",during:100000});
			
			$("#myCarousel").yxMobileSlider({during:100000});
	      }

       

		productPage.loadError=function (result, textStatus, errorThrown){	
				sinoMobileUtil.loadErrorCall(result, textStatus, errorThrown,false);
		}
		productPage.loadCanReloadError=function (result, textStatus, errorThrown){	
				sinoMobileUtil.loadErrorCall(result, textStatus, errorThrown,true);
		}
		productPage.clickSearchBar=function(){
		
			if($(".search-box").is(":hidden")){				
				$(".search-box").show();
				$("#keyWord").focus();
			}else{
				$(".search-box").hide();
			}
		}
		productPage.showSaleControl=function(type){
			
			var msg="";
			var title="";
			if(type=="1"){
				msg=$("#controlMsg").html();
				title="促销限制";
			}else if(type=="2"){
				msg=$("#commentsMsg").html();
				title="促销优惠";
			}
			$("#controlTitle").html(title);
			$(".qgzgsm_con").html(msg);
			$(".editshopcart-bg").show();
			$(".qgzgsm_t").show();
		} 
		productPage.closeSaleControl=function(msg){
			$(".editshopcart-bg").hide();
			$(".qgzgsm_t").hide();
		} 
        return productPage;
    }
}
