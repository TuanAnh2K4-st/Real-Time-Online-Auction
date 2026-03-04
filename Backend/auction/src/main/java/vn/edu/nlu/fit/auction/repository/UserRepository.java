package vn.edu.nlu.fit.auction.repository;
import vn.edu.nlu.fit.auction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
