package vn.edu.nlu.fit.auction.dto.response;

import lombok.Data;

@Data
public class BusinessResponse {
    
    private Integer businessId;
    private String businessName;
    private String taxCode;
    private String bio;

    private String logoUrl;

    private String street;
    private String provinceName;
    private String wardName;
    
}
