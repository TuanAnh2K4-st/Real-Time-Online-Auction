package vn.edu.nlu.fit.auction.service.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Order.PaymentRequest;
import vn.edu.nlu.fit.auction.entity.Address;
import vn.edu.nlu.fit.auction.entity.Order;
import vn.edu.nlu.fit.auction.entity.Payment;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.entity.Wallet;
import vn.edu.nlu.fit.auction.entity.WalletHold;
import vn.edu.nlu.fit.auction.entity.WalletTransaction;
import vn.edu.nlu.fit.auction.enums.HoldStatus;
import vn.edu.nlu.fit.auction.enums.OrderStatus;
import vn.edu.nlu.fit.auction.enums.PaymentMethod;
import vn.edu.nlu.fit.auction.enums.PaymentStatus;
import vn.edu.nlu.fit.auction.enums.TransactionDirection;
import vn.edu.nlu.fit.auction.enums.TransactionType;
import vn.edu.nlu.fit.auction.enums.WalletStatus;
import vn.edu.nlu.fit.auction.mapper.Address.AddressMapper;
import vn.edu.nlu.fit.auction.repository.Address.AddressRepository;
import vn.edu.nlu.fit.auction.repository.Order.OrderRepository;
import vn.edu.nlu.fit.auction.repository.Order.PaymentRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletHoldRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletRepository;
import vn.edu.nlu.fit.auction.repository.Wallet.WalletTransactionRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final SecurityUtil securityUtil;
    private final OrderRepository orderRepository;
    private final WalletRepository walletRepository;
    private final WalletHoldRepository walletHoldRepository;
    private final PaymentRepository paymentRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    // Chức năng thanh toán hoá đơn bằng wallet
    @Transactional
    public void payOrder(PaymentRequest request) {
        // Lấy user từ jwt
        User currentUser =securityUtil.getCurrentUser();
        if (currentUser == null) {throw new RuntimeException("Unauthorized");}
        // kiểm tra đơn hàng có tồn tại 
        Order order = orderRepository.findById(request.getOrderId()).orElseThrow(() ->
                        new RuntimeException("Order không tìm thấy"));
        // Kiểm tra người thắng và người thanh toán
        if (!order.getWinner().getUserId().equals(currentUser.getUserId())) {
            throw new RuntimeException("winner và user không giống nhau");
        }
        // Kiểm tra đơn hàng có trạng thái CART
        if (order.getOrderStatus()!= OrderStatus.CART) {
            throw new RuntimeException("Order không thể thanh toán");
        }
        // Kiểm tra đơn hàng còn trong thời gian thanh toán không
        LocalDateTime expiredTime =order.getCreatedAt().plusDays(2);
        if (LocalDateTime.now().isAfter(expiredTime)) {
            throw new RuntimeException("Order đã quá hạn thanh toán");
        }
        // kiểm tra đơn hàng đã từng được thanh toán chưa
        boolean alreadyPaid = paymentRepository.existsByOrderOrderId(order.getOrderId());
        if (alreadyPaid) {
            throw new RuntimeException("Order đã được thanh toán");
        }
        // khoá ví để thực hiện thanh toán
        Wallet wallet = walletRepository.findByUserIdForUpdate(currentUser.getUserId()).orElseThrow(() ->
                                new RuntimeException("Wallet không tìm thấy"));
        // Kiểm tra trạng thái ví
        if (wallet.getWalletStatus()!= WalletStatus.ACTIVE) {
            throw new RuntimeException("Wallet đã bị khoá");
        }
        // Lấy WalletHold của auction
        WalletHold hold = walletHoldRepository.findByAuctionIdAndUserIdAndHoldStatus(order.getAuction().getAuctionId(), currentUser.getUserId(),HoldStatus.HOLDING).orElseThrow(() ->
                                new RuntimeException("Deposit không tìm thấy"));
        // Tổng phí thanh toán và dịch vụ
        BigDecimal subtotal = order.getTotalAmount();
        BigDecimal fee = subtotal.multiply(new BigDecimal("0.01"));
        BigDecimal shippingFee = new BigDecimal("250000");
        BigDecimal paymentAmount = subtotal.add(fee).add(shippingFee);
        BigDecimal deposit = hold.getAmount();
        // Số tiền cần trừ thêm từ balance (trừ đi phần deposit đã freeze)
        BigDecimal remainingToPay = paymentAmount.subtract(deposit);
        // Kiểm tra số dư khả dụng (balance - frozenBalance) >= remainingToPay
        BigDecimal available = wallet.getBalance().subtract(wallet.getFrozenBalance());
        if (available.compareTo(remainingToPay) < 0) {
            throw new RuntimeException("Không đủ balance");
        }
        // Trừ tiền vào wallet: trừ toàn bộ paymentAmount từ balance
        // (bao gồm deposit đã freeze + phần còn lại từ available)
        wallet.setBalance(wallet.getBalance().subtract(paymentAmount));
        // Giải phóng frozen deposit (đã được tính vào paymentAmount ở trên)
        wallet.setFrozenBalance(wallet.getFrozenBalance().subtract(deposit));
        walletRepository.save(wallet);
        // Tạo Payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(paymentAmount);
        payment.setMethod(PaymentMethod.WALLET);
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);
        // Tạo WalletTransaction
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setUserId(currentUser.getUserId());
        transaction.setAmount(paymentAmount);
        transaction.setDirection(TransactionDirection.OUT);
        transaction.setTransactionType(TransactionType.PAYMENT);
        transaction.setReferenceId(order.getOrderId());
        transaction.setCreatedAt(LocalDateTime.now());
        walletTransactionRepository.save(transaction);
        // Tạo Address
        Address address = addressMapper.toAddress(request);
        addressRepository.save(address);
        // Update Order
        order.setAddress(address);
        order.setOrderStatus(OrderStatus.SHIPPING);
        orderRepository.save(order);
        // Giải phóng hold
        hold.setHoldStatus(HoldStatus.RELEASED);
        hold.setReleasedAt(LocalDateTime.now());
        walletHoldRepository.save(hold);
    }
    
}
