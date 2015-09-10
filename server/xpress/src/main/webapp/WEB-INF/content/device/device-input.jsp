<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA Device Management</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/js/validate/jquery.validate.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/validate/jquery.validate.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			//聚焦第一个输入框
			$("#ua").focus();
			//为inputForm注册validate函数
			$("#inputForm").validate({
				rules: {
					ua: {
						required: true,
						minlength:2,
						maxlength:128,
						remote: "device!checkUA.action?oldUa=" + encodeURIComponent('${ua}')
					},
					deviceName: {
						required: true,
						minlength:2,
						maxlength:128,
					},
					screenWidth: {
						required: true,
						digits: true,
						min: 1,
						max: 100000
					},
					screenHeight: {
						required: true,
						digits: true,
						min: 1,
						max: 100000
					},
					settingLink:{
						maxlength: 1024,
						url: true
					},
					provider:{
						required: true,
						maxlength: 1024
					}
				},
				messages: {
					ua: {
						remote: "UA has existed!"
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
	<h2><s:if test="id == null">Add</s:if><s:else>Edit</s:else> Device</h2>
	<form id="inputForm" action="device!save.action" method="post">
		<input type="hidden" name="id" value="${id}"/>
		<table class="noborder">
			<tr>
				<td>UA:</td>
				<td><input type="text" name="ua" size="40" id="ua" value="${ua}" <s:if test="id == 0">disabled="disabled" </s:if>/></td>
			</tr>
			<tr>
				<td>Device Name:</td>
				<td><input type="text" name="deviceName" size="40" id="deviceName" value="${deviceName}"/></td>
			</tr>
			<tr>
				<td>Screen Width:</td>
				<td><input type="text" name="screenWidth" size="40" id="screenWidth" value="${screenWidth}"/></td>
			</tr>
			<tr>
				<td>Screen Height:</td>
				<td><input type="text" name="screenHeight" size="40" id="screenHeight" value="${screenHeight}"/></td>
			</tr>
			<s:select name="showSetting" list="#{'true':'true', 'false':'false'}" label="Show Setting" />
			<tr>
				<td>Setting Link:</td>
				<td><input type="text" name="settingLink" size="40" id="settingLink" value="${settingLink}"/></td>
			</tr>
			<s:if test="enable == null">
				<input type="hidden" name="enable" size="40" id="enable" value="true"/>
			</s:if>
			<s:if test="enable != null">
				<s:select name="enable" list="#{'true':'enable', 'false':'disable'}" label="State" />
			</s:if>
			<tr>
				<td colspan="2">
						<security:authorize ifAnyGranted="ROLE_EditDevice">
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