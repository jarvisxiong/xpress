package com.nokia.xpress.now.dao.common;

import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.common.Advertisement;

@Component
public class AdvertisementDao extends HibernateDao<Advertisement, Long> {
	public Advertisement getById(Long id) {
		String hql = "FROM Advertisement a WHERE a.id=?";
		return (Advertisement) createQuery(hql, id).uniqueResult();
	}
}
