package vn.edu.nlu.fit.auction.service.Auction;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.entity.Auction;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.Wallet;
import vn.edu.nlu.fit.auction.entity.WalletHold;
import vn.edu.nlu.fit.auction.entity.WalletTransaction;
import vn.edu.nlu.fit.auction.enums.HoldStatus;
import vn.edu.nlu.fit.auction.enums.TransactionDirection;
import vn.edu.nlu.fit.auction.enums.TransactionType;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletHoldRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletTransactionRepository;

@Service
@RequiredArgsConstructor
public class AuctionSettlementService {

    private final WalletRepository walletRepository;
    private final WalletHoldRepository walletHoldRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    @Transactional
    public void releaseLoserDeposits(Auction auction, User winner) {

        List<WalletHold> holds =
                walletHoldRepository.findByAuctionIdAndHoldStatus(
                        auction.getAuctionId(),
                        HoldStatus.HOLDING
                );

        for (WalletHold hold : holds) {

            if (winner != null &&
                    hold.getUserId().equals(winner.getUserId())) {
                continue;
            }

            Wallet wallet = hold.getWallet();

            wallet.setFrozenBalance(
                    wallet.getFrozenBalance().subtract(hold.getAmount())
            );

            walletRepository.save(wallet);

            hold.setHoldStatus(HoldStatus.RELEASED);
            hold.setReleasedAt(LocalDateTime.now());

            walletHoldRepository.save(hold);

            WalletTransaction tx = WalletTransaction.builder()
                    .wallet(wallet)
                    .userId(hold.getUserId())
                    .amount(hold.getAmount())
                    .direction(TransactionDirection.IN)
                    .transactionType(TransactionType.AUCTION_REFUND)
                    .referenceId(auction.getAuctionId())
                    .createdAt(LocalDateTime.now())
                    .build();

            walletTransactionRepository.save(tx);
        }
    }
}