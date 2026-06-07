package vn.edu.nlu.fit.auction.dto.response.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import vn.edu.nlu.fit.auction.enums.OrderStatus;

@Data
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

    // Thông tin giao hàng & thanh toán (dùng cho trang theo dõi đơn hàng)
    private String addressDetail;       // Địa chỉ đã ghép sẵn
    private LocalDateTime paidAt;       // Thời gian thanh toán
    private BigDecimal paymentAmount;   // Tổng tiền đã thanh toán
    private String paymentMethod;       // Phương thức thanh toán

    // Constructor 10 tham số dùng cho JPQL projection query
    public OrderResponse(Integer orderId, Integer userId, Integer auctionId,
                         BigDecimal totalAmount, OrderStatus orderStatus,
                         LocalDateTime createdAt, String imageUrl,
                         String productName, String categoryName, String sellName) {
        this.orderId = orderId;
        this.userId = userId;
        this.auctionId = auctionId;
        this.totalAmount = totalAmount;
        this.orderStatus = orderStatus;
        this.createdAt = createdAt;
        this.imageUrl = imageUrl;
        this.productName = productName;
        this.categoryName = categoryName;
        this.sellName = sellName;
    }
}
