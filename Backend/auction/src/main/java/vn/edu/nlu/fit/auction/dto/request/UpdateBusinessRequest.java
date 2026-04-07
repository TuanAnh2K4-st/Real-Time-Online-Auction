package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;

@Data
public class UpdateBusinessRequest {
    
    private String businessName;
    private String taxCode;
    private String bio;

    private String street;
    private Integer provinceId;
    private Integer wardId;
    
}
