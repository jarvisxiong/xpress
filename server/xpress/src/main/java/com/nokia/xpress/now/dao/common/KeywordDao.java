package com.nokia.xpress.now.dao.common;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.entity.common.Keyword;

@Component
public class KeywordDao extends HibernateDao<Keyword, Long> {
	public Keyword getById(Long id) {
		String hql = "FROM Keyword k WHERE k.id=?";
		return (Keyword) createQuery(hql, id).uniqueResult();
	}

	@SuppressWarnings("unchecked")
	public List<Keyword> getAllByType(int type) {
		String hql = "FROM Keyword k WHERE k.type=?";
		return createQuery(hql, type).list();
	}

	@SuppressWarnings("unchecked")
	public List<Keyword> getAllEnableByType(TypeEnums type) {
		String hql = "FROM Keyword k WHERE k.type=? AND k.enable=?";
		return createQuery(hql, type.getValue(), true).list();
	}

	public boolean isKeywordUnique(Integer type, String newKeyword, String oldKeyword) {
		if (newKeyword == null || newKeyword.equals(oldKeyword))
			return true;
		Object object = findUnique("FROM Keyword k WHERE k.type=? AND k.keyword=?", type, newKeyword);
		return (object == null);
	}
}
