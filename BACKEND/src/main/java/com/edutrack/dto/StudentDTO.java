package com.edutrack.dto;
import jakarta.validation.constraints.*; import lombok.Data;
@Data public class StudentDTO {
    @NotBlank private String fullName;
    @NotBlank private String rollNumber;
    @Email @NotBlank private String email;
    @NotBlank private String className;
    @NotBlank private String section;
    private String phone, parentName, parentPhone, address;
    private String status = "ACTIVE";
}
