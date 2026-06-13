package vn.edu.nlu.fit.auction.controller.Admin.Subscription;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.Subscription.FilterUserSubscriptionRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Admin.Subscription.AdminUserSubscriptionResponse;
import vn.edu.nlu.fit.auction.service.Admin.Subscription.AdminUserSubscriptionService;

@RestController
@RequestMapping("/api/admin/user-subscriptions")
@RequiredArgsConstructor
public class AdminUserSubscriptionController {

    private final AdminUserSubscriptionService service;

    @PostMapping("/filter")
    public ApiResponse<List<AdminUserSubscriptionResponse>> filter(@RequestBody FilterUserSubscriptionRequest request) {

        List<AdminUserSubscriptionResponse> subscriptions = service.getAll(request);

        return new ApiResponse<>(
                "Lấy danh sách subscription thành công",
                subscriptions
        );
    }

    @PutMapping("/cancel/{id}")
    public ApiResponse<String> cancelSubscription(@PathVariable Integer id) {

        service.cancelSubscription(id);

        return new ApiResponse<>(
                "Hủy gói subscription thành công",
                null
        );
    }

}