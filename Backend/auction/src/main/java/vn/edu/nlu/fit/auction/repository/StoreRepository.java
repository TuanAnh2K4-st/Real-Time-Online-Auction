package vn.edu.nlu.fit.auction.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.enums.StoreStatus;

public interface StoreRepository extends JpaRepository<Store, Integer> {
    
    List<Store> findByStoreStatus(StoreStatus status);

    // Lọc theo province + active
    List<Store> findByAddress_Province_ProvinceIdAndStoreStatus(
            Integer provinceId,
            StoreStatus status
    );
    
}
