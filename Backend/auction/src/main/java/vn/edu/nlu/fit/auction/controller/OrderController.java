package vn.edu.nlu.fit.auction.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.OrderResponse;
import vn.edu.nlu.fit.auction.enums.OrderStatus;
import vn.edu.nlu.fit.auction.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // GIỎ HÀNG
    @GetMapping("/cart")
    public ApiResponse<List<OrderResponse>> getCart(
            @RequestParam Integer userId
    ) {
        return new ApiResponse<>(
                "Lấy giỏ hàng thành công",
                orderService.getCartOrders(userId)
        );
    }

    // THEO DÕI ĐƠN
    @GetMapping("/tracking")
    public ApiResponse<List<OrderResponse>> getOrders(
            @RequestParam Integer userId,
            @RequestParam(required = false) List<OrderStatus> status
    ) {
        return new ApiResponse<>(
                "Lấy danh sách đơn hàng thành công",
                orderService.getOrders(userId, status)
        );
    }
}
