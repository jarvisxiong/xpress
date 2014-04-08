package com.nokia.xpress.now.web.news;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.entity.news.NewsLayout;
import com.nokia.xpress.now.entity.news.Rss;
import com.nokia.xpress.now.service.common.DeviceManager;
import com.nokia.xpress.now.service.news.NewsLayoutManager;
import com.nokia.xpress.now.service.news.RssManager;
import com.nokia.xpress.now.web.CrudActionSupport;

@Namespace("/news")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "news-layout.action", type = "redirect"), @Result(name = NewsLayoutAction.JUMP_DEVICE_LAYOUT, location = "news-layout.action?deviceId=${deviceId}", type = "redirect") })
public class NewsLayoutAction extends CrudActionSupport<NewsLayout> {
	private static final long serialVersionUID = -4852831295534162465L;
	public static final String JUMP_DEVICE_LAYOUT = "jumpDeviceLayout";
	private Long id;
	private Long deviceId;
	private NewsLayout newsLayout;
	private NewsLayoutManager newsLayoutManager;
	private RssManager rssManager;
	private DeviceManager deviceManager;
	private Long rssId;
	private Page<NewsLayout> page = new Page<NewsLayout>(20);// 每页20条记录

	@Override
	public NewsLayout getModel() {
		return newsLayout;
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
			page = newsLayoutManager.find(page, filters);
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
			Rss rss = rssManager.get(rssId);
			newsLayout.setRss(rss);
			newsLayout.setModifyDate(new Date());
			newsLayoutManager.save(newsLayout);
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
			newsLayoutManager.deleteNewsLayout(id);
			addActionMessage("Delete news layout successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Delete news layout failed</font>");
		}
		return JUMP_DEVICE_LAYOUT;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			newsLayout = new NewsLayout();
			newsLayout.setCreateDate(new Date());
			newsLayout.setEnable(true);
		} else {
			newsLayout = newsLayoutManager.get(id);
			Rss rss = newsLayout.getRss();
			rssId = (rss == null ? null : rss.getId());
		}
		// 添加一个布局时newsLayout的device为null，这里需要查询数据库
		if (newsLayout.getDevice() == null && deviceId != null)
			newsLayout.setDevice(deviceManager.get(deviceId));
	}

	public List<Rss> getNewsRssList() {
		List<Rss> newsRssList = new ArrayList<Rss>();
		Rss rootRss = rssManager.getRootRss();
		rssManager.parseToList(rootRss, newsRssList, "");
		return newsRssList;
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
	public void setNewsLayoutManager(NewsLayoutManager newsLayoutManager) {
		this.newsLayoutManager = newsLayoutManager;
	}

	public RssManager getRssManager() {
		return rssManager;
	}

	@Autowired
	public void setRssManager(RssManager rssManager) {
		this.rssManager = rssManager;
	}

	public DeviceManager getDeviceManager() {
		return deviceManager;
	}

	@Autowired
	public void setDeviceManager(DeviceManager deviceManager) {
		this.deviceManager = deviceManager;
	}

	public Page<NewsLayout> getPage() {
		return page;
	}

	public void setPage(Page<NewsLayout> page) {
		this.page = page;
	}

	public Long getRssId() {
		return rssId;
	}

	public void setRssId(Long rssId) {
		this.rssId = rssId;
	}
}
