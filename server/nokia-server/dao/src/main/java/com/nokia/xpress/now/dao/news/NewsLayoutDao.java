package com.nokia.xpress.now.dao.news;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.news.NewsLayout;

@Component
public class NewsLayoutDao extends HibernateDao<NewsLayout, Long> {
	public List<NewsLayout> findAllLayoutWithDeviceIdAndState(Long deviceId, Boolean state) {
		String hql = "FROM NewsLayout nl WHERE nl.device.id=? AND nl.enable=? ORDER BY nl.positionIndex";
		return find(hql, deviceId, state);
	}
}
