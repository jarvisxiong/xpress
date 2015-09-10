package com.nokia.xpress.now.common.util.news;

import java.net.URL;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.nokia.xpress.now.common.util.RequestUtil;
import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.entity.news.Rss;

public class SinaRSSParser implements IRSSParser {

	@Override
	public List<News> parseToEntity(Rss rss) throws Exception {
		List<News> result = new ArrayList<News>();
		if (rss != null && rss.getLink() != null && !rss.getLink().trim().equals("")) {
			JSONArray jsonArray = RequestUtil.requestAsJSONArray(new URL(rss.getLink()));
			if (jsonArray.length() > 0)
				for (int i = 0; i < jsonArray.length(); i++) {
					JSONObject jsonObject = (JSONObject) jsonArray.get(i);
					if (jsonObject != null) {
						News news = new News();
						news.setRss(rss);
						news.setTitle(jsonObject.get("title").toString());
						news.setLink(jsonObject.get("link").toString());
						String imageStr = jsonObject.get("image").toString();
						if (imageStr != null && !imageStr.trim().equals(""))
							news.setImage(imageStr);
						news.setSummary(jsonObject.get("summary").toString());
						Calendar calendar = Calendar.getInstance();
						calendar.setTimeInMillis(Long.parseLong(jsonObject.get("pub_date").toString()) * 1000);
						news.setPubDate(calendar.getTime());
						news.setEnable(true);
						news.setCreateDate(new Date());
						news.setModifyDate(new Date());
						result.add(news);
					}
				}
		}
		return result;
	}
}
