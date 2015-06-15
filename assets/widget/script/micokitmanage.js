/**
 * Created by rocke on 15-5-1.
 */

//全局deviceid
var devidglobal = "";
//当前div页面的标识
//0 不允许返回
//1 homepage
//2 devicelist
//3 devicecontrol
//4 uartchat
//5 EasyLink
//6 myself
//7 feedback
//8 authpage
//100 EasyLink配网
//101 EasyLink给设备设置密码
var pageTag = 1;
//js页面定时2秒publish
var selfInterval;
//rgb控制的2秒publish一次
var rgbctrlinterval;
//去云端绑定设备时候发的用户token
var userToken;
//设备列表obj
var devlistobj;
//owner权限设备列表obj
var authdevobj;
//uartchat的obj
var chatobj;

//是否开灯
var rgb_switch;
//灯颜色
var rgb_hues;
//灯的饱和度
var rgb_statu;
//灯的亮度
var rgb_bright;
//uartchat的数量标识
var linum = 1;
//设备IP
var dev_ip;
//去设备获取devid时候发的token
var dev_token;
//listview高度
var listy;
//app1当前用户回执
var app1;
//rgb read subscribe
var rgbreadtag = 1;

/*
* 首页列表部分
*/
//获取账号下所有可以控制的设备
function devicelist_getDevList() {
	//	alert("devicelist_getDevList");
	devlistobj = api.require('listView');
	$mico.getDevList(userToken, function(ret, err, devinfo) {
		if (ret) {
			devlistobj.open({
				//				h : 'auto',
				h : 800,
				y : listy,
				cellHeight : '87',
				rightBtn : [{
					color : '#d4257f',
					title : 'Delete'
				}, {
					color : '#d35f84',
					title : 'Edit'
				}],
				"borderColor" : "#CCCCCC",
				"cellBgColor" : "#FCFCFC",
				imgHeight : '45',
				imgWidth : '45',
				data : ret
			}, function(openret, err) {
				//openret.index //点击某个cell或其内部按钮返回其下标
				//openret.clickType //点击类型，0-cell；1-右边按钮；2-左边的按钮
				//openret.btnIndex //点击按钮时返回其下标 左1 右0
				//apiToast(openret.index + " " + openret.clickType + " " + openret.btnIndex, 2000);
				var cellIndex = openret.index;
				var clickType = openret.clickType;
				var btnIndex = openret.btnIndex;

				//整行选择
				if (clickType == 0) {
					//					alert("online = "+devinfo.online[openret.index]);
					//					if (devinfo.online[openret.index] == 1) {
					//					} else {
					//						apiToast("设备离线中", 2000);
					//					}
					changpage("deviceinfo", ret[openret.index].title);
					mqttconnect(devinfo.devId[openret.index]);
					devlistobj.close();
				}
				//按钮
				else if (clickType == 1) {
					//edit按钮
					if (btnIndex == 1) {
						modifyDevName(devinfo.devId[openret.index]);
					}
					//delete按钮
					else if (btnIndex == 0) {
						deleteDevName(devinfo.devId[openret.index]);
					}
				}
			});

			//刷新的小箭头，不可为空
			var loadingImgae = 'widget://image/shou.png';
			//下拉刷新的背景颜色 ，有默认值，可为空
			var bgColor = '#F5F5F5';
			//提示语颜色，有默认值，可为空
			var textColor = '#8E8E8E';
			//尚未触发刷新时间的提示语，有默认值，可为空
			var textDown = '下拉可以刷新...';
			//触发刷新事件的提示语，有默认值，可为空
			var textUp = '松开开始刷新...';
			//是否显示时间，有默认值，可为空
			var showTime = true;
			devlistobj.setRefreshHeader({
				loadingImg : loadingImgae,
				bgColor : bgColor,
				textColor : textColor,
				textDown : textDown,
				textUp : textUp,
				showTime : showTime
			}, function(ret, err) {
				//devicelist_getDevList();
				//触发加载事件
				//micokit
				$mico.getDevList(userToken, function(ret, err, devinfo) {
					if (ret) {
						devlistobj.reloadData({
							data : ret
						});
					} else {
					}
				});
			});
		} else {
		}
	});
}

