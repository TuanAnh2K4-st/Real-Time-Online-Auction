package vn.edu.nlu.fit.auction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.nlu.fit.auction.dto.request.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.repository.ProfileRepository;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    public Profile updateProfile(Integer userId, UpdateProfileRequest request) {

        Profile profile = profileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // update field
        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setGender(request.getGender());
        profile.setJob(request.getJob());
        profile.setBio(request.getBio());

        return profileRepository.save(profile);
    }
}
