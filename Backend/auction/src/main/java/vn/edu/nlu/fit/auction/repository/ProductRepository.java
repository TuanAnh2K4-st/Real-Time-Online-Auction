package vn.edu.nlu.fit.auction.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.edu.nlu.fit.auction.dto.response.ProductResponse;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    
     @Query("""
        SELECT new vn.edu.nlu.fit.auction.dto.response.ProductResponse(
            p.productId,
            p.productName,
            p.brand,
            p.origin,
            p.productCondition,
            p.description,
            p.basePrice,
            c.categoryId,
            c.name,
            p.createdAt,
            si.itemStatus,
            a.street,
            a.province.name,
            a.ward.name,
            pi.imageUrl
        )
        FROM Product p
        JOIN p.category c
        JOIN StoreItem si ON si.product = p
        JOIN si.store s
        JOIN s.address a
        LEFT JOIN ProductImage pi 
        ON pi.product = p AND pi.isPrimary = true
        WHERE p.user.userId = :userId
        AND (:name IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (:status IS NULL OR si.itemStatus = :status)
        ORDER BY p.createdAt DESC
    """)
    List<ProductResponse> filterProducts(
            @Param("userId") Integer userId,
            @Param("name") String name,
            @Param("status") StoreItemStatus status
    );
    
}
