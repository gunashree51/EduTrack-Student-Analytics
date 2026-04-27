package com.edutrack.controller;
import com.edutrack.dto.GradeDTO;
import com.edutrack.entity.Grade;
import com.edutrack.service.GradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/grades") @RequiredArgsConstructor
public class GradeController {
    private final GradeService service;

    @PostMapping
    public ResponseEntity<Grade> create(@Valid @RequestBody GradeDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping               public ResponseEntity<List<Grade>>     getAll()                       { return ResponseEntity.ok(service.getAll()); }
    @GetMapping("/{id}")      public ResponseEntity<Grade>           getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    @GetMapping("/student/{sid}") public ResponseEntity<List<Grade>> byStudent(@PathVariable Long sid) { return ResponseEntity.ok(service.getByStudent(sid)); }
    @GetMapping("/top-performers") public ResponseEntity<List<Object[]>> top()                      { return ResponseEntity.ok(service.getTopPerformers()); }

    @GetMapping("/student/{sid}/summary")
    public ResponseEntity<Map<String,Object>> summary(@PathVariable Long sid) {
        return ResponseEntity.ok(service.getSummary(sid));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Grade> update(@PathVariable Long id, @Valid @RequestBody GradeDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.ok("Grade deleted");
    }
}
