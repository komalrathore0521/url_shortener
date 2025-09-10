package com.example.url_shortner.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}
