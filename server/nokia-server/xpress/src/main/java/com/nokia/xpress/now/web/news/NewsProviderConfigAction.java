package com.nokia.xpress.now.web.news;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.web.CrudActionSupport;
import com.nokia.xpress.now.web.common.ProviderConfigAction;

@Namespace("/news")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "news-provider-config.action", type = "redirect") })
public class NewsProviderConfigAction extends ProviderConfigAction {
	private static final long serialVersionUID = 8041195894368870640L;

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

	@Override
	public String checkDeviceId() {
		type = TypeEnums.NEWS.getValue();
		return super.checkDeviceId();
	}
}
