package com.nokia.xpress.now.web.news;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.web.CrudActionSupport;
import com.nokia.xpress.now.web.common.AdvertisementAction;

@Namespace("/news")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "news-advertisement.action", type = "redirect") })
public class NewsAdvertisementAction extends AdvertisementAction {
	private static final long serialVersionUID = -744299931609932361L;

	@Override
	public String list() throws Exception {
		type = TypeEnums.NEWS.getValue();
		return super.list();
	}

	@Override
	protected void prepareModel() throws Exception {
		type = TypeEnums.NEWS.getValue();
		super.prepareModel();
	}
}
