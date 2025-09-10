package com.example.url_shortner.entity;

import com.example.url_shortner.entity.User;
import jakarta.persistence.*;
import lombok.Data; // Using @Data is simpler than separate @Getter/@Setter
import java.time.LocalDateTime;

@Entity
@Table(name = "url_mappings", indexes = @Index(columnList = "shortUrl", unique = true))
@Data // @Data includes @Getter, @Setter, @ToString, @EqualsAndHashCode
public class UrlMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- THIS IS THE FIX ---
    // Renamed from longUrl to originalUrl
    @Column(nullable = false, columnDefinition = "TEXT")
    private String originalUrl;

    @Column(nullable = false, unique = true, length = 10)
    private String shortUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    private long clickCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}

