/**
 * 
 */
package com.mxchip.easylink_v3;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;

/**
 * @author Perry
 * 
 * @date 2014-9-13
 */
public class EasyLink_v3 {
	private static int START_FLAG1 = 0x5AA;
	private static int START_FLAG2 = 0x5AB;
	private static int START_FLAG3 = 0x5AC;
	private static int UDP_START_PORT = 50000;
	private static boolean stopSending;
	private byte key[] = new byte[65];
	private byte ssid[] = new byte[65];
	private byte user_info[] = new byte[65];
	private static byte send_data[] = new byte[128];
	private static byte buffer[] = new byte[1500];
	private static DatagramSocket udpSocket;
	private static int len;
	private InetAddress address = null;
	private DatagramPacket send_packet = null;
	private int port;
	private static EasyLink_v3 e3;
	private boolean small_mtu;

	private EasyLink_v3() {
		this.port = 0;
		stopSending = false;
	}
	
	public static EasyLink_v3 getInstence() {
		if (e3 == null) {
			e3 = new EasyLink_v3();
		}
		return e3;
	}

	/*
	 * private void getBssid() { wifi = (WifiManager)
	 * context.getSystemService(Context.WIFI_SERVICE); info =
	 * wifi.getConnectionInfo(); String bssid_str = info.getBSSID(); bssid_str =
	 * bssid_str.replace(":", ""); bssid = Helper.hexStringToBytes(bssid_str); }
	 */
	public void transmitSettings(byte[] Ssid, byte[] Key, byte[] Userinfo) {
		try {
			this.address = InetAddress.getByName("255.255.255.255");
		} catch (Exception e) {
			e.printStackTrace();
		}
		this.ssid = Ssid;
		this.key = Key;
		this.user_info = Userinfo;
		try {
			int i = 0, j;
			short checksum = 0;
			// getBssid();
			udpSocket = new DatagramSocket();
			udpSocket.setBroadcast(true);
			send_data[i++] = (byte) (1 + 1 + 1 + ssid.length + key.length
					+ user_info.length + 2); // len(total) + len(ssid) +
												// len(key) + ssid + key +
												// user_info + checksum

			send_data[i++] = (byte) ssid.length;
			send_data[i++] = (byte) key.length;

			for (j = 0; j < ssid.length; j++, i++) {
				send_data[i] = ssid[j];
			}

			for (j = 0; j < key.length; j++, i++) {
				send_data[i] = key[j];
			}
			for (j = 0; j < user_info.length; j++, i++) {
				send_data[i] = user_info[j];
			}

			for (j = 0; j < i; j++)
				checksum += send_data[j] & 0xff;

			send_data[i++] = (byte) ((checksum & 0xffff) >> 8);
			send_data[i++] = (byte) (checksum & 0xff);
			// Log.d("BSSID", "BSSID = " +
			// Helper.ConvertHexByteArrayToString(bssid));
			// Log.d("send_data", "send_data = " +
			// Helper.ConvertHexByteArrayToString(send_data));
		} catch (SocketException e) {
			e.printStackTrace();
		}
		new Thread(new Runnable() {
			@Override
			public void run() {
				stopSending = false;
				send();
			}
		}).start();
	}

	private void send() {
		int i, j, k;
		// WifiManager.MulticastLock lock=
		// wifi.createMulticastLock("easylink v3");
		// lock.acquire();
		while (!stopSending) {
			try {
				port = UDP_START_PORT;
				k = 0;
				UDP_SEND(START_FLAG1);
				UDP_SEND(START_FLAG2);
				UDP_SEND(START_FLAG3);
				for (i = 0, j = 1; i < send_data[0]; i++) {
					len = (j * 0x100) + (send_data[i] & 0xff);
					// Log.d("UDP_SEND", "--------" + Integer.toHexString(len)
					// +"   " + i + "--------" + j);
					UDP_SEND(len);
					if ((i % 4) == 3) {
						k++;
						len = 0x500 + k;
						UDP_SEND(len);
					}
					j++;
					if (j == 5)
						j = 1;
				}
				
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		// lock.release();
		udpSocket.close();
	}
	
	public void SetSmallMTU(boolean onoff) {
		small_mtu = onoff;
	}

	private void UDP_SEND(int length) {
		try {
			if (small_mtu) {
				if (length > 0x500)
					length -= 0x500;
				if (length < 0x40)
					length += 0xB0;
			}
			send_packet = new DatagramPacket(buffer, length, address, port);
			udpSocket.send(send_packet);
			// Log.d("UDP_SEND", "--------" + Integer.toHexString(length) +"   "
			// + port + "--------");
			Thread.sleep(10);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Stop EasyLink
	 */
	public void stopTransmitting() {
		stopSending = true;
	}
}
