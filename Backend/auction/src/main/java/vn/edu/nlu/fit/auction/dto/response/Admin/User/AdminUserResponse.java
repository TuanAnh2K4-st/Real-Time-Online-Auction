package vn.edu.nlu.fit.auction.dto.response.Admin.User;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {

    private Integer userId;

    private String username;

    private String email;

    private Integer reputationScore;

    private UserStatus status;

    private UserRole role;

    private String provider;

    private LocalDateTime createdAt;

    // PROFILE
    private String fullName;

    private String phone;

    private String avatarUrl;

    private String gender;

    private String job;

    private String bio;
}