//获取所有可以授权的设备
function devicelist_getAuthDev() {
	//			alert("devicelist_getAuthDev");
	authdevobj = api.require('listView');
	$mico.getAuthDev(userToken, function(ret, err, devinfo) {
		if (ret) {
			authdevobj.open({
				h : 800,
				y : listy,
				cellHeight : '87',
				"borderColor" : "#CCCCCC",
				"cellBgColor" : "#FCFCFC",
				imgHeight : '45',
				imgWidth : '45',
				data : ret
			}, function(openret, err) {
				api.prompt({
					title : "授权给",
					msg : "请输入手机号",
					buttons : ['确定', '取消']
				}, function(ret, err) {
					if (ret.buttonIndex == 1) {
						var phone = ret.text;
						if (true != isphone2(phone)) {
							apiToast("请输入正确的手机号", 1000);
						} else {
							remoteAuthdev(devinfo.devId[openret.index], phone);
						}
					}
				});
			});
			//刷新的小箭头，不可为空
			var loadingImgae = 'widget://image/shou.png';
			//刷新的小箭头，不可为空
			var bgColor = '#F5F5F5';
			//下拉刷新的背景颜色 ，有默认值，可为空
			var textColor = '#8E8E8E';
			//提示语颜色，有默认值，可为空
			var textDown = '下拉可以刷新...';
			//尚未触发刷新时间的提示语，有默认值，可为空
			var textUp = '松开开始刷新...';
			//触发刷新事件的提示语，有默认值，可为空
			var showTime = true;
			//是否显示时间，有默认值，可为空
			authdevobj.setRefreshHeader({
				loadingImg : loadingImgae,
				bgColor : bgColor,
				textColor : textColor,
				textDown : textDown,
				textUp : textUp,
				showTime : showTime
			}, function(ret, err) {
				//触发加载事件
				//micokit
				$mico.getAuthDev(userToken, function(ret, err, devinfo) {
					if (ret) {
						authdevobj.reloadData({
							data : ret
						});
					} else {
					}
				});
			});
		} else {
		}
	});
}

//修改设备名字
function modifyDevName(devid) {
	var inputname = prompt("设备名字", "无名");
	if (inputname) {
		$mico.editDevName(APP_ID, userToken, inputname, devid, function(ret, err) {
			if (ret) {
				apiToast('好名字', 3000);
				devicelist_getDevList();
			} else {
				alert(JSON.stringify(err));
			}
		});
	} else {
		apiToast("真的叫无名啊", 2000);
	}
}

//删除设备
function deleteDevName(devid) {
	var ifdelete = window.confirm("确定删除?");
	if (ifdelete) {
		$mico.deleteDev(APP_ID, userToken, devid, function(ret, err) {
			if (ret) {
				apiToast('好吧', 3000);
				devicelist_getDevList();
			} else {
				alert(JSON.stringify(err));
			}
		});
	} else {
		apiToast("我就说嘛", 2000);
	}
}

/*
* 设备详细列表部分
*/
//连接MQTT，并设置订阅
function mqttconnect(deviceid) {
	showProgress("设备信息获取中", false);
	devidglobal = deviceid;
	var host = "http://api.easylink.io";
	var username = "";
	var password = "";
	var clientID = userToken.split("-")[0];
	app1 = clientID;
	//	var clientID = deviceid.split("/")[1];
	//	apiToast(clientID, 2000);
	micoSubscribe(host, username, password, deviceid + "/out/#", clientID);
	sleeprun(deviceid);
}

//设置2秒执行一次的publish操作获取设备状态
function sleeprun(deviceid) {
	selfInterval = self.setInterval("publishService('" + deviceid + "')", 2 * 1000)
}

//MQTT的publish请求，获取设备的所有状态
function publishService(deviceid) {
	micoPublish(deviceid + "/in/read/" + app1, "{}");
}

//MQTT里onMessageArrived回调的函数
function chgtxt(messageObj) {
	jsontest(messageObj);
}

