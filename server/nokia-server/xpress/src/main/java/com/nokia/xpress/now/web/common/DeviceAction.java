package com.nokia.xpress.now.web.common;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.common.util.JquertAjaxUtil;
import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.service.common.DeviceManager;
import com.nokia.xpress.now.service.exception.CanNotDeleteDefaultDeviceException;
import com.nokia.xpress.now.service.exception.CanNotModifyDefaultDeviceUAException;
import com.nokia.xpress.now.web.CrudActionSupport;

@Namespace("/device")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "device.action", type = "redirect") })
public class DeviceAction extends CrudActionSupport<Device> {
	private static final long serialVersionUID = 6076991697658794320L;
	private Long id;
	private Device device;

	private DeviceManager deviceManager;
	private Page<Device> page = new Page<Device>(20);// 每页20条记录

	@Override
	public Device getModel() {
		return device;
	}

	@Override
	public String list() throws Exception {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		// 设置默认排序方式
		if (!page.isOrderBySetted()) {
			page.setOrderBy("id");
			page.setOrder(Page.DESC);
		}
		page = deviceManager.find(page, filters);
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			device.setUa(device.getUa().trim());
			device.setModifyDate(new Date());
			// if (device.getDeviceNews() == null) {
			// DeviceNews deviceNews = new DeviceNews();
			// deviceNews.setShowSetting(true);
			// deviceNews.setCreateDate(new Date());
			// deviceNews.setModifyDate(new Date());
			// device.setDeviceNews(deviceNews);
			// }
			deviceManager.saveDevice(device);
			addActionMessage("Save device successfully");
		} catch (CanNotModifyDefaultDeviceUAException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Can not modify ua of default device</font>");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save device failed</font>");
		}
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		try {
			deviceManager.deleteDevice(id);
			addActionMessage("Delete device successfully");
		} catch (CanNotDeleteDefaultDeviceException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Can not delete default device</font>");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Delete device failed</font>");
		}
		return RELOAD;
	}

	/**
	 * 支持使用Jquery.validate Ajax检验UA是否重复.
	 */
	public String checkUA() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String newUa = JquertAjaxUtil.parseText(request.getParameter("ua"));
		if (newUa != null)
			newUa = newUa.trim();
		String oldUa = JquertAjaxUtil.parseText(request.getParameter("oldUa"));
		if (deviceManager.isUAUnique(newUa, oldUa))
			Struts2Utils.renderText("true");
		else
			Struts2Utils.renderText("false");
		return null;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			device = new Device();
			device.setCreateDate(new Date());
		} else {
			device = deviceManager.get(id);
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Autowired
	public void setDeviceManager(DeviceManager deviceManager) {
		this.deviceManager = deviceManager;
	}

	public Page<Device> getPage() {
		return page;
	}

	public void setPage(Page<Device> page) {
		this.page = page;
	}
}
