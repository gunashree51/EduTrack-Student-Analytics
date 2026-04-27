package com.edutrack.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${app.jwt.secret}")      private String secret;
    @Value("${app.jwt.expiration}")  private Long   expiration;

    public String generateToken(UserDetails user) {
        return Jwts.builder()
            .setSubject(user.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(key(), SignatureAlgorithm.HS256).compact();
    }

    public boolean isTokenValid(String token, UserDetails user) {
        return extractEmail(token).equals(user.getUsername()) && !isExpired(token);
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private boolean isExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public <T> T extractClaim(String token, Function<Claims, T> fn) {
        return fn.apply(Jwts.parserBuilder().setSigningKey(key())
            .build().parseClaimsJws(token).getBody());
    }

    private Key key() { return Keys.hmacShaKeyFor(secret.getBytes()); }
}
