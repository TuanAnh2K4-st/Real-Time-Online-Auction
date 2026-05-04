package vn.edu.nlu.fit.auction.repository.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    
}
