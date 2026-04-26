package vn.edu.nlu.fit.auction.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.BidResponse;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.enums.EventType;
import vn.edu.nlu.fit.auction.enums.NotificationType;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.repository.AuctionRepository;
import vn.edu.nlu.fit.auction.repository.BidRepository;
import vn.edu.nlu.fit.auction.repository.StoreItemRepository;

@Component
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final NotificationService notificationService;
    private final StoreItemRepository storeItemRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void autoEndAuction() {

        List<Auction> auctions =
                auctionRepository.findByAuctionStatusAndEndTimeBefore(
                        AuctionStatus.ACTIVE,
                        LocalDateTime.now()
                );

        for (Auction auction : auctions) {

            // ===== 1. END AUCTION =====
            auction.setAuctionStatus(AuctionStatus.ENDED);
            auctionRepository.save(auction);

            User winner = auction.getWinner();

            // ===== 2. UPDATE STORE ITEM =====
            StoreItem storeItem = storeItemRepository
                    .findByProduct(auction.getProduct())
                    .orElse(null);

            if (storeItem != null) {
                storeItem.setItemStatus(StoreItemStatus.APPROVED);
                storeItemRepository.save(storeItem);
            }

            // ===== 3. GET ALL BIDDERS =====
            List<User> bidders =
                    bidRepository.findDistinctBiddersByAuction(auction.getAuctionId());

            // ===== 4. NOTIFY LOSERS =====
            for (User u : bidders) {

                // bỏ qua winner (tránh nhận 2 noti)
                if (winner != null && u.getUserId().equals(winner.getUserId())) {
                    continue;
                }

                notificationService.send(
                        u,
                        "Kết thúc đấu giá",
                        "Auction #" + auction.getAuctionId() + " đã kết thúc",
                        NotificationType.INFO
                );
            }

            // ===== 5. NOTIFY WINNER =====
            if (winner != null) {
                notificationService.send(
                        winner,
                        "Chúc mừng",
                        "Bạn đã thắng sản phẩm: " + auction.getProduct().getProductName(),
                        NotificationType.CONGRATULATION
                );
            }

            // ===== 6. WEBSOCKET =====
            BidResponse res = new BidResponse();
            res.setAuctionId(auction.getAuctionId());
            res.setType(EventType.AUCTION_ENDED); 

            messagingTemplate.convertAndSend(
                    "/topic/auction/" + auction.getAuctionId(),
                    res
            );

            // ===== 7. LOG =====
            System.out.println("✅ Auto ended auction: " + auction.getAuctionId());
        }
    }
}