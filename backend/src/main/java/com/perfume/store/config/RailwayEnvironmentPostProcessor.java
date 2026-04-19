package com.perfume.store.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Converts Railway's postgres:// DATABASE_URL and redis:// REDIS_URL
 * into the spring.datasource.* and spring.data.redis.* properties that
 * Spring Boot expects. Runs before the application context is refreshed.
 */
public class RailwayEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment env, SpringApplication app) {
        translateDatabaseUrl(env);
        translateRedisUrl(env);
    }

    private void translateDatabaseUrl(ConfigurableEnvironment env) {
        String raw = env.getProperty("DATABASE_URL");
        if (raw == null || raw.isBlank()) return;
        // Don't override if already set explicitly via SPRING_DATASOURCE_URL
        if (env.getProperty("SPRING_DATASOURCE_URL") != null) return;

        try {
            // URI.create can't handle postgres:// scheme directly
            URI uri = URI.create(raw.replaceFirst("^postgres(ql)?://", "http://"));
            String host = uri.getHost();
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String db = uri.getPath().replaceFirst("^/", "");
            String user = "", pass = "";
            if (uri.getUserInfo() != null) {
                String[] parts = uri.getUserInfo().split(":", 2);
                user = parts[0];
                pass = parts.length > 1 ? parts[1] : "";
            }

            Map<String, Object> props = new LinkedHashMap<>();
            props.put("spring.datasource.url", "jdbc:postgresql://" + host + ":" + port + "/" + db);
            props.put("spring.datasource.username", user);
            props.put("spring.datasource.password", pass);
            env.getPropertySources().addFirst(new MapPropertySource("railway-db", props));
        } catch (Exception ignored) {}
    }

    private void translateRedisUrl(ConfigurableEnvironment env) {
        String raw = env.getProperty("REDIS_URL");
        if (raw == null || raw.isBlank()) return;
        if (env.getProperty("SPRING_DATA_REDIS_HOST") != null) return;

        try {
            URI uri = URI.create(raw);
            Map<String, Object> props = new LinkedHashMap<>();
            props.put("spring.data.redis.host", uri.getHost());
            if (uri.getPort() > 0) props.put("spring.data.redis.port", uri.getPort());
            if (uri.getUserInfo() != null && uri.getUserInfo().contains(":")) {
                String redisPass = uri.getUserInfo().split(":", 2)[1];
                if (!redisPass.isBlank()) props.put("spring.data.redis.password", redisPass);
            }
            env.getPropertySources().addFirst(new MapPropertySource("railway-redis", props));
        } catch (Exception ignored) {}
    }
}
