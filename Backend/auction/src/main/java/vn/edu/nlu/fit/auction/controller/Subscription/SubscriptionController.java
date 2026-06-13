package vn.edu.nlu.fit.auction.controller.Subscription;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Subscription.SubscribeRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Subscription.SubscriptionPlanResponse;
import vn.edu.nlu.fit.auction.dto.response.Subscription.UserSubscriptionResponse;
import vn.edu.nlu.fit.auction.service.Subscription.SubscriptionService;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // ===== GET ALL PLANS =====

    @GetMapping("/plans")
    public ApiResponse<List<SubscriptionPlanResponse>>
    getAllPlans() {

        return new ApiResponse<>(
                "Get subscription plans successfully",
                subscriptionService.getAllPlans()
        );
    }

    // ===== GET CURRENT =====

    @GetMapping("/current")
    public ApiResponse<UserSubscriptionResponse>
    getCurrentSubscription() {

        return new ApiResponse<>(
                "Get current subscription successfully",
                subscriptionService.getCurrentSubscription()
        );
    }

    // ===== SUBSCRIBE =====

    @PostMapping("/subscribe")
    public ApiResponse<UserSubscriptionResponse>
    subscribe(
            @RequestBody SubscribeRequest request
    ) {

        return new ApiResponse<>(
                "Subscribe successfully",
                subscriptionService.subscribe(request)
        );
    }
}