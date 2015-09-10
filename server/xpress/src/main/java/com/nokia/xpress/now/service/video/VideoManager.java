package com.nokia.xpress.now.service.video;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.dao.video.VideoDao;
import com.nokia.xpress.now.entity.video.Video;
import com.nokia.xpress.now.service.EntityManagement;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class VideoManager extends EntityManagement<Video, Long> {
	private VideoDao videoDao;

	@Override
	protected HibernateDao<Video, Long> getEntityDao() {
		return videoDao;
	}

	public VideoDao getVideoDao() {
		return videoDao;
	}

	@Autowired
	public void setVideoDao(VideoDao videoDao) {
		this.videoDao = videoDao;
	}

	public Video getById(Long id) {
		return videoDao.getById(id);
	}

	@Transactional(readOnly = true)
	public JSONArray parseVideoToJson(List<Video> videoList) {
		JSONArray jsonArray = new JSONArray();
		if (videoList != null && !videoList.isEmpty())
			for (Video video : videoList) {
				JSONObject jsonObject = new JSONObject();
				try {
					jsonObject.put("id", String.valueOf(video.getId()));
					jsonObject.put("title", video.getTitle());
					jsonObject.put("link", video.getLink());
					String imageUrl = video.getImage();
					if (imageUrl != null && !imageUrl.trim().equals("")) {
						jsonObject.put("image_url", imageUrl);
						if (video.getImageWidth() != null && video.getImageHeight() != null) {
							jsonObject.put("image_width", video.getImageWidth());
							jsonObject.put("image_height", video.getImageHeight());
						}
					}
					jsonObject.put("summary", video.getSummary());
				} catch (JSONException e) {
					logger.error("ERROR IN VideoManager.parseVideoToJson()", e);
				}
				jsonArray.put(jsonObject);
			}
		return jsonArray;
	}
}
