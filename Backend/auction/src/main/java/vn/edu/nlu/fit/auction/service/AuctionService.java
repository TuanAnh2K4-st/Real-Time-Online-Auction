package vn.edu.nlu.fit.auction.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateNormalAuctionRequest;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.enums.AuctionType;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.repository.AuctionRepository;
import vn.edu.nlu.fit.auction.repository.ProductRepository;
import vn.edu.nlu.fit.auction.repository.StoreItemRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class AuctionService {
    
    private final AuctionRepository auctionRepository;
    private final ProductRepository productRepository;
    private final StoreItemRepository storeItemRepository;
    private final SecurityUtil securityUtil;

    public void createNormalAuction(CreateNormalAuctionRequest request) {

        // ===== 1. Lấy user =====
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        // ===== 2. Lấy product =====
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ===== 3. Check owner =====
        if (!product.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new RuntimeException("Bạn không có quyền tạo auction cho sản phẩm này");
        }

        // ===== 4. Check đã có auction chưa =====
        if (auctionRepository.existsByProduct(product)) {
            throw new RuntimeException("Sản phẩm đã có auction");
        }

        // ===== 5. Check StoreItem =====
        StoreItem storeItem = storeItemRepository.findByProduct(product)
                .orElseThrow(() -> new RuntimeException("StoreItem not found"));

        if (storeItem.getItemStatus() != StoreItemStatus.APPROVED) {
            throw new RuntimeException("Sản phẩm chưa được duyệt để đấu giá");
        }

        // ===== 6. Validate =====
        if (request.getEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("End time phải lớn hơn hiện tại");
        }

        if (request.getStartPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Start price phải > 0");
        }

        // ===== 7. Tạo Auction =====
        Auction auction = new Auction();
        auction.setProduct(product);
        auction.setSeller(currentUser);

        auction.setStartPrice(request.getStartPrice());
        auction.setStepPrice(request.getStepPrice());
        auction.setCurrentPrice(request.getStartPrice());

        auction.setAuctionType(AuctionType.NORMAL);
        auction.setAuctionStatus(AuctionStatus.ACTIVE);

        auction.setStartTime(LocalDateTime.now());
        auction.setEndTime(request.getEndTime());

        auctionRepository.save(auction);

        // ===== 8. Update trạng thái sản phẩm =====
        storeItem.setItemStatus(StoreItemStatus.IN_AUCTION); // bạn cần enum này
        storeItemRepository.save(storeItem);

    }
}
