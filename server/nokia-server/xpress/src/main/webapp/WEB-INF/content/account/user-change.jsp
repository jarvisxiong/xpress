<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Xpress Now User Management</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/js/validate/jquery.validate.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/validate/jquery.validate.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			//聚焦第一个输入框
			$("#loginName").focus();
			//为inputForm注册validate函数
			$("#inputForm").validate({
				rules: {
					oldPassword: {
						required: true,
						minlength:3,
						maxlength:32
					},
					password: {
						required: true,
						minlength:3,
						maxlength:32
					},
					passwordConfirm: {
						equalTo:"#password"
					},
					email: {
						maxlength: 128,
						email: true
					}
				},
				messages: {
					passwordConfirm: {
						equalTo: "It must match the above password."
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
	<h2>Modify Personal Information</h2>
	<form id="inputForm" action="user!changeUserInfo.action" method="post">
		<div id="message"><s:actionmessage theme="custom" cssClass="success"/></div>
		<input type="hidden" name="id" value="${id}"/>
		<table class="noborder">
			<tr>
				<td>Login Name:</td>
				<td><input type="text" name="loginName" size="40" id="loginName" disabled="disabled" value="<%=SpringSecurityUtils.getCurrentUserName()%>"/></td>
			</tr>
			<tr>
				<td>Old Password:</td>
				<td><input type="password" id="oldPassword" name="oldPassword" size="40" /></td>
			</tr>
			<tr>
				<td>Password:</td>
				<td><input type="password" id="password" name="password" size="40" value="${password}"/></td>
			</tr>
			<tr>
				<td>Confirm Password:</td>
				<td><input type="password" id="passwordConfirm" name="passwordConfirm" size="40" value="${password}"/>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<input class="button" type="submit" value="Submit"/>&nbsp;
					<input class="button" type="button" value="back" onclick="history.back()"/>
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
