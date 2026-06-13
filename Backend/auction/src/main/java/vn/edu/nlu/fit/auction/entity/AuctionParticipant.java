package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.edu.nlu.fit.auction.enums.DepositStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "auction_participant",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"auction_id", "user_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auction_participant_id")
    private Integer auctionParticipantId;

    @Column(name = "auction_id", nullable = false)
    private Integer auctionId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "deposit_amount", nullable = false, precision = 15, scale = 0)
    private BigDecimal depositAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "deposit_status", nullable = false)
    private DepositStatus depositStatus;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    public void prePersist() {
        this.joinedAt = LocalDateTime.now();
    }
}