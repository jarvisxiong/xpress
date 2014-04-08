package com.nokia.xpress.now.web.account;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.security.springsecurity.SpringSecurityUtils;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.common.util.JquertAjaxUtil;
import com.nokia.xpress.now.dao.HibernateUtils;
import com.nokia.xpress.now.entity.account.Role;
import com.nokia.xpress.now.entity.account.User;
import com.nokia.xpress.now.service.account.AccountManager;
import com.nokia.xpress.now.service.exception.CanNotDeleteSelfUserException;
import com.nokia.xpress.now.service.exception.CanNotModifyRoleOfSelfException;
import com.nokia.xpress.now.service.exception.CanNotOperSuperUserException;
import com.nokia.xpress.now.service.exception.CanNotUncheckSuperUserRootRoleException;
import com.nokia.xpress.now.web.CrudActionSupport;

/**
 * 用户管理Action.
 * 
 * 使用Struts2 convention-plugin annotation定义Action参数. 演示带分页的管理界面.
 * 
 * @author calvin
 */
// 定义URL映射对应/account/user.action
@Namespace("/account")
// 定义名为reload的result重定向到user.action, 其他result则按照convention默认.
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "user.action", type = "redirect"), @Result(name = UserAction.HOME, location = "/home.action", type = "redirect") })
public class UserAction extends CrudActionSupport<User> {
	private static final long serialVersionUID = 8683878162525847072L;
	public static final String CHANGE = "change";
	public static final String HOME = "home";
	private AccountManager accountManager;
	private Long id;
	private User entity;
	private Page<User> page = new Page<User>(20);// 每页20条记录
	private List<Long> checkedRoleIds; // 页面中钩选的角色id列表

	// -- ModelDriven 与 Preparable函数 --//
	public void setId(Long id) {
		this.id = id;
	}

	public User getModel() {
		return entity;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id != null) {
			entity = accountManager.getUser(id);
		} else {
			entity = new User();
		}
	}

	// -- CRUD Action 函数 --//
	@Override
	public String list() throws Exception {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		// 设置默认排序方式
		if (!page.isOrderBySetted()) {
			page.setOrderBy("id");
			page.setOrder(Page.ASC);
		}
		page = accountManager.searchUser(page, filters);
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		checkedRoleIds = entity.getRoleIds();
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			// 根据页面上的checkbox选择 整合User的Roles Set
			HibernateUtils.mergeByCheckedIds(entity.getRoleList(), checkedRoleIds, Role.class);
			entity.setLoginName(entity.getLoginName().trim());
			entity.setName(entity.getName().trim());
			accountManager.saveUser(entity);
			addActionMessage("Save user successfully");
		} catch (CanNotModifyRoleOfSelfException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Can not modify role of yourself</font>");
		} catch (CanNotUncheckSuperUserRootRoleException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Can not remove root role of super administrator</font>");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save user failed</font>");
		}
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		try {
			accountManager.deleteUser(id);
			addActionMessage("Delete user successfully");
		} catch (CanNotOperSuperUserException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Can not delete super administrator</font>");
		} catch (CanNotDeleteSelfUserException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Can not delete yourself</font>");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Delete user failed</font>");
		}
		return RELOAD;
	}

	// -- 其他Action函数 --//
	/**
	 * 支持使用Jquery.validate Ajax检验用户名是否重复.
	 */
	public String checkLoginName() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String newLoginName = JquertAjaxUtil.parseText(request.getParameter("loginName"));
		if (newLoginName != null)
			newLoginName = newLoginName.trim();
		String oldLoginName = JquertAjaxUtil.parseText(request.getParameter("oldLoginName"));
		if (accountManager.isLoginNameUnique(newLoginName, oldLoginName))
			Struts2Utils.renderText("true");
		else
			Struts2Utils.renderText("false");
		return null;
	}

	public String change() {
		String loginName = SpringSecurityUtils.getCurrentUserName();
		entity = accountManager.findUserByLoginName(loginName);
		return CHANGE;
	}

	public String changeUserInfo() {
		try {
			HttpServletRequest request = ServletActionContext.getRequest();
			String loginName = SpringSecurityUtils.getCurrentUserName();
			User user = accountManager.findUserByLoginName(loginName);
			String oldPassword = request.getParameter("oldPassword");
			String newsPassword = request.getParameter("password");
			if (user.getPassword().equals(oldPassword)) {
				user.setPassword(newsPassword);
				accountManager.saveUser(user);
				addActionMessage("Change your info successfully");
			} else
				addActionMessage("<font color=\"red\">Your original password is incorrect</font>");
		} catch (Exception e) {
			addActionMessage("<font color=\"red\">Change your info failed</font>");
		}
		return CHANGE;
	}

	// -- 页面属性访问函数 --//
	/**
	 * list页面显示用户分页列表.
	 */
	public Page<User> getPage() {
		return page;
	}

	/**
	 * input页面显示所有角色列表.
	 */
	public List<Role> getAllRoleList() {
		return accountManager.getAllRole();
	}

	/**
	 * input页面显示用户拥有的角色.
	 */
	public List<Long> getCheckedRoleIds() {
		return checkedRoleIds;
	}

	/**
	 * input页面提交用户拥有的角色.
	 */
	public void setCheckedRoleIds(List<Long> checkedRoleIds) {
		this.checkedRoleIds = checkedRoleIds;
	}

	@Autowired
	public void setAccountManager(AccountManager accountManager) {
		this.accountManager = accountManager;
	}
}
