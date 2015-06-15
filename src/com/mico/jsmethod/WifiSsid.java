package com.mico.jsmethod;

import org.json.JSONObject;

import android.content.Context;

import com.mico.wifi.EasyLinkWifiManager;
import com.uzmap.pkg.uzcore.UZWebView;
import com.uzmap.pkg.uzcore.uzmodule.UZModule;
import com.uzmap.pkg.uzcore.uzmodule.UZModuleContext;

public class WifiSsid extends UZModule {
	private UZModuleContext moduleContext;
	private Context context;
	private EasyLinkWifiManager mWifiManager = null;

	public WifiSsid(UZWebView webView) {
		super(webView);
	}

	public void jsmethod_getSsid(UZModuleContext moduleContext) {
		this.moduleContext = moduleContext;
		context = getContext();
		getSSID();
	}

	private void getSSID() {
		// 得到wifi管理类unknown
		mWifiManager = new EasyLinkWifiManager(context);
		String ssidName = mWifiManager.getCurrentSSID();
		boolean res = ssidName.contains("unknown");
		if (ssidName == null || !(ssidName.length() > 0) || res) {
			ssidName = "0";
		} else {
		}
		callback(ssidName);
	}

	private void callback(String ssidName) {
		JSONObject result = new JSONObject();
		JSONObject error = new JSONObject();
		try {
			if (ssidName.equals("0")) {
				error.put("msg", "未发现WIFI");
				moduleContext.error(result, error, false);
			} else {
				result.put("ssid", ssidName);
				moduleContext.success(result, true);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
