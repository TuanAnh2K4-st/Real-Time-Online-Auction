package vn.edu.nlu.fit.auction.repository.Subscription;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.edu.nlu.fit.auction.entity.UserSubscription;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Integer>, JpaSpecificationExecutor<UserSubscription> {

    Optional<UserSubscription> findTopByUser_UserIdAndStatusOrderByEndDateDesc( Integer userId, SubscriptionStatus status );
    
    List<UserSubscription> findByStatusAndEndDateBefore(SubscriptionStatus status, LocalDateTime time);
    
}
