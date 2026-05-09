package vn.edu.nlu.fit.auction.dto.response.Auction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;

@Data
public class AuctionResponse {

    private Integer auctionId;
    private Integer productId;
    private String productName;
    private String imageUrl;
    private BigDecimal startPrice;
    private BigDecimal currentPrice;
    private AuctionStatus auctionStatus;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public AuctionResponse(Integer auctionId, Integer productId, String productName, String imageUrl,
            BigDecimal startPrice, BigDecimal currentPrice, AuctionStatus auctionStatus, LocalDateTime startTime,
            LocalDateTime endTime) {
        this.auctionId = auctionId;
        this.productId = productId;
        this.productName = productName;
        this.imageUrl = imageUrl;
        this.startPrice = startPrice;
        this.currentPrice = currentPrice;
        this.auctionStatus = auctionStatus;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}
