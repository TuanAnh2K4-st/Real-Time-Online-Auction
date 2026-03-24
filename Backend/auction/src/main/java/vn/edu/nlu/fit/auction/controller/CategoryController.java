package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.nlu.fit.auction.dto.request.CategoryRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.CategoryResponse;
import vn.edu.nlu.fit.auction.entity.Category;
import vn.edu.nlu.fit.auction.mapper.CategoryMapper;
import vn.edu.nlu.fit.auction.service.CategoryService;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryService service;

    // GET ALL
    @GetMapping("get-all")
    public ApiResponse<List<CategoryResponse>> getAll() {
        List<CategoryResponse> data = service.getAllCategories()
                .stream()
                .map(CategoryMapper::toResponse)
                .toList();

        return new ApiResponse<>("Success", data);
    }

    // CREATE
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("create")
    public ApiResponse<CategoryResponse> create(@RequestBody CategoryRequest req) {

        Category c = service.create(req.getName(), req.getParentId());

        return new ApiResponse<>("Created", CategoryMapper.toResponse(c));
    }

    // UPDATE
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("update/{id}")
    public ApiResponse<CategoryResponse> update(
            @PathVariable Integer id,
            @RequestBody CategoryRequest req) {

        Category c = service.update(id, req.getName(), req.getParentId());

        return new ApiResponse<>("Updated", CategoryMapper.toResponse(c));
    }

    // DELETE
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("delete/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>("Deleted", null);
    }
}
