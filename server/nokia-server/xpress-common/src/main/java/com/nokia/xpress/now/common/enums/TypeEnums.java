package com.nokia.xpress.now.common.enums;

/**
 * 全局枚举模块值：1:News; 2:Reading; 3:Video
 */
public enum TypeEnums {
	NEWS(1), READING(2), VIDEO(3);
	private Integer value;

	TypeEnums(Integer value) {
		this.value = value;
	}

	public Integer getValue() {
		return value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}
}
