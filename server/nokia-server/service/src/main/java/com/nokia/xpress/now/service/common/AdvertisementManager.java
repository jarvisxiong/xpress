package com.nokia.xpress.now.service.common;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.hibernate.HibernateDao;

import com.nokia.xpress.now.common.enums.TypeEnums;
import com.nokia.xpress.now.dao.common.AdvertisementDao;
import com.nokia.xpress.now.entity.common.Advertisement;
import com.nokia.xpress.now.service.EntityManagement;

//Spring Bean的标识.
@Component
// 默认将类中的所有函数纳入事务管理.
@Transactional
public class AdvertisementManager extends EntityManagement<Advertisement, Long> {
	private AdvertisementDao advertisementDao;

	@Override
	protected HibernateDao<Advertisement, Long> getEntityDao() {
		return advertisementDao;
	}

	@Transactional(readOnly = true)
	public Advertisement getById(Long id) {
		return advertisementDao.getById(id);
	}

	@Transactional(readOnly = true)
	public List<Advertisement> findAllByType(TypeEnums type) {
		return advertisementDao.findBy("type", type.getValue());
	}

	@Transactional(readOnly = true)
	public JSONArray parseAdvertisementListToJson(List<Advertisement> advertisementList) {
		JSONArray jsonArray = new JSONArray();
		try {
			if (advertisementList != null && !advertisementList.isEmpty())
				for (Advertisement advertisement : advertisementList) {
					JSONObject jsonObject = new JSONObject();
					if (advertisement != null) {
						jsonObject.put("key", "advertisement");
						jsonObject.put("name", "Advertisement");
						jsonObject.put("value", advertisement.getValue());
						jsonObject.put("link", advertisement.getLink());

					}
					jsonArray.put(jsonObject);
				}
		} catch (JSONException e) {
			logger.error("ERROR IN AdvertisementManager.parseAdvertisementDaoListToJson()", e);
		}
		return jsonArray;
	}

	@Transactional(readOnly = true)
	public JSONObject parseAdvertisementToJson(Advertisement advertisement) {
		JSONObject jsonObject = new JSONObject();
		try {
			if (advertisement != null) {
				jsonObject.put("key", "advertisement");
				jsonObject.put("name", "Advertisement");
				jsonObject.put("value", advertisement.getValue());
				jsonObject.put("link", advertisement.getLink());

			}
		} catch (JSONException e) {
			logger.error("ERROR IN AdvertisementManager.parseAdvertisementToJson()", e);
		}
		return jsonObject;
	}

	public void deleteAdvertisement(Long id) {
		advertisementDao.delete(id);
	}

	public AdvertisementDao getAdvertisementDao() {
		return advertisementDao;
	}

	@Autowired
	public void setAdvertisementDao(AdvertisementDao advertisementDao) {
		this.advertisementDao = advertisementDao;
	}

}
