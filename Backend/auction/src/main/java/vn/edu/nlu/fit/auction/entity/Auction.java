package vn.edu.nlu.fit.auction.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import vn.edu.nlu.fit.auction.enums.AuctionStatus;
import vn.edu.nlu.fit.auction.enums.AuctionType;

@Entity
@Table(name = "auctions")
public class Auction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auction_id")
    private Integer auctionId;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    
    @OneToOne
    @JoinColumn(name = "winning_bid_id")
    private Bid winningBid;

    @ManyToOne
    @JoinColumn(name = "winner_id")
    private User winner;

    @Column(precision = 15, scale = 0,name = "current_price")
    private BigDecimal currentPrice;

    @Column(precision = 15, scale = 0,name = "start_price", nullable = false)
    private BigDecimal startPrice;

    @Column(precision = 15, scale = 0,name = "step_price", nullable = false)
    private BigDecimal stepPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "auction_status", nullable = false)
    private AuctionStatus auctionStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "auction_type", nullable = false)
    private AuctionType auctionType;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;



}
