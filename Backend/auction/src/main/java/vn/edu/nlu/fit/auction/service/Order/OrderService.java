package vn.edu.nlu.fit.auction.service.Order;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.Order.OrderResponse;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.OrderStatus;
import vn.edu.nlu.fit.auction.repository.Order.OrderRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;


@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final SecurityUtil securityUtil;

    public List<OrderResponse> getCartOrders() {
        User currentUser = securityUtil.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        return orderRepository.findCartOrdersByUser(
                currentUser,
                OrderStatus.CART
        );
    }

    
}