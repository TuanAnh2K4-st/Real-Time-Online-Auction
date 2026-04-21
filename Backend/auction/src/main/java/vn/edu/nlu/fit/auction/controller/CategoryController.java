package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.CategoryResponse;
import vn.edu.nlu.fit.auction.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    
    // danh sách category cha
    @GetMapping("/root")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getRoot() {

        List<CategoryResponse> data = categoryService.getAllRootForAdmin();

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy danh sách category cha thành công", data)
        );
    }

    // danh sách theo parent
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getByParent(
            @PathVariable Integer parentId) {

        List<CategoryResponse> data = categoryService.getByParentForAdmin(parentId);

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy danh sách category con thành công", data)
        );
    }

}
