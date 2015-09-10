package com.nokia.xpress.now.common.enums;

/**
 * 全局枚举状态值：1:起点网,2:易读网
 */
public enum ReadingEnums {
	QIDIAN(1), EZREAD(2);
	private Integer value;

	ReadingEnums(Integer value) {
		this.value = value;
	}

	public Integer getValue() {
		return value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return value.toString();
	}
}
