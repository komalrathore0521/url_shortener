package com.example.url_shortner.controller;

import com.example.url_shortner.dto.ShortenRequest;
import com.example.url_shortner.dto.UrlResponse;
import com.example.url_shortner.entity.User;
import com.example.url_shortner.repository.UserRepository;
import com.example.url_shortner.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    @Autowired
    private UrlService urlService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/shorten")
    public ResponseEntity<UrlResponse> shortenUrl(@RequestBody @Valid ShortenRequest shortenRequest, HttpServletRequest request) {
        // Get the currently authenticated user's details
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found."));

        // Construct the base URL from the incoming request (e.g., "http://localhost:8081")
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

        // Call the service, which now handles all the logic and DTO creation
        UrlResponse urlResponse = urlService.shortenUrl(shortenRequest, user, baseUrl);

        return ResponseEntity.ok(urlResponse);
    }

    @GetMapping("/my-urls")
    public ResponseEntity<List<UrlResponse>> getUserUrls(HttpServletRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found."));

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

        // Call the new service method and convert the results to a list of UrlResponse DTOs
        List<UrlResponse> urls = urlService.getUserUrls(user, baseUrl);

        return ResponseEntity.ok(urls);
    }
}

