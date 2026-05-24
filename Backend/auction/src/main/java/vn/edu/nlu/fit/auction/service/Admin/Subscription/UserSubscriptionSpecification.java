package vn.edu.nlu.fit.auction.service.Admin.Subscription;

import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import vn.edu.nlu.fit.auction.dto.request.Admin.Subscription.FilterUserSubscriptionRequest;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.UserSubscription;

public class UserSubscriptionSpecification {

    public static Specification<UserSubscription> filter( FilterUserSubscriptionRequest request) {

        return (root, query, cb) -> {

            query.distinct(true);

            var predicates = cb.conjunction();

            Join<Object, User> userJoin = root.join("user");

            if (request.getUserName() != null && !request.getUserName().trim().isEmpty()) {

                predicates.getExpressions().add(
                        cb.like(
                                cb.lower(userJoin.get("username")),
                                "%" + request.getUserName().toLowerCase() + "%"
                        )
                );
            }

            if (request.getStatus() != null) {
                predicates.getExpressions().add(
                        cb.equal(root.get("status"), request.getStatus())
                );
            }

            return predicates;
        };
    }
}
