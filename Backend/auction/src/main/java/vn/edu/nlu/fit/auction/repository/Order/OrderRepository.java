package vn.edu.nlu.fit.auction.repository.Order;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import vn.edu.nlu.fit.auction.dto.response.Order.OrderResponse;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.Order;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Integer> {
        
        // Lấy ra danh sách các đơn hàng đã mua của một người dùng, sắp xếp theo thời gian tạo đơn hàng giảm dần
        @Query("""
        SELECT DISTINCT new vn.edu.nlu.fit.auction.dto.response.Order.OrderResponse(
                o.orderId,
                o.winner.userId,
                o.auction.auctionId,
                o.totalAmount,
                o.orderStatus,
                o.createdAt,
                pi.imageUrl,
                p.productName,
                c.name,
                s.username
        )
        FROM Order o
        JOIN o.auction a
        JOIN a.product p
        LEFT JOIN p.category c
        LEFT JOIN a.seller s
        LEFT JOIN p.images pi
        WHERE o.winner = :user
        AND o.orderStatus = :status
        AND (pi.isPrimary = true OR pi IS NULL)
        ORDER BY o.createdAt DESC
        """)
        List<OrderResponse> findCartOrdersByUser(User user, OrderStatus status);

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
