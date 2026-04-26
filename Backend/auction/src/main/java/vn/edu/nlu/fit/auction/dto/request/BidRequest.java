package vn.edu.nlu.fit.auction.dto.request;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class BidRequest {

    private Integer auctionId;
    private BigDecimal bidAmount;

}
