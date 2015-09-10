package com.nokia.xpress.now.common.util.news;

import java.util.List;

import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.entity.news.Rss;

public interface IRSSParser {
	public List<News> parseToEntity(Rss rss) throws Exception;
}
