package com.example.tfg_backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
            restTemplate.postForObject(phpMailerUrl, request, String.class);

            log.info("Email enviado via PHPMailer a: {}", to);
        } catch (Exception e) {
            log.error("Error enviando email via PHPMailer a {}: {}", to, e.getMessage());
        }
    }
}
