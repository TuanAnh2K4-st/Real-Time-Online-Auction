package vn.edu.nlu.fit.auction.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "auction_messages")
public class AuctionMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // ===== AUTO SET TIME =====
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
    

}
