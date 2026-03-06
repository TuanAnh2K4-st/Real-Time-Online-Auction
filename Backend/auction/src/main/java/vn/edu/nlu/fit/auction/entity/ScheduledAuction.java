package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
@Entity
@Table(name = "scheduled_auctions")
public class ScheduledAuction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheduled_id")
    private Integer scheduledId;

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

    //Constructor
    public ScheduledAuction() {
    }

    //Getters and Setters
    public Integer getScheduledId() {
        return scheduledId;
    }

    public void setScheduledId(Integer scheduledId) {
        this.scheduledId = scheduledId;
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
}