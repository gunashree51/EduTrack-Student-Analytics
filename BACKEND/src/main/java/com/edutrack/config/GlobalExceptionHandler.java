package com.edutrack.config;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,Object>> runtime(RuntimeException e) {
        return err(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String,Object>> badCreds(BadCredentialsException e) {
        return err(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> validation(MethodArgumentNotValidException e) {
        Map<String,String> fields = new HashMap<>();
        for (FieldError fe : e.getBindingResult().getFieldErrors())
            fields.put(fe.getField(), fe.getDefaultMessage());
        Map<String,Object> body = new LinkedHashMap<>();
        body.put("status",400); body.put("message","Validation failed");
        body.put("errors",fields); body.put("timestamp",LocalDateTime.now());
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> all(Exception e) {
        return err(HttpStatus.INTERNAL_SERVER_ERROR, "Error: " + e.getMessage());
    }

    private ResponseEntity<Map<String,Object>> err(HttpStatus s, String msg) {
        Map<String,Object> b = new LinkedHashMap<>();
        b.put("status",s.value()); b.put("message",msg); b.put("timestamp",LocalDateTime.now());
        return ResponseEntity.status(s).body(b);
    }
}
