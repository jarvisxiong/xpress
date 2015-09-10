package com.nokia.xpress.now.service.exception;

public class CanNotModifyDefaultDeviceUAException extends NokiaException {
	private static final long serialVersionUID = 5731634393148025396L;

	public CanNotModifyDefaultDeviceUAException() {
		super();
	}

	public CanNotModifyDefaultDeviceUAException(String message) {
		super(message);
	}

	public CanNotModifyDefaultDeviceUAException(Throwable cause) {
		super(cause);
	}

	public CanNotModifyDefaultDeviceUAException(String message, Throwable cause) {
		super(message, cause);
	}
}
