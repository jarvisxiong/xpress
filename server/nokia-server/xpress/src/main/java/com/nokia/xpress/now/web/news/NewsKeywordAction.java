package com.nokia.xpress.now.web.news;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.web.CrudActionSupport;
import com.nokia.xpress.now.web.common.KeywordAction;

@Namespace("/news")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "news-keyword.action", type = "redirect") })
public class NewsKeywordAction extends KeywordAction {
	private static final long serialVersionUID = -6666309635531739447L;

	@Override
	public String list() throws Exception {
		type = TypeEnums.NEWS.getValue();
		return super.list();
	}

	@Override
	public String importFile() {
		type = TypeEnums.NEWS.getValue();
		return super.importFile();
	}

	@Override
	public String exportFile() throws Exception {
		type = TypeEnums.NEWS.getValue();
		return super.exportFile();
	}

	@Override
	protected void prepareModel() throws Exception {
		type = TypeEnums.NEWS.getValue();
		super.prepareModel();
	}

	/**
	 * 支持使用Jquery.validate Ajax检验关键字是否重复.
	 */
	@Override
	public String checkKeyword() {
		type = TypeEnums.NEWS.getValue();
		return super.checkKeyword();
	}
}
