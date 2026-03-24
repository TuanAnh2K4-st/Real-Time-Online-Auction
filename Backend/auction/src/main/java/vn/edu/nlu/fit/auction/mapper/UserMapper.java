package vn.edu.nlu.fit.auction.mapper;

import vn.edu.nlu.fit.auction.dto.response.UserLoginResponse;
import vn.edu.nlu.fit.auction.dto.response.UserResponse;
import vn.edu.nlu.fit.auction.entity.User;

public class UserMapper {

    public static UserLoginResponse toLoginResponse(User user) {
        return new UserLoginResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail()
        );
    }

    public static UserResponse toResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getStatus(),
                user.getRole(),
                user.getProvider()
        );
    }
}
