package vn.edu.nlu.fit.auction.dto.request.Wallet;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class WalletWithdrawRequest extends WalletAmountRequest {

    @NotBlank(message = "Vui lòng chọn ngân hàng")
    private String bankCode;

    @NotBlank(message = "Vui lòng nhập số tài khoản")
    private String accountNumber;
}
