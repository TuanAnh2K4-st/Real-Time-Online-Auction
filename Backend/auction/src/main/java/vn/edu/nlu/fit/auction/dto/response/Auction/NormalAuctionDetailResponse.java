package vn.edu.nlu.fit.auction.dto.response.Auction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class NormalAuctionDetailResponse {

    private Integer auctionId;
    private String productName;
    private String category;
    private String description;
    private String brand;
    private String origin;
    private String productCondition;
    private String attributesJson;
    private List<String> images;

    private BigDecimal startPrice;
    private BigDecimal currentPrice;
    private BigDecimal stepPrice;

    private String auctionStatus;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer totalBids;

    // Seller info
    private String sellerUsername;
    private Integer sellerId;

    // Bid history
    private List<BidHistoryItem> bidHistory;

    // Chat history
    private List<ChatHistoryItem> chatHistory;

    /** 10% giá khởi điểm — số tiền cọc cần đặt để tham gia đấu giá */
    private BigDecimal depositRequiredAmount;

    /** Người xem đã đặt cọc (HOLDING) chưa; true nếu là người bán hoặc chưa đăng nhập thì false */
    private Boolean hasPaidDeposit;

    @Data
    public static class BidHistoryItem {
        private String bidder;
        private BigDecimal amount;
        private LocalDateTime bidTime;

        public BidHistoryItem(String bidder, BigDecimal amount, LocalDateTime bidTime) {
            this.bidder = bidder;
            this.amount = amount;
            this.bidTime = bidTime;
        }
    }

    @Data
    public static class ChatHistoryItem {
        private String sender;
        private String content;
        private LocalDateTime createdAt;

        public ChatHistoryItem(String sender, String content, LocalDateTime createdAt) {
            this.sender = sender;
            this.content = content;
            this.createdAt = createdAt;
        }
    }
}
