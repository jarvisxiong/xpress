package com.nokia.xpress.now.service.reading;

import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.dao.reading.QidianLastReadDao;
import com.nokia.xpress.now.entity.reading.QidianBookChapter;
import com.nokia.xpress.now.entity.reading.QidianLastRead;
import com.nokia.xpress.now.service.EntityManagement;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class QidianLastReadManager extends EntityManagement<QidianLastRead, String> {
	private QidianLastReadDao qidianLastReadDao;
	private QidianBookChapterManager qidianBookChapterManager;

	@Override
	protected HibernateDao<QidianLastRead, String> getEntityDao() {
		return qidianLastReadDao;
	}

	@Transactional(readOnly = true)
	public QidianLastRead getById(String id) {
		return qidianLastReadDao.getById(id);
	}

	public void deleteLastRead(String id) {
		qidianLastReadDao.delete(id);
	}

	public boolean saveWithCheck(QidianLastRead needSavedLastRead) {
		QidianLastRead qidianLastReadInDb = qidianLastReadDao.getById(needSavedLastRead.getId());
		if (qidianLastReadInDb == null) {
			qidianLastReadDao.save(needSavedLastRead);
		} else {
			qidianLastReadInDb.setBook(needSavedLastRead.getBook());
			qidianLastReadInDb.setChapter(needSavedLastRead.getChapter());
			qidianLastReadInDb.setModifyDate(new Date());
			qidianLastReadInDb.setEnable(true);
			qidianLastReadDao.save(qidianLastReadInDb);
		}
		return true;
	}

	public boolean save(String id, QidianBookChapter chapter) {
		QidianLastRead qidianLastReadInDb = qidianLastReadDao.getById(id);
		if (qidianLastReadInDb == null) {
			QidianLastRead qidianLastRead = new QidianLastRead();
			qidianLastRead.setId(id);
			qidianLastRead.setBook(chapter.getBook());
			qidianLastRead.setChapter(chapter);
			qidianLastRead.setCreateDate(new Date());
			qidianLastRead.setModifyDate(new Date());
			qidianLastRead.setEnable(true);
			qidianLastReadDao.save(qidianLastRead);
		} else {
			qidianLastReadInDb.setBook(chapter.getBook());
			qidianLastReadInDb.setChapter(chapter);
			qidianLastReadInDb.setModifyDate(new Date());
			qidianLastReadInDb.setEnable(true);
			qidianLastReadDao.save(qidianLastReadInDb);
		}
		return true;
	}

	@Transactional(readOnly = true)
	public JSONObject getLastReadChapterToJson(String deviceId) {
		QidianLastRead qidianLastRead = getById(deviceId);
		JSONObject jsonObject = new JSONObject();
		if (qidianLastRead != null) {
			try {
				jsonObject.put("bid", qidianLastRead.getBook().getId());
				jsonObject.put("chid", qidianLastRead.getChapter().getId());
				jsonObject.put("name", qidianLastRead.getChapter().getName());
			} catch (JSONException e) {
				logger.error("ERROR IN QidianLastReadManager.getLastReadChapterToJson()", e);
			}
		}
		return jsonObject;
	}

	public QidianLastReadDao getqidianLastReadDao() {
		return qidianLastReadDao;
	}

	@Autowired
	public void setqidianLastReadDao(QidianLastReadDao qidianLastReadDao) {
		this.qidianLastReadDao = qidianLastReadDao;
	}

	public QidianBookChapterManager getQidianBookChapterManager() {
		return qidianBookChapterManager;
	}

	@Autowired
	public void setQidianBookChapterManager(QidianBookChapterManager qidianBookChapterManager) {
		this.qidianBookChapterManager = qidianBookChapterManager;
	}
}
