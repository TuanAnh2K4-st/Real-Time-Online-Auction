package vn.edu.nlu.fit.auction.dto.request.Admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

/**
 * Request DTO để admin tạo auction NORMAL.
 * Khác với CreateNormalAuctionRequest: admin KHÔNG cần là chủ sản phẩm.
 */
@Data
public class AdminCreateAuctionRequest {

    private Integer productId;

    private BigDecimal startPrice;

    private BigDecimal stepPrice;

    private LocalDateTime endTime;
}
