package com.nokia.xpress.now.service.exception;

public class CanNotOperSuperRoleException extends NokiaException {
	private static final long serialVersionUID = 419330042707177582L;

	public CanNotOperSuperRoleException() {
		super();
	}

	public CanNotOperSuperRoleException(String message) {
		super(message);
	}

	public CanNotOperSuperRoleException(Throwable cause) {
		super(cause);
	}

	public CanNotOperSuperRoleException(String message, Throwable cause) {
		super(message, cause);
	}
}
