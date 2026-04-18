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
public class CategoryController {

    private final CategoryService categoryService;
    
    // danh sách category cha
    @GetMapping("/root")
    public List<CategoryResponse> getRoot() {
        return categoryService.getAllRootForAdmin();
    }

    // danh sách theo parent
    @GetMapping("/parent/{parentId}")
    public List<CategoryResponse> getByParent(@PathVariable Integer parentId) {
        return categoryService.getByParentForAdmin(parentId);
    }

}
