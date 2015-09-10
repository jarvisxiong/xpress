package com.nokia.xpress.now.service.common;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.nokia.xpress.now.entity.reading.QidianBook;
import com.nokia.xpress.now.service.reading.QidianBookChapterManager;
import com.nokia.xpress.now.service.reading.QidianBookManager;

public class RemoveIllegalReadingThread extends Thread {
	private static Logger logger = LoggerFactory.getLogger(RemoveIllegalReadingThread.class);
	private QidianBookManager qidianBookManager;
	private QidianBookChapterManager qidianBookChapterManager;

	public RemoveIllegalReadingThread(QidianBookManager qidianBookManager, QidianBookChapterManager qidianBookChapterManager) {
		this.qidianBookManager = qidianBookManager;
		this.qidianBookChapterManager = qidianBookChapterManager;
	}

	@Override
	public void run() {
		try {
			logger.info("Begin removed qidian books because of keyword changed...");
			int allRemoveCount = qidianBookManager.removeIllegalBooks();
			logger.info("Has removed " + allRemoveCount + " qidian books because of keyword changed!");
			logger.info("Begin removed qidian book chapters because of keyword changed...");
			List<QidianBook> qidianBookList = qidianBookManager.getAll();
			allRemoveCount = 0;
			for (QidianBook qidianBook : qidianBookList) {
				long bid = qidianBook.getId();
				try {
					logger.info("Cleaning bid: " + bid + " ...");
					int removedCount = qidianBookChapterManager.removeIllegalChapters(qidianBook);
					if (removedCount > 0) {
						allRemoveCount += removedCount;
						logger.info("Has removed " + removedCount + " qidian book chapters that bid is " + bid + " !");
					}
				} catch (Exception e) {
					logger.error("ERROR IN RemoveIllegalReadingThread", e);
				}
			}
			logger.info("Has removed " + allRemoveCount + " qidian book chapters because of keyword changed!");
		} catch (Exception e) {
			logger.error("ERROR IN RemoveIllegalReadingThread", e);
		}
	}
}
