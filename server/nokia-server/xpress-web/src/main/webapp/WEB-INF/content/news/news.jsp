<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.springside.modules.security.springsecurity.SpringSecurityUtils" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA News Management</title>
	<%@ include file="/common/meta.jsp" %>
		<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet" />
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/table.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			$("#menu-news-news").addClass("active");
		});
		function autoResizeImage(maxWidth, maxHeight, objImg) {
			var img = new Image();
			img.src = objImg.src;
			var hRatio;
			var wRatio;
			var Ratio = 1;
			var w = img.width;
			var h = img.height;
			wRatio = maxWidth / w;
			hRatio = maxHeight / h;
			if (maxWidth == 0 && maxHeight == 0)
				Ratio = 1;
			else if (maxWidth == 0 && hRatio < 1)
				Ratio = hRatio;
			else if (maxHeight == 0 && wRatio < 1)
				Ratio = wRatio;
			else if (wRatio < 1 || hRatio < 1)
				Ratio = (wRatio <= hRatio ? wRatio : hRatio);
			if (Ratio != 1) {
				w = w * Ratio;
				h = h * Ratio;
			}
			objImg.height = h;
			objImg.width = w;
		}
	</script>
</head>

<body>
<div id="doc3">
<%@ include file="/common/header.jsp" %>
<div id="bd">
	<div id="yui-main">
	<div class="yui-b">
	<form id="mainForm" action="news.action" method="post">
		<input type="hidden" name="page.pageNo" id="pageNo" value="${page.pageNo}"/>
		<input type="hidden" name="page.orderBy" id="orderBy" value="${page.orderBy}"/>
		<input type="hidden" name="page.order" id="order" value="${page.order}"/>

		<div id="message"><s:actionmessage theme="custom" cssClass="success"/></div>
		<div id="filter">
			Hello, <%=SpringSecurityUtils.getCurrentUserName()%>.
			RSS ID: <input type="text" name="rssId" value="${rssId}" maxlength="18" size="9" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			ID: <input type="text" name="id" value="${id}" maxlength="18" size="9" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			Title: <input type="text" name="title" value="${title}" size="9" onkeypress="if(event.keyCode==13) {searchButton.click();}"/>
			<input name="searchButton" type="button" value="Search" onclick="search();"/>
		</div>
		<div>
		
		</div>
		<div id="content">
			<table id="contentTable" width="100%">
				<tr>
					<th width="1%"><a href="javascript:sort('id','desc')">ID</a></th>
					<th width="1%">RSS ID</th>
					<th width="1%">RSS Name</th>
					<th width="15%">Title</th>
					<th width="1%">Image</th>
					<th width="70%">Summary</th>
					<th width="11%"><a href="javascript:sort('pubDate','desc')">Publish Date</a></th>
				</tr>
				<s:iterator value="page.result" status="rowStatus">
					<tr class=<s:if test="#rowStatus.odd">"oddRow"</s:if><s:else>"evenRow"</s:else>>
						<td align="center">${id}</td>
						<td align="center"><a href="rss.action?id=${rss.id}">${rss.id}</a></td>
						<td align="center"><a href="rss.action?id=${rss.id}">${rss.name}</a></td>
						<td><a href="${link}">
							<%--
								<s:if test="%{null!=title && title.length()>18}">
									<s:property value="%{title.substring(0, 18)}" />...
								</s:if>
								<s:else>
							--%>
								<s:property value="%{title}"/>
							<%--</s:else>--%>
						</a></td>
						<td align="center">
							<s:if test="image != null">
								<a href="${image}">Image</a>
							</s:if>
						</td>
						<td><%--
								<s:if test="%{null!=summary && summary.length()>60}">
									<s:property value="%{summary.substring(0, 60)}" />...
								</s:if>
								<s:else>
							--%>
								<s:property value="%{summary}"/>
							<%--</s:else> --%>
						</td>
						<td align="center"><s:date format="yyyy-MM-dd HH:mm:ss" name="pubDate"></s:date></td>
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
