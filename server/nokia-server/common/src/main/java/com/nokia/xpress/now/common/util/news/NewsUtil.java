package com.nokia.xpress.now.common.util.news;

import java.util.ArrayList;
import java.util.List;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.enums.RSSEnums;
import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.entity.news.Rss;

public class NewsUtil {
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
}