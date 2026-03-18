package vn.edu.nlu.fit.auction.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vn.edu.nlu.fit.auction.dto.request.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.service.JwtService;
import vn.edu.nlu.fit.auction.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtService jwtService;

    // Helper lấy userId
    private Integer getUserIdFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return jwtService.extractUserId(token);
    }

    // Update profile
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request
    ) {
        Integer userId = getUserIdFromHeader(authHeader);
        Profile profile = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

    // Get profile
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(
            @RequestHeader("Authorization") String authHeader
    ) {
        Integer userId = getUserIdFromHeader(authHeader);
        Profile profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    // Upload avatar
    @PutMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file) {

        Integer userId = getUserIdFromHeader(authHeader);

        String avatarUrl = profileService.updateAvatar(userId, file);

        return ResponseEntity.ok(Map.of(
                "message", "Upload avatar success",
                "avatarUrl", avatarUrl
        ));
    }
}
