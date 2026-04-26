package vn.edu.nlu.fit.auction.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.entity.Notification;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.NotificationType;
import vn.edu.nlu.fit.auction.repository.NotificationRepository;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void send(User user, String title, String content, NotificationType type) {

        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setContent(content);
        n.setNotificationType(type);

        notificationRepository.save(n);
    }
}
