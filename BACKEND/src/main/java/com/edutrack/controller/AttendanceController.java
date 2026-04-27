package com.edutrack.controller;
import com.edutrack.dto.AttendanceDTO;
import com.edutrack.entity.Attendance;
import com.edutrack.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController @RequestMapping("/api/attendance") @RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService service;

    @PostMapping
    public ResponseEntity<Attendance> create(@Valid @RequestBody AttendanceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping              public ResponseEntity<List<Attendance>> getAll()                       { return ResponseEntity.ok(service.getAll()); }
    @GetMapping("/{id}")     public ResponseEntity<Attendance>       getById(@PathVariable Long id) { return ResponseEntity.ok(service.getById(id)); }
    @GetMapping("/student/{sid}") public ResponseEntity<List<Attendance>> byStudent(@PathVariable Long sid) { return ResponseEntity.ok(service.getByStudent(sid)); }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> byDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.getByDate(date));
    }

    @GetMapping("/student/{sid}/summary")
    public ResponseEntity<Map<String,Object>> summary(@PathVariable Long sid) {
        return ResponseEntity.ok(service.getSummary(sid));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attendance> update(@PathVariable Long id, @Valid @RequestBody AttendanceDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.ok("Record deleted");
    }
}
