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
import vn.edu.nlu.fit.auction.repository.Auth.UserRepository;

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
        // B1: Lấy header Authorization từ request (FE gửi lên)
        String header = request.getHeader("Authorization");
        // B2: Kiểm tra header có tồn tại và đúng format "Bearer xxx"
        if (header != null && header.startsWith("Bearer ")) {
            // B3: Cắt bỏ "Bearer " để lấy token thật
            String token = header.substring(7);

            try {
                // B4: Kiểm tra token có hợp lệ không (chữ ký, hết hạn,...)
                if (jwtService.isTokenValid(token)) {
                     // B5: Lấy thông tin từ token (userId, role,...)
                    Integer userId = jwtService.extractUserId(token);
                    String role = jwtService.extractRole(token);
                     // B6: Kiểm tra SecurityContext đã có authentication chưa
                    if (SecurityContextHolder.getContext().getAuthentication() == null) {

                        // B7: LẤY USER TỪ DATABASE THEO userId
                        User user = userRepository.findById(userId)
                                .orElse(null);

                        if (user != null) {
                             // B8: Tạo quyền (ROLE_USER, ROLE_ADMIN,...)
                            List<SimpleGrantedAuthority> authorities =
                                    List.of(new SimpleGrantedAuthority("ROLE_" + role));

                             // B9: Tạo Authentication object
                            // principal = user (có thể lấy lại ở controller)
                            UsernamePasswordAuthenticationToken auth =
                                    new UsernamePasswordAuthenticationToken(
                                            user,
                                            null,
                                            authorities
                                    );
                            // B10: Set vào SecurityContext để Spring Security biết user đã được xác thực
                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    }
                }
            // Bắt lỗi
            } catch (Exception e) {
                 // B11: Nếu token lỗi → trả về 401
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
         // B12: Cho request đi tiếp (qua các filter khác → controller)
        filterChain.doFilter(request, response);
    }
}