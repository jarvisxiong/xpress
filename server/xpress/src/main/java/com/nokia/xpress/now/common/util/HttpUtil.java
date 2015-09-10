package com.nokia.xpress.now.common.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
/**
 * 与第三方通信方法类
 * @author hesy
 *
 */
public class HttpUtil {
	
	public static String access(String urlStr) throws Exception {
		URL url = new URL(urlStr);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestProperty("User-Agent",
		      "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727)");//
		conn.setConnectTimeout(2000);

		if(conn.getResponseCode()!=HttpURLConnection.HTTP_OK) {
			System.out.println("##############");
		}
		InputStream input = conn.getInputStream();
		String line = null;
		StringBuffer sb = new StringBuffer();
		BufferedReader reader = new BufferedReader(new InputStreamReader(input, "utf-8"));

		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}
		if (reader!=null) {
			reader.close();
		}
		if (conn!=null) {
		    conn.disconnect();
		}
		return sb.toString();
	}
}
