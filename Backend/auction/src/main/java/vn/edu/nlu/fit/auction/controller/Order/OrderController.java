package vn.edu.nlu.fit.auction.controller.Order;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Order.OrderResponse;
import vn.edu.nlu.fit.auction.service.Order.OrderService;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // GET /api/orders/cart — giỏ hàng chờ thanh toán
    @GetMapping("/cart")
    public ApiResponse<List<OrderResponse>> getCartOrders() {
        return new ApiResponse<>(
                "Get cart orders successfully",
                orderService.getCartOrders()
        );
    }

    // GET /api/orders/my-orders?status=SHIPPING — theo dõi đơn hàng
    @GetMapping("/my-orders")
    public ApiResponse<List<OrderResponse>> getMyOrders(
            @RequestParam(required = false, defaultValue = "") String status) {
        return new ApiResponse<>(
                "Get my orders successfully",
                orderService.getMyOrders(status)
        );
    }
        
}
