package com.nokia.xpress.now.web.common;

import java.util.Date;
import java.util.List;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.entity.common.XpressLog;
import com.nokia.xpress.now.service.common.XpressLogManager;
import com.nokia.xpress.now.web.CrudActionSupport;

@Namespace("/log")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "xpress-log.action", type = "redirect") })
public class XpressLogAction extends CrudActionSupport<XpressLog> {
	private static final long serialVersionUID = -1368143837075911062L;
	private Long id;
	private Long userId;
	private Long days;
	private XpressLog xpressLog;
	private XpressLogManager xpressLogManager;
	private Page<XpressLog> page = new Page<XpressLog>(20);// 每页20条记录

	@Override
	public XpressLog getModel() {
		return xpressLog;
	}

	@Override
	public String list() throws Exception {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		if (userId != null)
			filters.add(new PropertyFilter("EQL_user.id", userId.toString()));
		// 设置默认排序方式
		if (!page.isOrderBySetted()) {
			page.setOrderBy("id");
			page.setOrder(Page.DESC);
		}
		page = xpressLogManager.find(page, filters);
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			xpressLog.setOperDate(new Date());
			xpressLogManager.save(xpressLog);
			addActionMessage("Save log successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save log failed</font>");
		}
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		try {
			xpressLogManager.deleteLog(id);
			addActionMessage("Delete log successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Delete log failed</font>");
		}
		return RELOAD;
	}

	public String clean() throws Exception {
		try {
			xpressLogManager.cleanLog(days);
			addActionMessage("Clean log successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Clean log failed</font>");
		}
		return RELOAD;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			xpressLog = new XpressLog();
			xpressLog.setOperDate(new Date());
		} else {
			xpressLog = xpressLogManager.get(id);
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getDays() {
		return days;
	}

	public void setDays(Long days) {
		this.days = days;
	}

	@Autowired
	public void setXpressLogManager(XpressLogManager xpressLogManager) {
		this.xpressLogManager = xpressLogManager;
	}

	public Page<XpressLog> getPage() {
		return page;
	}

	public void setPage(Page<XpressLog> page) {
		this.page = page;
	}
}
