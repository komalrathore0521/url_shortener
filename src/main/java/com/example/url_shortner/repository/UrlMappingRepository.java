package com.example.url_shortner.repository;

import com.example.url_shortner.entity.UrlMapping;
import com.example.url_shortner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    Optional<UrlMapping> findByShortUrl(String shortUrl);
    boolean existsByShortUrl(String shortUrl);



    // Method to find all URL mappings created by a specific user
    List<UrlMapping> findByUser(User user);
}
