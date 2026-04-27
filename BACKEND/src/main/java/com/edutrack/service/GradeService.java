package com.edutrack.service;
import com.edutrack.dto.GradeDTO;
import com.edutrack.entity.*;
import com.edutrack.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service @RequiredArgsConstructor
public class GradeService {
    private final GradeRepository   repo;
    private final StudentRepository studentRepo;

    public Grade create(GradeDTO d) {
        Grade g = new Grade();
        g.setStudent(findStudent(d.getStudentId())); g.setSubject(d.getSubject());
        g.setExamType(d.getExamType()); g.setMarksObtained(d.getMarksObtained());
        g.setTotalMarks(d.getTotalMarks()); g.setGrade(d.getGrade());
        g.setRemarks(d.getRemarks()); g.setAcademicYear(d.getAcademicYear());
        return repo.save(g);
    }

    public List<Grade>    getAll()             { return repo.findAll(); }
    public Grade          getById(Long id)     { return find(id); }
    public List<Grade>    getByStudent(Long s) { return repo.findByStudentId(s); }
    public List<Object[]> getTopPerformers()   { return repo.getTopPerformers(); }

    public Map<String,Object> getSummary(Long studentId) {
        List<Grade> grades = repo.findByStudentId(studentId);
        Map<String,List<Double>> bySubj = new LinkedHashMap<>();
        for (Grade g : grades)
            bySubj.computeIfAbsent(g.getSubject(), k -> new ArrayList<>())
                  .add((g.getMarksObtained() / g.getTotalMarks()) * 100);
        Map<String,Double> averages = new LinkedHashMap<>();
        bySubj.forEach((s, scores) ->
            averages.put(s, Math.round(scores.stream().mapToDouble(Double::doubleValue).average().orElse(0)*100)/100.0));
        double overall = grades.stream()
            .mapToDouble(g -> (g.getMarksObtained()/g.getTotalMarks())*100).average().orElse(0);
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("totalExams",grades.size()); m.put("subjectAverages",averages);
        m.put("overallAverage", Math.round(overall*100)/100.0);
        return m;
    }

    public Grade update(Long id, GradeDTO d) {
        Grade g = find(id);
        g.setStudent(findStudent(d.getStudentId())); g.setSubject(d.getSubject());
        g.setExamType(d.getExamType()); g.setMarksObtained(d.getMarksObtained());
        g.setTotalMarks(d.getTotalMarks()); g.setGrade(d.getGrade());
        g.setRemarks(d.getRemarks()); g.setAcademicYear(d.getAcademicYear());
        return repo.save(g);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new RuntimeException("Grade not found: " + id);
        repo.deleteById(id);
    }

    private Grade find(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Grade not found: " + id));
    }
    private Student findStudent(Long id) {
        return studentRepo.findById(id).orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }
}
