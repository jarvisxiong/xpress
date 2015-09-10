package com.nokia.xpress.now.service.common;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.dao.common.KeywordDao;
import com.nokia.xpress.now.entity.common.Keyword;
import com.nokia.xpress.now.service.EntityManagement;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class KeywordManager extends EntityManagement<Keyword, Long> {
	@Autowired
	private KeywordDao keywordDao;

	@Override
	protected HibernateDao<Keyword, Long> getEntityDao() {
		return keywordDao;
	}

	public KeywordDao getKeywordDao() {
		return keywordDao;
	}

	public void setKeywordDao(KeywordDao keywordDao) {
		this.keywordDao = keywordDao;
	}

	public List<Keyword> txtFileToObject(File file, Integer type) throws IOException {
		List<Keyword> keywordList = new ArrayList<Keyword>();
		BufferedReader br = null;
		try {
			br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
			String line = null;
			while ((line = br.readLine()) != null) {
				Keyword keyword = new Keyword();
				keyword.setCreateDate(new Date());
				keyword.setEnable(true);
				keyword.setModifyDate(new Date());
				keyword.setKeyword(line.trim());
				keyword.setType(type);
				keywordList.add(keyword);
			}
		} finally {
			if (br != null)
				try {
					br.close();
				} catch (Exception e) {
				}
		}
		return keywordList;
	}

	public String writeToBuffer(Integer type) {
		String content = "";
		String enter = "\r\n";
		String SPLIT_CHAR = ",";
		StringBuilder write = new StringBuilder();
		write.append("ID|NAME|ENABLE");
		write.append(enter);
		List<Keyword> keywordList = keywordDao.getAllByType(type);
		try {
			for (Keyword keyword : keywordList) {
				write.append(keyword.getId());
				write.append(SPLIT_CHAR);
				write.append(keyword.getKeyword());
				write.append(SPLIT_CHAR);
				write.append(keyword.getEnable());
				write.append(enter);
			}
			content = write.toString();
			write = null;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return content;
	}

	public int saveList(List<Keyword> keywordList) {
		int savedCount = 0;
		if (keywordList != null && !keywordList.isEmpty()) {
			for (Keyword keyword : keywordList) {
				if (keyword != null) {
					String keywordStr = keyword.getKeyword();
					if (keywordStr != null && !keywordStr.trim().equals("") && keywordStr.length() <= ProjectConfig.KEYWORD_MAX_LENGTH) {
						try {
							Keyword keywordInDB = keywordDao.findUniqueBy("keyword", keywordStr);
							if (keywordInDB == null) {
								keywordDao.save(keyword);
								savedCount++;
							} else if (!keywordInDB.getEnable()) {
								keywordInDB.setEnable(true);
								keywordInDB.setModifyDate(new Date());
								keywordDao.save(keywordInDB);
								savedCount++;
							}
						} catch (Exception e) {
							logger.error(e.getMessage(), e);
						}
					}
				}
			}
		}
		return savedCount;
	}

	@Transactional(readOnly = true)
	public boolean isKeywordUnique(Integer type, String newKeyword, String oldKeyword) {
		return keywordDao.isKeywordUnique(type, newKeyword, oldKeyword);
	}

	@Transactional(readOnly = true)
	public List<Keyword> getAllByType(int type) {
		return keywordDao.getAllByType(type);
	}

	@Transactional(readOnly = true)
	public Keyword getById(Long id) {
		return keywordDao.getById(id);
	}

	@Transactional(readOnly = true)
	public List<Keyword> getAllEnableByType(TypeEnums type) {
		return keywordDao.getAllEnableByType(type);
	}

	@Transactional(readOnly = true)
	public List<Keyword> getAllEnable() {
		return keywordDao.findBy("enable", true);
	}
}
