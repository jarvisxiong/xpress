<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page
	import="org.springside.modules.security.springsecurity.SpringSecurityUtils"%>
<%@ include file="/common/taglibs.jsp"%>
<div id="hd">
	<div id="title">
		<h1>
			<a href="${ctx}/home.action">NOKIA Xpress Now</a>
		</h1>
		<h2>--Back-end Server Management System</h2>
	</div>
	<ul id="menu">
		<security:authorize ifAnyGranted="ROLE_ViewDevice">
			<li><a id="menu-device" href="${ctx}/device/device.action">Device</a></li>
		</security:authorize>

		<security:authorize ifAnyGranted="ROLE_ViewNews">
			<li><a id="menu-news" href="${ctx}/news/rss.action">News</a>
				<ul>
					<li id="menu-news-rss"><a href="${ctx}/news/rss.action">RSS</a></li>
					<li id="menu-news-news"><a href="${ctx}/news/news.action">News</a></li>
					<li id="menu-news-keyword"><a href="${ctx}/news/news-keyword.action">Keyword</a></li>
					<li id="menu-news-provider"><a href="${ctx}/news/news-provider-config.action">Provider</a></li>
					<li id="menu-news-advertisement"><a href="${ctx}/news/news-advertisement.action">Advertisement</a></li>
				</ul></li>
		</security:authorize>

		<security:authorize ifAnyGranted="ROLE_ViewReading">
			<li><a id="menu-reading" href="${ctx}/reading/qidian-category.action">Reading</a>
				<ul>
					<li id="menu-reading-category"><a href="${ctx}/reading/qidian-category.action">Category</a></li>
					<li id="menu-reading-book"><a href="${ctx}/reading/qidian-book.action">Book</a></li>
					<li id="menu-reading-chapter"><a href="${ctx}/reading/qidian-book-chapter.action">Chapter</a></li>
					<li id="menu-reading-keyword"><a href="${ctx}/reading/reading-keyword.action">Keyword</a></li>
					<li id="menu-reading-provider"><a href="${ctx}/reading/reading-provider-config.action">Provider</a></li>
					<!-- <li id="menu-reading-advertisement"><a href="${ctx}/reading/reading-advertisement.action">Advertisement</a></li> -->
				</ul></li>
		</security:authorize>

		<security:authorize ifAnyGranted="ROLE_ViewVideo">
			<li><a id="menu-video" href="${ctx}/video/video-keyword.action">Video</a>
				<ul>
					<li id="menu-video-keyword"><a href="${ctx}/video/video-keyword.action">Keyword</a></li>
				</ul></li>
		</security:authorize>

		<security:authorize ifAnyGranted="ROLE_ViewAccount">
			<li><a id="menu-user" href="${ctx}/account/user.action">Account</a></li>
		</security:authorize>
		<security:authorize ifAnyGranted="ROLE_ViewAccount">
			<li><a id="menu-role" href="${ctx}/account/role.action">Role</a></li>
		</security:authorize>
		<security:authorize ifAnyGranted="ROLE_ViewLog">
			<li><a id="menu-log" href="${ctx}/log/xpress-log.action">Log</a></li>
		</security:authorize>
		<li><a href="${ctx}/j_spring_security_logout">Exit</a></li>
	</ul>
</div>