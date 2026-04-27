package com.edutrack.repository;
import com.edutrack.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findByStudentIdAndSubject(Long studentId, String subject);

    @Query("SELECT g.student.id, g.student.fullName, AVG(g.marksObtained/g.totalMarks*100) AS avg " +
           "FROM Grade g GROUP BY g.student.id, g.student.fullName ORDER BY avg DESC")
    List<Object[]> getTopPerformers();
}
