package vn.edu.nlu.fit.auction.repository.Auction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.edu.nlu.fit.auction.entity.DetailAuction;

public interface DetailAuctionRepository extends JpaRepository<DetailAuction, Integer> {

    @Query("""
        SELECT d FROM DetailAuction d
        JOIN FETCH d.auction a
        JOIN FETCH a.product p
        LEFT JOIN FETCH p.images
        WHERE d.room.host.userId = :userId
        AND d.sessionCode IS NOT NULL
        ORDER BY d.startTime DESC
        """)
    List<DetailAuction> findSessionDetailsByHost(@Param("userId") Integer userId);

    @Query("""
        SELECT d FROM DetailAuction d
        JOIN FETCH d.auction a
        JOIN FETCH a.product p
        LEFT JOIN FETCH p.images
        JOIN FETCH d.room r
        WHERE r.roomCode = :roomCode
        AND d.sessionCode IS NOT NULL
        ORDER BY d.startTime ASC, d.orderIndex ASC
        """)
    List<DetailAuction> findByRoomCodeWithDetails(@Param("roomCode") String roomCode);

    @Query("""
        SELECT d FROM DetailAuction d
        JOIN FETCH d.auction a
        JOIN FETCH a.product p
        LEFT JOIN FETCH p.images
        JOIN FETCH d.room r
        JOIN FETCH r.host h
        WHERE d.sessionCode IS NOT NULL
        ORDER BY d.startTime DESC
        """)
    List<DetailAuction> findAllWithSessionCodeOrderByStartTimeDesc();
}
