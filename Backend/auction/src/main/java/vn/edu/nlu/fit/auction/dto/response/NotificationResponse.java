package vn.edu.nlu.fit.auction.dto.response;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class NotificationResponse {
    
    private Integer id;
    private String title;
    private LocalDateTime createdAt;
    private Boolean isRead;

    public NotificationResponse() {}

    public NotificationResponse(Integer id, String title, LocalDateTime createdAt, Boolean isRead) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.isRead = isRead;
    }

}
