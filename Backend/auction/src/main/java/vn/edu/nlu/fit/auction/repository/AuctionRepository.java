package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Product;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {
    
    boolean existsByProduct(Product product);

    
}

