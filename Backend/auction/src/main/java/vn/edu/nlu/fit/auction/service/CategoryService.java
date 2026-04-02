package vn.edu.nlu.fit.auction.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CategoryRequest;
import vn.edu.nlu.fit.auction.dto.response.CategoryResponse;
import vn.edu.nlu.fit.auction.entity.Category;
import vn.edu.nlu.fit.auction.mapper.CategoryMapper;
import vn.edu.nlu.fit.auction.repository.CategoryRepository;

@Service
@RequiredArgsConstructor
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper mapper;

    // USER

    // menu: category cha
    public List<CategoryResponse> getRootCategories() {
        return categoryRepository.findByParentIsNull()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    // menu: category con
    public List<CategoryResponse> getByParent(Integer parentId) {
        return categoryRepository.findByParent_CategoryId(parentId)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    // ADMIN 

    public CategoryResponse create(CategoryRequest request) {
        Category category = mapper.toEntity(request);
        category.setCreateAt(LocalDateTime.now());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            category.setParent(parent);
        }

        return mapper.toDTO(categoryRepository.save(category));
    }

    public CategoryResponse update(Integer id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(request.getName());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return mapper.toDTO(categoryRepository.save(category));
    }

    public void delete(Integer id) {
        categoryRepository.deleteById(id);
    }

    public List<CategoryResponse> getAllRootForAdmin() {
        return getRootCategories();
    }

    public List<CategoryResponse> getByParentForAdmin(Integer parentId) {
        return getByParent(parentId);
    }
}
