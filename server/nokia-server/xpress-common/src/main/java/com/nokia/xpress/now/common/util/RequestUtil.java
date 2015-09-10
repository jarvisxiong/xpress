package com.nokia.xpress.now.common.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.enums.RSSEnums;
import com.nokia.xpress.now.common.util.news.BaiduRSSParser;
import com.nokia.xpress.now.common.util.news.IRSSParser;
import com.nokia.xpress.now.common.util.news.IfengRSSParser;
import com.nokia.xpress.now.common.util.news.SinaRSSParser;
import com.nokia.xpress.now.common.util.news.SouhuRSSParser;
import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.entity.news.Rss;

public class RequestUtil {
	private static Logger logger = LoggerFactory.getLogger(RequestUtil.class);

	public static List<News> parseToEntity(Rss rss) throws Exception {
		List<News> newsList = new ArrayList<News>();
		if (rss != null && rss.getLink() != null) {
			IRSSParser paeser = null;
			if (rss.getId().equals(RSSEnums.SINA.getValue()) || (rss.getPath() != null && (rss.getPath().equals(String.valueOf(RSSEnums.SINA.getValue())) || (rss.getPath().startsWith(String.valueOf(RSSEnums.SINA.getValue()) + ProjectConfig.RSS_PATH_SEPARATOR))))) {// 新浪
				paeser = new SinaRSSParser();
			} else if (rss.getId().equals(RSSEnums.SOUHU.getValue()) || (rss.getPath() != null && (rss.getPath().equals(String.valueOf(RSSEnums.SOUHU.getValue())) || (rss.getPath().startsWith(String.valueOf(RSSEnums.SOUHU.getValue()) + ProjectConfig.RSS_PATH_SEPARATOR))))) {// 搜狐
				paeser = new SouhuRSSParser();
			} else if (rss.getId().equals(RSSEnums.IFENG.getValue()) || (rss.getPath() != null && (rss.getPath().equals(String.valueOf(RSSEnums.IFENG.getValue())) || (rss.getPath().startsWith(String.valueOf(RSSEnums.IFENG.getValue()) + ProjectConfig.RSS_PATH_SEPARATOR))))) {// 凤凰
				paeser = new IfengRSSParser();
			} else if (rss.getId().equals(RSSEnums.BAIDU.getValue()) || (rss.getPath() != null && (rss.getPath().equals(String.valueOf(RSSEnums.BAIDU.getValue())) || (rss.getPath().startsWith(String.valueOf(RSSEnums.BAIDU.getValue()) + ProjectConfig.RSS_PATH_SEPARATOR))))) {// 百度
				paeser = new BaiduRSSParser();
			}
			if (paeser != null)
				newsList = paeser.parseToEntity(rss);
		}
		return newsList;
	}

	public static String requestUrl(URL url) throws IOException {
		URLConnection conn = null;
		BufferedReader br = null;
		try {
			conn = url.openConnection();
			conn.connect();
			br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
			String line;
			StringBuffer sb = new StringBuffer();
			while ((line = br.readLine()) != null)
				sb.append(line);
			return sb.toString();
		} finally {
			if (br != null)
				try {
					br.close();
				} catch (Exception e) {
				}
		}
	}

	public static JSONArray requestAsJSONArray(URL url) throws JSONException, IOException {
		try {
			return new JSONArray(requestUrl(url));
		} catch (JSONException e) {
			logger.error(e.getMessage() + ", url=" + url.toString(), e);
			throw new JSONException(e);
		}
	}

	public static JSONObject requestAsJSONObject(URL url) throws JSONException, IOException {
		try {
			return new JSONObject(requestUrl(url));
		} catch (JSONException e) {
			logger.error(e.getMessage() + ", url=" + url.toString(), e);
			throw new JSONException(e);
		}
	}

	public static Element requestAsXML(URL url) throws DocumentException {
		Element root = new SAXReader().read(url).getRootElement();
		return root;
	}
}