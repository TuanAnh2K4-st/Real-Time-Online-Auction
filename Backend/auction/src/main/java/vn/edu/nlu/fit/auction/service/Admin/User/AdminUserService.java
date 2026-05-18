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
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.mapper.Admin.User.AdminUserMapper;
import vn.edu.nlu.fit.auction.repository.Auth.UserRepository;
import vn.edu.nlu.fit.auction.repository.Profile.ProfileRepository;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
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
    
}
