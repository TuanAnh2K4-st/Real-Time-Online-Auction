package vn.edu.nlu.fit.auction.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ChatMessageResponse {

    private Integer auctionId;
    private String sender;
    private String content;
    private LocalDateTime createdAt;
    private String type; // "CHAT"

}
