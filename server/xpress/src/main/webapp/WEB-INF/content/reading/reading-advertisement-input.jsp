<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Reading Advertisement Management</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/js/validate/jquery.validate.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/validate/jquery.validate.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			//聚焦第一个输入框
			$("#value").focus();
			//为inputForm注册validate函数
			$("#inputForm").validate({
				rules: {
					title: {
						required: true,
						minlength:1,
						maxlength:512
					},				
					link:{
						maxlength: 1024,
						url: true
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
	<h2>Edit Config</h2>
	<form id="inputForm" action="reading-advertisement!save.action" method="post">
		<input type="hidden" name="id" value="${id}"/>
		<input type="hidden" name="key" value="${key}"/>
		<table class="noborder">
			<tr>
				<td>Value:</td>
				<td><input type="text" name="value" size="40" id="value" value="${value}"/></td>
			</tr>			<tr>
			<td>Link:</td>
				<td><input type="text" id="link" name="link" size="40" value="${link}"/></td>
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