package vn.edu.nlu.fit.auction.service.Subscription;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Subscription.SubscribeRequest;
import vn.edu.nlu.fit.auction.dto.response.Subscription.SubscriptionPlanResponse;
import vn.edu.nlu.fit.auction.dto.response.Subscription.UserSubscriptionResponse;
import vn.edu.nlu.fit.auction.entity.SubscriptionPlan;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.UserSubscription;
import vn.edu.nlu.fit.auction.entity.Wallet;
import vn.edu.nlu.fit.auction.entity.WalletTransaction;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;
import vn.edu.nlu.fit.auction.enums.TransactionDirection;
import vn.edu.nlu.fit.auction.enums.TransactionType;
import vn.edu.nlu.fit.auction.enums.UserRole;
import vn.edu.nlu.fit.auction.enums.WalletStatus;
import vn.edu.nlu.fit.auction.mapper.Subscription.SubscriptionPlanMapper;
import vn.edu.nlu.fit.auction.mapper.Subscription.UserSubscriptionMapper;
import vn.edu.nlu.fit.auction.repository.Subscription.SubscriptionPlanRepository;
import vn.edu.nlu.fit.auction.repository.Subscription.UserSubscriptionRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletTransactionRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    private final UserSubscriptionRepository userSubscriptionRepository;

    private final WalletRepository walletRepository;

    private final WalletTransactionRepository walletTransactionRepository;

    private final SubscriptionPlanMapper subscriptionPlanMapper;

    private final UserSubscriptionMapper userSubscriptionMapper;

    private final SecurityUtil securityUtil;

    // =========================================================
    // GET ALL SUBSCRIPTION PLANS
    // =========================================================

    @Transactional(readOnly = true)
    public List<SubscriptionPlanResponse> getAllPlans() {

        List<SubscriptionPlan> plans =
                subscriptionPlanRepository.findAll();

        return plans.stream()
                .map(subscriptionPlanMapper::toResponse)
                .toList();
    }

    // =========================================================
    // SUBSCRIBE PLAN
    // =========================================================

    public UserSubscriptionResponse subscribe(
            SubscribeRequest request
    ) {

        // ================= CURRENT USER =================

        User currentUser = securityUtil.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        // ================= CHECK ROLE =================

        if (currentUser.getRole() != UserRole.SELLER) {

            throw new RuntimeException(
                    "Only SELLER can subscribe"
            );
        }

        // ================= FIND PLAN =================

        SubscriptionPlan plan =
                subscriptionPlanRepository
                        .findById(request.getPlanId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Subscription plan not found"
                                )
                        );

        // ================= CHECK CURRENT SUBSCRIPTION =================

        Optional<UserSubscription> optionalSubscription =
                userSubscriptionRepository
                        .findTopByUser_UserIdAndStatusOrderByEndDateDesc(
                                currentUser.getUserId(),
                                SubscriptionStatus.ACTIVE
                        )
                        .filter(sub -> sub.getEndDate().isAfter(LocalDateTime.now()));

        if (optionalSubscription.isPresent()) {

            UserSubscription currentSubscription =
                    optionalSubscription.get();

            // nếu chưa hết hạn
            if (!currentSubscription.getEndDate()
                .isBefore(LocalDateTime.now())) {

                throw new RuntimeException(
                        "User already has active subscription"
                );
            }

            // nếu đã hết hạn -> update EXPIRED
            currentSubscription.setStatus(
                    SubscriptionStatus.EXPIRED
            );

            userSubscriptionRepository.save(currentSubscription);
        }

        // ================= FIND WALLET =================

        Wallet wallet = walletRepository
                .findByUserId(currentUser.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Wallet not found"
                        )
                );

        // ================= CHECK WALLET STATUS =================

        if (wallet.getWalletStatus() != WalletStatus.ACTIVE) {

            throw new RuntimeException(
                    "Wallet is not active"
            );
        }

        // ================= CHECK BALANCE =================

        // wallet phải đủ tiền mới được thanh toán
        if (wallet.getBalance()
                .compareTo(plan.getPrice()) < 0) {

            throw new RuntimeException(
                    "Insufficient wallet balance"
            );
        }

        // ================= SUBTRACT MONEY =================

        wallet.setBalance(
                wallet.getBalance()
                        .subtract(plan.getPrice())
        );

        walletRepository.save(wallet);

        // ================= CREATE TRANSACTION =================

        WalletTransaction transaction =
                WalletTransaction.builder()
                        .wallet(wallet)
                        .userId(currentUser.getUserId())
                        .amount(plan.getPrice())
                        .direction(TransactionDirection.OUT)
                        .transactionType(
                                TransactionType.SUBSCRIPTION_PURCHASE
                        )
                        .referenceId(plan.getId())
                        .build();

        walletTransactionRepository.save(transaction);

        // ================= CREATE SUBSCRIPTION =================

        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(plan.getDurationDays());

        UserSubscription subscription =
                UserSubscription.builder()
                        .user(currentUser)
                        .plan(plan)
                        .startDate(start)
                        .endDate(end)
                        .status(SubscriptionStatus.ACTIVE)
                        .build();

        UserSubscription savedSubscription =
                userSubscriptionRepository.save(subscription);

        // ================= RESPONSE =================

        return userSubscriptionMapper.toResponse(
                savedSubscription
        );
    }

    // =========================================================
    // GET CURRENT SUBSCRIPTION
    // =========================================================

    @Transactional(readOnly = true)
    public UserSubscriptionResponse getCurrentSubscription() {

        User currentUser = securityUtil.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        Optional<UserSubscription> optionalSubscription =
                userSubscriptionRepository
                        .findTopByUser_UserIdAndStatusOrderByEndDateDesc(
                                currentUser.getUserId(),
                                SubscriptionStatus.ACTIVE
                        );

        if (optionalSubscription.isEmpty()) {
            return null;
        }

        UserSubscription subscription =
                optionalSubscription.get();

        // nếu subscription hết hạn
        if (!subscription.getEndDate()
                .isAfter(LocalDateTime.now())) {

            subscription.setStatus(
                    SubscriptionStatus.EXPIRED
            );

            userSubscriptionRepository.save(subscription);

            return null;
        }

        return userSubscriptionMapper.toResponse(subscription);
    }
}