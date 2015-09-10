package com.nokia.xpress.now.service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.hibernate.Criteria;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.orm.hibernate.HibernateDao;

/**
 * 领域对象业务管理类基类.
 * 
 * @param <T>
 *            领域对象类型
 * @param <PK>
 *            领域对象的主键类型
 * 
 *            eg. public class UserManager extends EntityManager<User, Long>{ }
 * 
 * @author calvin
 */
@Transactional
public abstract class EntityManagement<T, PK extends Serializable> {
	protected Logger logger = LoggerFactory.getLogger(getClass());

	protected abstract HibernateDao<T, PK> getEntityDao();

	// CRUD函数 //

	@Transactional(readOnly = true)
	public T get(final PK id) {
		return getEntityDao().get(id);
	}

	@Transactional(readOnly = true)
	public Page<T> getAll(final Page<T> page) {
		return getEntityDao().getAll(page);
	}

	@Transactional(readOnly = true)
	public Page<T> find(Page<T> page) {
		return getEntityDao().findPage(page, new ArrayList<PropertyFilter>());
	}

	@Transactional(readOnly = true)
	public Page<T> find(Page<T> page, List<PropertyFilter> list) {
		return getEntityDao().findPage(page, list);
	}

	@Transactional(readOnly = true)
	public List<T> find(List<PropertyFilter> list) {
		return getEntityDao().find(list);
	}

	@Transactional(readOnly = true)
	public List<T> getAll() {
		return getEntityDao().getAll();
	}

	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true)
	public List<T> getAll(boolean cache) throws Exception {
		if (cache) {
			Criteria criteria = getEntityDao().createCriteria();
			criteria.setCacheable(true);
			return criteria.list();
		} else
			return getEntityDao().getAll();
	}

	public void save(final T entity) throws Exception {
		getEntityDao().save(entity);
	}

	public void delete(final PK id) throws Exception {
		getEntityDao().delete(id);
	}

	public void delete(final Collection<PK> ids) throws Exception {
		for (PK id : ids) {
			getEntityDao().delete(id);
		}
	}

}