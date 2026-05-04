package vn.edu.nlu.fit.auction.repository.Auction;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.enums.AuctionType;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {
    
    boolean existsByProduct(Product product);

    List<Auction> findBySellerAndAuctionType(User seller, AuctionType type);

    List<Auction> findByAuctionStatusAndEndTimeBefore(
            AuctionStatus status,
            LocalDateTime time
    );

    // Lấy ra top 4 auction normal đang active mới nhất
    List<Auction> findTop4ByAuctionStatusAndAuctionTypeOrderByStartTimeDesc(
            AuctionStatus status,
            AuctionType type
    );

    // LOCK chống race condition
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Auction a WHERE a.auctionId = :id")
    Auction findByIdForUpdate(@Param("id") Integer id);

}

