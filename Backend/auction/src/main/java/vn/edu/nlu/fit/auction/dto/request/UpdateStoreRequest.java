package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;
import vn.edu.nlu.fit.auction.enums.StoreStatus;

@Data
public class UpdateStoreRequest {
    
    private String storeName;
    private StoreStatus storeStatus;

}
