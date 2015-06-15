package com.mxchip.easylink;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

/**
 * Created by wangchao on 4/21/15.
 */
public class EasyServer {
    private static final String TAG = "JServer";
    private static final String ASSETS_DIR = "jetty";
    private int mPort;
    public Server mServer;

    public EasyServer(int port) {
        mPort = port;
    }

    public synchronized void start(FTCListener ftcl) {
        if ((mServer != null) && (mServer.isStarted())) {
            return;
        }
        if (mServer == null) {
            ServletContextHandler servletHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
            servletHandler.addServlet(new ServletHolder(new EasyServlet(ftcl)), "/auth-setup");

            HandlerList handlerList = new HandlerList();
            handlerList.addHandler(servletHandler);
            mServer = new Server(mPort);
            mServer.setHandler(handlerList);
        }

        try {
            mServer.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public synchronized void stop() {
        if ((mServer == null) || (mServer.isStopped())) {
            return;
        }
        try {
            mServer.stop();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public synchronized boolean isStarted() {
        if (mServer == null) {
            return false;
        }
        return mServer.isStarted();
    }
}
