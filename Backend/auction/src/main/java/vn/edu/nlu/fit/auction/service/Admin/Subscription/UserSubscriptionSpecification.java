package vn.edu.nlu.fit.auction.service.Admin.Subscription;

import jakarta.persistence.criteria.Join;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import vn.edu.nlu.fit.auction.dto.request.Admin.Subscription.FilterUserSubscriptionRequest;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.UserSubscription;
import jakarta.persistence.criteria.Predicate;

public class UserSubscriptionSpecification {

    public static Specification<UserSubscription> filter(FilterUserSubscriptionRequest request) {

        return (root, query, cb) -> {

            query.distinct(true);

            List<Predicate> predicates = new ArrayList<>();

            Join<UserSubscription, User> userJoin = root.join("user");

            if (request.getUserName() != null && !request.getUserName().trim().isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.lower(userJoin.get("username")),
                                "%" + request.getUserName().toLowerCase() + "%"
                        )
                );
            }

            if (request.getStatus() != null) {
                predicates.add(
                        cb.equal(root.get("status"), request.getStatus())
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}