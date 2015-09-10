package com.nokia.xpress.now.service.common;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;
import org.springside.modules.security.springsecurity.SpringSecurityUtils;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.dao.common.DeviceDao;
import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.service.EntityManagement;
import com.nokia.xpress.now.service.exception.CanNotDeleteDefaultDeviceException;
import com.nokia.xpress.now.service.exception.CanNotModifyDefaultDeviceUAException;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class DeviceManager extends EntityManagement<Device, Long> {
	private DeviceDao deviceDao;

	@Override
	protected HibernateDao<Device, Long> getEntityDao() {
		return deviceDao;
	}

	public DeviceDao getDeviceDao() {
		return deviceDao;
	}

	@Autowired
	public void setDeviceDao(DeviceDao deviceDao) {
		this.deviceDao = deviceDao;
	}

	public void saveDevice(Device entity) {
		if (entity.getId() != null) {
			if (entity.getId() == ProjectConfig.DEFAULT_DEVICE_ID && (!getById(ProjectConfig.DEFAULT_DEVICE_ID).getUa().equals(entity.getUa()))) {
				logger.warn("操作员{}尝试修改默认设备的UA", SpringSecurityUtils.getCurrentUserName());
				throw new CanNotModifyDefaultDeviceUAException("不能修改默认设备的UA");
			}
		}
		deviceDao.save(entity);
	}

	public void deleteDevice(Long id) {
		if (id == 0) {
			logger.warn("操作员{}尝试删除默认设备", SpringSecurityUtils.getCurrentUserName());
			throw new CanNotDeleteDefaultDeviceException("不能删除默认设备");
		}
		deviceDao.delete(id);
	}

	/**
	 * 检查UA是否唯一.
	 * 
	 * @return ua在数据库中唯一或等于oldUa时返回true.
	 */
	@Transactional(readOnly = true)
	public boolean isUAUnique(String newUa, String oldUa) {
		return deviceDao.isPropertyUnique("ua", newUa, oldUa);
	}

	@Transactional(readOnly = true)
	public Device getById(Long id) {
		return deviceDao.getById(id);
	}

	@Transactional(readOnly = true)
	public Device getByUa(String ua) {
		return deviceDao.findUniqueBy("ua", ua);
	}

	@Transactional(readOnly = true)
	public JSONObject parseDeviceToJson(Device device) {
		JSONObject jsonObject = new JSONObject();
		if (device != null) {
			try {
				jsonObject.put("ua", device.getUa());
				jsonObject.put("deviceName", device.getDeviceName());
				jsonObject.put("screenWidth", String.valueOf(device.getScreenWidth()));
				jsonObject.put("screenHeight", String.valueOf(device.getScreenHeight()));
				jsonObject.put("showSetting", String.valueOf(device.getShowSetting()));
				jsonObject.put("settingLink", device.getSettingLink());
			} catch (JSONException e) {
				logger.error("ERROR IN DeviceManager.parseDeviceToJson()", e);
			}
		}
		return jsonObject;
	}
}
