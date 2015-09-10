package com.nokia.xpress.now.timer;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.enums.ReadingEnums;
import com.nokia.xpress.now.common.util.reading.EZReadUtil;
import com.nokia.xpress.now.common.util.reading.QidianUtil;
import com.nokia.xpress.now.entity.reading.QidianBook;
import com.nokia.xpress.now.entity.reading.QidianBookChapter;
import com.nokia.xpress.now.entity.reading.QidianCategory;
import com.nokia.xpress.now.service.reading.QidianBookChapterManager;
import com.nokia.xpress.now.service.reading.QidianBookManager;
import com.nokia.xpress.now.service.reading.QidianCategoryManager;

/**
 * 被Spring的Quartz MethodInvokingJobDetailFactoryBean定时执行的普通Spring Bean.
 */
@Component
public class QidianBookUpdateTimer {
	private static Logger logger = LoggerFactory.getLogger(QidianBookUpdateTimer.class);
	private QidianCategoryManager qidianCategoryManager;
	private QidianBookManager qidianBookManager;
	private QidianBookChapterManager qidianBookChapterManager;
	private static long count = 0L;

	public void execute() {
		logger.info("Start the " + ++count + " times book update task ...");
		int allSavedCount = 0;
		List<QidianCategory> categoryList = qidianCategoryManager.findAllWithState(true);
		for (QidianCategory category : categoryList) {
			try {
				Long cid = category.getId();
				Long categoryId = category.getCategoryId();
				logger.info("Updating cid: " + cid + ",categoryId: " + categoryId + " ...");
				List<QidianBook> bookList = null;
				if (category.getType().equals(ReadingEnums.QIDIAN.getValue()))
					bookList = QidianUtil.getMonthTopList(category, 1, ProjectConfig.getReadingBookReaminNum());
				else if (category.getType().equals(ReadingEnums.EZREAD.getValue()))
					bookList = EZReadUtil.getBookList(category, 1, ProjectConfig.getReadingBookReaminNum());
				int savedCount = saveBookList(bookList);
				allSavedCount += savedCount;
				logger.info("Has successfully saved or updated " + savedCount + " books that cid is " + cid + " !");
			} catch (Exception e) {
				logger.error("get book and parse to entity", e);
			}
		}
		logger.info("The " + count + " times book update task is over and has successfully saved or updated " + allSavedCount + " books!");
		logger.info("Start the " + count + " times chapter update task ...");
		List<QidianBook> bookList = qidianBookManager.getAll();
		allSavedCount = 0;
		for (QidianBook book : bookList) {
			long bid = book.getId();
			try {
				logger.info("Updating bid: " + bid + " ...");
				List<QidianBookChapter> chapterList = null;
				if (book.getType().equals(ReadingEnums.QIDIAN.getValue()))
					chapterList = QidianUtil.getChapterList(book);
				else if (book.getType().equals(ReadingEnums.EZREAD.getValue()))
					chapterList = EZReadUtil.getChapterList(book);
				int savedCount = saveChapterList(chapterList);
				allSavedCount += savedCount;
				logger.info("Has successfully saved or updated " + savedCount + " chapters that bid is " + bid + " !");
			} catch (Exception e) {
				logger.error("get chapter and parse to entity", e);
			}
		}
		logger.info("The " + count + " times chapter update task is over and has successfully saved or updated " + allSavedCount + " chapters!");
	}

	public int saveBookList(List<QidianBook> bookList) {
		int savedCount = 0;
		if (bookList != null && !bookList.isEmpty())
			for (QidianBook book : bookList) {
				try {
					if (qidianBookManager.saveWithCheck(book))
						savedCount++;
				} catch (Exception e) {
					logger.error("save book exception", e);
				}
			}
		return savedCount;
	}

	public int saveChapterList(List<QidianBookChapter> chapterList) {
		int savedCount = 0;
		if (chapterList != null && !chapterList.isEmpty())
			for (QidianBookChapter chapter : chapterList) {
				try {
					if (qidianBookChapterManager.saveWithCheck(chapter))
						savedCount++;
				} catch (Exception e) {
					logger.error("save chapter exception", e);
				}
			}
		return savedCount;
	}

	public QidianCategoryManager getQidianCategoryManager() {
		return qidianCategoryManager;
	}

	@Autowired
	public void setQidianCategoryManager(QidianCategoryManager qidianCategoryManager) {
		this.qidianCategoryManager = qidianCategoryManager;
	}

	public QidianBookManager getQidianBookManager() {
		return qidianBookManager;
	}

	@Autowired
	public void setQidianBookManager(QidianBookManager qidianBookManager) {
		this.qidianBookManager = qidianBookManager;
	}

	public QidianBookChapterManager getQidianBookChapterManager() {
		return qidianBookChapterManager;
	}

	@Autowired
	public void setQidianBookChapterManager(QidianBookChapterManager qidianBookChapterManager) {
		this.qidianBookChapterManager = qidianBookChapterManager;
	}
}