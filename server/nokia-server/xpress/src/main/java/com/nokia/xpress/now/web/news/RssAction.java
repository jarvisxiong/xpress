package com.nokia.xpress.now.web.news;

import java.io.UnsupportedEncodingException;
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

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.util.JquertAjaxUtil;
import com.nokia.xpress.now.entity.news.Rss;
import com.nokia.xpress.now.service.exception.CanNotAddTopLevelRssException;
import com.nokia.xpress.now.service.exception.IllegalParentRssException;
import com.nokia.xpress.now.service.news.RssManager;
import com.nokia.xpress.now.web.CrudActionSupport;

@Namespace("/news")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "rss.action?parentId=${parentId}", type = "redirect") })
public class RssAction extends CrudActionSupport<Rss> {
	private static final long serialVersionUID = -3307317962757505083L;
	private Long id;
	private Rss entity;
	private String name;
	private Long parentId;
	private String parentName;
	private RssManager rssManager;
	private Page<Rss> page = new Page<Rss>(20);// 每页20条记录

	@Override
	public Rss getModel() {
		return entity;
	}

	@Override
	public String list() throws Exception {
		// if ((id != null && !id.equals("")) || (parentId == null && name != null && !name.equals(""))) {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		if (id != null)
			filters.add(new PropertyFilter("EQL_id", id.toString()));
		if (parentId != null) {
			filters.add(new PropertyFilter("EQL_rss.id", parentId.toString()));
			Rss parentRss = rssManager.getById(parentId);
			parentName = parentRss == null ? null : parentRss.getName();
		}
		if (name != null && !name.equals(""))
			filters.add(new PropertyFilter("LIKES_name", name.toString()));
		if (!page.isOrderBySetted()) {
			page.setOrderBy("id");
			page.setOrder(Page.DESC);
		}
		page = rssManager.find(page, filters);
		// } else {
		// long totalCount = rssManager.getAllChildCountWithName(parentId, name);
		// int start = (page.getPageNo() - 1) * page.getPageSize();
		// int limit = page.getPageSize();
		// page.setTotalCount(totalCount);
		// List<Rss> rssList = rssManager.findAllChildWithName(parentId, name, page.getOrderBy(), page.getOrder(), start, limit);
		// page.setResult(rssList);
		// }
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		if (id != null) { // edit
			Rss parentRss = entity.getRss();
			parentName = parentRss == null ? null : parentRss.getName();
		} else { // add
			if (parentId != null) { // add child
				Rss parentRss = rssManager.getById(parentId);
				parentName = parentRss == null ? null : parentRss.getName();
			}
		}
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			if (id == null) {
				entity.setCreateDate(new Date());
				entity.setEnable(true);
				if (parentId != null) {
					Rss parentRss = rssManager.getById(parentId);
					if (parentRss == null)
						throw new IllegalParentRssException("");
					String parentIdPath = parentRss.getPath();
					StringBuilder sb = new StringBuilder();
					if (parentIdPath != null && !parentIdPath.trim().equals("")) {
						sb.append(parentIdPath);
						if (!parentIdPath.endsWith(ProjectConfig.RSS_PATH_SEPARATOR))
							sb.append(ProjectConfig.RSS_PATH_SEPARATOR);
						sb.append(parentRss.getId());
						sb.append(ProjectConfig.RSS_PATH_SEPARATOR);
					} else {
						sb.append(parentRss.getId());
						sb.append(ProjectConfig.RSS_PATH_SEPARATOR);
					}
					entity.setPath(sb.toString());
					entity.setRss(parentRss);
				}
			}
			entity.setName(entity.getName().trim());
			entity.setModifyDate(new Date());
			rssManager.save(entity);
			addActionMessage("Save RSS successfully");
		} catch (CanNotAddTopLevelRssException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Can not add top level Rss</font>");
		} catch (IllegalParentRssException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Illegal parent Rss</font>");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save RSS failed</font>");
		}
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		return RELOAD;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			entity = new Rss();
		} else {
			entity = rssManager.get(id);
		}
	}

	// -- 其他Action函数 --//
	/**
	 * 支持使用Jquery.validate Ajax检验Rss名称是否重复.
	 * 
	 * @throws UnsupportedEncodingException
	 */
	public String checkRss() throws UnsupportedEncodingException {
		HttpServletRequest request = ServletActionContext.getRequest();
		String oldRssName = JquertAjaxUtil.parseText(request.getParameter("oldRssName"));
		String newRssName = JquertAjaxUtil.parseText(request.getParameter("name"));
		String parentIdStr = request.getParameter("parentId");
		Long parentId = null;
		if (parentIdStr != null && !parentIdStr.trim().equals("")) {
			try {
				parentId = Long.parseLong(parentIdStr);
			} catch (NumberFormatException e) {
			}
		}
		if (rssManager.isRssNameUnique(parentId, newRssName, oldRssName))
			Struts2Utils.renderText("true");
		else
			Struts2Utils.renderText("false");
		// 因为直接输出内容而不经过jsp,因此返回null.
		return null;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Autowired
	public void setRssManager(RssManager rssManager) {
		this.rssManager = rssManager;
	}

	public Page<Rss> getPage() {
		return page;
	}

	public void setPage(Page<Rss> page) {
		this.page = page;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}
}
