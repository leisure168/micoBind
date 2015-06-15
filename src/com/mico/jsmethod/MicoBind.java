package com.mico.jsmethod;

import org.json.JSONObject;

import android.content.Context;
import android.util.Log;

import com.mxchip.easylink.EasyLinkAPI;
import com.mxchip.easylink.FTCListener;
import com.uzmap.pkg.uzcore.UZWebView;
import com.uzmap.pkg.uzcore.uzmodule.UZModule;
import com.uzmap.pkg.uzcore.uzmodule.UZModuleContext;

public class MicoBind extends UZModule {
	private UZModuleContext moduleContext;
	private UZModuleContext stopFtcContext;
	private Context context;
	public EasyLinkAPI elapi;
	
	public MicoBind(UZWebView webView) {
		super(webView);
	}

	public void jsmethod_getDevip(UZModuleContext moduleContext) {
		this.moduleContext = moduleContext;

		context = getContext();
		String wifi_ssid = moduleContext.optString("wifi_ssid");
		String wifi_password = moduleContext.optString("wifi_password");
		startFindDevIp(wifi_ssid, wifi_password);
	}

	/**
	 * 开启ftc并获取devip
	 * 
	 * @param ssid
	 * @param password
	 */
	private void startFindDevIp(String ssid, String password) {
		elapi = new EasyLinkAPI(context);
		elapi.startFTC(ssid, password, new FTCListener() {
			@Override
			public void onFTCfinished(String ip, String jsonString) {
				// Log.d("FTCEnd", ip + " " + jsonString);
				callback(ip);
				// elapi.stopFTC();
				 elapi.stopEasyLink();
			}

			@Override
			public void isSmallMTU(int MTU) {
			}
		});
	}

	/**
	 * 关闭ftc以及关闭发包
	 */
	public void jsmethod_stopFtc(UZModuleContext moduleContext) {
		this.stopFtcContext = moduleContext;
		elapi.stopFTC();
		elapi.stopEasyLink();
	}

	public void callback(String msg) {
		JSONObject result = new JSONObject();
		JSONObject error = new JSONObject();
		try {
			result.put("devip", msg);
			error.put("msg", "没有值");
			moduleContext.success(result, true);
			moduleContext.error(result, error, false);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
