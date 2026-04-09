package vn.edu.nlu.fit.auction.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterUserRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.LoginResponse;
import vn.edu.nlu.fit.auction.dto.response.UserResponse;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.repository.UserRepository;
import vn.edu.nlu.fit.auction.security.JwtService;
import vn.edu.nlu.fit.auction.service.AuthService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    // REGISTER SELLER
    @PostMapping("/register-seller")
    public ResponseEntity<ApiResponse<Void>> registerSeller(@RequestBody RegisterSellerRequest request){

        authService.registerSeller(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Đăng ký thành công", null)
        );
    }

    // REGISTER USER
    @PostMapping("/register-user")
    public ResponseEntity<ApiResponse<Void>> registerUser(@RequestBody RegisterUserRequest request){

        authService.registerUser(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Đăng ký thành công", null)
        );
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request){
        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Đăng nhập thành công", response)
        );
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        // Lấy token từ header
        String token = authHeader.replace("Bearer ", "");

        UserResponse userResponse = authService.getCurrentUser(token);

        return ResponseEntity.ok(userResponse);
    }
    
}