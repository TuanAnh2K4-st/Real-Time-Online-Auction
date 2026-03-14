package vn.edu.nlu.fit.auction.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.nlu.fit.auction.dto.request.LoginRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterRequest;
import vn.edu.nlu.fit.auction.dto.request.GoogleLoginRequest;
import vn.edu.nlu.fit.auction.service.AuthService;
import vn.edu.nlu.fit.auction.entity.User;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
        String result = authService.register(request);
        return ResponseEntity.ok(result);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        String result = authService.login(request);
        return ResponseEntity.ok(result);
    }

    // GOOGLE LOGIN
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request){

        User user = authService.googleLogin(request.getIdToken());

        if(user == null){
            return ResponseEntity.badRequest().body("Google login failed");
        }

        return ResponseEntity.ok(user);
    }
}
