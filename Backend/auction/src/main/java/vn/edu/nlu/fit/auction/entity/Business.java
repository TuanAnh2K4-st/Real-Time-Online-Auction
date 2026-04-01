package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "businesses")
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "business_id")
    private Integer businessId;

    // 1-1 with User
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // 1-1 with Address
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(name = "business_name")
    private String businessName;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "logo_public_id")
    private String logoPublicId;

    @Column(name = "tax_code", length = 50)
    private String taxCode;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "update_at")
    private LocalDateTime updatedAt;

    // ===== AUTO SET TIME =====
    @PreUpdate 
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructors

    public Business() {
    }

    public Business(Integer businessId, User user, Address address, String businessName, String logoUrl,
            String logoPublicId, String taxCode, String bio, LocalDateTime updatedAt) {
        this.businessId = businessId;
        this.user = user;
        this.address = address;
        this.businessName = businessName;
        this.logoUrl = logoUrl;
        this.logoPublicId = logoPublicId;
        this.taxCode = taxCode;
        this.bio = bio;
        this.updatedAt = updatedAt;
    }
 
    // Getters and Setters

    public Integer getBusinessId() {
        return businessId;
    }

    public void setBusinessId(Integer businessId) {
        this.businessId = businessId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getLogoPublicId() {
        return logoPublicId;
    }

    public void setLogoPublicId(String logoPublicId) {
        this.logoPublicId = logoPublicId;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
}
