package com.edutrack.service;
import com.edutrack.dto.*;
import com.edutrack.entity.User;
import com.edutrack.repository.UserRepository;
import com.edutrack.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final UserDetailsService uds;

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered: " + req.getEmail());
        User u = new User();
        u.setFullName(req.getFullName()); u.setEmail(req.getEmail());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setRole(req.getRole().toUpperCase());
        userRepo.save(u);
        String token = jwtUtil.generateToken(uds.loadUserByUsername(u.getEmail()));
        return new AuthResponse(token, u.getEmail(), u.getFullName(), u.getRole(), "Registration successful!");
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User u = userRepo.findByEmail(req.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtUtil.generateToken(uds.loadUserByUsername(u.getEmail()));
        return new AuthResponse(token, u.getEmail(), u.getFullName(), u.getRole(), "Login successful!");
    }
}
