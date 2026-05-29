package vn.edu.nlu.fit.auction.dto.response.Live;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveEligibilityResponse {

    private boolean canCreateLive;
    private String planName;
    private Integer maxLiveRooms;
    private long currentRoomCount;
    private LocalDateTime subscriptionEndDate;
    private String message;
}
