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
}