function jsontest(strjson) {
	//传来的是String型的要转成json
	//		alert(strjson);
	var jsonstr = strjson;
	//	var jsonstr = $api.strToJson(strjson);
	for (var key in jsonstr) {
		if (key == "services") {
			$(jsonstr.services).each(function() {
				initKey(this.type, this.properties);
				switch(this.type) {
					case uartmsg:
						$("#chatliid").css("display", "block");
						break;
					case rgbdic:
						$("#rgbliid").css("display", "block");
						//主动读取rgb设备的信息
						readDevInfo('{"5":false,"6":0,"7":0,"8":0}');
						break;
					case adcdic:
						$("#devdataid").css("display", "block");
						$("#adcclsid").css("display", "block");
						break;
					//温度
					case tempdic:
						$("#devdataid").css("display", "block");
						$("#tempclsid").css("display", "block");
						break;
					//湿度
					case humidic:
						$("#devdataid").css("display", "block");
						$("#humiclsid").css("display", "block");
						break;
					//距离
					case pro_sensordic:
						$("#devdataid").css("display", "block");
						$("#pro_sensorclsid").css("display", "block");
						break;
					//大气
					case atmo_sensordic:
						$("#devdataid").css("display", "block");
						$("#atmo_sensorclsid").css("display", "block");
						break;
					//三轴加速
					case montion_sensordic:
						$("#devdataid").css("display", "block");
						$("#montion_sensorclsid").css("display", "block");
						break;
					//电机
					case motor_sensordic:
						$("#devdataid").css("display", "block");
						$("#motor_sensorclsid").css("display", "block");
						break;
					//红外
					case infraeddic:
						$("#devdataid").css("display", "block");
						$("#infraedclsid").css("display", "block");
						break;
				}
			});
			//	apiToast("Update Device", 2000);
			//	删除定时publish
			window.clearInterval(selfInterval);
			hidPro();
			//			alert("adckey = " + adckey + "uartkey = " + uartkey + "rgbswikey = " + rgbswikey + "rgbhueskey = " + rgbhueskey + "rgbsatukey = " + rgbsatukey + "rgbbrigkey = " + rgbbrigkey);
		} else {
			if (key == adckey) {
				$("#adcid").text(jsonstr[key]);
			} else if (key == infraredkey) {
				$("#infraedid").text(jsonstr[key]);
			} else if (key == temp_key) {
				$("#tempid").text(jsonstr[key] + "°C");
			} else if (key == humi_key) {
				$("#humiid").text(jsonstr[key] + "%RH");
			} else if (key == uartkey) {
				if (linum < 10) {
					linum++;
				} else {
					linum = 0;
					$("#chatmsg").empty();
				}
				var html = "<li class='devchatmsglicls' id='devsayli'><span>" + jsonstr[key] + "</span></li>";
				$("#chatmsg").append(html);
			} else if (key == rgbswikey && (1 == rgbreadtag)) {
				rgb_switch = jsonstr[key];
				if (jsonstr[key] == true) {
					$("#rgbonoffbtn").get(0).options[0].selected = true;
				} else {
					$("#rgbonoffbtn").get(0).options[1].selected = true;
				}
			} else if (key == rgbhueskey && (1 == rgbreadtag)) {
				rgb_hues = (jsonstr[key] / 360).toFixed(4);
				setcirclesit(rgb_hues);
			} else if (key == rgbsatukey && (1 == rgbreadtag)) {
				rgb_statu = (jsonstr[key] / 100).toFixed(2);
			} else if (key == rgbbrigkey && (1 == rgbreadtag)) {
				rgb_bright = (jsonstr[key] / 100).toFixed(2);
			} else if (key == motorkey) {
				if (jsonstr[key] == "0") {
					$("#motorbtn").attr("src", "../image/smallicon-8kaiguan.png");
				} else {
					$("#motorbtn").attr("src", "../image/smallicon-9kaiguan.png");
				}
			}
		}
	}
}

//初始化key值
function initKey(keytype, properties) {
	$(properties).each(function() {
		switch(this.type) {
			case rgbswitchdic:
				rgbswikey = this.iid;
				break;
			case rgbhuesdic:
				rgbhueskey = this.iid;
				break;
			case rgbsatudic:
				rgbsatukey = this.iid;
				break;
			case rgbbrightdic:
				rgbbrigkey = this.iid;
				break;
			case uartmsgdic:
				uartkey = this.iid;
				break;
			case othervaldic:
				//所有type为的value
				if (keytype == adcdic) {
					adckey = this.iid;
				} else if (keytype == motor_sensordic) {
					motorkey = this.iid;
				} else if (keytype == infraeddic) {
					infraredkey = this.iid;
				} else if (keytype == tempdic) {
					temp_key = this.iid;
				} else if (keytype == humidic) {
					humi_key = this.iid;
				} else if (keytype == pro_sensordic) {
					pro_key = this.iid;
				} else if (keytype == atmo_sensordic) {
					atmo_key = this.iid;
				} else if (keytype == montion_sensordic) {
					montion_key = this.iid;
				}
				break;
		}
	});
}

