# ⚙️ BACKEND Folder — Spring Boot REST API

## Tech Stack
- Java 17
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL 8

## ▶️ How to Run

### Step 1 — Set your MySQL password
Open: `src/main/resources/application.properties`
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

### Step 2 — Run
```bash
mvn spring-boot:run
```

API will be available at: **http://localhost:8080/api**

## 📂 Package Structure
```
src/main/java/com/edutrack/
├── EduTrackApplication.java    ← Main entry point
├── config/
│   ├── SecurityConfig.java     ← JWT + CORS + route protection
│   └── GlobalExceptionHandler.java
├── security/
│   ├── JwtUtil.java            ← Token generate/validate
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── entity/       User · Student · Attendance · Grade
├── dto/          Request/Response objects
├── repository/   Database queries (JPA)
├── service/      Business logic
└── controller/   REST API endpoints
```

## 🔑 API Endpoints
```
POST /api/auth/register
POST /api/auth/login

GET    /api/students
POST   /api/students
PUT    /api/students/{id}
DELETE /api/students/{id}

GET    /api/attendance
POST   /api/attendance
PUT    /api/attendance/{id}
DELETE /api/attendance/{id}

GET    /api/grades
POST   /api/grades
PUT    /api/grades/{id}
DELETE /api/grades/{id}
```
