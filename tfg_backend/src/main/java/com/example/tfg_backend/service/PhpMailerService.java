package com.example.tfg_backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;
import java.util.Map;

@Slf4j
@Service
public class PhpMailerService {

    private final RestTemplate restTemplate;

    @Value("${php.mailer.url}")
    private String phpMailerUrl;

    @Value("${php.mailer.api-key}")
    private String phpMailerApiKey;

    public PhpMailerService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        disableSSLVerification();
    }

    private void disableSSLVerification() {
        try {
            TrustManager[] trustAllCerts = new TrustManager[] {
                    new X509TrustManager() {
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return null;
                        }

                        public void checkClientTrusted(X509Certificate[] certs, String authType) {
                        }

                        public void checkServerTrusted(X509Certificate[] certs, String authType) {
                        }
                    }
            };

            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

            log.warn(" SSL verification deshabilitado para PHPMailer - Solo para desarrollo/testing");
        } catch (Exception e) {
            log.error("Error deshabilitando SSL: {}", e.getMessage());
        }
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Api-Key", phpMailerApiKey);

            Map<String, String> payload = Map.of(
                    "to", to,
                    "subject", subject,
                    "body", body);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);
            String response = restTemplate.postForObject(phpMailerUrl, request, String.class);

            log.info("Email enviado via PHPMailer a: {}. Respuesta: {}", to, response);
        } catch (Exception e) {
            log.error("Error enviando email via PHPMailer a {}: {}", to, e.getMessage(), e);
        }
    }
}
