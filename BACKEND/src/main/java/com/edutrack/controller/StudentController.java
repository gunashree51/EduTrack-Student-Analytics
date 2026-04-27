package com.edutrack.controller;
import com.edutrack.dto.StudentDTO;
import com.edutrack.entity.Student;
import com.edutrack.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/students") @RequiredArgsConstructor
public class StudentController {
    private final StudentService service;

    @GetMapping              public ResponseEntity<List<Student>> getAll()                         { return ResponseEntity.ok(service.getAll()); }
    @GetMapping("/{id}")     public ResponseEntity<Student>       getById(@PathVariable Long id)   { return ResponseEntity.ok(service.getById(id)); }
    @GetMapping("/active")   public ResponseEntity<List<Student>> active()                         { return ResponseEntity.ok(service.getActive()); }
    @GetMapping("/class/{c}") public ResponseEntity<List<Student>> byClass(@PathVariable String c) { return ResponseEntity.ok(service.getByClass(c)); }
    @GetMapping("/search")   public ResponseEntity<List<Student>> search(@RequestParam String name){ return ResponseEntity.ok(service.search(name)); }

    @PostMapping
    public ResponseEntity<Student> create(@Valid @RequestBody StudentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable Long id, @Valid @RequestBody StudentDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.ok("Student deleted");
    }
}
