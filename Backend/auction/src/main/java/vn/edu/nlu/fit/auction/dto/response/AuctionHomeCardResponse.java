package vn.edu.nlu.fit.auction.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AuctionHomeCardResponse {
    
    private Integer auctionId;
    private String productName;
    private String primaryImage;
    private String categoryName;
    private BigDecimal currentPrice;
    private LocalDateTime endTime;
    
    public AuctionHomeCardResponse(Integer auctionId, String productName, String primaryImage, String categoryName,
            BigDecimal currentPrice, LocalDateTime endTime) {
        this.auctionId = auctionId;
        this.productName = productName;
        this.primaryImage = primaryImage;
        this.categoryName = categoryName;
        this.currentPrice = currentPrice;
        this.endTime = endTime;
    }

    

}
