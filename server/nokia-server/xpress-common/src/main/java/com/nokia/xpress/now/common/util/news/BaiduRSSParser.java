package com.nokia.xpress.now.common.util.news;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;

import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.entity.news.Rss;

public class BaiduRSSParser implements IRSSParser {

	@Override
	public List<News> parseToEntity(Rss rss) throws Exception {
		return null;
	}

	public JSONArray request(URL url) throws JSONException, IOException {
		URLConnection conn = null;
		BufferedReader br = null;
		try {
			conn = url.openConnection();
			conn.connect();
			br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String line;
			String jsonString = "";
			while ((line = br.readLine()) != null)
				jsonString += line;
			br.close();
			return new JSONArray(jsonString);
		} catch (IOException e) {
			throw e;
		} catch (JSONException e) {
			throw e;
		} finally {
			if (br != null)
				try {
					br.close();
				} catch (IOException e) {
					throw e;
				}
		}
	}
}
