package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    
}
