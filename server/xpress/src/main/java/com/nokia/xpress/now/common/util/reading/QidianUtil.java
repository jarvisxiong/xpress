package com.nokia.xpress.now.common.util.reading;

import java.io.IOException;
import java.net.MalformedURLException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.nokia.xpress.now.common.enums.ReadingEnums;
import com.nokia.xpress.now.entity.reading.QidianBook;
import com.nokia.xpress.now.entity.reading.QidianBookChapter;
import com.nokia.xpress.now.entity.reading.QidianCategory;

public class QidianUtil {
	private static Logger logger = LoggerFactory.getLogger(QidianUtil.class);

	/**
	 * 获取主站月票榜common.toplist.getmonthlist
	 */
	public static List<QidianBook> getMonthTopList(QidianCategory category, int p_no, int p_size) throws Exception {
		List<QidianBook> bookList = new ArrayList<QidianBook>();
		JSONObject jsonObject = QidianRequestUtil.getMonthTopList(category.getCategoryId(), p_no, p_size);
		if (jsonObject != null) {
			JSONObject dataJsonObject = (JSONObject) jsonObject.get("data");
			if (dataJsonObject != null) {
				JSONArray entryJsonArray = dataJsonObject.getJSONArray("Entry");
				if (entryJsonArray != null && entryJsonArray.length() > 0) {
					for (int i = 0; i < entryJsonArray.length(); i++) {
						try {
							JSONObject enrtyObject = (JSONObject) entryJsonArray.get(i);
							if (enrtyObject != null) {
								QidianBook book = new QidianBook();
								long bid = enrtyObject.getLong("KEY");
								book.setBookId(bid);
								book.setType(ReadingEnums.QIDIAN.getValue());
								book.setName(enrtyObject.getString("TITLE"));
								book.setBookUrl(enrtyObject.getString("SHOWURL"));
								book.setCategory(category);
								book.setCategoryId(category.getCategoryId());
								book.setAuthorId(enrtyObject.getLong("AUTHORID"));
								book.setAuthorName(enrtyObject.getString("AUTHORNAME"));
								book.setAuthorUrl(enrtyObject.getString("AUTHORURL"));
								book.setCover(enrtyObject.getString("FACEURL"));
								book.setLastUpdateChapterId(enrtyObject.getLong("LASTUPDATECHAPTERID"));
								book.setLastUpdateChapterName(enrtyObject.getString("LASTUPDATECHAPTERNAME"));
								book.setVoteMonth(enrtyObject.getLong("VOTEMONTH"));
								JSONObject jsonObjectQidianBookInfo = (JSONObject) getBookInfo(book).get("data");
								book.setActStatus(jsonObjectQidianBookInfo.getString("ACTSTATUS"));
								book.setDescription(jsonObjectQidianBookInfo.getString("DESCRIPTION"));
								book.setEnable(true);
								book.setCreateDate(new Date());
								book.setModifyDate(new Date());
								bookList.add(book);
							}
						} catch (Exception e) {
							logger.error(e.getMessage(), e);
						}
					}
				}
			}
		}
		return bookList;
	}

	/**
	 * 通过Bookid获取书籍信息
	 */
	public static JSONObject getBookInfo(QidianBook book) throws MalformedURLException, JSONException, IOException {
		return QidianRequestUtil.getBookBaseInfo(book.getBookId());
	}

	/**
	 * 通过Bookid获取书籍描述信息
	 */
	public static String getBookDescription(QidianBook book) throws MalformedURLException, JSONException, IOException {
		JSONObject jsonObject = getBookInfo(book);
		JSONObject jsonObjectBookInfo = (JSONObject) jsonObject.get("data");
		return jsonObjectBookInfo.getString("DESCRIPTION");
	}

	/**
	 * 通过Book获取书籍章节列表common.getbookchapterlist
	 * 
	 * @throws NoSuchAlgorithmException
	 */
	public static List<QidianBookChapter> getChapterList(QidianBook book) throws Exception {
		List<QidianBookChapter> chapterList = new ArrayList<QidianBookChapter>();
		JSONObject jsonObject = QidianRequestUtil.getBookChapterList(book.getBookId());
		if (jsonObject != null) {
			JSONObject dataJsonObject = (JSONObject) jsonObject.get("data");
			if (dataJsonObject != null) {
				JSONArray itemsJsonArray = dataJsonObject.getJSONArray("ITEMS");
				if (itemsJsonArray != null && itemsJsonArray.length() > 0) {
					for (int i = 0; i < itemsJsonArray.length(); i++) {
						try {
							JSONObject enrtyObject = (JSONObject) itemsJsonArray.get(i);
							if (enrtyObject != null) {
								QidianBookChapter chapter = new QidianBookChapter();
								chapter.setBook(book);
								chapter.setBookId(book.getBookId());
								chapter.setChapterId(enrtyObject.getLong("CHAPTERID"));
								chapter.setType(ReadingEnums.QIDIAN.getValue());
								chapter.setName(enrtyObject.getString("CHAPTERNAME"));
								chapter.setVolumeId(enrtyObject.getLong("VOLUMEID"));
								chapter.setVolumeName(enrtyObject.getString("VOLUMENAME"));
								chapter.setFree(enrtyObject.getInt("FREE") == 1 ? true : false);
								chapter.setPrice(enrtyObject.getDouble("PRICE"));
								chapter.setUrl(enrtyObject.getString("CHAPTERREADERURL"));
								chapter.setEnable(true);
								chapter.setCreateDate(new Date());
								chapter.setModifyDate(new Date());
								chapterList.add(chapter);
							}
						} catch (Exception e) {
							logger.error(e.getMessage(), e);
						}
					}
				}
			}
		}
		return chapterList;
	}

	/**
	 * 通过Chapter获取书籍公共章节内容common.getpublicchaptercontent
	 */
	public static String getChapterContent(QidianBookChapter chapter) {
		try {
			JSONObject jsonObject = QidianRequestUtil.getChapterContent(chapter.getBook().getBookId(), chapter.getChapterId());
			JSONArray jsonArrayChapter = (JSONArray) jsonObject.get("data");
			if (jsonArrayChapter != null && jsonArrayChapter.length() > 0) {
				JSONObject jsonObjectChapter = (JSONObject) jsonArrayChapter.get(0);
				return jsonObjectChapter.getString("CHAPTERCONTENT");
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return null;
	}
}