//读出设备的RGB的值
function readDevInfo(pubcode) {
	micoPublish(devidglobal + "/in/read/" + app1, pubcode);
}

//deal with rgbinfo
//function getrgbinfo(properties) {
//	$(properties).each(function() {
//		switch(this.type) {
//			case rgbswitchdic:
//				rgb_switch = this.value;
//				if (this.value == true) {
//					$("#rgbonoffbtn").get(0).options[0].selected = true;
//				} else {
//					$("#rgbonoffbtn").get(0).options[1].selected = true;
//				}
//				break;
//			case rgbhuesdic:
//				rgb_hues = (this.value / 360).toFixed(4);
//				setcirclesit(rgb_hues);
//				break;
//			case rgbsatudic:
//				rgb_statu = (this.value / 100).toFixed(2);
//				break;
//			case rgbbrightdic:
//				rgb_bright = (this.value / 100).toFixed(2);
//				break;
//		}
//	});
//}

/*
* uartChat部分
*/
//以下是聊天控制的
function chatctrl() {
	changpage("chatlist", "");
	chatobj = api.require('inputField');
	chatobj.open({
		bgColor : '#F4F4F4',
		lineColor : '#CCCCCC',
		fileBgColor : '#FFFFFF',
		borderColor : '#CCCCCC',
		sendImg : 'widget://image/tubiao2.png',
		sendImgHighlight : 'widget://image/tubiao1.png',
		maxLines : 8
	}, function(ret, err) {
		addchatmsg(ret.msg);
	});
}

function addchatmsg(msg) {
	if (linum < 10) {
		linum++;
	} else {
		linum = 0;
		$("#chatmsg").empty();
	}
	if (msg != "") {
		var html = "<li class='devchatmsglicls'><span>" + msg + "</span></li>";
		$("#chatmsg").append(html);
		var uartcode = '{"13":"' + msg + '"}';
		micoPublish(devidglobal + "/in/write/" + app1, uartcode);
	}
}

/*
* RGB控制部分
*/
//开关灯按钮
function checkrgbbtn() {
	var rgbbtn = $("#rgbonoffbtn").find("option:selected").text();
	if (rgbbtn == "On") {
		dealwithrgbbtn(true);
		ctrlrgb();
	} else if (rgbbtn == "Off") {
		window.clearInterval(rgbctrlinterval);
		dealwithrgbbtn(false);
	}
}

//专门服务于开关灯
function dealwithrgbbtn(ifopen) {
	var color = colorPicker.getColorHSV();
	var colorcode = parseInt(color.h * 360);
	var brightcode = $('#brightspanid').val();
	var satcode = $('#satspanid').val();
	var rgbcode = '{"5":' + ifopen + ',"6":' + colorcode + ',"7":' + satcode + ',"8":' + brightcode + '}';
	micoPublish(devidglobal + "/in/write/" + app1, rgbcode);
}

/*
* EasyLink部分
*/
/*micobind部分*/
//		获取ssid
function getWifiSsid() {
	var wifissid = api.require('wifiSsid');
	wifissid.getSsid(null, function(ret, err) {
		if (ret.ssid) {
			$("#wifi_ssid").val(ret.ssid);
		} else {
			api.alert({
				msg : err.msg
			});
		}
	});
}

//获取设备ip
function getdevip() {
	showProgress("配网中,此过程需要10-20秒", true);
	//此时正在搜索设备，不允许返回
	pageTag = 100;
	var devipme = api.require('micoBind');
	var wifi_ssid = $("#wifi_ssid").val();
	var wifi_psw = $("#wifi_psw").val();
	devipme.getDevip({
		wifi_ssid : wifi_ssid,
		wifi_password : wifi_psw
	}, function(ret, err) {
		hidPro();
		if (ret.devip) {
			dev_token = $.md5(ret.devip + userToken);
			dev_ip = ret.devip;
			changpage("devmanage", "Device Password");
			$("#backleft").css("display", "none");
		} else {
			$("#backleft").css("display", "block");
			api.alert({
				msg : err.msg
			});
		}
	});
}

