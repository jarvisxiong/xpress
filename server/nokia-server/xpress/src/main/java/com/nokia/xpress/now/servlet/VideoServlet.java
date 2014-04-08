package com.nokia.xpress.now.servlet;

import java.io.IOException;
import java.net.URL;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dom4j.Element;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.util.RequestUtil;
import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.service.common.DeviceManager;

public class VideoServlet extends HttpServlet {
	private static final long serialVersionUID = 4883166120465723005L;
	private static Logger logger = LoggerFactory.getLogger(VideoServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletContext());
			response.setContentType("text/html;charset=UTF-8");
			long start = System.currentTimeMillis();

			DeviceManager deviceManager = (DeviceManager) context.getBean("deviceManager");
			String ua = request.getParameter("ua");
			if (ua != null && !ua.trim().equals("")) {
				Device device = deviceManager.getByUa(ua.trim());
				if (device == null)
					// device = deviceManager.getById(ProjectConfig.DEFAULT_DEVICE_ID);
					device = deviceManager.getByUa(ProjectConfig.DEFAULT_DEVICE_UA);
				if (device != null && device.getEnable()) {
					// ///////////////////////////////////////
				}
			}

			Element root = RequestUtil.requestAsXML(new URL("http://api.3g.ifeng.com/video/nokia_rss?sid=txjWXjYrZPS2pEBQk1CGxvJRCa3aQl&cate=video&ccid=7339&ch=rj_nkrsssp%20"));
			System.out.println((System.currentTimeMillis() - start));
			Element channel = root.element("channel");
			JSONArray jsonArray = new JSONArray();
			if (channel != null) {
				List<Element> itemList = channel.elements("item");
				if (itemList != null && !itemList.isEmpty()) {
					for (Element item : itemList) {
						JSONObject video = new JSONObject();
						video.put("title", item.element("title").getText());
						video.put("link", item.element("link").getText());
						String imageUrl = item.element("image").getText();
						if (imageUrl != null && !imageUrl.trim().equals("")) {
							video.put("image_url", imageUrl);
							// BufferedImage image = ImageIO.read(new URL(imageUrl));
							// video.put("image_width", image.getWidth());
							// video.put("image_height", image.getHeight());
						}
						video.put("summary", item.element("summary").getText());
						video.put("clickTimes", 899);
						video.put("length", "0:09:12");
						jsonArray.put(video);
					}
				}
			}
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("videoList", jsonArray);
			String jsonStr = jsonObject.toString();
			response.getWriter().write(jsonStr);
			System.out.println("    " + (System.currentTimeMillis() - start));
		} catch (Throwable th) {
			logger.error(th.getMessage(), th);
			response.getWriter().write("[{\"message\":\"" + th.getMessage() + "\"}]");
		}
	}
}
