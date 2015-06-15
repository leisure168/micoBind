/**
 * Created by rocke on 15-5-1.
 */

/*
*以下是APICloud模块连接的方式
* */
//publish的功能
function micoPublish(topicStr, payloadStr) {
	var micoMqtt = api.require("micoMqtt");
	var topic = topicStr;
	var command = payloadStr;
	micoMqtt.publish({
		topic : topic,
		command : command
	}, function(ret, err) {
		alert(JSON.stringify(ret.subs));
	});
}

//subscribe的功能
function micoSubscribe(host, username, password, topicStr, clientID) {
	var micoMqtt = api.require("micoMqtt");
	var host = host;
	var username = username;
	var password = password;
	var clientID = clientID;
	var topic = topicStr;
	micoMqtt.startMqtt({
		micoMqtt : micoMqtt,
		host : host,
		username : username,
		password : password,
		clientID : clientID,
		topic : topic
	}, function(ret, err) {
		chgtxt(ret.subs);
	});
}

///*
// *以下是张伟云端设置的方式
// * */
////publish的功能
//function micoPublish(topicStr, payloadStr) {
//	//	alert("micoPublish");
//	var pos = 0;
//	var xhr = new XMLHttpRequest();
//	var topic = encodeURIComponent(topicStr);
//	var payload = encodeURIComponent(payloadStr);
//	xhr.open("GET", "http://api.easylink.io/mqtt/publish/?topic=" + topic + "&payload=" + payload, true);
//	xhr.onprogress = function() {
//		//				var data = xhr.responseText;
//		var data = xhr.responseText.substr(pos).split('\r\n', 2);
//		pos = xhr.responseText.length;
//		//		console.log("PROGRESS:", data);
//		//		alert("data = " +xhr.responseText);
//		checkData(data[1]);
//	};
//	xhr.send();
//}
//
////subscribe的功能
//function micoSubscribe(topicStr) {
//	//	alert("micoSubscribe");
//	var pos = 0;
//	var xhr = new XMLHttpRequest();
//	var topic = encodeURIComponent(topicStr);
//	xhr.open("GET", "http://api.easylink.io/mqtt/subscribe/?topic=" + topic, true);
//	xhr.onprogress = function() {
//		//				var data = xhr.responseText;
//		var data = xhr.responseText.substr(pos).split('\r\n', 2);
//		pos = xhr.responseText.length;
//		//		console.log("PROGRESS:", data);
//		//		alert("data = " +xhr.responseText);
//		checkData(data[1]);
//	};
//	xhr.send();
//}

////check mqtt data and send to the devinfo
//function checkData(data) {
//	//	alert("checkData = " + data);
//	if (data === undefined) {
//		//			alert(data);
//	} else {
//		if (data.charAt(data.length - 1) != "}") {
//			//				alert(data);
//		} else {
//			chgtxt(data);
//		}
//	}
//}
