package com.perfume.store.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

class JwtUtilTest {

    private static final String SECRET =
            "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final long EXPIRATION = 86_400_000L;

    private JwtUtil jwtUtil;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(SECRET, EXPIRATION);
        userDetails = User.withUsername("john@example.com")
                .password("encoded")
                .authorities(List.of())
                .build();
    }

    @Test
    void generateToken_returnsNonNullToken() {
        String token = jwtUtil.generateToken(userDetails);

        assertThat(token).isNotNull().isNotBlank();
    }

    @Test
    void extractUsername_returnsCorrectEmail() {
        String token = jwtUtil.generateToken(userDetails);

        String username = jwtUtil.extractUsername(token);

        assertThat(username).isEqualTo("john@example.com");
    }

    @Test
    void isTokenValid_validTokenAndMatchingUser_returnsTrue() {
        String token = jwtUtil.generateToken(userDetails);

        boolean valid = jwtUtil.isTokenValid(token, userDetails);

        assertThat(valid).isTrue();
    }

    @Test
    void isTokenValid_tokenForDifferentUser_returnsFalse() {
        String token = jwtUtil.generateToken(userDetails);
        UserDetails otherUser = User.withUsername("other@example.com")
                .password("encoded")
                .authorities(List.of())
                .build();

        boolean valid = jwtUtil.isTokenValid(token, otherUser);

        assertThat(valid).isFalse();
    }

    @Test
    void isTokenValid_expiredToken_throwsExpiredJwtException() {
        JwtUtil shortLivedJwt = new JwtUtil(SECRET, 1L);
        String token = shortLivedJwt.generateToken(userDetails);

        assertThatThrownBy(() -> shortLivedJwt.isTokenValid(token, userDetails))
                .isInstanceOf(io.jsonwebtoken.ExpiredJwtException.class);
    }
}
