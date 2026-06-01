package vn.edu.nlu.fit.auction.controller.Admin.Category;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.Category.CreateCategoryRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Category.FilterCategoryRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Category.UpdateCategoryRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Admin.Category.AdminCategoryResponse;
import vn.edu.nlu.fit.auction.service.Admin.Category.AdminCategoryService;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final AdminCategoryService service;

    @GetMapping("/all")
    public ApiResponse<List<AdminCategoryResponse>> getAll() {

        return new ApiResponse<>(
            "Lấy danh sách danh mục thành công", 
            service.getAll());
    }

    @PostMapping("/filter")
    public ApiResponse<List<AdminCategoryResponse>> filter(@RequestBody FilterCategoryRequest request) {

        return new ApiResponse<>(
            "Lọc danh mục thành công",
            service.filter(request)
        );
    }

    @GetMapping("/get/{id}")
    public ApiResponse<AdminCategoryResponse> getById(@PathVariable Integer id) {

        return new ApiResponse<>(
            "Lấy chi tiết danh mục thành công", 
            service.getById(id)
        );
    }

    @PostMapping("/create")
    public ApiResponse<AdminCategoryResponse> create(@Valid @RequestBody CreateCategoryRequest request) {

        return new ApiResponse<>(
                "Tạo danh mục thành công",
                service.create(request)
        );
    }

    @PutMapping("/update/{id}")
    public ApiResponse<AdminCategoryResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCategoryRequest request) {

        return new ApiResponse<>(
                "Cập nhật danh mục thành công",
                service.update(id, request)
        );
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable Integer id) {

        service.delete(id);

        return new ApiResponse<>(
                "Xóa danh mục thành công",
                null
        );
    }
}