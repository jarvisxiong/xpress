package com.nokia.xpress.now.timer;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nokia.xpress.now.entity.news.Rss;
import com.nokia.xpress.now.service.news.NewsManager;
import com.nokia.xpress.now.service.news.RssManager;

/**
 * 被Spring的Quartz MethodInvokingJobDetailFactoryBean定时执行的普通Spring Bean.
 */
@Component
public class NewsCleanTimer {
	private static Logger logger = LoggerFactory.getLogger(NewsCleanTimer.class);
	private NewsManager newsManager;
	private RssManager rssManager;
	private static long count = 0L;

	public void execute() {
		logger.info("Start the " + ++count + " times news clean task ...");
		int allCleanedCount = 0;
		List<Rss> rssList = rssManager.getAll();
		if (rssList != null && !rssList.isEmpty()) {
			for (Rss rss : rssList) {
				try {
					logger.info("Cleanning rssId: " + rss.getId() + " ...");
					int cleanedCount = newsManager.cleanNewsByRss(rss);
					allCleanedCount += cleanedCount;
					logger.info("Has Successfully cleaned " + cleanedCount + " news that rssId is " + rss.getId() + " !");
				} catch (Exception e) {
					logger.error("Clean news that rssId is " + rss.getId(), e);
				}
			}
		}
		logger.info("The " + count + " times news clean task is over and has Successfully cleaned " + allCleanedCount + " news!");
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