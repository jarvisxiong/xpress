package com.nokia.xpress.now.service.reading;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.dao.reading.QidianLayoutDao;
import com.nokia.xpress.now.entity.reading.QidianLayout;
import com.nokia.xpress.now.service.EntityManagement;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class QidianLayoutManager extends EntityManagement<QidianLayout, Long> {
	private QidianLayoutDao qidianLayoutDao;

	@Override
	protected HibernateDao<QidianLayout, Long> getEntityDao() {
		return qidianLayoutDao;
	}

	public QidianLayoutDao getQidianLayoutDao() {
		return qidianLayoutDao;
	}

	@Autowired
	public void setQidianLayoutDao(QidianLayoutDao qidianLayoutDao) {
		this.qidianLayoutDao = qidianLayoutDao;
	}

	public void deleteQidianLayout(Long id) {
		qidianLayoutDao.delete(id);
	}

	@Transactional(readOnly = true)
	public boolean isCategoryIdUnique(Long deviceId, Long newCategoryId, Long oldCategoryId) {
		return qidianLayoutDao.isCategoryIdUnique(deviceId, newCategoryId, oldCategoryId);
	}

	@Transactional(readOnly = true)
	public List<QidianLayout> findAllLayoutByDeviceIdAndState(Long deviceId, Boolean state) {
		return qidianLayoutDao.findAllLayoutByDeviceIdAndState(deviceId, state);
	}

	@Transactional(readOnly = true)
	public List<Long> findAllCidByDeviceIdAndState(Long deviceId, Boolean state) {
		return qidianLayoutDao.findAllCategoryIdByDeviceIdAndState(deviceId, state);
	}
}
