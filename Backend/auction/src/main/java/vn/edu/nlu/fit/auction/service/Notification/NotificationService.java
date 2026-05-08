package vn.edu.nlu.fit.auction.service.Notification;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Notification.NotificationReadRequest;
import vn.edu.nlu.fit.auction.dto.response.Notification.NotificationResponse;
import vn.edu.nlu.fit.auction.entity.Notification;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.NotificationType;
import vn.edu.nlu.fit.auction.repository.Notification.NotificationRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SecurityUtil securityUtil;

    // Gửi thông báo đến user
    public void send(User user, String title, String content, NotificationType type) {

        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setContent(content);
        n.setNotificationType(type);

        notificationRepository.save(n);
    }

    // Lấy ra danh sách thông báo của user
    public List<NotificationResponse> getMyNotifications() {

        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        List<Notification> notifications =
                notificationRepository.findByUserSorted(currentUser.getUserId());

        return notifications.stream()
                .map(n -> new NotificationResponse(
                        n.getNotificationId(),
                        n.getTitle(),
                        n.getCreatedAt(),
                        n.getIsRead()
                ))
                .toList();
    }

    // chức năng đánh dấu thông báo đã đọc
    public void markAsRead(NotificationReadRequest request) {

        User currentUser = securityUtil.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Notification notification = notificationRepository
                .findByIdAndUserId(
                        request.getNotificationId(),
                        currentUser.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException("Notification not found")
                );

        notification.setIsRead(true);

        notificationRepository.save(notification);
    }

}
