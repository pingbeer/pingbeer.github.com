/**
*  Module: personal
*  Author: qyj
*  Create Time:
*  Last Modify Time: 2
 *******************************
 * 收货地址
 * */

var AddressClass={
	createNew:function(){
		var address={};
		var ajaxJsonProp={
            //servlet访问接口
            servlet:'',
            //操作参数 act
            act:'',
            //提交服务器参数
            parmData:'',
            //执行成功后的回调函数
            successCallbackFunc:null
        };
		// 处理错误日志
        address.loadError=function (result, textStatus, errorThrown){
			sinoShopping.setUIButtonDisabledStatus(false);
			$(".onLoad").hide();

            if (textStatus!=null) {
					if (textStatus == 'timeout') {
						sinoMobileUI.alert("服务器连接超时.");
						return;
					}else if(textStatus == 'parsererror'){
						sinoMobileUI.alert("服务器处理发生错误，返回数据解析失败.");
						return;
					}
			}

            var httpErrorCode=result.status;
            if(httpErrorCode==null||httpErrorCode==""||httpErrorCode=="undefined"){
                sinoMobileUI.alert("服务器返回错误，操作不能继续！");
            }else{
                httpErrorCode=httpErrorCode+"";
                if(httpErrorCode=="403"){
                    //session失效，重新登录
                    sinoMobileUtil.autoLogin(sinoMobileUtil.getCurrent2RootRelateFullPath());
                }else if(httpErrorCode=="404"){
                    //sinoMobileUtil.autoLogin(sinoMobileUtil.getCurrent2RootRelateFullPath());
                    sinoMobileUI.alert("服务器没有响应，或访问地址不可用！");
                }else if(httpErrorCode=="200" ){
						//sinoMobileUI.alert("内部错误：！");
				}else if(httpErrorCode=="401" ){
						util.autoLogin(util.getCurrent2RootRelateFullPath());
				}else{
                    sinoMobileUI.alert("服务器返回错误，操作不能继续！") ;
                }
            }
        }
		//从后台调用数据的总入口
        address.loadDataFromServer=function(){
            var strUrl=sinoMobileUtil.getHostURL()+ajaxJsonProp.servlet;
            sinoMobileUtil.ajaxCall(strUrl,ajaxJsonProp.act,ajaxJsonProp.parmData,ajaxJsonProp.successCallbackFunc,address.loadError);
        };

		/**
		* 1. 根据url获取地址详细
		**/
		address.loadDetailByUrl=function(){
			var addressInfoId = $.query.get("addressInfoId");
			var rcvContact = $.query.get("rcvContact");
			var rcvContactPhone = $.query.get("rcvContactPhone");
			var rcvSiteAddress = $.query.get("rcvSiteAddress");
			var province = $.query.get("province");
			var city = $.query.get("city");
			var district = $.query.get("district");
			var street = $.query.get("street");
			var certificateNo = $.query.get("certificateNo");
			if(certificateNo==true) {
　				certificateNo='';
			}
			if(province==true) {
　				province='河南省';
			}
			if(city==true) {
　				city='';
			}
			if(district==true) {
　				district='';
			}
			if(street==true) {
　				street='';
			}

			$('#addressInfoId').val(addressInfoId);
			$('#rcvContact').val(rcvContact);
			$('#rcvContactPhone').val(rcvContactPhone);
			$('#rcvSiteAddress').val(rcvSiteAddress+'');
			$('#certificateNo').val(certificateNo);
			$('#province').val(province);
	        address.initCitysDistrict(city,district,street);
		}
		/**
		* 2. 删除地址
		**/
		address.remove=function() {
			var dzAddressInfoId =$('#addressInfoId').val();
			var parm = '{"dzAddressInfoId":"' +dzAddressInfoId+'"}';
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_ADDRESS;
            ajaxJsonProp.act="DELETE_ADDRESS";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=address.removeSuccess;
            address.loadDataFromServer();
		}
        address.removeSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUI.alert("操作成功");
              	sinoMobileUI.doOpenPersonalAddressListPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		/**
		* 3. 添加地址
		**/
		address.add=function(isDefault) {
			var rcvContact=$('#rcvContact');
			var rcvContactPhone=$('#rcvContactPhone');
			var rcvSiteAddress=$('#rcvSiteAddress');
			var province=$('#province');
			var city=$('#city');
			var district=$('#district');
			var street = $('#street');
			var certificateNo=$('#certificateNo');

			if( !rcvContact.val() || rcvContact.val().length==0){
				sinoMobileUI.alert("请填写收货人！");
				rcvContact.focus();
				return;
			}
			if(!rcvContactPhone.val() || rcvContactPhone.val().length==0){
				sinoMobileUI.alert("请填写手机号！");
				rcvContactPhone.focus();
				return;
			}
			if( !sinoMobileUtil.isMobilenum( rcvContactPhone.val() )) {
				sinoMobileUI.alert("手机号格式错误！");
				rcvContactPhone.focus();
				return ;
			}

			if(!certificateNo.val()|| certificateNo.val().length==0){
				sinoMobileUI.alert("请填写身份证号！");
				certificateNo.focus();
				return;
			}


			//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if(reg.test(certificateNo.val() ) === false) {
				sinoMobileUI.alert("身份证号输入不合法！");
				certificateNo.focus();
				return ;
			}

			if( !province.val()|| province.val().length==0){
				province.focus();
				 return;
			}
			if( !city.val() || city.val().length==0){
				sinoMobileUI.alert("请选择城市！");
				city.focus();
				return;
			}
			if( !district.val() || district.val().length==0){
				sinoMobileUI.alert("请选择县区！");
				district.focus();
				return;
			}
			if( !street.val() || street.val().length==0){
				sinoMobileUI.alert("请选择街道！");
				street.focus();
				return;
			}
			if( rcvSiteAddress.val().length==0 || rcvSiteAddress.val().length==0){
			    sinoMobileUI.alert("请填写地址！");
				rcvSiteAddress.focus();
				return;
			}
			if( rcvSiteAddress.val().length<5 || rcvSiteAddress.val().length>200){
				sinoMobileUI.alert("地址不能小于5个汉字或者大于200个汉字！");
				rcvSiteAddress.focus();
				return;
			}
			var rec = new Record();
	        rec.addField("rcvContact", rcvContact.val());
	        rec.addField("rcvContactPhone", rcvContactPhone.val());
	        rec.addField("rcvSiteAddress", rcvSiteAddress.val());
	        rec.addField("province", province.val());
	        rec.addField("city", city.val());
	        rec.addField("district", district.val());
	        rec.addField("certificateNo", certificateNo.val());
	        rec.addField("street", street.val());
	        rec.addField("isDefault",isDefault);

			var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_ADDRESS;
            ajaxJsonProp.act="ADD_ADDRESS";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=address.addSuccess;
            address.loadDataFromServer();
		}
        address.addSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUI.alert("添加成功");
              	sinoMobileUI.doOpenPersonalAddressListPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		/**
		* 4. 修改地址
		**/
		address.update=function() {
			var dzAddressInfoId =$('#addressInfoId');
			var rcvContact=$('#rcvContact');
			var rcvContact=$('#rcvContact');
			var rcvContactPhone=$('#rcvContactPhone');
			var rcvSiteAddress=$('#rcvSiteAddress');
			var province=$('#province');
			var city=$('#city');
			var district=$('#district');
			var street=$('#street');
			var certificateNo=$('#certificateNo');

			if( !rcvContact.val()|| rcvContact.val().length==0){
				sinoMobileUI.alert("请填写收货人！");
				rcvContact.focus();
				 return;
			}
			if( !rcvContactPhone.val()|| rcvContactPhone.val().length==0){
				sinoMobileUI.alert("请填写手机号！");
				rcvContactPhone.focus();
				 return;
			}

			if( !sinoMobileUtil.isMobilenum( rcvContactPhone.val() )) {
				sinoMobileUI.alert("手机号格式错误！");
				rcvContactPhone.focus();
				return ;
			}


			if( !certificateNo.val()|| certificateNo.val().length==0){
				sinoMobileUI.alert("请填写身份证号！");
				certificateNo.focus();
				return;
			}
			//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if(reg.test(certificateNo.val() ) === false) {
				sinoMobileUI.alert("身份证号输入不合法！");
				certificateNo.focus();
				return ;
			}

			if( !province.val()|| province.val().length==0){
				province.focus();
				 return;
			}
			if( !city.val() || city.val().length==0){
				sinoMobileUI.alert("请选择城市！");
				city.focus();
				 return;
			}
			if( !district.val() || district.val().length==0){
				sinoMobileUI.alert("请选择县区！");
				district.focus();
				 return;
			}
			if( !street.val() || street.val().length==0){
				sinoMobileUI.alert("请选择街道！");
				 street.focus();
				 return;
			}

			if( !rcvSiteAddress.val() || rcvSiteAddress.val().length==0){
				sinoMobileUI.alert("请填写地址！");
				rcvSiteAddress.focus();
				 return;
			}
			if( rcvSiteAddress.val().length<5 || rcvSiteAddress.val().length>200){
				sinoMobileUI.alert("地址不能小于5个汉字或者大于200个汉字！");
				rcvSiteAddress.focus();
				 return;
			}
            var rec = new Record();
	        rec.addField("dzAddressInfoId", dzAddressInfoId.val());
	        rec.addField("rcvContact", rcvContact.val());
	        rec.addField("rcvContactPhone", rcvContactPhone.val());
	        rec.addField("rcvSiteAddress", rcvSiteAddress.val());
	        rec.addField("province", province.val());
	        rec.addField("city", city.val());
	        rec.addField("district", district.val());
	        rec.addField("certificateNo", certificateNo.val());
	        rec.addField("street", street.val());
			var parm = rec.toJsonString();
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_ADDRESS;
            ajaxJsonProp.act="UPDATE_ADDRESS";
            ajaxJsonProp.parmData=parm;
            ajaxJsonProp.successCallbackFunc=address.updateSuccess;
            address.loadDataFromServer();
		}
        address.updateSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUI.alert("修改成功");
              	sinoMobileUI.doOpenPersonalAddressListPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }
		/**
		* 5. 设置默认地址
		**/
		address.setDefault=function() {
			var dzAddressInfoId =$('#addressInfoId').val();
			var parm = {'dzAddressInfoId':dzAddressInfoId};
            ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_ADDRESS;
            ajaxJsonProp.act="SET_DEFAULT_ADDRESS";
            ajaxJsonProp.parmData=JSON.stringify(parm);
            ajaxJsonProp.successCallbackFunc=address.setDefaultSuccess;
            address.loadDataFromServer();
		}
        address.setDefaultSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUI.alert("设置成功");
              	sinoMobileUI.doOpenPersonalAddressListPage();
            } else {
                sinoMobileUI.alert("出现错误！" + data.msg);
            }
			$(".onLoad").hide();

        }

        address.initCitysDistrict = function(selectedCity,selectedDistrict,selectedStreet) {
            var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_PERSONAL_CITY_ALL);
			if(datas && datas.length>0 ) {
				address.loadCityBySession();
				$("#city").val(selectedCity);
                address.selectCityOk();
                $("#district").val(selectedDistrict);
                address.selectDistrictOk();
                $("#street").val(selectedStreet);
			} else {
				var parm = '';
				ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_ADDRESS;
				ajaxJsonProp.act="GET_RCV_PROVINCE_CITY_DISTRICT";
				ajaxJsonProp.parmData=parm;
				ajaxJsonProp.successCallbackFunc = function(data){
					if (data.code + "" == "1") {
	                    sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_PERSONAL_CITY_ALL,sinoMobileUtil.getJsonStringFromResponseData(data,"provinceCityDistrictData"));
						address.loadCityBySession();
						$("#city").val(selectedCity);
	                    address.selectCityOk();
	                    $("#district").val(selectedDistrict);
	                    address.selectDistrictOk();
	                    $("#street").val(selectedStreet);
		            } else {
		                sinoMobileUI.alert("加载城市出现错误！" + data.msg);
		            }
				};
				address.loadDataFromServer();
	        }
        }
		/**
		* 6. 获取所有城市
		**/
		address.loadAllCityFromServer=function() {
			var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_PERSONAL_CITY_ALL);
			if(datas && datas.length>0 ) {
				address.loadCityBySession();
			} else {
				var parm = '';
				ajaxJsonProp.servlet=sinoMobileConfig.CONST_SERVLET_PERSIONAL_ADDRESS;
				ajaxJsonProp.act="GET_RCV_PROVINCE_CITY_DISTRICT";
				ajaxJsonProp.parmData=parm;
				ajaxJsonProp.successCallbackFunc=address.loadAllCityFromServerSuccess;
				address.loadDataFromServer();
			}
		}
		 address.loadAllCityFromServerSuccess = function (data) {
            if (data.code + "" == "1") {
				sinoMobileUtil.saveSessionStorage(sinoMobileConfig.CONST_SESSION_PERSONAL_CITY_ALL,sinoMobileUtil.getJsonStringFromResponseData(data,"provinceCityDistrictData"));
				address.loadCityBySession();
            } else {
                sinoMobileUI.alert("加载城市出现错误！" + data.msg);
            }
        }

        /*9 取街道*/
		address.selectDistrictOk=function() {
			var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_PERSONAL_CITY_ALL);
			var datalist=$.parseJSON(datas);
			var city=$('#city');
			var district=$('#district');
			$("#street").empty();
			var s ="";
			for(var i=0;i<datalist.length;i++) {
				if( datalist[i].city==city.val()&&datalist[i].district==district.val()) {
				      if(s.indexOf( datalist[i].street)==-1 ) {
						  if(s=="") {
							  s=datalist[i].street;
						  } else {
							  s+=','+datalist[i].street;
						  }
				       }
				}
			}

           var list=s.split(',');
           var option = $("<option>").val("").text("---请选择---");
		   $("#street").append(option);
           for(var i=0;i<list.length;i++) {
			   var option = $("<option>").val(list[i]).text(list[i]);
			   $("#street").append(option);
		   }
		}

		/*9 取县*/
		address.selectCityOk=function() {
			var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_PERSONAL_CITY_ALL);
			var datalist=$.parseJSON(datas);
			var city=$('#city');
			$("#district").empty();
			$("#street").empty();
			var s ="";
			for(var i=0;i<datalist.length;i++) {
				if( datalist[i].city==city.val()) {
				      if(s.indexOf( datalist[i].district)==-1 ) {
						  if(s=="") {
							  s=datalist[i].district;
						  } else {
							  s+=','+datalist[i].district;
						  }
				       }
				}
			}

           var list=s.split(',');
           var option = $("<option>").val("").text("---请选择---");
		   $("#district").append(option);
           for(var i=0;i<list.length;i++) {
			   var option = $("<option>").val(list[i]).text(list[i]);
			   $("#district").append(option);
		   }
		}
		/*10 取市*/
		address.loadCityBySession=function() {
			var datas=sinoMobileUtil.getSessionStorageValue(sinoMobileConfig.CONST_SESSION_PERSONAL_CITY_ALL);
			var datalist=$.parseJSON(datas);
			var s="";
			for(var i=0,k=0;i<datalist.length;i++) {
				if(s.indexOf( datalist[i].city)==-1 ) {
						if(s=="") {
							s=datalist[i].city;
						} else {
							s+=','+datalist[i].city;
						}
				}
			}
			var citylist=s.split(',');
			var city=$('#city');
			var option = $("<option>").val("").text("---请选择---");
			city.append(option);
			for(var i=0;i<citylist.length;i++) {
				  var option = $("<option>").val(citylist[i]).text(citylist[i]);
				  city.append(option);
			}
		}
		address.goAddPage=function() {
			window.location.href="add.html";
		}
		address.goEditPage=function(addressInfoId,rcvContact,rcvContactPhone,rcvSiteAddress,province,city,district,certificateNo,street) {
			window.location.href="edit.html?"+
			"addressInfoId="+addressInfoId+
			"&rcvContact="+rcvContact+
			"&rcvContactPhone="+rcvContactPhone+
			"&rcvSiteAddress="+rcvSiteAddress+
			"&province="+province+
			"&city="+city+
			"&district="+district+
			"&certificateNo="+certificateNo+
			"&street="+street;
		}

		return address;
	}
}
var address=AddressClass.createNew();