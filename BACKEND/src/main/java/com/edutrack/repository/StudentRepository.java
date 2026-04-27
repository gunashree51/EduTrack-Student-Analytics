package com.edutrack.repository;
import com.edutrack.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    boolean existsByRollNumber(String rollNumber);
    List<Student> findByClassName(String className);
    List<Student> findByFullNameContainingIgnoreCase(String name);
    List<Student> findByStatus(String status);
}
