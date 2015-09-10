package com.nokia.xpress.now.dao.common;

import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.common.Device;

@Component
public class DeviceDao extends HibernateDao<Device, Long> {
	public Device getById(Long id) {
		String hql = "FROM Device d WHERE d.id=?";
		return (Device) createQuery(hql, id).uniqueResult();
	}
}
