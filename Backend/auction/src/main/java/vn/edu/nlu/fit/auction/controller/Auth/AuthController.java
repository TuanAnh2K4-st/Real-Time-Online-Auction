package vn.edu.nlu.fit.auction.controller.Auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Auth.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.ChangePasswordRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterUserRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Auth.LoginResponse;
import vn.edu.nlu.fit.auction.service.Auth.AuthService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Api đăng ký người bán
    @PostMapping("/register-seller")
    public ResponseEntity<ApiResponse<Void>> registerSeller(@RequestBody RegisterSellerRequest request){

        authService.registerSeller(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Đăng ký thành công", null)
        );
    }

    // Api đăng ký người dùng
    @PostMapping("/register-user")
    public ResponseEntity<ApiResponse<Void>> registerUser(@RequestBody RegisterUserRequest request){

        authService.registerUser(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Đăng ký thành công", null)
        );
    }

    // Api đăng nhập
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request){
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
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Đổi mật khẩu thành công", null)
        );
    }
    
}