package vn.edu.nlu.fit.auction.repository.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.nlu.fit.auction.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    
    boolean existsByOrderOrderId(Integer orderId);

}
