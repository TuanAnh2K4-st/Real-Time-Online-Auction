package vn.edu.nlu.fit.auction.repository.Category;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.edu.nlu.fit.auction.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer>, JpaSpecificationExecutor<Category> {
    
    // lấy category cha
    List<Category> findByParentIsNull();

    // lấy category con theo parent_id
    List<Category> findByParent_CategoryId(Integer parentId);
    
    // kiểm tra trùng tên category
    boolean existsByNameIgnoreCase(String name);
    
}