//获取deviceid
function ajaxgetdveid() {
	showProgress("设备密码设置中", true);
	//此时正在搜索设备，不允许返回
	pageTag = 101;
	var dev_psw = $("#dev_psw").val();
	if (dev_psw != "" && isNum(dev_psw)) {
		$mico.getDevid(dev_ip, dev_psw, dev_token, function(ret, err) {
			if (ret) {
				var devid = ret.device_id;
				bindtocloud(devid);
			} else {
				hidPro();
				alert(JSON.stringify(err));
			}
		});
	} else {
		hidPro();
		apiToast("设备密码必须是数字", 2000);
	}
}

//判断是否是数字
function isNum(t) {
	var z = /^[0-9]*$/;
	if (z.test(t)) {
		return true;
	} else {
		return false;
	};
}

//去云端绑定设备
function bindtocloud(devid) {
	$mico.bindDevCloud(APP_ID, userToken, dev_token, function(ret, err) {
		if (ret) {
			hidPro();
			//页面跳转
			changpage("homePage", "MicoKit");
			//	刷新内容
			devicelist_getDevList();
		} else {
			hidPro();
			alert(JSON.stringify(err));
		}
	});
}

/*
* 设备授权部分
*/
//设备授权
function remoteAuthdev(devid, phone) {
	$mico.authDev(APP_ID, userToken, phone, devid, function(ret, err) {
		if (ret) {
			apiToast("授权成功", 2000);
		} else {
			alert(JSON.stringify(err));
		}
	});
}

/*
* 用户管理部分
*/
//读取更新日日志
function readHisFile(filepath, showid) {
	api.readFile({
		path : 'widget://his/' + filepath
	}, function(ret, err) {
		if (ret.status) {
			var data = ret.data;
			showid.html(data);
		}
	});
}

/**
 *页面跳转
 */
//转换显示的page页面
function changpage(pageid, titleName) {

	if (pageid == "homePage") {
		pageTag = 1;
		$("#backleft").css("display", "none");
		$("#tohomepage").css("display", "none");
		$("#tomyself").css("display", "block");
		$("#toeasylink").css("display", "block");
		//		$("#headerright").attr("src", "../image/smallicon-4.png");
		displayalldev();
	} else if (pageid == "deviceinfo") {
		pageTag = 2;
		$("#backleft").css("display", "block");
		$("#tomyself").css("display", "none");
		$("#toeasylink").css("display", "none");
		//		$("#headerright").attr("src", "");
	} else if (pageid == "myselfpage") {
		$("#tomyself").css("display", "none");
		$("#backleft").css("display", "none");
		$("#toeasylink").css("display", "none");
		$("#tohomepage").css("display", "block");
		//		$("#headerright").attr("src", "");
		$("#titleName").html("");
		$("#mynickname").html(getNickName());
	} else if (pageid == "ssidmanage") {
		$("#backleft").css("display", "block");
		$("#tomyself").css("display", "none");
		$("#toeasylink").css("display", "none");
		//		$("#headerright").attr("src", "");
	} else if (pageid == "feedbackpage") {
		$("#backleft").css("display", "block");
		$("#tohomepage").css("display", "none");
	} else if (pageid == "uphispage") {
		$("#backleft").css("display", "block");
		$("#tohomepage").css("display", "none");
	} else if (pageid == "authpage") {
		$("#backleft").css("display", "block");
		$("#tohomepage").css("display", "none");
	}
	if (titleName != "") {
		$("#titleName").html(titleName);
	}
	$.mobile.changePage("#" + pageid + "", {
		transition : "none"
	});
}

/**
 *监听goback的返回跳转
 */
