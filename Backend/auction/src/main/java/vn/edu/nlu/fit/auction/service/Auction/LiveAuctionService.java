package vn.edu.nlu.fit.auction.service.Auction;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Live.CreateLiveRoomRequest;
import vn.edu.nlu.fit.auction.dto.request.Live.CreateLiveSessionRequest;
import vn.edu.nlu.fit.auction.dto.request.Live.LiveAuctionItemRequest;
import vn.edu.nlu.fit.auction.dto.response.PageResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveEligibilityResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveHomeCardResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveRoomDetailResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveRoomResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveScheduleItemResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveSessionItemResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveSessionResponse;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.AuctionRoom;
import vn.edu.nlu.fit.auction.entity.DetailAuction;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.ProductImage;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.UserSubscription;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.enums.AuctionType;
import vn.edu.nlu.fit.auction.enums.RoomStatus;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.repository.Auction.AuctionRepository;
import vn.edu.nlu.fit.auction.repository.Auction.AuctionRoomRepository;
import vn.edu.nlu.fit.auction.repository.Auction.DetailAuctionRepository;
import vn.edu.nlu.fit.auction.repository.Product.ProductRepository;
import vn.edu.nlu.fit.auction.repository.Store.StoreItemRepository;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.repository.Subscription.UserSubscriptionRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class LiveAuctionService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final SecurityUtil securityUtil;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final AuctionRoomRepository auctionRoomRepository;
    private final AuctionRepository auctionRepository;
    private final DetailAuctionRepository detailAuctionRepository;
    private final ProductRepository productRepository;
    private final StoreItemRepository storeItemRepository;
    private final AuctionEndService auctionEndService;

    @Transactional(readOnly = true)
    public LiveEligibilityResponse getEligibility() {
        User currentUser = requireSeller();
        Optional<UserSubscription> subscriptionOpt = findActiveSubscription(currentUser.getUserId());
        long roomCount = auctionRoomRepository.countByHost_UserId(currentUser.getUserId());

        if (subscriptionOpt.isEmpty()) {
            return LiveEligibilityResponse.builder()
                    .canCreateLive(false)
                    .currentRoomCount(roomCount)
                    .message("Bạn cần đăng ký gói live và còn hạn sử dụng để tạo phiên đấu giá trực tiếp")
                    .build();
        }

        UserSubscription subscription = subscriptionOpt.get();
        return LiveEligibilityResponse.builder()
                .canCreateLive(true)
                .planName(subscription.getPlan().getName())
                .maxLiveRooms(subscription.getPlan().getMaxLiveRooms())
                .currentRoomCount(roomCount)
                .subscriptionEndDate(subscription.getEndDate())
                .message("Gói đang hoạt động")
                .build();
    }

    @Transactional(readOnly = true)
    public List<LiveRoomResponse> getMyRooms() {
        User currentUser = requireSeller();
        requireActiveSubscription(currentUser.getUserId());

        return auctionRoomRepository.findByHost_UserIdOrderByCreatedAtDesc(currentUser.getUserId())
                .stream()
                .map(this::toRoomResponse)
                .toList();
    }

    public LiveRoomResponse createRoom(CreateLiveRoomRequest request) {
        User currentUser = requireSeller();
        UserSubscription subscription = requireActiveSubscription(currentUser.getUserId());

        if (request.getRoomName() == null || request.getRoomName().isBlank()) {
            throw new RuntimeException("Tên phòng không được bỏ trống");
        }

        long roomCount = auctionRoomRepository.countByHost_UserId(currentUser.getUserId());
        if (roomCount >= subscription.getPlan().getMaxLiveRooms()) {
            throw new RuntimeException(
                    "Đã đạt giới hạn " + subscription.getPlan().getMaxLiveRooms() + " phòng live theo gói đăng ký"
            );
        }

        AuctionRoom room = AuctionRoom.builder()
                .host(currentUser)
                .roomCode(generateUniqueRoomCode())
                .roomName(request.getRoomName().trim())
                .roomStatus(RoomStatus.OFFLIVE)
                .build();

        return toRoomResponse(auctionRoomRepository.save(room));
    }

    public List<LiveHomeCardResponse> getPublicLiveSessions(int limit) {
        List<DetailAuction> allDetails = detailAuctionRepository.findAllWithSessionCodeOrderByStartTimeDesc();
        if (allDetails.isEmpty()) {
            return List.of();
        }

        Map<String, List<DetailAuction>> bySession = new LinkedHashMap<>();
        for (DetailAuction detail : allDetails) {
            bySession.computeIfAbsent(detail.getSessionCode(), k -> new ArrayList<>()).add(detail);
        }

        LocalDateTime now = LocalDateTime.now();
        List<LiveHomeCardResponse> cards = new ArrayList<>();

        for (List<DetailAuction> group : bySession.values()) {
            group.sort(Comparator.comparing(DetailAuction::getOrderIndex));
            finalizeOverdueAuctionsInSchedule(group, now);
            if (isSessionFullyEnded(group, now)) {
                continue;
            }
            cards.add(toHomeCard(group, now));
        }

        cards.sort((a, b) -> Integer.compare(sessionSortScore(b), sessionSortScore(a)));

        int max = limit > 0 ? limit : 4;
        return cards.stream().limit(max).collect(Collectors.toList());
    }

    @Transactional
    public LiveRoomDetailResponse getRoomDetail(String roomCode) {
        if (roomCode == null || roomCode.isBlank()) {
            throw new RuntimeException("Mã phòng không hợp lệ");
        }

        AuctionRoom room = auctionRoomRepository.findByRoomCode(roomCode.trim())
                .orElseThrow(() -> new RuntimeException("Phòng live không tồn tại"));

        List<DetailAuction> allDetails = detailAuctionRepository.findByRoomCodeWithDetails(roomCode.trim());
        if (allDetails.isEmpty()) {
            throw new RuntimeException("Phòng chưa có phiên đấu giá");
        }

        Map<String, List<DetailAuction>> bySession = new LinkedHashMap<>();
        for (DetailAuction detail : allDetails) {
            bySession.computeIfAbsent(detail.getSessionCode(), k -> new ArrayList<>()).add(detail);
        }

        List<DetailAuction> schedule = pickCurrentSession(bySession);
        schedule.sort(Comparator.comparing(DetailAuction::getOrderIndex));

        Auction currentActive = syncLiveAuctionStates(room, schedule);
        LocalDateTime now = LocalDateTime.now();
        String sessionStatus = computeSessionStatus(schedule, currentActive, now);

        DetailAuction first = schedule.get(0);
        User seller = room.getHost();

        List<LiveScheduleItemResponse> scheduleItems = schedule.stream()
                .map(this::toScheduleItem)
                .collect(Collectors.toList());

        return LiveRoomDetailResponse.builder()
                .roomId(room.getRoomId())
                .roomCode(room.getRoomCode())
                .roomName(room.getRoomName())
                .roomStatus(room.getRoomStatus())
                .sessionCode(first.getSessionCode())
                .sessionTitle(first.getSessionTitle())
                .sessionStatus(sessionStatus)
                .currentAuctionId(currentActive != null ? currentActive.getAuctionId() : null)
                .sellerId(seller.getUserId())
                .sellerUsername(seller.getUsername())
                .schedule(scheduleItems)
                .build();
    }

    public List<LiveSessionResponse> getMyLiveSessions() {
        User currentUser = requireSeller();
        requireActiveSubscription(currentUser.getUserId());

        List<DetailAuction> details =
                detailAuctionRepository.findSessionDetailsByHost(currentUser.getUserId());

        Map<String, List<DetailAuction>> grouped = new LinkedHashMap<>();
        for (DetailAuction detail : details) {
            grouped.computeIfAbsent(detail.getSessionCode(), k -> new ArrayList<>()).add(detail);
        }

        LocalDateTime now = LocalDateTime.now();
        List<LiveSessionResponse> sessions = new ArrayList<>();
        for (List<DetailAuction> group : grouped.values()) {
            group.sort(Comparator.comparing(DetailAuction::getOrderIndex));
            finalizeOverdueAuctionsInSchedule(group, now);
            sessions.add(buildSessionResponse(group));
        }
        return sessions;
    }

    public LiveSessionResponse createLiveSession(CreateLiveSessionRequest request) {
        User currentUser = requireSeller();
        requireActiveSubscription(currentUser.getUserId());

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new RuntimeException("Tên phiên live không được bỏ trống");
        }
        if (request.getRoomId() == null) {
            throw new RuntimeException("Vui lòng chọn phòng live");
        }
        if (request.getSessionDate() == null || request.getStartTime() == null) {
            throw new RuntimeException("Vui lòng chọn ngày và giờ bắt đầu");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Phiên live cần ít nhất một sản phẩm");
        }

        AuctionRoom room = auctionRoomRepository
                .findByRoomIdAndHost_UserId(request.getRoomId(), currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Phòng live không tồn tại hoặc không thuộc quyền sở hữu của bạn"));

        LocalDateTime sessionStart = LocalDateTime.of(request.getSessionDate(), request.getStartTime());
        if (!sessionStart.isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Thời gian bắt đầu phiên live phải ở tương lai");
        }

        String sessionCode = UUID.randomUUID().toString();
        String sessionTitle = request.getTitle().trim();
        LocalDateTime cursor = sessionStart;
        List<DetailAuction> createdDetails = new ArrayList<>();

        int order = 1;
        for (LiveAuctionItemRequest item : request.getItems()) {
            validateItem(item);

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            if (!product.getUser().getUserId().equals(currentUser.getUserId())) {
                throw new RuntimeException("Bạn không có quyền đấu giá sản phẩm: " + product.getProductName());
            }
            if (auctionRepository.existsByProduct(product)) {
                throw new RuntimeException("Sản phẩm đã có phiên đấu giá: " + product.getProductName());
            }

            StoreItem storeItem = storeItemRepository.findByProduct(product)
                    .orElseThrow(() -> new RuntimeException("StoreItem not found"));

            if (storeItem.getItemStatus() != StoreItemStatus.APPROVED) {
                throw new RuntimeException("Sản phẩm chưa được duyệt: " + product.getProductName());
            }

            int duration = item.getDurationMinutes() != null ? item.getDurationMinutes() : 3;
            int gap = item.getGapMinutes() != null ? item.getGapMinutes() : 0;
            if (duration <= 0) {
                throw new RuntimeException("Thời lượng đấu giá phải lớn hơn 0");
            }
            if (gap < 0) {
                throw new RuntimeException("Thời gian nghỉ không hợp lệ");
            }

            LocalDateTime itemStart = cursor;
            LocalDateTime itemEnd = itemStart.plusMinutes(duration);

            Auction auction = Auction.builder()
                    .product(product)
                    .seller(currentUser)
                    .startPrice(item.getStartPrice())
                    .stepPrice(item.getStepPrice())
                    .currentPrice(item.getStartPrice())
                    .auctionType(AuctionType.LIVE)
                    .auctionStatus(AuctionStatus.SCHEDULED)
                    .startTime(itemStart)
                    .endTime(itemEnd)
                    .build();
            auctionRepository.save(auction);

            DetailAuction detail = DetailAuction.builder()
                    .room(room)
                    .auction(auction)
                    .orderIndex(order++)
                    .startTime(itemStart)
                    .endTime(itemEnd)
                    .sessionCode(sessionCode)
                    .sessionTitle(sessionTitle)
                    .build();
            detailAuctionRepository.save(detail);
            createdDetails.add(detail);

            storeItem.setItemStatus(StoreItemStatus.IN_AUCTION);
            storeItemRepository.save(storeItem);

            cursor = itemEnd.plusMinutes(gap);
        }

        return buildSessionResponse(createdDetails);
    }

    private void validateItem(LiveAuctionItemRequest item) {
        if (item.getProductId() == null) {
            throw new RuntimeException("Thiếu mã sản phẩm");
        }
        if (item.getStartPrice() == null || item.getStartPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Giá sàn phải lớn hơn 0");
        }
        if (item.getStepPrice() == null || item.getStepPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Bước giá phải lớn hơn 0");
        }
    }

    private LiveSessionResponse buildSessionResponse(List<DetailAuction> group) {
        group.sort((a, b) -> Integer.compare(a.getOrderIndex(), b.getOrderIndex()));
        DetailAuction first = group.get(0);

        List<LiveSessionItemResponse> items = group.stream().map(d -> {
            Product p = d.getAuction().getProduct();
            String storeName = storeItemRepository.findByProduct(p)
                    .map(StoreItem::getStore)
                    .map(Store::getStoreName)
                    .orElse(null);
            return LiveSessionItemResponse.builder()
                    .productId(p.getProductId())
                    .productName(p.getProductName())
                    .imageUrl(resolvePrimaryImage(p))
                    .storeName(storeName)
                    .startPrice(d.getAuction().getStartPrice())
                    .stepPrice(d.getAuction().getStepPrice())
                    .durationMinutes((int) java.time.Duration.between(d.getStartTime(), d.getEndTime()).toMinutes())
                    .gapMinutes(0)
                    .build();
        }).toList();

        String status = resolveSessionStatus(group);

        return LiveSessionResponse.builder()
                .sessionCode(first.getSessionCode())
                .title(first.getSessionTitle())
                .roomId(first.getRoom().getRoomId())
                .roomCode(first.getRoom().getRoomCode())
                .startTime(first.getStartTime())
                .status(status)
                .items(items)
                .build();
    }

    private String resolveSessionStatus(List<DetailAuction> group) {
        LocalDateTime now = LocalDateTime.now();
        if (isSessionFullyEnded(group, now)) {
            return "ended";
        }
        boolean anyLive = group.stream().anyMatch(d ->
                d.getAuction().getAuctionStatus() == AuctionStatus.ACTIVE
                        && !now.isBefore(d.getStartTime())
                        && now.isBefore(d.getEndTime()));
        if (anyLive) {
            return "active";
        }
        if (group.get(0).getStartTime().isAfter(now)) {
            return "scheduled";
        }
        return "scheduled";
    }

    private int sessionSortScore(LiveHomeCardResponse card) {
        return switch (card.getSessionStatus()) {
            case "live" -> 100;
            case "break", "waiting" -> 70;
            default -> 10;
        };
    }

    private LiveHomeCardResponse toHomeCard(List<DetailAuction> group, LocalDateTime now) {
        DetailAuction first = group.get(0);
        Auction currentActive = findCurrentActiveAuction(group, now);
        String sessionStatus = computeSessionStatus(group, currentActive, now);
        boolean isLive = "live".equals(sessionStatus);

        Product firstProduct = first.getAuction().getProduct();
        String imageUrl = resolvePrimaryImage(firstProduct);
        if (imageUrl == null && group.size() > 1) {
            imageUrl = resolvePrimaryImage(group.get(1).getAuction().getProduct());
        }

        LocalDateTime displayStart = first.getStartTime();
        String timeLabel;
        if (isLive) {
            timeLabel = "LIVE NOW";
        } else if ("ended".equals(sessionStatus)) {
            timeLabel = "Đã kết thúc";
        } else {
            timeLabel = displayStart.format(DateTimeFormatter.ofPattern("HH:mm dd/MM"));
        }

        String description = firstProduct.getDescription();
        if (description != null && description.length() > 120) {
            description = description.substring(0, 117) + "...";
        }

        return LiveHomeCardResponse.builder()
                .sessionCode(first.getSessionCode())
                .roomCode(first.getRoom().getRoomCode())
                .title(first.getSessionTitle())
                .host(first.getRoom().getHost().getUsername())
                .description(description != null ? description : first.getSessionTitle())
                .imageUrl(imageUrl)
                .productCount(group.size())
                .live(isLive)
                .timeLabel(timeLabel)
                .sessionStatus(sessionStatus)
                .startTime(displayStart)
                .build();
    }

    private void finalizeOverdueAuctionsInSchedule(List<DetailAuction> schedule, LocalDateTime now) {
        for (DetailAuction detail : schedule) {
            Auction auction = detail.getAuction();
            if (auction.getAuctionStatus() == AuctionStatus.ENDED) {
                continue;
            }
            if (!now.isBefore(detail.getEndTime())) {
                auctionEndService.finalizeAuction(auction);
            }
        }
    }

    private boolean isSessionFullyEnded(List<DetailAuction> schedule, LocalDateTime now) {
        return schedule.stream().allMatch(d ->
                d.getAuction().getAuctionStatus() == AuctionStatus.ENDED
                        || !d.getEndTime().isAfter(now));
    }

    private Auction findCurrentActiveAuction(List<DetailAuction> schedule, LocalDateTime now) {
        for (DetailAuction detail : schedule) {
            Auction auction = detail.getAuction();
            if (auction.getAuctionStatus() == AuctionStatus.ENDED) {
                continue;
            }
            if (now.isBefore(detail.getStartTime()) || !now.isBefore(detail.getEndTime())) {
                continue;
            }
            if (auction.getAuctionStatus() == AuctionStatus.ACTIVE
                    || auction.getAuctionStatus() == AuctionStatus.SCHEDULED) {
                return auction;
            }
        }
        return null;
    }

    private List<DetailAuction> pickCurrentSession(Map<String, List<DetailAuction>> bySession) {
        LocalDateTime now = LocalDateTime.now();

        Optional<List<DetailAuction>> withActive = bySession.values().stream()
                .filter(g -> g.stream().anyMatch(d -> d.getAuction().getAuctionStatus() == AuctionStatus.ACTIVE))
                .findFirst();
        if (withActive.isPresent()) {
            return withActive.get();
        }

        Optional<List<DetailAuction>> inWindow = bySession.values().stream()
                .filter(g -> {
                    LocalDateTime sessionStart = g.stream()
                            .map(DetailAuction::getStartTime)
                            .min(LocalDateTime::compareTo)
                            .orElse(now);
                    LocalDateTime sessionEnd = g.stream()
                            .map(DetailAuction::getEndTime)
                            .max(LocalDateTime::compareTo)
                            .orElse(now);
                    boolean notAllEnded = g.stream().anyMatch(d ->
                            d.getAuction().getAuctionStatus() != AuctionStatus.ENDED);
                    return notAllEnded && !now.isBefore(sessionStart) && now.isBefore(sessionEnd.plusHours(2));
                })
                .max(Comparator.comparing(g -> g.stream()
                        .map(DetailAuction::getStartTime)
                        .max(LocalDateTime::compareTo)
                        .orElse(LocalDateTime.MIN)));

        if (inWindow.isPresent()) {
            return inWindow.get();
        }

        return bySession.values().stream()
                .max(Comparator.comparing(g -> g.stream()
                        .map(DetailAuction::getStartTime)
                        .max(LocalDateTime::compareTo)
                        .orElse(LocalDateTime.MIN)))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiên live"));
    }

    private Auction syncLiveAuctionStates(AuctionRoom room, List<DetailAuction> schedule) {
        LocalDateTime now = LocalDateTime.now();

        finalizeOverdueAuctionsInSchedule(schedule, now);

        Auction currentActive = null;

        for (DetailAuction detail : schedule) {
            Auction auction = detail.getAuction();

            if (auction.getAuctionStatus() == AuctionStatus.ENDED) {
                continue;
            }

            if (now.isBefore(detail.getStartTime())) {
                continue;
            }

            if (!now.isBefore(detail.getEndTime())) {
                continue;
            }

            if (auction.getAuctionStatus() == AuctionStatus.SCHEDULED) {
                auction.setAuctionStatus(AuctionStatus.ACTIVE);
                auctionRepository.save(auction);
            }

            currentActive = auction;
            break;
        }

        if (currentActive != null) {
            room.setCurrentAuction(currentActive);
            room.setRoomStatus(RoomStatus.LIVE);
        } else {
            room.setCurrentAuction(null);
            boolean hasUpcoming = schedule.stream().anyMatch(d ->
                    d.getStartTime().isAfter(now)
                            && d.getAuction().getAuctionStatus() != AuctionStatus.ENDED);
            room.setRoomStatus(hasUpcoming ? RoomStatus.WAITING : RoomStatus.ENDED);
        }
        auctionRoomRepository.save(room);
        return currentActive;
    }

    private String computeSessionStatus(List<DetailAuction> schedule, Auction currentActive, LocalDateTime now) {
        if (isSessionFullyEnded(schedule, now)) {
            return "ended";
        }

        if (currentActive != null
                && currentActive.getAuctionStatus() == AuctionStatus.ACTIVE
                && schedule.stream().anyMatch(d ->
                        d.getAuction().getAuctionId().equals(currentActive.getAuctionId())
                                && now.isBefore(d.getEndTime()))) {
            return "live";
        }

        if (now.isBefore(schedule.get(0).getStartTime())) {
            return "waiting";
        }

        return "break";
    }

    private LiveScheduleItemResponse toScheduleItem(DetailAuction detail) {
        Product product = detail.getAuction().getProduct();
        List<String> images = product.getImages() != null
                ? product.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList())
                : List.of();

        List<LiveScheduleItemResponse.SpecItem> specs = new ArrayList<>();
        if (product.getBrand() != null) {
            specs.add(new LiveScheduleItemResponse.SpecItem("Thương hiệu", product.getBrand()));
        }
        if (product.getOrigin() != null) {
            specs.add(new LiveScheduleItemResponse.SpecItem("Xuất xứ", product.getOrigin()));
        }
        if (product.getProductCondition() != null) {
            specs.add(new LiveScheduleItemResponse.SpecItem("Tình trạng", product.getProductCondition().name()));
        }

        return LiveScheduleItemResponse.builder()
                .auctionId(detail.getAuction().getAuctionId())
                .productId(product.getProductId())
                .title(product.getProductName())
                .description(product.getDescription())
                .images(images)
                .specs(specs)
                .startTime(detail.getStartTime())
                .endTime(detail.getEndTime())
                .startPrice(detail.getAuction().getStartPrice())
                .stepPrice(detail.getAuction().getStepPrice())
                .auctionStatus(detail.getAuction().getAuctionStatus().name())
                .orderIndex(detail.getOrderIndex())
                .build();
    }

    private String resolvePrimaryImage(Product product) {
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return null;
        }
        return product.getImages().stream()
                .filter(ProductImage::getIsPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(product.getImages().get(0).getImageUrl());
    }

    private LiveRoomResponse toRoomResponse(AuctionRoom room) {
        return LiveRoomResponse.builder()
                .roomId(room.getRoomId())
                .roomCode(room.getRoomCode())
                .roomName(room.getRoomName())
                .roomStatus(room.getRoomStatus())
                .build();
    }

    private User requireSeller() {
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }
        if (currentUser.getRole() != UserRole.SELLER) {
            throw new RuntimeException("Chỉ tài khoản người bán mới được sử dụng tính năng live");
        }
        return currentUser;
    }

    private UserSubscription requireActiveSubscription(Integer userId) {
        return findActiveSubscription(userId)
                .orElseThrow(() -> new RuntimeException(
                        "Bạn cần đăng ký gói live và còn hạn sử dụng để thực hiện thao tác này"
                ));
    }

    private Optional<UserSubscription> findActiveSubscription(Integer userId) {
        return userSubscriptionRepository
                .findTopByUser_UserIdAndStatusOrderByEndDateDesc(userId, SubscriptionStatus.ACTIVE)
                .filter(sub -> sub.getEndDate().isAfter(LocalDateTime.now()));
    }

    private String generateUniqueRoomCode() {
        for (int attempt = 0; attempt < 20; attempt++) {
            StringBuilder code = new StringBuilder("RM-");
            for (int i = 0; i < 6; i++) {
                code.append(ROOM_CODE_CHARS.charAt(RANDOM.nextInt(ROOM_CODE_CHARS.length())));
            }
            String candidate = code.toString();
            if (!auctionRoomRepository.existsByRoomCode(candidate)) {
                return candidate;
            }
        }
        throw new RuntimeException("Không thể tạo mã phòng, vui lòng thử lại");
    }

    @Transactional(readOnly = true)
    public PageResponse<LiveHomeCardResponse> getLiveSessions(int page) {

        List<DetailAuction> allDetails =
                detailAuctionRepository.findAllWithSessionCodeOrderByStartTimeDesc();

        if (allDetails.isEmpty()) {
            return new PageResponse<>(
                    List.of(),
                    page,
                    9,
                    0,
                    0,
                    true
            );
        }

        Map<String, List<DetailAuction>> bySession = new LinkedHashMap<>();

        for (DetailAuction detail : allDetails) {
            bySession.computeIfAbsent(
                    detail.getSessionCode(),
                    k -> new ArrayList<>()
            ).add(detail);
        }

        LocalDateTime now = LocalDateTime.now();

        List<LiveHomeCardResponse> cards = new ArrayList<>();

        for (List<DetailAuction> group : bySession.values()) {

            group.sort(Comparator.comparing(DetailAuction::getOrderIndex));

            finalizeOverdueAuctionsInSchedule(group, now);

            if (isSessionFullyEnded(group, now)) {
                continue;
            }

            cards.add(toHomeCard(group, now));
        }

        cards.sort((a, b) ->
                Integer.compare(
                        sessionSortScore(b),
                        sessionSortScore(a)
                )
        );

        // ===== PAGINATION =====

        int pageSize = 9;

        int totalElements = cards.size();

        int totalPages =
                (int) Math.ceil((double) totalElements / pageSize);

        int start = page * pageSize;

        if (start >= totalElements) {
            return new PageResponse<>(
                    List.of(),
                    page,
                    pageSize,
                    totalElements,
                    totalPages,
                    true
            );
        }

        int end = Math.min(start + pageSize, totalElements);

        List<LiveHomeCardResponse> content =
                cards.subList(start, end);

        return new PageResponse<>(
                content,
                page,
                pageSize,
                totalElements,
                totalPages,
                page >= totalPages - 1
        );
    }
    
}
