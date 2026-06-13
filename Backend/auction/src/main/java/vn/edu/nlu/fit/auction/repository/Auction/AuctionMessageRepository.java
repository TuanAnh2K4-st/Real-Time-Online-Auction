package vn.edu.nlu.fit.auction.repository.Auction;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.AuctionMessage;

public interface AuctionMessageRepository extends JpaRepository<AuctionMessage, Integer> {

    List<AuctionMessage> findByAuctionOrderByCreatedAtAsc(Auction auction);
    
}
