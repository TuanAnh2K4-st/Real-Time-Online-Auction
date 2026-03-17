package vn.edu.nlu.fit.auction.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request
    ) {

        String token = authHeader.replace("Bearer ", "");

        Integer userId = jwtService.extractUserId(token);

        Profile profile = profileService.updateProfile(userId, request);

        return ResponseEntity.ok(profile);
    }
}
