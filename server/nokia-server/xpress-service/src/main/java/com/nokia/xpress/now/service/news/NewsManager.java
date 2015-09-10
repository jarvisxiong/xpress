package com.nokia.xpress.now.service.news;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
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
import com.nokia.xpress.now.dao.news.NewsDao;
import com.nokia.xpress.now.entity.common.Device;
import com.nokia.xpress.now.entity.common.Keyword;
import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.entity.news.NewsLayout;
import com.nokia.xpress.now.entity.news.Rss;
import com.nokia.xpress.now.service.EntityManagement;
import com.nokia.xpress.now.service.common.DeviceManager;
import com.nokia.xpress.now.service.common.KeywordManager;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class NewsManager extends EntityManagement<News, Long> {
	private NewsDao newsDao;
	private NewsLayoutManager newsLayoutManager;
	private DeviceManager deviceManager;
	private RssManager rssManager;
	private KeywordManager keywordManager;

	@Override
	protected HibernateDao<News, Long> getEntityDao() {
		return newsDao;
	}

	@Transactional(readOnly = true)
	public News getById(Long id) {
		return newsDao.getById(id);
	}

	public void deleteNews(Long id) throws IOException {
		News news = newsDao.getById(id);
		deleteNews(news);
	}

	public void deleteNews(News news) throws IOException {
		if (news != null) {
			newsDao.delete(news);
			ImageUtil.deleteLocalPic(ProjectConfig.getNewsImagePath(), news.getId());
		}
	}

	public int cleanNewsByRss(Rss rss) {
		int cleanedNewsCount = 0;
		long newsCount = newsDao.getCountByRss(rss);
		if (newsCount > ProjectConfig.getNewsRemainNum()) {
			List<News> newsList = newsDao.findAllByRssId(rss.getId(), "pubDate", "DESC", ProjectConfig.getNewsRemainNum(), 99999);
			for (News news : newsList) {
				try {
					deleteNews(news);
					cleanedNewsCount++;
				} catch (IOException e) {
					logger.error(e.getMessage(), e);
				}
			}
		}
		return cleanedNewsCount;
	}

	@Transactional(readOnly = true)
	public List<News> findAllWithRssIdAndPath(Long rssId, String orderBy, String order, int start, int limit) {
		Rss rss = rssManager.get(rssId);
		return newsDao.findAllWithRssIdAndPath(rssId, rss.getPath(), orderBy, order, start, limit);
	}

	@Transactional(readOnly = true)
	public long getAllCountWithRssIdAndPath(Long rssId) {
		Rss rss = rssManager.getById(rssId);
		if (rss != null)
			return newsDao.getAllCountWithRssIdAndPath(rssId, rss.getPath());
		else
			return 0;
	}

	@Transactional(readOnly = true)
	public List<Long> findAllId(String orderBy, String order) {
		return newsDao.findAllId(orderBy, order);
	}

	@Transactional(readOnly = true)
	public List<News> findAllWithRssIdAndPath(Long rssId, String rssPath, String orderBy, String order, int start, int limit) {
		return newsDao.findAllWithRssIdAndPath(rssId, rssPath, orderBy, order, start, limit);
	}

	@Transactional(readOnly = true)
	public List<News> findAllWithRssIdAndPath(Long rssId, String rssPath, int start, int limit) {
		return newsDao.findAllWithRssIdAndPath(rssId, rssPath, null, null, start, limit);
	}

	public boolean saveWithCheck(News needSavedNews) throws Exception {
		long newsCount = newsDao.getNewsCount(needSavedNews.getRss().getId(), needSavedNews.getPubDate(), needSavedNews.getTitle());
		if (newsCount == 0 && checkNewsLegal(needSavedNews)) {
			String imageUrl = needSavedNews.getImage();
			if (imageUrl != null && !imageUrl.trim().equals("")) {
				try {
					BufferedImage bufferedImage = ImageIO.read(new URL(imageUrl));
					needSavedNews.setImageWidth(bufferedImage.getWidth());
					needSavedNews.setImageHeight(bufferedImage.getHeight());
				} catch (Exception e) {
					logger.error("ERROR IN NewsManager.saveWithCheck()", e);
				}
			}
			save(needSavedNews);
			return true;
		}
		return false;
	}

	/**
	 * 根据Device返回以二级列表的方式按分类存储的新闻
	 */
	@Transactional(readOnly = true)
	public List<List<News>> getNewsListListByDevice(Device device, int newsNum) {
		List<List<News>> newsListList = new ArrayList<List<News>>();
		if (device != null)
			for (NewsLayout newsLayout : newsLayoutManager.findAllLayoutWithDeviceIdAndState(device.getId(), true))
				newsListList.add(findAllWithRssIdAndPath(newsLayout.getRss().getId(), newsLayout.getRss().getPath(), 0, newsNum));
		return newsListList;
	}

	@Transactional(readOnly = true)
	public String filter(String str) {
		List<Keyword> keywordList = keywordManager.getAllEnableByType(TypeEnums.NEWS);
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
					logger.error("ERROR IN KeyWordFilter!", e);
				}
			}
		}
		return str;
	}

	@Transactional(readOnly = true)
	public boolean checkNewsLegal(News news) {
		List<Keyword> keywordList = keywordManager.getAllEnableByType(TypeEnums.NEWS);
		if (keywordList != null && !keywordList.isEmpty()) {
			StringBuffer patternBuf = new StringBuffer();
			for (Keyword keyword : keywordList)
				patternBuf.append(keyword.getKeyword() + "|"); // 以 | 分隔
			patternBuf.deleteCharAt(patternBuf.length() - 1);
			if (patternBuf.length() > 0) {
				Pattern pattern = Pattern.compile(patternBuf.toString());
				try {
					Matcher m = pattern.matcher(news.getTitle() + " " + news.getSummary());
					if (m.find())
						return false;
				} catch (Exception e) {
					logger.error("ERROR IN checkNewsLegal!", e);
				}
			}
		}
		return true;
	}

	public int removeIllegalNews() {
		int removeCount = 0;
		List<Keyword> keywordList = keywordManager.getAllEnableByType(TypeEnums.NEWS);
		if (keywordList != null && !keywordList.isEmpty()) {
			StringBuffer patternBuf = new StringBuffer();
			for (Keyword keyword : keywordList)
				patternBuf.append(keyword.getKeyword() + "|"); // 以 | 分隔
			patternBuf.deleteCharAt(patternBuf.length() - 1);
			if (patternBuf.length() > 0) {
				Pattern pattern = Pattern.compile(patternBuf.toString());
				List<News> newsList = newsDao.getAll();
				if (newsList != null && !newsList.isEmpty())
					for (News news : newsList) {
						try {
							Matcher m = pattern.matcher(news.getTitle() + " " + news.getSummary());
							if (m.find()) {
								deleteNews(news);
								removeCount++;
							}
						} catch (Exception e) {
							logger.error("ERROR IN removeilLegalNews!", e);
						}
					}
			}
		}
		return removeCount;
	}

	@Transactional(readOnly = true)
	public List<News> parseNewsList(Device device, int newsNum) {
		List<News> newsList = new ArrayList<News>();
		if (newsNum > 0) {
			// 以二级列表的方式按分类存储新闻
			List<List<News>> newsListList = getNewsListListByDevice(device, newsNum);
			for (int i = 0; i < newsNum; i++) {
				List<News> currNewsList = new ArrayList<News>();
				// 如果当前分类已经没有新闻则移除当前分类并取得下一个分类
				while (newsListList.size() > 0 && currNewsList.size() <= 0) {
					newsListList.remove(currNewsList);
					// 取出对应分类的新闻列表
					if (newsListList.size() > 0)
						currNewsList = newsListList.get(i % newsListList.size());
				}
				if (currNewsList.size() > 0) {
					// 取出对应分类中的第一条新闻
					News news = currNewsList.remove(0);
					// 如果待推送的新闻列表中已经包含该条新闻则取下一条
					while (newsList.contains(news)) {
						// 判断该分类中是否还有新闻，如果没有了则移除并取得下一个分类
						while (newsListList.size() > 0 && currNewsList.size() <= 0) {
							newsListList.remove(currNewsList);
							if (newsListList.size() > 0)
								currNewsList = newsListList.get(i % newsListList.size());
						}
						if (currNewsList.size() > 0)
							news = currNewsList.remove(0);
					}
					if (!newsList.contains(news))
						newsList.add(news);
				}
			}
		}
		return newsList;
	}

	@Transactional(readOnly = true)
	public JSONArray parseNewsToJson(List<News> newsList) {
		JSONArray jsonArray = new JSONArray();
		if (newsList != null && !newsList.isEmpty())
			for (News news : newsList) {
				JSONObject jsonObject = new JSONObject();
				try {
					jsonObject.put("urlId", String.valueOf(news.getId()));
					jsonObject.put("rssId", String.valueOf(news.getRss().getId()));
					jsonObject.put("title", news.getTitle().replace(" ", "").replace("\u3000", ""));
					jsonObject.put("url", news.getLink());
					String imageUrl = news.getImage();
					if (imageUrl != null && !imageUrl.trim().equals("")) {
						jsonObject.put("image_url", imageUrl);
						if (news.getImageWidth() != null && news.getImageHeight() != null) {
							jsonObject.put("image_width", news.getImageWidth());
							jsonObject.put("image_height", news.getImageHeight());
						}
					}
					jsonObject.put("description", news.getSummary());
				} catch (JSONException e) {
					logger.error("ERROR IN NewsManager.parseNewsToJson()", e);
				}
				jsonArray.put(jsonObject);
			}
		// String jsonStr = filter(jsonStr);
		return jsonArray;
	}

	public NewsDao getNewsDao() {
		return newsDao;
	}

	@Autowired
	public void setNewsDao(NewsDao newsDao) {
		this.newsDao = newsDao;
	}

	public NewsLayoutManager getNewsLayoutManager() {
		return newsLayoutManager;
	}

	@Autowired
	public void setNewsLayoutManager(NewsLayoutManager newsLayoutManager) {
		this.newsLayoutManager = newsLayoutManager;
	}

	public DeviceManager getDeviceManager() {
		return deviceManager;
	}

	@Autowired
	public void setDeviceManager(DeviceManager deviceManager) {
		this.deviceManager = deviceManager;
	}

	public RssManager getRssManager() {
		return rssManager;
	}

	@Autowired
	public void setRssManager(RssManager rssManager) {
		this.rssManager = rssManager;
	}

	public KeywordManager getKeywordManager() {
		return keywordManager;
	}

	@Autowired
	public void setKeywordManager(KeywordManager keywordManager) {
		this.keywordManager = keywordManager;
	}
}
