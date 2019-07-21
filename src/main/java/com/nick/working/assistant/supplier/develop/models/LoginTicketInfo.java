package com.nick.working.assistant.supplier.develop.models;

import com.google.gson.Gson;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.Base64;

@Data
public class LoginTicketInfo {
    private int version;
    private int userId;
    private long expire;

    private static final String CIPHER_ALGORITHM = "AES/ECB/PKCS5PADDING";
    private static final Charset ENCODING = StandardCharsets.UTF_8;
    private static final Gson GSON = new Gson();
    private static final Logger LOGGER = LoggerFactory.getLogger(LoginTicketInfo.class);

    public String toTicket(String password) {
        try {
            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(password));
            byte[] decrypted = GSON.toJson(this).getBytes(ENCODING);
            byte[] encrypted = cipher.doFinal(decrypted);
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("could not encrypt ticket", e);
        }
    }

    public static LoginTicketInfo fromTicket(String password, String ticket) {
        try {
            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey(password));
            byte[] encrypted = Base64.getDecoder().decode(ticket);
            byte[] decrypted = cipher.doFinal(encrypted);
            return GSON.fromJson(new String(decrypted, ENCODING), LoginTicketInfo.class);
        } catch (GeneralSecurityException e) {
            if (LOGGER.isWarnEnabled()) {
                LOGGER.warn("could not decrypt ticket " + ticket, e);
            }
            return null;
        }
    }

    private static SecretKeySpec getSecretKey(String password) {
        return new SecretKeySpec(password.getBytes(ENCODING), "AES");
    }
}
