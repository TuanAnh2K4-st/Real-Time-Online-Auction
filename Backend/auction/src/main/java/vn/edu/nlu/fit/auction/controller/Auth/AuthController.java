package vn.edu.nlu.fit.auction.controller.Auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Auth.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.ChangePasswordRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterUserRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.VerifyOtpRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.ResendOtpRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Auth.LoginResponse;
import vn.edu.nlu.fit.auction.service.Auth.AuthService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    /**
     * Bước 1: Nhận thông tin đăng ký → sinh OTP → gửi email.
     * Chưa tạo tài khoản trong DB.
     */
    @PostMapping("/register-seller")
    public ResponseEntity<ApiResponse<Void>> registerSeller(@RequestBody RegisterSellerRequest request) {
        authService.preRegisterSeller(request);
        return ResponseEntity.ok(
                new ApiResponse<>("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và xác nhận.", null)
        );
    }

    @PostMapping("/register-user")
    public ResponseEntity<ApiResponse<Void>> registerUser(@RequestBody RegisterUserRequest request) {
        authService.preRegisterUser(request);
        return ResponseEntity.ok(
                new ApiResponse<>("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và xác nhận.", null)
        );
    }

    /**
     * Bước 2: Nhận OTP từ người dùng → xác thực → tạo tài khoản thật trong DB.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        authService.verifyOtpAndRegister(request);
        return ResponseEntity.ok(
                new ApiResponse<>("Xác thực thành công! Tài khoản đã được tạo.", null)
        );
    }

    /**
     * Gửi lại OTP mới (khi OTP cũ hết hạn hoặc người dùng muốn thử lại).
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<Void>> resendOtp(@RequestBody ResendOtpRequest request) {
        authService.resendOtp(request);
        return ResponseEntity.ok(
                new ApiResponse<>("Mã OTP mới đã được gửi đến email của bạn.", null)
        );
    }

    // Api đăng nhập
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(
                new ApiResponse<>("Đăng nhập thành công", response)
        );
    }

    // Api lấy thông tin user hiện tại
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LoginResponse>> getMe() {
        LoginResponse response = authService.getMe();
        return ResponseEntity.ok(
                new ApiResponse<>("Lấy thông tin người dùng thành công", response)
        );
    }

    // Api đổi mật khẩu
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok(
                new ApiResponse<>("Đổi mật khẩu thành công", null)
        );
    }
}