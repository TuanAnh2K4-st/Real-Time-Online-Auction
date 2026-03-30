package vn.edu.nlu.fit.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    
}
