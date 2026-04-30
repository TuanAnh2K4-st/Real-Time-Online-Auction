package vn.edu.nlu.fit.auction.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.edu.nlu.fit.auction.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    
    // Danh sách tin nhắn của user
    @Query("""
        SELECT n 
        FROM Notification n
        WHERE n.user.id = :userId
        ORDER BY n.isRead ASC, n.createdAt DESC
    """)
    List<Notification> findByUserSorted(@Param("userId") Integer userId);
    
}
