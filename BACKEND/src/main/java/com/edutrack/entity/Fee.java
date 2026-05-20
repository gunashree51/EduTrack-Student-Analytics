package com.edutrack.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Student student;
    @Column(nullable = false)
    private String feeType;
    @Column(nullable = false)
    private Double amount;
    @Column(nullable = false)
    private Double paid;
    @Column(nullable = false)
    private LocalDate dueDate;
    @Column(nullable = false)
    private String status;
    @Column(nullable = false)
    private String month;
}