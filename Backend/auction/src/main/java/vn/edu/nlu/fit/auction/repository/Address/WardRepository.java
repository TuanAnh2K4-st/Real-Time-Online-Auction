package vn.edu.nlu.fit.auction.repository.Address;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Ward;

public interface WardRepository extends JpaRepository<Ward, Integer> {
    
    List<Ward> findByProvince_ProvinceId(Integer provinceId);
    
}
