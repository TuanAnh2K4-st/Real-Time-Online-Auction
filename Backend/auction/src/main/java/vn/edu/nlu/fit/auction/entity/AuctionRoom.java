package vn.edu.nlu.fit.auction.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;
import vn.edu.nlu.fit.auction.enums.RoomStatus;

@Entity
@Table(name = "auction_room", uniqueConstraints = @UniqueConstraint(columnNames = "room_code"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

}
