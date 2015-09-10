package com.nokia.xpress.now.dao.news;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.entity.news.Rss;

@Component
public class RssDao extends HibernateDao<Rss, Long> {
	public int updateChildStateDisable(Rss rss) {
		String hql = "UPDATE xpress_rss SET enable=? WHERE path LIKE '" + (rss.getPath() == null ? "" : rss.getPath()) + rss.getId() + ProjectConfig.RSS_PATH_SEPARATOR + "%'";
		Query query = getSession().createSQLQuery(hql);
		query.setBoolean(0, false);
		return query.executeUpdate();
	}

	public int updateParentStateEnable(Rss rss) {
		if (rss.getPath() != null) {
			String[] idStrs = rss.getPath().split(ProjectConfig.RSS_PATH_SEPARATOR);
			if (idStrs != null && idStrs.length > 0) {
				String hql = "UPDATE xpress_rss SET enable=" + true + " WHERE id IN (";
				for (String idStr : idStrs)
					hql += idStr + ",";
				hql = hql.substring(0, hql.length() - 1);
				hql += ")";
				Query query = getSession().createSQLQuery(hql);
				return query.executeUpdate();
			}
		}
		return 0;
	}

	public Rss getById(Long id) {
		String hql = "FROM Rss r WHERE r.id=?";
		return (Rss) createQuery(hql, id).uniqueResult();
	}

	public int addClickNum(Long rssId) {
		String hql = "UPDATE xpress_rss SET all_click_num=(all_click_num+1) WHERE id=?";
		Query query = getSession().createSQLQuery(hql);
		query.setLong(0, rssId);
		return query.executeUpdate();
	}

	public boolean isRssNameUnique(Long parentId, String newRssName, String oldRssName) {
		if (newRssName == null || newRssName.equals(oldRssName)) {
			return true;
		}
		Object object = null;
		if (parentId == null)
			object = findUnique("FROM Rss r WHERE r.rss.id IS NULL AND r.name=?", newRssName);
		else
			object = findUnique("FROM Rss r WHERE r.rss.id=? AND r.name=?", parentId, newRssName);
		return (object == null);
	}

	public List<Rss> findAllWithState(Boolean state) {
		String hql = "FROM Rss r WHERE r.enable=?";
		return find(hql, state);
	}

	public long getAllChildCount(Long parentId) {
		Query query = null;
		String hql = "SELECT COUNT(*) FROM Rss r WHERE r.rss.id";
		if (parentId != null) {
			hql += " = ?";
			query = createQuery(hql, parentId);
		} else {
			hql += " IS NULL";
			query = createQuery(hql);
		}
		return ((Number) query.uniqueResult()).longValue();
	}

	public long getAllChildCountWithName(Long parentId, String name) {
		Query query = null;
		String hql = "SELECT COUNT(*) FROM Rss r WHERE 1=1";
		if (name != null && !name.equals(""))
			hql += " AND r.name LIKE " + "'" + name + "%'";
		hql += "AND r.rss.id";
		if (parentId != null) {
			hql += "=?";
			query = createQuery(hql, parentId);
		} else {
			hql += " IS NULL";
			query = createQuery(hql);
		}
		return ((Number) query.uniqueResult()).longValue();
	}

	@SuppressWarnings("unchecked")
	public List<Rss> findAllChild(Long parentId, String orderBy, String order, int start, int limit) {
		if (orderBy == null || orderBy.trim().equals(""))
			orderBy = "id";
		if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("desc") && !order.trim().equalsIgnoreCase("asc")))
			order = "desc";
		Query query = null;
		String hql = "FROM Rss r WHERE r.rss.id";
		if (parentId != null) {
			hql += " = ?";
			query = createQuery(hql, parentId);
		} else {
			hql += " IS NULL";
			query = createQuery(hql);
		}
		hql += " ORDER BY r." + orderBy + " " + order;
		query.setFirstResult(start);
		query.setMaxResults(limit);
		return (List<Rss>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Rss> findAllChildWithName(Long parentId, String name, String orderBy, String order, int start, int limit) {
		if (orderBy == null || orderBy.trim().equals(""))
			orderBy = "id";
		if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("desc") && !order.trim().equalsIgnoreCase("asc")))
			order = "desc";
		Query query = null;
		String hql = "FROM Rss r WHERE 1=1";
		if (name != null && !name.equals(""))
			hql += " AND r.name LIKE " + "'" + name + "%'";
		hql += "AND r.rss.id";
		if (parentId != null) {
			hql += " = ?";
			query = createQuery(hql, parentId);
		} else {
			hql += " IS NULL";
			query = createQuery(hql);
		}
		hql += " ORDER BY r." + orderBy + " " + order;
		query.setFirstResult(start);
		query.setMaxResults(limit);
		return (List<Rss>) query.list();
	}
}
