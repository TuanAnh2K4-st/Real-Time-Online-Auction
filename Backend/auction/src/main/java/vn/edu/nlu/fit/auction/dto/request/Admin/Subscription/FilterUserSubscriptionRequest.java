package vn.edu.nlu.fit.auction.dto.request.Admin.Subscription;

import lombok.*;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilterUserSubscriptionRequest {
    private String userName;
    private SubscriptionStatus status;
}
