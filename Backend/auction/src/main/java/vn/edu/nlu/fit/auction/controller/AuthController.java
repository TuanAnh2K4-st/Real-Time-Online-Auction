package vn.edu.nlu.fit.auction.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.nlu.fit.auction.dto.request.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterUserRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.AuthResponse;
import vn.edu.nlu.fit.auction.dto.request.GoogleLoginRequest;
import vn.edu.nlu.fit.auction.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    // REGISTER SELLER
    @PostMapping("/register-seller")
    public ResponseEntity<ApiResponse<Void>> registerSeller(@RequestBody RegisterSellerRequest request){

        authService.registerSeller(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Register success", null)
        );
    }
    // REGISTER USER
    @PostMapping("/register-user")
    public ResponseEntity<ApiResponse<Void>> registerUser(@RequestBody RegisterUserRequest request){

        authService.registerUser(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Register success", null)
        );
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request){

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
                new ApiResponse<>("Login success", response)
        );
    }

    // GOOGLE LOGIN
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(
            @RequestBody GoogleLoginRequest request){

        AuthResponse response = authService.googleLogin(request.getIdToken());

        return ResponseEntity.ok(
                new ApiResponse<>("Google login success", response)
        );
    }
}