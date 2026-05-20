package com.edutrack.service;

import com.edutrack.dto.FeeDTO;
import com.edutrack.entity.Fee;
import com.edutrack.entity.Student;
import com.edutrack.repository.FeeRepository;
import com.edutrack.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeeService {
    private final FeeRepository repo;
    private final StudentRepository studentRepo;

    public Fee create(FeeDTO dto) {
        Student student = studentRepo.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Fee fee = new Fee();
        fee.setStudent(student);
        fee.setFeeType(dto.getFeeType());
        fee.setAmount(dto.getAmount());
        fee.setPaid(dto.getPaid());
        fee.setDueDate(dto.getDueDate());
        fee.setStatus(dto.getStatus());
        fee.setMonth(dto.getMonth());

        return repo.save(fee);
    }

    public List<Fee> getAll() {
        return repo.findAll();
    }

    public Fee getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee record not found"));
    }

    public List<Fee> getByStudent(Long studentId) {
        return repo.findByStudentId(studentId);
    }

    public List<Fee> getByStatus(String status) {
        return repo.findByStatus(status);
    }

    public Fee update(Long id, FeeDTO dto) {
        Fee fee = getById(id);
        Student student = studentRepo.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        fee.setStudent(student);
        fee.setFeeType(dto.getFeeType());
        fee.setAmount(dto.getAmount());
        fee.setPaid(dto.getPaid());
        fee.setDueDate(dto.getDueDate());
        fee.setStatus(dto.getStatus());
        fee.setMonth(dto.getMonth());

        return repo.save(fee);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}