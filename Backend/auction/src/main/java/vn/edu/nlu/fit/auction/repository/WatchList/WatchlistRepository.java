package vn.edu.nlu.fit.auction.repository.WatchList;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.edu.nlu.fit.auction.entity.Watchlist;
import vn.edu.nlu.fit.auction.enums.AuctionType;

public interface WatchlistRepository extends JpaRepository<Watchlist, Integer> {

    @Query("""
        select distinct w
        from Watchlist w
        join fetch w.auction a
        join fetch a.product p
        left join fetch p.images
        left join fetch p.category
        where w.user.userId = :userId
          and a.auctionType = :auctionType
    """)
    List<Watchlist> findByUserIdAndAuctionType(@Param("userId") Integer userId, @Param("auctionType") AuctionType auctionType);

    Optional<Watchlist> findByUserUserIdAndAuctionAuctionId(Integer userId, Integer auctionId);

    boolean existsByUserUserIdAndAuctionAuctionIdAndAuctionAuctionType(Integer userId, Integer auctionId, AuctionType auctionType);

    void deleteByUserUserIdAndAuctionAuctionIdAndAuctionAuctionType(Integer userId, Integer auctionId, AuctionType auctionType);
}