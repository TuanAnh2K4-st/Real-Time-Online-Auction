package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateProductRequest;
import vn.edu.nlu.fit.auction.dto.request.FilterProduct;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.ProductAuctionResponse;
import vn.edu.nlu.fit.auction.dto.response.ProductResponse;
import vn.edu.nlu.fit.auction.service.ProductService;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;

    // Create product
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Void>> createProduct(
            @ModelAttribute CreateProductRequest request ) {

        productService.createProduct(request);

        return ResponseEntity.ok( new ApiResponse<>("Tạo sản phẩm thành công", null));
    }

    // Filter Search
    @PostMapping("/filter")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> filterProducts(
            @RequestBody FilterProduct filter) {

        List<ProductResponse> data = productService.filterProducts(filter);

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy danh sách thành công", data)
        );
    }
    
}
