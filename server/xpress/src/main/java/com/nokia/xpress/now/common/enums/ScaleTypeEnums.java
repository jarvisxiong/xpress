package com.nokia.xpress.now.common.enums;

/**
 * 全局枚举模块值：1：变形填充压缩;2: 不留白边等比例压缩;3:留白边等比例压缩;4:先压缩再截取或拉伸
 */
public enum ScaleTypeEnums {
	FILL(1), RATIO(2), RATIO_WHITE(3), RATIO_CUT(4);
	private Integer value;

	ScaleTypeEnums(Integer value) {
		this.value = value;
	}

	public Integer getValue() {
		return value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}
}
