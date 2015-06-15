/**
 * Created by rocke on 15-5-1.
 */

$(function() {
	//登录
	$("#loginbtn").click(function() {
		var phone = $("#login_phone").val();
		var psw = $("#login_psw").val();
		if (true != isphone2(phone)) {
			apiToast("请输入正确的手机号", 2000);
		} else {
			showProgress("登陆中", true);
			$mxuser.loginWithPhone(phone, psw, function(ret, err) {
				// alert("usermag --- " + JSON.stringify(ret));
				hidPro();
				if (ret) {
					// openMainWin();
					//					apiToast("登录成功", 1000);
					window.location.href = "../index.html";
				} else {
					if (err.message.indexOf("Could not find user") >= 0) {
						apiToast("用户不存在", 2000);
					} else {
						apiToast("用户名字或者密码错误", 2000);
					}
				}
			});
		}
	});
	//	返回上一级
	$("#historygo").click(function() {
		history.go(-1);
	});
	//	发送验证码
	$("#getverifyCode").click(function() {
		var phone = $("#register_phone").val();
		if (true != isphone2(phone)) {
			apiToast("请输入正确的手机号", 2000);
		} else {
			showProgress("短信申请中", true);
			$mxuser.getSmsCode(phone, function(ret) {
				hidPro();
				//发送成功
				if (ret == 0) {
					apiToast("验证码已发送到您手机", 2000);
				} else {
					alert(JSON.stringify(ret));
				}
			});
		}
	});
	//注册用户
	$("#nextstep").click(function() {
		var phone = $("#register_phone").val();
		var identify = $("#register_code").val();
		if (true != isphone2(phone)) {
			apiToast("请输入正确的手机号", 2000);
		} else {
			showProgress("短信验证中", true);
			$mxuser.signUpOrlogInByPhone(phone, identify, function(ret, err) {
				// alert("nextstep --- " + JSON.stringify(ret));
				hidPro();
				if (ret) {
					// openMainWin();
					apiToast("验证成功", 2000);
					// window.location.href = "../index.html";
					//slideup
					$.mobile.changePage("#nextsteppage", {
						transition : "none"
					});
				} else {
					alert(JSON.stringify(err));
				}
			});
		}
	});

	//退出登录
	$("#logout").click(function() {
		//		alert("out");
		AV.User.logOut();
		currentUser = AV.User.current();
		window.location.href = "./login.html";
	});

	//设置初始密码
	$("#finishregister").click(function() {
		var phone = $("#register_phone").val();
		var password = $("#nextstep_psw").val();
		var confirmpsw = $("#nextstep_ckpsw").val();
		var pswtag = $("#pswtag").val();
		//1 初次设置密码 0重置密码
		if (phone == "") {
			apiToast("密码不能为空", 2000);
		} else {
			if (password != confirmpsw) {
				apiToast("两次密码输入不一致", 2000);
			} else {
				showProgress("密码设置中", true);
				if (pswtag == "1") {
					$mxuser.setPassword(phone, password, function(ret, err) {
						hidPro();
						if (ret) {
							apiToast("设置密码成功", 2000);
							// registerToEasyCloud(phone, password);
							window.location.href = "../index.html";
						} else {
							alert(JSON.stringify(err));
						}
					});
				} else {
					$mxuser.resetPassword(password, function(ret, err) {
						hidPro();
						if (ret) {
							apiToast("重置密码成功", 2000);
							// registerToEasyCloud(phone, password);
							// window.location.href = "../index.html";
							window.location.href = "../index.html";
						} else {
							alert(JSON.stringify(err));
						}
					});
				}
			}
		}
	});

	//保存反馈信息
	$("#savefd").click(function() {
		var phone = getUserInfo().get("username");
		var fdcontent = $("#fdcontent").val();
		showProgress("反馈保存中", true);
		$mxuser.sendFeedback(phone, fdcontent, function(ret, err) {
			hidPro();
			if (ret) {
				//				alert("ret = " + JSON.stringify(ret));
				apiToast("提交成功，我们会尽快回复你。");
			} else {
				alert("err = " + JSON.stringify(err));
			}
		});
	});

	//Cloud测试
	$("#cloudtest").click(function() {
		//		alert("CLOUD测试");
		var phone = "13122000202";
		var oldpsw = "111111";
		var password = "123456";

		$mxuser.updatePassword(oldpsw, password, function(ret, err) {
			if (ret) {
				alert("ret = " + JSON.stringify(ret));
				alert("注册成功");
			} else {
				alert("err = " + JSON.stringify(err));
			}
		});
	});
});

//去EasyCloud注册regToEasyCloud
function registerToEasyCloud(phone, password) {
	$mxuser.regToEasyCloud(phone, password, function(ret, err) {
		if (ret) {
			apiToast("注册成功", 2000);
			// window.location.href = "../index.html";
		} else {
			alert(JSON.stringify(err));
		}
	});
}

//获取登录信息
function islogin() {
	//	alert("in");
	var currentUser = $mxuser.islogin();
	//	alert(currentUser);
	if (currentUser) {
		apiToast("true", 2000);
	} else {
		apiToast("false", 2000);
	}
	return currentUser;
}

//获取用户登录的信息
function getUserInfo() {
	var userinfo = AV.User.current();
	//	var nickname = currentUser.get("nickname");
	return userinfo;
}

//获取昵称
function getNickName() {
	if (getUserInfo()) {
		var nickname = getUserInfo().get("nickname");
		if (nickname == "" || nickname == null) {
			return getUserInfo().get("username");
		} else {
			return nickname;
		}
	} else {
		return "未登录";
	}
}

//打开首页
function openMainWin() {
	apiToast("登录成功", 1000);

}

//修改昵称
function saveNickName() {
	var nickname = $("#nickname").val();
	if (nickname == "" || nickname == null) {
		apiToast("原来你就是无名", 2000);
	} else {
		$mxuser.updateNickName(nickname, function(ret, err) {
			if (ret) {
				apiToast("昵称修改成功", 2000);
				// window.location.href = "../index.html";
				window.history.go(-1);
			} else {
				apiToast("现在不让起名字了，一会再试试吧", 2000);
				alert(JSON.stringify(err));
			}
		});
	}
}

//修改用户密码
function updatePsw() {
	var oldpsw = $("#update_old_psw").val();
	var password = $("#update_psw").val();
	var confirmpsw = $("#update_confirmpsw").val();

	if (oldpsw == "" || password == "" || confirmpsw == "" || oldpsw == null || password == null || confirmpsw == null) {
		apiToast("密码能不填吗?", 2000);
	} else if (password != confirmpsw) {
		apiToast("两次密码输入不一致", 2000);
	} else {
		$mxuser.updatePassword(oldpsw, password, function(ret, err) {
			if (ret) {
				apiToast("密码修改成功", 2000);
			} else {
				alert(JSON.stringify(err));
			}
		});
	}
}

//跳转到其他页面
function openOtherWin(type) {
	location.href = "./" + type + ".html";
}

//返回上一页
function goback() {
	window.history.go(-1);
}

/*判断输入是否为合法的手机号码*/
function isphone2(inputString) {
	//	alert(inputString);
	var regBox = {
		regEmail : /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, //邮箱
		regName : /^[a-z0-9_-]{3,16}$/, //用户名
		regMobile : /^0?1[3|4|5|8][0-9]\d{8}$/, //手机
		regTel : /^0[\d]{2,3}-[\d]{7,8}$/
	};
	var mflag = regBox.regMobile.test(inputString);
	if (!mflag) {
		return false;
		//		alert("手机或者电话有误！");
	} else {
		return true;
		//		alert("信息正确！");
	};
}
