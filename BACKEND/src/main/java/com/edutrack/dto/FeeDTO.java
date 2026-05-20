package com.edutrack.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class FeeDTO {
    @NotNull
    private Long studentId;
    @NotBlank
    private String feeType;
    @NotNull
    private Double amount;
    @NotNull
    private Double paid;
    @NotNull
    private LocalDate dueDate;
    @NotBlank
    private String status;
    @NotBlank
    private String month;
}
