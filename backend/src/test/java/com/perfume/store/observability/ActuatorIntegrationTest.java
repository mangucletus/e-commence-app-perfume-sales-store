package com.perfume.store.observability;

import com.perfume.store.service.CartService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ActuatorIntegrationTest {

    @Autowired
    TestRestTemplate restTemplate;

    @MockBean
    RedisConnectionFactory redisConnectionFactory;

    @MockBean
    CartService cartService;

    @Test
    void healthEndpoint_isPublicAndReturns200() {
        ResponseEntity<String> response = restTemplate.getForEntity("/actuator/health", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("status");
    }

    @Test
    void prometheusEndpoint_isPublicAndContainsMetrics() {
        ResponseEntity<String> response = restTemplate.getForEntity("/actuator/prometheus", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("jvm_memory_used_bytes");
        assertThat(response.getBody()).contains("process_uptime_seconds");
    }

    @Test
    void prometheusEndpoint_containsApplicationTag() {
        ResponseEntity<String> response = restTemplate.getForEntity("/actuator/prometheus", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("application=\"perfume-store\"");
    }

    @Test
    void cartEndpoint_withoutAuth_returns401() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/cart", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void productsEndpoint_withoutAuth_returns200() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/products", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
