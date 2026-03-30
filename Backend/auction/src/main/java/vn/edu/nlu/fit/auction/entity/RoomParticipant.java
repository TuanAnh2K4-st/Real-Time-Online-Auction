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

    // Constructor

    public RoomParticipant(Integer roomParticipantId, AuctionRoom room, User user, LocalDateTime joinedAt,
            LocalDateTime leaveAt, RoomRole roomRole) {
        this.roomParticipantId = roomParticipantId;
        this.room = room;
        this.user = user;
        this.joinedAt = joinedAt;
        this.leaveAt = leaveAt;
        this.roomRole = roomRole;
    }

    // Getters and Setters

    public Integer getRoomParticipantId() {
        return roomParticipantId;
    }

    public void setRoomParticipantId(Integer roomParticipantId) {
        this.roomParticipantId = roomParticipantId;
    }

    public AuctionRoom getRoom() {
        return room;
    }

    public void setRoom(AuctionRoom room) {
        this.room = room;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public LocalDateTime getLeaveAt() {
        return leaveAt;
    }

    public void setLeaveAt(LocalDateTime leaveAt) {
        this.leaveAt = leaveAt;
    }

    public RoomRole getRoomRole() {
        return roomRole;
    }

    public void setRoomRole(RoomRole roomRole) {
        this.roomRole = roomRole;
    }

}
