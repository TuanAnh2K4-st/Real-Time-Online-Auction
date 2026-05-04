package vn.edu.nlu.fit.auction.repository.Auction;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.AutoBid;

public interface AutoBidRepository extends JpaRepository<AutoBid, Integer> {
    
}
