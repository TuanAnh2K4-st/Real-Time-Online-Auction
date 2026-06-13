package vn.edu.nlu.fit.auction.dto.request.Admin;

import lombok.Data;

@Data
public class AdminAuctionFilterRequest {
    private String keyword;        // tìm theo tên sản phẩm hoặc tên seller
    private String auctionStatus;  // ALL | ACTIVE | ENDED | CANCELLED | PENDING | SCHEDULED
    private String auctionType;    // ALL | NORMAL | LIVE
    private String sortBy;         // newest | oldest | price_asc | price_desc
}
