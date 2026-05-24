package vn.edu.nlu.fit.auction.controller.Admin.Subscription;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.Subscription.CreateSubscriptionRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Admin.Subscription.AdminSubscriptionResponse;
import vn.edu.nlu.fit.auction.service.Admin.Subscription.AdminSubscriptionService;

@RestController
@RequestMapping("/api/admin/subscriptions")
@RequiredArgsConstructor
public class AdminSubscriptionController {

    private final AdminSubscriptionService service;

    // GET ALL
    @GetMapping("/all")
    public ApiResponse<List<AdminSubscriptionResponse>> getAll() {

        return new ApiResponse<>(
                "Lấy danh sách subscription thành công",
                service.getAll()
        );
    }

    // CREATE
    @PostMapping("/create")
    public ApiResponse<String> create(@RequestBody CreateSubscriptionRequest request) {

        service.create(request);

        return new ApiResponse<>(
                "Tạo subscription thành công",
                null
        );
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable Integer id) {

        service.delete(id);

        return new ApiResponse<>(
                "Xóa subscription thành công",
                null
        );
    }
}
