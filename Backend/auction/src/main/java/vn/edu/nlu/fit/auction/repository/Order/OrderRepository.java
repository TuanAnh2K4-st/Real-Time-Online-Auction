package vn.edu.nlu.fit.auction.repository.Order;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Order;
import vn.edu.nlu.fit.auction.enums.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    
    // CHECK EXIST
    boolean existsByAuction(Auction auction);
    
        
    // CART
    List<Order> findByWinner_UserIdAndOrderStatusOrderByCreatedAtDesc(
            Integer userId, OrderStatus status
    );

    // FILTER STATUS
    List<Order> findByWinner_UserIdAndOrderStatusInOrderByCreatedAtDesc(
            Integer userId, List<OrderStatus> statuses
    );

    // ALL
    List<Order> findByWinner_UserIdOrderByCreatedAtDesc(Integer userId);
    
}
