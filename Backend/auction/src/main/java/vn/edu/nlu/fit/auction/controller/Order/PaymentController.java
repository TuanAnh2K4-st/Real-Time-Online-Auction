package vn.edu.nlu.fit.auction.controller.Order;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Order.PaymentRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.service.Order.PaymentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    // Api thanh toán bằng ví điện tử
    @PostMapping("/wallet")
    public ResponseEntity<ApiResponse<String>> payOrder(@RequestBody PaymentRequest request) {

        paymentService.payOrder(request);
        ApiResponse<String> response =new ApiResponse<>("Payment thành công", null);
        return ResponseEntity.ok(response);
    }

}
