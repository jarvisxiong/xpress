package com.nokia.xpress.now.service.exception;

public class NokiaException extends ServiceException {
	private static final long serialVersionUID = 3990070105835942265L;

	public NokiaException() {
		super();
	}

	public NokiaException(String message) {
		super(message);
	}

	public NokiaException(Throwable cause) {
		super(cause);
	}

	public NokiaException(String message, Throwable cause) {
		super(message, cause);
	}
}
