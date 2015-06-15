/**
 * 
 */
package com.mxchip.easylink_plus;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import android.util.Log;

import com.mxchip.easylink_v2.EasyLink_v2;
import com.mxchip.easylink_v3.EasyLink_v3;

/**
 * @author Perry
 * 
 * @date 2014-10-21
 */
public class EasyLink_plus {
	private static EasyLink_v2 e2;
	private static EasyLink_v3 e3;
	private static EasyLink_plus me;
	boolean sending = true;
	ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();

	private EasyLink_plus() {
		try {
			e2 = EasyLink_v2.getInstence();
			e3 = EasyLink_v3.getInstence();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static EasyLink_plus getInstence() {
		if (me == null) {
			me = new EasyLink_plus();
		}
		return me;
	}
	
	public void setSmallMtu(boolean onoff){
		e3.SetSmallMTU(onoff);
	}

	public void transmitSettings(final byte[] ssid, final byte[] key,
			final byte[] userinfo) {
		singleThreadExecutor = Executors.newSingleThreadExecutor();//?????????????
		sending = true;
		singleThreadExecutor.execute(new Runnable() {
			@Override
			public void run() {
				while (sending) {
					try {
//						Log.e("easylink", "START!!!!");
						e2.transmitSettings(ssid, key, userinfo);
						e3.transmitSettings(ssid, key, userinfo);
						try {
							Thread.sleep(10000);
							e2.stopTransmitting();
							e3.stopTransmitting();
//							Log.e("easylink", "STOP!!!!");
							Thread.sleep(10000);
						} catch (InterruptedException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		});
	}

	public void stopTransmitting() {
//		Log.e("easylink", "STOP!!!!");
		sending = false;
		singleThreadExecutor.shutdown();
		e2.stopTransmitting();
		e3.stopTransmitting();
	}
}
