package vn.edu.nlu.fit.auction.service.Admin.Category;

import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.Category.CreateCategoryRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Category.FilterCategoryRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Category.UpdateCategoryRequest;
import vn.edu.nlu.fit.auction.dto.response.Admin.Category.AdminCategoryResponse;
import vn.edu.nlu.fit.auction.entity.Category;
import vn.edu.nlu.fit.auction.mapper.Admin.Category.AdminCategoryMapper;
import vn.edu.nlu.fit.auction.repository.Category.CategoryRepository;

@Service
@RequiredArgsConstructor
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;
    private final AdminCategoryMapper categoryMapper;

    public List<AdminCategoryResponse> getAll() {

        return categoryMapper.toResponse(categoryRepository.findAll());
    }

    public AdminCategoryResponse getById(Integer id) {

        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));

        return categoryMapper.toResponse(category);
    }

    public List<AdminCategoryResponse> filter(FilterCategoryRequest request) {

        return categoryMapper.toResponse(categoryRepository.findAll(CategorySpecification.filter(request)));
    }

    public AdminCategoryResponse create(CreateCategoryRequest request) {

        Category parent = null;

        if (request.getParentId() != null) {

            parent = categoryRepository
                    .findById(request.getParentId())
                    .orElseThrow(() ->
                            new RuntimeException("Parent category not found"));
        }

        Category category = Category.builder()
                .name(request.getName())
                .parent(parent)
                .build();

        categoryRepository.save(category);

        return categoryMapper.toResponse(category);
    }

    public AdminCategoryResponse update(Integer categoryId, UpdateCategoryRequest request) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        if (categoryId.equals(request.getParentId())) {
            throw new RuntimeException(
                    "Category cannot be parent of itself");
        }

        Category parent = null;

        if (request.getParentId() != null) {

            parent = categoryRepository
                    .findById(request.getParentId())
                    .orElseThrow(() ->
                            new RuntimeException("Parent category not found"));
        }

        category.setName(request.getName());
        category.setParent(parent);

        categoryRepository.save(category);

        return categoryMapper.toResponse(category);
    }

    public void delete(Integer categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        if (category.getChildren() != null
                && !category.getChildren().isEmpty()) {

            throw new RuntimeException(
                    "Cannot delete category because it contains child categories");
        }

        categoryRepository.delete(category);
    }
    
}
