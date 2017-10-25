	var pictureSource;		//图片来源
	var destinationType;		//设置返回值的格式
    var srcPicFile="";
	// 等待PhoneGap连接设备
	document.addEventListener("deviceready",onDeviceReady,false);
	
	// PhoneGap准备就绪，可以使用！
	function onDeviceReady() {
		pictureSource=navigator.camera.PictureSourceType;
		destinationType=navigator.camera.DestinationType;
	}
	
	// 当成功获得一张照片的Base64编码数据后被调用
	function onPhotoDataSuccess(imageData) {
	//showAlert('当成功获得一张照片的Base64编码数据后');
		// 取消注释以查看Base64编码的图像数据
		// console.log(imageData);
		// 获取图像句柄
		var smallImage = document.getElementById('smallImage');
			 
		// 取消隐藏的图像元素
		smallImage.style.display = 'block';
		
		// 显示拍摄的照片
		// 使用内嵌CSS规则来缩放图片
        //alert(imageData);

		//smallImage.src = "data:image/jpeg;base64," + imageData;


        srcPicFile= imageData;
        smallImage.src = imageData;
        $("#FileName").attr("value",imageData);
		//canvasApp(imgFile);
	}

    function compressPhoto(){
                //压缩文件
        if(srcPicFile==''){
            alert('没有图片文件！');
            return;
        }
        var path=window.localStorage.getItem("tmpFilePath");
        var targetImgPath=path+"/sinoprof/";
        sinoprof.commonPlugin.compressImage(srcPicFile,targetImgPath,400,300,500,compressSucess,compressFail);
    }
	function compressSucess(targetImg){
        smallImage.src = targetImg;
        $("#FileName").attr("value",targetImg);
    }
    function compressFail(e){
          alert('压缩文件出错：'+ e);
     }
    function watermarkPhoto(longitude,latitude){
        //加文字水印
        var src=$("#FileName").val();
        if(src==null){
            alert('没有图片文件！');
            return;
        }
        var path=window.localStorage.getItem("tmpFilePath");
        var newImgFilePath=path+"/sinoprof/";
        var gps="经度："+longitude;
        var gps2="纬度："+latitude;
        var textjo=[{title:'北京思诺博',bold:'Y',fontName:'宋体',fontSize:22,fontColor:'gray',rotate:-30,markX:0.4,markY:0.8,alpha:50},
            {title:gps,bold:'Y',fontName:'宋体',fontSize:9,fontColor:'blue',rotate:0,markX:0.7,markY:0.1,alpha:50},
            {title:gps2,bold:'Y',fontName:'宋体',fontSize:9,fontColor:'blue',rotate:0,markX:0.7,markY:0.3,alpha:50}];
        var markImg="watermark/logo.jpg";      //getRootPath()+
        var photojo=[{markImg:markImg,markX:0.2,markY:0.2,rotate:-30,alpha:50},
            {markImg:markImg,markX:0.4,markY:0.4,rotate:-30,alpha:50},
            {markImg:markImg,markX:0.6,markY:0.6,rotate:-30,alpha:50},
            {markImg:markImg,markX:0.8,markY:0.8,rotate:-30,alpha:50}];
        sinoprof.commonPlugin.watermarkImage(src,newImgFilePath,photojo,textjo,markSuccess,markFail);
       // sinoprof.commonPlugin.watermarkImage(src,newImgFile,markImg,4,0,textjo,markSuccess,markFail);
    }
    function markSuccess(imgFile){
        smallImage.src = imgFile;
         $("#FileName").attr("value",imgFile);
    }
    function markFail(e){
              alert('加水印出错：'+ e);
         }
   // 当成功得到一张照片的URI后被调用
   function onPhotoURISuccess(imageURI) {

		// 取消注释以查看图片文件的URI
		// console.log(imageURI);
		// 获取图片句柄
		var largeImage = document.getElementById('largeImage');
		 
		// 取消隐藏的图像元素
		largeImage.style.display = 'block';
	
		// 显示拍摄的照片
		// 使用内嵌CSS规则来缩放图片
		largeImage.src = imageURI;
	}
	   
   // “Capture Photo”按钮点击事件触发函数
   function capturePhoto() {
//alert('capturePhoto');
		// 使用设备上的摄像头拍照，并获得Base64编码字符串格式的图像
		//showAlert('使用设备上的摄像头拍照，并获得Base64编码字符串格式的图像');
		//alert('1');
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, allowEdit: false });
	//	alert('2');
   }
   
   // “Capture Editable Photo”按钮点击事件触发函数
   function capturePhotoEdit() {

		// 使用设备上的摄像头拍照，并获得Base64编码字符串格式的可编辑图像
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true });
   }
	   
   //“From Photo Library”/“From Photo Album”按钮点击事件触发函数
   function getPhoto(source) {
   
   		// 从设定的来源处获取图像文件URI
		navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
		destinationType: destinationType.FILE_URI,sourceType: source });
   }

   // 当有错误发生时触发此函数
   function onFail(message) {
		alert('Failed because: ' + message);
   }
	// 显示一个定制的警告框
	function showAlert(msg) {
		navigator.notification.alert(
			msg,  // 显示信息
			alertDismissed,         // 警告被忽视的回调函数
			'Game Over',            // 标题
			'Done'                  // 按钮名称
		);
	}
	
	function alertDismissed() {
	// 进行处理
}


