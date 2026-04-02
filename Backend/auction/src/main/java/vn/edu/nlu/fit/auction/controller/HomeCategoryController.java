package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.CategoryResponse;
import vn.edu.nlu.fit.auction.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class HomeCategoryController {

    private final CategoryService categoryService;

    // menu chính
    @GetMapping("/root")
    public List<CategoryResponse> getRoot() {
        return categoryService.getRootCategories();
    }

    // hover -> load category con
    @GetMapping("/{parentId}/children")
    public List<CategoryResponse> getChildren(@PathVariable Integer parentId) {
        return categoryService.getByParent(parentId);
    }
}
