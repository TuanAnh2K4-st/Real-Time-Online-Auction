package vn.edu.nlu.fit.auction.security;

import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.repository.UserRepository;
import vn.edu.nlu.fit.auction.service.JwtService;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {
                if (jwtService.isTokenValid(token)) {

                    Integer userId = jwtService.extractUserId(token);
                    String role = jwtService.extractRole(token);

                    if (SecurityContextHolder.getContext().getAuthentication() == null) {

                        // LẤY USER TỪ DB
                        User user = userRepository.findById(userId)
                                .orElse(null);

                        if (user != null) {

                            List<SimpleGrantedAuthority> authorities =
                                    List.of(new SimpleGrantedAuthority("ROLE_" + role));

                            // principal = USER
                            UsernamePasswordAuthenticationToken auth =
                                    new UsernamePasswordAuthenticationToken(
                                            user,
                                            null,
                                            authorities
                                    );

                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    }
                }

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");

                response.getWriter().write("""
                    {
                        "message": "Token không hợp lệ hoặc đã hết hạn"
                    }
                """);
                return; // dừng filter chain
            }
        }

        filterChain.doFilter(request, response);
    }
}