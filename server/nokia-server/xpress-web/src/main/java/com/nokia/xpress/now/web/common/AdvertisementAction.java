package com.nokia.xpress.now.web.common;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.entity.common.Advertisement;
import com.nokia.xpress.now.service.common.AdvertisementManager;
import com.nokia.xpress.now.web.CrudActionSupport;

public class AdvertisementAction extends CrudActionSupport<Advertisement> {
	private static final long serialVersionUID = 3732044164612649847L;
	protected Long id;
	protected Integer type;
	protected Advertisement advertisement;
	protected AdvertisementManager advertisementManager;
	protected Page<Advertisement> page = new Page<Advertisement>(20);// 每页20条记录

	@Override
	public Advertisement getModel() {
		return advertisement;
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
		page = advertisementManager.find(page, filters);
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			advertisement.setModifyDate(new Date());
			advertisementManager.save(advertisement);
			addActionMessage("Save advertisement successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save advertisement failed</font>");
		}
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		try {
			advertisementManager.deleteAdvertisement(id);
			addActionMessage("Delete advertisement successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Delete advertisement failed</font>");
		}
		return RELOAD;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			advertisement = new Advertisement();
			advertisement.setType(type);
			advertisement.setCreateDate(new Date());
		} else
			advertisement = advertisementManager.get(id);
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

	@Autowired
	public void setAdvertisementManager(AdvertisementManager advertisementManager) {
		this.advertisementManager = advertisementManager;
	}

	public Page<Advertisement> getPage() {
		return page;
	}

	public void setPage(Page<Advertisement> page) {
		this.page = page;
	}
}
