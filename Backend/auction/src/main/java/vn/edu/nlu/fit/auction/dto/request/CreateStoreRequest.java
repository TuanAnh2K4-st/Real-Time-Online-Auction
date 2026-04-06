package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;

@Data
public class CreateStoreRequest {

    private String storeName;      
    private Integer storeStatus;

    // address info
    private AddressRequest address; 

}
