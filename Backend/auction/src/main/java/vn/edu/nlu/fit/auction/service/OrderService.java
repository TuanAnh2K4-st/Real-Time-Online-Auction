package vn.edu.nlu.fit.auction.service;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.OrderResponse;
import vn.edu.nlu.fit.auction.entity.Order;
import vn.edu.nlu.fit.auction.enums.OrderStatus;
import vn.edu.nlu.fit.auction.mapper.OrderMapper;
import vn.edu.nlu.fit.auction.repository.OrderRepository;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    // GIỎ HÀNG
    public List<OrderResponse> getCartOrders(Integer userId) {
        List<Order> orders = orderRepository
                .findByWinner_UserIdAndOrderStatusOrderByCreatedAtDesc(
                        userId, OrderStatus.CART
                );

        return orders.stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    // THEO DÕI ĐƠN
    public List<OrderResponse> getOrders(
            Integer userId,
            List<OrderStatus> statuses
    ) {

        List<Order> orders;

        if (statuses == null || statuses.isEmpty()) {
            orders = orderRepository
                    .findByWinner_UserIdOrderByCreatedAtDesc(userId);
        } else {
            orders = orderRepository
                    .findByWinner_UserIdAndOrderStatusInOrderByCreatedAtDesc(
                            userId, statuses
                    );
        }

        return orders.stream()
                .map(orderMapper::toResponse)
                .toList();
    }
}