/**
 *  Module: 公告列表，公告详细
 *  Author: chenwj
 *  Create Time:2015-9-7
 *  Last Modify Time: 2015-9-7
 */
infoList = {
	createNew : function() {
		var info = {};
		//加载状态
		var loadReady = true;
		//请求的当前页
		var currPage = 1;
		var keyWord = "";

		info.doLoadNextPage = function() {
			//上次未加载完毕，则不响应
			if (!loadReady) {
				return;
			}
			currPage = currPage + 1;
			loadReady = false;
			//如果到达最后一页则不加载
			if (currPage > totalPage) {
				return;
			}
			$(".onLoad-next").show();
			info.loadDataFromServer();
		};
		
		info.loadDataFromServer = function() {
			loadReady = false;
			var parm = new Record();
			parm.addField("currPage", currPage);
			var strUrl = sinoMobileUtil.getHostURL() + sinoMobileConfig.CONST_SERVLET_INFO;
			sinoMobileUtil.ajaxCall(strUrl, "GET_INFO_LIST", parm.toJsonString(), info.loadinfoSuccess, info.loadError);
		};

		info.loadinfoSuccess = function(data) {
			loadReady = true;
			if (data.code == "1") {
				var recs = sinoMobileUtil.getRecordsFromResponseData(data, "infoData");
				if (recs == null || recs.getLength() == 0) {
					if (currPage <= 1) {
						sinoMobileUI.showEmptyMsg("");
					}
				} else {
					var template = $("#template").html();
					var infoslist = $("#infoListList");
					var nLen = recs.getLength();
					var rec = null;
					var html = "";
					if (nLen > 0) {
						rec = recs.getNthRecord(1);
						totalPage = rec.getValue("appTotalPage");
					}
					for (var nn = 1; nn <= nLen; nn++) {
						rec = recs.getNthRecord(nn);
						html = template;
						html = sinoMobileUtil.getFormatedTemplateHtml(html, rec);
						infoslist.append(html + "\r");
					}
				}
				$(".onLoad").hide();
				$(".onLoad-next").hide();
			} else {
				sinoMobileUI.alert(data.msg);
			}
		};

		info.loadError = function(result, textStatus, errorThrown) {
			loadReady = true;
			if (textStatus != null) {
				if (textStatus == 'timeout') {
					sinoMobileUI.alert("服务器连接超时.");
					return;
				} else if (textStatus == 'parsererror') {
					sinoMobileUI.alert("服务器处理发生错误，返回数据解析失败.");
					return;
				}
			}
			var httpErrorCode = result.status;
			if (httpErrorCode == null || httpErrorCode == "" || httpErrorCode == "undefined") {
				sinoMobileUI.alert("服务器返回错误，操作不能继续！");
			} else {
				httpErrorCode = httpErrorCode + "";
				if (httpErrorCode == "403") {
					//session失效，重新登录
					sinoMobileUtil.autoLogin(sinoMobileUtil.getCurrent2RootRelateFullPath());
				} else if (httpErrorCode == "404") {
					sinoMobileUI.doOpen404Page();
				} else if (httpErrorCode == "200") {
					//sinoMobileUI.alert("内部错误：！");
				} else if (httpErrorCode == "401") {
					util.autoLogin(util.getCurrent2RootRelateFullPath());
				} else {
					sinoMobileUI.alert("服务器返回错误，操作不能继续！");
				}
			}
		};

		info.getInfoDetail = function(publishId) {
			var parm = new Record();
			var strUrl = sinoMobileUtil.getHostURL() + sinoMobileConfig.CONST_SERVLET_INFO;
			parm.addField("publishId", publishId);
			sinoMobileUtil.ajaxCall(strUrl, "GET_INFO_CONTENT", parm.toJsonString(), info.loadinfoDetailSuccess, info.loadError);
		};

		info.loadinfoDetailSuccess = function(resData) {
			if (resData.code == "1") {
				$("#infoTitle").text(resData.data.title);
				$("#infoPublishDate").text(resData.data.publishDate);
				$("#infoContents").html(resData.data.contents);
			} else {
				sinoMobileUI.alert(resData.msg);
			}
		};
		return info;

	}
}
var sinoinfoList = infoList.createNew(); 