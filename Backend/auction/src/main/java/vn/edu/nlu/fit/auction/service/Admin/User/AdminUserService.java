package vn.edu.nlu.fit.auction.service.Admin.User;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.User.CreateUserRequest;
import vn.edu.nlu.fit.auction.dto.response.Admin.User.AdminUserResponse;
import vn.edu.nlu.fit.auction.entity.Business;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.AuthProvider;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.mapper.Admin.User.AdminUserMapper;
import vn.edu.nlu.fit.auction.repository.Auth.UserRepository;
import vn.edu.nlu.fit.auction.repository.Profile.BusinessRepository;
import vn.edu.nlu.fit.auction.repository.Profile.ProfileRepository;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final BusinessRepository businessRepository;
    private final AdminUserMapper adminUserMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public List<AdminUserResponse> getUsers( String keyword, UserRole role) {

        Specification<User> specification = UserSpecification.filterUsers(keyword, role);
        List<User> users = userRepository.findAll(specification);

        return users.stream()
                .map(user -> {

                    Profile profile = profileRepository
                            .findByUser_UserId(user.getUserId())
                            .orElse(null);

                    return adminUserMapper.toResponse(user, profile);
                })
                .toList();
    }
    
    public void changeStatus(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User không tồn tại"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            user.setStatus(UserStatus.BANNED);
        } else {
            user.setStatus(UserStatus.ACTIVE);
        }

        userRepository.save(user);
    }

    public void changeRole( Integer userId, UserRole newRole) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User không tồn tại"));

        if (user.getRole() == newRole) {
            throw new RuntimeException(
                    "User đã có role này"
            );
        }

        user.setRole(newRole);

        userRepository.save(user);
    }

    public void createUser(CreateUserRequest request) {

        // ===== CHECK USERNAME =====
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException(
                    "Username đã tồn tại"
            );
        }

        // ===== CHECK EMAIL =====
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Email đã tồn tại"
            );
        }

        // ===== CREATE USER =====
        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getUserRole())
            .status(UserStatus.ACTIVE)
            .provider(AuthProvider.LOCAL)
            .providerId(null)
            .reputationScore(80)
            .build();

        userRepository.save(user);

        // ===== CREATE PROFILE =====
        Profile profile = Profile.builder()
                .user(user)
                .build();

        profileRepository.save(profile);

        // ===== CREATE BUSINESS IF SELLER =====
        if (request.getUserRole() == UserRole.SELLER) {

            Business business = Business.builder()
                    .user(user)
                    .businessName(request.getUsername())
                    .build();

            businessRepository.save(business);
        }
    }

}
