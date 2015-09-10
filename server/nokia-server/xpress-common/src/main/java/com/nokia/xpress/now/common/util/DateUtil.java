package com.nokia.xpress.now.common.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
	private final static Calendar calendar = Calendar.getInstance();
	public final static String DATE_FORMAT = "yyyy-MM-dd";
	public final static String YM_FORMAT = "yyyy-MM";
	public final static String Y_FORMAT = "yyyy";

	private final static SimpleDateFormat simpledateformat = new SimpleDateFormat(DATE_FORMAT);

	public final static String getTodayAsDate() {
		return simpledateformat.format(calendar.getTime());
	}

	public final static String getTodayAsDate(String format) {
		return simpledateformat.format(calendar.getTime());
	}

	public final static Date toDate(String dateStr) throws Exception {
		return simpledateformat.parse(dateStr);
	}

	public final static Date toDate(String dateStr, String format) throws Exception {
		SimpleDateFormat simpledateformat2 = new SimpleDateFormat(format);
		return simpledateformat2.parse(dateStr);
	}

	public final static String toDateString(Date date) throws Exception {
		return simpledateformat.format(date);
	}

	public final static String toDateString(Date date, String format) throws Exception {
		SimpleDateFormat simpledateformat2 = new SimpleDateFormat(format);
		return simpledateformat2.format(date);
	}
	
	public final static String getAge(Date birthday) {
		if (null == birthday) {
			return "";
		}

		SimpleDateFormat yDf = new SimpleDateFormat(Y_FORMAT);
		int nowYear = Integer.parseInt(yDf.format(new Date()));
		int birthYear = Integer.parseInt(yDf.format(birthday));
		
		return (nowYear - birthYear)+"";
	}
	
	public String getAge2(Date birthday) {
		return getAge(birthday);
	}
	public String toYYYYYMMDD(Date birthday) {
		SimpleDateFormat simpledateformat2 = new SimpleDateFormat("yyyyMMdd");
		return simpledateformat2.format(birthday);
	}
	
	private static final long IN_SECOND = 1000 * 60L;
	
	private static final long IN_MIN = 1000 * 60 * 60L;
	
	private static final long IN_DAY = 1000 * 60 * 60 * 24L;
	
	private static final long IN_MONTH = 1000 * 60 * 60 * 24 * 30L;
	
	public String oralDesc(Date birthday) throws Exception {
		long time = System.currentTimeMillis() - birthday.getTime();
		StringBuffer sbuf = new StringBuffer();
		if (time < IN_SECOND) {
			if (time / 1000L < 0) {
				sbuf.append("几秒前");
			} else {
				sbuf.append(time / 1000L).append("秒前");
			}
			
		} else if (time >= IN_SECOND && time < IN_MIN) {
			sbuf.append(time / (60 * 1000L)).append("分前");
		} else if (time >= IN_MIN && time < IN_DAY) {
			sbuf.append((time / (60 * 60 * 1000L))).append("小时前");
		} else if (time >= IN_DAY && time < IN_MONTH) {
			sbuf.append((time / (24 * 60 * 60 * 1000L))).append("天前");
		} else if (time >= IN_MONTH) {
			sbuf.append(toDateString(birthday));
		}
		return sbuf.toString();
	}
	/**	
	 * @param date		开始时间
	 * @param subDay   	时间间隔单位为(天)
	 * @return      	如果在有效时间内为true,已经失效为false    
	 * @throws Exception
	 */
	public boolean subDate(Date date,Integer subDay)throws Exception {
		long time = System.currentTimeMillis() - date.getTime();
		Long subTimeLong = subDay.longValue() * IN_DAY;
		boolean flag = false;
		if(time <= subTimeLong)
		{
			flag = true;
		}
		return flag;
	}
	public static boolean validateAsyyyyMMdd(String dateStr) throws Exception {
		if (!dateStr.matches("(19|20)\\d{2}[01]\\d[0123]\\d")) {
    		return false;
    	}
		Date d = DateUtil.toDate(dateStr, "yyyyMMdd");
		String str = DateUtil.toDateString(d, "yyyyMMdd");
		
		return str.equals(dateStr);
	}
}
