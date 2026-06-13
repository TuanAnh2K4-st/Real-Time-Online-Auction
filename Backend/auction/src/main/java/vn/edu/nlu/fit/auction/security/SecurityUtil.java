package vn.edu.nlu.fit.auction.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import vn.edu.nlu.fit.auction.entity.User;

@Component
public class SecurityUtil {

    // lấy thông tin user hiện tại từ security context
    public User getCurrentUser() {
        // lấy authentication từ security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // nếu authentication null hoặc principal không phải là instance của User thì ném lỗi unauthorized
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new RuntimeException("Unauthorized");
        }

        // trả về user hiện tại
        return (User) authentication.getPrincipal();
    }

    /** Dùng cho API public (vd: chi tiết đấu giá) khi có thể không đăng nhập */
    public User getCurrentUserOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            return null;
        }
        return (User) authentication.getPrincipal();
    }
}
