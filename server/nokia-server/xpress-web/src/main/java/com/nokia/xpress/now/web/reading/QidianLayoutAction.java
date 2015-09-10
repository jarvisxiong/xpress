package com.nokia.xpress.now.web.reading;

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

import com.nokia.xpress.now.entity.reading.QidianCategory;
import com.nokia.xpress.now.entity.reading.QidianLayout;
import com.nokia.xpress.now.service.common.DeviceManager;
import com.nokia.xpress.now.service.reading.QidianCategoryManager;
import com.nokia.xpress.now.service.reading.QidianLayoutManager;
import com.nokia.xpress.now.web.CrudActionSupport;

@Namespace("/reading")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "qidian-layout.action", type = "redirect"), @Result(name = QidianLayoutAction.JUMP_DEVICE_LAYOUT, location = "qidian-layout.action?deviceId=${deviceId}", type = "redirect") })
public class QidianLayoutAction extends CrudActionSupport<QidianLayout> {
	private static final long serialVersionUID = -8433573422878774868L;
	public static final String JUMP_DEVICE_LAYOUT = "jumpDeviceLayout";
	private Long id;
	private Long deviceId;
	private QidianLayout qidianLayout;
	private QidianLayoutManager qidianLayoutManager;
	private QidianCategoryManager qidianCategoryManager;
	private DeviceManager deviceManager;
	private Long categoryId;
	private Page<QidianLayout> page = new Page<QidianLayout>(20);// 每页20条记录

	@Override
	public QidianLayout getModel() {
		return qidianLayout;
	}

	@Override
	public String list() throws Exception {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		if (deviceId != null) {
			filters.add(new PropertyFilter("EQL_device.id", deviceId.toString()));
			// 设置默认排序方式
			if (!page.isOrderBySetted()) {
				page.setOrderBy("positionIndex");
				page.setOrder(Page.ASC);
			}
			page = qidianLayoutManager.find(page, filters);
		}
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			QidianCategory category = qidianCategoryManager.get(categoryId);
			qidianLayout.setCategory(category);
			qidianLayout.setModifyDate(new Date());
			qidianLayoutManager.save(qidianLayout);
			addActionMessage("Save layout successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save layout failed</font>");
		}
		return JUMP_DEVICE_LAYOUT;
	}

	@Override
	public String delete() throws Exception {
		try {
			qidianLayoutManager.deleteQidianLayout(id);
			addActionMessage("Delete qidian layout successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Delete qidian layout failed</font>");
		}
		return JUMP_DEVICE_LAYOUT;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			qidianLayout = new QidianLayout();
			qidianLayout.setCreateDate(new Date());
			qidianLayout.setEnable(true);
		} else {
			qidianLayout = qidianLayoutManager.get(id);
			QidianCategory category = qidianLayout.getCategory();
			categoryId = (category == null ? null : category.getId());
			qidianLayout.setModifyDate(new Date());
		}
		// 添加一个布局时newsLayout的device为null，这里需要查询数据库
		if (qidianLayout.getDevice() == null && deviceId != null) {
			qidianLayout.setDevice(deviceManager.get(deviceId));
		}
	}

	/**
	 * 支持使用Jquery.validate Ajax检验categoryId是否重复.
	 */
	public String checkCategoryId() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String deviceIdStr = request.getParameter("deviceId");
		Long deviceId = null;
		if (deviceIdStr != null && !deviceIdStr.trim().equals("")) {
			try {
				deviceId = Long.parseLong(deviceIdStr);
			} catch (NumberFormatException e) {
			}
		}
		String newCategoryIdStr = request.getParameter("categoryId");
		Long newCategoryId = null;
		if (newCategoryIdStr != null && !newCategoryIdStr.trim().equals("")) {
			try {
				newCategoryId = Long.parseLong(newCategoryIdStr);
			} catch (NumberFormatException e) {
			}
		}
		String oldCategoryIdStr = request.getParameter("oldCategoryId");
		Long oldCategoryId = null;
		if (oldCategoryIdStr != null && !oldCategoryIdStr.trim().equals("")) {
			try {
				oldCategoryId = Long.parseLong(oldCategoryIdStr);
			} catch (NumberFormatException e) {
			}
		}
		if (qidianLayoutManager.isCategoryIdUnique(deviceId, newCategoryId, oldCategoryId))
			Struts2Utils.renderText("true");
		else
			Struts2Utils.renderText("false");
		return null;
	}

	public List<QidianCategory> getQidianCategoryList() {
		return qidianCategoryManager.getAll();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(Long deviceId) {
		this.deviceId = deviceId;
	}

	@Autowired
	public void setQidianLayoutManager(QidianLayoutManager qidianLayoutManager) {
		this.qidianLayoutManager = qidianLayoutManager;
	}

	public QidianCategoryManager getQidianCategoryManager() {
		return qidianCategoryManager;
	}

	@Autowired
	public void setQidianCategoryManager(QidianCategoryManager qidianCategoryManager) {
		this.qidianCategoryManager = qidianCategoryManager;
	}

	public DeviceManager getDeviceManager() {
		return deviceManager;
	}

	@Autowired
	public void setDeviceManager(DeviceManager deviceManager) {
		this.deviceManager = deviceManager;
	}

	public Page<QidianLayout> getPage() {
		return page;
	}

	public void setPage(Page<QidianLayout> page) {
		this.page = page;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
}
