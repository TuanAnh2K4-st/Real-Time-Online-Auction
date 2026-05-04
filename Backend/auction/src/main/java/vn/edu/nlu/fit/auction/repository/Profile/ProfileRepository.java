package vn.edu.nlu.fit.auction.repository.Profile;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.User;

public interface ProfileRepository extends JpaRepository<Profile, Integer> {

    // tìm profile theo user
    Optional<Profile> findByUser(User user);

}
