package com.nokia.xpress.now.common.util.reading;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONException;
import org.json.JSONObject;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.util.MD5Util;
import com.nokia.xpress.now.common.util.RequestUtil;

public class QidianRequestUtil {
	private static final String BASE_URL = ProjectConfig.get("QIDIAN_BASE_URL");
	private static final String APP_ID = ProjectConfig.get("QIDIAN_APP_ID");
	private static final String MACKEY = ProjectConfig.get("QIDIAN_MACKEY");
	private static final String FORMAT = "json";
	private static DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");

	/**
	 * 获取主站月票榜common.toplist.getmonthlist
	 * 
	 * @param cid
	 *            分类: 0全部，1玄幻奇幻，2武侠仙侠，3都市青春，4历史军事，5游戏竞技，6科幻灵异
	 * @param p_no
	 *            分页索引
	 * @param p_size
	 *            每页的记录数
	 */
	public static JSONObject getMonthTopList(Long cid, int p_no, int p_size) throws MalformedURLException, JSONException, IOException {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("app_id", APP_ID);
		paramMap.put("method", "common.toplist.getmonthlist");
		paramMap.put("format", FORMAT);
		paramMap.put("cid", cid);
		paramMap.put("p_no", p_no);
		paramMap.put("p_size", p_size);
		return RequestUtil.requestAsJSONObject(generateUrl(paramMap));
	}

	/**
	 * 通过Bookid获取书籍基本信息common.getbookbaseinfo
	 * 
	 * @param bid
	 *            书号
	 */
	public static JSONObject getBookBaseInfo(long bid) throws MalformedURLException, JSONException, IOException {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("app_id", APP_ID);
		paramMap.put("method", "common.getbookbaseinfo");
		paramMap.put("format", FORMAT);
		paramMap.put("bid", bid);
		return RequestUtil.requestAsJSONObject(generateUrl(paramMap));
	}

	/**
	 * 通过Bookid获取书籍章节列表common.getbookchapterlist
	 * 
	 * @param bid
	 *            书号
	 */
	public static JSONObject getBookChapterList(long bid) throws MalformedURLException, JSONException, IOException {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("app_id", APP_ID);
		paramMap.put("method", "common.getbookchapterlist");
		paramMap.put("format", FORMAT);
		paramMap.put("bid", bid);
		return RequestUtil.requestAsJSONObject(generateUrl(paramMap));
	}

	/**
	 * 通过Bookid获取书籍公共章节内容common.getpublicchaptercontent
	 * 
	 * @param bid
	 *            书号
	 * @param cid
	 *            章节号
	 */
	public static JSONObject getChapterContent(long bid, long cid) throws MalformedURLException, JSONException, IOException, NoSuchAlgorithmException {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("app_id", APP_ID);
		paramMap.put("method", "common.getpublicchaptercontent");
		paramMap.put("format", FORMAT);
		paramMap.put("bid", bid);
		paramMap.put("cid", cid);
		paramMap.put("ts", dateFormat.format(new Date()));
		paramMap.put("sig", generateSig(paramMap).toLowerCase());
		return RequestUtil.requestAsJSONObject(generateUrl(paramMap));
	}

	private static String generateSig(Map<String, Object> paramMap) throws NoSuchAlgorithmException {
		Object[] keyArray = paramMap.keySet().toArray();
		Arrays.sort(keyArray);
		StringBuffer sb = new StringBuffer();
		for (Object key : keyArray) {
			sb.append(key);
			sb.append("=");
			sb.append(paramMap.get(key));
		}
		return MD5Util.getMD5(sb.toString() + MACKEY);
	}

	private static URL generateUrl(Map<String, Object> paramMap) throws MalformedURLException {
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
		return new URL(BASE_URL + sb.toString());
	}
}
