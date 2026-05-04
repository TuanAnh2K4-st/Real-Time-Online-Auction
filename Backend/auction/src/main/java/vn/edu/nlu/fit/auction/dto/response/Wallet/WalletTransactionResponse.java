package vn.edu.nlu.fit.auction.dto.response.Wallet;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransactionResponse {

    private Integer transactionId;
    private String transactionType;
    private String direction;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    /** Mã hiển thị, ví dụ #WT-12 */
    private String referenceCode;
    private Integer referenceId;
}
