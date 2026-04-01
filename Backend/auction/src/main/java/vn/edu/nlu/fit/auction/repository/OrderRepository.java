package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    
}
