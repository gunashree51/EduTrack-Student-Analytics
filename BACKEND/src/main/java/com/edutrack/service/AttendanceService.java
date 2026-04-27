package com.edutrack.service;
import com.edutrack.dto.AttendanceDTO;
import com.edutrack.entity.*;
import com.edutrack.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service @RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository repo;
    private final StudentRepository    studentRepo;

    public Attendance create(AttendanceDTO d) {
        Attendance a = new Attendance();
        a.setStudent(findStudent(d.getStudentId())); a.setDate(d.getDate());
        a.setSubject(d.getSubject()); a.setStatus(d.getStatus().toUpperCase());
        a.setRemarks(d.getRemarks());
        return repo.save(a);
    }

    public List<Attendance> getAll()                         { return repo.findAll(); }
    public Attendance       getById(Long id)                 { return find(id); }
    public List<Attendance> getByStudent(Long sid)           { return repo.findByStudentId(sid); }
    public List<Attendance> getByDate(LocalDate d)           { return repo.findByDate(d); }
    public List<Attendance> getRange(Long sid, LocalDate s, LocalDate e) {
        return repo.findByStudentIdAndDateBetween(sid, s, e);
    }

    public Map<String,Object> getSummary(Long studentId) {
        List<Attendance> list = repo.findByStudentId(studentId);
        long total   = list.size();
        long present = list.stream().filter(a -> "PRESENT".equals(a.getStatus())).count();
        long absent  = list.stream().filter(a -> "ABSENT".equals(a.getStatus())).count();
        long late    = list.stream().filter(a -> "LATE".equals(a.getStatus())).count();
        double pct   = total > 0 ? Math.round(((double) present / total) * 10000.0) / 100.0 : 0;
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("totalDays",total); m.put("presentDays",present); m.put("absentDays",absent);
        m.put("lateDays",late);   m.put("attendancePercentage",pct);
        return m;
    }

    public Attendance update(Long id, AttendanceDTO d) {
        Attendance a = find(id);
        a.setStudent(findStudent(d.getStudentId())); a.setDate(d.getDate());
        a.setSubject(d.getSubject()); a.setStatus(d.getStatus().toUpperCase()); a.setRemarks(d.getRemarks());
        return repo.save(a);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new RuntimeException("Attendance not found: " + id);
        repo.deleteById(id);
    }

    private Attendance find(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Attendance not found: " + id));
    }
    private Student findStudent(Long id) {
        return studentRepo.findById(id).orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }
}
