package com.edutrack.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "grades")
@Data @NoArgsConstructor @AllArgsConstructor
public class Grade {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    @Column(nullable = false) private String subject;
    @Column(nullable = false) private String examType;
    @Column(nullable = false) private Double marksObtained;
    @Column(nullable = false) private Double totalMarks;
    @Column(nullable = false) private String grade;
    private String remarks;
    @Column(nullable = false) private String academicYear;
}
