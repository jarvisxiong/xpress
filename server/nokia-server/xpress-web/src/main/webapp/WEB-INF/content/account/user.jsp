<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.springside.modules.security.springsecurity.SpringSecurityUtils" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Xpress Now User Management</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/table.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			$("#menu-user").addClass("active");
		});
	</script>
</head>

<body>
<div id="doc3">
<%@ include file="/common/header.jsp" %>
<div id="bd">
	<div id="yui-main">
	<div class="yui-b">
	<form id="mainForm" action="user.action" method="post">
		<input type="hidden" name="page.pageNo" id="pageNo" value="${page.pageNo}"/>
		<input type="hidden" name="page.orderBy" id="orderBy" value="${page.orderBy}"/>
		<input type="hidden" name="page.order" id="order" value="${page.order}"/>

		<div id="message"><s:actionmessage theme="custom" cssClass="success"/></div>
		<div id="filter">
			Hello, <%=SpringSecurityUtils.getCurrentUserName()%>.
			Login Name: <input type="text" name="filter_LIKES_loginName" value="${param.filter_LIKES_loginName}" size="9" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			Name or Email: <input type="text" name="filter_LIKES_name_OR_email" value="${param.filter_LIKES_name_OR_email}" size="9" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			<input name="searchButton" type="button" value="Search" onclick="search();"/>
		</div>
		<div id="content">
			<table id="contentTable" width="100%">
				<tr>
					<th width="2%"><a href="javascript:sort('id','desc')">ID</a></th>
					<th width="10%"><a href="javascript:sort('loginName','asc')">Login Name</a></th>
					<th width="10%"><a href="javascript:sort('name','asc')">Name</a></th>
					<th width="28%">Roles</th>
					<th width="30%"><a href="javascript:sort('email','asc')">Email</a></th>
					<th width="20%">Operation</th>
				</tr>
				<s:iterator value="page.result" status="rowStatus">
					<tr class=<s:if test="#rowStatus.odd">"oddRow"</s:if><s:else>"evenRow"</s:else>>
						<td align="center">${id}</td>
						<td align="center">${loginName}</td>
						<td align="center">${name}</td>
						<td>${roleNames}</td>
						<td>${email}</td>
						<td align="center">
							<security:authorize ifAnyGranted="ROLE_EditAccount">
								<s:if test="id != 1">
									<a href="user!input.action?id=${id}">Edit</a>&nbsp;&nbsp;&nbsp;
									<a href="user!delete.action?id=${id}" onclick="return confirm('Do you want to delete ${name}?')">Delete</a>
								</s:if>
							</security:authorize>
						</td>
					</tr>
				</s:iterator>
			</table>
		</div>

		<div>
			<s:if test="page.totalCount > 0">
				${page.pageNo} / ${page.totalPages}
				<a href="javascript:jumpPage(1)">Home</a>
				<s:if test="page.hasPre"><a href="javascript:jumpPage(${page.prePage})">Pre</a></s:if>
				<s:if test="page.hasNext"><a href="javascript:jumpPage(${page.nextPage})">Next</a></s:if>
				<a href="javascript:jumpPage(${page.totalPages})">End</a>
			</s:if><s:else>
				No results found
			</s:else>
			<security:authorize ifAnyGranted="ROLE_EditAccount">
				<a href="user!input.action">Add</a>
			</security:authorize>
		</div>
	</form>
	</div>
	</div>
</div>
<%@ include file="/common/footer.jsp" %>
</div>
</body>
</html>
