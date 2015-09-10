package com.nokia.xpress.now.dao.reading;

import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.reading.QidianLastRead;

@Component
public class QidianLastReadDao extends HibernateDao<QidianLastRead, String> {
	public QidianLastRead getById(String id) {
		String hql = "FROM QidianLastRead qlr WHERE qlr.id=?";
		return (QidianLastRead) createQuery(hql, id).uniqueResult();
	}
}
