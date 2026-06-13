package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "business")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "business_id")
    private Integer businessId;

    // 1-1 with User
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_name")
    private String businessName;

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
