package vn.edu.nlu.fit.auction.repository.Store;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.enums.StoreStatus;

public interface StoreRepository extends JpaRepository<Store, Integer>, JpaSpecificationExecutor<Store> {
    
    List<Store> findByStoreStatus(StoreStatus status);

    // Lọc theo province + active
    List<Store> findByAddress_Province_ProvinceIdAndStoreStatus(
            Integer provinceId,
            StoreStatus status
    );
    
}
