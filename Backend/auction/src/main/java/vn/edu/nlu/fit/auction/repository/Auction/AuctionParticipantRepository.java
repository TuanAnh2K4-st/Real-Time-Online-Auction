package vn.edu.nlu.fit.auction.repository.Auction;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.AuctionParticipant;

public interface AuctionParticipantRepository extends JpaRepository<AuctionParticipant, Integer> {

    Optional<AuctionParticipant> findByAuctionIdAndUserId(Integer auctionId, Integer userId);
}
