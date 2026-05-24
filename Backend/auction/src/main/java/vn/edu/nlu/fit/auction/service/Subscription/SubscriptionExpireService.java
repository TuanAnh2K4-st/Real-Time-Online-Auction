package vn.edu.nlu.fit.auction.service.Subscription;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.entity.UserSubscription;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;
import vn.edu.nlu.fit.auction.repository.Subscription.UserSubscriptionRepository;

@Service
@RequiredArgsConstructor
public class SubscriptionExpireService {

    private final UserSubscriptionRepository repository;

    @Transactional
    public void updateExpiredSubscriptions() {

        List<UserSubscription> expiredSubscriptions = repository.findByStatusAndEndDateBefore(SubscriptionStatus.ACTIVE, LocalDateTime.now());

        for (UserSubscription subscription : expiredSubscriptions) {
            subscription.setStatus(SubscriptionStatus.EXPIRED);
        }

        repository.saveAll(expiredSubscriptions);

        System.out.println( "Expired subscriptions updated: " + expiredSubscriptions.size());
    }
}