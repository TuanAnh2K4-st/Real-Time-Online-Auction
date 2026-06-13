package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import vn.edu.nlu.fit.auction.enums.Gender;

@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Integer profileId;

    // 1-1 with User
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // 1-1 with Address
    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "avatar_public_id")
    private String avatarPublicId;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "job")
    private String job;

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