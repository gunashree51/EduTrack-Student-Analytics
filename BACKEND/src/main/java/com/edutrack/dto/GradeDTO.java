package com.edutrack.dto;
import jakarta.validation.constraints.*; import lombok.Data;
@Data public class GradeDTO {
    @NotNull  private Long   studentId;
    @NotBlank private String subject;
    @NotBlank private String examType;
    @NotNull  private Double marksObtained;
    @NotNull  private Double totalMarks;
    @NotBlank private String grade;
    private   String remarks;
    @NotBlank private String academicYear;
}
