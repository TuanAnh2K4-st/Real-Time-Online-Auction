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
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // 1-1 with Address
    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(name = "business_name", nullable = false)
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
}
