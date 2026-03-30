package vn.edu.nlu.fit.auction.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "detail_auctions", uniqueConstraints = {
           // 1 auction chỉ xuất hiện 1 lần trong 1 room
           @UniqueConstraint(columnNames = {"room_id", "auction_id"}),

           // thứ tự không bị trùng trong 1 room
           @UniqueConstraint(columnNames = {"room_id", "order_index"})
       })
public class DetailAuction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_auction_id")
    private Integer detailAuctionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private AuctionRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    //Constructor
    
    public DetailAuction(Integer detailAuctionId, AuctionRoom room, Auction auction, Integer orderIndex,
            LocalDateTime startTime, LocalDateTime endTime) {
        this.detailAuctionId = detailAuctionId;
        this.room = room;
        this.auction = auction;
        this.orderIndex = orderIndex;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters and Setters

    public Integer getDetailAuctionId() {
        return detailAuctionId;
    }

    public void setDetailAuctionId(Integer detailAuctionId) {
        this.detailAuctionId = detailAuctionId;
    }

    public AuctionRoom getRoom() {
        return room;
    }

    public void setRoom(AuctionRoom room) {
        this.room = room;
    }

    public Auction getAuction() {
        return auction;
    }

    public void setAuction(Auction auction) {
        this.auction = auction;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
}
