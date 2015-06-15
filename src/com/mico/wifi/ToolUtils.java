package com.mico.wifi;

import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.dd.plist.NSArray;
import com.dd.plist.NSDictionary;
import com.dd.plist.PropertyListParser;

import android.content.Context;

public class ToolUtils {
	private static String APP_Secret_Key = "6e586012-cee6-4c18-9510-7103a6c010ba";

	public static String markMd5(String plainText) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(plainText.getBytes());
			byte b[] = md.digest();

			int i;

			StringBuffer buf = new StringBuffer("");
			for (int offset = 0; offset < b.length; offset++) {
				i = b[offset];
				if (i < 0)
					i += 256;
				if (i < 16)
					buf.append("0");
				buf.append(Integer.toHexString(i));
			}
			System.out.println("result: " + buf.toString());
			System.out.println("result: " + buf.toString().substring(8, 24));
			return buf.toString();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static String getRequestSign() {
		long timetemp = System.currentTimeMillis() / 1000;
		String sign = ToolUtils.markMd5(APP_Secret_Key + timetemp);
		return sign + "," + timetemp;
	}

	public static boolean isMobileNO(String mobiles) {
		Pattern p = Pattern
				.compile("^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$");
		Matcher m = p.matcher(mobiles);
		System.out.println(m.matches() + "---");
		return m.matches();
	}

	public static List<Map<String, Object>> parserCity(Context context) {
		List<Map<String, Object>> arers = new ArrayList<Map<String, Object>>();
		try {
			InputStream is = context.getAssets().open("city.plist");
			NSArray cityArr = (NSArray) PropertyListParser.parse(is);
			for (int i = 0; i < cityArr.count(); i++) {
				Map<String, Object> cityMap = new HashMap<String, Object>();
				NSDictionary city = (NSDictionary) cityArr.objectAtIndex(i);
				cityMap.put("state", city.get("state").toString());
				// Log.i("=====", "===city state:======" +
				// city.get("state").toString());
				NSArray subCitys = (NSArray) city.get("cities");
				String[] cityStrings = new String[subCitys.count()];
				for (int j = 0; j < subCitys.count(); j++) {
					cityStrings[j] = subCitys.objectAtIndex(j).toString();
				}
				cityMap.put("citys", cityStrings);
				arers.add(cityMap);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
		return arers;
	}

	public static String formatDuring(long mss) {
		long hours = (mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
		long minutes = (mss % (1000 * 60 * 60)) / (1000 * 60);
		return hours + " : " + minutes;
	}

}
