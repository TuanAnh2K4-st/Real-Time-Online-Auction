package vn.edu.nlu.fit.auction.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
    // lấy category cha
    List<Category> findByParentIsNull();

    // lấy category con theo parent_id
    List<Category> findByParent_CategoryId(Integer parentId);
    
}
