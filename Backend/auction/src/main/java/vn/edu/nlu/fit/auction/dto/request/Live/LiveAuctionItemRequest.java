package vn.edu.nlu.fit.auction.dto.request.Live;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class LiveAuctionItemRequest {

    private Integer productId;
    private BigDecimal startPrice;
    private BigDecimal stepPrice;
    private Integer durationMinutes;
    private Integer gapMinutes;
}
