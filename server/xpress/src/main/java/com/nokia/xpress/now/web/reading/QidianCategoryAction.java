package com.nokia.xpress.now.web.reading;

import java.util.Date;
import java.util.List;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.entity.reading.QidianCategory;
import com.nokia.xpress.now.service.reading.QidianCategoryManager;
import com.nokia.xpress.now.web.CrudActionSupport;

@Namespace("/reading")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "qidian-category.action", type = "redirect") })
public class QidianCategoryAction extends CrudActionSupport<QidianCategory> {
	private static final long serialVersionUID = 99407812664651474L;
	private Long id;
	private QidianCategory category;
	private String name;
	private QidianCategoryManager qidianCategoryManager;
	private Page<QidianCategory> page = new Page<QidianCategory>(20);// 每页20条记录

	@Override
	public QidianCategory getModel() {
		return category;
	}

	@Override
	public String list() throws Exception {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		if (id != null)
			filters.add(new PropertyFilter("EQL_id", id.toString()));
		if (name != null)
			filters.add(new PropertyFilter("LIKES_name", name));
		if (!page.isOrderBySetted()) {
			page.setOrderBy("id");
			page.setOrder(Page.ASC);
		}
		page = qidianCategoryManager.find(page, filters);
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		// try {
		// qidianCategory.setModifyDate(new Date());
		// qidianCategoryManager.save(qidianCategory);
		// addActionMessage("Save qidian book successfully");
		// } catch (Exception e) {
		// logger.error(e.getMessage(), e);
		// addActionMessage("<font color=\"red\">Save qidian book failed</font>");
		// }
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		// try {
		// qidianCategoryManager.delete(id);
		// addActionMessage("Delete qidian book successfully");
		// } catch (Exception e) {
		// logger.error(e.getMessage(), e);
		// addActionMessage("<font color=\"red\">Delete qidian book failed</font>");
		// }
		return RELOAD;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			category = new QidianCategory();
			category.setCreateDate(new Date());
		} else
			category = qidianCategoryManager.get(id);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Autowired
	public void setQidianCategoryManager(QidianCategoryManager qidianCategoryManager) {
		this.qidianCategoryManager = qidianCategoryManager;
	}

	public Page<QidianCategory> getPage() {
		return page;
	}

	public void setPage(Page<QidianCategory> page) {
		this.page = page;
	}
}
