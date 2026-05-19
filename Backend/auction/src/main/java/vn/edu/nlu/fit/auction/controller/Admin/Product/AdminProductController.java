package vn.edu.nlu.fit.auction.controller.Admin.Product;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.Product.ProductFilterRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Admin.Product.AdminProductResponse;
import vn.edu.nlu.fit.auction.service.Admin.Product.AdminProductService;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/filter")
    public ApiResponse<List<AdminProductResponse>> getProducts( @RequestBody ProductFilterRequest request ) {

        List<AdminProductResponse> products =
                adminProductService.filterProducts( request);

        return new ApiResponse<>(
                "Lấy danh sách sản phẩm thành công",
                products
        );
    }
}