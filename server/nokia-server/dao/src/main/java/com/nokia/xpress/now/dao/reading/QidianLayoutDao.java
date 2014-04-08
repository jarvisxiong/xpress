package com.nokia.xpress.now.dao.reading;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.reading.QidianLayout;

@Component
public class QidianLayoutDao extends HibernateDao<QidianLayout, Long> {
	public List<QidianLayout> findAllLayoutByDeviceIdAndState(Long deviceId, Boolean state) {
		String hql = "FROM QidianLayout ql WHERE ql.device.id=? AND ql.enable=? ORDER BY ql.positionIndex";
		return find(hql, deviceId, state);
	}

	@SuppressWarnings("unchecked")
	public List<Long> findAllCategoryIdByDeviceIdAndState(Long deviceId, Boolean state) {
		String hql = "SELECT ql.category.id FROM QidianLayout ql WHERE ql.device.id=? AND ql.enable=? ORDER BY ql.positionIndex";
		return (List<Long>) createQuery(hql, deviceId, state).list();
	}

	public boolean isCategoryIdUnique(Long deviceId, Long newCategoryId, Long oldCategoryId) {
		if (newCategoryId == null || newCategoryId == oldCategoryId)
			return true;
		Object object = findUnique("FROM QidianLayout ql WHERE ql.device.id=? AND ql.category.id=?", deviceId, newCategoryId);
		return (object == null);
	}
}
