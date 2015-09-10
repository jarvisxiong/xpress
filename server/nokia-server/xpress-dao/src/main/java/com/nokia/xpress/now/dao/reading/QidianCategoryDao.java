package com.nokia.xpress.now.dao.reading;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.reading.QidianCategory;

@Component
public class QidianCategoryDao extends HibernateDao<QidianCategory, Long> {
	public QidianCategory getById(Long id) {
		String hql = "FROM QidianCategory c WHERE c.id=?";
		return (QidianCategory) createQuery(hql, id).uniqueResult();
	}

	public List<QidianCategory> findAllWithState(Boolean state) {
		String hql = "FROM QidianCategory c WHERE c.enable=?";
		return find(hql, state);
	}
}
