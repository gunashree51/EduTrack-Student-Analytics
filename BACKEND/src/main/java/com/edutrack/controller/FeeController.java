package com.edutrack.controller;

import com.edutrack.dto.FeeDTO;
import com.edutrack.entity.Fee;
import com.edutrack.service.FeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {
    private final FeeService service;

    @PostMapping
    public ResponseEntity<Fee> create(@Valid @RequestBody FeeDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<Fee>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Fee>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(service.getByStudent(studentId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Fee>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(service.getByStatus(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> update(@PathVariable Long id, @Valid @RequestBody FeeDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Fee record deleted");
    }
}
