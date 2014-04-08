package com.nokia.xpress.now.common.enums;

/**
 * 全局枚举状态值：1:新浪,2:搜狐,3:凤凰,4:百度
 */
public enum RSSEnums {
	SINA(1L), SOUHU(2L), IFENG(3L), BAIDU(4L);
	private Long value;

	RSSEnums(Long value) {
		this.value = value;
	}

	public Long getValue() {
		return value;
	}

	public void setValue(Long value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return value.toString();
	}
}
