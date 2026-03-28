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

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_status", nullable = false)
    private StoreItemStatus itemStatus;

    @Column(name = "condition_note", columnDefinition = "TEXT")
    private String conditionNote;
    
}
