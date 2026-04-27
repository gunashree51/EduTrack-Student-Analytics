package com.edutrack.dto;
import jakarta.validation.constraints.*; import lombok.Data;
import java.time.LocalDate;
@Data public class AttendanceDTO {
    @NotNull  private Long studentId;
    @NotNull  private LocalDate date;
    @NotBlank private String subject;
    @NotBlank private String status;
    private String remarks;
}
