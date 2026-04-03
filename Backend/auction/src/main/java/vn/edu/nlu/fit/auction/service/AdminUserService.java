package vn.edu.nlu.fit.auction.service;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.UpdateUserRequest;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.mapper.UserMapper;
import vn.edu.nlu.fit.auction.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // UPDATE USER
    public User updateUser(Integer userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateUser(user, request);

        return userRepository.save(user);
    }

    // DELETE USER
    public void deleteUser(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }

    // SEARCH EMAIL
    public List<User> searchByEmail(String email) {
        return userRepository.findByEmailContainingIgnoreCase(email);
    }

    // GET BY ROLE
    public List<User> getByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    // Chuyen trang thai STATUS
    public User toggleStatus(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            user.setStatus(UserStatus.BANNED);
        } else {
            user.setStatus(UserStatus.ACTIVE);
        }

        return userRepository.save(user);
    }
}
