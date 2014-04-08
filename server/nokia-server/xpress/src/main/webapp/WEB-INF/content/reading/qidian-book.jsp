<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.springside.modules.security.springsecurity.SpringSecurityUtils" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Qidian Book Management</title>
	<%@ include file="/common/meta.jsp" %>
		<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet" />
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/table.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			$("#menu-reading-book").addClass("active");
		});
	</script>
</head>

<body>
<div id="doc3">
<%@ include file="/common/header.jsp" %>
<div id="bd">
	<div id="yui-main">
	<div class="yui-b">
	<form id="mainForm" action="qidian-book.action" method="post">
		<input type="hidden" name="page.pageNo" id="pageNo" value="${page.pageNo}"/>
		<input type="hidden" name="page.orderBy" id="orderBy" value="${page.orderBy}"/>
		<input type="hidden" name="page.order" id="order" value="${page.order}"/>

		<div id="message"><s:actionmessage theme="custom" cssClass="success"/></div>
		<div id="filter">
			Hello, <%=SpringSecurityUtils.getCurrentUserName()%>.
			Category ID: <input type="text" name="categoryId" value="${categoryId}" maxlength="18" size="9" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			ID: <input type="text" name="id" value="${id}" maxlength="18" size="9" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			Name: <input type="text" name="name" value="${name}" size="9" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			<input name="searchButton" type="button" value="Search" onclick="search();"/>
		</div>
		<div>
		
		</div>
		<div id="content">
			<table id="contentTable" width="100%">
				<tr>
					<th width="1%"><a href="javascript:sort('id','desc')">ID</a></th>
					<th width="1%">Category ID</th>
					<th width="5%">Category Name</th>
					<th width="10%">Name</th>
					<th width="1%">Cover</th>
					<th width="8%">Author Name</th>
					<th width="58%">Description</th>
					<th width="3%"><a href="javascript:sort('voteMonth','desc')">Vote Month</a></th>
					<th width="3%"><a href="javascript:sort('recommend','desc')">Recom<br/>mend</a></th>
					<th width="10%">Operation</th>
				</tr>
				<s:iterator value="page.result" status="rowStatus">
					<tr class=<s:if test="#rowStatus.odd">"oddRow"</s:if><s:else>"evenRow"</s:else>>
						<td align="center">${id}</td>
						<td align="center"><a href="qidian-category.action?id=${category.id}">${category.id}</a></td>
						<td align="center"><a href="qidian-category.action?id=${category.id}">${category.name}</a></td>
						<td>${name}</td>
						<td align="center"><a href="${cover}">Image</a></td>
						<td>${authorName}</td>
						<td>${description}</td>
						<td align="center">${voteMonth}</td>
						<td align="center">${recommend}</td>
						<td align="center">
							<security:authorize ifAnyGranted="ROLE_EditReading">
								<a href="qidian-book!input.action?id=${id}">Recommend</a><br/>
							</security:authorize>
							<security:authorize ifAnyGranted="ROLE_ViewReading">
								<a href="qidian-book-chapter.action?bookId=${id}">View Chapters</a>
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
		</div>
	</form>
	</div>
	</div>
</div>
<%@ include file="/common/footer.jsp" %>
</div>
</body>
</html>
