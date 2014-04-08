package com.nokia.xpress.now.common.util;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.nokia.xpress.now.common.enums.ScaleTypeEnums;

public class ImageUtil {
	// private static final Color FOREGROUNDCO_COLOR = new Color(0xEE, 0xEE, 0xEE);
	private static final Logger logger = LoggerFactory.getLogger(ImageUtil.class);

	public synchronized static void saveOriginalPic(String imageUrl, File originalImage) {
		if (imageUrl != null && !imageUrl.trim().equals("") && !originalImage.exists()) {
			BufferedInputStream bis = null;
			BufferedOutputStream bos = null;
			try {
				URL url = new URL(imageUrl);
				bis = new BufferedInputStream(url.openStream());
				if (!originalImage.getParentFile().exists())
					originalImage.getParentFile().mkdirs();
				bos = new BufferedOutputStream(new FileOutputStream(originalImage));
				byte[] bytes = new byte[1024 * 1024];
				int len = 0;
				while ((len = bis.read(bytes)) > 0)
					bos.write(bytes, 0, len);
			} catch (IOException e) {
				logger.error("ERROR IN ImageUtil.saveOriginalPic()", e);
			} finally {
				close(bis);
				close(bos);
			}
		}
	}

	public static void deleteLocalPic(String basePath, Long id) throws IOException {
		File image = new File(basePath, String.valueOf(id));
		int count = 0;
		if (image.exists())
			while (count++ < 3)
				if (image.exists()) {
					try {
						FileUtils.deleteDirectory(image);
						break;
					} catch (IOException e) {
					}
				}
		if (image.exists())
			throw new IOException("Delete image " + image.getCanonicalPath() + " failed!");
	}

	public static byte[] getScaledImage(File scaledImage, int destWidth, int destHeight, int type) throws IOException {
		byte[] bytes = null;
		BufferedInputStream bis = null;
		try {
			bis = new BufferedInputStream(new FileInputStream(scaledImage));
			bytes = new byte[bis.available()];
			bis.read(bytes);
		} finally {
			close(bis);
		}
		return bytes;
	}

