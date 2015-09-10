package com.nokia.xpress.now.web.servlet;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.NoSuchAlgorithmException;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.nokia.xpress.now.common.ProjectConfig;
import com.nokia.xpress.now.common.enums.ScaleTypeEnums;
import com.nokia.xpress.now.common.util.ImageUtil;
import com.nokia.xpress.now.entity.news.News;
import com.nokia.xpress.now.entity.reading.QidianBook;
import com.nokia.xpress.now.entity.video.Video;
import com.nokia.xpress.now.service.news.NewsManager;
import com.nokia.xpress.now.service.reading.QidianBookManager;
import com.nokia.xpress.now.service.video.VideoManager;

public class ImageScaleServlet extends HttpServlet {
	private static final long serialVersionUID = -4523547798435359110L;
	private static Logger logger = LoggerFactory.getLogger(ImageScaleServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			response.setContentType("image/jpeg");
			int destWidth = 0;
			String wcStr = request.getParameter("wc");
			if (wcStr != null && !wcStr.trim().equals(""))
				destWidth = Integer.parseInt(wcStr.trim());
			else {
				String wsStr = request.getParameter("ws");
				if (wsStr != null && !wsStr.trim().equals(""))
					destWidth = Integer.parseInt(wsStr.trim());
			}
			int destHeight = 0;
			String hcStr = request.getParameter("hc");
			if (hcStr != null && !hcStr.trim().equals(""))
				destHeight = Integer.parseInt(hcStr.trim());
			else {
				String hsStr = request.getParameter("hs");
				if (hsStr != null && !hsStr.trim().equals(""))
					destHeight = Integer.parseInt(hsStr.trim());
			}
			int type = ScaleTypeEnums.RATIO.getValue().intValue();
			String typeStr = request.getParameter("type");
			if (typeStr != null && !typeStr.trim().equals(""))
				type = Integer.parseInt(typeStr);
			byte[] bytes = null;
			File originalImage = null;
			File scaledImage = null;
			long newsId = 0L;
			String newsIdStr = request.getParameter("newsId");
			if (newsIdStr != null && !newsIdStr.trim().equals(""))
				newsId = Long.parseLong(newsIdStr);
			long qidianBookId = 0L;
			String qidianBookIdStr = request.getParameter("bookId");
			if (qidianBookIdStr != null && !qidianBookIdStr.trim().equals(""))
				qidianBookId = Long.parseLong(qidianBookIdStr);
			long videoId = 0L;
			String videoIdStr = request.getParameter("videoId");
			if (videoIdStr != null && !videoIdStr.trim().equals(""))
				videoId = Long.parseLong(videoIdStr);
			if (newsId != 0L) {
				String newsImagePath = ProjectConfig.getNewsImagePath();
				scaledImage = new File(newsImagePath, newsId + File.separator + destWidth + "x" + destHeight + "_" + type + ".jpg");
				if (scaledImage != null && scaledImage.exists())
					bytes = ImageUtil.getScaledImage(scaledImage, destWidth, destHeight, type);
				else {
					originalImage = new File(newsImagePath, newsId + File.separator + "original.jpg");
					if (!originalImage.exists()) {
						ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletContext());
						NewsManager newsManager = (NewsManager) context.getBean("newsManager");
						News news = newsManager.getById(newsId);
						if (news != null)
							ImageUtil.saveOriginalPic(news.getImage(), originalImage);
					}
					if (originalImage != null && originalImage.exists())
						bytes = ImageUtil.imageScale(originalImage, scaledImage, destWidth, destHeight, type);
				}
			} else if (qidianBookId != 0L) {
				String qidianBookImagePath = ProjectConfig.getQidianBookImagePath();
				scaledImage = new File(qidianBookImagePath, qidianBookId + File.separator + destWidth + "x" + destHeight + "_" + type + ".jpg");
				if (scaledImage != null && scaledImage.exists())
					bytes = ImageUtil.getScaledImage(scaledImage, destWidth, destHeight, type);
				else {
					originalImage = new File(qidianBookImagePath, qidianBookId + File.separator + "original.jpg");
					if (!originalImage.exists()) {
						ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletContext());
						QidianBookManager qidianBookManager = (QidianBookManager) context.getBean("qidianBookManager");
						QidianBook qidianBook = qidianBookManager.getById(qidianBookId);
						if (qidianBook != null)
							ImageUtil.saveOriginalPic(qidianBook.getCover(), originalImage);
					}
					if (originalImage != null && originalImage.exists())
						bytes = ImageUtil.imageScale(originalImage, scaledImage, destWidth, destHeight, type);
				}
			} else if (videoId != 0L) {
				String videoImagePath = ProjectConfig.getVideoImagePath();
				scaledImage = new File(videoImagePath, videoId + File.separator + destWidth + "x" + destHeight + "_" + type + ".jpg");
				if (scaledImage != null && scaledImage.exists())
					bytes = ImageUtil.getScaledImage(scaledImage, destWidth, destHeight, type);
				else {
					originalImage = new File(videoImagePath, videoId + File.separator + "original.jpg");
					if (!originalImage.exists()) {
						ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(this.getServletContext());
						VideoManager videoManager = (VideoManager) context.getBean("videoManager");
						Video video = videoManager.getById(videoId);
						if (video != null)
							ImageUtil.saveOriginalPic(video.getImage(), originalImage);
					}
					if (originalImage != null && originalImage.exists())
						bytes = ImageUtil.imageScale(originalImage, scaledImage, destWidth, destHeight, type);
				}
			}
			if (bytes != null)
				response.getOutputStream().write(bytes);
		} catch (Throwable th) {
			logger.error(th.getMessage(), th);
		}
	}

	public static byte[] imageScale(String imageUrl, int width, int height) throws MalformedURLException, IOException, NoSuchAlgorithmException {
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		try {
			Image image = ImageIO.read(new URL(imageUrl));
			image = image.getScaledInstance(width, height, Image.SCALE_AREA_AVERAGING);
			BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			Graphics2D g2 = bufferedImage.createGraphics();
			g2.drawImage(image, 0, 0, width, height, Color.white, null);
			g2.dispose();
			ImageIO.write(bufferedImage, "jpg", out);
			byte[] bytes = out.toByteArray();
			BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(new File("C:/1.jpg")));
			bos.write(bytes);
			bos.close();
			return bytes;
		} finally {
			out.close();
		}
	}
}
