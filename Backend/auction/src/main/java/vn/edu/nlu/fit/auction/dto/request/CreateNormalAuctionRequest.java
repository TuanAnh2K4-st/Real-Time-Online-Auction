package vn.edu.nlu.fit.auction.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CreateNormalAuctionRequest {
    
    private Integer productId;

    private BigDecimal startPrice;

    private BigDecimal stepPrice;

    private LocalDateTime endTime;

}
