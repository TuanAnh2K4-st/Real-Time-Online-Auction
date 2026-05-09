package vn.edu.nlu.fit.auction.dto.response.Notification;

import java.time.LocalDateTime;
import lombok.Data;
import vn.edu.nlu.fit.auction.enums.NotificationType;

@Data
public class NotificationResponse {
    
    private Integer notificationId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private Boolean isRead;
    private NotificationType notificationType; 

    public NotificationResponse() {}

    public NotificationResponse(Integer notificationId, String title, String content, LocalDateTime createdAt, Boolean isRead,
            NotificationType notificationType) {
        this.notificationId = notificationId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.isRead = isRead;
        this.notificationType = notificationType;
    }

}
