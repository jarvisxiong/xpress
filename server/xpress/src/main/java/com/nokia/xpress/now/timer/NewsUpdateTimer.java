package com.nokia.xpress.now.timer;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nokia.xpress.now.common.util.news.NewsUtil;
import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.entity.news.Rss;
import com.nokia.xpress.now.service.news.NewsManager;
import com.nokia.xpress.now.service.news.RssManager;

/**
 * 被Spring的Quartz MethodInvokingJobDetailFactoryBean定时执行的普通Spring Bean.
 */
@Component
public class NewsUpdateTimer {
	private static Logger logger = LoggerFactory.getLogger(NewsUpdateTimer.class);
	private NewsManager newsManager;
	private RssManager rssManager;
	private static long count = 0L;

	public void execute() {
		logger.info("Start the " + ++count + " times news update task ...");
		int allSavedCount = 0;
		// List<Rss> rssList = rssManager.findAll();
		List<Rss> rssList = rssManager.findAllWithState(true);
		if (rssList != null && !rssList.isEmpty()) {
			for (Rss rss : rssList) {
				try {
					logger.info("Updating rssId: " + rss.getId() + " ...");
					List<News> newsList = NewsUtil.parseToEntity(rss);
					int savedCount = saveList(newsList);
					allSavedCount += savedCount;
					logger.info("Has successfully saved " + savedCount + " news that rssId is " + rss.getId() + " !");
				} catch (Exception e) {
					logger.error("get news and parse to entity", e);
				}
			}
		}
		logger.info("The " + count + " times news update task is over and has successfully saved " + allSavedCount + " news!");
	}

	public int saveList(List<News> newsList) {
		int savedCount = 0;
		if (newsList != null && !newsList.isEmpty())
			for (News news : newsList) {
				try {
					if (newsManager.saveWithCheck(news))
						savedCount++;
				} catch (Exception e) {
					logger.error("save news exception", e);
				}
			}
		return savedCount;
	}

	public NewsManager getNewsManager() {
		return newsManager;
	}

	@Autowired
	public void setNewsManager(NewsManager newsManager) {
		this.newsManager = newsManager;
	}

	public RssManager getRssManager() {
		return rssManager;
	}

	@Autowired
	public void setRssManager(RssManager rssManager) {
		this.rssManager = rssManager;
	}
}