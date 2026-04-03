package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.StoreItem;

public interface StoreItemRepository extends JpaRepository<StoreItem, Integer> {
    
}
