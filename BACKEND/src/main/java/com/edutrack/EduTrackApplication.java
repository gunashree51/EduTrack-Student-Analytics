package com.edutrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EduTrackApplication {
    public static void main(String[] args) {
        SpringApplication.run(EduTrackApplication.class, args);
        System.out.println("\n=========================================");
        System.out.println("  EduTrack API started on :8080");
        System.out.println("  http://localhost:8080/api");
        System.out.println("=========================================\n");
    }
}
