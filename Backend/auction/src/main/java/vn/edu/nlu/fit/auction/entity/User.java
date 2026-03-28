package vn.edu.nlu.fit.auction.entity;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.UserStatus;
import vn.edu.nlu.fit.auction.enums.AuthProvider;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "username", length = 150, nullable = false)
    private String username;

    @Column(name = "email", length = 150, unique = true, nullable = false)
    private String email;

    @Column(name = "password", length = 150)
    private String password; 

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false)
    private AuthProvider provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "create_at", updatable = false, nullable = false)
    private LocalDateTime createAt;

    // ===== AUTO SET TIME =====
    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
    }
    
}