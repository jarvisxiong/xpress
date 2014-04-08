package com.nokia.xpress.now.entity.common;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.nokia.xpress.now.entity.IdEntity;

/**
 * filter keyword entity
 * 
 * @author hesy
 * 
 */
@Entity
// 表名与类名不相同时重新定义表名.
@Table(name = "xpress_keyword")
// 默认的缓存策略.
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Keyword extends IdEntity implements Serializable {
	private static final long serialVersionUID = 4536604867774921335L;
	private String keyword;
	private Integer type;
	private Boolean enable;
	private Date createDate;
	private Date modifyDate;

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Boolean getEnable() {
		return enable;
	}

	public void setEnable(Boolean enable) {
		this.enable = enable;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getModifyDate() {
		return modifyDate;
	}

	public void setModifyDate(Date modifyDate) {
		this.modifyDate = modifyDate;
	}

	@Override
	public String toString() {
		return "Keyword [keyword=" + keyword + "]";
	}
}
