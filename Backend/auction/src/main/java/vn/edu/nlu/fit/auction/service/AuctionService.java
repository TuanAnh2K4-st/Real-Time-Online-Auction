package vn.edu.nlu.fit.auction.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.BidRequest;
import vn.edu.nlu.fit.auction.dto.request.ChatMessageRequest;
import vn.edu.nlu.fit.auction.dto.request.CreateNormalAuctionRequest;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.AuctionMessage;
import vn.edu.nlu.fit.auction.entity.AuctionParticipant;
import vn.edu.nlu.fit.auction.entity.Bid;
import vn.edu.nlu.fit.auction.entity.Order;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.ProductImage;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.Wallet;
import vn.edu.nlu.fit.auction.entity.WalletTransaction;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.enums.AuctionType;
import vn.edu.nlu.fit.auction.enums.DepositStatus;
import vn.edu.nlu.fit.auction.enums.EventType;
import vn.edu.nlu.fit.auction.enums.NotificationType;
import vn.edu.nlu.fit.auction.enums.OrderStatus;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.enums.TransactionDirection;
import vn.edu.nlu.fit.auction.enums.TransactionType;
import vn.edu.nlu.fit.auction.enums.WalletStatus;
import vn.edu.nlu.fit.auction.repository.Auction.AuctionMessageRepository;
import vn.edu.nlu.fit.auction.repository.Auction.AuctionParticipantRepository;
import vn.edu.nlu.fit.auction.repository.Auction.AuctionRepository;
import vn.edu.nlu.fit.auction.repository.Auction.BidRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletTransactionRepository;
import vn.edu.nlu.fit.auction.repository.Order.OrderRepository;
import vn.edu.nlu.fit.auction.repository.Product.ProductRepository;
import vn.edu.nlu.fit.auction.repository.Profile.ProfileRepository;
import vn.edu.nlu.fit.auction.repository.Store.StoreItemRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;
import vn.edu.nlu.fit.auction.dto.response.AuctionHomeCardResponse;
import vn.edu.nlu.fit.auction.dto.response.AuctionResponse;
import vn.edu.nlu.fit.auction.dto.response.BidResponse;
import vn.edu.nlu.fit.auction.dto.response.ChatMessageResponse;
import vn.edu.nlu.fit.auction.dto.response.NormalAuctionDetailResponse;
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
    private final AuctionMessageRepository auctionMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;
    private final ProfileRepository profileRepository;
    private final AuctionParticipantRepository auctionParticipantRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;

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
        storeItem.setItemStatus(StoreItemStatus.IN_AUCTION);
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
    @Transactional
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

        // ===== 5. END AUCTION =====
        auction.setAuctionStatus(AuctionStatus.ENDED);
        auction.setEndTime(LocalDateTime.now());
        User winner = auction.getWinner();

        // ===== 6. UPDATE STORE ITEM =====
        StoreItem storeItem = storeItemRepository.findByProduct(auction.getProduct())
                .orElse(null);
        if (storeItem != null) {
            storeItem.setItemStatus(
                    winner != null
                            ? StoreItemStatus.SOLD
                            : StoreItemStatus.REJECTED
            );
            storeItemRepository.save(storeItem);
        }

        // ===== 7. CREATE ORDER (IF WINNER) =====
        if (winner != null) {
            boolean existed = orderRepository.existsByAuction(auction);
            if (!existed) {
                // Lấy address từ profile của winner
                Profile winnerProfile = profileRepository.findByUser(winner)
                        .orElse(null);

                Order order = new Order();
                order.setWinner(winner);
                order.setAuction(auction);

                if (winnerProfile != null && winnerProfile.getAddress() != null) {
                    order.setAddress(winnerProfile.getAddress());
                }

                order.setTotalAmount(
                        auction.getCurrentPrice() != null
                                ? auction.getCurrentPrice()
                                : auction.getStartPrice()
                );
                order.setOrderStatus(OrderStatus.CART);
                orderRepository.save(order);
            }
        }

        // ===== 8. NOTIFICATION =====
        if (winner != null) {
            // Notify losers
            List<User> bidders =
                    bidRepository.findDistinctBiddersByAuction(auction.getAuctionId());
            for (User u : bidders) {
                if (u.getUserId().equals(winner.getUserId())) continue;
                notificationService.send(
                        u,
                        "Kết thúc đấu giá",
                        "Auction sản phẩm " + auction.getProduct().getProductName() + " đã kết thúc sớm",
                        NotificationType.INFO
                );
            }
            // Notify winner
            notificationService.send(
                    winner,
                    "Chúc mừng",
                    "Bạn đã thắng sản phẩm: " + auction.getProduct().getProductName(),
                    NotificationType.CONGRATULATION
            );
        } else {
            // Không có winner → notify seller
            notificationService.send(
                    auction.getSeller(),
                    "Đấu giá kết thúc sớm",
                    "Không có người tham gia đấu giá sản phẩm: "
                            + auction.getProduct().getProductName(),
                    NotificationType.INFO
            );
        }

        // ===== 9. WEBSOCKET BROADCAST =====
        BidResponse res = new BidResponse();
        res.setAuctionId(auction.getAuctionId());
        res.setType(EventType.AUCTION_ENDED);
        messagingTemplate.convertAndSend(
                "/topic/auction/" + auction.getAuctionId(),
                res
        );

        // ===== 10. SAVE =====
        auctionRepository.save(auction);

        System.out.println("✅ Early ended auction: " + auction.getAuctionId());
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

    // ===== LẤY CHI TIẾT AUCTION NORMAL =====
    public NormalAuctionDetailResponse getNormalAuctionDetail(Integer auctionId) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        Product product = auction.getProduct();

        NormalAuctionDetailResponse res = new NormalAuctionDetailResponse();
        res.setAuctionId(auction.getAuctionId());
        res.setProductName(product.getProductName());
        res.setCategory(product.getCategory().getName());
        res.setDescription(product.getDescription());
        res.setBrand(product.getBrand());
        res.setOrigin(product.getOrigin());
        res.setProductCondition(product.getProductCondition() != null ? product.getProductCondition().name() : null);
        res.setAttributesJson(product.getAttributesJson());

        // Images
        List<String> imageUrls = product.getImages() != null
                ? product.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList())
                : List.of();
        res.setImages(imageUrls);

        // Prices
        res.setStartPrice(auction.getStartPrice());
        res.setCurrentPrice(auction.getCurrentPrice() != null ? auction.getCurrentPrice() : auction.getStartPrice());
        res.setStepPrice(auction.getStepPrice());

        // Status & times
        res.setAuctionStatus(auction.getAuctionStatus().name());
        res.setStartTime(auction.getStartTime());
        res.setEndTime(auction.getEndTime());

        // Total bids
        long totalBids = bidRepository.countByAuction(auction);
        res.setTotalBids((int) totalBids);

        // Seller info
        res.setSellerUsername(auction.getSeller().getUsername());
        res.setSellerId(auction.getSeller().getUserId());

        // Bid history (top 20 mới nhất)
        List<Bid> recentBids = bidRepository.findTop20ByAuctionOrderByBidTimeDesc(auction);
        List<NormalAuctionDetailResponse.BidHistoryItem> bidHistory = recentBids.stream()
                .map(b -> new NormalAuctionDetailResponse.BidHistoryItem(
                        b.getBidder().getUsername(),
                        b.getBidAmount(),
                        b.getBidTime()
                ))
                .collect(Collectors.toList());
        res.setBidHistory(bidHistory);

        // Chat history
        List<AuctionMessage> messages = auctionMessageRepository.findByAuctionOrderByCreatedAtAsc(auction);
        List<NormalAuctionDetailResponse.ChatHistoryItem> chatHistory = messages.stream()
                .map(m -> new NormalAuctionDetailResponse.ChatHistoryItem(
                        m.getSender().getUsername(),
                        m.getContent(),
                        m.getCreatedAt()
                ))
                .collect(Collectors.toList());
        res.setChatHistory(chatHistory);

        // Cọc tham gia (chỉ đấu giá phổ thông NORMAL)
        if (auction.getAuctionType() != AuctionType.NORMAL) {
            res.setDepositRequiredAmount(BigDecimal.ZERO);
            res.setHasPaidDeposit(true);
        } else {
            BigDecimal depositRequired = computeDepositAmount(auction.getStartPrice());
            res.setDepositRequiredAmount(depositRequired);
            User viewer = securityUtil.getCurrentUserOrNull();
            if (viewer == null) {
                res.setHasPaidDeposit(false);
            } else if (viewer.getUserId().equals(auction.getSeller().getUserId())) {
                res.setHasPaidDeposit(true);
            } else {
                boolean holding = auctionParticipantRepository
                        .findByAuctionIdAndUserId(auctionId, viewer.getUserId())
                        .map(p -> p.getDepositStatus() == DepositStatus.HOLDING)
                        .orElse(false);
                res.setHasPaidDeposit(holding);
            }
        }

        return res;
    }

    /** 10% giá khởi điểm, làm tròn VND, tối thiểu 1 */
    private BigDecimal computeDepositAmount(BigDecimal startPrice) {
        if (startPrice == null || startPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ONE;
        }
        return startPrice.multiply(new BigDecimal("0.10")).setScale(0, RoundingMode.HALF_UP).max(BigDecimal.ONE);
    }

    /**
     * Đặt cọc tham gia đấu giá phổ thông: giữ tiền ở frozen_balance + ghi nhận participant HOLDING.
     */
    @Transactional
    public void placeAuctionDeposit(Integer auctionId) {

        User user = securityUtil.getCurrentUser();

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiên đấu giá"));

        if (auction.getAuctionType() != AuctionType.NORMAL) {
            throw new RuntimeException("Chỉ áp dụng đặt cọc cho đấu giá phổ thông");
        }
        if (auction.getAuctionStatus() != AuctionStatus.ACTIVE) {
            throw new RuntimeException("Phiên đấu giá không hoạt động");
        }
        if (auction.getEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Phiên đấu giá đã kết thúc");
        }
        if (user.getUserId().equals(auction.getSeller().getUserId())) {
            throw new RuntimeException("Người bán không cần đặt cọc");
        }

        Optional<AuctionParticipant> existingOpt = auctionParticipantRepository.findByAuctionIdAndUserId(auctionId,
                user.getUserId());
        if (existingOpt.isPresent() && existingOpt.get().getDepositStatus() == DepositStatus.HOLDING) {
            throw new RuntimeException("Bạn đã đặt cọc cho phiên này");
        }

        BigDecimal depositAmount = computeDepositAmount(auction.getStartPrice());

        Wallet wallet = walletRepository.findByUserIdForUpdate(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví"));
        if (wallet.getWalletStatus() != WalletStatus.ACTIVE) {
            throw new RuntimeException("Ví đang bị khóa");
        }

        BigDecimal available = wallet.getBalance().subtract(wallet.getFrozenBalance());
        if (available.compareTo(depositAmount) < 0) {
            throw new RuntimeException("Số dư khả dụng không đủ để đặt cọc");
        }

        wallet.setFrozenBalance(wallet.getFrozenBalance().add(depositAmount));
        walletRepository.save(wallet);

        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .userId(user.getUserId())
                .amount(depositAmount)
                .direction(TransactionDirection.OUT)
                .transactionType(TransactionType.AUCTION_DEPOSIT)
                .referenceId(auctionId)
                .build();
        walletTransactionRepository.save(tx);

        if (existingOpt.isPresent()) {
            AuctionParticipant p = existingOpt.get();
            p.setDepositAmount(depositAmount);
            p.setDepositStatus(DepositStatus.HOLDING);
            auctionParticipantRepository.save(p);
        } else {
            AuctionParticipant p = AuctionParticipant.builder()
                    .auctionId(auctionId)
                    .userId(user.getUserId())
                    .depositAmount(depositAmount)
                    .depositStatus(DepositStatus.HOLDING)
                    .build();
            auctionParticipantRepository.save(p);
        }
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

    // Helper: extract User from WebSocket Principal
    private User getUserFromPrincipal(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Unauthorized: no principal");
        }
        if (principal instanceof UsernamePasswordAuthenticationToken auth) {
            Object p = auth.getPrincipal();
            if (p instanceof User) {
                return (User) p;
            }
        }
        throw new RuntimeException("Unauthorized: invalid principal");
    }

    // Đặt giá (WebSocket)
    @Transactional
    public void placeBid(BidRequest request, Principal principal) {

        User user = getUserFromPrincipal(principal);

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

        if (user.getUserId().equals(auction.getSeller().getUserId())) {
            sendError(auction.getAuctionId(), "Người bán không được đặt giá");
            return;
        }

        BigDecimal minBid = auction.getCurrentPrice().add(auction.getStepPrice());

        if (request.getBidAmount().compareTo(minBid) < 0) {
            sendError(auction.getAuctionId(), "Giá phải >= " + minBid);
            return;
        }

        if (auction.getAuctionType() == AuctionType.NORMAL) {
            boolean deposited = auctionParticipantRepository
                    .findByAuctionIdAndUserId(auction.getAuctionId(), user.getUserId())
                    .filter(p -> p.getDepositStatus() == DepositStatus.HOLDING)
                    .isPresent();
            if (!deposited) {
                BigDecimal need = computeDepositAmount(auction.getStartPrice());
                sendError(auction.getAuctionId(),
                        "Bạn cần đặt cọc " + need + " VND (10% giá khởi điểm) trước khi đặt giá");
                return;
            }
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
        res.setBidTime(bid.getBidTime());
        res.setType(EventType.NEW_BID);

        messagingTemplate.convertAndSend(
            "/topic/auction/" + auction.getAuctionId(),
            res
        );
    }

    // ===== GỬI CHAT (WebSocket) =====
    public void sendChat(ChatMessageRequest request, Principal principal) {

        User user = getUserFromPrincipal(principal);

        Auction auction = auctionRepository.findById(request.getAuctionId())
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        // Lưu vào DB
        AuctionMessage msg = new AuctionMessage();
        msg.setAuction(auction);
        msg.setSender(user);
        msg.setContent(request.getContent());
        auctionMessageRepository.save(msg);

        // Broadcast
        ChatMessageResponse res = new ChatMessageResponse();
        res.setAuctionId(auction.getAuctionId());
        res.setSender(user.getUsername());
        res.setContent(request.getContent());
        res.setCreatedAt(msg.getCreatedAt());
        res.setType("CHAT");

        messagingTemplate.convertAndSend(
            "/topic/auction/" + auction.getAuctionId(),
            res
        );
    }
}
