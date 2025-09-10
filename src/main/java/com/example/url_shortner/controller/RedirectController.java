package com.example.url_shortner.controller;

import com.example.url_shortner.service.UrlService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@RestController
public class RedirectController {

    @Autowired
    private UrlService urlService;

    @GetMapping("/{shortUrl}")
    public void redirect(@PathVariable String shortUrl, HttpServletResponse httpServletResponse) throws IOException {
        String originalUrl = urlService.getOriginalUrlAndTrackClick(shortUrl);

        if (originalUrl != null) {
            // Perform a 302 Found redirect
            httpServletResponse.sendRedirect(originalUrl);
        } else {
            // If the URL is not found, throw a 404 Not Found error
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Short URL not found");
        }
    }
}
