package vn.edu.nlu.fit.auction.service.Admin.User;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.UserRole;

public class UserSpecification {

    public static Specification<User> filterUsers(
            String keyword,
            UserRole role
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // ===== SEARCH =====
            if (keyword != null && !keyword.trim().isEmpty()) {

                String search =
                        "%" + keyword.toLowerCase().trim() + "%";

                Predicate usernamePredicate =
                        cb.like(
                                cb.lower(root.get("username")),
                                search
                        );

                Predicate emailPredicate =
                        cb.like(
                                cb.lower(root.get("email")),
                                search
                        );

                predicates.add(
                        cb.or(
                                usernamePredicate,
                                emailPredicate
                        )
                );
            }

            // ===== FILTER ROLE =====
            if (role != null) {

                predicates.add(
                        cb.equal(root.get("role"), role)
                );
            }

            // ===== ORDER BY =====
            query.orderBy(
                    cb.desc(root.get("createdAt"))
            );

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}