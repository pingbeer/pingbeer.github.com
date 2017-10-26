package dz.com.chinapay;

import java.security.MessageDigest;

import com.sino.base.log.Logger;

public class Md5Util {

	private static final String[] hexDigits = { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" };

	/**
	 * 功能：以MD5方式加密
	 * @author ZHANGXING 2015-4-29 12:02:09
	 * @param st
	 * @return
	 */
	public static String encode(String st) {
		String resultString = null;
		try {
			resultString = st;
			MessageDigest md = MessageDigest.getInstance("MD5");
			resultString = byteArrayToHexString(md.digest(resultString.getBytes()));
			md = null;
		} catch (Exception e) {
			Logger.logError("MD5 encode():" + e.getMessage());
		}
		return resultString;
	}

	private static String byteArrayToHexString(byte[] b) {
		StringBuffer resultSb = new StringBuffer();
		for (int i = 0; i < b.length; i++) {
			resultSb.append(byteToHexString(b[i]));
		}
		return resultSb.toString();
	}

	private static String byteToHexString(byte b) {
		int n = b;
		if (n < 0){
			n = 256 + n;
		}
		int d1 = n / 16;
		int d2 = n % 16;
		return hexDigits[d1] + hexDigits[d2];
	}

    public static void main(String[] args) {
        System.out.println( Md5Util.encode("1QAZ2WSX"));
    }
}