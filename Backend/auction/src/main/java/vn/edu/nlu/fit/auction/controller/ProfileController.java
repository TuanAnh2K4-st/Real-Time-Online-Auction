package vn.edu.nlu.fit.auction.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.ProfileResponse;
import vn.edu.nlu.fit.auction.service.JwtService;
import vn.edu.nlu.fit.auction.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    
    private final ProfileService profileService;
    private final JwtService jwtService;

    // ===== GET PROFILE =====
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            HttpServletRequest request
    ) {
        Integer userId = extractUserIdFromRequest(request);

        ProfileResponse response = profileService.getMyProfile(userId);

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy profile thành công", response)
        );
    }   

    // ===== UPDATE INFO =====
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            HttpServletRequest request,
            @RequestBody UpdateProfileRequest body
    ) {
        Integer userId = extractUserIdFromRequest(request);

        ProfileResponse response = profileService.updateProfile(userId, body);

        return ResponseEntity.ok(
                new ApiResponse<>("Update profile thành công", response)
        );
    }

    // ===== UPDATE AVATAR =====
    @PutMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateAvatar(
            HttpServletRequest request,
            @RequestPart MultipartFile avatar
    ) {
        Integer userId = extractUserIdFromRequest(request);

        String avatarUrl = profileService.updateAvatar(userId, avatar);

        return ResponseEntity.ok(
                new ApiResponse<>("Update avatar thành công", avatarUrl)
        );
    }

    // ===== HELPER METHOD =====
    private Integer extractUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        return jwtService.extractUserId(token);
    }
}
