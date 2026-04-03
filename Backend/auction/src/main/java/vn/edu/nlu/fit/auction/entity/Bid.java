package vn.edu.nlu.fit.auction.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "bids")
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bid_id")
    private Integer bidId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidder_id", nullable = false)
    private User bidder;

    @Column(name = "bid_amount", nullable = false, precision = 15, scale = 0)
    private BigDecimal bidAmount;

    @Column(name = "bid_time", nullable = false)
    private LocalDateTime bidTime;

    // ===== AUTO SET TIME =====
    @PrePersist
    public void prePersist() {
        this.bidTime = LocalDateTime.now();
    }

    // Constructors

    public Bid() {
    }
    
    public Bid(Integer bidId, Auction auction, User bidder, BigDecimal bidAmount, LocalDateTime bidTime) {
        this.bidId = bidId;
        this.auction = auction;
        this.bidder = bidder;
        this.bidAmount = bidAmount;
        this.bidTime = bidTime;
    }

    // Getters and Setters

    public Integer getBidId() {
        return bidId;
    }

    public void setBidId(Integer bidId) {
        this.bidId = bidId;
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

    public BigDecimal getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(BigDecimal bidAmount) {
        this.bidAmount = bidAmount;
    }

    public LocalDateTime getBidTime() {
        return bidTime;
    }

    public void setBidTime(LocalDateTime bidTime) {
        this.bidTime = bidTime;
    }

}
