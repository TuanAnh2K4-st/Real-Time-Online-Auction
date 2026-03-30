package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.AuctionMessage;

public interface AuctionMessageRepository extends JpaRepository<AuctionMessage, Integer> {
    
}
