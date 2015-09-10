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

import com.nokia.xpress.now.entity.reading.QidianBookChapter;
import com.nokia.xpress.now.service.reading.QidianBookChapterManager;
import com.nokia.xpress.now.web.CrudActionSupport;

@Namespace("/reading")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "qidian-book-chapter.action", type = "redirect") })
public class QidianBookChapterAction extends CrudActionSupport<QidianBookChapter> {
	private static final long serialVersionUID = 99407812664651474L;
	private Long id;
	private QidianBookChapter chapter;
	private Long bookId;
	private String name;
	private QidianBookChapterManager qidianBookChapterManager;
	private Page<QidianBookChapter> page = new Page<QidianBookChapter>(20);// 每页20条记录

	@Override
	public QidianBookChapter getModel() {
		return chapter;
	}

	@Override
	public String list() throws Exception {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		if (id != null)
			filters.add(new PropertyFilter("EQL_id", id.toString()));
		if (bookId != null)
			filters.add(new PropertyFilter("EQL_book.id", bookId.toString()));
		if (name != null)
			filters.add(new PropertyFilter("LIKES_name", name));
		if (!page.isOrderBySetted()) {
			page.setOrderBy("chapterId");
			page.setOrder(Page.ASC);
		}
		page = qidianBookChapterManager.find(page, filters);
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		// try {
		// chapter.setModifyDate(new Date());
		// qidianBookChapterManager.save(chapter);
		// addActionMessage("Save chapter successfully");
		// } catch (Exception e) {
		// logger.error(e.getMessage(), e);
		// addActionMessage("<font color=\"red\">Save chapter failed</font>");
		// }
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		// try {
		// qidianBookChapterManager.delete(id);
		// addActionMessage("Delete chapter successfully");
		// } catch (Exception e) {
		// logger.error(e.getMessage(), e);
		// addActionMessage("<font color=\"red\">Delete chapter failed</font>");
		// }
		return RELOAD;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			chapter = new QidianBookChapter();
			chapter.setCreateDate(new Date());
		} else {
			chapter = qidianBookChapterManager.get(id);
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getBookId() {
		return bookId;
	}

	public void setBookId(Long bookId) {
		this.bookId = bookId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Autowired
	public void setQidianBookChapterManager(QidianBookChapterManager qidianBookChapterManager) {
		this.qidianBookChapterManager = qidianBookChapterManager;
	}

	public Page<QidianBookChapter> getPage() {
		return page;
	}

	public void setPage(Page<QidianBookChapter> page) {
		this.page = page;
	}
}
