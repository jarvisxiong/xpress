package com.nokia.xpress.now.common.util.reading;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONException;
import org.json.JSONObject;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.util.RequestUtil;

public class EZReadRequestUtil {
	private static final String BASE_URL = ProjectConfig.get("EZREAD_BASE_URL");

	/**
	 * 获取分类列表
	 */
	public static JSONObject getCategoryList() throws MalformedURLException, JSONException, IOException {
		return RequestUtil.requestAsJSONObject(new URL(BASE_URL + "categories"));
	}

	/**
	 * 获取小说列表
	 * 
	 * @param cid
	 * 
	 * @param p_no
	 *            分页索引
	 * @param p_size
	 *            每页的记录数
	 */
	public static JSONObject getBookList(Long categoryId, int p_no, int p_size) throws MalformedURLException, JSONException, IOException {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("cid", categoryId);
		paramMap.put("p_no", p_no);
		paramMap.put("p_size", p_size);
		return RequestUtil.requestAsJSONObject(generateUrl("books", paramMap));
	}

	/**
	 * 根据bookid获取书籍基本信息
	 * 
	 * @param bid
	 *            书号
	 */
	public static JSONObject getBookBaseInfo(long bid) throws MalformedURLException, JSONException, IOException {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("bid", bid);
		return RequestUtil.requestAsJSONObject(generateUrl("book", paramMap));
	}

	/**
	 * 根据bookid获取章节列表
	 * 
	 * @param bid
	 *            书号
	 */
	public static JSONObject getBookChapterList(long bid) throws MalformedURLException, JSONException, IOException {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("bid", bid);
		return RequestUtil.requestAsJSONObject(generateUrl("chapters", paramMap));
	}

	/**
	 * 根据chapterid获取章节内容
	 * 
	 * @param cid
	 *            章节号
	 */
	public static JSONObject getChapterContent(long chapterid) throws MalformedURLException, JSONException, IOException {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("chapterid", chapterid);
		return RequestUtil.requestAsJSONObject(generateUrl("chapter", paramMap));
	}

	private static URL generateUrl(String apiName, Map<String, Object> paramMap) throws MalformedURLException {
		Iterator<Entry<String, Object>> iterator = paramMap.entrySet().iterator();
		StringBuffer sb = new StringBuffer();
		int index = 0;
		while (iterator.hasNext()) {
			Entry<String, Object> entry = iterator.next();
			if (index++ == 0)
				sb.append("?");
			else
				sb.append("&");
			sb.append(entry.getKey());
			sb.append("=");
			sb.append(entry.getValue());
		}
		return new URL(BASE_URL + apiName + sb.toString());
	}
}
