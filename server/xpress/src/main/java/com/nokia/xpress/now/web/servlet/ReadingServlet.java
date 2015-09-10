package com.nokia.xpress.now.web.servlet;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.entity.common.ProviderConfig;
import com.nokia.xpress.now.entity.reading.QidianBook;
import com.nokia.xpress.now.entity.reading.QidianBookChapter;
import com.nokia.xpress.now.service.common.AdvertisementManager;
import com.nokia.xpress.now.service.common.DeviceManager;
import com.nokia.xpress.now.service.common.ProviderConfigManager;
import com.nokia.xpress.now.service.reading.QidianBookChapterManager;
import com.nokia.xpress.now.service.reading.QidianBookManager;
import com.nokia.xpress.now.service.reading.QidianLastReadManager;

public class ReadingServlet extends HttpServlet {
	private static final long serialVersionUID = 8589149400085331087L;
	private static Logger logger = LoggerFactory.getLogger(ReadingServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jsonStr = null;
		try {
			ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletContext());
			response.setContentType("text/html;charset=UTF-8");
			String method = request.getParameter("method");
			if (method != null && !method.trim().equals("")) {
				if (method.equalsIgnoreCase("top")) {
					// 获取最高月票书籍、每个分类中的最高月票书籍以及上次阅读记录
					JSONObject jsonObject = new JSONObject();
					DeviceManager deviceManager = (DeviceManager) context.getBean("deviceManager");
					ProviderConfigManager providerConfigManager = (ProviderConfigManager) context.getBean("providerConfigManager");
					AdvertisementManager advertisementManager = (AdvertisementManager) context.getBean("advertisementManager");
					String ua = request.getParameter("ua");
					if (ua != null && !ua.trim().equals("")) {
						Device device = deviceManager.getByUa(ua.trim());
						if (device == null)
							// device = deviceManager.getById(ProjectConfig.DEFAULT_DEVICE_ID);
							device = deviceManager.getByUa(ProjectConfig.DEFAULT_DEVICE_UA);
						if (device != null && device.getEnable()) {
							QidianBookManager qidianBookManager = (QidianBookManager) context.getBean("qidianBookManager");
							List<QidianBook> bookList = qidianBookManager.findTopWithSorted(device);
							if (bookList != null && !bookList.isEmpty()) {
								JSONArray jsonArray = qidianBookManager.parseBookListToJson(bookList);
								QidianBook recommendBook = qidianBookManager.findTopByRecommend(device);
								// QidianBook recommendBook = qidianBookManager.findTopByVoteMonth(device);
								// QidianBook recommendBook = qidianBookManager.getById(7L);// 临时设定今日推荐的书籍为“天骄无双”
								JSONObject jsonObjectRecommend = qidianBookManager.parseBookToJson(recommendBook, false);
								jsonObject.put("recommend", jsonObjectRecommend);
								jsonObject.put("category", jsonArray);
								String deviceId = request.getParameter("deviceId");
								if (deviceId != null && !deviceId.trim().equals("")) {
									QidianLastReadManager qidianLastReadManager = (QidianLastReadManager) context.getBean("qidianLastReadManager");
									jsonObject.put("lastRead", qidianLastReadManager.getLastReadChapterToJson(deviceId.trim()));
								}
								ProviderConfig providerConfig = providerConfigManager.getByTypeAndDevice(TypeEnums.READING, device);
								if (providerConfig == null && !device.getUa().equalsIgnoreCase(ProjectConfig.DEFAULT_DEVICE_UA)) {
									device = deviceManager.getByUa(ProjectConfig.DEFAULT_DEVICE_UA);
									providerConfig = providerConfigManager.getByTypeAndDevice(TypeEnums.READING, device);
								}
								if (providerConfig != null)
									jsonObject.put("provider", providerConfig.getValue());
								jsonObject.put("advertisement", advertisementManager.parseAdvertisementListToJson(advertisementManager.findAllByType(TypeEnums.READING)));
							}
						}
					}
					jsonStr = jsonObject.toString();
				} else if (method.equalsIgnoreCase("bookList")) {
					// 按分类获取书籍列表，根据月票数由高往低排序
					JSONObject jsonObject = new JSONObject();
					QidianBookManager qidianBookManager = (QidianBookManager) context.getBean("qidianBookManager");
					Long cid = parseLong(request.getParameter("cid"), 0);
					int p_no = parseInt(request.getParameter("p_no"), 1);
					int p_size = parseInt(request.getParameter("p_size"), ProjectConfig.getBookNumPerPage());
					long bookCount = qidianBookManager.getCountByCid(cid);
					List<QidianBook> bookList = qidianBookManager.findAllByCid(cid, "voteMonth", "DESC", (p_no - 1) * p_size, p_size);
					JSONArray jsonArray = qidianBookManager.parseBookListToJson(bookList);
					jsonObject.put("bookCount", bookCount);
					jsonObject.put("bookList", jsonArray);
					jsonStr = jsonObject.toString();
				} else if (method.equalsIgnoreCase("chapterList")) {
					// 获取章节列表（包含章节列表、最后更新章节、总章节数、书籍信息）
					QidianBookManager qidianBookManager = (QidianBookManager) context.getBean("qidianBookManager");
					QidianBookChapterManager qidianBookChapterManager = (QidianBookChapterManager) context.getBean("qidianBookChapterManager");
					long bid = parseLong(request.getParameter("bid"), 0L);
					int p_no = parseInt(request.getParameter("p_no"), 1);
					int p_size = parseInt(request.getParameter("p_size"), ProjectConfig.getChapterNumPerPage());
					QidianBook book = qidianBookManager.getById(bid);
					JSONObject jsonObjectBook = qidianBookManager.parseBookToJson(book, true);
					long bookChapterCount = qidianBookChapterManager.getCountByBid(bid);
					// QidianBookChapter lastUpdateChapter = qidianBookChapterManager.getById(book.getLastUpdateChapterId());
					QidianBookChapter lastUpdateChapter = qidianBookChapterManager.getMaxIdBookChapterByBid(bid);
					JSONObject jsonObjectLastUpdateChapter = qidianBookChapterManager.parseChapterToJson(lastUpdateChapter, 0, true, false, false);
					List<QidianBookChapter> chapterList = qidianBookChapterManager.findAllByBid(bid, "chapterId", "ASC", (p_no - 1) * p_size, p_size);
					JSONArray jsonArrayBookChapterList = qidianBookChapterManager.parseChapterListToJson(chapterList);
					jsonObjectBook.put("lastUpdateChapter", jsonObjectLastUpdateChapter);
					jsonObjectBook.put("bookChapterCount", bookChapterCount);
					jsonObjectBook.put("chapterList", jsonArrayBookChapterList);
					jsonStr = jsonObjectBook.toString();
				} else if (method.equalsIgnoreCase("chapterContent")) {
					// 获取章节内容，记录用户阅读记录
					QidianBookChapterManager qidianBookChapterManager = (QidianBookChapterManager) context.getBean("qidianBookChapterManager");
					// long bid = parseLong(request.getParameter("bid"), 0L);
					long chid = parseLong(request.getParameter("chid"), 0L);
					QidianBookChapter chapter = qidianBookChapterManager.getById(chid);
					String deviceId = request.getParameter("deviceId");
					if (deviceId != null && !deviceId.trim().equals("")) {
						QidianLastReadManager qidianLastReadManager = (QidianLastReadManager) context.getBean("qidianLastReadManager");
						qidianLastReadManager.save(deviceId.trim(), chapter);
					}
					int p_size = parseInt(request.getParameter("p_size"), ProjectConfig.getReadingPageWordNum());
					JSONObject jsonObject = qidianBookChapterManager.parseChapterToJson(chapter, p_size, true, true, true);
					jsonStr = jsonObject.toString();
				} else
					jsonStr = "{\"msg\":\"Invalid Method\"}";
			} else
				jsonStr = "{\"msg\":\"Invalid Method\"}";
			response.getWriter().write(jsonStr);
		} catch (Throwable th) {
			logger.error(th.getMessage(), th);
			response.getWriter().write("[{\"message\":\"" + th.getMessage() + "\"}]");
		}
	}

	private int parseInt(String intStr, int defaultVale) {
		try {
			if (intStr != null && !intStr.trim().equals(""))
				return Integer.parseInt(intStr.trim());
		} catch (NumberFormatException e) {
		}
		return defaultVale;
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
