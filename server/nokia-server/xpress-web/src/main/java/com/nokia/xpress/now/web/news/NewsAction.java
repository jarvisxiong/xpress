package com.nokia.xpress.now.web.news;

import java.util.Date;
import java.util.List;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.service.news.NewsManager;
import com.nokia.xpress.now.web.CrudActionSupport;

@Namespace("/news")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "news.action", type = "redirect") })
public class NewsAction extends CrudActionSupport<News> {
	private static final long serialVersionUID = 99407812664651474L;
	private Long id;
	private News news;
	private Long rssId;
	private String title;
	private NewsManager newsManager;
	private Page<News> page = new Page<News>(20);// 每页20条记录

	@Override
	public News getModel() {
		return news;
	}

	@Override
	public String list() throws Exception {
		// if ((rssId == null || rssId.equals("")) || (id != null && !id.equals(""))) {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		if (id != null)
			filters.add(new PropertyFilter("EQL_id", id.toString()));
		if (rssId != null)
			filters.add(new PropertyFilter("EQL_rss.id", rssId.toString()));
		if (title != null)
			filters.add(new PropertyFilter("LIKES_title", title));
		if (!page.isOrderBySetted()) {
			page.setOrderBy("pubDate");
			page.setOrder(Page.DESC);
		}
		page = newsManager.find(page, filters);
		// } else {
		// long totalCount = newsManager.getAllCountWithRssIdAndPath(rssId);
		// int start = (page.getPageNo() - 1) * page.getPageSize();
		// int limit = page.getPageSize();
		// page.setTotalCount(totalCount);
		// if (totalCount > 0)
		// page.setResult(newsManager.findAllWithRssIdAndPath(rssId, page.getOrderBy(), page.getOrder(), start, limit));
		// }
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		// try {
		// news.setModifyDate(new Date());
		// newsManager.save(news);
		// addActionMessage("Save news successfully");
		// } catch (Exception e) {
		// logger.error(e.getMessage(), e);
		// addActionMessage("<font color=\"red\">Save news failed</font>");
		// }
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		// try {
		// newsManager.deleteNews(id);
		// addActionMessage("Delete news successfully");
		// } catch (Exception e) {
		// logger.error(e.getMessage(), e);
		// addActionMessage("<font color=\"red\">Delete news failed</font>");
		// }
		return RELOAD;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			news = new News();
			news.setCreateDate(new Date());
		} else {
			news = newsManager.get(id);
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getRssId() {
		return rssId;
	}

	public void setRssId(Long rssId) {
		this.rssId = rssId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Autowired
	public void setNewsManager(NewsManager newsManager) {
		this.newsManager = newsManager;
	}

	public Page<News> getPage() {
		return page;
	}

	public void setPage(Page<News> page) {
		this.page = page;
	}
}
