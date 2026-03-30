package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Store;

public interface StoreRepository extends JpaRepository<Store, Integer> {
    
}
