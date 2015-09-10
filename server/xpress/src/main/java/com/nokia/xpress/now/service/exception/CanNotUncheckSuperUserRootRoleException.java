package com.nokia.xpress.now.service.exception;

public class CanNotUncheckSuperUserRootRoleException extends NokiaException {
	private static final long serialVersionUID = 3722220718045455292L;

	public CanNotUncheckSuperUserRootRoleException() {
		super();
	}

	public CanNotUncheckSuperUserRootRoleException(String message) {
		super(message);
	}

	public CanNotUncheckSuperUserRootRoleException(Throwable cause) {
		super(cause);
	}

	public CanNotUncheckSuperUserRootRoleException(String message, Throwable cause) {
		super(message, cause);
	}
}
