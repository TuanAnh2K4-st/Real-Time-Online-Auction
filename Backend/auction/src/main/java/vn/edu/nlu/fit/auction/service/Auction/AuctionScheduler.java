package vn.edu.nlu.fit.auction.service.Auction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.repository.Auction.AuctionRepository;

@Component
@RequiredArgsConstructor
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final AuctionEndService auctionEndService;

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void autoEndAuction() {
        LocalDateTime now = LocalDateTime.now();

        List<Auction> overdue = new ArrayList<>();
        overdue.addAll(auctionRepository.findByAuctionStatusAndEndTimeBefore(AuctionStatus.ACTIVE, now));
        overdue.addAll(auctionRepository.findByAuctionStatusAndEndTimeBefore(AuctionStatus.SCHEDULED, now));

        for (Auction auction : overdue) {
            auctionEndService.finalizeAuction(auction);
        }
    }
}
