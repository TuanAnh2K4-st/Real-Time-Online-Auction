package vn.edu.nlu.fit.auction.dto.response.Live;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.nlu.fit.auction.enums.RoomStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveRoomDetailResponse {

    private Integer roomId;
    private String roomCode;
    private String roomName;
    private RoomStatus roomStatus;
    private String sessionCode;
    private String sessionTitle;

    /** live | break | ended | waiting */
    private String sessionStatus;

    private Integer currentAuctionId;
    private Integer sellerId;
    private String sellerUsername;

    private List<LiveScheduleItemResponse> schedule;
}
