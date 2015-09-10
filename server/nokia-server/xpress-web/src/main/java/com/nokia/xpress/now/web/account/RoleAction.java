package com.nokia.xpress.now.web.account;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.common.util.JquertAjaxUtil;
import com.nokia.xpress.now.dao.HibernateUtils;
import com.nokia.xpress.now.entity.account.Authority;
import com.nokia.xpress.now.entity.account.Role;
import com.nokia.xpress.now.service.account.AccountManager;
import com.nokia.xpress.now.service.exception.CanNotOperSuperRoleException;
import com.nokia.xpress.now.web.CrudActionSupport;

/**
 * 角色管理Action.
 * 
 * 演示不分页的简单管理界面.
 * 
 * @author calvin
 */
@Namespace("/account")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "role.action", type = "redirect") })
public class RoleAction extends CrudActionSupport<Role> {

	private static final long serialVersionUID = -4052047494894591406L;

	private AccountManager accountManager;

	// -- 页面属性 --//
	private Long id;
	private Role entity;
	private List<Role> allRoleList;// 角色列表
	private List<Long> checkedAuthIds;// 页面中钩选的权限id列表

	// -- ModelDriven 与 Preparable函数 --//
	public Role getModel() {
		return entity;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id != null) {
			entity = accountManager.getRole(id);
		} else {
			entity = new Role();
		}
	}

	// -- CRUD Action 函数 --//
	@Override
	public String list() throws Exception {
		allRoleList = accountManager.getAllRole();
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		checkedAuthIds = entity.getAuthIds();
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			// 根据页面上的checkbox 整合Role的Authorities Set.
			HibernateUtils.mergeByCheckedIds(entity.getAuthorityList(), checkedAuthIds, Authority.class);
			entity.setName(entity.getName().trim());
			// 保存用户并放入成功信息.
			accountManager.saveRole(entity);
			addActionMessage("Save role successfully");
		} catch (CanNotOperSuperRoleException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Can not modify root role</font>");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save role failed</font>");
		}
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		try {
			accountManager.deleteRole(id);
			addActionMessage("Delete role successfully");
		} catch (CanNotOperSuperRoleException e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Can  not delete root role</font>");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Delete role failed</font>");
		}
		return RELOAD;
	}

	/**
	 * 支持使用Jquery.validate Ajax检验用户名是否重复.
	 */
	public String checkName() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String newRoleName = JquertAjaxUtil.parseText(request.getParameter("name"));
		if (newRoleName != null)
			newRoleName = newRoleName.trim();
		String oldRoleName = JquertAjaxUtil.parseText(request.getParameter("oldName"));
		if (accountManager.isRoleNameUnique(newRoleName, oldRoleName)) {
			Struts2Utils.renderText("true");
		} else {
			Struts2Utils.renderText("false");
		}
		// 因为直接输出内容而不经过jsp,因此返回null.
		return null;
	}

	// -- 页面属性访问函数 --//
	/**
	 * list页面显示所有角色列表.
	 */
	public List<Role> getAllRoleList() {
		return allRoleList;
	}

	/**
	 * input页面显示所有授权列表.
	 */
	public List<Authority> getAllAuthorityList() {
		return accountManager.getAllAuthority();
	}

	/**
	 * input页面显示角色拥有的授权.
	 */
	public List<Long> getCheckedAuthIds() {
		return checkedAuthIds;
	}

	/**
	 * input页面提交角色拥有的授权.
	 */
	public void setCheckedAuthIds(List<Long> checkedAuthIds) {
		this.checkedAuthIds = checkedAuthIds;
	}

	@Autowired
	public void setAccountManager(AccountManager accountManager) {
		this.accountManager = accountManager;
	}
}