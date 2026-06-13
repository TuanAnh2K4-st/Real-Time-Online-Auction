package vn.edu.nlu.fit.auction.dto.response.Auction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAuctionResponse {

    private Integer auctionId;

    // Product info
    private Integer productId;
    private String productName;
    private String imageUrl;
    private String categoryName;
    private String brand;
    private String origin;
    private String productCondition;
    private BigDecimal basePrice;

    // Seller info
    private Integer sellerId;
    private String sellerUsername;
    private String sellerEmail;

    // Winner info
    private Integer winnerId;
    private String winnerUsername;

    // Auction config
    private BigDecimal startPrice;
    private BigDecimal stepPrice;
    private BigDecimal currentPrice;
    private String auctionStatus;
    private String auctionType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Stats
    private Long totalBids;
}
