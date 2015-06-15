package com.mxchip.easylink;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

import com.mxchip.easylink_plus.EasyLink_plus;
import com.mxchip.helper.Helper;

import java.net.NetworkInterface;
import java.net.SocketException;

/**
 * Created by wangchao on 4/20/15.
 */
public class EasyLinkAPI {
	public static final String TAG = "EasylinkAPI";

	public static final int mPort = 8000;
	private static EasyServer mEasyServer;
	private final Context mContext;
	private WifiManager mWifiManager;
	private WifiInfo mWifiInfo;
	private EasyLink_plus mEasylinkPlus;
	private FTCListener mFTCListener;

	public EasyLinkAPI(Context context) {
		mContext = context;
	}

	public String getSSID() {
		mWifiManager = (WifiManager) mContext
				.getSystemService(Context.WIFI_SERVICE);
		mWifiInfo = mWifiManager.getConnectionInfo();
		return mWifiInfo.getSSID().replaceAll("\"", "");
	}

	public void startFTC(String ssid, String password, FTCListener ftcl) {
		// TODO: add a callback
		mFTCListener = ftcl;
		startEasylink(ssid, password);
		try {
			mEasyServer = new EasyServer(mPort);
			mEasyServer.start(ftcl);
		} catch (Exception e) {
			Log.d(TAG, e.getMessage());
		}
	}

	//关闭ftcserver
	public void stopFTC() {
		mFTCListener = null;
		if (mEasyServer != null) {
			// Log.e(TAG, "mEasyServerstop");
			mEasyServer.stop();
		}
	}
	
	//停止发包
	public void stopEasyLink(){
		if (null != mEasylinkPlus) {
			mEasylinkPlus = EasyLink_plus.getInstence();
			mEasylinkPlus.stopTransmitting();
		}
	}

	protected void startEasylink(String ssid, String password) {
		// v2 and v3
		int ip;
		if (ssid == "") {
			ip = getNormalIP();
			// ip = getTestIP();
			// String ipStr = int2ip(ip);
			// Log.d(TAG, ipStr);
			ssid = getSSID();
			password = "react&flux";
			// password = "88888888";
		} else if (ssid == "!AP") {
			// start ap mode
			ip = getAPIP();
		} else {
			ip = getNormalIP();
		}
		mEasylinkPlus = EasyLink_plus.getInstence();
		try {
			NetworkInterface intf = NetworkInterface.getByName("wlan0");
			if (intf.getMTU() < 1500) {
				mEasylinkPlus.setSmallMtu(true);
				mFTCListener.isSmallMTU(intf.getMTU());
			}
		} catch (SocketException e) {
			e.printStackTrace();
		}
		byte[] userinfo = getUserInfo(ip);
		try {
			mEasylinkPlus.transmitSettings(ssid.getBytes("UTF-8"),
					password.getBytes("UTF-8"), userinfo);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private byte[] getUserInfo(int ip) {
		byte[] userinfo = new byte[5];
		userinfo[0] = 0x23; // #
		String s = String.format("%08x", ip);
		System.arraycopy(Helper.hexStringToBytes(s), 0, userinfo, 1, 4);
		return userinfo;
	}

	public int getNormalIP() {
		mWifiManager = (WifiManager) mContext
				.getSystemService(Context.WIFI_SERVICE);
		mWifiInfo = mWifiManager.getConnectionInfo();
		return mWifiInfo.getIpAddress();
	}

	public static int getAPIP() {
		return ip2int("192.168.43.1");
	}

	public static int getTestIP() {
		return ip2int("192.168.199.163");
	}

	private String int2ip(int ipval) {
		return String
				.format("%d.%d.%d.%d", (ipval & 0xff), (ipval >> 8 & 0xff),
						(ipval >> 16 & 0xff), (ipval >> 24 & 0xff));
	}

	public static int ip2int(String ipAddress) {
		String[] ipAddressInArray = ipAddress.split("\\.");
		long result = 0;
		for (int i = 0; i < ipAddressInArray.length; i++) {
			int power = i;
			int ip = Integer.parseInt(ipAddressInArray[i]);
			result += ip * Math.pow(256, power);
		}
		return (int) result;
	}
}
