package com.mxchip.easylink;

public interface FTCListener {
        public void onFTCfinished(String ip, String jsonString);
        
        public void isSmallMTU(int MTU);
}
