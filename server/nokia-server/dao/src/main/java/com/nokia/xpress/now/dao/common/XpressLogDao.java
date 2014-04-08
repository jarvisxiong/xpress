package com.nokia.xpress.now.dao.common;

import org.hibernate.Query;
import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.common.XpressLog;

@Component
public class XpressLogDao extends HibernateDao<XpressLog, Long> {
	public long cleanLog(Long days) {
		String hql = "DELETE FROM xpressLog WHERE oper_date<SUBDATE(NOW(), INTERVAL ? DAY)";
		Query query = createQuery(hql, days);
		return ((Number) query.uniqueResult()).longValue();
	}
}
