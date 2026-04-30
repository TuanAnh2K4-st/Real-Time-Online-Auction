package vn.edu.nlu.fit.auction.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;
import vn.edu.nlu.fit.auction.enums.EventType;

@Data
public class BidResponse {

    private Integer auctionId;
    private String bidder;
    private BigDecimal price;
    private LocalDateTime bidTime;
    private EventType type;

}
