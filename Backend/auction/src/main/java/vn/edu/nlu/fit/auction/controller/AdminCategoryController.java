package vn.edu.nlu.fit.auction.controller;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CategoryRequest;
import vn.edu.nlu.fit.auction.dto.response.CategoryResponse;
import vn.edu.nlu.fit.auction.service.CategoryService;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    // tạo
    @PostMapping("/create")
    public CategoryResponse create(@RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }

    // sửa
    @PutMapping("/update/{id}")
    public CategoryResponse update(@PathVariable Integer id,
                                   @RequestBody CategoryRequest request) {
        return categoryService.update(id, request);
    }

    // xóa
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) {
        categoryService.delete(id);
    }

}
