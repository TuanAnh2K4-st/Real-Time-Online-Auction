package vn.edu.nlu.fit.auction.entity;

import java.math.BigDecimal;
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
    @Column(name = "product_condition", nullable = false)
    private ProductCondition productCondition;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "attributes_json", columnDefinition = "JSON")
    private String attributesJson;

    @Column(name = "base_price", precision = 15, scale = 0, nullable = false)
    private BigDecimal basePrice;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // ===== Auto set time =====
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;

    // Constructor

    public Product() {
    }

    public Product(Integer productId, User user, Category category, String productName, String brand, String origin,
            ProductCondition productCondition, String description, String attributesJson, BigDecimal basePrice,
            LocalDateTime createdAt, List<ProductImage> images) {
        this.productId = productId;
        this.user = user;
        this.category = category;
        this.productName = productName;
        this.brand = brand;
        this.origin = origin;
        this.productCondition = productCondition;
        this.description = description;
        this.attributesJson = attributesJson;
        this.basePrice = basePrice;
        this.createdAt = createdAt;
        this.images = images;
    }

    // Getters and Setters

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public ProductCondition getCondition() {
        return productCondition;
    }

    public void setCondition(ProductCondition productCondition) {
        this.productCondition = productCondition;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAttributesJson() {
        return attributesJson;
    }

    public void setAttributesJson(String attributesJson) {
        this.attributesJson = attributesJson;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

}