function checkpage() {
	//			hidPro();
	if (pageTag == 2) {
		hidPro();
		infoToList();
	} else if (pageTag == 1) {
		//apicloud云编辑时候不需要判断界面
		closeApp();
		//当点击确定时 返回 true
		//				if (window.confirm("确定退出")) {
		//					//do something 点确定
		//					closeApp();
		//				} else {
		//					//do otherthing 点取消
		//					apiToast("你做的对", 2000);
		//				}
	} else if (pageTag == 3) {
		rgbctrltoinfo();
	} else if (pageTag == 4) {
		uartctrltoinfo();
	} else if (pageTag == 5) {
		easylinktoList();
	} else if (pageTag == 6) {
		myselfToList();
	} else if (pageTag == 7) {
		feedtomyself();
	} else if (pageTag == 8) {
		authtomyself();
	} else if (pageTag == 0) {
		apiToast("不允许返回", 2000);
	} else if (pageTag == 100) {
		hidPro();
		if (window.confirm("再耐心等30秒")) {
			//do something 点确定
			apiToast("你做的对", 2000);
			showProgress("配网中", true);
		} else {
			//do otherthing 点取消
			apiToast("再按一次返回到设备列表", 2000);
			pageTag = 5;
		}
	} else if (pageTag == 101) {
		hidPro();
		if (window.confirm("再耐心等10秒")) {
			//do something 点确定
			apiToast("你做的对", 2000);
			showProgress("设备密码设置中", true);
		} else {
			//do otherthing 点取消
			apiToast("再按一次返回到设备列表", 2000);
			pageTag = 5;
		}
	}
}

//设备详情界面返回键操作
function infoToList() {
	//页面跳转
	changpage("homePage", "MicoKit");
	//	刷新内容
	devicelist_getDevList();
	//	删除定时publish
	window.clearInterval(selfInterval);
}

//设备详情界面返回键操作
function myselfToList() {
	//页面跳转
	changpage("homePage", "MicoKit");
	//	刷新内容
	devicelist_getDevList();
}

function rgbctrltoinfo() {
	//页面跳转
	changpage("deviceinfo", "");
	rgbreadtag = 1;
	//开启publish
	sleeprun(devidglobal);
	//	删除定时publish
	window.clearInterval(rgbctrlinterval);
}

function uartctrltoinfo() {
	//关闭聊天窗口
	chatobj.close();
	//页面跳转
	changpage("deviceinfo", "");
}

function easylinktoList() {
	//页面跳转
	changpage("homePage", "MicoKit");
	//	刷新内容
	devicelist_getDevList();
}

//反馈见面去个人信息界面
function feedtomyself() {
	changpage("myselfpage", "");
	pageTag = 6;
}

//授权界面去个人信息界面
function authtomyself() {
	changpage("myselfpage", "");
	authdevobj.close();
	pageTag = 6;
}

//从底部的弹窗，毫秒级
function apiToast(msg, time) {
	api.toast({
		msg : msg,
		duration : time,
		location : 'bottom'
	});
}

/**
 *关闭APP
 */
function closeApp() {
	api.closeWidget({
		id : 'A6985693592474',
		retData : {
			name : 'closeWidget'
		},
		animation : {
			type : 'flip',
			subType : 'from_bottom',
			duration : 500
		}
	});
}

/**
 * 进度条
 */
//等待进度
function showProgress(text, ifctrl) {
	api.showProgress({
		style : 'default',
		animationType : 'zoom',
		title : '先喝杯茶...',
		text : text,
		modal : ifctrl
	});
}

//隐藏浮动框
function hidPro() {
	api.hideProgress();
}

//隐藏所有设备
function displayalldev() {
	$(".devctrlrow ul li").css("display", "none");
	$("#devdataid").css("display", "none");
	//	$("#adcclsid").css("display", "none");
	//	$("#devclsid").css("display", "none");
	//	$("#chatliid").css("display", "none");
	//	$("#rgbliid").css("display", "none");
	//	$("#devdataid").css("display", "none");
}

////编码格式的什么
//function hex2bin(hex) {
//	if (!hex.match(/0x\w+/)) {
//		alert(hex);
//		return hex;
//	}
//	var buf = new ArrayBuffer(hex.length / 2 - 1);
//	// 2 bytes for each char
//	var bufView = new Uint8Array(buf);
//	for (var i = 2; i <= hex.length - 2; i += 2) {
//		bufView[i / 2 - 1] = parseInt(hex.substr(i, 2), 16);
//	}
//	alert(buf);
//	return buf;
//}