package vn.edu.nlu.fit.auction.dto.response;

import java.time.LocalDateTime;

import lombok.Data;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;

@Data
public class ProductAuctionResponse {
    
    private Integer productId;
    private String productName;
    private LocalDateTime createdAt;
    private StoreItemStatus itemStatus;
    private String imageUrl;

    public ProductAuctionResponse(Integer productId, String productName, LocalDateTime createdAt,
            StoreItemStatus itemStatus, String imageUrl) {
        this.productId = productId;
        this.productName = productName;
        this.createdAt = createdAt;
        this.itemStatus = itemStatus;
        this.imageUrl = imageUrl;
    }

}
