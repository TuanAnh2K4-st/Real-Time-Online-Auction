package vn.edu.nlu.fit.auction.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.AuctionType;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {
    
    boolean existsByProduct(Product product);

    List<Auction> findBySellerAndAuctionType(User seller, AuctionType type);

}

