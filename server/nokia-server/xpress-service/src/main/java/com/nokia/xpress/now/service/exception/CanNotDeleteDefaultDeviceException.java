package com.nokia.xpress.now.service.exception;

public class CanNotDeleteDefaultDeviceException extends NokiaException {
	private static final long serialVersionUID = -2767165303804564924L;

	public CanNotDeleteDefaultDeviceException() {
		super();
	}

	public CanNotDeleteDefaultDeviceException(String message) {
		super(message);
	}

	public CanNotDeleteDefaultDeviceException(Throwable cause) {
		super(cause);
	}

	public CanNotDeleteDefaultDeviceException(String message, Throwable cause) {
		super(message, cause);
	}
}
