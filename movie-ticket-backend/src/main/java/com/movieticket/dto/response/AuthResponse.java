package com.movieticket.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String role;
}
