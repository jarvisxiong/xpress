package com.nokia.xpress.now.service.exception;

public class IllegalInvokeException extends NokiaException {
	private static final long serialVersionUID = -5791577548434646753L;

	public IllegalInvokeException() {
		super();
	}

	public IllegalInvokeException(String message) {
		super(message);
	}

	public IllegalInvokeException(Throwable cause) {
		super(cause);
	}

	public IllegalInvokeException(String message, Throwable cause) {
		super(message, cause);
	}
}
