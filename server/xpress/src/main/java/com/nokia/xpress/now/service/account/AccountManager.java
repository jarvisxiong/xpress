package com.nokia.xpress.now.service.account;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.security.springsecurity.SpringSecurityUtils;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.dao.account.AuthorityDao;
import com.nokia.xpress.now.dao.account.RoleDao;
import com.nokia.xpress.now.dao.account.UserDao;
import com.nokia.xpress.now.entity.account.Authority;
import com.nokia.xpress.now.entity.account.Role;
import com.nokia.xpress.now.entity.account.User;
import com.nokia.xpress.now.service.exception.CanNotDeleteSelfUserException;
import com.nokia.xpress.now.service.exception.CanNotModifyRoleOfSelfException;
import com.nokia.xpress.now.service.exception.CanNotOperSuperRoleException;
import com.nokia.xpress.now.service.exception.CanNotOperSuperUserException;
import com.nokia.xpress.now.service.exception.CanNotUncheckSuperUserRootRoleException;

/**
 * 安全相关实体的管理类, 包括用户,角色,资源与授权类.
 * 
 * @author calvin
 */
// Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class AccountManager {

	private static Logger logger = LoggerFactory.getLogger(AccountManager.class);

	private UserDao userDao;
	private RoleDao roleDao;
	private AuthorityDao authorityDao;

	// -- User Manager --//
	@Transactional(readOnly = true)
	public User getUser(Long id) {
		return userDao.get(id);
	}

	public void saveUser(User entity) {
		if (entity.getId() != null) {
			User currentLoginUser = findUserByLoginName(SpringSecurityUtils.getCurrentUserName());
			if ((entity.getId() != ProjectConfig.ROOT_USER_ID && entity.getId() == currentLoginUser.getId()) && (!currentLoginUser.getRoleIds().equals(entity.getRoleIds()))) {
				logger.warn("操作员{}尝试修改自己的角色", SpringSecurityUtils.getCurrentUserName());
				throw new CanNotModifyRoleOfSelfException("不能修改用户自己的角色");
			} else if (entity.getId() != null && entity.getId() == ProjectConfig.ROOT_USER_ID && (entity.getRoleIds().size() < 1 || !entity.getRoleIds().contains(ProjectConfig.ROOT_ROLE_ID))) {
				logger.warn("操作员{}尝试取消超级管理员的root角色", SpringSecurityUtils.getCurrentUserName());
				throw new CanNotUncheckSuperUserRootRoleException("不能取消超级管理员的root角色");
			}
		}
		userDao.save(entity);
	}

	/**
	 * 删除用户,如果尝试删除超级管理员将抛出异常.
	 */
	public void deleteUser(Long id) {
		if (isSupervisor(id)) {
			logger.warn("操作员{}尝试删除超级管理员用户", SpringSecurityUtils.getCurrentUserName());
			throw new CanNotOperSuperUserException("不能删除超级管理员用户");
		}
		User user = userDao.get(id);
		if (user != null && user.getLoginName().equals(SpringSecurityUtils.getCurrentUserName())) {
			logger.warn("操作员{}尝试删除自己", SpringSecurityUtils.getCurrentUserName());
			throw new CanNotDeleteSelfUserException("不能删除自己");
		}
		userDao.delete(id);
	}

	/**
	 * 判断是否超级管理员.
	 */
	private boolean isSupervisor(Long id) {
		return id == 1;
	}

	/**
	 * 使用属性过滤条件查询用户.
	 */
	@Transactional(readOnly = true)
	public Page<User> searchUser(final Page<User> page, final List<PropertyFilter> filters) {
		return userDao.findPage(page, filters);
	}

	@Transactional(readOnly = true)
	public User findUserByLoginName(String loginName) {
		return userDao.findUniqueBy("loginName", loginName);
	}

	/**
	 * 检查登陆名是否唯一.
	 * 
	 * @return loginName在数据库中唯一或等于oldLoginName时返回true.
	 */
	@Transactional(readOnly = true)
	public boolean isLoginNameUnique(String newLoginName, String oldLoginName) {
		return userDao.isPropertyUnique("loginName", newLoginName, oldLoginName);
	}

	/**
	 * 检查角色名是否唯一.
	 * 
	 * @return name在数据库中唯一或等于oldRoleName时返回true.
	 */
	@Transactional(readOnly = true)
	public boolean isRoleNameUnique(String newRoleName, String oldRoleName) {
		return roleDao.isPropertyUnique("name", newRoleName, oldRoleName);
	}

	// -- Role Manager --//
	@Transactional(readOnly = true)
	public Role getRole(Long id) {
		return roleDao.get(id);
	}

	@Transactional(readOnly = true)
	public List<Role> getAllRole() {
		return roleDao.getAll("id", true);
	}

	public void saveRole(Role entity) {
		if (entity.getId() != null && entity.getId() == 1) {
			logger.warn("操作员{}尝试修改超级管理员角色的权限", SpringSecurityUtils.getCurrentUserName());
			throw new CanNotOperSuperRoleException("不能修改超级管理员角色的权限");
		}
		roleDao.save(entity);
	}

	public void deleteRole(Long id) {
		if (id == 1) {
			logger.warn("操作员{}尝试删除超级管理员角色", SpringSecurityUtils.getCurrentUserName());
			throw new CanNotOperSuperRoleException("不能删除超级管理员角色");
		}
		roleDao.delete(id);
	}

	// -- Authority Manager --//
	@Transactional(readOnly = true)
	public List<Authority> getAllAuthority() {
		return authorityDao.getAll();
	}

	@Autowired
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	@Autowired
	public void setRoleDao(RoleDao roleDao) {
		this.roleDao = roleDao;
	}

	@Autowired
	public void setAuthorityDao(AuthorityDao authorityDao) {
		this.authorityDao = authorityDao;
	}
}
