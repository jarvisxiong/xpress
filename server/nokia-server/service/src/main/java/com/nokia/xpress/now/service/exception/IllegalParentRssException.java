package com.nokia.xpress.now.service.exception;

public class IllegalParentRssException extends NokiaException {
	private static final long serialVersionUID = -3212639827924824798L;

	public IllegalParentRssException() {
		super();
	}

	public IllegalParentRssException(String message) {
		super(message);
	}

	public IllegalParentRssException(Throwable cause) {
		super(cause);
	}

	public IllegalParentRssException(String message, Throwable cause) {
		super(message, cause);
	}
}
