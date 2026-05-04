package vn.edu.nlu.fit.auction.repository.Wallet;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.WalletTransaction;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Integer> {

    Page<WalletTransaction> findByUserIdOrderByCreatedAtDesc(Integer userId, Pageable pageable);
}
