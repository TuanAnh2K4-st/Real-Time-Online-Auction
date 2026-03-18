package vn.edu.nlu.fit.auction.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vn.edu.nlu.fit.auction.dto.request.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.repository.ProfileRepository;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private CloudinaryService cloudinaryService;


    public Profile updateProfile(Integer userId, UpdateProfileRequest request) {

        Profile profile = profileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // update field
        if (request.getFullName() != null)
        profile.setFullName(request.getFullName());

        if (request.getPhone() != null)
        profile.setPhone(request.getPhone());

        if (request.getAddress() != null)
        profile.setAddress(request.getAddress());

        if (request.getGender() != null)
        profile.setGender(request.getGender());

        if (request.getJob() != null)
        profile.setJob(request.getJob());

        if (request.getBio() != null)
        profile.setBio(request.getBio());

        return profileRepository.save(profile);
    }

    public Profile getProfileByUserId(Integer userId) {
        return profileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public String updateAvatar(Integer userId, MultipartFile file) {

        Profile profile = profileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Xóa avatar cũ (nếu có)
        if (profile.getAvatarPublicId() != null) {
            // cloudinaryService.deleteFile(profile.getAvatarPublicId());
        }

        // Upload avatar mới
        Map<String, String> result = cloudinaryService.uploadFile(file);

        // Lưu DB
        profile.setAvatarUrl(result.get("url"));
        profile.setAvatarPublicId(result.get("publicId"));

        profileRepository.save(profile);

        return result.get("url");
    }
}
