package com.nokia.xpress.now.servlet;

import java.io.IOException;
import java.util.ArrayList;
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
import com.nokia.xpress.now.entity.news.NewsLayout;
import com.nokia.xpress.now.service.common.AdvertisementManager;
import com.nokia.xpress.now.service.common.DeviceManager;
import com.nokia.xpress.now.service.common.ProviderConfigManager;
import com.nokia.xpress.now.service.news.NewsLayoutManager;
import com.nokia.xpress.now.service.news.NewsManager;

public class NewsServlet2 extends HttpServlet {
	private static final long serialVersionUID = -3628448206351956371L;
	private static Logger logger = LoggerFactory.getLogger(NewsServlet2.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		long start = System.currentTimeMillis();
		try {
			response.setContentType("text/html;charset=UTF-8");
			JSONObject jsonObject = new JSONObject();
			ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletContext());
			NewsManager newsManager = (NewsManager) context.getBean("newsManager");
			DeviceManager deviceManager = (DeviceManager) context.getBean("deviceManager");
			ProviderConfigManager providerConfigManager = (ProviderConfigManager) context.getBean("providerConfigManager");
			NewsLayoutManager newsLayoutManager = (NewsLayoutManager) context.getBean("newsLayoutManager");
			AdvertisementManager advertisementManager = (AdvertisementManager) context.getBean("advertisementManager");
			String ua = request.getParameter("ua");
			if (ua != null && !ua.trim().equals("")) {
				Device device = deviceManager.getByUa(ua.trim());
				if (device == null)
					// device = deviceManager.getById(ProjectConfig.DEFAULT_DEVICE_ID);
					device = deviceManager.getByUa(ProjectConfig.DEFAULT_DEVICE_UA);
				if (device != null && device.getEnable()) {
					List<NewsLayout> newsLayoutList = newsLayoutManager.findAllLayoutWithDeviceIdAndState(device.getId(), true);
					// int pageCount = newsLayoutList.size();
					// if (pageCount > 0) {
					// int p_no = parseInt(request.getParameter("p_no"), 1);
					// if (p_no > 0 && p_no <= pageCount) {
					// NewsLayout newsLayout = newsLayoutList.get(p_no - 1);
					// if (newsLayout != null) {
					int p_size = parseInt(request.getParameter("p_size"), ProjectConfig.getNewsNumPerPage());
					// List<News> newsList = newsManager.findAllWithRssIdAndPath(newsLayout.getRss().getId(), "pubDate", "DESC", 0, p_size);
					// if (newsList != null && !newsList.isEmpty()) {
					// jsonObject.put("device", deviceManager.parseDeviceToJson(device));
					// jsonObject.put("p_no", p_no);
					// jsonObject.put("pageCount", pageCount);
					// jsonObject.put("news", newsManager.parseNewsToJson(newsList));
					// ProviderConfig providerConfig = providerConfigManager.getByTypeAndDevice(TypeEnums.NEWS, device);
					// if (providerConfig == null && !device.getUa().equalsIgnoreCase(ProjectConfig.DEFAULT_DEVICE_UA)) {
					// device = deviceManager.getByUa(ProjectConfig.DEFAULT_DEVICE_UA);
					// providerConfig = providerConfigManager.getByTypeAndDevice(TypeEnums.NEWS, device);
					// }
					// if (providerConfig != null)
					// jsonObject.put("provider", providerConfig.getValue());
					// jsonObject.put("advertisement", advertisementManager.parseAdvertisementListToJson(advertisementManager.findAllByType(TypeEnums.NEWS)));
					// }
					// }
					// }
					// }
					List<News> newsList = new ArrayList<News>();
					for (NewsLayout newsLayout : newsLayoutList)
						newsList.addAll(newsManager.findAllWithRssIdAndPath(newsLayout.getRss().getId(), "pubDate", "DESC", 0, p_size));
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
		if ("test".equalsIgnoreCase(request.getParameter("para")))
			logger.info("" + (System.currentTimeMillis() - start));
	}

	private int parseInt(String intStr, int defaultVale) {
		try {
			if (intStr != null && !intStr.trim().equals(""))
				return Integer.parseInt(intStr.trim());
		} catch (NumberFormatException e) {
		}
		return defaultVale;
	}
}
