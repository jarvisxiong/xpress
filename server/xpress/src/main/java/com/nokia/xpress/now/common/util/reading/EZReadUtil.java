package com.nokia.xpress.now.common.util.reading;

import java.io.IOException;
import java.net.MalformedURLException;
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

public class EZReadUtil {
	private static Logger logger = LoggerFactory.getLogger(EZReadUtil.class);

	/**
	 * 获取分类列表
	 */
	public static List<QidianCategory> getCategoryList() throws Exception {
		List<QidianCategory> categoryList = new ArrayList<QidianCategory>();
		JSONObject jsonObject = EZReadRequestUtil.getCategoryList();
		if (jsonObject != null) {
			JSONArray entryJsonArray = jsonObject.getJSONArray("ITEMS");
			if (entryJsonArray != null && entryJsonArray.length() > 0) {
				for (int i = 0; i < entryJsonArray.length(); i++) {
					try {
						JSONObject enrtyObject = (JSONObject) entryJsonArray.get(i);
						if (enrtyObject != null) {
							QidianCategory category = new QidianCategory();
							category.setId(enrtyObject.getLong("CID"));
							category.setName(enrtyObject.getString("TITLE"));
							categoryList.add(category);
						}
					} catch (Exception e) {
						logger.error(e.getMessage(), e);
					}
				}
			}
		}
		return categoryList;
	}

	/**
	 * 获取书籍列表
	 */
	public static List<QidianBook> getBookList(QidianCategory category, int p_no, int p_size) throws Exception {
		List<QidianBook> bookList = new ArrayList<QidianBook>();
		JSONObject jsonObject = EZReadRequestUtil.getBookList(category.getCategoryId(), p_no, p_size);
		if (jsonObject != null) {
			JSONObject dataJsonObject = (JSONObject) jsonObject.get("Data");
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
								book.setType(ReadingEnums.EZREAD.getValue());
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
								JSONObject jsonObjectQidianBookInfo = (JSONObject) getBookInfo(book).get("Data");
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
		return EZReadRequestUtil.getBookBaseInfo(book.getBookId());
	}

	/**
	 * 通过Bookid获取书籍描述信息
	 */
	public static String getBookDescription(QidianBook book) throws MalformedURLException, JSONException, IOException {
		JSONObject jsonObject = getBookInfo(book);
		JSONObject jsonObjectBookInfo = (JSONObject) jsonObject.get("Data");
		return jsonObjectBookInfo.getString("DESCRIPTION");
	}

	/**
	 * 通过Book获取书籍章节列表
	 */
	public static List<QidianBookChapter> getChapterList(QidianBook book) throws Exception {
		List<QidianBookChapter> chapterList = new ArrayList<QidianBookChapter>();
		JSONObject jsonObject = EZReadRequestUtil.getBookChapterList(book.getBookId());
		if (jsonObject != null) {
			JSONObject dataJsonObject = (JSONObject) jsonObject.get("Data");
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
								chapter.setType(ReadingEnums.EZREAD.getValue());
								chapter.setName(enrtyObject.getString("CHAPTERNAME"));
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
	 * 通过Chapter获取章节内容
	 */
	public static String getChapterContent(QidianBookChapter chapter) {
		try {
			JSONObject jsonObject = EZReadRequestUtil.getChapterContent(chapter.getChapterId());
			JSONArray jsonArrayChapter = (JSONArray) jsonObject.get("Data");
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
