package vn.edu.nlu.fit.auction.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.BidRequest;
import vn.edu.nlu.fit.auction.dto.request.CreateNormalAuctionRequest;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Bid;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.enums.AuctionType;
import vn.edu.nlu.fit.auction.enums.EventType;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.repository.AuctionRepository;
import vn.edu.nlu.fit.auction.repository.BidRepository;
import vn.edu.nlu.fit.auction.repository.ProductRepository;
import vn.edu.nlu.fit.auction.repository.StoreItemRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;
import vn.edu.nlu.fit.auction.dto.response.AuctionHomeCardResponse;
import vn.edu.nlu.fit.auction.dto.response.AuctionResponse;
import vn.edu.nlu.fit.auction.dto.response.BidResponse;
import vn.edu.nlu.fit.auction.entity.ProductImage;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuctionService {
    
    private final AuctionRepository auctionRepository;
    private final ProductRepository productRepository;
    private final StoreItemRepository storeItemRepository;
    private final SecurityUtil securityUtil;
    private final BidRepository bidRepository;
    private final SimpMessagingTemplate messagingTemplate;

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

    // Lấy top 4 auction normal đang active mới nhất
    public List<AuctionHomeCardResponse> getTop4ActiveNormalAuctions() {

        List<Auction> auctions =
                auctionRepository.findTop4ByAuctionStatusAndAuctionTypeOrderByStartTimeDesc(
                        AuctionStatus.ACTIVE,
                        AuctionType.NORMAL
                );

        return auctions.stream().map(a -> {

            Product product = a.getProduct();

            // lấy ảnh chính
            String image = product.getImages()
                    .stream()
                    .filter(ProductImage::getIsPrimary)
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(null);

            // nếu không có ảnh primary thì lấy ảnh đầu tiên
            if (image == null && !product.getImages().isEmpty()) {
                image = product.getImages().get(0).getImageUrl();
            }

            return new AuctionHomeCardResponse(
                    a.getAuctionId(),
                    product.getProductName(),
                    image,
                    product.getCategory().getName(),
                    a.getCurrentPrice() != null ? a.getCurrentPrice() : a.getStartPrice(),
                    a.getEndTime()
            );
        }).toList();
    }

    // ===== END AUCTION EARLY =====
    public void endAuctionEarly(Integer auctionId) {

        // 1. Lấy user hiện tại
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        // 2. Tìm auction
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        // 3. Kiểm tra quyền sở hữu
        if (!auction.getSeller().getUserId().equals(currentUser.getUserId())) {
            throw new RuntimeException("Bạn không có quyền kết thúc phiên đấu giá này");
        }

        // 4. Kiểm tra trạng thái
        if (auction.getAuctionStatus() != AuctionStatus.ACTIVE) {
            throw new RuntimeException("Phiên đấu giá không đang hoạt động");
        }

        // 5. Cập nhật auction -> ENDED
        auction.setAuctionStatus(AuctionStatus.ENDED);
        auction.setEndTime(LocalDateTime.now());
        auctionRepository.save(auction);

        // 6. Cập nhật StoreItem -> APPROVED (có thể tạo lại auction sau)
        StoreItem storeItem = storeItemRepository.findByProduct(auction.getProduct())
                .orElse(null);
        if (storeItem != null) {
            storeItem.setItemStatus(StoreItemStatus.APPROVED);
            storeItemRepository.save(storeItem);
        }
    }

    public List<AuctionResponse> getMyNormalAuctions() {
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) throw new RuntimeException("Unauthorized");

        List<Auction> auctions = auctionRepository.findBySellerAndAuctionType(currentUser, AuctionType.NORMAL);

        List<AuctionResponse> result = auctions.stream().map(a -> {
            Product p = a.getProduct();
            // find primary image
            String img = null;
            if (p.getImages() != null && !p.getImages().isEmpty()) {
                ProductImage primary = p.getImages().stream().filter(ProductImage::getIsPrimary).findFirst().orElse(p.getImages().get(0));
                img = primary != null ? primary.getImageUrl() : null;
            }

            return new AuctionResponse(
                a.getAuctionId(),
                p.getProductId(),
                p.getProductName(),
                img,
                a.getStartPrice(),
                a.getCurrentPrice(),
                a.getAuctionStatus(),
                a.getStartTime(),
                a.getEndTime()
            );
        }).collect(Collectors.toList());

        return result;
    }

    // ===== HELPER =====
    private void sendError(Integer auctionId, String message) {

        messagingTemplate.convertAndSend(
            "/topic/auction/" + auctionId,
            Map.of(
                "type", "ERROR",
                "message", message
            )
        );
    }

    // Đặt giá
    @Transactional
    public void placeBid(BidRequest request) {

        User user = securityUtil.getCurrentUser();

        Auction auction = auctionRepository.findByIdForUpdate(request.getAuctionId());

        // ===== VALIDATE =====
        if (auction.getAuctionStatus() != AuctionStatus.ACTIVE) {
            sendError(auction.getAuctionId(), "Auction đã kết thúc");
            return;
        }

        if (auction.getEndTime().isBefore(LocalDateTime.now())) {
            sendError(auction.getAuctionId(), "Auction đã hết hạn");
            return;
        }

        BigDecimal minBid = auction.getCurrentPrice().add(auction.getStepPrice());

        if (request.getBidAmount().compareTo(minBid) < 0) {
            sendError(auction.getAuctionId(), "Giá phải >= " + minBid);
            return;
        }

        // ===== SAVE BID =====
        Bid bid = new Bid();
        bid.setAuction(auction);
        bid.setBidder(user);
        bid.setBidAmount(request.getBidAmount());
        bidRepository.save(bid);

        // ===== UPDATE AUCTION =====
        auction.setCurrentPrice(request.getBidAmount());
        auction.setWinningBid(bid);
        auction.setWinner(user);
        auctionRepository.save(auction);

        // ===== RESPONSE =====
        BidResponse res = new BidResponse();
        res.setAuctionId(auction.getAuctionId());
        res.setBidder(user.getUsername());
        res.setPrice(request.getBidAmount());
        res.setType(EventType.NEW_BID);

        messagingTemplate.convertAndSend(
            "/topic/auction/" + auction.getAuctionId(),
            res
        );
    }
}
