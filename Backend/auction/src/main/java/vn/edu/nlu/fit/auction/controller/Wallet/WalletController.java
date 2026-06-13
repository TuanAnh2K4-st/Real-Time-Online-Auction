package vn.edu.nlu.fit.auction.controller.Wallet;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Wallet.WalletAmountRequest;
import vn.edu.nlu.fit.auction.dto.request.Wallet.WalletWithdrawRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.Wallet.WalletResponse;
import vn.edu.nlu.fit.auction.dto.response.Wallet.WalletTransactionResponse;
import vn.edu.nlu.fit.auction.service.Wallet.WalletService;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<WalletResponse>> getMyWallet() {
        WalletResponse data = walletService.getMyWallet();
        return ResponseEntity.ok(new ApiResponse<>("Lấy ví thành công", data));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<WalletTransactionResponse>>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<WalletTransactionResponse> data = walletService.getMyTransactions(
                PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return ResponseEntity.ok(new ApiResponse<>("Lấy lịch sử giao dịch thành công", data));
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<WalletTransactionResponse>> deposit(
            @Valid @RequestBody WalletAmountRequest body
    ) {
        WalletTransactionResponse tx = walletService.deposit(body);
        return ResponseEntity.ok(new ApiResponse<>("Nạp tiền thành công", tx));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<WalletTransactionResponse>> withdraw(
            @Valid @RequestBody WalletWithdrawRequest body
    ) {
        WalletTransactionResponse tx = walletService.withdraw(body);
        return ResponseEntity.ok(new ApiResponse<>("Rút tiền thành công", tx));
    }
}
