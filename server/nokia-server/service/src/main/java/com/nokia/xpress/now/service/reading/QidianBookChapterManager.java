package com.nokia.xpress.now.service.reading;

import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.common.enums.ReadingEnums;
import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.common.util.reading.EZReadUtil;
import com.nokia.xpress.now.common.util.reading.QidianUtil;
import com.nokia.xpress.now.dao.reading.QidianBookChapterDao;
import com.nokia.xpress.now.entity.common.Keyword;
import com.nokia.xpress.now.entity.reading.QidianBook;
import com.nokia.xpress.now.entity.reading.QidianBookChapter;
import com.nokia.xpress.now.service.EntityManagement;
import com.nokia.xpress.now.service.common.KeywordManager;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class QidianBookChapterManager extends EntityManagement<QidianBookChapter, Long> {
	// private static String QIDIAN_CONTENT_BASE_URL = "http://metest.qidian.com:1187/readchapterwx.aspx";
	private static String QIDIAN_CONTENT_BASE_URL = "http://nokiaapp.qidian.com/readchapterwx.aspx";

	private QidianBookChapterDao qidianBookChapterDao;
	private QidianBookManager qidianBookManager;
	private KeywordManager keywordManager;

	@Override
	protected HibernateDao<QidianBookChapter, Long> getEntityDao() {
		return qidianBookChapterDao;
	}

	@Transactional(readOnly = true)
	public QidianBookChapter getById(Long id) {
		return qidianBookChapterDao.getById(id);
	}

	@Transactional(readOnly = true)
	public QidianBookChapter getByChapterIdAndType(Long chapterId, Integer type) {
		return qidianBookChapterDao.getByChapterIdAndType(chapterId, type);
	}

	@Transactional(readOnly = true)
	public QidianBookChapter getMaxIdBookChapterByBid(Long bid) {
		return qidianBookChapterDao.getMaxIdBookChapterByBid(bid);
	}

	public boolean saveWithCheck(QidianBookChapter needSavedChapter) {
		if (checkChaptersLegal(needSavedChapter)) {
			QidianBookChapter chapterInDb = getByChapterIdAndType(needSavedChapter.getChapterId(), needSavedChapter.getType());
			if (chapterInDb == null) {
				if (needSavedChapter.getFree())
					if (needSavedChapter.getType().equals(ReadingEnums.QIDIAN.getValue()))
						needSavedChapter.setContent(QidianUtil.getChapterContent(needSavedChapter));
					else if (needSavedChapter.getType().equals(ReadingEnums.EZREAD.getValue()))
						needSavedChapter.setContent(EZReadUtil.getChapterContent(needSavedChapter));
				qidianBookChapterDao.save(needSavedChapter);
				return true;
			} else if (!chapterInDb.equals(needSavedChapter) || chapterInDb.getContent() == null) {
				chapterInDb.setName(needSavedChapter.getName());
				chapterInDb.setBook(needSavedChapter.getBook());
				chapterInDb.setVolumeId(needSavedChapter.getVolumeId());
				chapterInDb.setVolumeName(needSavedChapter.getVolumeName());
				chapterInDb.setFree(needSavedChapter.getFree());
				chapterInDb.setPrice(needSavedChapter.getPrice());
				chapterInDb.setUrl(needSavedChapter.getUrl());
				// if (!chapterInDb.getFree() && needSavedChapter.getFree())
				if (chapterInDb.getContent() == null)
					if (chapterInDb.getType().equals(ReadingEnums.QIDIAN.getValue()))
						chapterInDb.setContent(QidianUtil.getChapterContent(needSavedChapter));
					else if (chapterInDb.getType().equals(ReadingEnums.EZREAD.getValue()))
						chapterInDb.setContent(EZReadUtil.getChapterContent(needSavedChapter));
				chapterInDb.setModifyDate(new Date());
				qidianBookChapterDao.save(chapterInDb);
				return true;
			}
		}
		return false;
	}

	@Transactional(readOnly = true)
	public String filter(String str) {
		List<Keyword> keywordList = keywordManager.getAllEnableByType(TypeEnums.READING);
		if (keywordList != null && !keywordList.isEmpty()) {
			StringBuffer patternBuf = new StringBuffer();
			for (Keyword keyword : keywordList)
				patternBuf.append(keyword.getKeyword() + "|"); // 以 | 分隔
			patternBuf.deleteCharAt(patternBuf.length() - 1);
			if (patternBuf.length() > 0) {
				Pattern pattern = Pattern.compile(patternBuf.toString());
				try {
					Matcher m = pattern.matcher(str);
					str = m.replaceAll("****");
				} catch (Exception e) {
					logger.error("ERROR IN QidianBookChapterManager.filter()!", e);
				}
			}
		}
		return str;
	}

	@Transactional(readOnly = true)
	public boolean checkChaptersLegal(QidianBookChapter chapter) {
		List<Keyword> keywordList = keywordManager.getAllEnableByType(TypeEnums.READING);
		if (keywordList != null && !keywordList.isEmpty()) {
			StringBuffer patternBuf = new StringBuffer();
			for (Keyword keyword : keywordList)
				patternBuf.append(keyword.getKeyword() + "|"); // 以 | 分隔
			patternBuf.deleteCharAt(patternBuf.length() - 1);
			if (patternBuf.length() > 0) {
				Pattern pattern = Pattern.compile(patternBuf.toString());
				try {
					Matcher m = pattern.matcher(chapter.getName());
					if (m.find())
						return false;
				} catch (Exception e) {
					logger.error("ERROR IN QidianBookChapterManager.checkChaptersLegal()!", e);
				}
			}
		}
		return true;
	}

	public int removeIllegalChapters(QidianBook book) {
		int removeCount = 0;
		List<Keyword> keywordList = keywordManager.getAllEnableByType(TypeEnums.READING);
		if (keywordList != null && !keywordList.isEmpty()) {
			StringBuffer patternBuf = new StringBuffer();
			for (Keyword keyword : keywordList)
				patternBuf.append(keyword.getKeyword() + "|"); // 以 | 分隔
			patternBuf.deleteCharAt(patternBuf.length() - 1);
			if (patternBuf.length() > 0) {
				Pattern pattern = Pattern.compile(patternBuf.toString());
				List<QidianBookChapter> chapterList = qidianBookChapterDao.findBy("book.id", book.getId());
				if (chapterList != null && !chapterList.isEmpty())
					for (QidianBookChapter chapter : chapterList) {
						try {
							Matcher m = pattern.matcher(chapter.getName());
							if (m.find()) {
								qidianBookChapterDao.delete(chapter);
								removeCount++;
							}
						} catch (Exception e) {
							logger.error("ERROR IN QidianBookChapterManager.removeIllegalChapters()!", e);
						}
					}
			}
		}
		return removeCount;
	}

	@Transactional(readOnly = true)
	public long getCountByBid(long bid) {
		return qidianBookChapterDao.getCountByBid(bid);
	}

	@Transactional(readOnly = true)
	public List<QidianBookChapter> findBy(String propertyName, String value) {
		return qidianBookChapterDao.findBy(propertyName, value);
	}

	@Transactional(readOnly = true)
	public List<QidianBookChapter> findAllByBid(long bid, String orderBy, String order, int start, int limit) {
		return qidianBookChapterDao.findAllByBid(bid, orderBy, order, start, limit);
	}

	@Transactional(readOnly = true)
	public JSONArray parseChapterListToJson(List<QidianBookChapter> chapterList) {
		JSONArray jsonArray = new JSONArray();
		if (chapterList != null && !chapterList.isEmpty())
			for (QidianBookChapter chapter : chapterList) {
				JSONObject jsonObject = new JSONObject();
				try {
					jsonObject.put("chid", chapter.getId());
					jsonObject.put("bookId", chapter.getBookId());
					jsonObject.put("chapterId", chapter.getChapterId());
					jsonObject.put("name", chapter.getName());
					jsonObject.put("free", chapter.getFree());
					jsonObject.put("price", chapter.getPrice());
					if (chapter.getFree())
						jsonObject.put("url", chapter.getUrl());
					else {
						if (chapter.getType().equals(ReadingEnums.QIDIAN.getValue()))
							jsonObject.put("url", QIDIAN_CONTENT_BASE_URL + "?bookid=" + chapter.getBookId() + "&chapterid=" + chapter.getChapterId());
						else if (chapter.getType().equals(ReadingEnums.EZREAD.getValue()))
							jsonObject.put("url", chapter.getUrl());
					}
				} catch (JSONException e) {
					logger.error("ERROR IN QidianBookChapterManager.parseChapterListToJson()", e);
				}
				jsonArray.put(jsonObject);
			}
		return jsonArray;
	}

	@Transactional(readOnly = true)
	public JSONObject parseChapterToJson(QidianBookChapter chapter, int readingPageWordNum, boolean needBookName, boolean needContent, boolean needIndex) {
		JSONObject jsonObject = new JSONObject();
		if (chapter != null) {
			try {
				jsonObject.put("chid", chapter.getId());
				jsonObject.put("chapterId", chapter.getChapterId());
				Long bid = chapter.getBook().getId();
				jsonObject.put("bid", bid);
				jsonObject.put("bookId", chapter.getBookId());
				if (needBookName) {
					QidianBook book = qidianBookManager.getById(bid);
					if (book != null)
						jsonObject.put("bookName", book.getName());
				}
				jsonObject.put("name", chapter.getName());
				jsonObject.put("free", chapter.getFree());
				jsonObject.put("price", chapter.getPrice());
				if (chapter.getFree())
					jsonObject.put("url", chapter.getUrl());
				else {
					if (chapter.getType().equals(ReadingEnums.QIDIAN.getValue()))
						jsonObject.put("url", QIDIAN_CONTENT_BASE_URL + "?bookid=" + chapter.getBookId() + "&chapterid=" + chapter.getChapterId());
					else if (chapter.getType().equals(ReadingEnums.EZREAD.getValue()))
						jsonObject.put("url", chapter.getUrl());
				}
				if (needContent)
					jsonObject.put("content", parseChapterContentPage(chapter, readingPageWordNum));
				if (needIndex) {
					List<Long> qidianBookChapterIdList = qidianBookChapterDao.findAllIdByBid(bid, "id", "ASC");
					int index = qidianBookChapterIdList.indexOf(chapter.getId());
					jsonObject.put("index", index + 1);
					if (index > 0) {
						JSONObject jsonObjectPreChapter = new JSONObject();
						Long preChid = qidianBookChapterIdList.get(index - 1);
						QidianBookChapter preChapter = getById(preChid);
						if (preChapter != null) {
							jsonObjectPreChapter.put("chid", preChid);
							jsonObjectPreChapter.put("index", index);
							Boolean free = preChapter.getFree();
							if (free)
								jsonObjectPreChapter.put("free", true);
							else {
								jsonObjectPreChapter.put("free", false);
								if (preChapter.getType().equals(ReadingEnums.QIDIAN.getValue()))
									jsonObjectPreChapter.put("url", QIDIAN_CONTENT_BASE_URL + "?bookid=" + preChapter.getBookId() + "&chapterid=" + preChapter.getChapterId());
								else if (preChapter.getType().equals(ReadingEnums.EZREAD.getValue()))
									jsonObjectPreChapter.put("url", chapter.getUrl());
							}
						}
						jsonObject.put("preChapter", jsonObjectPreChapter);
					}
					if (index < qidianBookChapterIdList.size() - 1) {
						JSONObject jsonObjectNxteChapter = new JSONObject();
						Long nextChid = qidianBookChapterIdList.get(index + 1);
						QidianBookChapter nextChapter = getById(nextChid);
						if (nextChapter != null) {
							jsonObjectNxteChapter.put("chid", nextChid);
							jsonObjectNxteChapter.put("index", index + 2);
							Boolean free = nextChapter.getFree();
							if (free)
								jsonObjectNxteChapter.put("free", true);
							else {
								jsonObjectNxteChapter.put("free", false);
								if (nextChapter.getType().equals(ReadingEnums.QIDIAN.getValue()))
									jsonObjectNxteChapter.put("url", QIDIAN_CONTENT_BASE_URL + "?bookid=" + nextChapter.getBookId() + "&chapterid=" + nextChapter.getChapterId());
								else if (nextChapter.getType().equals(ReadingEnums.EZREAD.getValue()))
									jsonObjectNxteChapter.put("url", chapter.getUrl());
							}
						}
						jsonObject.put("nextChapter", jsonObjectNxteChapter);
					}
				}
			} catch (JSONException e) {
				logger.error("ERROR IN QidianBookChapterManager.parseChapterToJson()", e);
			}
		}
		return jsonObject;
	}

	public JSONArray parseChapterContentPage(QidianBookChapter chapter, int readingPageWordNum) throws JSONException {
		JSONArray jsonArray = new JSONArray();
		if (chapter != null) {
			String content = chapter.getContent();
			if (content != null) {
				if (chapter.getType().equals(ReadingEnums.EZREAD.getValue()))
					content = content.replace("\n", "").replace("</p>", "").replace("  ", "\u3000");
				String[] contentArray = content.split("<p>");
				StringBuffer pageContent = new StringBuffer();
				int index = 0;
				int length = contentArray.length;
				for (int i = 0; i < length; i++) {
					String paragraph = contentArray[i];
					if (paragraph != null && !paragraph.trim().equals("")) {
						pageContent.append(paragraph);
						if (pageContent.length() > readingPageWordNum || i == contentArray.length - 1) {
							jsonArray.put(index++, pageContent);
							pageContent = new StringBuffer();
						} else
							pageContent.append("<br/>");
					}
				}
			}
		}
		return jsonArray;
	}

	public QidianBookChapterDao getQidianBookChapterDao() {
		return qidianBookChapterDao;
	}

	@Autowired
	public void setQidianBookChapterDao(QidianBookChapterDao qidianBookChapterDao) {
		this.qidianBookChapterDao = qidianBookChapterDao;
	}

	public QidianBookManager getQidianBookManager() {
		return qidianBookManager;
	}

	@Autowired
	public void setQidianBookManager(QidianBookManager qidianBookManager) {
		this.qidianBookManager = qidianBookManager;
	}

	public KeywordManager getKeywordManager() {
		return keywordManager;
	}

	@Autowired
	public void setKeywordManager(KeywordManager keywordManager) {
		this.keywordManager = keywordManager;
	}
}