	public static byte[] imageScale(File originalImage, File scaledImage, int destWidth, int destHeight, int type) throws IOException {
		byte[] bytes = null;
		if (scaledImage != null && scaledImage.exists()) {
			BufferedInputStream bis = null;
			try {
				bis = new BufferedInputStream(new FileInputStream(scaledImage));
				bytes = new byte[bis.available()];
				bis.read(bytes);
			} finally {
				close(bis);
			}
		} else {
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			BufferedOutputStream bos = null;
			try {
				if (originalImage != null && originalImage.exists()) {
					BufferedImage srcImage = ImageIO.read(originalImage);
					BufferedImage destImage = new BufferedImage(destWidth, destHeight, BufferedImage.TYPE_INT_RGB);
					Graphics2D g2 = destImage.createGraphics();
					if (type == ScaleTypeEnums.FILL.getValue().intValue()) {// 变形填充压缩
						g2.drawImage(srcImage.getScaledInstance(destWidth, destHeight, Image.SCALE_SMOOTH), 0, 0, destWidth, destHeight, null);
					} else if (type == ScaleTypeEnums.RATIO.getValue().intValue()) {// 不留白边等比例压缩
						int srcWidth = srcImage.getWidth(null);
						int srcHeight = srcImage.getHeight(null);
						float srcRatio = (float) srcHeight / srcWidth;
						float destRatio = (float) destHeight / destWidth;
						if (srcWidth >= destWidth && srcHeight < destHeight) {
							srcWidth = destWidth;
							srcHeight = (int) (srcWidth * srcRatio);
						} else if (srcWidth < destWidth && srcHeight >= destHeight) {
							srcHeight = destHeight;
							srcWidth = (int) (srcHeight / srcRatio);
						} else if (srcWidth >= destWidth && srcHeight >= destHeight) {
							if (destRatio > srcRatio) {
								srcWidth = destWidth;
								srcHeight = (int) (srcRatio * srcWidth);
							} else {
								srcHeight = destHeight;
								srcWidth = (int) (srcHeight / srcRatio);
							}
						}
						destImage = new BufferedImage(srcWidth, srcHeight, BufferedImage.TYPE_INT_RGB);
						g2 = destImage.createGraphics();
						g2.drawImage(srcImage.getScaledInstance(srcWidth, srcHeight, Image.SCALE_SMOOTH), 0, 0, srcWidth, srcHeight, null);
					} else if (type == ScaleTypeEnums.RATIO_WHITE.getValue().intValue()) {// 留白边等比例压缩
						int srcWidth = srcImage.getWidth(null);
						int srcHeight = srcImage.getHeight(null);
						float srcRatio = (float) srcHeight / srcWidth;
						float destRatio = (float) destHeight / destWidth;
						if (srcWidth >= destWidth && srcHeight < destHeight) {
							srcWidth = destWidth;
							srcHeight = (int) (srcWidth * srcRatio);
						} else if (srcWidth < destWidth && srcHeight >= destHeight) {
							srcHeight = destHeight;
							srcWidth = (int) (srcHeight / srcRatio);
						} else if (srcWidth >= destWidth && srcHeight >= destHeight) {
							if (destRatio > srcRatio) {
								srcWidth = destWidth;
								srcHeight = (int) (srcRatio * srcWidth);
							} else {
								srcHeight = destHeight;
								srcWidth = (int) (srcHeight / srcRatio);
							}
						}
						int xSpace = (destWidth - srcWidth) / 2;
						int ySpace = (destHeight - srcHeight) / 2;
						// g2.setColor(FOREGROUNDCO_COLOR);
						g2.fillRect(0, 0, destWidth, destHeight);
						// destImage = new BufferedImage(destWidth, destHeight, BufferedImage.TYPE_INT_ARGB);
						// g2 = (Graphics2D) destImage.getGraphics();
						g2.drawImage(srcImage.getScaledInstance(srcWidth, srcHeight, Image.SCALE_SMOOTH), xSpace, ySpace, srcWidth, srcHeight, null);
					} else if (type == ScaleTypeEnums.RATIO_CUT.getValue().intValue()) {// 先压缩再截取或拉伸
						int srcWidth = srcImage.getWidth(null);
						int srcHeight = srcImage.getHeight(null);
						float srcRatio = (float) srcHeight / srcWidth;
						float destRatio = (float) destHeight / destWidth;
						if (srcWidth >= destWidth && srcHeight >= destHeight) {
							if (destRatio > srcRatio) {
								srcWidth = srcWidth * destHeight / srcHeight;
								srcHeight = destHeight;
							} else {
								srcHeight = srcHeight * destWidth / srcWidth;
								srcWidth = destWidth;
							}
							BufferedImage tmpImage = new BufferedImage(srcWidth, srcHeight, BufferedImage.TYPE_INT_RGB);
							Graphics2D tmpG2 = tmpImage.createGraphics();
							tmpG2.drawImage(srcImage.getScaledInstance(srcWidth, srcHeight, Image.SCALE_SMOOTH), 0, 0, srcWidth, srcHeight, null);
							tmpG2.dispose();
							g2.drawImage(tmpImage.getSubimage((srcWidth - destWidth) / 2, (srcHeight - destHeight) / 2, destWidth, destHeight), 0, 0, destWidth, destHeight, null);
						} else {
							if (srcWidth >= destWidth && srcHeight < destHeight) {
								srcWidth = destWidth;
								srcHeight = (int) (srcWidth * srcRatio);
							} else if (srcWidth < destWidth && srcHeight >= destHeight) {
								srcHeight = destHeight;
								srcWidth = (int) (srcHeight / srcRatio);
							}
							g2.drawImage(srcImage.getScaledInstance(srcWidth, srcHeight, Image.SCALE_SMOOTH), 0, 0, destWidth, destHeight, null);
						}
					} else {
						return null;
					}
					g2.dispose();
					ImageIO.write(destImage, "jpg", out);
					bytes = out.toByteArray();
					if (scaledImage != null) {
						bos = new BufferedOutputStream(new FileOutputStream(scaledImage));
						bos.write(bytes);
					}
				}
			} finally {
				close(out);
				close(bos);
			}
		}
		return bytes;
	}

	private static void close(Closeable stream) {
		if (stream != null) {
			try {
				stream.close();
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			}
		}
	}
}
