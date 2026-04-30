package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;

@Data
public class ChatMessageRequest {

    private Integer auctionId;
    private String content;

}
