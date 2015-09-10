package com.nokia.xpress.now.dao.video;

import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.video.Video;

@Component
public class VideoDao extends HibernateDao<Video, Long> {
	public Video getById(Long id) {
		String hql = "FROM Video n WHERE n.id=?";
		return (Video) createQuery(hql, id).uniqueResult();
	}
}
