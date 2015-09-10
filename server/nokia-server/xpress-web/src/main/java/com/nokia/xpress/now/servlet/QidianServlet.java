package com.nokia.xpress.now.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.nokia.xpress.now.common.util.reading.QidianRequestUtil;

public class QidianServlet extends HttpServlet {

	private static final long serialVersionUID = -248186090350244622L;
	private static Logger logger = LoggerFactory.getLogger(QidianServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jsonStr = null;
		try {
			response.setContentType("text/html;charset=UTF-8");
			String method = request.getParameter("method");
			if (method != null && !method.trim().equals("")) {
				if (method.equalsIgnoreCase("common.toplist.getmonthlist")) {
					Long cid = parseLong(request.getParameter("cid"), 0);
					int p_no = parseInt(request.getParameter("p_no"), 1);
					int p_size = parseInt(request.getParameter("p_size"), 20);
					jsonStr = QidianRequestUtil.getMonthTopList(cid, p_no, p_size).toString();
				} else if (method.equalsIgnoreCase("common.getbookbaseinfo")) {
					long bid = parseLong(request.getParameter("bid"), 0L);
					if (bid == 0)
						jsonStr = new JSONObject("{\"msg\":\"Invalid Parameters\"}").toString();
					else
						jsonStr = QidianRequestUtil.getBookBaseInfo(bid).toString();
				} else if (method.equalsIgnoreCase("common.getbookchapterlist")) {
					long bid = parseLong(request.getParameter("bid"), 0L);
					if (bid == 0)
						jsonStr = new JSONObject("{\"msg\":\"Invalid Parameters\"}").toString();
					else
						jsonStr = QidianRequestUtil.getBookChapterList(bid).toString();
				} else if (method.equalsIgnoreCase("common.getpublicchaptercontent")) {
					long bid = parseLong(request.getParameter("bid"), 0L);
					long cid = parseLong(request.getParameter("cid"), 0L);
					if (bid == 0 || cid == 0)
						jsonStr = new JSONObject("{\"msg\":\"Invalid Parameters\"}").toString();
					else
						jsonStr = QidianRequestUtil.getChapterContent(bid, cid).toString();
				} else
					jsonStr = "{\"msg\":\"Invalid Method\"}";
			} else
				jsonStr = "{\"msg\":\"Invalid Method\"}";
			response.getWriter().write(jsonStr);
		} catch (Throwable th) {
			logger.error(th.getMessage(), th);
			response.getWriter().write("[{\"message\":\"" + th.getMessage() + "\"}]");
		}
	}

	private int parseInt(String intStr, int defaultVale) {
		try {
			if (intStr != null && !intStr.trim().equals(""))
				return Integer.parseInt(intStr.trim());
		} catch (NumberFormatException e) {
		}
		return defaultVale;
	}

	private long parseLong(String intStr, long defaultVale) {
		try {
			if (intStr != null && !intStr.trim().equals(""))
				return Long.parseLong(intStr.trim());
		} catch (NumberFormatException e) {
		}
		return defaultVale;
	}
}
