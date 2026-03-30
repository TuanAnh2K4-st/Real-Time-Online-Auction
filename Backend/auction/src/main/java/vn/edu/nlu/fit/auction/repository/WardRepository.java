package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Ward;

public interface WardRepository extends JpaRepository<Ward, Integer> {
    
}
