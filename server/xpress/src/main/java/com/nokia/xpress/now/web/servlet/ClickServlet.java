package com.nokia.xpress.now.web.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.service.news.NewsManager;
import com.nokia.xpress.now.service.news.RssManager;

public class ClickServlet extends HttpServlet {
	private static final long serialVersionUID = 9095906114834651720L;
	private static Logger logger = LoggerFactory.getLogger(ClickServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject jsonObject = new JSONObject();
		try {
			ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletContext());
			response.setContentType("text/html;charset=UTF-8");
			long newsId = parseLong(request.getParameter("newsId"), 0);
			long rssId = parseLong(request.getParameter("rssId"), 0);
			NewsManager newsManager = (NewsManager) context.getBean("newsManager");
			News news = newsManager.getById(newsId);
			JSONObject result = new JSONObject();
			if (news != null && news.getRss().getId() == rssId) {
				RssManager rssManager = (RssManager) context.getBean("rssManager");
				boolean updateResult = rssManager.addClickNum(rssId);
				result.put("click", updateResult);
			} else
				result.put("click", false);
			jsonObject.put("result", result);
			jsonObject.put("success", true);
			response.getWriter().write(jsonObject.toString());
		} catch (Throwable th) {
			logger.error(th.getMessage(), th);
			response.getWriter().write("[{\"message\":\"" + th.getMessage() + "\"}]");
		}
	}

	private long parseLong(String intStr, long defaultVale) {
		try {
			if (intStr != null && !intStr.trim().equals(""))
				return Long.parseLong(intStr.trim());
		} catch (NumberFormatException e) {
		}
		return defaultVale;
	}
}
