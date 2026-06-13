package vn.edu.nlu.fit.auction.dto.response.Subscription;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscriptionResponse {

    private Integer id;

    private Integer planId;

    private Integer durationDays;

    private Integer maxLiveRooms;

    private String planName;

    private BigDecimal price;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private SubscriptionStatus status;
}
