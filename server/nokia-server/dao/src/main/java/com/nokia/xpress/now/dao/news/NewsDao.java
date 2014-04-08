package com.nokia.xpress.now.dao.news;

import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.entity.news.Rss;

@Component
public class NewsDao extends HibernateDao<News, Long> {
	public News getById(Long id) {
		String hql = "FROM News n WHERE n.id=?";
		return (News) createQuery(hql, id).uniqueResult();
	}

	public long getCountByRss(Rss rss) {
		String hql = "SELECT COUNT(*) FROM News n WHERE n.rss.id=?";
		Query query = createQuery(hql, rss.getId());
		return ((Number) query.uniqueResult()).longValue();
	}

	@SuppressWarnings("unchecked")
	public List<Long> findAllId(String orderBy, String order) {
		if (orderBy == null || orderBy.trim().equals(""))
			orderBy = "id";
		if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("DESC") && !order.trim().equalsIgnoreCase("ASC")))
			order = "ASC";
		String hql = "SELECT n.id FROM News n ORDER BY n." + orderBy + " " + order;
		return (List<Long>) createQuery(hql).list();
	}

	public int cleanNewsByRss(Rss rss) {
		String hql = "SELECT COUNT(*) FROM News n WHERE n.rss.id=?";
		Query query = createQuery(hql, rss.getId());
		long count = ((Number) query.uniqueResult()).longValue();
		int newsReaminCount = ProjectConfig.getNewsRemainNum();
		if (count > newsReaminCount) {
			// hql = "DELETE FROM News n WHERE n.rss.id=? ORDER BY n.pubDate LIMIT ?";
			hql = "DELETE FROM xpress_news WHERE rss_id=? ORDER BY pub_date LIMIT ?";
			query = getSession().createSQLQuery(hql);
			query.setLong(0, rss.getId());
			query.setLong(1, count - newsReaminCount);
			return query.executeUpdate();
		}
		return 0;
	}

	public long getAllCountWithRssIdAndPath(Long rssId, String rssPath) {
		if (rssPath == null)
			rssPath = "";
		String hql = "SELECT COUNT(*) FROM News n WHERE CONCAT(IFNULL(n.rss.path,''),n.rss.id,'" + ProjectConfig.RSS_PATH_SEPARATOR + "') LIKE '" + rssPath + rssId + ProjectConfig.RSS_PATH_SEPARATOR + "%'";
		Query query = createQuery(hql);
		return ((Number) query.uniqueResult()).longValue();
	}

	@SuppressWarnings("unchecked")
	public List<News> findAllByRssId(Long rssId, String orderBy, String order, int start, int limit) {
		if (orderBy == null || orderBy.trim().equals(""))
			orderBy = "pubDate";
		if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("DESC") && !order.trim().equalsIgnoreCase("ASC")))
			order = "DESC";
		String hql = "FROM News n WHERE n.rss.id=? ORDER BY n." + orderBy + " " + order;
		Query query = createQuery(hql, rssId);
		query.setFirstResult(start);
		query.setMaxResults(limit);
		return query.list();
	}

	@SuppressWarnings("unchecked")
	public List<News> findAllWithRssIdAndPath(Long rssId, String rssPath, String orderBy, String order, int start, int limit) {
		Query query = null;
		// if (rssPath != null && !rssPath.trim().equals("")) {
		// String hql = null;
		// if (rssPath.endsWith(RSSUtil.RSS_PATH_SEPARATOR))
		// hql = "FROM News n WHERE n.rssPath LIKE '" + rssPath + rssId + RSSUtil.RSS_PATH_SEPARATOR + "%' AND n.enable=? ORDER BY n.pubDate";
		// else
		// hql = "FROM News n WHERE n.rssPath LIKE '" + rssPath + RSSUtil.RSS_PATH_SEPARATOR + rssId + RSSUtil.RSS_PATH_SEPARATOR + "%' AND n.enable=? ORDER BY n.pubDate";
		// query = createQuery(hql, StateEnums.STATE_ENABLE.getValue());
		// } else {
		// String hql = "FROM News n WHERE (n.rss.id=? OR n.rss.path LIKE '" + rssId + RSSUtil.RSS_PATH_SEPARATOR + "%') AND n.enable=? ORDER BY n.pubDate";
		// query = createQuery(hql, rssId, StateEnums.STATE_ENABLE.getValue());
		// }
		// String hql = "FROM News n WHERE (CONCAT(n.rss.path,'" + rssId +RSSUtil.RSS_PATH_SEPARATOR+ "') LIKE CONCAT(n.rss.path,'" + rssId +RSSUtil.RSS_PATH_SEPARATOR+ "%')" +
		// ") AND n.rss.enable=? ORDER BY n.pubDate";
		if (rssPath == null)
			rssPath = "";
		if (orderBy == null || orderBy.trim().equals(""))
			orderBy = "pubDate";
		if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("DESC") && !order.trim().equalsIgnoreCase("ASC")))
			order = "DESC";
		String hql = "FROM News n WHERE CONCAT(IFNULL(n.rss.path,''),n.rss.id,'" + ProjectConfig.RSS_PATH_SEPARATOR + "') LIKE '" + rssPath + rssId + ProjectConfig.RSS_PATH_SEPARATOR + "%' AND n.rss.enable=? ORDER BY n." + orderBy + " " + order;
		query = createQuery(hql, true);
		query.setFirstResult(start);
		query.setMaxResults(limit);
		return (List<News>) query.list();
	}

	public long getNewsCount(Long rssId, Date pubDate, String title) {
		String hql = "SELECT COUNT(*) FROM News n WHERE n.rss.id=? AND n.pubDate=? AND n.title=?";
		Query query = createQuery(hql, rssId, pubDate, title);
		return ((Number) query.uniqueResult()).longValue();
	}
}
