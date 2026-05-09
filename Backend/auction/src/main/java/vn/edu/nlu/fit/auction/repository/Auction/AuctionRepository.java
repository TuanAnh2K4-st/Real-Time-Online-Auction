package vn.edu.nlu.fit.auction.repository.Auction;

import java.math.BigDecimal;
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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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

    // Lấy ra danh sách auction filter đang active
    @Query(""" 
        SELECT a
        FROM Auction a
        JOIN a.product p
        WHERE a.auctionType = vn.edu.nlu.fit.auction.enums.AuctionType.NORMAL
        AND a.auctionStatus = vn.edu.nlu.fit.auction.enums.AuctionStatus.ACTIVE

        AND ( :keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))

        AND ( :categoryId IS NULL OR p.category.categoryId = :categoryId)

        AND ( :minPrice IS NULL OR COALESCE(a.currentPrice, a.startPrice) >= :minPrice)

        AND ( :maxPrice IS NULL OR COALESCE(a.currentPrice, a.startPrice) <= :maxPrice)
        """)
        Page<Auction> filterNormalAuctions( @Param("keyword") String keyword,@Param("categoryId") Integer categoryId,@Param("minPrice") BigDecimal minPrice,@Param("maxPrice") BigDecimal maxPrice,Pageable pageable
    );

}

