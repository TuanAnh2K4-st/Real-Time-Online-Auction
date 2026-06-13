package vn.edu.nlu.fit.auction.service.Watchlist;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import vn.edu.nlu.fit.auction.dto.response.Watchlist.WatchlistAuctionResponse;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.ProductImage;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.Watchlist;
import vn.edu.nlu.fit.auction.enums.AuctionType;
import vn.edu.nlu.fit.auction.repository.Auction.AuctionRepository;
import vn.edu.nlu.fit.auction.repository.WatchList.WatchlistRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final AuctionRepository auctionRepository;
    private final SecurityUtil securityUtil;

    public List<WatchlistAuctionResponse> getMyWatchlist(
            AuctionType auctionType
    ) {

        User currentUser = securityUtil.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        return watchlistRepository
                .findByUserIdAndAuctionType(
                        currentUser.getUserId(),
                        auctionType
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public boolean isInWatchlist(
            Integer auctionId,
            AuctionType auctionType
    ) {
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) return false;

        return watchlistRepository
                .existsByUserUserIdAndAuctionAuctionIdAndAuctionAuctionType(
                        currentUser.getUserId(),
                        auctionId,
                        auctionType
                );
    }

    @Transactional
    public void addToWatchlist(
            Integer auctionId,
            AuctionType auctionType
    ) {

        User currentUser = securityUtil.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        boolean exists =
                watchlistRepository
                        .existsByUserUserIdAndAuctionAuctionIdAndAuctionAuctionType(
                                currentUser.getUserId(),
                                auctionId,
                                auctionType
                        );

        if (exists) {
            throw new RuntimeException(
                    "Auction already exists in watchlist"
            );
        }

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(
                        () -> new RuntimeException("Auction not found")
                );

        Watchlist watchlist = Watchlist.builder()
                .user(currentUser)
                .auction(auction)
                .build();

        watchlistRepository.save(watchlist);
    }

    @Transactional
    public void removeFromWatchlist(
            Integer auctionId,
            AuctionType auctionType
    ) {

        User currentUser = securityUtil.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        watchlistRepository
                .deleteByUserUserIdAndAuctionAuctionIdAndAuctionAuctionType(
                        currentUser.getUserId(),
                        auctionId,
                        auctionType
                );
    }

    private WatchlistAuctionResponse toResponse(
            Watchlist watchlist
    ) {

        Auction auction = watchlist.getAuction();
        var product = auction.getProduct();

        String thumbnail = null;

        if (product != null
                && product.getImages() != null
                && !product.getImages().isEmpty()) {

            ProductImage image = product.getImages().iterator().next();
            thumbnail = image.getImageUrl();
        }

        String categoryName = null;
        if (product != null && product.getCategory() != null) {
            categoryName = product.getCategory().getName();
        }

        return WatchlistAuctionResponse.builder()
                .watchId(watchlist.getWatchId())
                .auctionId(auction.getAuctionId())
                .productName(product != null ? product.getProductName() : null)
                .auctionTitle(product != null ? product.getDescription() : null)
                .thumbnail(thumbnail)
                .categoryName(categoryName)
                .currentPrice(auction.getCurrentPrice())
                .auctionStatus(auction.getAuctionStatus() != null ? auction.getAuctionStatus().name() : null)
                .auctionType(auction.getAuctionType() != null ? auction.getAuctionType().name() : null)
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .build();
    }
    
}