package vn.edu.nlu.fit.auction.controller.Profile;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Profile.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Profile.ProfileResponse;
import vn.edu.nlu.fit.auction.service.Profile.ProfileService;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // Api lấy thông tin profile của user hiện tại
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile() {

        ProfileResponse response = profileService.getMyProfile();

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy thông tin profile thành công", response)
        );
    }

    // Api cập nhật thông tin profile của user hiện tại
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @RequestBody UpdateProfileRequest body
    ) {

        ProfileResponse response = profileService.updateProfile(body);

        return ResponseEntity.ok(
                new ApiResponse<>("Update profile thành công", response)
        );
    }

    // Api cập nhật avatar của user hiện tại
    @PutMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateAvatar(
            @RequestPart MultipartFile avatar
    ) {

        String avatarUrl = profileService.updateAvatar(avatar);

        return ResponseEntity.ok(
                new ApiResponse<>("Update avatar thành công", avatarUrl)
        );
    }
}