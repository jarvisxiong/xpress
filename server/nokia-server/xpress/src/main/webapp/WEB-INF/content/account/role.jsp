<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.springside.modules.security.springsecurity.SpringSecurityUtils" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Xpress Now Role Management</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/table.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			$("#menu-role").addClass("active");
		});
	</script>
</head>

<body>
<div id="doc3">
<%@ include file="/common/header.jsp" %>
<div id="bd">
	<div id="yui-main">
	<div class="yui-b">
	<div id="message"><s:actionmessage theme="custom" cssClass="success"/></div>
	<div id="filter">Hello, <%=SpringSecurityUtils.getCurrentUserName()%>.</div>
	<div id="content">
		<table id="contentTable" width="100%">
			<tr>
				<th width="2%"><a href="javascript:sort('id','desc')">ID</a></th>
				<th width="10%">Name</th>
				<th width="68%">Authorization</th>
				<th width="10%">Operation</th>
			</tr>
			<s:iterator  value="allRoleList" status="rowStatus">
				<tr class=<s:if test="#rowStatus.odd">"oddRow"</s:if><s:else>"evenRow"</s:else>>
					<td align="center">${id}</td>
					<td align="center">${name}</td>
					<td>${authNames}</td>
					<td align="center">
						<security:authorize ifAnyGranted="ROLE_EditAccount">
							<s:if test="id != 1">
								<a href="role!input.action?id=${id}" id="editLink-${name}">Edit</a>&nbsp;&nbsp;&nbsp;
								<a href="role!delete.action?id=${id}" id="deleteLink-${name}" onclick="return confirm('Do you want to delete ${name}?')">Delete</a>
							</s:if>
						</security:authorize>
					</td>
				</tr>
			</s:iterator>
		</table>
	</div>

	<div>
		<security:authorize ifAnyGranted="ROLE_EditAccount">
			<a href="role!input.action">Add</a>
		</security:authorize>
	</div>
	</div>
	</div>
</div>
<%@ include file="/common/footer.jsp" %>
</div>
</body>
</html>
