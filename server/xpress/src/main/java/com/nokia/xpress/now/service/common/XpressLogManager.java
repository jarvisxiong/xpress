package com.nokia.xpress.now.service.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.dao.common.XpressLogDao;
import com.nokia.xpress.now.entity.common.XpressLog;
import com.nokia.xpress.now.service.EntityManagement;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class XpressLogManager extends EntityManagement<XpressLog, Long> {
	private XpressLogDao xpressLogDao;

	@Override
	protected HibernateDao<XpressLog, Long> getEntityDao() {
		return xpressLogDao;
	}

	public XpressLogDao getXpressLogDao() {
		return xpressLogDao;
	}

	@Autowired
	public void setXpressLogDao(XpressLogDao xpressLogDao) {
		this.xpressLogDao = xpressLogDao;
	}

	public void deleteLog(Long id) {
		xpressLogDao.delete(id);
	}

	public void cleanLog(Long days) {
		xpressLogDao.cleanLog(days);
	}
}
