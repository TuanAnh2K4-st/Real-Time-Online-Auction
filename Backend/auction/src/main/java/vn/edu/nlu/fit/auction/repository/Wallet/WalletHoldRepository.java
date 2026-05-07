package vn.edu.nlu.fit.auction.repository.Wallet;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.WalletHold;
import vn.edu.nlu.fit.auction.enums.HoldStatus;

public interface WalletHoldRepository extends JpaRepository<WalletHold, Integer> {

    Optional<WalletHold> findByAuctionIdAndUserIdAndHoldStatus( Integer auctionId, Integer userId, HoldStatus holdStatus);
    
}
