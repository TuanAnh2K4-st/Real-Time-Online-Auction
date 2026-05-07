package vn.edu.nlu.fit.auction.dto.request.Order;

import lombok.Data;

@Data
public class PaymentRequest {
    private Integer orderId;
    private String method;

    // Address
    private String street;
    private Integer wardId;
    private Integer provinceId;
}
