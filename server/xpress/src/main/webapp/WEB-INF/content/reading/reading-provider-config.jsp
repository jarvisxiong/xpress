<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.springside.modules.security.springsecurity.SpringSecurityUtils" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Reading Provider Config Management</title>
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
	<form id="mainForm" action="reading-provider-config.action" method="post">
		<input type="hidden" name="page.pageNo" id="pageNo" value="${page.pageNo}"/>
		<input type="hidden" name="page.orderBy" id="orderBy" value="${page.orderBy}"/>
		<input type="hidden" name="page.order" id="order" value="${page.order}"/>

		<div id="message"><s:actionmessage theme="custom" cssClass="success"/></div>
		<div id="filter">
			Hello, <%=SpringSecurityUtils.getCurrentUserName()%>.
			ID: <input type="text" name="id"  value="${id}" maxlength="18" size="9" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			<input name="searchButton" type="button" value="Search" onclick="search();"/>
		</div>
		<div>
		
		</div>
		<div id="content">
			<table id="contentTable" width="100%">
				<tr>
					<th width="4%"><a href="javascript:sort('id','desc')">ID</a></th>
					<th width="6%">UA</th>
					<th width="20%">Device Name</th>
					<th width="44%">Value</th>
					<th width="14%"><a href="javascript:sort('modifyDate','desc')">Modify Date</a></th>
					<th width="12%">Operation</th>
				</tr>
				<s:iterator value="page.result" status="rowStatus">
					<tr class=<s:if test="#rowStatus.odd">"oddRow"</s:if><s:else>"evenRow"</s:else>>
						<td align="center">${id}</td>
						<td align="center">${device.ua}</td>
						<td>${device.deviceName}</td>
						<td style="word-break:break-all">${value}</td>
						<td align="center"><s:date format="yyyy-MM-dd HH:mm:ss" name="modifyDate"></s:date></td>
						<td align="center">
							<security:authorize ifAnyGranted="ROLE_EditReading">
								<a href="reading-provider-config!input.action?id=${id}">Edit</a>&nbsp;&nbsp;
								<a href="reading-provider-config!delete.action?id=${id}"  onclick="return confirm('Do you want to delete it?')">Delete</a>
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
			<security:authorize ifAnyGranted="ROLE_EditReading">
				<s:if test="type!=null">
					<a href="reading-provider-config!input.action">Add</a>
				</s:if>
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
