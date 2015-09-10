package com.nokia.xpress.now.service.reading;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.dao.reading.QidianCategoryDao;
import com.nokia.xpress.now.entity.reading.QidianCategory;
import com.nokia.xpress.now.service.EntityManagement;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class QidianCategoryManager extends EntityManagement<QidianCategory, Long> {
	private QidianCategoryDao qidianCategoryDao;

	@Override
	protected HibernateDao<QidianCategory, Long> getEntityDao() {
		return qidianCategoryDao;
	}

	@Transactional(readOnly = true)
	public QidianCategory getById(Long id) {
		return qidianCategoryDao.getById(id);
	}

	@Transactional(readOnly = true)
	public List<QidianCategory> findAllWithState(Boolean state) {
		return qidianCategoryDao.findAllWithState(state);
	}

	public QidianCategoryDao getQidianCategoryDao() {
		return qidianCategoryDao;
	}

	@Autowired
	public void setQidianCategoryDao(QidianCategoryDao qidianCategoryDao) {
		this.qidianCategoryDao = qidianCategoryDao;
	}
}
