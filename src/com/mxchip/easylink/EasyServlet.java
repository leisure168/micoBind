package com.mxchip.easylink;

import android.util.Log;

import org.apache.http.protocol.HTTP;

import com.mico.jsmethod.MicoBind;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by wangchao on 4/21/15.
 */
public class EasyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static final String TAG = "EasyServlet";
	private final FTCListener mFTCListener;

	public EasyServlet(FTCListener ftcl) {
		mFTCListener = ftcl;
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// 不修改设备信息，发送空字符串
		resp.getWriter().println("{}");
		// Log.e(TAG, "--------------->{}");
		// 发送空json后立即关闭FTC服务
		new EasyServer(8000).stop();
		resp.setCharacterEncoding(HTTP.UTF_8);
		resp.setContentType("application/json");
		String msg = readFully(req.getInputStream(), "utf8");
		mFTCListener.onFTCfinished(req.getRemoteAddr(), msg);
		// Log.e(TAG, msg);
	}

	public String readFully(InputStream inputStream, String encoding)
			throws IOException {
		return new String(readFully(inputStream), encoding);
	}

	private byte[] readFully(InputStream inputStream) throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		byte[] buffer = new byte[1024];
		int length = 0;
		while ((length = inputStream.read(buffer)) != -1) {
			baos.write(buffer, 0, length);
		}
		return baos.toByteArray();
	}
}
