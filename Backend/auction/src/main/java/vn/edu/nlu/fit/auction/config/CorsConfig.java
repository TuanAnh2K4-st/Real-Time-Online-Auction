package vn.edu.nlu.fit.auction.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


// Cấu hình CORS cho backend (Spring Boot)
// Cho phép frontend (React) gọi API khác domain

@Configuration
public class CorsConfig {
    
    @Value("${server.fe.dev}")
    private String feDev;

    @Value("${server.fe.product}")
    private String feProduct;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Cho phép gửi cookie / Authorization header
        config.setAllowCredentials(true);

        // Domain FE (React)
        config.setAllowedOrigins(Arrays.asList(
                feDev,
                feProduct
        ));

        // Method cho phép
        config.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        // Header cho phép (QUAN TRỌNG với JWT)
        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin"
        ));

        // Header FE có thể đọc
        config.setExposedHeaders(Arrays.asList(
                "Authorization"
        ));

        // Cache preflight (tránh spam OPTIONS)
        config.setMaxAge(3600L);

        // Áp dụng toàn bộ API
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}

