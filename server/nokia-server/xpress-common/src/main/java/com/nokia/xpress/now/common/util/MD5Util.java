package com.nokia.xpress.now.common.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Util {

	public static String getMD5(File file) throws NoSuchAlgorithmException, IOException {
		String result = "";
		InputStream in = new BufferedInputStream(new FileInputStream(file));
		try {
			byte[] buffer = new byte[1024];
			byte[] md5Bytes = null;
			int readCount;
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			while ((readCount = in.read(buffer)) != -1)
				md5.update(buffer, 0, readCount);
			md5Bytes = md5.digest();
			result = toHexString(md5Bytes);
		} finally {
			if (in != null)
				try {
					in.close();
				} catch (Exception e) {
				}
		}
		return result;
	}

	public static String getMD5(InputStream in) throws NoSuchAlgorithmException, IOException {
		byte[] readBytes = new byte[1024];
		byte[] md5Bytes = null;
		int readCount;
		MessageDigest md5 = MessageDigest.getInstance("MD5");
		while ((readCount = in.read(readBytes)) != -1)
			md5.update(readBytes, 0, readCount);
		md5Bytes = md5.digest();
		String result = toHexString(md5Bytes);
		return result;
	}

	public static String getMD5(String str) throws NoSuchAlgorithmException {
		if (str != null) {
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			md5.update(str.getBytes());
			byte[] md5Bytes = md5.digest();
			String result = toHexString(md5Bytes);
			return result;
		}
		return null;
	}

	public final static String toHexString(byte[] res) {
		StringBuffer sb = new StringBuffer(res.length << 1);
		for (int i = 0; i < res.length; i++) {
			String digit = Integer.toHexString(0xFF & res[i]);
			if (digit.length() == 1) {
				digit = '0' + digit;
			}
			sb.append(digit);
		}
		return sb.toString().toUpperCase();
	}
}
