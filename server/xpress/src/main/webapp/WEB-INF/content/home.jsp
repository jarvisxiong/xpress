<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page
	import="org.springside.modules.security.springsecurity.SpringSecurityUtils"%>
<%@ include file="/common/taglibs.jsp"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>NOKIA Account Management</title>
<%@ include file="/common/meta.jsp"%>
<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet" />
<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet" />
<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
<script src="${ctx}/js/table.js" type="text/javascript"></script>
</head>

<body>
	<div id="doc3">
		<%@ include file="/common/header.jsp"%>
		Hello, <%=SpringSecurityUtils.getCurrentUserName()%>.<br />
		<%--<a href="account/user!change.action">Modify Personal Information</a>--%>
		<a href="account/user!change.action">Change password</a>
		<%@ include file="/common/footer.jsp"%>
	</div>
</body>
</html>
