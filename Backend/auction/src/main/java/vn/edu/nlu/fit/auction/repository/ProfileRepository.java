package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import vn.edu.nlu.fit.auction.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Integer> {

    Optional<Profile> findByUser_UserId(Integer userId);

}
