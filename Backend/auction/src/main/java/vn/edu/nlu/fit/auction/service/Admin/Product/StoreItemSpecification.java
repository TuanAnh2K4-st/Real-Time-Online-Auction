package vn.edu.nlu.fit.auction.service.Admin.Product;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;

public class StoreItemSpecification {

    public static Specification<StoreItem> filterProducts(
            String keyword,
            StoreItemStatus itemStatus,
            String storeName
    ) {

        return (root, query, cb) -> {

            query.distinct(true);

            // ===== FETCH JOIN =====
            root.fetch("product", JoinType.LEFT)
                    .fetch("category", JoinType.LEFT);

            root.fetch("product", JoinType.LEFT)
                    .fetch("images", JoinType.LEFT);

            root.fetch("product", JoinType.LEFT)
                    .fetch("user", JoinType.LEFT);

            root.fetch("store", JoinType.LEFT);

            // ===== JOIN =====
            Join<StoreItem, Product> productJoin =
                    root.join("product", JoinType.LEFT);

            Join<StoreItem, Store> storeJoin =
                    root.join("store", JoinType.LEFT);

            List<Predicate> predicates = new ArrayList<>();

            // ===== FILTER PRODUCT NAME =====
            if (keyword != null && !keyword.trim().isEmpty()) {

                predicates.add(
                        cb.like(
                                cb.lower(productJoin.get("productName")),
                                "%" + keyword.toLowerCase().trim() + "%"
                        )
                );
            }

            // ===== FILTER STATUS =====
            if (itemStatus != null) {

                predicates.add(
                        cb.equal(
                                root.get("itemStatus"),
                                itemStatus
                        )
                );
            }

            // ===== FILTER STORE NAME =====
            if (storeName != null && !storeName.trim().isEmpty()) {

                predicates.add(
                        cb.like(
                                cb.lower(storeJoin.get("storeName")),
                                "%" + storeName.toLowerCase().trim() + "%"
                        )
                );
            }

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}