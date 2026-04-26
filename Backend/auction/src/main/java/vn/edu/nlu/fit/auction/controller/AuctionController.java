package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateNormalAuctionRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.ProductAuctionResponse;
import vn.edu.nlu.fit.auction.service.AuctionService;
import vn.edu.nlu.fit.auction.service.ProductService;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;
    private final ProductService productService;

    // Product cho Create Aution
    @GetMapping("/products-ready")
    public ResponseEntity<ApiResponse<List<ProductAuctionResponse>>> getProductsForAuction() {

        List<ProductAuctionResponse> data = productService.getProductsForCreateAuction();

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy danh sách sản phẩm tạo đấu giá thành công", data)
        );
    }

    // ===== CREATE NORMAL AUCTION =====
    @PostMapping("/create-normal")
    public ResponseEntity<ApiResponse<Void>> createNormalAuction(
            @RequestBody CreateNormalAuctionRequest request
    ) {

        auctionService.createNormalAuction(request);

        return ResponseEntity.status(201)
                .body(new ApiResponse<>("Tạo auction NORMAL thành công", null));
    }

    // GET my normal auctions
    @GetMapping("/mine/normal")
    public ResponseEntity<ApiResponse<List<vn.edu.nlu.fit.auction.dto.response.AuctionResponse>>> getMyNormalAuctions() {
        List<vn.edu.nlu.fit.auction.dto.response.AuctionResponse> data = auctionService.getMyNormalAuctions();
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách auction NORMAL của bạn thành công", data));
    }
}
