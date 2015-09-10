package com.nokia.xpress.now.web.servlet;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.entity.common.ProviderConfig;
import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.service.common.AdvertisementManager;
import com.nokia.xpress.now.service.common.DeviceManager;
import com.nokia.xpress.now.service.common.ProviderConfigManager;
import com.nokia.xpress.now.service.news.NewsManager;

public class NewsServlet extends HttpServlet {
	private static final long serialVersionUID = -3628448206351956371L;
	private static Logger logger = LoggerFactory.getLogger(NewsServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			response.setContentType("text/html;charset=UTF-8");
			JSONObject jsonObject = new JSONObject();
			ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletContext());
			NewsManager newsManager = (NewsManager) context.getBean("newsManager");
			DeviceManager deviceManager = (DeviceManager) context.getBean("deviceManager");
			ProviderConfigManager providerConfigManager = (ProviderConfigManager) context.getBean("providerConfigManager");
			AdvertisementManager advertisementManager = (AdvertisementManager) context.getBean("advertisementManager");
			String ua = request.getParameter("ua");
			int newsNum = ProjectConfig.getNewsNumPull();
			String newsNumStr = request.getParameter("num");
			if (newsNumStr != null && !newsNumStr.trim().equals(""))
				newsNum = Integer.parseInt(newsNumStr.trim());
			if (ua != null && !ua.trim().equals("")) {
				Device device = deviceManager.getByUa(ua.trim());
				if (device == null)
					// device = deviceManager.getById(ProjectConfig.DEFAULT_DEVICE_ID);
					device = deviceManager.getByUa(ProjectConfig.DEFAULT_DEVICE_UA);
				if (device != null && device.getEnable()) {
					List<News> newsList = newsManager.parseNewsList(device, newsNum);
					if (newsList != null && !newsList.isEmpty()) {
						jsonObject.put("device", deviceManager.parseDeviceToJson(device));
						jsonObject.put("news", newsManager.parseNewsToJson(newsList));
						ProviderConfig providerConfig = providerConfigManager.getByTypeAndDevice(TypeEnums.NEWS, device);
						if (providerConfig == null && !device.getUa().equalsIgnoreCase(ProjectConfig.DEFAULT_DEVICE_UA)) {
							device = deviceManager.getByUa(ProjectConfig.DEFAULT_DEVICE_UA);
							providerConfig = providerConfigManager.getByTypeAndDevice(TypeEnums.NEWS, device);
						}
						if (providerConfig != null)
							jsonObject.put("provider", providerConfig.getValue());
						jsonObject.put("advertisement", advertisementManager.parseAdvertisementListToJson(advertisementManager.findAllByType(TypeEnums.NEWS)));
					}
				}
			}
			String jsonStr = jsonObject.toString();
			response.getWriter().write(jsonStr);
		} catch (Throwable th) {
			logger.error(th.getMessage(), th);
			response.getWriter().write("[{\"message\":\"" + th.getMessage() + "\"}]");
		}
	}
}
