package vn.edu.nlu.fit.auction.dto.response.Live;

import java.math.BigDecimal;
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
public class LiveScheduleItemResponse {

    private Integer auctionId;
    private Integer productId;
    private String title;
    private String description;
    private List<String> images;
    private List<SpecItem> specs;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal startPrice;
    private BigDecimal stepPrice;
    private String auctionStatus;
    private Integer orderIndex;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SpecItem {
        private String label;
        private String value;
    }
}
