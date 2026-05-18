package vn.edu.nlu.fit.auction.service.Admin.User;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.Admin.User.AdminUserResponse;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.repository.Auth.UserRepository;
import vn.edu.nlu.fit.auction.repository.Profile.ProfileRepository;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public List<AdminUserResponse> getUsers(String keyword, UserRole role) {

        Specification<User> specification = UserSpecification.filterUsers(keyword, role);

        List<User> users = userRepository.findAll(specification);

        return users.stream()
                .map(user -> {

                        Profile profile = profileRepository
                                .findByUser_UserId(user.getUserId())
                                .orElse(null);

                        AdminUserResponse response = AdminUserResponse.builder()
                                .userId(user.getUserId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .reputationScore(user.getReputationScore())
                                .status(user.getStatus())
                                .role(user.getRole())
                                .provider(user.getProvider() != null ? user.getProvider().name(): null)
                                .createdAt(user.getCreatedAt())

                                // PROFILE
                                .fullName( profile != null ? profile.getFullName() : null)
                                .phone( profile != null ? profile.getPhone() : null)
                                .avatarUrl( profile != null ? profile.getAvatarUrl() : null)
                                .gender( profile != null && profile.getGender() != null ? profile.getGender().name() : null)
                                .job(profile != null ? profile.getJob() : null)
                                .bio(profile != null ? profile.getBio() : null)
                                .build();

                        return response;
                })
                .toList();
    }
    
}
