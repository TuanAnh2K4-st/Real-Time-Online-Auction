package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateNormalAuctionRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.AuctionHomeCardResponse;
import vn.edu.nlu.fit.auction.dto.response.AuctionResponse;
import vn.edu.nlu.fit.auction.dto.response.ProductAuctionResponse;
import vn.edu.nlu.fit.auction.service.AuctionService;
import vn.edu.nlu.fit.auction.service.ProductService;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;
    private final ProductService productService;

    // Product sẵn sàng cho Create Aution
    @GetMapping("/products-ready")
    public ResponseEntity<ApiResponse<List<ProductAuctionResponse>>> getProductsForAuction() {

        List<ProductAuctionResponse> data = productService.getProductsForCreateAuction();

        return ResponseEntity.ok(
                new ApiResponse<>("Lấy danh sách sản phẩm tạo đấu giá thành công", data)
        );
    }

    // create normal auction
    @PostMapping("/create-normal")
    public ResponseEntity<ApiResponse<Void>> createNormalAuction(
            @RequestBody CreateNormalAuctionRequest request
    ) {

        auctionService.createNormalAuction(request);

        return ResponseEntity.status(201)
                .body(new ApiResponse<>("Tạo auction NORMAL thành công", null));
    }

    // lấy ra danh sach auction NORMAL của user
    @GetMapping("/mine/normal")
    public ResponseEntity<ApiResponse<List<AuctionResponse>>> getMyNormalAuctions() {
        List<AuctionResponse> data = auctionService.getMyNormalAuctions();
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách auction NORMAL của bạn thành công", data));
    }

    // Lấy top 4 auction normal đang active mới nhất
    @GetMapping("/home/top4-active-normal")
    public ResponseEntity<ApiResponse<List<AuctionHomeCardResponse>>> getTop4ActiveNormalAuctions() {

        List<AuctionHomeCardResponse> auctions =
                auctionService.getTop4ActiveNormalAuctions();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "Lấy top 4 auction NORMAL đang active mới nhất thành công",
                        auctions
                )
        );
    }

    // ===== END AUCTION EARLY =====
    @PatchMapping("/{auctionId}/end-early")
    public ResponseEntity<ApiResponse<Void>> endAuctionEarly(
            @PathVariable Integer auctionId
    ) {
        auctionService.endAuctionEarly(auctionId);
        return ResponseEntity.ok(new ApiResponse<>("Kết thúc phiên đấu giá thành công", null));
    }
}
