package vn.edu.nlu.fit.auction.repository.Subscription;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.nlu.fit.auction.entity.UserSubscription;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Integer> {

    Optional<UserSubscription> findTopByUser_UserIdAndStatusOrderByEndDateDesc( Integer userId, SubscriptionStatus status );
    
}
