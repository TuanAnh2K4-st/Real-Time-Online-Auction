package vn.edu.nlu.fit.auction.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "auto_bids")
public class AutoBid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auto_bid_id")
    private Integer autoBidId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidder_id", nullable = false)
    private User bidder;

    @Column(name = "max_price", nullable = false, precision = 15, scale = 0)
    private BigDecimal maxPrice;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // ===== AUTO SET TIME =====
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructors

    public AutoBid(Integer autoBidId, Auction auction, User bidder, BigDecimal maxPrice, LocalDateTime createdAt) {
        this.autoBidId = autoBidId;
        this.auction = auction;
        this.bidder = bidder;
        this.maxPrice = maxPrice;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Integer getAutoBidId() {
        return autoBidId;
    }

    public void setAutoBidId(Integer autoBidId) {
        this.autoBidId = autoBidId;
    }

    public Auction getAuction() {
        return auction;
    }

    public void setAuction(Auction auction) {
        this.auction = auction;
    }

    public User getBidder() {
        return bidder;
    }

    public void setBidder(User bidder) {
        this.bidder = bidder;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
