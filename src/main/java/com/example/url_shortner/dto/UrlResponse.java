package com.example.url_shortner.dto;

import com.example.url_shortner.entity.UrlMapping;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UrlResponse {
    private Long id;
    private String originalUrl;
    private String shortUrl;
    private String fullShortUrl;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private long clickCount;

    /**
     * A convenient constructor to map from the UrlMapping entity to this DTO.
     * @param urlMapping The entity object from the database.
     * @param baseUrl The base URL of the server (e.g., "http://localhost:8081").
     */
    public UrlResponse(UrlMapping urlMapping, String baseUrl) {
        this.id = urlMapping.getId();
        this.originalUrl = urlMapping.getOriginalUrl();
        this.shortUrl = urlMapping.getShortUrl();
        this.fullShortUrl = baseUrl + "/" + urlMapping.getShortUrl();
        this.createdAt = urlMapping.getCreatedAt();
        this.expiresAt = urlMapping.getExpiresAt();
        this.clickCount = urlMapping.getClickCount();
    }
}

