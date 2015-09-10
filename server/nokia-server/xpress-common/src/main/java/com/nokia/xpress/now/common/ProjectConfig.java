package com.nokia.xpress.now.common;

import java.io.File;
import java.io.IOException;
import java.text.MessageFormat;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProjectConfig {
	private static Logger logger = LoggerFactory.getLogger(ProjectConfig.class);
	/**
	 * 关键字长度限制
	 */
	public static final int KEYWORD_MAX_LENGTH = 64;
	/**
	 * 新闻分类ID路径的分隔符
	 */
	public static final String RSS_PATH_SEPARATOR = ",";
	/**
	 * 默认设备的ID
	 */
	public static final Long DEFAULT_DEVICE_ID = 0L;
	/**
	 * 默认设备的UA
	 */
	public static final String DEFAULT_DEVICE_UA = "default";
	/**
	 * root用户的ID
	 */
	public static final Long ROOT_USER_ID = 1L;
	/**
	 * root用户的角色
	 */
	public static final Long ROOT_ROLE_ID = 1L;
	private static final String IMAGE_NEWS_PATH = "news/image";
	private static final String IMAGE_QIDIANBOOK_PATH = "book/image";
	private static final String IMAGE_VIDEO_PATH = "video/image";
	private static Properties instance;

	private ProjectConfig() {
	}

	private static Properties getInstance() {
		if (instance == null) {
			synchronized (ProjectConfig.class) {
				if (instance == null) {
					instance = new Properties();
					try {
						instance.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("project.properties"));
					} catch (IOException e) {
						logger.error("ERROR IN ProjectConfig.getInstance()", e);
					}
				}
			}
		}
		return instance;
	}

	public static String get(String key) {
		return getInstance().getProperty(key);
	}

	public static String get(String key, String defaultValue) {
		return getInstance().getProperty(key, defaultValue);
	}

	public static String getProperty(String key, Object... args) {
		MessageFormat format = new MessageFormat(get(key));
		return format.format(args);
	}

	public static Integer getInt(String key) {
		return Integer.parseInt(getInstance().getProperty(key, "0"));
	}

	public static Integer getInt(String key, String defaultValue) {
		return Integer.parseInt(getInstance().getProperty(key, defaultValue));
	}

	public static Long getLong(String key) {
		return Long.parseLong(getInstance().getProperty(key));
	}

	public static Boolean getBoolean(String key) {
		return Boolean.parseBoolean(getInstance().getProperty(key));
	}

	public static Boolean getBoolean(String key, Boolean defaultValue) {
		return Boolean.parseBoolean(getInstance().getProperty(key, defaultValue.toString()));
	}

	/**
	 * 数据库中每个分类保存的新闻条数
	 */
	public static int getNewsRemainNum() {
		return getInt("NEWS_REMAIN_NUM");
	}

	/**
	 * 向手机端推送新闻的总默认条数
	 */
	public static int getNewsNumPull() {
		return getInt("NEWS_NUM_PULL");
	}

	/**
	 * 向手机端推送新闻的每页默认条数
	 */
	public static int getNewsNumPerPage() {
		return getInt("NEWS_NUM_PER_PAGE");
	}

	/**
	 * 数据库中每个分类保存的阅读书籍数目
	 */
	public static int getReadingBookReaminNum() {
		return getInt("READING_BOOK_REMAIN_NUM");
	}

	/**
	 * 向手机端推送书籍的每页默认条数
	 */
	public static int getBookNumPerPage() {
		return getInt("BOOK_NUM_PER_PAGE");
	}

	/**
	 * 向手机端推送章节的每页默认条数
	 */
	public static int getChapterNumPerPage() {
		return getInt("CHAPTER_NUM_PER_PAGE");
	}

	/**
	 * 阅读章节内容每页字数
	 */
	public static int getReadingPageWordNum() {
		return getInt("READING_PAGE_WORD_NUM");
	}

	public static String getResourcePath() {
		String resourcePath = getInstance().getProperty("RESOURCE_PATH");
		if (!resourcePath.endsWith("/") && !resourcePath.endsWith("\\"))
			resourcePath += File.separator;
		return resourcePath;
		// return new File("").getCanonicalPath();
	}

	public static String getNewsImagePath() {
		String projectPath = getResourcePath();
		if (projectPath != null && !projectPath.trim().equals(""))
			return projectPath + IMAGE_NEWS_PATH;
		else
			return IMAGE_NEWS_PATH;
		// return getProjectPath() + File.separator + IMAGE_NEWS_PATH;
	}

	public static String getQidianBookImagePath() {
		String projectPath = getResourcePath();
		if (projectPath != null && !projectPath.trim().equals(""))
			return projectPath + IMAGE_QIDIANBOOK_PATH;
		else
			return IMAGE_QIDIANBOOK_PATH;
		// return getProjectPath() + File.separator + IMAGE_QIDIANBOOK_PATH;
	}

	public static String getVideoImagePath() {
		String projectPath = getResourcePath();
		if (projectPath != null && !projectPath.trim().equals(""))
			return projectPath + IMAGE_VIDEO_PATH;
		else
			return IMAGE_VIDEO_PATH;
		// return getProjectPath() + File.separator + IMAGE_VIDEO_PATH;
	}
}
