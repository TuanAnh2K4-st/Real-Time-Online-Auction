package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
}
