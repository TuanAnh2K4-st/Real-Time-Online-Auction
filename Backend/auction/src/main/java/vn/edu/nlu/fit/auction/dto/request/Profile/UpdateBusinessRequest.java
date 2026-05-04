package vn.edu.nlu.fit.auction.dto.request.Profile;

import lombok.Data;

@Data
public class UpdateBusinessRequest {
    
    private String businessName;
    private String taxCode;
    private String bio;
    
}
