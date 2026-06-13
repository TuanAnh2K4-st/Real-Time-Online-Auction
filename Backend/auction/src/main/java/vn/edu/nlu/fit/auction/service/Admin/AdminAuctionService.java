package vn.edu.nlu.fit.auction.service.Admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.AdminAuctionFilterRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.AdminCreateAuctionRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.AdminUpdateAuctionStatusRequest;
import vn.edu.nlu.fit.auction.dto.response.PageResponse;
import vn.edu.nlu.fit.auction.dto.response.Auction.AdminAuctionResponse;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.ProductImage;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.enums.AuctionType;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.repository.Auction.AuctionRepository;
import vn.edu.nlu.fit.auction.repository.Auction.BidRepository;
import vn.edu.nlu.fit.auction.repository.Product.ProductRepository;
import vn.edu.nlu.fit.auction.repository.Store.StoreItemRepository;

@Service
@RequiredArgsConstructor
public class AdminAuctionService {

    private final AuctionRepository auctionRepository;
    private final ProductRepository productRepository;
    private final StoreItemRepository storeItemRepository;
    private final BidRepository bidRepository;

    // ===== LẤY DANH SÁCH AUCTION (ADMIN - CÓ FILTER + PHÂN TRANG) =====
    public PageResponse<AdminAuctionResponse> filterAuctions(AdminAuctionFilterRequest request, int page) {

        Sort sort;
        String sortBy = request.getSortBy();
        if ("oldest".equals(sortBy)) {
            sort = Sort.by("startTime").ascending();
        } else if ("price_asc".equals(sortBy)) {
            sort = Sort.by("currentPrice").ascending();
        } else if ("price_desc".equals(sortBy)) {
            sort = Sort.by("currentPrice").descending();
        } else {
            sort = Sort.by("startTime").descending(); // default: newest
        }

        Pageable pageable = PageRequest.of(page, 10, sort);

        // Parse filters
        String keyword = (request.getKeyword() == null || request.getKeyword().isBlank())
                ? null : request.getKeyword().trim();

        AuctionStatus statusFilter = null;
        if (request.getAuctionStatus() != null && !request.getAuctionStatus().equals("ALL")) {
            try {
                statusFilter = AuctionStatus.valueOf(request.getAuctionStatus());
            } catch (IllegalArgumentException ignored) {}
        }

        AuctionType typeFilter = null;
        if (request.getAuctionType() != null && !request.getAuctionType().equals("ALL")) {
            try {
                typeFilter = AuctionType.valueOf(request.getAuctionType());
            } catch (IllegalArgumentException ignored) {}
        }

        Page<Auction> auctionPage = auctionRepository.adminFilterAuctions(keyword, statusFilter, typeFilter, pageable);

        List<AdminAuctionResponse> content = auctionPage.getContent().stream()
                .map(this::toAdminResponse)
                .toList();

        return new PageResponse<>(
                content,
                auctionPage.getNumber(),
                auctionPage.getSize(),
                auctionPage.getTotalElements(),
                auctionPage.getTotalPages(),
                auctionPage.isLast()
        );
    }

    // ===== TẠO AUCTION NORMAL (ADMIN - KHÔNG CẦN LÀ CHỦ SẢN PHẨM) =====
    @Transactional
    public void createNormalAuctionByAdmin(AdminCreateAuctionRequest request) {

        // 1. Lấy product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + request.getProductId()));

        // 2. Kiểm tra đã có auction chưa
        if (auctionRepository.existsByProduct(product)) {
            throw new RuntimeException("Sản phẩm đã có phiên đấu giá, không thể tạo thêm");
        }

        // 3. Kiểm tra StoreItem đã được duyệt chưa
        StoreItem storeItem = storeItemRepository.findByProduct(product)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin kho của sản phẩm này"));

        if (storeItem.getItemStatus() != StoreItemStatus.APPROVED) {
            throw new RuntimeException("Sản phẩm chưa được duyệt (trạng thái hiện tại: "
                    + storeItem.getItemStatus() + ")");
        }

        // 4. Validate thời gian
        if (request.getEndTime() == null || request.getEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Thời gian kết thúc phải lớn hơn thời điểm hiện tại");
        }

        // 5. Validate giá
        if (request.getStartPrice() == null || request.getStartPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Giá khởi điểm phải lớn hơn 0");
        }

        // 6. Tạo Auction — seller = owner của product (admin tạo thay cho seller)
        Auction auction = new Auction();
        auction.setProduct(product);
        auction.setSeller(product.getUser()); // seller = chủ sản phẩm
        auction.setStartPrice(request.getStartPrice());
        auction.setStepPrice(request.getStepPrice() != null
                ? request.getStepPrice()
                : request.getStartPrice().multiply(new BigDecimal("0.02")));
        auction.setCurrentPrice(request.getStartPrice());
        auction.setAuctionType(AuctionType.NORMAL);
        auction.setAuctionStatus(AuctionStatus.ACTIVE);
        auction.setStartTime(LocalDateTime.now());
        auction.setEndTime(request.getEndTime());

        auctionRepository.save(auction);

        // 7. Cập nhật StoreItem → IN_AUCTION
        storeItem.setItemStatus(StoreItemStatus.IN_AUCTION);
        storeItemRepository.save(storeItem);
    }

