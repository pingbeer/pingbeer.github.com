package dz.com.yeepay;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

/**
 * hmac的签名算法
 */
public class Digest {
	public static final String ENCODE = "UTF-8"; // UTF-8

	/**
	 * 对报文进行hmac签名，字符串按照UTF-8编码 (商户签名时直接调用这个即可，易宝只认以UTF-8编码的签名串)
	 * 
	 * @param aValue
	 *            - 字符串
	 * @param aKey
	 *            - 密钥
	 * @return - 签名结果，hex字符串
	 */
	public static String hmacSign(String aValue, String aKey) {
		return hmacSign(aValue, aKey, ENCODE);
	}

	/**
	 * 对报文进行采用MD5进行hmac签名
	 * 
	 * @param aValue
	 *            - 字符串
	 * @param aKey
	 *            - 密钥
	 * @param encoding
	 *            - 字符串编码方式
	 * @return - 签名结果，hex字符串
	 */
	public static String hmacSign(String aValue, String aKey, String encoding) {
		byte k_ipad[] = new byte[64];
		byte k_opad[] = new byte[64];
		byte keyb[];
		byte value[];
		try {
			keyb = aKey.getBytes(encoding);
			value = aValue.getBytes(encoding);
		} catch (UnsupportedEncodingException e) {
			keyb = aKey.getBytes();
			value = aValue.getBytes();
		}
		Arrays.fill(k_ipad, keyb.length, 64, (byte) 54);
		Arrays.fill(k_opad, keyb.length, 64, (byte) 92);
		for (int i = 0; i < keyb.length; i++) {
			k_ipad[i] = (byte) (keyb[i] ^ 0x36);
			k_opad[i] = (byte) (keyb[i] ^ 0x5c);
		}

		MessageDigest md = null;
		try {
			md = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		}
		md.update(k_ipad);
		md.update(value);
		byte dg[] = md.digest();
		md.reset();
		md.update(k_opad);
		md.update(dg, 0, 16);
		dg = md.digest();
		return toHex(dg);
	}

	public static String toHex(byte input[]) {
		if (input == null)
			return null;
		StringBuffer output = new StringBuffer(input.length * 2);
		for (int i = 0; i < input.length; i++) {
			int current = input[i] & 0xff;
			if (current < 16)
				output.append("0");
			output.append(Integer.toString(current, 16));
		}

		return output.toString();
	}

	/**
	 * 举个签名的例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		// 测试用的签名key
		String testHmacKey = "123123";
		// 签名前的串，实际上是将接口文档里的参数的值按顺序连接起来，如这里其实是将"CheckAccountCallBack","123","2013-07-03","okok"四个值连接起来的
		String source = "CheckAccountCallBack1232013-07-03okok";
		// 签名后的串，应该为 df469a51e661bd8942aafc00a79322df
		System.out.println(Digest.hmacSign(source, testHmacKey));
	}
}
