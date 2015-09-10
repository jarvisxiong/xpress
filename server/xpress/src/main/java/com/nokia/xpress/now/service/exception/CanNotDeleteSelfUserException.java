package com.nokia.xpress.now.service.exception;

public class CanNotDeleteSelfUserException extends NokiaException {
	private static final long serialVersionUID = -9175663541855307955L;

	public CanNotDeleteSelfUserException() {
		super();
	}

	public CanNotDeleteSelfUserException(String message) {
		super(message);
	}

	public CanNotDeleteSelfUserException(Throwable cause) {
		super(cause);
	}

	public CanNotDeleteSelfUserException(String message, Throwable cause) {
		super(message, cause);
	}
}
