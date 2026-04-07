package vn.edu.nlu.fit.auction.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;
import vn.edu.nlu.fit.auction.enums.ProductCondition;

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
}
