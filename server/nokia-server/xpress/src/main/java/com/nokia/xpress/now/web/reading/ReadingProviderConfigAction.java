package com.nokia.xpress.now.web.reading;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.web.CrudActionSupport;
import com.nokia.xpress.now.web.common.ProviderConfigAction;

@Namespace("/reading")
@Results({ @Result(name = CrudActionSupport.RELOAD, location = "reading-provider-config.action", type = "redirect") })
public class ReadingProviderConfigAction extends ProviderConfigAction {
	private static final long serialVersionUID = -5403815625383923644L;

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

	@Override
	public String checkDeviceId() {
		type = TypeEnums.READING.getValue();
		return super.checkDeviceId();
	}
}
