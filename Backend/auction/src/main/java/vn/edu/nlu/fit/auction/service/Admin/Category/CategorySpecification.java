package vn.edu.nlu.fit.auction.service.Admin.Category;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.edu.nlu.fit.auction.dto.request.Admin.Category.FilterCategoryRequest;
import vn.edu.nlu.fit.auction.entity.Category;

public class CategorySpecification {

    public static Specification<Category> filter( FilterCategoryRequest request) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if(request.getKeyword() != null && !request.getKeyword().isBlank()) {

                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + request.getKeyword().toLowerCase() + "%"
                        )
                );
            }

            if("ROOT".equalsIgnoreCase(request.getType())) {

                predicates.add(
                        cb.isNull(root.get("parent"))
                );

            } else if("SUB".equalsIgnoreCase(request.getType())) {

                predicates.add(
                        cb.isNotNull(root.get("parent"))
                );
            }

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}
