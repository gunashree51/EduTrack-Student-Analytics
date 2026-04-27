package com.edutrack.dto;
import jakarta.validation.constraints.*; import lombok.Data;
@Data public class RegisterRequest {
    @NotBlank                public String fullName;
    @Email @NotBlank         public String email;
    @NotBlank @Size(min = 6) public String password;
    @NotBlank                public String role;
}
