package vn.edu.nlu.fit.auction.dto.request.Address;

import lombok.Data;

@Data
public class AddressRequest {

    private String street;
    private Integer provinceId;
    private Integer wardId;
    
}
