package vn.edu.nlu.fit.auction.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import vn.edu.nlu.fit.auction.enums.ProductCondition;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "brand")
    private String brand;

    @Column(name = "origin")
    private String origin;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false)
    private ProductCondition condition;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "attributes_json", columnDefinition = "JSON")
    private String attributesJson;

    @Column(name = "base_price", nullable = false)
    private Integer basePrice;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // ===== Auto set time =====
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;


    

}
