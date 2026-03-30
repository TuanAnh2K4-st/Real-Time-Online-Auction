package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Business;

public interface BusinessRepository extends JpaRepository<Business, Integer> {

    
}
