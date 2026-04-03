package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Province;

public interface ProvinceRepository extends JpaRepository<Province, Integer> {
    
}
