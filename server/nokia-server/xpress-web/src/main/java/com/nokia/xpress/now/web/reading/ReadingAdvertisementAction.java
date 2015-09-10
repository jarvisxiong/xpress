package com.nokia.xpress.now.web.reading;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.web.CrudActionSupport;
import com.nokia.xpress.now.web.common.AdvertisementAction;

@Namespace("/reading")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "reading-advertisement.action", type = "redirect") })
public class ReadingAdvertisementAction extends AdvertisementAction {
	private static final long serialVersionUID = 5847008705268327685L;

	@Override
	public String list() throws Exception {
		type = TypeEnums.READING.getValue();
		return super.list();
	}

	@Override
	protected void prepareModel() throws Exception {
		type = TypeEnums.READING.getValue();
		super.prepareModel();
	}
}
