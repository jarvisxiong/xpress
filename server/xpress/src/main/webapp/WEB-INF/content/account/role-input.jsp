<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Xpress Now Role Management</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/js/validate/jquery.validate.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/validate/jquery.validate.js" type="text/javascript"></script>

	<script>
		$(document).ready(function() {
			//聚焦第一个输入框
			$("#name").focus();
			//为inputForm注册validate函数
			$("#inputForm").validate({
				rules: {
					name: {
						required: true,
						minlength:2,
						maxlength:64,
						remote: "role!checkName.action?oldName=" + encodeURIComponent('${name}')
					},
					checkedAuthIds:"required"
				},
				messages: {
					name: {
						remote: "This Role Name has existed,Please choose another one."
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
	<h2><s:if test="id == null">Add</s:if><s:else>Edit</s:else>&nbsp;Role</h2>
	<form id="inputForm" action="role!save.action" method="post">
		<input type="hidden" name="id" value="${id}"/>
		<table class="noborder">
			<tr>
				<td>Name:</td>
				<td><input type="text" id="name" name="name" size="40" value="${name}"/></td>
			</tr>
			<tr>
				<td>Authorization:</td>
				<td>
					<s:checkboxlist name="checkedAuthIds" list="allAuthorityList" listKey="id" listValue="name" theme="custom"/>
				</td>
			</tr>
			<tr>
				<td colspan="2">
				<s:if test="id != 1">
					<security:authorize ifAnyGranted="ROLE_EditAccount">
						<input class="button" type="submit" value="Submit"/>&nbsp;
					</security:authorize>
				</s:if>
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
