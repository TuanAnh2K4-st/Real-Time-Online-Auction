package vn.edu.nlu.fit.auction.repository;

import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    // search theo email
    List<User> findByEmailContainingIgnoreCase(String email);

    // lấy theo role
    List<User> findByRole(UserRole role);
     
}
