package vn.edu.nlu.fit.auction.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import vn.edu.nlu.fit.auction.security.JwtFilter;
import vn.edu.nlu.fit.auction.security.OAuth2SuccessHandler;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})

            .csrf(csrf -> csrf.disable())

            // không dùng session
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // phân quyền
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // login, register
                // public API
                .requestMatchers("/api/stores/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/ws/**").permitAll() // WebSocket
                .requestMatchers("/api/auctions/*/detail").permitAll() // xem chi tiết auction
                .requestMatchers("/api/auctions/home/**").permitAll() // trang chủ
                .anyRequest().authenticated()
            )

            // disable login form mặc định
            .formLogin(form -> form.disable())

            // disable basic auth
            .httpBasic(basic -> basic.disable())

            // OAuth2 login
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler) // xử lý sau login Google
            )

            // ADD JWT FILTER
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}