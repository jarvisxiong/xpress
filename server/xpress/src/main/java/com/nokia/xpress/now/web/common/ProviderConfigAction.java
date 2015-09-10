package com.nokia.xpress.now.web.common;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.entity.common.ProviderConfig;
import com.nokia.xpress.now.service.common.DeviceManager;
import com.nokia.xpress.now.service.common.ProviderConfigManager;
import com.nokia.xpress.now.web.CrudActionSupport;

public class ProviderConfigAction extends CrudActionSupport<ProviderConfig> {
	private static final long serialVersionUID = 3732044164612649847L;
	protected Long id;
	protected Integer type;
	private Long deviceId;
	protected ProviderConfig providerConfig;
	protected ProviderConfigManager providerConfigManager;
	protected DeviceManager deviceManager;
	protected Page<ProviderConfig> page = new Page<ProviderConfig>(20);// 每页20条记录

	@Override
	public ProviderConfig getModel() {
		return providerConfig;
	}

	@Override
	public String list() throws Exception {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		if (type != null)
			filters.add(new PropertyFilter("EQI_type", type.toString()));
		if (id != null)
			filters.add(new PropertyFilter("EQL_id", id.toString()));
		// 设置默认排序方式
		if (!page.isOrderBySetted()) {
			page.setOrderBy("id");
			page.setOrder(Page.ASC);
		}
		page = providerConfigManager.find(page, filters);
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			Device device = deviceManager.get(deviceId);
			providerConfig.setDevice(device);
			providerConfig.setModifyDate(new Date());
			providerConfigManager.save(providerConfig);
			addActionMessage("Save provider config successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save provider config failed</font>");
		}
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		try {
			providerConfigManager.deleteProviderConfig(id);
			addActionMessage("Delete provider config successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Delete provider config failed</font>");
		}
		return RELOAD;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			providerConfig = new ProviderConfig();
			providerConfig.setType(type);
			providerConfig.setCreateDate(new Date());
			if (deviceId != null)
				providerConfig.setDevice(deviceManager.get(deviceId));
		} else {
			providerConfig = providerConfigManager.get(id);
			Device device = providerConfig.getDevice();
			deviceId = (device == null ? null : device.getId());
		}
	}

	public List<Device> getDeviceList() {
		return deviceManager.getAll();
	}

	/**
	 * 支持使用Jquery.validate Ajax检验设备ID是否重复.
	 */
	public String checkDeviceId() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String newDeviceIdStr = request.getParameter("deviceId");
		Long newDeviceId = null;
		if (newDeviceIdStr != null && !newDeviceIdStr.trim().equals("")) {
			try {
				newDeviceId = Long.parseLong(newDeviceIdStr);
			} catch (NumberFormatException e) {
			}
		}
		String oldDeviceIdStr = request.getParameter("oldDeviceId");
		Long oldDeviceId = null;
		if (oldDeviceIdStr != null && !oldDeviceIdStr.trim().equals("")) {
			try {
				oldDeviceId = Long.parseLong(oldDeviceIdStr);
			} catch (NumberFormatException e) {
			}
		}
		if (providerConfigManager.isDeviceIdUnique(type, newDeviceId, oldDeviceId))
			Struts2Utils.renderText("true");
		else
			Struts2Utils.renderText("false");
		return null;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Long getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(Long deviceId) {
		this.deviceId = deviceId;
	}

	@Autowired
	public void setProviderConfigManager(ProviderConfigManager providerConfigManager) {
		this.providerConfigManager = providerConfigManager;
	}

	@Autowired
	public void setDeviceManager(DeviceManager deviceManager) {
		this.deviceManager = deviceManager;
	}

	public Page<ProviderConfig> getPage() {
		return page;
	}

	public void setPage(Page<ProviderConfig> page) {
		this.page = page;
	}
}
