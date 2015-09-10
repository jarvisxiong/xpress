package com.nokia.xpress.now.service.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RemoveIllegalVideoThread extends Thread {
	private static Logger logger = LoggerFactory.getLogger(RemoveIllegalVideoThread.class);

	public RemoveIllegalVideoThread() {
	}

	@Override
	public void run() {
		try {
		} catch (Exception e) {
			logger.error("ERROR IN RemoveIllegalVideoThread", e);
		}
	}
}
