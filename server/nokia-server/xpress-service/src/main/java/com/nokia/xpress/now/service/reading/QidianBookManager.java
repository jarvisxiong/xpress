package com.nokia.xpress.now.service.reading;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.common.util.ImageUtil;
import com.nokia.xpress.now.dao.reading.QidianBookDao;
import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.entity.common.Keyword;
import com.nokia.xpress.now.entity.reading.QidianBook;
import com.nokia.xpress.now.service.EntityManagement;
import com.nokia.xpress.now.service.common.KeywordManager;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class QidianBookManager extends EntityManagement<QidianBook, Long> {
	private QidianBookDao qidianBookDao;
	private KeywordManager keywordManager;
	private QidianLayoutManager qidianLayoutManager;

	@Override
	protected HibernateDao<QidianBook, Long> getEntityDao() {
		return qidianBookDao;
	}

	@Transactional(readOnly = true)
	public QidianBook getById(Long id) {
		return qidianBookDao.getById(id);
	}

	@Transactional(readOnly = true)
	public QidianBook getByBookIdAndType(Long bookId, Integer type) {
		return qidianBookDao.getByBookIdAndType(bookId, type);
	}

	@Transactional(readOnly = true)
	public List<Long> findAllId(String orderBy, String order) {
		return qidianBookDao.findAllId(orderBy, order);
	}

	public boolean saveWithCheck(QidianBook needSavedBook) throws Exception {
		if (checkBooksLegal(needSavedBook)) {
			QidianBook bookInDb = getByBookIdAndType(needSavedBook.getBookId(), needSavedBook.getType());
			if (bookInDb == null) {
				String imageUrl = needSavedBook.getCover();
				if (imageUrl != null && !imageUrl.trim().equals("")) {
					try {
						BufferedImage bufferedImage = ImageIO.read(new URL(imageUrl));
						needSavedBook.setImageWidth(bufferedImage.getWidth());
						needSavedBook.setImageHeight(bufferedImage.getHeight());
					} catch (Exception e) {
						logger.error("ERROR IN QidianBookManager.saveWithCheck()", e);
					}
				}
				qidianBookDao.save(needSavedBook);
			} else if (!bookInDb.equals(needSavedBook)) {
				bookInDb.setName(needSavedBook.getName());
				bookInDb.setBookUrl(needSavedBook.getBookUrl());
				bookInDb.setAuthorId(needSavedBook.getAuthorId());
				bookInDb.setAuthorName(needSavedBook.getAuthorName());
				bookInDb.setAuthorUrl(needSavedBook.getAuthorUrl());
				// bookInDb.setCover(needSavedBook.getCover());
				bookInDb.setLastUpdateChapterId(needSavedBook.getLastUpdateChapterId());
				bookInDb.setLastUpdateChapterName(needSavedBook.getLastUpdateChapterName());
				bookInDb.setVoteMonth(needSavedBook.getVoteMonth());
				bookInDb.setActStatus(needSavedBook.getActStatus());
				bookInDb.setDescription(needSavedBook.getDescription());
				bookInDb.setEnable(true);
				bookInDb.setModifyDate(new Date());
				qidianBookDao.save(bookInDb);
			} else {
				bookInDb.setModifyDate(new Date());
				qidianBookDao.save(bookInDb);
			}
			return true;
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
					logger.error("ERROR IN QidianBookManager.filter()!", e);
				}
			}
		}
		return str;
	}

	@Transactional(readOnly = true)
	public boolean checkBooksLegal(QidianBook book) {
		List<Keyword> keywordList = keywordManager.getAllEnableByType(TypeEnums.READING);
		if (keywordList != null && !keywordList.isEmpty()) {
			StringBuffer patternBuf = new StringBuffer();
			for (Keyword keyword : keywordList)
				patternBuf.append(keyword.getKeyword() + "|"); // 以 | 分隔
			patternBuf.deleteCharAt(patternBuf.length() - 1);
			if (patternBuf.length() > 0) {
				Pattern pattern = Pattern.compile(patternBuf.toString());
				try {
					Matcher m = pattern.matcher(book.getName());
					if (m.find())
						return false;
				} catch (Exception e) {
					logger.error("ERROR IN QidianBookManager.checkBooksLegal()!", e);
				}
			}
		}
		return true;
	}

	public int removeIllegalBooks() {
		int removeCount = 0;
		List<Keyword> keywordList = keywordManager.getAllEnableByType(TypeEnums.READING);
		if (keywordList != null && !keywordList.isEmpty()) {
			StringBuffer patternBuf = new StringBuffer();
			for (Keyword keyword : keywordList)
				patternBuf.append(keyword.getKeyword() + "|"); // 以 | 分隔
			patternBuf.deleteCharAt(patternBuf.length() - 1);
			if (patternBuf.length() > 0) {
				Pattern pattern = Pattern.compile(patternBuf.toString());
				List<QidianBook> bookList = qidianBookDao.getAll();
				if (bookList != null && !bookList.isEmpty())
					for (QidianBook book : bookList) {
						try {
							Matcher m = pattern.matcher(book.getName());
							if (m.find()) {
								deleteBook(book);
								removeCount++;
							}
						} catch (Exception e) {
							logger.error("ERROR IN QidianBookManager.removeIllegalBooks()!", e);
						}
					}
			}
		}
		return removeCount;
	}

	@Transactional(readOnly = true)
	public long getCountByCid(Long cid) {
		return qidianBookDao.getCountByCid(cid);
	}

	@Transactional(readOnly = true)
	public List<QidianBook> findAllByCid(Long cid, String orderBy, String order, int start, int limit) {
		return qidianBookDao.findAllByCid(cid, orderBy, order, start, limit);
	}

	@Transactional(readOnly = true)
	public QidianBook findTopByRecommend(Device device) {
		return qidianBookDao.findTopByRecommend(device);
	}

	@Transactional(readOnly = true)
	public QidianBook findTopByVoteMonth(Device device) {
		return qidianBookDao.findTopByVoteMonth(device);
	}

	@Transactional(readOnly = true)
	public List<QidianBook> findTopByVoteMonth(Device device, String orderBy, String order) {
		if (device != null)
			return qidianBookDao.findTopByVoteMonth(device, orderBy, order);
		else
			return new ArrayList<QidianBook>();
	}

	@Transactional(readOnly = true)
	public List<QidianBook> findTopWithSorted(Device device) {
		List<QidianBook> bookList = new ArrayList<QidianBook>();
		List<QidianBook> tmpBookList = findTopByVoteMonth(device, "category.id", "ASC");
		if (tmpBookList != null && !tmpBookList.isEmpty()) {
			List<Long> cidList = qidianLayoutManager.findAllCidByDeviceIdAndState(device.getId(), true);
			for (Long cid : cidList) {
				for (QidianBook book : tmpBookList) {
					if (cid.equals(book.getCategory().getId())) {
						bookList.add(book);
						break;
					}
				}
			}
		}
		return bookList;
	}

	public int cleanBookByCid(Long cid) {
		int cleanedCount = 0;
		long bookCount = qidianBookDao.getCountByCid(cid);
		int readingBookReaminCount = ProjectConfig.getReadingBookReaminNum();
		if (bookCount > readingBookReaminCount) {
			List<QidianBook> bookList = qidianBookDao.findAllByCid(cid, "modifyDate", "DESC", readingBookReaminCount, 99999);
			for (QidianBook book : bookList) {
				try {
					deleteBook(book);
					cleanedCount++;
				} catch (IOException e) {
					logger.error(e.getMessage(), e);
				}
			}
		}
		return cleanedCount;
	}

	public void deleteBook(QidianBook book) throws IOException {
		if (book != null) {
			qidianBookDao.delete(book);
			ImageUtil.deleteLocalPic(ProjectConfig.getQidianBookImagePath(), book.getId());
		}
	}

	@Transactional(readOnly = true)
	public JSONArray parseBookListToJson(List<QidianBook> bookList) {
		JSONArray jsonArray = new JSONArray();
		if (bookList != null && !bookList.isEmpty())
			for (QidianBook book : bookList) {
				JSONObject jsonObject = new JSONObject();
				try {
					jsonObject.put("bid", book.getId());
					jsonObject.put("bookId", book.getBookId());
					jsonObject.put("name", book.getName());
					jsonObject.put("cid", book.getCategory().getId());
					jsonObject.put("categoryId", book.getCategoryId());
					jsonObject.put("cname", book.getCategory().getName());
					jsonObject.put("authorId", book.getAuthorId());
					jsonObject.put("authorName", book.getAuthorName());
					jsonObject.put("faceImageUrl", book.getCover());
					jsonObject.put("bookUrl", book.getBookUrl());
					jsonObject.put("voteMonth", book.getVoteMonth());
					jsonObject.put("actStatus", book.getActStatus());
					// jsonObject.put("description", book.getDescription());
					jsonArray.put(jsonObject);
				} catch (JSONException e) {
					logger.error("ERROR IN QidianBookManager.parseBookListToJson()", e);
				}
			}
		return jsonArray;
	}

	@Transactional(readOnly = true)
	public JSONObject parseBookToJson(QidianBook book, boolean needDescription) {
		JSONObject jsonObject = new JSONObject();
		if (book != null) {
			try {
				jsonObject.put("bid", book.getId());
				jsonObject.put("bookId", book.getBookId());
				jsonObject.put("name", book.getName());
				jsonObject.put("cid", book.getCategory().getId());
				jsonObject.put("categoryId", book.getCategoryId());
				jsonObject.put("cname", book.getCategory().getName());
				jsonObject.put("authorId", book.getAuthorId());
				jsonObject.put("authorName", book.getAuthorName());
				jsonObject.put("faceImageUrl", book.getCover());
				jsonObject.put("bookUrl", book.getBookUrl());
				jsonObject.put("voteMonth", book.getVoteMonth());
				jsonObject.put("actStatus", book.getActStatus());
				if (needDescription)
					jsonObject.put("description", book.getDescription());
			} catch (JSONException e) {
				logger.error("ERROR IN QidianBookManager.parseBookToJson()", e);
			}
		}
		return jsonObject;
	}

	public QidianBookDao getQidianBookDao() {
		return qidianBookDao;
	}

	@Autowired
	public void setQidianBookDao(QidianBookDao qidianBookDao) {
		this.qidianBookDao = qidianBookDao;
	}

	public KeywordManager getKeywordManager() {
		return keywordManager;
	}

	@Autowired
	public void setKeywordManager(KeywordManager keywordManager) {
		this.keywordManager = keywordManager;
	}

	public QidianLayoutManager getQidianLayoutManager() {
		return qidianLayoutManager;
	}

	@Autowired
	public void setQidianLayoutManager(QidianLayoutManager qidianLayoutManager) {
		this.qidianLayoutManager = qidianLayoutManager;
	}
}
