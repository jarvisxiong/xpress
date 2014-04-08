package com.nokia.xpress.now.service.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.nokia.xpress.now.service.news.NewsManager;

public class RemoveIllegalNewsThread extends Thread {
	private static Logger logger = LoggerFactory.getLogger(RemoveIllegalNewsThread.class);
	NewsManager newsManager;

	public RemoveIllegalNewsThread(NewsManager newsManager) {
		this.newsManager = newsManager;
	}

	@Override
	public void run() {
		try {
			logger.info("Begin removed news because of keyword changed...");
			int removeCount = newsManager.removeIllegalNews();
			logger.info("Has removed " + removeCount + " news because of keyword changed!");
		} catch (Exception e) {
			logger.error("ERROR IN RemoveIllegalNewsThread", e);
		}
	}
}
