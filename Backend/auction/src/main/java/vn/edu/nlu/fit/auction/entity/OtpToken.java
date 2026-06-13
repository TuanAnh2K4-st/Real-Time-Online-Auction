package vn.edu.nlu.fit.auction.entity;

import java.time.LocalDateTime;
import lombok.*;

/**
 * POJO lưu thông tin đăng ký tạm thời trong bộ nhớ (không lưu DB).
 * Dùng để chờ người dùng xác thực OTP trước khi tạo tài khoản thực sự.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpToken {

    // Loại đăng ký: "user" hoặc "seller"
    private String registerType;

    // Thông tin đăng ký
    private String username;
    private String email;
    private String rawPassword;      // Mật khẩu gốc (chưa hash), hash khi tạo user thật
    private String companyName;      // Chỉ dùng với seller

    // OTP
    private String otpCode;          // Mã 6 chữ số
    private LocalDateTime expiresAt; // Hết hạn sau 3 phút
}
