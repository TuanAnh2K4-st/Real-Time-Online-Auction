package vn.edu.nlu.fit.auction.mapper;

import vn.edu.nlu.fit.auction.dto.response.ProfileResponse;
import vn.edu.nlu.fit.auction.entity.Profile;

public class ProfileMapper {

    public static ProfileResponse toResponse(Profile p) {
        return new ProfileResponse(
                p.getFullName(),
                p.getPhone(),
                p.getAddress(),
                p.getGender(),
                p.getJob(),
                p.getBio(),
                p.getAvatarUrl()
        );
    }
}