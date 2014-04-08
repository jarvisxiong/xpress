package com.nokia.xpress.now.entity.news;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.nokia.xpress.now.entity.IdEntity;

@Entity
@Table(name = "xpress_rss")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.hibernate.annotations.Entity(dynamicUpdate = true, dynamicInsert = true)
public class Rss extends IdEntity implements Serializable {
	private static final long serialVersionUID = 940073043802712687L;
	private Rss rss;
	private String name;
	private String path;
	private String link;
	private Long allClickNum;
	private Date createDate;
	private Date modifyDate;
	private Boolean enable;
	private String description;
	private Map<Long, Rss> childRss = new HashMap<Long, Rss>();

	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	@OrderBy("id")
	public Rss getRss() {
		return rss;
	}

	public void setRss(Rss rss) {
		this.rss = rss;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public Long getAllClickNum() {
		return allClickNum;
	}

	public void setAllClickNum(Long allClickNum) {
		this.allClickNum = allClickNum;
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

	public Boolean getEnable() {
		return enable;
	}

	public void setEnable(Boolean enable) {
		this.enable = enable;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Transient
	public Map<Long, Rss> getChildRss() {
		return childRss;
	}

	public void setChildRss(Map<Long, Rss> childRss) {
		this.childRss = childRss;
	}

	public void addChildRss(Rss childRss) {
		this.childRss.put(childRss.getId(), childRss);
	}

	public Rss getChildRss(Long id) {
		return this.childRss.get(id);
	}

	@Override
	public String toString() {
		return "Rss [id=" + id + ", name=" + name + ", link=" + link + "]";
	}
}
