package vn.edu.nlu.fit.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_subscription")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_subscription_id")
    private Integer id;

    // ===== RELATIONSHIP =====

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    // ===== TIME =====

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    // ===== STATUS =====

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    // AUTO SET TIME
    @PrePersist
    public void prePersist() {
        if (startDate == null) {
            startDate = LocalDateTime.now();
        }

        if (endDate == null && plan != null) {
            endDate = startDate.plusDays(plan.getDurationDays());
        }

        if (status == null) {
            status = SubscriptionStatus.ACTIVE;
        }
    }

}
