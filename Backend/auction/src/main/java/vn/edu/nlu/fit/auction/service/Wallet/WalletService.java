package vn.edu.nlu.fit.auction.service.Wallet;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Wallet.WalletAmountRequest;
import vn.edu.nlu.fit.auction.dto.request.Wallet.WalletWithdrawRequest;
import vn.edu.nlu.fit.auction.dto.response.Wallet.WalletResponse;
import vn.edu.nlu.fit.auction.dto.response.Wallet.WalletTransactionResponse;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.Wallet;
import vn.edu.nlu.fit.auction.entity.WalletTransaction;
import vn.edu.nlu.fit.auction.enums.TransactionDirection;
import vn.edu.nlu.fit.auction.enums.TransactionType;
import vn.edu.nlu.fit.auction.enums.WalletStatus;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletTransactionRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class WalletService {

    private static final BigDecimal MAX_SINGLE_TX = new BigDecimal("5000000000"); // 5 tỷ / giao dịch demo

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final SecurityUtil securityUtil;

    public WalletResponse getMyWallet() {
        Wallet wallet = requireWallet();
        return toWalletResponse(wallet);
    }

    public Page<WalletTransactionResponse> getMyTransactions(Pageable pageable) {
        User user = securityUtil.getCurrentUser();
        if (user == null) {
            throw new RuntimeException("Unauthorized");
        }
        return walletTransactionRepository
                .findByUserIdOrderByCreatedAtDesc(user.getUserId(), pageable)
                .map(this::toTransactionResponse);
    }

    @Transactional
    public WalletTransactionResponse deposit(WalletAmountRequest req) {
        BigDecimal amount = normalizeAmount(req.getAmount());
        Wallet wallet = requireWallet();
        ensureActive(wallet);

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .userId(wallet.getUserId())
                .amount(amount)
                .direction(TransactionDirection.IN)
                .transactionType(TransactionType.DEPOSIT_TOPUP)
                .build();

        WalletTransaction saved = walletTransactionRepository.save(tx);
        return toTransactionResponse(saved);
    }

    @Transactional
    public WalletTransactionResponse withdraw(WalletWithdrawRequest req) {
        BigDecimal amount = normalizeAmount(req.getAmount());
        Wallet wallet = requireWallet();
        ensureActive(wallet);

        BigDecimal available = wallet.getBalance().subtract(wallet.getFrozenBalance());
        if (amount.compareTo(available) > 0) {
            throw new RuntimeException("Số dư khả dụng không đủ");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .userId(wallet.getUserId())
                .amount(amount)
                .direction(TransactionDirection.OUT)
                .transactionType(TransactionType.WITHDRAW)
                .build();

        WalletTransaction saved = walletTransactionRepository.save(tx);
        return toTransactionResponse(saved);
    }

    private Wallet requireWallet() {
        User user = securityUtil.getCurrentUser();
        if (user == null) {
            throw new RuntimeException("Unauthorized");
        }
        return walletRepository.findByUserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví"));
    }

    private void ensureActive(Wallet wallet) {
        if (wallet.getWalletStatus() != WalletStatus.ACTIVE) {
            throw new RuntimeException("Ví đang bị khóa, không thể giao dịch");
        }
    }

    private BigDecimal normalizeAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Số tiền không hợp lệ");
        }
        if (amount.compareTo(MAX_SINGLE_TX) > 0) {
            throw new RuntimeException("Vượt hạn mức một giao dịch");
        }
        BigDecimal scaled = amount.setScale(0, RoundingMode.HALF_UP);
        if (scaled.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Số tiền không hợp lệ");
        }
        return scaled;
    }

    private WalletResponse toWalletResponse(Wallet w) {
        return WalletResponse.builder()
                .walletId(w.getWalletId())
                .balance(w.getBalance())
                .frozenBalance(w.getFrozenBalance())
                .walletStatus(w.getWalletStatus().name())
                .build();
    }

    private WalletTransactionResponse toTransactionResponse(WalletTransaction t) {
        return WalletTransactionResponse.builder()
                .transactionId(t.getWalletTransactionId())
                .transactionType(t.getTransactionType().name())
                .direction(t.getDirection().name())
                .amount(t.getAmount())
                .createdAt(t.getCreatedAt())
                .referenceCode("#WT-" + t.getWalletTransactionId())
                .referenceId(t.getReferenceId())
                .build();
    }
}
