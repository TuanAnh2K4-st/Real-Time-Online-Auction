package vn.edu.nlu.fit.auction.controller.Watchlist;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Watchlist.WatchlistAuctionResponse;
import vn.edu.nlu.fit.auction.enums.AuctionType;
import vn.edu.nlu.fit.auction.service.Watchlist.WatchlistService;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    public ApiResponse<List<WatchlistAuctionResponse>> getMyWatchlist(@RequestParam AuctionType auctionType) {

        return new ApiResponse<>(
                "Get watchlist successfully",
                watchlistService.getMyWatchlist(auctionType)
        );
    }

    @GetMapping("/check/{auctionId}")
    public ApiResponse<Boolean> checkWatchlist(@PathVariable Integer auctionId, @RequestParam AuctionType auctionType) {

        return new ApiResponse<>(
                "Check watchlist successfully",
                watchlistService.isInWatchlist(auctionId, auctionType)
        );
    }

    @PostMapping("/{auctionId}")
    public ApiResponse<Void> addToWatchlist(@PathVariable Integer auctionId, @RequestParam AuctionType auctionType) {

        watchlistService.addToWatchlist(auctionId, auctionType);

        return new ApiResponse<>(
                "Added to watchlist successfully",
                null
        );
    }

    @DeleteMapping("/{auctionId}")
    public ApiResponse<Void> removeFromWatchlist(@PathVariable Integer auctionId, @RequestParam AuctionType auctionType) {

        watchlistService.removeFromWatchlist(auctionId, auctionType);

        return new ApiResponse<>(
                "Removed from watchlist successfully",
                null
        );
    }
}