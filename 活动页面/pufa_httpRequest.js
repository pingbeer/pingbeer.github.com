/**
 * Ajax请求服务
 * @param url 请求地址
 * @param data 请求数据
 * @param isJson 是否以JSON字符串的格式请求服务器，默认：是(true)
 * @param isAsync 是否异步请求，默认：是(true)
 * @param isAlertError 是否弹出默认的错误提示框，默认：是(true)
 * @param method 请求方式post/get，默认post请求
 * @param dataType 返回的数据类型格式text、xml、html、json、script、jsonp，默认json格式
 * @param contentType 请求内容类别，默认以utf-8的json格式请求
 * @param successFunc 成功回调函数
 * @param failFunc 失败回调函数
 */
function HTTPRequest(options){
	this.settings = {
		url : null,
		data : null,
		isJson : true,
		isAsync : true,
		isAlertError : true,
        isMask : true,
		method : "post",
		dataType : "json",
		contentType : "application/json;charset=utf-8",
		successFunc : null,
		successFuncArray : [],
		failFunc : null
	};

	// 合并参数
	this.settings = $.extend(this.settings, options);

    if (this.settings.isMask === true) {
        //请求时，防止用户继续操作
        var mask = new Mask("wait",100);
        mask.show(true);
        this.mask = mask;
    }

    //支持多个成功回调函数
    this.addSuccessFunction = function (_func) {
        this.settings.successFuncArray.push(_func);
    };
	
    //发送JSON请求
    this.sendJSON = function () {
		if(this.settings.isJson === true){
			var jsonValue = JSON.stringify(this.settings.data);
			while(jsonValue != null && jsonValue != undefined && jsonValue != '' && jsonValue.indexOf( ':"null"' ) != -1){
				jsonValue = jsonValue.replace(':"null"', ':""'); 
			}
			this.settings.data = jsonValue;
		}

        var _this = this;
        $.ajax({
            type : this.settings.method,
            url : this.settings.url,
            dataType : this.settings.dataType,
            contentType : this.settings.contentType,
            data : this.settings.data,
            async : this.settings.isAsync === false ? this.settings.isAsync : true,
            success : function(result){
            	if(result != null && result.errorCode){
            		layer.alert(result.errorMessage,{icon: 0});
                    if (_this.settings.isMask === true) {
                        _this.mask.close();
                    }
            		return;
            	}
                try{
                	if(_this.settings.successFunc){
                		_this.settings.successFunc.call(this,result);
                	}
                    if(_this.settings.successFuncArray.length > 0){
                        for (var i = 0; i < _this.settings.successFuncArray.length;i ++){
                            _this.settings.successFuncArray[i].call(this,result);
                        }
                    }
                }catch(e){
//                	alert(_this.url);
                	// layer.alert("迷失一会：" + e.message,{icon: 0});
                	lcyh_.to({message:"系统繁忙，请稍后重试！"});
                }
                if (_this.settings.isMask === true) {
                    _this.mask.close();
                }
            },
            error:function(xmlHttpReq,textStatus,errorThrown){
//            	 alert(_this.url);
                if(_this.settings.isAlertError){
                	// 页面校验session过期后会跳转index页面
                	if(xmlHttpReq.responseText && xmlHttpReq.responseText.indexOf('index.html') > 0){
                		lcyh_.to({message:"页面已经过期，请重新登录！"});
                		window.location.href="../index.htm";
                	}else{
                		// 非过期页面正常提示
                		lcyh_.to({message:"系统繁忙，请稍后重试！"});
                	}
                }
                if(_this.settings.failFunc){
                    _this.settings.failFunc.call(this,xmlHttpReq.responseText);
                }
                if (_this.settings.isMask === true) {
                    _this.mask.close();
                }
            }
        });
    };
}