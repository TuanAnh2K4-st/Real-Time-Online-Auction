package vn.edu.nlu.fit.auction.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import vn.edu.nlu.fit.auction.dto.request.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.ProfileResponse;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.mapper.ProfileMapper;
import vn.edu.nlu.fit.auction.service.JwtService;
import vn.edu.nlu.fit.auction.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtService jwtService;

    private Integer getUserIdFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return jwtService.extractUserId(token);
    }

    // UPDATE PROFILE
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request
    ) {
        Integer userId = getUserIdFromHeader(authHeader);

        Profile profile = profileService.updateProfile(userId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "Update profile success",
                        ProfileMapper.toResponse(profile)
                )
        );
    }

    // GET PROFILE
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            @RequestHeader("Authorization") String authHeader
    ) {
        Integer userId = getUserIdFromHeader(authHeader);

        Profile profile = profileService.getProfileByUserId(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "Get profile success",
                        ProfileMapper.toResponse(profile)
                )
        );
    }

    // UPLOAD AVATAR
    @PutMapping("/avatar")
    public ResponseEntity<ApiResponse<String>> uploadAvatar(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file) {

        Integer userId = getUserIdFromHeader(authHeader);

        String avatarUrl = profileService.updateAvatar(userId, file);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "Upload avatar success",
                        avatarUrl
                )
        );
    }
}