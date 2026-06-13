package vn.edu.nlu.fit.auction.dto.request.Wallet;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WalletAmountRequest {

    @NotNull(message = "Số tiền không được để trống")
    @DecimalMin(value = "1", message = "Số tiền tối thiểu 1 VND")
    private BigDecimal amount;
}
