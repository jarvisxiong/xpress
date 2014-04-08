package com.nokia.xpress.now.servlet;

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

import com.nokia.xpress.now.entity.reading.QidianLastRead;
import com.nokia.xpress.now.service.reading.QidianLastReadManager;

public class CleanServlet extends HttpServlet {
	private static final long serialVersionUID = -8646662983057843883L;
	private static Logger logger = LoggerFactory.getLogger(CleanServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject jsonObject = new JSONObject();
		try {
			ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletContext());
			response.setContentType("text/html;charset=UTF-8");
			String deviceId = request.getParameter("deviceId");
			if (deviceId != null && !deviceId.trim().equals("")) {
				QidianLastReadManager qidianLastReadManager = (QidianLastReadManager) context.getBean("qidianLastReadManager");
				QidianLastRead qidianLastRead = qidianLastReadManager.getById(deviceId);
				JSONObject result = new JSONObject();
				if (qidianLastRead != null) {
					qidianLastReadManager.deleteLastRead(qidianLastRead.getId());
					result.put("clean", "true");
					result.put("msg", "Cleaning up the data successfully!");
				} else {
					result.put("clean", "false");
					result.put("msg", "Can't find deviceId:" + deviceId.trim());
				}
				jsonObject.put("result", result);
			}
			jsonObject.put("deviceId", deviceId.trim());
			jsonObject.put("success", "true");
			response.getWriter().write(jsonObject.toString());
		} catch (Throwable th) {
			logger.error(th.getMessage(), th);
			response.getWriter().write("[{\"message\":\"" + th.getMessage() + "\"}]");
		}
	}
}
