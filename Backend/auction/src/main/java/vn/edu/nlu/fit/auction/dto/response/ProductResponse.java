package vn.edu.nlu.fit.auction.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;
import vn.edu.nlu.fit.auction.enums.ProductCondition;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;

@Data
public class ProductResponse {
    
    private Integer id;
    private String productName;
    private String brand;
    private String origin;
    private ProductCondition productCondition;
    private String description;
    private BigDecimal basePrice;

    private Integer categoryId;
    private String categoryName;

    private LocalDateTime createdAt;

    private String imageUrl;

    private StoreItemStatus itemStatus;

    private String street;
    private String provinceName;
    private String wardName;

    public ProductResponse() {
    }

    public ProductResponse(Integer id, String productName, String brand, String origin,
            ProductCondition productCondition, String description, BigDecimal basePrice, Integer categoryId,
            String categoryName, LocalDateTime createdAt, StoreItemStatus itemStatus, String street,
            String provinceName, String wardName, String imageUrl) {
        this.id = id;
        this.productName = productName;
        this.brand = brand;
        this.origin = origin;
        this.productCondition = productCondition;
        this.description = description;
        this.basePrice = basePrice;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.createdAt = createdAt;
        this.imageUrl = imageUrl;
        this.itemStatus = itemStatus;
        this.street = street;
        this.provinceName = provinceName;
        this.wardName = wardName;
    }

    
 
}
