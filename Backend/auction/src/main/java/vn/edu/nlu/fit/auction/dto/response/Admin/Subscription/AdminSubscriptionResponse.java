package vn.edu.nlu.fit.auction.dto.response.Admin.Subscription;

import java.math.BigDecimal;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSubscriptionResponse {
    private Integer id;
    private String name;
    private Integer maxLiveRooms;
    private Integer durationDays;
    private BigDecimal price;
}
