package vn.edu.nlu.fit.auction.service.Order;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.Order.OrderResponse;
import vn.edu.nlu.fit.auction.entity.Order;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.OrderStatus;
import vn.edu.nlu.fit.auction.repository.Order.OrderRepository;
import vn.edu.nlu.fit.auction.repository.Order.PaymentRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;


@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final SecurityUtil securityUtil;

    // ─── Giỏ hàng (đơn hàng chờ thanh toán) ───────────────────────────────────
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

    // ─── Theo dõi đơn hàng ─────────────────────────────────────────────────────
    /**
     * Trả về danh sách đơn hàng của user để theo dõi (tất cả trừ CART).
     * Nếu status được truyền vào thì lọc theo status đó.
     *
     * @Transactional(readOnly=true) cần thiết để có thể lazy-load address.province
     * và address.ward bên trong cùng một session Hibernate.
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String status) {
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Integer userId = currentUser.getUserId();
        List<OrderResponse> responses;

        // Lấy danh sách đơn hàng theo status hoặc tất cả
        if (status != null && !status.isBlank()) {
            OrderStatus orderStatus;
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Trạng thái đơn hàng không hợp lệ: " + status);
            }
            responses = orderRepository.findTrackingOrdersByUserIdAndStatus(userId, orderStatus);
        } else {
            responses = orderRepository.findAllTrackingOrdersByUserId(userId, OrderStatus.CART);
        }

        // Bổ sung thông tin thanh toán & địa chỉ từ entity Order (lazy load)
        return responses.stream().map(resp -> {
            Order order = orderRepository.findById(resp.getOrderId()).orElse(null);
            if (order == null) return resp;

            // Địa chỉ giao hàng — gọi getFullAddress() trong cùng session Hibernate
            if (order.getAddress() != null) {
                try {
                    resp.setAddressDetail(order.getAddress().getFullAddress());
                } catch (Exception ignored) {
                    // không bắt buộc có địa chỉ
                }
            }

            // Thông tin thanh toán
            paymentRepository.findByOrderOrderId(resp.getOrderId()).ifPresent(payment -> {
                resp.setPaidAt(payment.getPaidAt());
                resp.setPaymentAmount(payment.getAmount());
                resp.setPaymentMethod(payment.getMethod() != null ? payment.getMethod().name() : null);
            });

            return resp;
        }).collect(Collectors.toList());
    }

    
}