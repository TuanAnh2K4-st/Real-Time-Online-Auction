package vn.edu.nlu.fit.auction.dto.response;

import lombok.Data;
import vn.edu.nlu.fit.auction.enums.StoreStatus;

@Data
public class StoreResponse {

    private Integer storeId;
    private String storeName;
    private StoreStatus storeStatus;
    
    private String street;
    private String provinceName;
    private String wardName;
    
}
