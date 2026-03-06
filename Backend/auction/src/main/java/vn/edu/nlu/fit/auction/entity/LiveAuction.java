package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
@Entity
@Table(name = "live_auctions")
public class LiveAuction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "live_id")
    private Integer liveId;

    @Column(name = "start_price")
    private Integer startPrice;

    @Column(name = "current_price")
    private Integer currentPrice;

    @Column(name = "start_time")
    private java.time.LocalDateTime startTime;

    @Column(name = "end_time")
    private java.time.LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private LiveSession session;

    //Constructor
    public LiveAuction() {
    }

    //Getters and Setters
    public Integer getLiveId() {
        return liveId;
    }

    public void setLiveId(Integer liveId) {
        this.liveId = liveId;
    }

    public Integer getStartPrice() {
        return startPrice;
    }

    public void setStartPrice(Integer startPrice) {
        this.startPrice = startPrice;
    }

    public Integer getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(Integer currentPrice) {
        this.currentPrice = currentPrice;
    }

    public java.time.LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(java.time.LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public java.time.LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(java.time.LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public LiveSession getSession() {
        return session;
    }

    public void setSession(LiveSession session) {
        this.session = session;
    }
}
