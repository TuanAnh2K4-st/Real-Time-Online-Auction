package vn.edu.nlu.fit.auction.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import vn.edu.nlu.fit.auction.enums.RoomStatus;

@Entity
@Table(name = "auction_rooms", uniqueConstraints = @UniqueConstraint(columnNames = "room_code"))
public class AuctionRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_auction_id")
    private Auction currentAuction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @Column(name = "room_code", length = 10, nullable = false, unique = true)
    private String roomCode;

    @Column(name = "room_name")
    private String roomName;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_status", nullable = false)
    private RoomStatus roomStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ===== AUTO SET TIME =====
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructors
    
    public AuctionRoom() {
    }

    public AuctionRoom(Integer roomId, Auction currentAuction, User host, String roomCode, String roomName,
            RoomStatus roomStatus, LocalDateTime createdAt) {
        this.roomId = roomId;
        this.currentAuction = currentAuction;
        this.host = host;
        this.roomCode = roomCode;
        this.roomName = roomName;
        this.roomStatus = roomStatus;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public Auction getCurrentAuction() {
        return currentAuction;
    }

    public void setCurrentAuction(Auction currentAuction) {
        this.currentAuction = currentAuction;
    }

    public User getHost() {
        return host;
    }

    public void setHost(User host) {
        this.host = host;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public RoomStatus getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(RoomStatus roomStatus) {
        this.roomStatus = roomStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
}
