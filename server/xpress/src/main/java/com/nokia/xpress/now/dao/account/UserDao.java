package com.nokia.xpress.now.dao.account;

import org.springframework.stereotype.Component;
import com.nokia.xpress.now.entity.account.User;
import org.springside.modules.orm.hibernate.HibernateDao;

/**
 * 用户对象的泛型DAO类.
 * 
 * @author calvin
 */
@Component
public class UserDao extends HibernateDao<User, Long> {
}
