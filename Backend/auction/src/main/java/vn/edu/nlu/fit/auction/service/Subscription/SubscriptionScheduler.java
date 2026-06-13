package vn.edu.nlu.fit.auction.service.Subscription;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubscriptionScheduler {

    private final SubscriptionExpireService expireService;

    @Scheduled(fixedRate = 3600000)
    public void expireSubscriptions() {

        expireService.updateExpiredSubscriptions();
    }
}
