package com.edutrack.service;
import com.edutrack.dto.StudentDTO;
import com.edutrack.entity.Student;
import com.edutrack.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class StudentService {
    private final StudentRepository repo;

    public Student create(StudentDTO d) {
        if (repo.existsByRollNumber(d.getRollNumber()))
            throw new RuntimeException("Roll number already exists: " + d.getRollNumber());
        return repo.save(map(d, new Student()));
    }

    public List<Student> getAll()              { return repo.findAll(); }
    public Student       getById(Long id)      { return find(id); }
    public List<Student> getByClass(String c)  { return repo.findByClassName(c); }
    public List<Student> search(String n)      { return repo.findByFullNameContainingIgnoreCase(n); }
    public List<Student> getActive()           { return repo.findByStatus("ACTIVE"); }

    public Student update(Long id, StudentDTO d) {
        Student s = find(id);
        if (!s.getRollNumber().equals(d.getRollNumber()) && repo.existsByRollNumber(d.getRollNumber()))
            throw new RuntimeException("Roll number in use: " + d.getRollNumber());
        return repo.save(map(d, s));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new RuntimeException("Student not found: " + id);
        repo.deleteById(id);
    }

    private Student find(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }

    private Student map(StudentDTO d, Student s) {
        s.setFullName(d.getFullName());     s.setRollNumber(d.getRollNumber());
        s.setEmail(d.getEmail());           s.setClassName(d.getClassName());
        s.setSection(d.getSection());       s.setPhone(d.getPhone());
        s.setParentName(d.getParentName()); s.setParentPhone(d.getParentPhone());
        s.setAddress(d.getAddress());
        s.setStatus(d.getStatus() != null ? d.getStatus() : "ACTIVE");
        return s;
    }
}
