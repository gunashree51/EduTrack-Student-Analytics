package com.edutrack.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/")
    public String home() {
        return "EduTrack backend is running successfully";
    }

    @GetMapping("/api/test")
    public String test() {
        return "Backend connected successfully";
    }
}