package vn.edu.nlu.fit.auction.repository.Subscription;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.UserSubscription;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Integer> {

}
