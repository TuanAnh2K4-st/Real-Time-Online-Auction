package vn.edu.nlu.fit.auction.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.ProfileResponse;
import vn.edu.nlu.fit.auction.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    
    private final ProfileService profileService;

    // ===== GET PROFILE =====
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            @RequestParam Integer userId
    ) {

        ProfileResponse response = profileService.getMyProfile(userId);

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy profile thành công", response)
        );
    }

    // ===== UPDATE INFO =====
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @RequestParam Integer userId,
            @RequestBody UpdateProfileRequest request
    ) {

        ProfileResponse response = profileService.updateProfile(userId, request);

        return ResponseEntity.ok(
                new ApiResponse<>("Update profile thành công", response)
        );
    }

    // ===== UPDATE AVATAR =====
    @PutMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateAvatar(
            @RequestParam Integer userId,
            @RequestPart MultipartFile avatar
    ) {

        String avatarUrl = profileService.updateAvatar(userId, avatar);

        return ResponseEntity.ok(
                new ApiResponse<>("Update avatar thành công", avatarUrl)
        );
    }
}
