package vn.edu.nlu.fit.auction.dto.request.Live;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.Data;

@Data
public class CreateLiveSessionRequest {

    private String title;
    private Integer roomId;
    private LocalDate sessionDate;
    private LocalTime startTime;
    private List<LiveAuctionItemRequest> items;
}
