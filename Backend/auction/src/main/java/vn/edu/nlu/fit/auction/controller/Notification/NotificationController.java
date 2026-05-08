package vn.edu.nlu.fit.auction.controller.Notification;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Notification.NotificationReadRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Notification.NotificationResponse;
import vn.edu.nlu.fit.auction.service.Notification.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Api lấy danh sách thông báo của user
    @GetMapping("/me")
    public ApiResponse<List<NotificationResponse>> getMyNotifications() {

        return new ApiResponse<>(
                "Lấy danh sách notification thành công",
                notificationService.getMyNotifications()
        );
    }

    // Api đánh dấu thông báo đã đọc
    @PutMapping("/read")
    public ApiResponse<String> markAsRead( @RequestBody NotificationReadRequest request) {

        notificationService.markAsRead(request);

        return new ApiResponse<>(
                "Đã đánh dấu notification là đã đọc",
                null
        );
    }
}
