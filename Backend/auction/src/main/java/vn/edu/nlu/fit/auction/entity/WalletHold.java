package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.edu.nlu.fit.auction.enums.HoldStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "wallet_hold",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "auction_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletHold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wallet_hold_id")
    private Integer walletHoldId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "auction_id", nullable = false)
    private Integer auctionId;

    @Column(name = "amount", nullable = false, precision = 15, scale = 0)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "hold_status", nullable = false)
    private HoldStatus holdStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
    
}
