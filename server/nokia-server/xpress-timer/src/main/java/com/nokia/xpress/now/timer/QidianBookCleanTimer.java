package com.nokia.xpress.now.timer;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nokia.xpress.now.entity.reading.QidianCategory;
import com.nokia.xpress.now.service.reading.QidianBookManager;
import com.nokia.xpress.now.service.reading.QidianCategoryManager;

/**
 * 被Spring的Quartz MethodInvokingJobDetailFactoryBean定时执行的普通Spring Bean.
 */
@Component
public class QidianBookCleanTimer {
	private static Logger logger = LoggerFactory.getLogger(QidianBookCleanTimer.class);
	private QidianCategoryManager qidianCategoryManager;
	private QidianBookManager qidianBookManager;
	private static long count = 0L;

	public void execute() {
		logger.info("Start the " + ++count + " times book clean task ...");
		int allCleanedCount = 0;
		List<QidianCategory> categoryList = qidianCategoryManager.getAll();
		for (QidianCategory category : categoryList) {
			Long cid = category.getId();
			try {
				logger.info("Cleanning cid: " + cid + ",categoryId: " + category.getCategoryId() + " ...");
				int cleanedCount = qidianBookManager.cleanBookByCid(cid);
				allCleanedCount += cleanedCount;
				logger.info("Has Successfully cleaned " + cleanedCount + " books that cid is " + cid + " !");
			} catch (Exception e) {
				logger.error("Clean book that cid is " + cid, e);
			}
		}
		logger.info("The " + count + " times book clean task is over and has Successfully cleaned " + allCleanedCount + " books!");
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
}