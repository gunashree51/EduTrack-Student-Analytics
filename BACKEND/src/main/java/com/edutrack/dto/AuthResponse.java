package com.edutrack.dto;
import lombok.*;
@Data @AllArgsConstructor @NoArgsConstructor
public class AuthResponse {
    private String token, email, fullName, role, message;
}
