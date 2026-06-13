package vn.edu.nlu.fit.auction.dto.response.Wallet;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletResponse {

    private Integer walletId;
    private BigDecimal balance;
    private BigDecimal frozenBalance;
    private String walletStatus;
}
