package vn.edu.nlu.fit.auction.service.Auction;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.BidResponse;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Order;
import vn.edu.nlu.fit.auction.entity.Profile;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.enums.EventType;
import vn.edu.nlu.fit.auction.enums.NotificationType;
import vn.edu.nlu.fit.auction.enums.OrderStatus;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.repository.Auction.AuctionRepository;
import vn.edu.nlu.fit.auction.repository.Auction.BidRepository;
import vn.edu.nlu.fit.auction.repository.Order.OrderRepository;
import vn.edu.nlu.fit.auction.repository.Profile.ProfileRepository;
import vn.edu.nlu.fit.auction.repository.Store.StoreItemRepository;
import vn.edu.nlu.fit.auction.service.Notification.NotificationService;

@Service
@RequiredArgsConstructor
public class AuctionEndService {

    private final AuctionRepository auctionRepository;
    private final StoreItemRepository storeItemRepository;
    private final OrderRepository orderRepository;
    private final ProfileRepository profileRepository;
    private final BidRepository bidRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;
    private final AuctionSettlementService auctionSettlementService;

    @Transactional
    public void finalizeAuction(Auction auction) {
        if (auction == null || auction.getAuctionStatus() == AuctionStatus.ENDED) {
            return;
        }

        auction.setAuctionStatus(AuctionStatus.ENDED);
        if (auction.getEndTime() == null || auction.getEndTime().isAfter(LocalDateTime.now())) {
            auction.setEndTime(LocalDateTime.now());
        }

        User winner = auction.getWinner();
        auctionSettlementService.releaseLoserDeposits(auction, winner);

        StoreItem storeItem = storeItemRepository.findByProduct(auction.getProduct()).orElse(null);
        if (storeItem != null) {
            storeItem.setItemStatus(
                    winner != null ? StoreItemStatus.SOLD : StoreItemStatus.REJECTED
            );
            storeItemRepository.save(storeItem);
        }

        if (winner != null && !orderRepository.existsByAuction(auction)) {
            Profile winnerProfile = profileRepository.findByUser(winner).orElse(null);

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

        if (winner != null) {
            List<User> bidders = bidRepository.findDistinctBiddersByAuction(auction.getAuctionId());
            for (User u : bidders) {
                if (u.getUserId().equals(winner.getUserId())) {
                    continue;
                }
                notificationService.send(
                        u,
                        "Kết thúc đấu giá",
                        "Auction sản phẩm " + auction.getProduct().getProductName() + " đã kết thúc",
                        NotificationType.INFO
                );
            }
            notificationService.send(
                    winner,
                    "Chúc mừng",
                    "Bạn đã thắng sản phẩm: " + auction.getProduct().getProductName(),
                    NotificationType.CONGRATULATION
            );
        } else {
            notificationService.send(
                    auction.getSeller(),
                    "Đấu giá không thành công",
                    "Không có người tham gia đấu giá sản phẩm: "
                            + auction.getProduct().getProductName(),
                    NotificationType.INFO
            );
        }

        BidResponse res = new BidResponse();
        res.setAuctionId(auction.getAuctionId());
        res.setType(EventType.AUCTION_ENDED);
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getAuctionId(), res);

        auctionRepository.save(auction);
    }
}
