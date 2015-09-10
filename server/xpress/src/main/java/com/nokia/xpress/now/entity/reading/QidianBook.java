package com.nokia.xpress.now.entity.reading;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.nokia.xpress.now.entity.IdEntity;

@Entity
@Table(name = "qidian_book")
@org.hibernate.annotations.Entity(dynamicUpdate = true, dynamicInsert = true)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class QidianBook extends IdEntity implements Serializable {
	private static final long serialVersionUID = 1597081909638101477L;
	private Integer type;
	private Long bookId;
	private String name;
	private String bookUrl;
	private QidianCategory category;
	private Long categoryId;
	private Long authorId;
	private String authorName;
	private String authorUrl;
	private String cover;
	private Integer imageWidth;
	private Integer imageHeight;
	private Long lastUpdateChapterId;
	private String lastUpdateChapterName;
	private Long voteMonth;
	private Long recommend;
	private String actStatus;
	private String description;
	private Date createDate;
	private Date modifyDate;
	private Boolean enable;
	private Set<QidianBookChapter> chapters;
	private Set<QidianLastRead> lastReads;

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Long getBookId() {
		return bookId;
	}

	public void setBookId(Long bookId) {
		this.bookId = bookId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBookUrl() {
		return bookUrl;
	}

	public void setBookUrl(String bookUrl) {
		this.bookUrl = bookUrl;
	}

	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
	@JoinColumn(name = "cid")
	public QidianCategory getCategory() {
		return category;
	}

	public void setCategory(QidianCategory category) {
		this.category = category;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public Long getAuthorId() {
		return authorId;
	}

	public void setAuthorId(Long authorId) {
		this.authorId = authorId;
	}

	public String getAuthorName() {
		return authorName;
	}

	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}

	public String getAuthorUrl() {
		return authorUrl;
	}

	public void setAuthorUrl(String authorUrl) {
		this.authorUrl = authorUrl;
	}

	public String getCover() {
		return cover;
	}

	public void setCover(String cover) {
		this.cover = cover;
	}

	public Integer getImageWidth() {
		return imageWidth;
	}

	public void setImageWidth(Integer imageWidth) {
		this.imageWidth = imageWidth;
	}

	public Integer getImageHeight() {
		return imageHeight;
	}

	public void setImageHeight(Integer imageHeight) {
		this.imageHeight = imageHeight;
	}

	public Long getLastUpdateChapterId() {
		return lastUpdateChapterId;
	}

	public void setLastUpdateChapterId(Long lastUpdateChapterId) {
		this.lastUpdateChapterId = lastUpdateChapterId;
	}

	public String getLastUpdateChapterName() {
		return lastUpdateChapterName;
	}

	public void setLastUpdateChapterName(String lastUpdateChapterName) {
		this.lastUpdateChapterName = lastUpdateChapterName;
	}

	public Long getVoteMonth() {
		return voteMonth;
	}

	public void setVoteMonth(Long voteMonth) {
		this.voteMonth = voteMonth;
	}

	public Long getRecommend() {
		return recommend;
	}

	public void setRecommend(Long recommend) {
		this.recommend = recommend;
	}

	public String getActStatus() {
		return actStatus;
	}

	public void setActStatus(String actStatus) {
		this.actStatus = actStatus;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	@OneToMany(mappedBy = "book", cascade = { CascadeType.ALL })
	@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
	public Set<QidianBookChapter> getChapters() {
		return chapters;
	}

	public void setChapters(Set<QidianBookChapter> chapters) {
		this.chapters = chapters;
	}

	@OneToMany(mappedBy = "book", cascade = { CascadeType.ALL })
	@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
	public Set<QidianLastRead> getLastReads() {
		return lastReads;
	}

	public void setLastReads(Set<QidianLastRead> lastReads) {
		this.lastReads = lastReads;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		QidianBook other = (QidianBook) obj;
		if (actStatus == null) {
			if (other.actStatus != null)
				return false;
		} else if (!actStatus.equals(other.actStatus))
			return false;
		if (voteMonth == null) {
			if (other.voteMonth != null)
				return false;
		} else if (!voteMonth.equals(other.voteMonth))
			return false;
		if (lastUpdateChapterId == null) {
			if (other.lastUpdateChapterId != null)
				return false;
		} else if (!lastUpdateChapterId.equals(other.lastUpdateChapterId))
			return false;
		if (lastUpdateChapterName == null) {
			if (other.lastUpdateChapterName != null)
				return false;
		} else if (!lastUpdateChapterName.equals(other.lastUpdateChapterName))
			return false;
		if (authorId == null) {
			if (other.authorId != null)
				return false;
		} else if (!authorId.equals(other.authorId))
			return false;
		if (authorName == null) {
			if (other.authorName != null)
				return false;
		} else if (!authorName.equals(other.authorName))
			return false;
		if (authorUrl == null) {
			if (other.authorUrl != null)
				return false;
		} else if (!authorUrl.equals(other.authorUrl))
			return false;
		if (bookId == null) {
			if (other.bookId != null)
				return false;
		} else if (!bookId.equals(other.bookId))
			return false;
		if (bookUrl == null) {
			if (other.bookUrl != null)
				return false;
		} else if (!bookUrl.equals(other.bookUrl))
			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (cover == null) {
			if (other.cover != null)
				return false;
		} else if (!cover.equals(other.cover))
			return false;
		if (enable == null) {
			if (other.enable != null)
				return false;
		} else if (!enable.equals(other.enable))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "QidianBook [id=" + id + ", name=" + name + ", voteMonth=" + voteMonth + ", recommend=" + recommend + "]";
	}
}
