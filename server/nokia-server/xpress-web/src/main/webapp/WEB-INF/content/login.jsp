<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>
<%@ page import="org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter" %>
<%@ page import="org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter" %>
<%@ page import="org.springframework.security.web.WebAttributes" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Login</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/validate/jquery.validate.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			$("#loginForm").validate();
		});
	</script>
</head>
<body>
<div id="doc3">
<div id="hd">
	<div id="title">
		<h1><a href="${ctx}/home.action">NOKIA Xpress Now</a></h1>
		<h2>--Back-end Server Management System</h2>
	</div>
</div>
<div id="bd">
	<div id="yui-main">
	<div class="yui-b">
	<%
		if (session.getAttribute(WebAttributes.AUTHENTICATION_EXCEPTION) != null) {
	%> 
	<div class="error"> Login failed,Please try again</div> 
	<%
		}
	%>
	<form id="loginForm" action="${ctx}/j_spring_security_check" method="post" style="margin-top:1em">
		<table class="noborder">
			<tr>
				<td><label>Login Name:</label></td>
				<td><input type='text' id='j_username' name='j_username' class="required"
					<s:if test="not empty param.error">
						value='<%=session.getAttribute(UsernamePasswordAuthenticationFilter.SPRING_SECURITY_LAST_USERNAME_KEY)%>'</s:if> />
				</td>
			</tr>
			<tr>
				<td><label>Password:</label></td>
				<td><input type='password' id='j_password' name='j_password' class="required"/></td>
			</tr>
			<tr>
				<td colspan='2' align="right">
					<input type="checkbox" name="_spring_security_remember_me"/>Remember me 2 weeks
					<input value="Login" type="submit" class="button"/>
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

