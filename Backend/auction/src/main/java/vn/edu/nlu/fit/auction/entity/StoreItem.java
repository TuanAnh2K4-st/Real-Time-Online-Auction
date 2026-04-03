package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;

@Entity
@Table(name = "store_items")
public class StoreItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_item_id")
    private Integer storeItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_status", nullable = false)
    private StoreItemStatus itemStatus;

    @Column(name = "condition_note", columnDefinition = "TEXT")
    private String conditionNote;

    // Constructors

    public StoreItem() {
    }

    public StoreItem(Integer storeItemId, Product product, Store store, StoreItemStatus itemStatus,
            String conditionNote) {
        this.storeItemId = storeItemId;
        this.product = product;
        this.store = store;
        this.itemStatus = itemStatus;
        this.conditionNote = conditionNote;
    }

    // Getters and Setters

    public Integer getStoreItemId() {
        return storeItemId;
    }

    public void setStoreItemId(Integer storeItemId) {
        this.storeItemId = storeItemId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public StoreItemStatus getItemStatus() {
        return itemStatus;
    }

    public void setItemStatus(StoreItemStatus itemStatus) {
        this.itemStatus = itemStatus;
    }

    public String getConditionNote() {
        return conditionNote;
    }

    public void setConditionNote(String conditionNote) {
        this.conditionNote = conditionNote;
    }
    
}
