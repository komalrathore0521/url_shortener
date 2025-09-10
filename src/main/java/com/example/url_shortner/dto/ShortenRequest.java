package com.example.url_shortner.dto;

import lombok.Data;

@Data
public class ShortenRequest {
    private String originalUrl;
    private Integer expiresInDays;
}
