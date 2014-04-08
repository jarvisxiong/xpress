package com.nokia.xpress.now.common.util;

import java.io.UnsupportedEncodingException;

public class JquertAjaxUtil {
	private static final String srcEncoding = "ISO-8859-1";
	private static final String targetEncoding = "UTF-8";

	public static String parseText(String text) {
		String paresedText = null;
		try {
			paresedText = new String(text.getBytes(srcEncoding), targetEncoding);
		} catch (UnsupportedEncodingException e) {
		}
		return paresedText;
	}
}
