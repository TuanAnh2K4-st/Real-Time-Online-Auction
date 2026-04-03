package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Watchlist;

public interface WatchlistRepository extends JpaRepository<Watchlist, Integer> {
    
}
