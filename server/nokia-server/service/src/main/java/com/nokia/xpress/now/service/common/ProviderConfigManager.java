package com.nokia.xpress.now.service.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.dao.common.ProviderConfigDao;
import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.entity.common.ProviderConfig;
import com.nokia.xpress.now.service.EntityManagement;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class ProviderConfigManager extends EntityManagement<ProviderConfig, Long> {
	private ProviderConfigDao providerConfigDao;

	@Override
	protected HibernateDao<ProviderConfig, Long> getEntityDao() {
		return providerConfigDao;
	}

	@Transactional(readOnly = true)
	public ProviderConfig getById(Long id) {
		return providerConfigDao.getById(id);
	}

	@Transactional(readOnly = true)
	public ProviderConfig getByTypeAndDevice(TypeEnums type, Device device) {
		return providerConfigDao.getByTypeAndDevice(type, device);
	}

	public void deleteProviderConfig(Long id) {
		providerConfigDao.delete(id);
	}

	@Transactional(readOnly = true)
	public boolean isDeviceIdUnique(Integer type, Long newDeviceId, Long oldDeviceId) {
		return providerConfigDao.isDeviceIdUnique(type, newDeviceId, oldDeviceId);
	}

	public ProviderConfigDao getProviderConfigDao() {
		return providerConfigDao;
	}

	@Autowired
	public void setProviderConfigDao(ProviderConfigDao providerConfigDao) {
		this.providerConfigDao = providerConfigDao;
	}
}
