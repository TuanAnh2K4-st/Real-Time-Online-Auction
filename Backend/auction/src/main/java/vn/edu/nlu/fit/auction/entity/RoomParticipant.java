package vn.edu.nlu.fit.auction.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import vn.edu.nlu.fit.auction.enums.RoomRole;

@Entity
@Table(name = "room_participants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"room_id", "user_id"})
})
public class RoomParticipant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_participant_id")
    private Integer roomParticipantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private AuctionRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @Column(name = "leave_at")
    private LocalDateTime leaveAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_role", nullable = false)
    private RoomRole roomRole;

    // ================== AUTO TIME ==================
    @PrePersist
    public void prePersist() {
        this.joinedAt = LocalDateTime.now();
    }


}
