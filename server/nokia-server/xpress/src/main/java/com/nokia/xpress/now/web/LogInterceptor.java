package com.nokia.xpress.now.web;

import java.lang.reflect.Method;
import java.util.Date;

import org.apache.struts2.convention.annotation.Action;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springside.modules.security.springsecurity.SpringSecurityUtils;

import com.nokia.xpress.now.entity.account.User;
import com.nokia.xpress.now.entity.common.XpressLog;
import com.nokia.xpress.now.service.account.AccountManager;
import com.nokia.xpress.now.service.common.AdvertisementManager;
import com.nokia.xpress.now.service.common.DeviceManager;
import com.nokia.xpress.now.service.common.KeywordManager;
import com.nokia.xpress.now.service.common.ProviderConfigManager;
import com.nokia.xpress.now.service.common.XpressLogManager;
import com.nokia.xpress.now.service.news.NewsLayoutManager;
import com.nokia.xpress.now.service.news.RssManager;
import com.nokia.xpress.now.service.reading.QidianBookManager;
import com.nokia.xpress.now.service.reading.QidianLayoutManager;

@Aspect
@Component
public class LogInterceptor {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	private AccountManager accManager;
	private XpressLogManager xpressLogManager;

	@Pointcut("execution(public * com.nokia.xpress.now.service..*.save*(..))")
	public void saveMethod() {
	}

	@Pointcut("execution(public * com.nokia.xpress.now.service..*.delete*(..))")
	public void deleteMethod() {
	}

	@AfterReturning("saveMethod()||deleteMethod()")
	public void doAfter(JoinPoint point) {
		try {
			Object target = point.getTarget();
			if ((target instanceof AccountManager) || (target instanceof DeviceManager) || (target instanceof NewsLayoutManager) || (target instanceof QidianLayoutManager) || (target instanceof RssManager) || (target instanceof KeywordManager) || (target instanceof AdvertisementManager) || (target instanceof ProviderConfigManager) || (target instanceof QidianBookManager)) {
				String className = target.getClass().getCanonicalName();
				String methodName = point.getSignature().getName();
				String paramStr = "";
				Object[] args = point.getArgs();
				if (args != null && args.length > 0) {
					for (Object object : args)
						paramStr += object + ",";
				}
				if (!paramStr.equals(""))
					paramStr = paramStr.substring(0, paramStr.length() - 1);
				String description = className + "." + methodName + "(" + paramStr + ")";
				log(description);
			}
		} catch (Exception e) {
			logger.warn(e.getMessage(), e);
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void doActionAfter(JoinPoint jp) {
		String methodName = jp.getSignature().getName();
		if (methodName != null && !(methodName.startsWith("set") || methodName.startsWith("get") || methodName.startsWith("check"))) {
			Class targetClass = jp.getTarget().getClass();
			try {
				Method method = targetClass.getMethod(methodName);
				if (method != null) {
					boolean hasAnnotation = method.isAnnotationPresent(Action.class);
					if (hasAnnotation) {
						Action annotation = method.getAnnotation(Action.class);
						log(annotation.value());
					}
				}
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
			}
		}
	}

	public void log(String description) throws Exception {
		String loginName = SpringSecurityUtils.getCurrentUserName();
		if (loginName != null && !loginName.trim().equals("")) {
			User user = accManager.findUserByLoginName(loginName);
			if (user != null) {
				XpressLog xpressLog = new XpressLog();
				xpressLog.setUser(user);
				xpressLog.setDescription(description);
				xpressLog.setOperDate(new Date());
				xpressLogManager.save(xpressLog);
			}
		}
	}

	@Autowired
	public void setAccManager(AccountManager accManager) {
		this.accManager = accManager;
	}

	@Autowired
	public void setXpressLogManager(XpressLogManager xpressLogManager) {
		this.xpressLogManager = xpressLogManager;
	}
}
