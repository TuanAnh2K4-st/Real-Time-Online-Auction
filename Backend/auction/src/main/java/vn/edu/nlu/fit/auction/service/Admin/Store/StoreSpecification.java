package vn.edu.nlu.fit.auction.service.Admin.Store;

import jakarta.persistence.criteria.Predicate;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.enums.StoreStatus;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

public class StoreSpecification {

    public static Specification<Store> filterStores( String storeName, StoreStatus status) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // ===== SEARCH NAME =====
            if (storeName != null &&!storeName.trim().isEmpty()) {
                String search = "%" + storeName.toLowerCase().trim() + "%";
                predicates.add( cb.like( cb.lower(root.get("storeName")),search));
            }

            // ===== FILTER STATUS =====
            if (status != null) {
                predicates.add(cb.equal(root.get("storeStatus"),status));
            }

            // ===== ORDER =====
            query.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}