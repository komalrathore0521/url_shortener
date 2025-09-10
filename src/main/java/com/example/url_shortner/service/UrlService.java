package com.example.url_shortner.service;

import com.example.url_shortner.dto.ShortenRequest;
import com.example.url_shortner.dto.UrlResponse;
import com.example.url_shortner.entity.UrlMapping;
import com.example.url_shortner.entity.User;
import com.example.url_shortner.repository.UrlMappingRepository;
import com.example.url_shortner.repository.UserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class UrlService {

    @Autowired
    private UrlMappingRepository urlMappingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public UrlResponse shortenUrl(ShortenRequest shortenRequest, User user, String baseUrl) {
        String originalUrl = shortenRequest.getOriginalUrl();
        String shortUrl = generateShortUrl();

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedAt(LocalDateTime.now());
        if (shortenRequest.getExpiresInDays() != null && shortenRequest.getExpiresInDays() > 0) {
            urlMapping.setExpiresAt(LocalDateTime.now().plusDays(shortenRequest.getExpiresInDays()));
        }

        UrlMapping savedMapping = urlMappingRepository.save(urlMapping);

        if (savedMapping.getExpiresAt() != null) {
            long ttlSeconds = java.time.Duration.between(LocalDateTime.now(), savedMapping.getExpiresAt()).getSeconds();
            redisTemplate.opsForValue().set(shortUrl, originalUrl, ttlSeconds, TimeUnit.SECONDS);
        } else {
            redisTemplate.opsForValue().set(shortUrl, originalUrl);
        }

        return new UrlResponse(savedMapping, baseUrl);
    }

    public List<UrlResponse> getUserUrls(User user, String baseUrl) {
        return urlMappingRepository.findByUser(user)
                .stream()
                .map(urlMapping -> new UrlResponse(urlMapping, baseUrl))
                .collect(Collectors.toList());
    }

    /**
     * Finds the original URL for a given short code, handling caching and click tracking.
     * @param shortUrl The 7-character short code.
     * @return The original long URL, or null if not found or expired.
     */
    @Transactional
    public String getOriginalUrlAndTrackClick(String shortUrl) {
        // 1. Check cache first
        String originalUrl = redisTemplate.opsForValue().get(shortUrl);
        if (originalUrl != null) {
            // Found in cache. Asynchronously update click count in DB.
            incrementClickCount(shortUrl);
            return originalUrl;
        }

        // 2. If not in cache, check the database
        Optional<UrlMapping> urlMappingOptional = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMappingOptional.isPresent()) {
            UrlMapping urlMapping = urlMappingOptional.get();

            // 3. Check for expiration
            if (urlMapping.getExpiresAt() != null && urlMapping.getExpiresAt().isBefore(LocalDateTime.now())) {
                urlMappingRepository.delete(urlMapping);
                redisTemplate.delete(shortUrl); // Clean up cache
                return null; // Link has expired
            }

            // 4. Increment click count and save
            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);

            // 5. Cache the result for future requests
            if (urlMapping.getExpiresAt() != null) {
                long ttlSeconds = java.time.Duration.between(LocalDateTime.now(), urlMapping.getExpiresAt()).getSeconds();
                redisTemplate.opsForValue().set(urlMapping.getShortUrl(), urlMapping.getOriginalUrl(), ttlSeconds, TimeUnit.SECONDS);
            } else {
                redisTemplate.opsForValue().set(urlMapping.getShortUrl(), urlMapping.getOriginalUrl());
            }

            return urlMapping.getOriginalUrl();
        }

        // 6. If not found anywhere
        return null;
    }

    private void incrementClickCount(String shortUrl) {
        // This database operation can be slow, so in a high-traffic system,
        // you might move this to a separate, asynchronous task queue.
        urlMappingRepository.findByShortUrl(shortUrl).ifPresent(urlMapping -> {
            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);
        });
    }


    private String generateShortUrl() {
        String shortUrl;
        do {
            shortUrl = RandomStringUtils.randomAlphanumeric(7);
        } while (urlMappingRepository.findByShortUrl(shortUrl).isPresent());
        return shortUrl;
    }
}

