<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.springside.modules.security.springsecurity.SpringSecurityUtils" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Log Management</title>
	<%@ include file="/common/meta.jsp" %>
		<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet" />
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/table.js" type="text/javascript"></script>
</head>

<body>
<div id="doc3">
<%@ include file="/common/header.jsp" %>
<div id="bd">
	<div id="yui-main">
	<div class="yui-b">
	<form id="mainForm" action="xpress-log.action" method="post">
		<input type="hidden" name="page.pageNo" id="pageNo" value="${page.pageNo}"/>
		<input type="hidden" name="page.orderBy" id="orderBy" value="${page.orderBy}"/>
		<input type="hidden" name="page.order" id="order" value="${page.order}"/>

		<div id="message"><s:actionmessage theme="custom" cssClass="success"/></div>
		<div id="filter">
			Hello, <%=SpringSecurityUtils.getCurrentUserName()%>.
			User ID: <input type="text" name="userId"  value="${userId}" maxlength="18" size="9" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			<input name="searchButton" type="button" value="Search" onclick="search();"/>
		</div>
		<div>
		
		</div>
		<div id="content">
			<table id="contentTable" width="100%">
				<tr>
					<th width="15%"><a href="javascript:sort('operDate','asc')">Oper Date</a></th>
					<th width="6%">User ID</th>
					<th width="14%">Login Name</th>
					<th width="15%">User Name</th>
					<th width="40%">Description</th>
					<th width="10%">Operation</th>
				</tr>
				<s:iterator value="page.result" status="rowStatus">
					<tr class=<s:if test="#rowStatus.odd">"oddRow"</s:if><s:else>"evenRow"</s:else>>
						<td align="center"><s:date format="yyyy-MM-dd HH:mm:ss" name="operDate"></s:date></td>
						<td align="center">${user.id}</td>
						<td align="center">${user.loginName}</td>
						<td align="center">${user.name}</td>
						<td align="center" style="word-break:break-all">${description}</td>
						<td align="center">
							<security:authorize ifAnyGranted="ROLE_EditLog">
								<a href="xpress-log!delete.action?id=${id}" onclick="return confirm('Do you want to delete ${id}?')">Delete</a>
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
			</s:if>
			<s:else>
				No results found
			</s:else>
		</div>
		<%--
			<div>
				<security:authorize ifAnyGranted="ROLE_EditLog">
					<a href="xpress-log!clear.action?days=${days}" onclick="return confirm('Do you want to clean log of ${days} days ago?')">Clean</a> log of 
					<input type="text" name="days" value="${days}" maxlength="10" size="10" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onkeypress="if(event.keyCode==13) {clean.click();}"/> days ago.
				</security:authorize>
			</div>
		--%>
	</form>
	</div>
	</div>
</div>
<%@ include file="/common/footer.jsp" %>
</div>
</body>
</html>
