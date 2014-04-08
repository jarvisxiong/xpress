package com.nokia.xpress.now.web.reading;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.web.CrudActionSupport;
import com.nokia.xpress.now.web.common.KeywordAction;

@Namespace("/reading")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "reading-keyword.action", type = "redirect") })
public class ReadingKeywordAction extends KeywordAction {
	private static final long serialVersionUID = -6666309635531739447L;

	@Override
	public String list() throws Exception {
		type = TypeEnums.READING.getValue();
		return super.list();
	}

	@Override
	public String importFile() {
		type = TypeEnums.READING.getValue();
		return super.importFile();
	}

	@Override
	public String exportFile() throws Exception {
		type = TypeEnums.READING.getValue();
		return super.exportFile();
	}

	@Override
	protected void prepareModel() throws Exception {
		type = TypeEnums.READING.getValue();
		super.prepareModel();
	}

	/**
	 * 支持使用Jquery.validate Ajax检验关键字是否重复.
	 */
	@Override
	public String checkKeyword() {
		type = TypeEnums.READING.getValue();
		return super.checkKeyword();
	}
}
