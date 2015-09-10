package com.nokia.xpress.now.dao.reading;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.entity.reading.QidianBook;

@Component
public class QidianBookDao extends HibernateDao<QidianBook, Long> {
	public QidianBook getById(Long id) {
		String hql = "FROM QidianBook b WHERE b.id=?";
		return (QidianBook) createQuery(hql, id).uniqueResult();
	}

	public QidianBook getByBookIdAndType(Long bookId, Integer type) {
		String hql = "FROM QidianBook b WHERE b.bookId=? AND b.type=?";
		return (QidianBook) createQuery(hql, bookId, type).uniqueResult();
	}

	public long getCountByCid(Long cid) {
		String hql = "SELECT COUNT(*) FROM QidianBook b WHERE b.category.id=?";
		Query query = createQuery(hql, cid);
		return ((Number) query.uniqueResult()).longValue();
	}

	@SuppressWarnings("unchecked")
	public List<Long> findAllId(String orderBy, String order) {
		if (orderBy == null || orderBy.trim().equals(""))
			orderBy = "id";
		if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("DESC") && !order.trim().equalsIgnoreCase("ASC")))
			order = "ASC";
		String hql = "SELECT b.id FROM QidianBook b ORDER BY b." + orderBy + " " + order;
		return (List<Long>) createQuery(hql).list();
	}

	@SuppressWarnings("unchecked")
	public List<QidianBook> findAllByCid(Long cid, String orderBy, String order, int start, int limit) {
		if (orderBy == null || orderBy.trim().equals(""))
			orderBy = "voteMonth";
		if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("DESC") && !order.trim().equalsIgnoreCase("ASC")))
			order = "DESC";
		String hql = "FROM QidianBook b WHERE b.category.id=? ORDER BY b." + orderBy + " " + order;
		Query query = createQuery(hql, cid);
		query.setFirstResult(start);
		query.setMaxResults(limit);
		return (List<QidianBook>) query.list();
	}

	public QidianBook findTopByRecommend(Device device) {
		if (device != null) {
			String hql = "FROM QidianBook b WHERE b.category.id IN (SELECT ql.category.id FROM QidianLayout ql WHERE ql.device.id=? AND ql.enable=?) ORDER BY b.recommend DESC,b.voteMonth DESC";
			Query query = createQuery(hql, device.getId(), true);
			query.setFirstResult(0);
			query.setMaxResults(1);
			return (QidianBook) query.uniqueResult();
		}
		return null;
	}

	public QidianBook findTopByVoteMonth(Device device) {
		if (device != null) {
			String hql = "FROM QidianBook b WHERE b.category.id IN (SELECT ql.category.id FROM QidianLayout ql WHERE ql.device.id=? AND ql.enable=?) ORDER BY b.voteMonth DESC";
			Query query = createQuery(hql, device.getId(), true);
			query.setFirstResult(0);
			query.setMaxResults(1);
			return (QidianBook) query.uniqueResult();
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	public List<QidianBook> findTopByVoteMonth(Device device, String orderBy, String order) {
		if (device != null) {
			if (orderBy == null || orderBy.trim().equals(""))
				orderBy = "voteMonth";
			if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("DESC") && !order.trim().equalsIgnoreCase("ASC")))
				order = "DESC";
			String hql = "FROM QidianBook b1 WHERE NOT EXISTS (SELECT 1 FROM QidianBook b2 WHERE b2.category.id=b1.category.id AND b2.voteMonth>b1.voteMonth) AND b1.category.id IN (SELECT ql.category.id FROM QidianLayout ql WHERE ql.device.id=? AND ql.enable=?) ORDER BY b1." + orderBy + " " + order;
			// if (categoryIds != null && categoryIds.length > 0) {
			// StringBuffer inStrBuffer = new StringBuffer(" AND b1.category.id IN (");
			// for (Long cid : categoryIds)
			// inStrBuffer.append(cid).append(",");
			// hql += inStrBuffer.substring(0, inStrBuffer.length() - 1) + ")";
			// }
			hql += " ORDER BY b1." + orderBy + " " + order;
			Query query = createQuery(hql, device.getId(), true);
			return (List<QidianBook>) query.list();
		}
		return new ArrayList<QidianBook>();
	}
}
