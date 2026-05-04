package vn.edu.nlu.fit.auction.dto.response.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.nlu.fit.auction.enums.OrderStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderResponse {
    private Integer orderId;
    private Integer userId;
    private Integer auctionId;
    private BigDecimal totalAmount;
    private OrderStatus orderStatus;
    private LocalDateTime createdAt;

    private String imageUrl;
    private String productName;
    private String categoryName;
    private String sellName;

}
