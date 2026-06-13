package vn.edu.nlu.fit.auction.repository.Store;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.StoreItem;

public interface StoreItemRepository extends JpaRepository<StoreItem, Integer>, JpaSpecificationExecutor<StoreItem> {
    
    Optional<StoreItem> findByProduct(Product product);
    
}
