<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>NOKIA News Layout Management</title>
	<%@ include file="/common/meta.jsp" %>
	<link href="${ctx}/css/yui.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/css/style.css" type="text/css" rel="stylesheet"/>
	<link href="${ctx}/js/validate/jquery.validate.css" type="text/css" rel="stylesheet"/>
	<script src="${ctx}/js/jquery.js" type="text/javascript"></script>
	<script src="${ctx}/js/validate/jquery.validate.js" type="text/javascript"></script>
	<script>
		$(document).ready(function() {
			//聚焦第一个输入框
			$("#positionIndex").focus();
			//为inputForm注册validate函数
			$("#inputForm").validate({
				rules: {					
					ua: "required",
					deviceName:"required",
					positionIndex:{
						required: true,
						digits: true,
						min: 1,
						max: 100
					},
					enable:"required"
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
	<h2><s:if test="id == null">Add</s:if><s:else>Edit</s:else>&nbsp;News Layout</h2>
	<form id="inputForm" action="news-layout!save.action" method="post">
		<input type="hidden" name="id" value="${id}"/>
		<input type="hidden" name="deviceId" value="${deviceId}"/>
		<table class="noborder">
			<tr>
				<td>UA:</td>
				<td><input type="text" disabled="disabled" name="device.ua" size="40" id="ua" value="${device.ua}"/></td>
			</tr>
			<tr>
				<td>Device Name:</td>
				<td><input type="text" disabled="disabled" name="device.deviceName" size="40" id="deviceName" value="${device.deviceName}"/></td>
			</tr>
			<tr>
				<td>Position Index:</td>
				<td><input type="text" name="positionIndex" size="40" id="positionIndex" value="${positionIndex}"/></td>
			</tr>
			<s:select name="rssId" id="rssId" listKey="id" listValue="name" list="#request.newsRssList" label="RSS" />
			<s:if test="enable == null">
				<input type="hidden" name="enable" size="40" id="enable" value="true"/>
			</s:if>
			<s:if test="enable != null">
				<s:select name="enable" list="#{'true':'enable', 'false':'disable'}" label="State" />
			</s:if>
			<tr>
				<td colspan="2">
					<security:authorize ifAnyGranted="ROLE_EditNews">
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