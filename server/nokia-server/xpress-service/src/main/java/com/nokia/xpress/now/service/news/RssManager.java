package com.nokia.xpress.now.service.news;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;
import org.springside.modules.security.springsecurity.SpringSecurityUtils;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.dao.news.RssDao;
import com.nokia.xpress.now.entity.news.Rss;
import com.nokia.xpress.now.service.EntityManagement;
import com.nokia.xpress.now.service.exception.CanNotAddTopLevelRssException;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class RssManager extends EntityManagement<Rss, Long> {
	private RssDao rssDao;

	@Override
	protected HibernateDao<Rss, Long> getEntityDao() {
		return rssDao;
	}

	public RssDao getRssDao() {
		return rssDao;
	}

	@Autowired
	public void setRssDao(RssDao rssDao) {
		this.rssDao = rssDao;
	}

	@Override
	public void save(Rss rss) throws Exception {
		if (rss.getId() == null && (rss.getRss() == null || rss.getRss().getId() == null)) {
			logger.warn("操作员{}尝试添加顶级Rss", SpringSecurityUtils.getCurrentUserName());
			throw new CanNotAddTopLevelRssException("不能添加顶级Rss");
		}
		rssDao.save(rss);
		if (rss.getEnable())
			rssDao.updateParentStateEnable(rss);
		else
			rssDao.updateChildStateDisable(rss);
	}

	public boolean addClickNum(Long rssId) {
		int updateResult = rssDao.addClickNum(rssId);
		if (updateResult > 0)
			return true;
		return false;
	}

	@Transactional(readOnly = true)
	public Rss getById(Long id) {
		return rssDao.getById(id);
	}

	@Transactional(readOnly = true)
	public List<Rss> findAllWithState(Boolean state) {
		return rssDao.findAllWithState(state);
	}

	@Transactional(readOnly = true)
	public List<Rss> findAllChild(Long parentId, String orderBy, String order, int start, int limit) {
		return rssDao.findAllChild(parentId, orderBy, order, start, limit);
	}

	@Transactional(readOnly = true)
	public List<Rss> findAllChildWithName(Long parentId, String name, String orderBy, String order, int start, int limit) {
		return rssDao.findAllChildWithName(parentId, name, orderBy, order, start, limit);
	}

	@Transactional(readOnly = true)
	public long getAllChildCount(Long parentId) {
		return rssDao.getAllChildCount(parentId);
	}

	@Transactional(readOnly = true)
	public long getAllChildCountWithName(Long parentId, String name) {
		return rssDao.getAllChildCountWithName(parentId, name);
	}

	/**
	 * 检查同一parentId的Rss名是否唯一.
	 * 
	 * @return loginName在数据库中唯一或等于oldLoginName时返回true.
	 */
	@Transactional(readOnly = true)
	public boolean isRssNameUnique(Long parentId, String newRssName, String oldRssName) {
		return rssDao.isRssNameUnique(parentId, newRssName, oldRssName);
	}

	@Transactional(readOnly = true)
	public Rss getRootRss() {
		Rss rootRss = new Rss();
		rootRss.setEnable(true);
		List<Rss> allRssList = getAll();
		Map<Long, Rss> tmpRssMap = new HashMap<Long, Rss>();
		if (allRssList != null && !allRssList.isEmpty()) {
			for (Rss rss : allRssList)
				tmpRssMap.put(rss.getId(), rss);
			for (Rss rss : allRssList) {
				String rssPath = rss.getPath();
				Rss tmpRootRss = rootRss;
				if (rssPath != null) {
					for (String rssIdStr : rssPath.split(ProjectConfig.RSS_PATH_SEPARATOR)) {
						if (rssIdStr != null && !rssIdStr.trim().equals("")) {
							Long parentRssId = Long.parseLong(rssIdStr);
							if (tmpRootRss.getChildRss(parentRssId) == null)
								tmpRootRss.addChildRss(tmpRssMap.get(parentRssId));
							tmpRootRss = tmpRootRss.getChildRss(parentRssId);
						}
					}
				}
				if (tmpRootRss.getChildRss(rss.getId()) == null)
					tmpRootRss.addChildRss(rss);
			}
		}
		return rootRss;
	}

	@Transactional(readOnly = true)
	public void parseToList(Rss rootRss, List<Rss> list, String prefix) {
		if (rootRss != null) {
			Map<Long, Rss> childRss = rootRss.getChildRss();
			if (childRss != null && !childRss.isEmpty()) {
				Iterator<Entry<Long, Rss>> iterator = childRss.entrySet().iterator();
				while (iterator.hasNext()) {
					Rss rss = iterator.next().getValue();
					if (rss.getEnable()) {
						rss.setName(prefix + rss.getName());
						list.add(rss);
						parseToList(rss, list, prefix + "\u3000\u3000");
					}
				}
			}
		}
	}

	public void printRssTree(Rss rootRss, String prefix) {
		if (rootRss != null) {
			Map<Long, Rss> childRss = rootRss.getChildRss();
			if (childRss != null && !childRss.isEmpty()) {
				Iterator<Entry<Long, Rss>> iterator = childRss.entrySet().iterator();
				while (iterator.hasNext()) {
					Rss rss = iterator.next().getValue();
					if (rss.getEnable()) {
						System.out.println(prefix + rss.getName());
						printRssTree(rss, prefix + "   ");
					}
				}
			}
		}
	}
}
