package com.edutrack.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "students")
@Data @NoArgsConstructor @AllArgsConstructor
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)                private String fullName;
    @Column(nullable = false, unique = true) private String rollNumber;
    @Column(nullable = false)                private String email;
    @Column(nullable = false)                private String className;
    @Column(nullable = false)                private String section;
    private String phone, parentName, parentPhone, address;
    @Column(nullable = false)                private String status;
}
