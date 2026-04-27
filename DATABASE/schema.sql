-- ================================================================
--  EduTrack v2 — MySQL Database Setup
--  Run: mysql -u root -p < DATABASE/schema.sql
-- ================================================================
CREATE DATABASE IF NOT EXISTS edutrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edutrack_db;

CREATE TABLE IF NOT EXISTS users (
    id        BIGINT       AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    role      VARCHAR(20)  NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
    id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
    full_name    VARCHAR(100) NOT NULL,
    roll_number  VARCHAR(20)  NOT NULL UNIQUE,
    email        VARCHAR(150) NOT NULL,
    class_name   VARCHAR(50)  NOT NULL,
    section      VARCHAR(10)  NOT NULL,
    phone        VARCHAR(15),
    parent_name  VARCHAR(100),
    parent_phone VARCHAR(15),
    address      TEXT,
    status       VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS attendance (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT       NOT NULL,
    date       DATE         NOT NULL,
    subject    VARCHAR(100) NOT NULL,
    status     VARCHAR(20)  NOT NULL,
    remarks    TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grades (
    id             BIGINT       AUTO_INCREMENT PRIMARY KEY,
    student_id     BIGINT       NOT NULL,
    subject        VARCHAR(100) NOT NULL,
    exam_type      VARCHAR(50)  NOT NULL,
    marks_obtained DOUBLE       NOT NULL,
    total_marks    DOUBLE       NOT NULL,
    grade          VARCHAR(5)   NOT NULL,
    remarks        TEXT,
    academic_year  VARCHAR(10)  NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Default admin  (password = admin123)
INSERT INTO users (full_name, email, password, role) VALUES
('Admin User',   'admin@edutrack.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
('Demo Teacher', 'teacher@edutrack.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER');

INSERT INTO students (full_name, roll_number, email, class_name, section, phone, parent_name, status) VALUES
('Arjun Sharma', 'S001','arjun@school.com','10th Grade','A','9876543210','Rajesh Sharma','ACTIVE'),
('Priya Patel',  'S002','priya@school.com','10th Grade','A','9876543211','Suresh Patel', 'ACTIVE'),
('Rohit Verma',  'S003','rohit@school.com','10th Grade','B','9876543212','Anil Verma',   'ACTIVE'),
('Sneha Gupta',  'S004','sneha@school.com','9th Grade', 'A','9876543213','Mohan Gupta',  'INACTIVE'),
('Kavya Nair',   'S005','kavya@school.com','9th Grade', 'B','9876543214','Sunil Nair',   'ACTIVE'),
('Aarav Mehta',  'S006','aarav@school.com','11th Grade','A','9876543215','Dinesh Mehta', 'ACTIVE'),
('Zara Khan',    'S007','zara@school.com', '11th Grade','B','9876543216','Imran Khan',   'ACTIVE'),
('Dev Sharma',   'S008','dev@school.com',  '12th Grade','A','9876543217','Rakesh Sharma','ACTIVE');

INSERT INTO attendance (student_id, date, subject, status, remarks) VALUES
(1,'2024-01-15','Mathematics','PRESENT',NULL),(2,'2024-01-15','Mathematics','PRESENT',NULL),
(3,'2024-01-15','Mathematics','ABSENT','Sick leave'),(4,'2024-01-15','Mathematics','PRESENT',NULL),
(5,'2024-01-15','Mathematics','LATE','Bus delay'),(1,'2024-01-16','Science','PRESENT',NULL),
(2,'2024-01-16','Science','ABSENT','Medical appointment'),(6,'2024-01-16','Science','PRESENT',NULL);

INSERT INTO grades (student_id, subject, exam_type, marks_obtained, total_marks, grade, academic_year, remarks) VALUES
(1,'Mathematics','Midterm',85,100,'A','2024-25','Excellent'),
(2,'Mathematics','Midterm',92,100,'A+','2024-25','Outstanding'),
(3,'Science','Final',65,100,'C+','2024-25','Needs improvement'),
(4,'English','Quiz',78,100,'B+','2024-25','Good effort'),
(5,'History','Assignment',88,100,'A','2024-25',NULL),
(6,'Computer Sci','Final',96,100,'A+','2024-25','Top of class'),
(7,'Physics','Unit Test',73,100,'B','2024-25','Steady progress'),
(8,'Chemistry','Midterm',81,100,'A','2024-25','Well done');

SELECT 'Setup complete!' AS result;
