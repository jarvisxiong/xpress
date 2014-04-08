package com.nokia.xpress.now.entity.common;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.nokia.xpress.now.entity.IdEntity;
import com.nokia.xpress.now.entity.news.NewsLayout;
import com.nokia.xpress.now.entity.reading.QidianLayout;

@Entity
@Table(name = "xpress_device")
@org.hibernate.annotations.Entity(dynamicUpdate = true, dynamicInsert = true)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Device extends IdEntity implements Serializable {
	private static final long serialVersionUID = -2528455293978065477L;
	private String ua;
	private String deviceName;
	private Integer screenWidth;
	private Integer screenHeight;
	private Boolean showSetting;
	private String settingLink;
	private Date createDate;
	private Date modifyDate;
	private Boolean enable;
	private String description;
	private Set<NewsLayout> newsLayouts;
	private Set<QidianLayout> qidianLayouts;
	private Set<ProviderConfig> providerConfigs;

	public String getUa() {
		return ua;
	}

	public void setUa(String ua) {
		this.ua = ua;
	}

	public String getDeviceName() {
		return deviceName;
	}

	public void setDeviceName(String deviceName) {
		this.deviceName = deviceName;
	}

	public Integer getScreenWidth() {
		return screenWidth;
	}

	public void setScreenWidth(Integer screenWidth) {
		this.screenWidth = screenWidth;
	}

	public Integer getScreenHeight() {
		return screenHeight;
	}

	public void setScreenHeight(Integer screenHeight) {
		this.screenHeight = screenHeight;
	}

	public Boolean getShowSetting() {
		return showSetting;
	}

	public void setShowSetting(Boolean showSetting) {
		this.showSetting = showSetting;
	}

	public String getSettingLink() {
		return settingLink;
	}

	public void setSettingLink(String settingLink) {
		this.settingLink = settingLink;
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

	@OneToMany(mappedBy = "device", cascade = { CascadeType.ALL })
	@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
	public Set<NewsLayout> getNewsLayouts() {
		return newsLayouts;
	}

	public void setNewsLayouts(Set<NewsLayout> newsLayouts) {
		this.newsLayouts = newsLayouts;
	}

	@OneToMany(mappedBy = "device", cascade = { CascadeType.ALL })
	@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
	public Set<QidianLayout> getQidianLayouts() {
		return qidianLayouts;
	}

	public void setQidianLayouts(Set<QidianLayout> qidianLayouts) {
		this.qidianLayouts = qidianLayouts;
	}

	@OneToMany(mappedBy = "device", cascade = { CascadeType.ALL })
	@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
	public Set<ProviderConfig> getProviderConfigs() {
		return providerConfigs;
	}

	public void setProviderConfigs(Set<ProviderConfig> providerConfigs) {
		this.providerConfigs = providerConfigs;
	}

	@Override
	public String toString() {
		return "Device [id=" + id + ", ua=" + ua + ", deviceName=" + deviceName + "]";
	}
}
