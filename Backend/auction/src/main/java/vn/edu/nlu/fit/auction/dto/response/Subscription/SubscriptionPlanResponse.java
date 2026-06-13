package vn.edu.nlu.fit.auction.dto.response.Subscription;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanResponse {

    private Integer id;

    private String name;

    private BigDecimal price;

    private Integer durationDays;

    private Integer maxLiveRooms;
}
