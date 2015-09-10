package com.nokia.xpress.now.common.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.nokia.xpress.now.common.ProjectConfig;

/**
 * upload file utils
 * 
 * @author hesy
 * 
 */

public class FileUtils {
	private static final Logger logger = LoggerFactory.getLogger(FileUtils.class);
	public static final String FILE_SEPARATOR = "/";

	public static String getSuffix(String fileName) {
		String suffix = null;
		int dotIndex = fileName.lastIndexOf(".");
		if (dotIndex >= 0) {
			suffix = fileName.substring(dotIndex, fileName.length());
		}
		return suffix;
	}

	public static String getFileName(String filepath) {
		File f = new File(filepath);
		return f.getName();
	}

	public static String getOriName(String fileName) {
		if (fileName.indexOf(".") > -1) {
			fileName = fileName.substring(0, fileName.lastIndexOf("."));
		}
		return fileName;
	}

	public static String getFileExtName(String fileName) {
		String fileExt = "";
		if (fileName.indexOf(".") > -1) {
			fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
		}
		return fileExt;
	}

	public static String getUploadFilePath(String rootPath) {
		// String path = Struts2Utils.getSession().getServletContext()
		// .getRealPath("/" + rootPath);
		String path = ProjectConfig.get("FILE_SERVER") + rootPath;
		StringBuffer pathBuf = new StringBuffer(path);

		long curTime = System.currentTimeMillis();

		long last4Number = curTime % 10000;

		pathBuf.append(FILE_SEPARATOR).append(DateUtil.getTodayAsDate("yyyyMMdd")).append(FILE_SEPARATOR).append(last4Number / 100).append(FILE_SEPARATOR).append(last4Number % 100);
		String filePath = pathBuf.toString();
		File f = new File(filePath);
		logger.debug("The file path which had been generated is :" + filePath);
		if (!f.exists())
			f.mkdirs();
		logger.debug("The file path which had been generated is :" + f.getAbsolutePath());
		return filePath;
	}

	public static String uploadFile(File src, String srcFileName, String rootPath) {
		StringBuffer pathBuf = new StringBuffer(FileUtils.getUploadFilePath(rootPath));
		pathBuf.append(FILE_SEPARATOR);
		pathBuf.append(System.currentTimeMillis());
		pathBuf.append(".");
		pathBuf.append(FileUtils.getFileExtName(srcFileName));
		FileUtils.getOriName(srcFileName);

		File newFile = new File(new String(pathBuf));
		String uri = uploadFile(src, newFile);

		String spliter = rootPath;
		if (rootPath.indexOf("/") >= 0)
			spliter = rootPath.split("/")[1];
		int start = uri.indexOf(spliter) + spliter.length();
		return uri.substring(start);
	}

	public static String uploadFile(File src, File dst) {
		int srcFileSize = (int) src.length();
		try {
			InputStream in = null;
			OutputStream out = null;
			try {
				in = new BufferedInputStream(new FileInputStream(src), srcFileSize);
				out = new BufferedOutputStream(new FileOutputStream(dst), srcFileSize);
				byte[] buffer = new byte[srcFileSize];
				while (in.read(buffer) > 0)
					out.write(buffer);
			} finally {
				if (null != in) {
					in.close();
				}
				if (null != out) {
					out.close();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dst.getPath();
	}
}
