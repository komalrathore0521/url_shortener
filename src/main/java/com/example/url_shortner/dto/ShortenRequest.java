package com.example.url_shortner.dto;

import lombok.Data;

@Data
public class ShortenRequest {
    private String originalUrl;
    private String customAlias;
    private Integer expiresInDays;
    private String expirationDate; // ISO format date string
}
