<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Reading Book Management</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/js/validate/jquery.validate.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/validate/jquery.validate.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			//聚焦第一个输入框
			$("#recommend").focus();
			//为inputForm注册validate函数
			$("#inputForm").validate({
				rules: {
					recommend:{
						required: true,
						digits: true,
						min: 0,
						max: 10000
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
	<h2><s:if test="id == null">Add</s:if><s:else>Edit</s:else>&nbsp;Reading Book</h2>
	<form id="inputForm" action="qidian-book!save.action" method="post">
		<input type="hidden" name="id" value="${id}"/>
		<table class="noborder">
			<tr>
				<td>Name:</td>
				<td><input type="text" disabled="disabled" name="name" size="40" id="name" value="${name}"/></td>
			</tr>
			<tr>
				<td>Author Name:</td>
				<td><input type="text" disabled="disabled" name="authorName" size="40" id="authorName" value="${authorName}"/></td>
			</tr>
			<tr>
				<td>VoteMonth:</td>
				<td><input type="text" disabled="disabled" name="voteMonth" size="40" id="voteMonth" value="${voteMonth}"/></td>
			</tr>
			<tr>
				<td>Recommend:</td>
				<td><input type="text" name="recommend" size="40" id="recommend" value="${recommend}"/></td>
			</tr>
			<tr>
				<td colspan="2">
					<security:authorize ifAnyGranted="ROLE_EditReading">
						<input class="button" type="submit" value="Submit"/>&nbsp;
					</security:authorize>
					<input class="button" type="button" value="Back" onclick="history.back()"/>
				</td>
			</tr>
		</table>
	</form>
	</div>
	</div>
</div>
<%@ include file="/common/footer.jsp" %>
</div>
</body>
</html>