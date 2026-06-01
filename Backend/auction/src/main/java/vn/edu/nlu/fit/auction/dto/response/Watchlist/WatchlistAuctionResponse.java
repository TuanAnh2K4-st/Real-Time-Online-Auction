package vn.edu.nlu.fit.auction.dto.response.Watchlist;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistAuctionResponse {

    private Integer watchId;
    private Integer auctionId;

    // Product info
    private String productName;
    private String auctionTitle;   // description của product
    private String thumbnail;      // ảnh đầu tiên
    private String categoryName;

    // Auction info
    private BigDecimal currentPrice;
    private String auctionStatus;
    private String auctionType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

}
