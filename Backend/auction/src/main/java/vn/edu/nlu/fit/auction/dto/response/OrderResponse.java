package vn.edu.nlu.fit.auction.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class OrderResponse {
    
    private Integer orderId;
    private String productName;
    private String productImage;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;

}
