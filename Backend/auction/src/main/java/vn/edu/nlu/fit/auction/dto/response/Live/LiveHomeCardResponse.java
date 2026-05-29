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
public class LiveHomeCardResponse {

    private String sessionCode;
    private String roomCode;
    private String title;
    private String host;
    private String description;
    private String imageUrl;
    private Integer productCount;
    private boolean live;
    private String timeLabel;
    private String sessionStatus;
    private LocalDateTime startTime;
}
