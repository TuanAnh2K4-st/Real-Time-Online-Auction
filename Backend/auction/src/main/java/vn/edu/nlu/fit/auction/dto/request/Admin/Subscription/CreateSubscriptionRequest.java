package vn.edu.nlu.fit.auction.dto.request.Admin.Subscription;

import java.math.BigDecimal;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSubscriptionRequest {

    private String name;
    private Integer maxLiveRooms;
    private Integer durationDays;
    private BigDecimal price;
}
