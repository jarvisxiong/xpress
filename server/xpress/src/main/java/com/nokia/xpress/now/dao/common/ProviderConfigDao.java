package com.nokia.xpress.now.dao.common;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.entity.common.ProviderConfig;

@Component
public class ProviderConfigDao extends HibernateDao<ProviderConfig, Long> {
	public ProviderConfig getById(Long id) {
		String hql = "FROM ProviderConfig pc WHERE pc.id=?";
		return (ProviderConfig) createQuery(hql, id).uniqueResult();
	}

	@Transactional(readOnly = true)
	public ProviderConfig getByTypeAndDevice(TypeEnums type, Device device) {
		String hql = "FROM ProviderConfig pc WHERE pc.type=? AND pc.device.id=?";
		return (ProviderConfig) createQuery(hql, type.getValue(), device.getId()).uniqueResult();
	}

	public boolean isDeviceIdUnique(Integer type, Long newDeviceId, Long oldDeviceId) {
		if (newDeviceId == null || newDeviceId == oldDeviceId)
			return true;
		Object object = findUnique("FROM ProviderConfig pc WHERE pc.type=? AND pc.device.id=?", type, newDeviceId);
		return (object == null);
	}
}
