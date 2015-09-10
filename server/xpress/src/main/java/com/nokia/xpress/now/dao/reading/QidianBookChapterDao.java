package com.nokia.xpress.now.dao.reading;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.entity.reading.QidianBookChapter;

@Component
public class QidianBookChapterDao extends HibernateDao<QidianBookChapter, Long> {
	public QidianBookChapter getById(Long id) {
		String hql = "FROM QidianBookChapter bc WHERE bc.id=?";
		return (QidianBookChapter) createQuery(hql, id).uniqueResult();
	}

	public QidianBookChapter getByChapterIdAndType(Long chapterId, Integer type) {
		String hql = "FROM QidianBookChapter bc WHERE bc.chapterId=? AND bc.type=?";
		return (QidianBookChapter) createQuery(hql, chapterId, type).uniqueResult();
	}

	public QidianBookChapter getMaxIdBookChapterByBid(Long bid) {
		String hql = "FROM QidianBookChapter bc WHERE bc.book.id=? ORDER BY bc.id DESC LIMIT 1";
		Query query = createQuery(hql, bid);
		query.setMaxResults(1);
		return (QidianBookChapter) query.uniqueResult();
	}

	public long getCountByBid(long bid) {
		String hql = "SELECT COUNT(*) FROM QidianBookChapter bc WHERE bc.book.id=?";
		Query query = createQuery(hql, bid);
		return ((Number) query.uniqueResult()).longValue();
	}

	@SuppressWarnings("unchecked")
	public List<QidianBookChapter> findAllByBid(long bid, String orderBy, String order, int start, int limit) {
		if (orderBy == null || orderBy.trim().equals(""))
			orderBy = "id";
		if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("DESC") && !order.trim().equalsIgnoreCase("ASC")))
			order = "ASC";
		String hql = "SELECT new QidianBookChapter(id,type,bookId,chapterId,name,url,free,price,createDate,modifyDate,enable) FROM QidianBookChapter bc WHERE bc.book.id=? ORDER BY bc." + orderBy + " " + order;
		Query query = createQuery(hql, bid);
		query.setFirstResult(start);
		query.setMaxResults(limit);
		return (List<QidianBookChapter>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Long> findAllIdByBid(long bid, String orderBy, String order) {
		if (orderBy == null || orderBy.trim().equals(""))
			orderBy = "id";
		if (order == null || order.trim().equals("") || (!order.trim().equalsIgnoreCase("DESC") && !order.trim().equalsIgnoreCase("ASC")))
			order = "ASC";
		String hql = "SELECT bc.id FROM QidianBookChapter bc WHERE bc.book.id=? ORDER BY bc." + orderBy + " " + order;
		Query query = createQuery(hql, bid);
		return (List<Long>) query.list();
	}
}
