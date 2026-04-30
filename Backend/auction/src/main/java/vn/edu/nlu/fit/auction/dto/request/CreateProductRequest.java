package vn.edu.nlu.fit.auction.dto.request;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;
import vn.edu.nlu.fit.auction.enums.ProductCondition;

@Data
public class CreateProductRequest {

    private String productName;
    private String brand;
    private String origin;
    private ProductCondition productCondition;
    private String description;
    private String attributesJson;
    private BigDecimal basePrice;

    private Integer categoryId;
    private Integer storeId;

    private MultipartFile primaryImage;
    private List<MultipartFile> subImages;
    
}