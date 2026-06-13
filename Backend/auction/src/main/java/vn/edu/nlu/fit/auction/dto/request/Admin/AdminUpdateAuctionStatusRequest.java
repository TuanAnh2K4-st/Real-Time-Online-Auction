package vn.edu.nlu.fit.auction.dto.request.Admin;

import lombok.Data;

@Data
public class AdminUpdateAuctionStatusRequest {
    private String auctionStatus; // ACTIVE | ENDED | CANCELLED
}
