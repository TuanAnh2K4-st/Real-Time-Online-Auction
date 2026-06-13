package vn.edu.nlu.fit.auction.dto.response.Live;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveSessionResponse {

    private String sessionCode;
    private String title;
    private Integer roomId;
    private String roomCode;
    private LocalDateTime startTime;
    private String status;
    private List<LiveSessionItemResponse> items;
}
