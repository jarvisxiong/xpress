package com.nokia.xpress.now.service.exception;

public class CanNotModifyRoleOfSelfException extends NokiaException {
	private static final long serialVersionUID = -164196692174232840L;

	public CanNotModifyRoleOfSelfException() {
		super();
	}

	public CanNotModifyRoleOfSelfException(String message) {
		super(message);
	}

	public CanNotModifyRoleOfSelfException(Throwable cause) {
		super(cause);
	}

	public CanNotModifyRoleOfSelfException(String message, Throwable cause) {
		super(message, cause);
	}
}
