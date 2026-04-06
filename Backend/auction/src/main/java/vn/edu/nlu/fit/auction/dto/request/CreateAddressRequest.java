package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;

@Data
public class CreateAddressRequest {

    private String street;
    private Integer provinceId;
    private Integer wardId;

}
