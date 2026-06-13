package vn.edu.nlu.fit.auction.repository.Auction;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Bid;
import vn.edu.nlu.fit.auction.entity.User;

public interface BidRepository extends JpaRepository<Bid, Integer> {

    // lấy danh sách bidder (distinct)
    @Query("SELECT DISTINCT b.bidder FROM Bid b WHERE b.auction.auctionId = :auctionId")
    List<User> findDistinctBiddersByAuction(@Param("auctionId") Integer auctionId);

    // lấy bid cao nhất
    Optional<Bid> findTopByAuctionOrderByBidAmountDesc(Auction auction);

    // lấy 20 bid mới nhất theo thời gian
    List<Bid> findTop20ByAuctionOrderByBidTimeDesc(Auction auction);

    // đếm tổng số bid của auction
    long countByAuction(Auction auction);
    
}
