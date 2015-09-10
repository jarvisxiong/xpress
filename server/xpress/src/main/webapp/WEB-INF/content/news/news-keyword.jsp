<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.springside.modules.security.springsecurity.SpringSecurityUtils" %>
<%@ include file="/common/taglibs.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA News Keyword Management</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/table.js" type="text/javascript"></script>
	<link href="${ctx}/js/validate/jquery.validate.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/validate/jquery.validate.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			//聚焦第一个输入框
			$("#file").focus();
			//为inputForm注册validate函数
			$("#inputForm").validate({
				rules: {					
					file:{
						required:true,
						accept:'txt'					
					}					
				},
				messages: {
					file:{
						accept:"Please select txt file"
					}
				}
			});
		});
	</script>
</head>
<body>
<div id="doc3">
<%@ include file="/common/header.jsp" %>
<div id="bd">
	<div id="yui-main">
	<div class="yui-b">
	<div id="filter">
		<security:authorize ifAnyGranted="ROLE_EditNews">
			<form id="inputForm" action="news-keyword!importFile.action" method="post" enctype="multipart/form-data">
				<input type="file" name="file"/>
				<input type="submit" value="Import" />
			</form>
		</security:authorize>
		<a href="news-keyword!exportFile.action">Export</a>
	</div>
	<form id="mainForm" action="news-keyword.action" method="post">
		<input type="hidden" name="page.pageNo" id="pageNo" value="${page.pageNo}"/>
		<input type="hidden" name="page.orderBy" id="orderBy" value="${page.orderBy}"/>
		<input type="hidden" name="page.order" id="order" value="${page.order}"/>
		<input type="hidden" name="type" value="${type}"/>
		<div id="message"><s:actionmessage theme="custom" cssClass="success"/></div>
		<div id="filter">
			Hello, <%=SpringSecurityUtils.getCurrentUserName()%>.
			Keyword: <input type="text" name="filter_LIKES_keyword" value="${param.filter_LIKES_keyword}" size="9" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			ID: <input type="text" name="filter_EQL_id" value="${param.filter_EQL_id}" maxlength="18" size="9" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
		   <input name="searchButton" type="button" value="Search" onclick="search();"/>
		</div>
		<div id="content">
			<table id="contentTable" width="100%">
				<tr>
					<th width="2%"><a href="javascript:sort('id','desc')">ID</a></th>
					<th width="40%">Keyword</th>
					<th width="12%">State</th>
					<th width="15%"><a href="javascript:sort('createDate','desc')">Create Date</a></th>
					<th width="15%"><a href="javascript:sort('modifyDate','desc')">Modify Date</a></th>
					<th width="20%">Opreation</th>
				</tr>
				<s:iterator value="page.result" status="rowStatus">
					<tr class=<s:if test="#rowStatus.odd">"oddRow"</s:if><s:else>"evenRow"</s:else>>
						<td align="center">${id}</td>
						<td>${keyword}</td>
						<td align="center">${enable ? "enable":"disable"}</td>
						<td align="center"><s:date format="yyyy-MM-dd HH:mm:ss" name="createDate"></s:date></td>
						<td align="center"><s:date format="yyyy-MM-dd HH:mm:ss" name="modifyDate"></s:date></td>
						<td align="center">
						<security:authorize ifAnyGranted="ROLE_EditNews">
								<a href="news-keyword!input.action?id=${id}">Edit</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								<a href="news-keyword!delete.action?id=${id}"  onclick="return confirm('Do you want to delete it?')">Delete</a>
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
			<security:authorize ifAnyGranted="ROLE_EditNews">
				<s:if test="type!=null">
					<a href="news-keyword!input.action">Add</a>
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
