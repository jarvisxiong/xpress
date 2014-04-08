package com.nokia.xpress.now.service.news;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.dao.news.NewsLayoutDao;
import com.nokia.xpress.now.entity.news.NewsLayout;
import com.nokia.xpress.now.service.EntityManagement;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class NewsLayoutManager extends EntityManagement<NewsLayout, Long> {
	private NewsLayoutDao newsLayoutDao;

	@Override
	protected HibernateDao<NewsLayout, Long> getEntityDao() {
		return newsLayoutDao;
	}

	public NewsLayoutDao getNewsLayoutDao() {
		return newsLayoutDao;
	}

	@Autowired
	public void setNewsLayoutDao(NewsLayoutDao newsLayoutDao) {
		this.newsLayoutDao = newsLayoutDao;
	}

	public void deleteNewsLayout(Long id) {
		newsLayoutDao.delete(id);
	}

	@Transactional(readOnly = true)
	public List<NewsLayout> findAllLayoutWithDeviceIdAndState(Long deviceId, Boolean state) {
		return newsLayoutDao.findAllLayoutWithDeviceIdAndState(deviceId, state);
	}
}
