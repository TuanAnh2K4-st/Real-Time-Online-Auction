package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.AuctionRoom;

public interface AuctionRoomRepository extends JpaRepository<AuctionRoom, Integer> {
    
}
