package vn.edu.nlu.fit.auction.repository.Auction;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.AuctionRoom;

public interface AuctionRoomRepository extends JpaRepository<AuctionRoom, Integer> {

    long countByHost_UserId(Integer userId);

    List<AuctionRoom> findByHost_UserIdOrderByCreatedAtDesc(Integer userId);

    Optional<AuctionRoom> findByRoomIdAndHost_UserId(Integer roomId, Integer userId);

    boolean existsByRoomCode(String roomCode);

    java.util.Optional<AuctionRoom> findByRoomCode(String roomCode);
}
