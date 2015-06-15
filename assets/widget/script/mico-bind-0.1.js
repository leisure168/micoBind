/*
 * JavaScript Library
 * Copyright (c) 2015 mxchip.com
 */
(function(window) {
	var m = {};
	m.test = function(str) {
		return str.length;
	};

	//获取设备列表
	m.getDevList = function(userToken, callback) {
		var sucm;
		var errm;
		//创建deviceid的json数组，供前端调用
		var devinfo = {
			devId : [],
			online : []
		};
		AV.Cloud.run('getDevList', {
			userToken : userToken,
		}, {
			success : function(ret) {
				//将获得的设备列表按照APICloud的listview的格式组装
				if (ret.data) {
					var arrayObj = new Array();
					var i = 0;
					var alias;
					$(ret.data).each(function() {
						//设备图标
						var imgPath;
						//设备名字
						var devName;
						var titleColor;
						var subTitleColor;
						if (this.online == "1") {
							imgPath = "widget://image/devimg" + ((i++) % 5 + 1) + ".png";
							devName = this.alias;
							titleColor = "#1c6ac6";
							subTitleColor = "#895b5b";
						} else {
							imgPath = "widget://image/devoffline.png";
							devName = "(离线中)" + this.alias;
							titleColor = "#afafaf";
							subTitleColor = "#afafaf";
						}

						alias = {
							"img" : imgPath,
							"title" : devName,
							"titleSize" : "15",
							"subTitle" : "MAC:" + this.bssid + " (IP:" + this.ip + ")",
							"titleColor" : titleColor,
							"subTitleColor" : subTitleColor
							//"subTitle" : "MAC:" + this.bssid + "\r\nIP:" + this.ip
						};
						devinfo.devId.push(this.id);
						devinfo.online.push(this.online);
						arrayObj.push(alias);
					});
					//alert('Hello = ' + JSON.stringify(arrayObj));
					callback(arrayObj, errm, devinfo);
				} else {
					callback(sucm, "数据格式不对", devinfo);
				}
			},
			error : function(err) {
				//处理调用失败
				callback(sucm, err, devinfo);
			}
		});
	};

	//获取owner权限的设备
	m.getAuthDev = function(userToken, callback) {
		var sucm;
		var errm;
		//创建deviceid的json数组，供前端调用
		var devinfo = {
			devId : []
		};
		AV.Cloud.run('getAuthDev', {
			userToken : userToken,
		}, {
			success : function(ret) {
				//将获得的设备列表按照APICloud的listview的格式组装
				if (ret.data) {
					var arrayObj = new Array();
					var alias;
					$(ret.data).each(function() {
						alias = {
							"img" : "widget://image/authdev.png",
							"title" : this.alias,
							"titleSize" : "15",
							//"subTitle" : "MAC:" + this.bssid + "\r\nIP:" + this.ip
							"subTitle" : "MAC:" + this.bssid + " (IP:" + this.ip + ")",
							"titleColor" : "#00a29a",
							"subTitleColor" : "#895b5b"
						};
						devinfo.devId.push(this.id);
						arrayObj.push(alias);
					});
					callback(arrayObj, errm, devinfo);
				} else {
					callback(sucm, "数据格式不对", devinfo);
				}
			},
			error : function(err) {
				//处理调用失败
				callback(sucm, err, devinfo);
			}
		});
	};

	//修改设备名称
	m.editDevName = function(appid, usertoken, devname, devid, callback) {
		var sucm;
		var errm;
		$.ajax({
			url : "http://api.easylink.io/v1/device/modify",
			type : 'POST',
			data : JSON.stringify({
				device_id : devid,
				alias : devname
			}),
			headers : {
				"Content-Type" : "application/json",
				"X-Application-Id" : appid,
				"Authorization" : "token " + usertoken
			},
			success : function(ret) {
				callback("success", errm);
			},
			error : function(err) {
				callback(sucm, err);
			}
		});
	};

	//删除设备
	m.deleteDev = function(appid, usertoken, devid, callback) {
		var sucm;
		var errm;
		$.ajax({
			url : "http://api.easylink.io/v1/device/delete",
			type : 'POST',
			data : JSON.stringify({
				device_id : devid
			}),
			headers : {
				"Content-Type" : "application/json",
				"X-Application-Id" : appid,
				"Authorization" : "token " + usertoken
			},
			success : function(ret) {
				callback("success", errm);
			},
			error : function(err) {
				callback(sucm, err);
			}
		});
	};

	//获取设备id
	m.getDevid = function(devip, devpsw, devtoken, callback) {
		var sucm;
		var errm;
		var ajaxurl = 'http://' + devip + ':8001/dev-activate';
		$.ajax({
			url : ajaxurl,
			type : 'POST',
			data : JSON.stringify({
				login_id : "admin",
				dev_passwd : devpsw,
				user_token : devtoken
			}),
			headers : {
				"Content-Type" : "application/json"
			},
			success : function(ret) {
				callback(ret, errm);
			},
			error : function(err) {
				callback(sucm, err);
			}
		});
	};


	//获取设备激活状态
	m.getDevState = function(devip, devtoken, callback) {
		var sucm;
		var errm;
		var ajaxurl = 'http://' + devip + ':8001/dev-state';
		$.ajax({
			url : ajaxurl,
			type : 'POST',
			data : JSON.stringify({
				login_id : "admin",
				dev_passwd : "88888888",
				user_token : devtoken
			}),
			headers : {
				"Content-Type" : "application/json"
			},
			success : function(ret) {
				callback(ret, errm);
			},
			error : function(err) {
				callback(sucm, err);
			}
		});
	};

	//去云端绑定设备
	m.bindDevCloud = function(appid, usertoken, devtoken, callback) {
		var sucm;
		var errm;
		$.ajax({
			url : 'http://api.easylink.io/v1/key/authorize',
			type : 'POST',
			data : {
				active_token : devtoken
			},
			headers : {
				"Authorization" : "token " + usertoken,
				"X-Application-Id" : appid
			},
			success : function(ret) {
				callback(ret, errm);
			},
			error : function(err) {
				callback(sucm, err);
			}
		});
	};

	//授权设备
	m.authDev = function(appid, usertoken, phone, devid, callback) {
		var sucm;
		var errm;
		$.ajax({
			url : 'http://api.easylink.io/v1/key/user/authorize',
			type : 'POST',
			data : {
				login_id : phone,
				owner_type : "share",
				id : devid,
			},
			headers : {
				"Authorization" : "token " + usertoken,
				"X-Application-Id" : appid
			},
			success : function(ret) {
				callback(ret, errm);
			},
			error : function(err) {
				callback(sucm, err);
			}
		});
	};

	/*end*/
	window.$mico = m;

})(window);
