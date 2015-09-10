package com.nokia.xpress.now.timer;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.util.ImageUtil;
import com.nokia.xpress.now.service.news.NewsManager;
import com.nokia.xpress.now.service.reading.QidianBookManager;

/**
 * 被Spring的Quartz MethodInvokingJobDetailFactoryBean定时执行的普通Spring Bean.
 */
@Component
public class ImageCleanTimer {
	private static Logger logger = LoggerFactory.getLogger(ImageCleanTimer.class);
	private NewsManager newsManager;
	private QidianBookManager qidianBookManager;
	private static long count = 0L;

	public void execute() {
		logger.info("Start the " + ++count + " image clean task ...");
		int allCleanedCount = 0;
		// 新闻图片清理
		List<Long> newsIdList = newsManager.findAllId("id", "ASC");
		List<Long> newsIdPathList = new ArrayList<Long>();
		String newsImagePath = ProjectConfig.getNewsImagePath();
		File newsImageDir = new File(newsImagePath);
		if (newsImageDir.exists() && newsImageDir.isDirectory()) {
			logger.info("Begin clean news images...");
			int cleanedCount = 0;
			String[] fileNames = newsImageDir.list();
			for (String fileName : fileNames)
				try {
					newsIdPathList.add(Long.parseLong(fileName));
				} catch (NumberFormatException e) {
					logger.warn(e.getMessage(), e);
				}
			newsIdPathList.removeAll(newsIdList);
			for (Long newsId : newsIdPathList) {
				try {
					ImageUtil.deleteLocalPic(newsImagePath, newsId);
					cleanedCount++;
					logger.debug("Has cleaned directory " + new File(newsImagePath, String.valueOf(newsId)).getCanonicalPath());
				} catch (IOException e) {
					logger.warn(e.getMessage(), e);
				}
			}
			allCleanedCount += cleanedCount;
			logger.info("Has Successfully cleaned " + cleanedCount + " news images!");
		}
		// 起点书籍图片的清理
		List<Long> qidianBookIdList = qidianBookManager.findAllId("id", "ASC");
		List<Long> qidianBookIdPathList = new ArrayList<Long>();
		String qidianBookImagePath = ProjectConfig.getQidianBookImagePath();
		File qidianBookImageDir = new File(qidianBookImagePath);
		if (qidianBookImageDir.exists() && qidianBookImageDir.isDirectory()) {
			logger.info("Begin clean qidian book images...");
			int cleanedCount = 0;
			String[] fileNames = qidianBookImageDir.list();
			for (String fileName : fileNames)
				try {
					qidianBookIdPathList.add(Long.parseLong(fileName));
				} catch (NumberFormatException e) {
					logger.warn(e.getMessage(), e);
				}
			qidianBookIdPathList.removeAll(qidianBookIdList);
			for (Long qidianBookId : qidianBookIdPathList) {
				try {
					ImageUtil.deleteLocalPic(qidianBookImagePath, qidianBookId);
					cleanedCount++;
					logger.debug("Has cleaned directory " + new File(qidianBookImagePath, String.valueOf(qidianBookId)).getCanonicalPath());
				} catch (IOException e) {
					logger.warn(e.getMessage(), e);
				}
			}
			allCleanedCount += cleanedCount;
			logger.info("Has Successfully cleaned " + cleanedCount + " qidian book images!");
		}
		logger.info("The " + count + " times image clean task is over and has Successfully cleaned " + allCleanedCount + " images!");
	}

	public NewsManager getNewsManager() {
		return newsManager;
	}

	@Autowired
	public void setNewsManager(NewsManager newsManager) {
		this.newsManager = newsManager;
	}

	public QidianBookManager getQidianBookManager() {
		return qidianBookManager;
	}

	@Autowired
	public void setQidianBookManager(QidianBookManager qidianBookManager) {
		this.qidianBookManager = qidianBookManager;
	}
}