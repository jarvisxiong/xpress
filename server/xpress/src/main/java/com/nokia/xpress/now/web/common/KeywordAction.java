package com.nokia.xpress.now.web.common;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileCopyUtils;
import org.springside.modules.orm.Page;
import org.springside.modules.orm.PropertyFilter;
import org.springside.modules.utils.web.ServletUtils;
import org.springside.modules.utils.web.struts2.Struts2Utils;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.common.util.JquertAjaxUtil;
import com.nokia.xpress.now.entity.common.Keyword;
import com.nokia.xpress.now.service.common.KeywordManager;
import com.nokia.xpress.now.service.common.RemoveIllegalNewsThread;
import com.nokia.xpress.now.service.common.RemoveIllegalReadingThread;
import com.nokia.xpress.now.service.common.RemoveIllegalVideoThread;
import com.nokia.xpress.now.service.news.NewsManager;
import com.nokia.xpress.now.service.reading.QidianBookChapterManager;
import com.nokia.xpress.now.service.reading.QidianBookManager;
import com.nokia.xpress.now.web.CrudActionSupport;

public class KeywordAction extends CrudActionSupport<Keyword> {
	private static final long serialVersionUID = 441774720302870484L;
	protected Long id;
	protected Integer type;
	protected Keyword keyword;
	protected KeywordManager keywordManager;
	protected NewsManager newsManager;
	protected QidianBookManager qidianBookManager;
	protected QidianBookChapterManager qidianBookChapterManager;
	protected Page<Keyword> page = new Page<Keyword>(20);
	protected File file;
	protected String fileFileName;

	@Override
	public Keyword getModel() {
		return keyword;
	}

	@Override
	public String list() throws Exception {
		List<PropertyFilter> filters = PropertyFilter.buildFromHttpRequest(Struts2Utils.getRequest());
		if (type != null)
			filters.add(new PropertyFilter("EQI_type", type.toString()));
		if (!page.isOrderBySetted()) {
			page.setOrderBy("id");
			page.setOrder(Page.ASC);
		}
		page = keywordManager.find(page, filters);
		return SUCCESS;
	}

	@Override
	public String input() throws Exception {
		return INPUT;
	}

	@Override
	public String save() throws Exception {
		try {
			keyword.setKeyword(keyword.getKeyword().trim());
			keyword.setModifyDate(new Date());
			keywordManager.save(keyword);
			addActionMessage("Save keyword successfully");
			if (keyword.getEnable()) {
				if (type == TypeEnums.NEWS.getValue().intValue())
					new RemoveIllegalNewsThread(newsManager).start();
				else if (type == TypeEnums.READING.getValue().intValue())
					new RemoveIllegalReadingThread(qidianBookManager, qidianBookChapterManager).start();
				else if (type == TypeEnums.VIDEO.getValue().intValue())
					new RemoveIllegalVideoThread().start();
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Save keyword failed</font>");
		}
		return RELOAD;
	}

	@Override
	public String delete() throws Exception {
		try {
			keywordManager.delete(id);
			addActionMessage("Delete keyword successfully");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			addActionMessage("<font color=\"red\">Delete keyword failed</font>");
		}
		return RELOAD;
	}

	public String importFile() {
		if (file != null) {
			try {
				List<Keyword> keywordList = keywordManager.txtFileToObject(file, type);
				int savedCount = keywordManager.saveList(keywordList);
				if (savedCount > 0) {
					addActionMessage("Has import " + savedCount + " keyword successfully");
					if (type == TypeEnums.NEWS.getValue().intValue())
						new RemoveIllegalNewsThread(newsManager).start();
					else if (type == TypeEnums.READING.getValue().intValue())
						new RemoveIllegalReadingThread(qidianBookManager, qidianBookChapterManager).start();
					else if (type == TypeEnums.VIDEO.getValue().intValue())
						new RemoveIllegalVideoThread().start();
				} else
					addActionMessage("<font color=\"red\">None of keyword has imported</font>");
			} catch (Exception e) {
				logger.error("ERROR IN IMPORT KEYWORD", e);
				addActionMessage("<font color=\"red\">Import keyword failed</font>");
			}
		} else
			addActionMessage("<font color=\"red\">Please select a txt file</font>");
		return RELOAD;
	}

	public String exportFile() throws Exception {
		if (type != null) {
			HttpServletResponse response = Struts2Utils.getResponse();
			response.setContentType(ServletUtils.TEXT_TYPE);
			ServletUtils.setFileDownloadHeader(response, "keyword.txt");
			BufferedInputStream in = null;
			BufferedOutputStream out = null;
			try {
				String datas = keywordManager.writeToBuffer(type);
				in = new BufferedInputStream(new ByteArrayInputStream(datas.getBytes()));
				out = new BufferedOutputStream(response.getOutputStream());
				FileCopyUtils.copy(in, out);
				in.close();
				out.close();
				in = null;
				out = null;
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			} finally {
				if (in != null)
					try {
						in.close();
					} catch (Exception e) {
					}
				if (out != null)
					try {
						out.close();
					} catch (Exception e) {
					}
			}
			response.getOutputStream().flush();
		}
		return null;
	}

	public void prepareImportFile() throws Exception {
	}

	@Override
	protected void prepareModel() throws Exception {
		if (id == null) {
			keyword = new Keyword();
			keyword.setType(type);
			keyword.setCreateDate(new Date());
			keyword.setEnable(true);
		} else {
			keyword = keywordManager.get(id);
		}
	}

	/**
	 * 支持使用Jquery.validate Ajax检验关键字是否重复.
	 */
	public String checkKeyword() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String newKeyword = JquertAjaxUtil.parseText(request.getParameter("keyword"));
		// String typeStr = request.getParameter("type");
		// Integer type = null;
		// if (typeStr != null && !typeStr.trim().equals("")) {
		// try {
		// type = Integer.parseInt(typeStr);
		// } catch (NumberFormatException e) {
		// }
		// }
		if (newKeyword != null)
			newKeyword = newKeyword.trim();
		String oldKeyword = JquertAjaxUtil.parseText(request.getParameter("oldKeyword"));
		if (keywordManager.isKeywordUnique(type, newKeyword, oldKeyword))
			Struts2Utils.renderText("true");
		else
			Struts2Utils.renderText("false");
		return null;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	@Autowired
	public void setKeywordManager(KeywordManager keywordManager) {
		this.keywordManager = keywordManager;
	}

	@Autowired
	public void setNewsManager(NewsManager newsManager) {
		this.newsManager = newsManager;
	}

	public QidianBookManager getQidianBookManager() {
		return qidianBookManager;
	}

	@Autowired
	public void setQidianBookManager(QidianBookManager qidianBookManager) {
		this.qidianBookManager = qidianBookManager;
	}

	public QidianBookChapterManager getQidianBookChapterManager() {
		return qidianBookChapterManager;
	}

	@Autowired
	public void setQidianBookChapterManager(QidianBookChapterManager qidianBookChapterManager) {
		this.qidianBookChapterManager = qidianBookChapterManager;
	}

	public Page<Keyword> getPage() {
		return page;
	}

	public void setPage(Page<Keyword> page) {
		this.page = page;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public String getFileFileName() {
		return fileFileName;
	}

	public void setFileFileName(String fileFileName) {
		this.fileFileName = fileFileName;
	}
}
