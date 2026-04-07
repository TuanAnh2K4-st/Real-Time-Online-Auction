package vn.edu.nlu.fit.auction.dto.request;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import vn.edu.nlu.fit.auction.enums.ProductCondition;

@Data
public class CreateProductRequest {
    
    @NotNull(message = "Category không được null")
    private Integer categoryId;
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String productName;
    private String brand;
    private String origin;
    @NotNull(message = "Tình trạng sản phẩm không được null")
    private ProductCondition productCondition;
    private String description;
    private String attributesJson;
    @NotNull(message = "Giá khởi điểm không được null")
    @Positive(message = "Giá phải lớn hơn 0") 
    private BigDecimal basePrice;

    @NotNull(message = "Store không được null")
    private Integer storeId ;

}
