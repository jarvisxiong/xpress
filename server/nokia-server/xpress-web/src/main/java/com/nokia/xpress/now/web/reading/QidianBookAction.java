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

import com.nokia.xpress.now.entity.reading.QidianBook;
import com.nokia.xpress.now.service.reading.QidianBookManager;
import com.nokia.xpress.now.web.CrudActionSupport;

@Namespace("/reading")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "qidian-book.action", type = "redirect") })
public class QidianBookAction extends CrudActionSupport<QidianBook> {
	private static final long serialVersionUID = 99407812664651474L;
	private Long id;
	private QidianBook book;
	private Long categoryId;
	private String name;
	private QidianBookManager qidianBookManager;
	private Page<QidianBook> page = new Page<QidianBook>(20);// 每页20条记录

	@Override
	public QidianBook getModel() {
		return book;
	}

	@Override
	public String list() throws Exception {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		if (id != null)
			filters.add(new PropertyFilter("EQL_id", id.toString()));
		if (categoryId != null)
			filters.add(new PropertyFilter("EQL_category.id", categoryId.toString()));
		if (name != null)
			filters.add(new PropertyFilter("LIKES_name", name));
		if (!page.isOrderBySetted()) {
			page.setOrderBy("voteMonth");
			page.setOrder(Page.DESC);
		}
		page = qidianBookManager.find(page, filters);
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			book.setModifyDate(new Date());
			qidianBookManager.save(book);
			addActionMessage("Save book successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save book failed</font>");
		}
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		// try {
		// qidianBookManager.delete(id);
		// addActionMessage("Delete book successfully");
		// } catch (Exception e) {
		// logger.error(e.getMessage(), e);
		// addActionMessage("<font color=\"red\">Delete book failed</font>");
		// }
		return RELOAD;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			book = new QidianBook();
			book.setCreateDate(new Date());
		} else {
			book = qidianBookManager.get(id);
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Autowired
	public void setQidianBookManager(QidianBookManager qidianBookManager) {
		this.qidianBookManager = qidianBookManager;
	}

	public Page<QidianBook> getPage() {
		return page;
	}

	public void setPage(Page<QidianBook> page) {
		this.page = page;
	}
}
