package vn.edu.nlu.fit.auction.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Business;

public interface BusinessRepository extends JpaRepository<Business, Integer> {

    Optional<Business> findByUser_UserId(Integer userId);
    
}
