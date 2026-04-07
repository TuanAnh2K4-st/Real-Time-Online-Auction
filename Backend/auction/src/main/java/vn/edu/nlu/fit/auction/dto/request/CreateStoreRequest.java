package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;

@Data
public class CreateStoreRequest {

    private String storeName;

    // address info
    private CreateAddressRequest address; 

}
