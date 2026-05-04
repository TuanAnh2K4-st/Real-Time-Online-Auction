package vn.edu.nlu.fit.auction.repository.Profile;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Business;
import vn.edu.nlu.fit.auction.entity.User;

public interface BusinessRepository extends JpaRepository<Business, Integer> {

    // tìm business theo user
    Optional<Business> findByUser(User user);
    
}
