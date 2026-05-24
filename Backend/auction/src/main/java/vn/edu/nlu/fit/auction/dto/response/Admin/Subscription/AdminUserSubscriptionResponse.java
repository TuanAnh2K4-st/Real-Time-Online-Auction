package vn.edu.nlu.fit.auction.dto.response.Admin.Subscription;

import java.time.LocalDateTime;
import lombok.*;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserSubscriptionResponse {
    private Integer id;
    private String username;
    private String email;
    private String subscriptionPlanName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private SubscriptionStatus status;
    private Integer maxLiveRooms;

}
