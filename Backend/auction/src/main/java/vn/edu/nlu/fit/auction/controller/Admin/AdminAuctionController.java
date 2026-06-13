package vn.edu.nlu.fit.auction.controller.Admin;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.AdminAuctionFilterRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.AdminCreateAuctionRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.AdminUpdateAuctionStatusRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.PageResponse;
import vn.edu.nlu.fit.auction.dto.response.ProductAuctionResponse;
import vn.edu.nlu.fit.auction.dto.response.Auction.AdminAuctionResponse;
import vn.edu.nlu.fit.auction.service.Admin.AdminAuctionService;

@RestController
@RequestMapping("/api/admin/auctions")
@RequiredArgsConstructor
public class AdminAuctionController {

    private final AdminAuctionService adminAuctionService;

    /**
     * GET /api/admin/auctions?page=0
     * Lấy danh sách tất cả auctions (có filter + phân trang) cho admin
     */
    @PostMapping("/filter")
    public ResponseEntity<ApiResponse<PageResponse<AdminAuctionResponse>>> filterAuctions(
            @RequestBody AdminAuctionFilterRequest request,
            @RequestParam(defaultValue = "0") int page
    ) {
        PageResponse<AdminAuctionResponse> data = adminAuctionService.filterAuctions(request, page);
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách phiên đấu giá thành công", data));
    }

    /**
     * POST /api/admin/auctions/create-normal
     * Admin tạo auction NORMAL cho bất kỳ product APPROVED nào
     */
    @PostMapping("/create-normal")
    public ResponseEntity<ApiResponse<Void>> createNormalAuction(
            @RequestBody AdminCreateAuctionRequest request
    ) {
        adminAuctionService.createNormalAuctionByAdmin(request);
        return ResponseEntity.status(201)
                .body(new ApiResponse<>("Tạo phiên đấu giá NORMAL thành công", null));
    }

    /**
     * PATCH /api/admin/auctions/{auctionId}/status
     * Admin cập nhật trạng thái auction
     */
    @PatchMapping("/{auctionId}/status")
    public ResponseEntity<ApiResponse<Void>> updateAuctionStatus(
            @PathVariable Integer auctionId,
            @RequestBody AdminUpdateAuctionStatusRequest request
    ) {
        adminAuctionService.updateAuctionStatus(auctionId, request);
        return ResponseEntity.ok(new ApiResponse<>("Cập nhật trạng thái phiên đấu giá thành công", null));
    }

    /**
     * DELETE /api/admin/auctions/{auctionId}
     * Admin xóa auction (chỉ được xóa nếu không ACTIVE)
     */
    @DeleteMapping("/{auctionId}")
    public ResponseEntity<ApiResponse<Void>> deleteAuction(
            @PathVariable Integer auctionId
    ) {
        adminAuctionService.deleteAuction(auctionId);
        return ResponseEntity.ok(new ApiResponse<>("Xóa phiên đấu giá thành công", null));
    }

    /**
     * GET /api/admin/auctions/products-ready
     * Lấy danh sách tất cả products APPROVED chưa có auction (để admin chọn khi tạo mới)
     */
    @GetMapping("/products-ready")
    public ResponseEntity<ApiResponse<List<ProductAuctionResponse>>> getAvailableProducts() {
        List<ProductAuctionResponse> data = adminAuctionService.getAvailableProducts();
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách sản phẩm sẵn sàng đấu giá thành công", data));
    }

    /**
     * GET /api/admin/auctions/stats
     * Thống kê nhanh cho dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAuctionStats() {
        Map<String, Object> stats = adminAuctionService.getAuctionStats();
        return ResponseEntity.ok(new ApiResponse<>("Lấy thống kê thành công", stats));
    }
}