    // ===== CẬP NHẬT TRẠNG THÁI AUCTION (ADMIN) =====
    @Transactional
    public void updateAuctionStatus(Integer auctionId, AdminUpdateAuctionStatusRequest request) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiên đấu giá ID: " + auctionId));

        AuctionStatus newStatus;
        try {
            newStatus = AuctionStatus.valueOf(request.getAuctionStatus());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + request.getAuctionStatus());
        }

        auction.setAuctionStatus(newStatus);

        // Nếu kết thúc/hủy → cập nhật StoreItem
        if (newStatus == AuctionStatus.ENDED || newStatus == AuctionStatus.CANCELLED) {
            storeItemRepository.findByProduct(auction.getProduct()).ifPresent(si -> {
                si.setItemStatus(StoreItemStatus.APPROVED); // trả về APPROVED để có thể tạo auction mới
                storeItemRepository.save(si);
            });
        } else if (newStatus == AuctionStatus.ACTIVE) {
            storeItemRepository.findByProduct(auction.getProduct()).ifPresent(si -> {
                si.setItemStatus(StoreItemStatus.IN_AUCTION);
                storeItemRepository.save(si);
            });
        }

        auctionRepository.save(auction);
    }

    // ===== XÓA AUCTION (ADMIN) =====
    @Transactional
    public void deleteAuction(Integer auctionId) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiên đấu giá ID: " + auctionId));

        // Chỉ cho phép xóa auction chưa active hoặc đã kết thúc
        if (auction.getAuctionStatus() == AuctionStatus.ACTIVE) {
            throw new RuntimeException("Không thể xóa phiên đấu giá đang hoạt động. Hãy kết thúc hoặc hủy trước.");
        }

        // Trả StoreItem về APPROVED nếu đang IN_AUCTION
        storeItemRepository.findByProduct(auction.getProduct()).ifPresent(si -> {
            if (si.getItemStatus() == StoreItemStatus.IN_AUCTION) {
                si.setItemStatus(StoreItemStatus.APPROVED);
                storeItemRepository.save(si);
            }
        });

        auctionRepository.delete(auction);
    }

    // ===== LẤY DANH SÁCH PRODUCTS CÓ THỂ TẠO AUCTION (ADMIN) =====
    public List<vn.edu.nlu.fit.auction.dto.response.ProductAuctionResponse> getAvailableProducts() {
        // Admin lấy TẤT CẢ products APPROVED chưa có auction
        return productRepository.getAllApprovedProductsForAuction();
    }

    // ===== LẤY THỐNG KÊ NHANH CHO DASHBOARD =====
    public java.util.Map<String, Object> getAuctionStats() {
        long total = auctionRepository.count();
        long active = auctionRepository.adminFilterAuctions(null, AuctionStatus.ACTIVE, null,
                PageRequest.of(0, 1)).getTotalElements();
        long ended = auctionRepository.adminFilterAuctions(null, AuctionStatus.ENDED, null,
                PageRequest.of(0, 1)).getTotalElements();
        long cancelled = auctionRepository.adminFilterAuctions(null, AuctionStatus.CANCELLED, null,
                PageRequest.of(0, 1)).getTotalElements();

        return java.util.Map.of(
                "total", total,
                "active", active,
                "ended", ended,
                "cancelled", cancelled
        );
    }

    // ===== HELPER: Auction → AdminAuctionResponse =====
    private AdminAuctionResponse toAdminResponse(Auction a) {
        Product p = a.getProduct();

        String image = null;
        if (p.getImages() != null) {
            image = p.getImages().stream()
                    .filter(ProductImage::getIsPrimary)
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(p.getImages().isEmpty() ? null : p.getImages().get(0).getImageUrl());
        }

        long totalBids = bidRepository.countByAuction(a);

        return AdminAuctionResponse.builder()
                .auctionId(a.getAuctionId())
                .productId(p.getProductId())
                .productName(p.getProductName())
                .imageUrl(image)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .brand(p.getBrand())
                .origin(p.getOrigin())
                .productCondition(p.getProductCondition() != null ? p.getProductCondition().name() : null)
                .basePrice(p.getBasePrice())
                .sellerId(a.getSeller().getUserId())
                .sellerUsername(a.getSeller().getUsername())
                .sellerEmail(a.getSeller().getEmail())
                .winnerId(a.getWinner() != null ? a.getWinner().getUserId() : null)
                .winnerUsername(a.getWinner() != null ? a.getWinner().getUsername() : null)
                .startPrice(a.getStartPrice())
                .stepPrice(a.getStepPrice())
                .currentPrice(a.getCurrentPrice() != null ? a.getCurrentPrice() : a.getStartPrice())
                .auctionStatus(a.getAuctionStatus().name())
                .auctionType(a.getAuctionType().name())
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .totalBids(totalBids)
                .build();
    }
}
