package vn.edu.nlu.fit.auction.dto.response.Admin.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.nlu.fit.auction.enums.ProductCondition;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProductResponse {
    // Store Item
    private Integer storeItemId;
    private StoreItemStatus itemStatus;
    private String conditionNote;
    // Product
    private String productName;
    private String brand;
    private String origin;
    private ProductCondition productCondition;
    private String description;
    private String attributesJson;
    private BigDecimal basePrice;
    private LocalDateTime createdAt;
    // Category
    private String categoryName;
    // User
    private Integer userId;
    // Image
    private String thumbnail;
    
}
