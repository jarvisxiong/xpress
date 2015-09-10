package com.nokia.xpress.now.service.exception;

public class CanNotOperSuperUserException extends NokiaException {
	private static final long serialVersionUID = 2987369932313744314L;

	public CanNotOperSuperUserException() {
		super();
	}

	public CanNotOperSuperUserException(String message) {
		super(message);
	}

	public CanNotOperSuperUserException(Throwable cause) {
		super(cause);
	}

	public CanNotOperSuperUserException(String message, Throwable cause) {
		super(message, cause);
	}
}
