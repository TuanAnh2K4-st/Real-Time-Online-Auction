package vn.edu.nlu.fit.auction.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import vn.edu.nlu.fit.auction.dto.request.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.ProfileResponse;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.mapper.ProfileMapper;
import vn.edu.nlu.fit.auction.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // Lấy userId từ SecurityContext (đã được JwtFilter set)
    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("Unauthorized");
        }

        return (Integer) auth.getPrincipal();
    }

    // UPDATE PROFILE
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @RequestBody UpdateProfileRequest request
    ) {
        Integer userId = getCurrentUserId();

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
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {

        Integer userId = getCurrentUserId();

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
            @RequestParam("file") MultipartFile file) {

        Integer userId = getCurrentUserId();

        String avatarUrl = profileService.updateAvatar(userId, file);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "Upload avatar success",
                        avatarUrl
                )
        );
    }
}