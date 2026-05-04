package vn.edu.nlu.fit.auction.repository.Auth;

import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    // kiểm tra email và username đã tồn tại chưa
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // tìm kiếm user theo email hoặc username
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    // lấy danh sách user theo email chứa chuỗi ký tự 
    List<User> findByEmailContainingIgnoreCase(String email);

    // lấy danh sách user theo role
    List<User> findByRole(UserRole role);
     
}
