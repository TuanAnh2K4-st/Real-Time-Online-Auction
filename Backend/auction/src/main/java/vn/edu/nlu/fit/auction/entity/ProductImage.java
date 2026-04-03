package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "image_public_id")
    private String imagePublicId;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    // Constructor

    public ProductImage() {
    }

    public ProductImage(Integer imageId, Product product, String imageUrl, String imagePublicId, Boolean isPrimary) {
        this.imageId = imageId;
        this.product = product;
        this.imageUrl = imageUrl;
        this.imagePublicId = imagePublicId;
        this.isPrimary = isPrimary;
    }

    // Getters and Setters

    public Integer getImageId() {
        return imageId;
    }

    public void setImageId(Integer imageId) {
        this.imageId = imageId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImagePublicId() {
        return imagePublicId;
    }

    public void setImagePublicId(String imagePublicId) {
        this.imagePublicId = imagePublicId;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }
    
}
